package com.lmsproject.repository;

import com.lmsproject.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    Optional<Student> findByEmail(String email);

    boolean existsByEmail(String email);

    // Find all students enrolled in a course by course title
    List<Student> findByCourses_Title(String title);

    // Find the student profile linked to a given User ID
    Optional<Student> findByUserId(Long userId);   // ← NEW
}