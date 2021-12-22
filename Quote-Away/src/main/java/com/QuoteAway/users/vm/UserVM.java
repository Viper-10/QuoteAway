package com.QuoteAway.users.vm;

import com.QuoteAway.users.QuoteAwayUser;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UserVM {
	private long id; 
	private String username; 
	private String displayName; 
	private String image; 
	
	public UserVM(QuoteAwayUser user) {
		this.setId(user.getId()); 
		this.setDisplayName(user.getDisplayName()); 
		this.setUsername(user.getUsername());
		this.setImage(user.getImage());
	}
}
