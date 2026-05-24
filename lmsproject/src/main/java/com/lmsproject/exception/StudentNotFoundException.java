package com.lmsproject.exception;

public class StudentNotFoundException extends RuntimeException {

    public StudentNotFoundException() {
        super("Student not found");
    }

    public StudentNotFoundException(String message) {
        super(message);
    }
}
