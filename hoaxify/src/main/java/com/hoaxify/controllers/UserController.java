package com.hoaxify.controllers;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.hoaxify.entities.User;
import com.hoaxify.error.ApiError;
import com.hoaxify.exceptions.UserNotValidException;
import com.hoaxify.services.UserService;
import com.hoaxify.shared.GenericResponse;

@RestController
public class UserController {

	@Autowired
	UserService userService; 

//	Remove @Null in user to use this.@Null and @Valid replaces this way
//	of responding with exceptions. 
	
//	@PostMapping(path = "/api/1.0/users")
//	public GenericResponse createUser(@RequestBody User user) throws UserNotValidException {
//		
//		if(user.getDisplayName() == null) {
//			throw new UserNotValidException("User Displayname is missing");
//		}
//		if(user.getUserName() == null) {
//			throw new UserNotValidException("User Username is missing");
//		}
//		if(user.getPassword() == null) {
//			throw new UserNotValidException("User password is missing");
//		}
//		
//		userService.save(user);
//		
//		return new GenericResponse("User saved");
//	}

	@PostMapping(path = "/api/1.0/users")
	public GenericResponse createUser(@Valid @RequestBody User user) {
		
		userService.save(user);
		
		return new GenericResponse("User saved");
	}
	
	@ExceptionHandler({MethodArgumentNotValidException.class})
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	ApiError handleValidationException(MethodArgumentNotValidException exception, HttpServletRequest request) {
		ApiError apiError = new ApiError(400, "Validation Error", request.getServletPath()); 
		
		BindingResult result = exception.getBindingResult(); 
		
		Map<String, String> validationErrors = new HashMap<>(); 
		
		for(FieldError fieldError : result.getFieldErrors()) {
			validationErrors.put(fieldError.getField(), fieldError.getDefaultMessage());
		}
		
		apiError.setValidationErrors(validationErrors);
		
		return apiError; 
	}
	
	
}