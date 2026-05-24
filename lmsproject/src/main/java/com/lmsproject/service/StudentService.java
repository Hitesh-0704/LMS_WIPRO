package com.lmsproject.service;

import com.lmsproject.model.Student;

import java.util.List;

public interface StudentService {

    Student addStudent(Student student);

    // Self-registration: creates User + Student together
    Student registerStudent(Student student, String rawPassword);  // ← NEW

    List<Student> getAllStudents();

    Student getStudentById(Long id);

    Student updateStudent(Long id, Student student);

    void deleteStudent(Long id);

    Student assignCourse(Long studentId, Long courseId);

    // Fetch the student profile that belongs to a logged-in User
    Student findByUserId(Long userId);  // ← NEW
}