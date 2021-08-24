package com.hoaxify.entities;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

import lombok.Data;

@Data
@Entity
public class User {
	
	@Id
	@GeneratedValue
	private long id; 
	
	private String userName;
	private String displayName; 
	private String password; 
	
}
