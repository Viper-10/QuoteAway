package com.QuoteAway.users;

import java.beans.Transient;
import java.util.Collection;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetails;

import com.QuoteAway.quote.FamousQuote;
import com.fasterxml.jackson.annotation.JsonView;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
//@Table(uniqueConstraints = @UniqueConstraint(columnNames = "username"))
@Table(name = "quote_away_user")
public class QuoteAwayUser implements UserDetails{
		
	@Id
	@SequenceGenerator(
            name = "user_sequence",
            sequenceName = "user_sequence",
            allocationSize = 1
    )
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "user_sequence")
//	@JsonView(UserViews.Base.class)
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
	@Column(name = "quoteawayuser_username")
	private String username;
	
	@NotNull(message = "{hoaxify.user.constraints.displayname.NotNull.message}")
	@NotEmpty(message = "{hoaxify.user.contraints.displayname.NotEmpty.message}")
	@NotBlank(message = "{hoaxify.user.contraints.displayname.NotBlank.message}")
	@Size(min = 4, max = 255)
	@Column(name = "quoteawayuser_displayname")
	private String displayName;
	
	@NotNull(message = "{hoaxify.user.constraints.password.NotNull.message}")
	@NotEmpty(message = "{hoaxify.user.contraints.password.NotEmpty.message}")
	@NotBlank(message = "{hoaxify.user.contraints.password.NotBlank.message}")
	@Size(min = 8, max = 255)
	@Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$", message = "{hoaxify.user.contraints.password.NotMatchingPattern.message}")
	@Column(name = "quoteawayuser_password")
	private String password;
	
	@Column(name = "quoteawayuser_image")
	private String image;

	@OneToMany(mappedBy = "user")
	private List<FamousQuote> quotes;
	
	@Override 
	public String getUsername() {
		return username;
		
	}
	
	@Override
	@Transient
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return AuthorityUtils.createAuthorityList("Role_USER");
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
