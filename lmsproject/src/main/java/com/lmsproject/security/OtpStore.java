package com.lmsproject.security;

import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class OtpStore {

    private record OtpEntry(String otp, LocalDateTime expiry) {}

    private final Map<String, OtpEntry> store = new ConcurrentHashMap<>();

    public void save(String email, String otp) {
        store.put(email.toLowerCase(),
                new OtpEntry(otp, LocalDateTime.now().plusMinutes(10)));
    }

    public boolean verify(String email, String otp) {
        OtpEntry entry = store.get(email.toLowerCase());
        if (entry == null) return false;
        if (LocalDateTime.now().isAfter(entry.expiry())) {
            store.remove(email.toLowerCase());
            return false;
        }
        return entry.otp().equals(otp);
    }

    public void remove(String email) {
        store.remove(email.toLowerCase());
    }
}