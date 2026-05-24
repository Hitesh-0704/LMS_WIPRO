package com.lmsproject.service;

import com.lmsproject.model.User;

import java.util.List;
import java.util.Optional;

public interface UserService {

    User saveUser(User user);

    List<User> getAllUsers();

    Optional<User> findByUsername(String username);

    boolean existsByUsername(String username);
}
