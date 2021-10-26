package com.QuoteAway.quote;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.QuoteAway.shared.CurrentUser;
import com.QuoteAway.users.User;

@RestController
@RequestMapping("/api/1.0")
public class QuoteController {
	
	@Autowired
	QuoteService hoaxService;

	@PostMapping("/quotes")
	void createHoax(@Valid @RequestBody FamousQuote hoax, @CurrentUser User user) {
		hoaxService.save(user, hoax);
	}
	
}
