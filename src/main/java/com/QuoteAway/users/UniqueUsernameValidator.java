package com.QuoteAway.users;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import org.springframework.beans.factory.annotation.Autowired;

public class UniqueUsernameValidator implements ConstraintValidator<UniqueUsername, String>{
	
	@Autowired 
	UserRepository userRepository; 
	
	@Override
	public boolean isValid(String value, ConstraintValidatorContext context) {
		QuoteAwayUser inDB = userRepository.findByUsername(value);
		
		if(inDB == null) return true; 
		
		else return false; 
	}
}
