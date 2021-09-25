package com.hoaxify;

import com.hoaxify.users.User;

public class TestUtil {
	public static User createValidUser() {
		User user = new User(); 
		user.setUsername("priyadharshan");
		user.setDisplayName("KdPinkhi");
		user.setPassword("P4ssword$");
		user.setImage("profile-image.png");
		return user; 
	}
}
