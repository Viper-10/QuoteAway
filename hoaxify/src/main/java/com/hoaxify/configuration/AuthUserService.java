package com.hoaxify.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.hoaxify.users.User;
import com.hoaxify.users.UserRepository;

@Service
public class AuthUserService implements UserDetailsService {

	@Autowired
	UserRepository userRepository;
	
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		User user = userRepository.findByUserName(username); 
		
		if(user == null) {
			throw new UsernameNotFoundException("User " + username + " not registered"); 
		}
		
		return user; 
	}
	
	
}