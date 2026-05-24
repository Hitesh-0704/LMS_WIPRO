package com.lmsproject.dto;
import lombok.Getter; import lombok.Setter;

@Getter @Setter
public class AdminEditStudentRequest {
    private String name;
    private String email;       // new email/username
    private String newPassword; // optional — blank = don't change
    private Long   newCourseId; // optional — reassign enrollment
    private Long   removeEnrollmentId; // optional — remove specific enrollment
}