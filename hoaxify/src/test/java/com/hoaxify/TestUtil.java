package com.hoaxify;

import com.hoaxify.quote.Hoax;
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
	
	public static User createValidUser(String username) {
		User user = createValidUser(); 
		user.setUsername(username);
		return user; 
	}
	
	public static Hoax createValidHoax() {
		Hoax quote = new Hoax();
		quote.setContent("test content for the test quote");
		return quote; 
	}
}
