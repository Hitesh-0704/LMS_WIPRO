package com.lmsproject.api;

import com.lmsproject.dto.CourseDTO;
import com.lmsproject.model.Course;
import com.lmsproject.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseApiController {

    private final CourseService courseService;

    @GetMapping
    public ResponseEntity<List<CourseDTO>> getAllCourses() {
        List<CourseDTO> courses = courseService.getAllCourses()
                .stream()
                .map(c -> new CourseDTO(
                        c.getId(),
                        c.getTitle(),
                        c.getDescription(),
                        c.getDuration(),
                        c.getYoutubeId(),
                        c.getCategory()))
                .toList();

        return ResponseEntity.ok(courses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseDTO> getCourse(@PathVariable Long id) {
        Course c = courseService.getCourseById(id);
        return ResponseEntity.ok(new CourseDTO(
                c.getId(), c.getTitle(), c.getDescription(),
                c.getDuration(), c.getYoutubeId(), c.getCategory()));
    }
}