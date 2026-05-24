package com.lmsproject.controller;

import com.lmsproject.model.Course;
import com.lmsproject.model.Enrollment;
import com.lmsproject.model.Student;
import com.lmsproject.model.User;
import com.lmsproject.repository.CourseRepository;
import com.lmsproject.repository.EnrollmentRepository;
import com.lmsproject.repository.StudentRepository;
import com.lmsproject.repository.UserRepository;
import com.lmsproject.service.CourseService;
import com.lmsproject.service.StudentService;
import com.lmsproject.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import com.lmsproject.model.ContactMessage;
import com.lmsproject.repository.ContactMessageRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final StudentService       studentService;
    private final CourseService        courseService;
    private final UserService          userService;
    private final CourseRepository     courseRepository;
    private final StudentRepository    studentRepository;
    private final UserRepository       userRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final PasswordEncoder      passwordEncoder;
    private final ContactMessageRepository contactMessageRepository;

    // ── Dashboard ─────────────────────────────────────────────────────────────

    @GetMapping("/dashboard")
    public String dashboard(Model model) {
        model.addAttribute("studentCount",    studentService.getAllStudents().size());
        model.addAttribute("courseCount",     courseService.getAllCourses().size());
        model.addAttribute("userCount",       userService.getAllUsers().size());
        model.addAttribute("messageCount", contactMessageRepository.countByReadFalse());
        model.addAttribute("completedCourses", enrollmentRepository.countByCompletedTrue());
        return "admin-dashboard";
    }

    // ── Courses ───────────────────────────────────────────────────────────────

    @GetMapping("/courses")
    public String manageCourses(Model model) {
        model.addAttribute("courses",   courseService.getAllCourses());
        model.addAttribute("newCourse", new Course());   // ← ADD THIS
        return "courses";
    }

    @PostMapping("/courses/add")
    public String addCourse(@ModelAttribute Course course,
                            RedirectAttributes redirectAttrs) {
        courseRepository.save(course);
        redirectAttrs.addFlashAttribute("successMessage", "Course added successfully!");
        return "redirect:/admin/courses";
    }

    @GetMapping("/courses/edit/{id}")
    public String editCourseForm(@PathVariable Long id, Model model) {
        model.addAttribute("course", courseService.getCourseById(id));
        return "admin-course-edit";
    }

    @PostMapping("/courses/edit/{id}")
    public String editCourse(@PathVariable Long id,
                             @ModelAttribute Course course,
                             RedirectAttributes redirectAttrs) {
        Course existing = courseService.getCourseById(id);
        existing.setTitle(course.getTitle());
        existing.setDescription(course.getDescription());
        existing.setDuration(course.getDuration());
        existing.setYoutubeId(course.getYoutubeId());
        existing.setCategory(course.getCategory());
        courseRepository.save(existing);
        redirectAttrs.addFlashAttribute("successMessage", "Course updated!");
        return "redirect:/admin/courses";
    }

    @PostMapping("/courses/delete/{id}")
    public String deleteCourse(@PathVariable Long id,
                               RedirectAttributes redirectAttrs) {
        courseRepository.deleteById(id);
        redirectAttrs.addFlashAttribute("successMessage", "Course deleted!");
        return "redirect:/admin/courses";
    }

    // ── Students ──────────────────────────────────────────────────────────────

    @GetMapping("/students")
    public String manageStudents(Model model) {
        List<Student> students = studentService.getAllStudents();

        Map<Long, List<EnrollmentView>> enrollmentMap = new HashMap<>();
        for (Student s : students) {
            List<EnrollmentView> views = enrollmentRepository
                    .findByStudentId(s.getId())
                    .stream()
                    .map(e -> new EnrollmentView(
                            e.getId(),
                            e.getCourse().getTitle(),
                            e.isCompleted()))
                    .toList();
            enrollmentMap.put(s.getId(), views);
        }

        model.addAttribute("students",      students);
        model.addAttribute("enrollmentMap", enrollmentMap);
        model.addAttribute("allCourses",    courseRepository.findAll());
        return "students";
    }

    @PostMapping("/students/edit")
    public String editStudent(
            @RequestParam Long   studentId,
            @RequestParam String name,
            @RequestParam String email,
            @RequestParam(required = false) String newPassword,
            @RequestParam(required = false) Long   removeEnrollmentId,
            @RequestParam(required = false) Long   newCourseId,
            RedirectAttributes redirectAttrs) {

        try {
            Student student = studentRepository.findById(studentId)
                    .orElseThrow(() -> new RuntimeException("Student not found"));

            // Update name
            if (name != null && !name.isBlank()) {
                student.setName(name);
            }

            // Update email + linked User username
            if (email != null && !email.isBlank()
                    && !email.equals(student.getEmail())) {

                if (userRepository.existsByUsername(email)) {
                    redirectAttrs.addFlashAttribute("errorMessage",
                            "Email already in use by another account");
                    return "redirect:/admin/students";
                }

                // update User record using OLD email
                userRepository.findByUsername(student.getEmail()).ifPresent(u -> {
                    u.setUsername(email);
                    userRepository.save(u);
                });
                student.setEmail(email);
            }

            studentRepository.save(student);

            // Reset password
            if (newPassword != null && !newPassword.isBlank()) {
                userRepository.findByUsername(student.getEmail()).ifPresent(u -> {
                    u.setPassword(passwordEncoder.encode(newPassword));
                    userRepository.save(u);
                });
            }

            // Remove enrollment
            if (removeEnrollmentId != null) {
                enrollmentRepository.deleteById(removeEnrollmentId);
            }

            // Add new enrollment
            if (newCourseId != null) {
                boolean exists = enrollmentRepository
                        .existsByStudentIdAndCourseId(student.getId(), newCourseId);
                if (!exists) {
                    Enrollment e = new Enrollment();
                    e.setStudent(student);
                    e.setCourse(courseRepository.findById(newCourseId)
                            .orElseThrow());
                    e.setStudentName(student.getName() != null
                            ? student.getName() : "");
                    enrollmentRepository.save(e);
                }
            }

            redirectAttrs.addFlashAttribute("successMessage",
                    "Student updated successfully!");

        } catch (Exception ex) {
            redirectAttrs.addFlashAttribute("errorMessage",
                    "Update failed: " + ex.getMessage());
        }

        return "redirect:/admin/students";
    }

    // ── Users ─────────────────────────────────────────────────────────────────

    @GetMapping("/users")
    public String manageUsers(Model model) {
        model.addAttribute("users", userService.getAllUsers());
        return "users";
    }

    // ── Messages (Contact) ────────────────────────────────────────────────────

    @GetMapping("/messages")
    public String manageMessages(Model model) {
        List<ContactMessage> messages = contactMessageRepository.findAllByOrderByCreatedAtDesc();
        long unreadCount = messages.stream().filter(m -> !m.isRead()).count();
        model.addAttribute("messages",    messages);
        model.addAttribute("unreadCount", unreadCount);
        return "admin-messages";
    }

    @GetMapping("/messages/{id}/read")
    public String markRead(@PathVariable Long id, RedirectAttributes redirectAttrs) {
        contactMessageRepository.findById(id).ifPresent(m -> {
            m.setRead(true);
            contactMessageRepository.save(m);
        });
        return "redirect:/admin/messages";
    }

    @GetMapping("/messages/{id}/delete")
    public String deleteMessage(@PathVariable Long id, RedirectAttributes redirectAttrs) {
        contactMessageRepository.deleteById(id);
        redirectAttrs.addFlashAttribute("successMessage", "Message deleted.");
        return "redirect:/admin/messages";
    }

    // ── Inner record for Thymeleaf template ───────────────────────────────────

    public record EnrollmentView(
            Long    enrollmentId,
            String  courseTitle,
            boolean completed) {}
}