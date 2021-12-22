package com.QuoteAway.quote;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.QuoteAway.users.QuoteAwayUser;

@Service
public class QuoteSecurityService {
	
	QuoteRepository quoteRepository;
	
	public QuoteSecurityService(QuoteRepository quoteRepository) {
		this.quoteRepository = quoteRepository;
	}
	
	public boolean isAllowedToDelete(long quoteId, QuoteAwayUser loggedInUser) {
		Optional<FamousQuote> quote = quoteRepository.findById(quoteId);
		
		if(quote.isPresent()) {
			FamousQuote inDB = quote.get();
			return inDB.getUser().getId() == loggedInUser.getId();
		}
		
		return false;		
	}
}
