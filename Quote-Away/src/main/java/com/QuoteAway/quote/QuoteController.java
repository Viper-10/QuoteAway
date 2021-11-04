package com.QuoteAway.quote;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.QuoteAway.quote.vm.QuoteVM;
import com.QuoteAway.shared.CurrentUser;
import com.QuoteAway.shared.GenericResponse;
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
	
	@GetMapping({"/users/{username}/quotes/{id:[0-9]+}", "/quotes/{id:[0-9]+}"})
	ResponseEntity<?> getHoaxesRelative(
			@PathVariable(required = false) String username,
			@PathVariable long id, Pageable pageable,
			@RequestParam(name = "direction", defaultValue = "after") String direction,
			@RequestParam(name="count", defaultValue="false", required=false) boolean count) {
		
		if(!direction.equalsIgnoreCase("after")) {
			return ResponseEntity.ok(quoteService.getOldQuotes(id, username, pageable).map(QuoteVM::new));
		}
		
		if(count == true) {
			long newQuoteCount = quoteService.getNewQuotesCount(id, username);
			return ResponseEntity.ok(Collections.singletonMap("count", newQuoteCount));
		}
		
		List<QuoteVM> newQuotes = quoteService.getNewQuotes(id, username, pageable).stream().map(QuoteVM::new).collect(Collectors.toList());
		
		return ResponseEntity.ok(newQuotes);
	}
	
	@DeleteMapping("/quotes/{id:[0-9]+}")
	@PreAuthorize("@quoteSecurityService.isAllowedToDelete(#id, principal)")
	GenericResponse deleteQuote(@PathVariable long id) {
		quoteService.deleteQuote(id);
		return new GenericResponse("Quote is removed");
	}
	
//	@GetMapping("/users/{username}/quotes/{id:[0-9]+}")
//	ResponseEntity<?> getQuotesRelativeForUser(
//			@PathVariable String username, 
//			@PathVariable long id, Pageable pageable, 
//			@RequestParam(name="direction", defaultValue="after") String direction,
//			@RequestParam(name="count", defaultValue="false", required=false) boolean count){
//		
//		if(!direction.equalsIgnoreCase("after")) {
//			return ResponseEntity.ok(quoteService.getOldQuotesOfUser(id, username, pageable).map(QuoteVM::new));
//		}		
//		
//		if(count == true) {
//			long newQuoteCount = quoteService.getNewQuotesCountOfUser(id, username);
//			return ResponseEntity.ok(Collections.singletonMap("count", newQuoteCount));
//		}
//		
//		List<QuoteVM> newQuotes = quoteService.getNewQuotesOfUser(id, username, pageable).stream().map(QuoteVM::new).collect(Collectors.toList());
//		return ResponseEntity.ok(newQuotes);
//	}
}
