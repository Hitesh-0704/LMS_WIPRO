package com.lmsproject.api;

import com.lmsproject.dto.AdminEditStudentRequest;
import com.lmsproject.dto.CourseDTO;
import com.lmsproject.model.Course;
import com.lmsproject.model.Enrollment;
import com.lmsproject.model.Student;
import com.lmsproject.repository.*;
import com.lmsproject.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminApiController {

    private final CourseService        courseService;
    private final CourseRepository     courseRepository;
    private final StudentRepository    studentRepository;
    private final UserRepository       userRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final PasswordEncoder      passwordEncoder;

    // ── Dashboard Stats ───────────────────────────────────────────────────────

    @GetMapping("/dashboard")
    public ResponseEntity<?> dashboard() {
        return ResponseEntity.ok(Map.of(
                "totalCourses",     courseRepository.count(),
                "totalStudents",    studentRepository.count(),
                "totalUsers",       userRepository.count(),
                "totalEnrollments", enrollmentRepository.count(),
                "completedCourses", enrollmentRepository.countByCompletedTrue()
        ));
    }

    // ── Courses CRUD ──────────────────────────────────────────────────────────

    @GetMapping("/courses")
    public ResponseEntity<List<CourseDTO>> getCourses() {
        return ResponseEntity.ok(
                courseRepository.findAll().stream()
                        .map(c -> new CourseDTO(c.getId(), c.getTitle(),
                                c.getDescription(), c.getDuration(),
                                c.getYoutubeId(), c.getCategory()))
                        .toList()
        );
    }

    @PostMapping("/courses")
    public ResponseEntity<?> addCourse(@RequestBody CourseDTO dto) {
        Course c = new Course();
        c.setTitle(dto.getTitle());
        c.setDescription(dto.getDescription());
        c.setDuration(dto.getDuration());
        c.setYoutubeId(dto.getYoutubeId());
        c.setCategory(dto.getCategory());
        courseRepository.save(c);
        return ResponseEntity.ok(Map.of("message", "Course added"));
    }

    @PutMapping("/courses/{id}")
    public ResponseEntity<?> updateCourse(@PathVariable Long id,
                                          @RequestBody CourseDTO dto) {
        Course c = courseService.getCourseById(id);
        c.setTitle(dto.getTitle());
        c.setDescription(dto.getDescription());
        c.setDuration(dto.getDuration());
        c.setYoutubeId(dto.getYoutubeId());
        c.setCategory(dto.getCategory());
        courseRepository.save(c);
        return ResponseEntity.ok(Map.of("message", "Course updated"));
    }

    @DeleteMapping("/courses/{id}")
    public ResponseEntity<?> deleteCourse(@PathVariable Long id) {
        courseRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Course deleted"));
    }

    // ── Students ──────────────────────────────────────────────────────────────

    @GetMapping("/students")
    public ResponseEntity<?> getStudents() {
        return ResponseEntity.ok(
                studentRepository.findAll().stream()
                        .map(s -> Map.of(
                                "id",    s.getId(),
                                "name",  s.getName()  != null ? s.getName()  : "",
                                "email", s.getEmail() != null ? s.getEmail() : "",
                                "courses", enrollmentRepository.findByStudentId(s.getId())
                                        .stream()
                                        .map(e -> Map.of(
                                                "enrollmentId", e.getId(),
                                                "title",        e.getCourse().getTitle(),
                                                "completed",    e.isCompleted()))
                                        .toList()
                        ))
                        .toList()
        );
    }

    @PutMapping("/students/{id}")
    public ResponseEntity<?> editStudent(@PathVariable Long id,
                                         @RequestBody AdminEditStudentRequest req) {

        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        // ── Update name ───────────────────────────────────────────────────────
        if (req.getName() != null && !req.getName().isBlank()) {
            student.setName(req.getName());
        }

        // ── Update email + linked User username ───────────────────────────────
        if (req.getEmail() != null && !req.getEmail().isBlank()
                && !req.getEmail().equals(student.getEmail())) {

            if (userRepository.existsByUsername(req.getEmail())) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Email already in use"));
            }

            // update the User record first (using OLD email to find it)
            userRepository.findByUsername(student.getEmail()).ifPresent(u -> {
                u.setUsername(req.getEmail());
                userRepository.save(u);
            });

            student.setEmail(req.getEmail());
        }

        studentRepository.save(student);

        // ── Reset password ────────────────────────────────────────────────────
        if (req.getNewPassword() != null && !req.getNewPassword().isBlank()) {
            userRepository.findByUsername(student.getEmail()).ifPresent(u -> {
                u.setPassword(passwordEncoder.encode(req.getNewPassword()));
                userRepository.save(u);
            });
        }

        // ── Remove enrollment ─────────────────────────────────────────────────
        if (req.getRemoveEnrollmentId() != null) {
            enrollmentRepository.deleteById(req.getRemoveEnrollmentId());
        }

        // ── Add enrollment to new course ──────────────────────────────────────
        if (req.getNewCourseId() != null) {
            boolean alreadyEnrolled = enrollmentRepository
                    .existsByStudentIdAndCourseId(student.getId(), req.getNewCourseId());

            if (!alreadyEnrolled) {
                Enrollment e = new Enrollment();
                e.setStudent(student);
                e.setCourse(courseService.getCourseById(req.getNewCourseId()));
                e.setStudentName(student.getName() != null ? student.getName() : "");
                enrollmentRepository.save(e);
            }
        }

        return ResponseEntity.ok(Map.of("message", "Student updated successfully"));
    }

    // ── Users ─────────────────────────────────────────────────────────────────

    @GetMapping("/users")
    public ResponseEntity<?> getUsers() {
        return ResponseEntity.ok(
                userRepository.findAll().stream()
                        .map(u -> Map.of(
                                "id",       u.getId(),
                                "username", u.getUsername(),
                                "role",     u.getRole().name()
                        ))
                        .toList()
        );
    }
}