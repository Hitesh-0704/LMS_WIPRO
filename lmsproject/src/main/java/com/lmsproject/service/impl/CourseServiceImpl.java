package com.lmsproject.service.impl;

import com.lmsproject.exception.CourseNotFoundException;
import com.lmsproject.model.Course;
import com.lmsproject.repository.CourseRepository;
import com.lmsproject.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;

    @Override
    public Course addCourse(Course course) {
        return courseRepository.save(course);
    }

    @Override
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }


    @Override
    public Course getCourseById(Long id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new CourseNotFoundException(
                        "Course not found with id: " + id));
    }


    @Override
    public Course updateCourse(Long id, Course course) {
        Course existing = getCourseById(id);
        existing.setTitle(course.getTitle());
        existing.setDescription(course.getDescription());
        existing.setDuration(course.getDuration());
        existing.setYoutubeId(course.getYoutubeId());
        existing.setCategory(course.getCategory());
        return courseRepository.save(existing);
    }

    @Override
    public void deleteCourse(Long id) {
        Course existing = getCourseById(id);
        courseRepository.delete(existing);
    }

    @Override
    public Optional<Course> findByTitle(String title) {
        return courseRepository.findByTitle(title);
    }

    @Override
    public List<Course> searchByTitle(String keyword) {
        return courseRepository.findByTitleContainingIgnoreCase(keyword);
    }
}
