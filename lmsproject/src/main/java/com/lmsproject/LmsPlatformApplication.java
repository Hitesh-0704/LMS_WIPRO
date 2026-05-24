package com.lmsproject;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync   // ← ADD THIS so emails send in background
public class LmsPlatformApplication {
    public static void main(String[] args) {
        SpringApplication.run(LmsPlatformApplication.class, args);
    }
}