package com.lmsproject.controller;

import com.lmsproject.model.Role;
import com.lmsproject.model.User;
import com.lmsproject.model.Student;
import com.lmsproject.repository.UserRepository;
import com.lmsproject.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/seed")
@RequiredArgsConstructor
public class SeedController {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping
    public String seed() {
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ADMIN);
            userRepository.save(admin);
        }

        if (!userRepository.existsByUsername("user@learnhub.com")) {
            User user = new User();
            user.setUsername("user@learnhub.com");
            user.setPassword(passwordEncoder.encode("user123"));
            user.setRole(Role.USER);
            User saved = userRepository.save(user);

            Student s = new Student();
            s.setName("Mugdha");
            s.setEmail("user@learnhub.com");
            s.setUser(saved);
            studentRepository.save(s);
        }

        return "Seeded successfully!";
    }
}