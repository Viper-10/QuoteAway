package com.hoaxify.users;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.hoaxify.exceptions.DuplicateUsernameException;

@Service
public class UserService {
	
	UserRepository userRepository; 
	
	// @Autowired not working here. 
	BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
	
	UserService(UserRepository userRepository){
		this.userRepository = userRepository; 
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
