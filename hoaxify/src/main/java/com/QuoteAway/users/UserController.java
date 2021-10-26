package com.QuoteAway.users;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.QuoteAway.error.ApiError;
import com.QuoteAway.shared.CurrentUser;
import com.QuoteAway.shared.GenericResponse;
import com.QuoteAway.users.vm.UserUpdateVM;
import com.QuoteAway.users.vm.UserVM;
import com.fasterxml.jackson.annotation.JsonView;

@RestController
@RequestMapping(value = "/api/1.0/users")
public class UserController {

	@Autowired
	UserService userService; 

//	Remove @Null in user to use this.@Null and @Valid replaces this way
//	of responding with exceptions. 
	
//	@PostMapping(path = "/api/1.0/users")
//	public GenericResponse createUser(@RequestBody User user) throws UserNotValidException {
//		
//		if(user.getDisplayName() == null) {
//			throw new UserNotValidException("User Displayname is missing");
//		}
//		if(user.getUserName() == null) {
//			throw new UserNotValidException("User Username is missing");
//		}
//		if(user.getPassword() == null) {
//			throw new UserNotValidException("User password is missing");
//		}
//		
//		userService.save(user);
//		
//		return new GenericResponse("User saved");
//	}

	@PostMapping
	public GenericResponse handleSignUp(@Valid @RequestBody User user) {
		
		userService.save(user);
		return new GenericResponse("User saved");
	}
	
	// in application.yml page default size is set as 10 explicitly. 
	// this is controller way of customizing the page size. 
	
	@GetMapping
	public Page<UserVM> handleGetUsers(@PageableDefault(size = 10)Pageable pageable, @CurrentUser User loggedInUser) {
		return userService.getUsers(loggedInUser, pageable).map((user) -> new UserVM(user));
	}

	@GetMapping(path = "{username}")
	public UserVM handleGetUser(@PathVariable String username) {
		User user = userService.getByUsername(username);
		return new UserVM(user);
	}
	
	@PutMapping("{id:[0-9]+}")
	// preauthorize to check if the logged in user is requesting to edit for his profile or another profile 
	// because he can only edit his profile
	@PreAuthorize("#id == principal.id")
	UserVM updateUser(@PathVariable long id, @RequestBody(required = false)  @Valid UserUpdateVM userUpdate) {
		User updatedUser = userService.update(id, userUpdate); 
		return new UserVM(updatedUser); 
	}
	
	
	
	
}