package com.QuoteAway;

import com.QuoteAway.quote.FamousQuote;
import com.QuoteAway.users.QuoteAwayUser;

public class TestUtil {
	public static QuoteAwayUser createValidUser() {
		QuoteAwayUser user = new QuoteAwayUser(); 
		user.setUsername("priyadharshan");
		user.setDisplayName("KdPinkhi");
		user.setPassword("P4ssword$");
		user.setImage("profile-image.png");
		return user; 
	}
	
	public static QuoteAwayUser createValidUser(String username) {
		QuoteAwayUser user = createValidUser(); 
		user.setUsername(username);
		return user; 
	}
	
	public static FamousQuote createValidQuote() {
		FamousQuote quote = new FamousQuote();
		quote.setContent("test content for the test quote");
		return quote; 
	}
}
