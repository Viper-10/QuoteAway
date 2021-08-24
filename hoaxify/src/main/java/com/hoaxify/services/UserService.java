package com.hoaxify.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.hoaxify.entities.User;
import com.hoaxify.repositories.UserRepository;

@Service
public class UserService {
	
	UserRepository userRepository; 
	
	// @Autowired not working here. 
	BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
	
	UserService(UserRepository userRepository){
		this.userRepository = userRepository; 
	}
	
	public User save(User user) {
		user.setPassword(passwordEncoder.encode(user.getPassword()));
		return userRepository.save(user);
	
	}

}
