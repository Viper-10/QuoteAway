package com.hoaxify.shared;

import lombok.Data;

@Data
public class GenericResponse {

	String message;
	
	public GenericResponse() {
		
	}

	public GenericResponse(String message) {
		this.message = message;
	} 
}
