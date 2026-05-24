package com.lmsproject.controller;

import com.lmsproject.model.Student;
import com.lmsproject.security.CustomUserDetails;
import com.lmsproject.service.CourseService;
import com.lmsproject.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {

    private final StudentService studentService;
    private final CourseService  courseService;

    @GetMapping("/dashboard")
    public String dashboard(
            @AuthenticationPrincipal CustomUserDetails principal,
            Model model) {

        Long userId = principal.getUser().getId();

        try {
            // Registered students have a linked Student profile
            Student student = studentService.findByUserId(userId);
            model.addAttribute("student", student);
            model.addAttribute("enrolledCourses", student.getCourses());
        } catch (Exception e) {
            // Seeded "user" account has no student profile — show all courses
            model.addAttribute("student", null);
            model.addAttribute("courses", courseService.getAllCourses());
        }

        return "user-dashboard";
    }
}
