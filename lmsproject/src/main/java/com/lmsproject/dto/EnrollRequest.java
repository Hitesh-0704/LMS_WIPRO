package com.lmsproject.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class EnrollRequest {
    private Long   courseId;
    private String studentName;
    private String phone;
}