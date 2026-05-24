package com.lmsproject.api;

import com.lmsproject.dto.EnrollRequest;
import com.lmsproject.model.Course;
import com.lmsproject.model.Enrollment;
import com.lmsproject.model.Student;
import com.lmsproject.repository.EnrollmentRepository;
import com.lmsproject.repository.StudentRepository;
import com.lmsproject.security.CustomUserDetails;
import com.lmsproject.service.CourseService;
import com.lmsproject.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/enrollments")
@RequiredArgsConstructor
public class EnrollmentApiController {

    private final EnrollmentRepository enrollmentRepository;
    private final StudentRepository    studentRepository;
    private final StudentService       studentService;
    private final CourseService        courseService;

    // ─── Get my enrollments ───────────────────────────────────────────────────

    @GetMapping("/my")
    public ResponseEntity<?> getMyEnrollments(
            @AuthenticationPrincipal CustomUserDetails principal) {

        Long userId = principal.getUser().getId();

        Optional<Student> studentOpt = studentRepository.findByUserId(userId);
        if (studentOpt.isEmpty()) {
            return ResponseEntity.ok(new ArrayList<>());
        }

        Student student = studentOpt.get();

        List<Map<String, Object>> result = new ArrayList<>();

        for (Enrollment e : enrollmentRepository.findByStudentId(student.getId())) {
            Map<String, Object> map = new HashMap<>();
            map.put("id",            e.getId());
            map.put("courseId",      e.getCourse().getId());
            map.put("title",         e.getCourse().getTitle());
            map.put("duration",      e.getCourse().getDuration()    != null ? e.getCourse().getDuration()    : "");
            map.put("youtubeId",     e.getCourse().getYoutubeId()   != null ? e.getCourse().getYoutubeId()   : "");
            map.put("studentName",   e.getStudentName()             != null ? e.getStudentName()             : student.getName());
            map.put("phone",         e.getPhone()                   != null ? e.getPhone()                   : "");
            map.put("email",         student.getEmail());
            map.put("completed",     e.isCompleted());
            map.put("completedDate", e.getCompletedDate()           != null ? e.getCompletedDate()           : "");
            result.add(map);
        }

        return ResponseEntity.ok(result);
    }

    // ─── Enroll ───────────────────────────────────────────────────────────────

    @PostMapping
    public ResponseEntity<?> enroll(
            @RequestBody EnrollRequest request,
            @AuthenticationPrincipal CustomUserDetails principal) {

        Long userId = principal.getUser().getId();

        Student student = studentRepository.findByUserId(userId).orElseGet(() -> {
            Student s = new Student();
            s.setName(principal.getUser().getUsername().split("@")[0]);
            s.setEmail(principal.getUser().getUsername());
            s.setUser(principal.getUser());
            return studentRepository.save(s);
        });

        if (enrollmentRepository.existsByStudentIdAndCourseId(
                student.getId(), request.getCourseId())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Already enrolled in this course"));
        }

        Course course = courseService.getCourseById(request.getCourseId());

        Enrollment enrollment = new Enrollment();
        enrollment.setStudent(student);
        enrollment.setCourse(course);
        enrollment.setStudentName(request.getStudentName());
        enrollment.setPhone(request.getPhone());

        enrollmentRepository.save(enrollment);

        return ResponseEntity.ok(Map.of("message", "Enrolled successfully"));
    }

    // ─── Mark Complete ────────────────────────────────────────────────────────

    @PutMapping("/{id}/complete")
    public ResponseEntity<?> markComplete(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails principal) {

        Enrollment enrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));

        enrollment.setCompleted(true);
        enrollment.setCompletedDate(
                java.time.LocalDate.now()
                        .format(java.time.format.DateTimeFormatter
                                .ofPattern("dd/MM/yyyy")));

        enrollmentRepository.save(enrollment);

        return ResponseEntity.ok(Map.of("message", "Marked as complete"));
    }


    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/by-student/{studentId}")
    public ResponseEntity<?> enrollmentsByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(
                enrollmentRepository.findByStudentId(studentId)
                        .stream()
                        .map(e -> Map.of(
                                "enrollmentId", e.getId(),
                                "title",        e.getCourse().getTitle(),
                                "completed",    e.isCompleted()))
                        .toList()
        );
    }

    // ─── Unenroll ─────────────────────────────────────────────────────────────

    @DeleteMapping("/{id}")
    public ResponseEntity<?> unenroll(@PathVariable Long id) {
        enrollmentRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Unenrolled successfully"));
    }
}