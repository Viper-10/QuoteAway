package com.hoaxify.users;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.hoaxify.File.FileService;
import com.hoaxify.exceptions.DuplicateUsernameException;
import com.hoaxify.exceptions.NotFoundException;
import com.hoaxify.users.vm.UserUpdateVM;

@Service
public class UserService {
	
	UserRepository userRepository; 

	PasswordEncoder passwordEncoder; 
	
	FileService fileService;
	
	UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, FileService fileService){
		this.userRepository = userRepository; 
		this.passwordEncoder = passwordEncoder; 
		this.fileService = fileService; 
	}
	
	public User save(User user) throws DuplicateUsernameException{
//		if(userRepository.findByUserName(user.getUserName()) != null) {
//			throw new DuplicateUsernameException(); 
//		}
//		
		user.setPassword(passwordEncoder.encode(user.getPassword()));
		return userRepository.save(user);
	}

	public Page<User> getUsers(User loggedInUser, Pageable pageable) {
		if(loggedInUser != null) {
			return userRepository.findByUsernameNot(loggedInUser.getUsername(), pageable);
		}
		
		return userRepository.findAll(pageable); 
	}

	public User getByUsername(String username) {
		
		User user = userRepository.findByUsername(username);
		if(user == null) {
			throw new NotFoundException(username + " not found");
		}		
		return user; 
	}

	public User update(long id, UserUpdateVM userUpdate) {
		// we know the user exists for sure, since the user is logged in.  
		// so we don't do findById or user name
		
		User inDB = userRepository.getOne(id); 
		inDB.setDisplayName(userUpdate.getDisplayName());
		
		String savedImageName;
		
		if(userUpdate.getImage() != null) {
			try {
				savedImageName = fileService.saveProfileImage(userUpdate.getImage());
				fileService.deleteProfileImage(inDB.getImage()); 
				inDB.setImage(savedImageName);
			} catch (IOException e) {
				e.printStackTrace();
			}		
		}
		
		return userRepository.save(inDB); 
	}

}
