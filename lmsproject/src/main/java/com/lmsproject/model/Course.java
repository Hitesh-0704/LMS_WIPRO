package com.lmsproject.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "courses")
@Getter
@Setter
public class Course extends BaseEntity {

    @NotBlank(message = "Course title is required")
    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT") // ✅ Reconfigures storage to accept long descriptions gracefully
    private String description;

    private String duration;

    private String youtubeId;

    private String category;

    @ManyToMany(mappedBy = "courses", fetch = FetchType.EAGER)
    private Set<Student> students = new HashSet<>();
}