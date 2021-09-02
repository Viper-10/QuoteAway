package com.hoaxify.error;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.error.ErrorAttributeOptions;
import org.springframework.boot.web.error.ErrorAttributeOptions.Include;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.boot.web.servlet.error.ErrorAttributes;
import org.springframework.web.context.request.WebRequest;

@RestController
public class ErrorHandler implements ErrorController {
	
	@Autowired
	private ErrorAttributes errorAttributes; 
	
	@RequestMapping("/error")
	public ApiError handleError(WebRequest webRequest) {
		Map<String, Object> errors = errorAttributes.getErrorAttributes(webRequest, ErrorAttributeOptions.of(Include.MESSAGE));
		
		String message = (String) errors.get("message"); 
		String url = (String) errors.get("path"); 
		int status = (Integer) errors.get("status"); 
		
		return new ApiError(status, message, url); 
	}
	
	@Override
	public String getErrorPath() {
		return "/error";
	}

}
