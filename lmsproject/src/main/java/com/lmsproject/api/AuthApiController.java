package com.lmsproject.api;

import com.lmsproject.dto.*;
import com.lmsproject.model.Role;
import com.lmsproject.model.Student;
import com.lmsproject.model.User;
import com.lmsproject.repository.StudentRepository;
import com.lmsproject.repository.UserRepository;
import com.lmsproject.security.CustomUserDetails;
import com.lmsproject.security.JwtUtil;
import com.lmsproject.security.OtpStore;
import com.lmsproject.service.EmailService;
import com.lmsproject.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthApiController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil                jwtUtil;
    private final StudentService         studentService;
    private final UserRepository         userRepository;
    private final OtpStore               otpStore;
    private final EmailService           emailService;
    private final PasswordEncoder        passwordEncoder;

    // ── Login ─────────────────────────────────────────────────────────────────

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(), request.getPassword()));

            UserDetails ud = (UserDetails) auth.getPrincipal();
            String role  = ud.getAuthorities().iterator()
                    .next().getAuthority().replace("ROLE_", "");
            String token = jwtUtil.generateToken(ud.getUsername(), role);

            return ResponseEntity.ok(
                    new LoginResponse(token, role, ud.getUsername()));

        } catch (Exception e) {
            return ResponseEntity.status(401)
                    .body(Map.of("error", "Invalid username or password"));
        }
    }

    // ── Register ──────────────────────────────────────────────────────────────

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (userRepository.existsByUsername(request.getEmail())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Email already registered"));
        }

        Student student = new Student();
        student.setName(request.getName());
        student.setEmail(request.getEmail());
        studentService.registerStudent(student, request.getPassword());

        return ResponseEntity.ok(Map.of("message", "Registered successfully"));
    }

    // ── Forgot Password — send OTP ────────────────────────────────────────────

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(
            @RequestBody ForgotPasswordRequest request) {

        // Same response whether email exists or not (security best practice)
        userRepository.findByUsername(request.getEmail()).ifPresent(user -> {
            String otp = String.valueOf((int)(Math.random() * 900000) + 100000);
            otpStore.save(request.getEmail(), otp);
            emailService.sendOtpEmail(request.getEmail(), otp);
        });

        return ResponseEntity.ok(Map.of("message",
                "If that account exists, an OTP has been sent"));
    }

    // ── Reset Password — verify OTP + update password ─────────────────────────

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestBody ResetPasswordRequest request) {

        if (!otpStore.verify(request.getEmail(), request.getOtp())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Invalid or expired OTP"));
        }

        User user = userRepository.findByUsername(request.getEmail())
                .orElse(null);

        if (user == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "User not found"));
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        otpStore.remove(request.getEmail());

        return ResponseEntity.ok(Map.of("message", "Password reset successful"));
    }
}