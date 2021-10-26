package com.QuoteAway.quote;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.QuoteAway.quote.vm.QuoteVM;
import com.QuoteAway.shared.CurrentUser;
import com.QuoteAway.users.User;

@RestController
@RequestMapping("/api/1.0")
public class QuoteController {
	
	@Autowired
	QuoteService quoteService;

	@PostMapping("/quotes")
	QuoteVM createQuote(@Valid @RequestBody FamousQuote quote, @CurrentUser User user) {
		return new QuoteVM(quoteService.save(user, quote));
	}
	
	@GetMapping("/quotes")
	Page<QuoteVM> getAllQuotes(Pageable pageable) {
		return quoteService.getAllQuotes(pageable).map(QuoteVM::new);
	}
	
	@GetMapping("/users/{username}/quotes")
	Page<QuoteVM> getQuotesOfUser(@PathVariable String username, Pageable pageable) {
		return quoteService.getQuotesOfUser(username, pageable).map(QuoteVM::new);
	}
	
	
}
