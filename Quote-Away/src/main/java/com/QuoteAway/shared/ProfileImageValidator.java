package com.QuoteAway.shared;

import java.util.Base64;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import org.springframework.beans.factory.annotation.Autowired;

import com.QuoteAway.File.FileService;

public class ProfileImageValidator implements ConstraintValidator<ProfileImage, String>{
	
	@Autowired
	FileService fileService; 

	@Override
	public boolean isValid(String value, ConstraintValidatorContext context) {
		// we'll accept when no file is included since display name could alone be the change in profile. 
		if(value == null) return true; 
		
		byte [] decodedBytes = Base64.getDecoder().decode(value);
		
		String fileType = fileService.detectType(decodedBytes); 
		
		if(fileType.equalsIgnoreCase("image/png") || fileType.equalsIgnoreCase("image/jpeg")) {
			return true; 
		}
		
		return false; 
	}
	
	
}
