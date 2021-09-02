package com.hoaxify.users;

import java.nio.file.AccessDeniedException;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.hoaxify.error.ApiError;

@Controller
public class LoginController {
	
	@PostMapping("/api/1.0/login")
	public void handleLogin() {
		
	}
	
	
	/* Spring security handles the accessdenied exception internally. So long before the api call reaches the controller, 
	 * the accessdenied exception is handled. 
	 */
//	@ExceptionHandler({AccessDeniedException.class})
//	@ResponseStatus(HttpStatus.UNAUTHORIZED)
//	ApiError handleAccessDeniedException() {
//		return new ApiError(401, "Access error", "/api/1.0/login");
//	} 
	
}
