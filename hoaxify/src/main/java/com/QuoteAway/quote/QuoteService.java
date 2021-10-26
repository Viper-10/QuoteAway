package com.QuoteAway.quote;

import java.util.Date;

import org.springframework.stereotype.Service;

import com.QuoteAway.users.User;

@Service
public class QuoteService {
	
	QuoteRepository hoaxRepository;

	public QuoteService(QuoteRepository hoaxRepository) {
		super();
		this.hoaxRepository = hoaxRepository;
	}
	
	public void save(User user, FamousQuote hoax) {
		hoax.setTimestamp(new Date());
		hoax.setUser(user);
		hoaxRepository.save(hoax);
	}

}