package com.hoaxify.users;

import java.beans.Transient;
import java.util.Collection;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonView;

import lombok.Data;

@Data
@Entity
//@Table(uniqueConstraints = @UniqueConstraint(columnNames = "username"))
public class User implements UserDetails{
		
	@Id
	@GeneratedValue
	@JsonView(UserViews.Base.class)
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
	@JsonView(UserViews.Base.class)
	private String userName;
	
	@NotNull(message = "{hoaxify.user.constraints.displayname.NotNull.message}")
	@NotEmpty(message = "{hoaxify.user.contraints.displayname.NotEmpty.message}")
	@NotBlank(message = "{hoaxify.user.contraints.displayname.NotBlank.message}")
	@Size(min = 4, max = 255)
	@JsonView(UserViews.Base.class)
	private String displayName;
	
	@NotNull(message = "{hoaxify.user.constraints.password.NotNull.message}")
	@NotEmpty(message = "{hoaxify.user.contraints.password.NotEmpty.message}")
	@NotBlank(message = "{hoaxify.user.contraints.password.NotBlank.message}")
	@Size(min = 8, max = 255)
	@Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$", message = "{hoaxify.user.contraints.password.NotMatchingPattern.message}")
	private String password;
	
	@JsonView(UserViews.Base.class)
	private String image;

	@Override
	@Transient
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return AuthorityUtils.createAuthorityList("Role_USER");
	}

	// this is not the getter for UserName field in User class, but a method
	// defined in UserDetails interface meant to be the getter for Username
	// so we have to override it and return the username. 
	
	@Override
	@Transient
	public String getUsername() {
		return userName; 
	}

	@Override
	@Transient
	public boolean isAccountNonExpired() {
		return true; 
	}

	@Override
	@Transient
	public boolean isAccountNonLocked() {
		return true; 
	}

	@Override
	@Transient
	public boolean isCredentialsNonExpired() {
		return true; 
	}

	@Override
	@Transient
	public boolean isEnabled() {
		return true; 
	} 
	
}