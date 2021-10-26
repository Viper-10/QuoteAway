package com.QuoteAway.quote;

import java.util.Date;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.QuoteAway.users.User;
import com.QuoteAway.users.UserService;

@Service
public class QuoteService {
	
	QuoteRepository quoteRepository;
	
	UserService userService;

	public QuoteService(QuoteRepository quoteRepository, UserService userService) {
		super();
		this.quoteRepository = quoteRepository;
		this.userService = userService;
	}
	
	public FamousQuote save(User user, FamousQuote quote) {
		quote.setTimestamp(new Date());
		quote.setUser(user);
		return quoteRepository.save(quote);
	}
	
	public Page<FamousQuote> getAllQuotes(Pageable pageable){
		return quoteRepository.findAll(pageable);
	}

	public Page<FamousQuote> getQuotesOfUser(String username, Pageable pageable) {
		User inDB = userService.getByUsername(username); 
		return quoteRepository.findByUser(inDB, pageable);
	}

}