package com.QuoteAway.shared;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import javax.validation.Constraint;
import javax.validation.Payload;

import org.springframework.security.core.annotation.AuthenticationPrincipal;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
@Constraint(validatedBy = ProfileImageValidator.class)
public @interface ProfileImage {
	String message() default "{hoaxify.constraints.image.ProfileImage.message}"; 
	
	Class<?>[] groups() default { }; 
	
	Class<? extends Payload>[] payload() default {}; 
}
