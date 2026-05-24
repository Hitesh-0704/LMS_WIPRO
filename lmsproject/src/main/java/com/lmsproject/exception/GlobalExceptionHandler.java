package com.lmsproject.exception;

import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(CourseNotFoundException.class)
    public String handleCourseNotFound(CourseNotFoundException ex, Model model) {
        model.addAttribute("errorTitle", "Course Not Found");
        model.addAttribute("error", ex.getMessage());
        return "error";
    }

    @ExceptionHandler(StudentNotFoundException.class)
    public String handleStudentNotFound(StudentNotFoundException ex, Model model) {
        model.addAttribute("errorTitle", "Student Not Found");
        model.addAttribute("error", ex.getMessage());
        return "error";
    }

    @ExceptionHandler(UserNotFoundException.class)
    public String handleUserNotFound(UserNotFoundException ex, Model model) {
        model.addAttribute("errorTitle", "User Not Found");
        model.addAttribute("error", ex.getMessage());
        return "error";
    }

    @ExceptionHandler(Exception.class)
    public String handleGenericException(Exception ex, Model model) {
        model.addAttribute("errorTitle", "Unexpected Error");
        model.addAttribute("error", "Something went wrong: " + ex.getMessage());
        return "error";
    }
}
