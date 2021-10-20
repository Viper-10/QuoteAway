package com.hoaxify.quote;

import java.util.Date;

import org.springframework.stereotype.Service;

import com.hoaxify.users.User;

@Service
public class HoaxService {
	
	HoaxRepository hoaxRepository;

	public HoaxService(HoaxRepository hoaxRepository) {
		super();
		this.hoaxRepository = hoaxRepository;
	}
	
	public void save(User user, Hoax hoax) {
		hoax.setTimestamp(new Date());
		hoax.setUser(user);
		hoaxRepository.save(hoax);
	}

}