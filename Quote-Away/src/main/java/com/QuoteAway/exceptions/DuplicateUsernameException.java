package com.QuoteAway.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class DuplicateUsernameException extends RuntimeException{
	String message; 

	public DuplicateUsernameException(){
		
	}
	
	public DuplicateUsernameException(String message){
		super(message); 
	}
}
