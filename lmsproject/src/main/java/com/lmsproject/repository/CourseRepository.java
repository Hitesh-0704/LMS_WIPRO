package com.lmsproject.repository;

import com.lmsproject.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    Optional<Course> findByTitle(String title);

    boolean existsByTitle(String title);

    List<Course> findByTitleContainingIgnoreCase(String keyword);
}
