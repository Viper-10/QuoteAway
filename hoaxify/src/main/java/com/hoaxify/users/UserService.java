package com.hoaxify.users;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.hoaxify.exceptions.DuplicateUsernameException;

@Service
public class UserService {
	
	UserRepository userRepository; 

	PasswordEncoder passwordEncoder; 
	
	UserService(UserRepository userRepository, PasswordEncoder passwordEncoder){
		this.userRepository = userRepository; 
		this.passwordEncoder = passwordEncoder; 
	}
	
	public User save(User user) throws DuplicateUsernameException{
//		if(userRepository.findByUserName(user.getUserName()) != null) {
//			throw new DuplicateUsernameException(); 
//		}
//		
		user.setPassword(passwordEncoder.encode(user.getPassword()));
		return userRepository.save(user);
	
	}

}
