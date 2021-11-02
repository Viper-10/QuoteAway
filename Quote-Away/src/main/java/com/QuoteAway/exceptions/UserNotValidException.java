package com.QuoteAway.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class UserNotValidException extends RuntimeException {
	public UserNotValidException(){
		super("User information is not valid"); 
	}
	
	public UserNotValidException(String message){
		super(message); 
	}
	
}
