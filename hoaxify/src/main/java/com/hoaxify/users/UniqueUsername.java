package com.hoaxify.users;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import javax.validation.Constraint;
import javax.validation.Payload;

@Constraint(validatedBy = UniqueUsernameValidator.class)
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)

public @interface UniqueUsername {
	String message() default "{hoaxify.user.contraints.username.Unique.message}"; 
	
	Class<?>[] groups() default { }; 
	
	Class<? extends Payload>[] payload() default {}; 
}
