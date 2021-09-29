package com.hoaxify;

import java.util.stream.IntStream;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Profile;

import com.hoaxify.users.User;
import com.hoaxify.users.UserService;

@SpringBootApplication
public class HoaxifyApplication {
	public static void main(String[] args) {
		SpringApplication.run(HoaxifyApplication.class, args);
	}
	
	@Bean
	// when we're running test, this shouldn't interfere.
	// so we disable it for profile test. 
	
	@Profile("!test")
	CommandLineRunner run(UserService userService) {
		return (args) -> {
				IntStream.rangeClosed(1, 15)
						.mapToObj(i -> {
				
					User user = User.builder()
								.username("user"+i)
								.displayName("display"+i)
								.password("P4ssword$")
								.build();
					return user; 
					
				}).forEach(userService::save);
			
		};
	}
}
	
