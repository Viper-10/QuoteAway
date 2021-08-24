package com.hoaxify;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import java.util.Optional;

import org.aspectj.lang.annotation.Before;
import org.junit.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import com.hoaxify.entities.User;
import com.hoaxify.repositories.UserRepository;
import com.hoaxify.shared.GenericResponse;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class UserControllerTest {
	
	private static final String API_1_0_USERS = "/api/1.0/users";

	@Autowired
	TestRestTemplate testRestTemplate; 
	
	@Autowired
	UserRepository userRepository;
	
	
	public User createValidUser() {
		User user = new User(); 
		user.setUserName("priyadharshan");
		user.setDisplayName("KdPink");
		user.setPassword("p4ssword");
		
		return user; 
	}

	
	// executes before each test case. 
	// junit 5 equivalent of @before in Junit previous versions. 
	
	@BeforeEach
	public void clearUserDatabase() {
		userRepository.deleteAll();
	}
	
	@Test
	public void postUser_WhenUserIsValid_receiveOK() {
		
		User user = createValidUser(); 
		
		ResponseEntity<Object> response = testRestTemplate.postForEntity(API_1_0_USERS, user, Object.class);
		
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
	}
	@Test
	public void postUser_WhenUserIs_passwordIsHashedInDatabase() {
		
		User user = createValidUser(); 
		testRestTemplate.postForEntity(API_1_0_USERS, user, Object.class);
		
		List<User> users = userRepository.findAll();
		User userInDB = users.get(0);
		
		if(userInDB != null) {
			assertThat(userInDB.getPassword()).isNotEqualTo(user.getPassword());
		}else {
			// fails always.
			assertThat(false).isEqualTo(true); 
		}
	}
	
	@Test
	public void postUser_WhenUserIsValid_receiveSuccessMessage() {
		
		User user = createValidUser();
		
		ResponseEntity<GenericResponse> response = testRestTemplate.postForEntity(API_1_0_USERS, user, GenericResponse.class);
		
		assertThat(response.getBody().getMessage()).isNotNull();
	}
	
	
	@Test
	public void postUser_WhenUserIsValid_saveToDatabase() {		
		
		User user = createValidUser(); 
		
		ResponseEntity<Object> response = testRestTemplate.postForEntity(API_1_0_USERS, user, Object.class);
		
		assertThat(userRepository.count()).isEqualTo(1); 	
	}
	
}
