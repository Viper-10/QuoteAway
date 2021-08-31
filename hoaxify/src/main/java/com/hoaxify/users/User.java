package com.hoaxify.users;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import lombok.Data;

@Data
@Entity
//@Table(uniqueConstraints = @UniqueConstraint(columnNames = "username"))
public class User {
		
	@Id
	@GeneratedValue
	private long id; 
	
	/*
	 * max letters is 255 because in database userName will have varchar(255) size. 
	 * Note that the validation sequence is random and a blank string( " " ) may trigger either @NotBlank first
	 * or @Size first for violating minimum size criteria. 
	
	*/
	@NotNull(message = "{hoaxify.user.constraints.username.NotNull.message}")
	@NotEmpty(message = "{hoaxify.user.contraints.username.NotEmpty.message}")
	@NotBlank(message = "{hoaxify.user.contraints.username.NotBlank.message}")
	@Size(min = 4, max = 255)
	@UniqueUsername
	private String userName;
	
	@NotNull(message = "{hoaxify.user.constraints.displayname.NotNull.message}")
	@NotEmpty(message = "{hoaxify.user.contraints.displayname.NotEmpty.message}")
	@NotBlank(message = "{hoaxify.user.contraints.displayname.NotBlank.message}")
	@Size(min = 4, max = 255)
	private String displayName;
	
	@NotNull(message = "{hoaxify.user.constraints.password.NotNull.message}")
	@NotEmpty(message = "{hoaxify.user.contraints.password.NotEmpty.message}")
	@NotBlank(message = "{hoaxify.user.contraints.password.NotBlank.message}")
	@Size(min = 8, max = 255)
	@Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$", message = "{hoaxify.user.contraints.password.NotMatchingPattern.message}")
	private String password; 
	
}
