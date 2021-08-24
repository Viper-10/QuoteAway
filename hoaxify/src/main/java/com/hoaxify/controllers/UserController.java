package com.hoaxify.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.hoaxify.entities.User;
import com.hoaxify.services.UserService;
import com.hoaxify.shared.GenericResponse;

@RestController
public class UserController {

	@Autowired
	UserService userService; 

	@PostMapping(path = "/api/1.0/users")
	public GenericResponse createUser(@RequestBody User user) {
		userService.save(user);
		
		return new GenericResponse("User saved");
	}
	
}