package com.hoaxify.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.hoaxify.entities.User;

@RestController
public class UserController {

	@PostMapping(path = "/api/1.0/users")
	public void createUser(@RequestBody User user) {
		
	}
}