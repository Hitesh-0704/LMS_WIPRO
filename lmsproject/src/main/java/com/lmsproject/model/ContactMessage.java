package com.lmsproject.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "contact_messages")
@Getter
@Setter
public class ContactMessage extends BaseEntity {

    private String name;
    private String email;
    private String phone;

    @Column(columnDefinition = "TEXT")
    private String message;

    @Column(name = "is_read")
    private boolean read = false;
}