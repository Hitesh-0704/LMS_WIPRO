package com.lmsproject.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter @AllArgsConstructor
public class CourseDTO {
    private Long   id;
    private String title;
    private String description;
    private String duration;
    private String youtubeId;
    private String category;
}