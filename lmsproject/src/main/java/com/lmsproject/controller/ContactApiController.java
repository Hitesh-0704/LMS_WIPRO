package com.lmsproject.controller;

import com.lmsproject.dto.ContactRequest;
import com.lmsproject.model.ContactMessage;
import com.lmsproject.repository.ContactMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactApiController {

    private final ContactMessageRepository contactMessageRepository;

    @PostMapping
    public ResponseEntity<?> submit(@RequestBody ContactRequest request) {
        ContactMessage msg = new ContactMessage();
        msg.setName(request.getName());
        msg.setEmail(request.getEmail());
        msg.setPhone(request.getPhone());
        msg.setMessage(request.getMessage());
        contactMessageRepository.save(msg);
        return ResponseEntity.ok(Map.of("message", "Message sent successfully"));
    }
}