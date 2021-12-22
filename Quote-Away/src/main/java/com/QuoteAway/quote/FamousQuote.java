package com.QuoteAway.quote;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.QuoteAway.users.QuoteAwayUser;
import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Table(name = "quotes")
public class FamousQuote {
	
	@Id
	@GeneratedValue
	@Column(name = "quote_id")
	private long id;

	@NotNull
	@Size(min = 10, max=5000)
	@Column(length = 5000, name = "quote_content")
	private String content;
	
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "quote_timestamp")
	private Date timestamp;
	
	@ManyToOne
	private QuoteAwayUser user;
}
