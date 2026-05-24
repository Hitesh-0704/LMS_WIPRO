package com.lmsproject.controller;

import com.lmsproject.model.Student;
import com.lmsproject.repository.StudentRepository;
import com.lmsproject.repository.UserRepository;
import com.lmsproject.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@Controller
@RequiredArgsConstructor
public class AuthController {

    private final StudentService    studentService;
    private final StudentRepository studentRepository;
    private final UserRepository    userRepository;

    // ─── Login ────────────────────────────────────────────────────────────────

    @GetMapping("/login")
    public String loginPage() {
        return "login";
    }

    // ─── Register: show form ──────────────────────────────────────────────────

    @GetMapping("/register")
    public String showRegisterForm(Model model) {
        model.addAttribute("student", new Student());
        return "register";
    }

    // ─── Register: submit ─────────────────────────────────────────────────────

    @PostMapping("/register")
    public String register(
            @Valid @ModelAttribute("student") Student student,
            BindingResult result,
            @RequestParam String password,
            Model model) {

        // Duplicate email check
        if (studentRepository.existsByEmail(student.getEmail())) {
            result.rejectValue("email", "duplicate",
                    "This email is already registered.");
        }

        // Email is reused as username — check User table too
        if (userRepository.existsByUsername(student.getEmail())) {
            result.rejectValue("email", "duplicate",
                    "An account with this email already exists.");
        }

        // Basic password length check
        if (password == null || password.trim().length() < 4) {
            model.addAttribute("passwordError",
                    "Password must be at least 4 characters.");
            return "register";
        }

        if (result.hasErrors()) {
            return "register";
        }

        studentService.registerStudent(student, password);
        return "redirect:/login?registered";
    }
}