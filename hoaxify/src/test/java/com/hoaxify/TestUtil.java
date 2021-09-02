package com.hoaxify;

import com.hoaxify.users.User;

public class TestUtil {
	public static User createValidUser() {
		User user = new User(); 
		user.setUserName("priyadharshan");
		user.setDisplayName("KdPinkhi");
		user.setPassword("P4ssword$");
		
		return user; 
	}
}
