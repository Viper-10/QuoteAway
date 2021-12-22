package com.QuoteAway.quote.vm;

import java.util.Date;

import com.QuoteAway.quote.FamousQuote;
import com.QuoteAway.users.QuoteAwayUser;
import com.QuoteAway.users.vm.UserVM;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuoteVM {
	private long id; 
	
	private String content; 
	
	private long date; 
	
	private UserVM user; 
	
	public QuoteVM(FamousQuote quote) {
		this.setId(quote.getId());
		this.setContent(quote.getContent());
		this.setDate(quote.getTimestamp().getTime());
		this.setUser(new UserVM(quote.getUser()));
	}
	
}
