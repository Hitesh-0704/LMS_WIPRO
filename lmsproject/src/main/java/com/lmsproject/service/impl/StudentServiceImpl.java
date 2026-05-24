package com.lmsproject.service.impl;

import com.lmsproject.exception.StudentNotFoundException;
import com.lmsproject.model.Course;
import com.lmsproject.model.Role;
import com.lmsproject.model.Student;
import com.lmsproject.model.User;
import com.lmsproject.repository.StudentRepository;
import com.lmsproject.repository.UserRepository;
import com.lmsproject.service.CourseService;
import com.lmsproject.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final UserRepository    userRepository;
    private final CourseService     courseService;
    private final PasswordEncoder   passwordEncoder;

    // ─── Add (admin-side, no login account created) ───────────────────────────

    @Override
    public Student addStudent(Student student) {
        return studentRepository.save(student);
    }

    // ─── Register (student self-registers, login account created) ────────────

    @Override
    @Transactional
    public Student registerStudent(Student student, String rawPassword) {
        // 1. Create the login User (username = email)
        User user = new User();
        user.setUsername(student.getEmail());
        user.setPassword(passwordEncoder.encode(rawPassword));
        user.setRole(Role.USER);
        userRepository.save(user);

        // 2. Link User to Student and persist
        student.setUser(user);
        return studentRepository.save(student);
    }

    // ─── Find by User ID (for user dashboard) ────────────────────────────────

    @Override
    public Student findByUserId(Long userId) {
        return studentRepository.findByUserId(userId)
                .orElseThrow(() -> new StudentNotFoundException(
                        "No student profile found for user id: " + userId));
    }

    // ─── Standard CRUD ────────────────────────────────────────────────────────

    @Override
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    @Override
    public Student getStudentById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new StudentNotFoundException(
                        "Student not found with id: " + id));
    }

    @Override
    @Transactional
    public Student updateStudent(Long id, Student student) {
        Student existing = getStudentById(id);
        existing.setName(student.getName());
        existing.setEmail(student.getEmail());
        return studentRepository.save(existing);
    }

    @Override
    @Transactional
    public void deleteStudent(Long id) {
        Student existing = getStudentById(id);
        studentRepository.delete(existing);
    }

    // ─── Assign Course ────────────────────────────────────────────────────────

    @Override
    @Transactional
    public Student assignCourse(Long studentId, Long courseId) {
        Student student = getStudentById(studentId);
        Course  course  = courseService.getCourseById(courseId);
        student.getCourses().add(course);
        return studentRepository.save(student);
    }
}