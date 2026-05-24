package com.lmsproject.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "enrollments")
@Getter
@Setter
public class Enrollment extends BaseEntity {

    @ManyToOne(fetch = FetchType.EAGER)   // ← changed from LAZY to EAGER
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne(fetch = FetchType.EAGER)   // ← changed from LAZY to EAGER
    @JoinColumn(name = "course_id")
    private Course course;

    private boolean completed = false;

    private String completedDate;

    private String studentName;

    private String phone;
}