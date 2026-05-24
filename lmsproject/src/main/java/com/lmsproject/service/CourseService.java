package com.lmsproject.service;

import com.lmsproject.model.Course;

import java.util.List;
import java.util.Optional;

public interface CourseService {

    Course addCourse(Course course);

    List<Course> getAllCourses();

    Course getCourseById(Long id);

    Course updateCourse(Long id, Course course);

    void deleteCourse(Long id);

    Optional<Course> findByTitle(String title);

    List<Course> searchByTitle(String keyword);
}
