package com.QuoteAway;

import java.util.Date;
import java.util.stream.IntStream;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Profile;

import com.QuoteAway.quote.FamousQuote;
import com.QuoteAway.quote.QuoteService;
import com.QuoteAway.users.User;
import com.QuoteAway.users.UserService;

@SpringBootApplication
public class QuoteAwayApplication {
	public static void main(String[] args) {
		SpringApplication.run(QuoteAwayApplication.class, args);
	}
	
	@Bean	
	// This is for profile dev, so we don't need to worry about this interfering with tests as they're 
	// marked as profile test for which this wont' run
	
	@Profile("dev")
	CommandLineRunner run(UserService userService, QuoteService quoteService) {
		return (args) -> {
				IntStream.rangeClosed(1, 15)
						.mapToObj(i -> {
				
					User user = User.builder().username("user" + i).displayName("display" + i).password("P4ssword$").build();
									
					return user; 
					
				}).forEach(userService::save);
						
		};
	}
}
	
