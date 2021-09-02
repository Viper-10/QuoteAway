package com.hoaxify;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

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

import com.hoaxify.shared.GenericResponse;
import com.hoaxify.users.User;
import com.hoaxify.users.UserRepository;
import static com.hoaxify.TestUtil.createValidUser; 

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class UserControllerTest {
	
	private static final String API_1_0_USERS = "/api/1.0/users";
	
	@Autowired
	TestRestTemplate testRestTemplate; 
	
	@Autowired
	UserRepository userRepository;
	
	public ResponseEntity<Object> postSignUp(){
		User user = createValidUser(); 
		ResponseEntity<Object> response = testRestTemplate.postForEntity(API_1_0_USERS, user, Object.class);
		return response; 
	}
	
	// executes before each test case. 
	// junit 5 equivalent of @before in Junit previous versions. 
	
	@BeforeEach
	public void clearUserDatabase() {
		userRepository.deleteAll();
	}
	
	@Test
	public void postUser_WhenUserIsValid_receiveOK() {
		
		ResponseEntity<Object> postSignUp = postSignUp(); 		 
		assertThat(postSignUp.getStatusCode()).isEqualTo(HttpStatus.OK);
	}
	
	@Test 
	public void postUser_WhenAnotherUser_AlreadyExistsOfSameUserName() {
		User user1 = createValidUser(); 
		User user2 = createValidUser(); 
		
		testRestTemplate.postForEntity(API_1_0_USERS, user1, Object.class); 
		assertThat(testRestTemplate.postForEntity(API_1_0_USERS, user2, Object.class).getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);  
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
	public void postUser_whereUserHasNullDisplayName_receiveBadRequest() {
		
		User user = createValidUser();
		user.setDisplayName(null);
		
		ResponseEntity<GenericResponse> response = testRestTemplate.postForEntity(API_1_0_USERS, user, GenericResponse.class);
		
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
	}
	
	@Test
	public void postUser_whereUserHasNullUserName_receiveBadRequest() {
		
		User user = createValidUser();
		user.setUserName(null);
		
		ResponseEntity<GenericResponse> response = testRestTemplate.postForEntity(API_1_0_USERS, user, GenericResponse.class);
		
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
	}
	@Test
	public void postUser_whereUserHasNullPassword_receiveBadRequest() {
		
		User user = createValidUser();
		user.setPassword(null);
		
		ResponseEntity<GenericResponse> response = testRestTemplate.postForEntity(API_1_0_USERS, user, GenericResponse.class);
		
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
	}
	
	
	@Test
	public void postUser_WhenUserIsValid_saveToDatabase() {		
		ResponseEntity<Object> postSignUp = postSignUp(); 
		assertThat(userRepository.count()).isEqualTo(1); 
	}
	
}
