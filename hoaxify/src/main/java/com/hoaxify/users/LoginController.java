package com.hoaxify.users;

import java.nio.file.AccessDeniedException;
import java.util.Collections;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.hoaxify.error.ApiError;
import com.hoaxify.shared.CurrentUser;

@RestController
public class LoginController {
	
	@PostMapping("/api/1.0/login")
	public Map<String, Object> handleLogin(@CurrentUser User loggedInUser) {
		return Collections.singletonMap("id", loggedInUser.getId());
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
