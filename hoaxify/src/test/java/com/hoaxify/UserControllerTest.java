package com.hoaxify;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
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
	
	private ResponseEntity<Object> postSignUp(){
		User user = createValidUser(); 
		ResponseEntity<Object> response = testRestTemplate.postForEntity(API_1_0_USERS, user, Object.class);
		return response; 
	}
	
	private <T> ResponseEntity<T> getUsers(ParameterizedTypeReference<T> parameterizedTypeReference) {
		return testRestTemplate.exchange(API_1_0_USERS, HttpMethod.GET, null, parameterizedTypeReference);
	}
	
	// executes before each test case. 
	// junit 5 equivalent of @before in Junit previous versions. 
	
	@BeforeEach
	public void clearUserDatabase() {
		userRepository.deleteAll();
		testRestTemplate.getRestTemplate().getInterceptors().clear();
	}
	
	@Test
	public void postUser_WhenUserIsValid_receiveOK() {
		
		ResponseEntity<Object> postSignUp = postSignUp(); 		 
		assertThat(postSignUp.getStatusCode()).isEqualTo(HttpStatus.OK);
	}
	
	@Test 
	public void postUser_WhenAnotherUser_AlreadyExistsOfSameUsername() {
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
	public void postUser_whereUserHasNullUsername_receiveBadRequest() {
		
		User user = createValidUser();
		user.setUsername(null);
		
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
		postSignUp(); 
		assertThat(userRepository.count()).isEqualTo(1); 
	}
	
	@Test 
	public void getUser_WhenNoUserIsInDatabase_receiveOK() {
		ResponseEntity<Object> response = testRestTemplate.getForEntity(API_1_0_USERS, Object.class);
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK); 
	}
	
	@Test
	public void getUser_whenThereAreNoUserInDB_receivePageWithZeroUser() {
		ResponseEntity<TestPage<Object>> response = getUsers(new ParameterizedTypeReference<TestPage<Object>>() {});
		assertThat(response.getBody().getTotalElements()).isEqualTo(0); 
	}
	
	
	@Test
	public void getUser_whenThereIsAUserInDB_receivePageWithUser() {
		userRepository.save(TestUtil.createValidUser());
		ResponseEntity<TestPage<Object>> response = getUsers(new ParameterizedTypeReference<TestPage<Object>>() {});
		assertThat(response.getBody().getNumberOfElements()).isEqualTo(1); 
	}
	
	@Test
	public void getUser_whenThereIsAUserInDB_receivePageWithUser_withoutPassword() {
		userRepository.save(TestUtil.createValidUser());
		ResponseEntity<TestPage<Map<String, Object>>> response = getUsers(new ParameterizedTypeReference<TestPage<Map<String, Object>>>() {});
		Map<String, Object> entity = response.getBody().getContent().get(0); 
		
		assertThat(entity.containsKey("password")).isFalse(); 
	}

	
	
	
}
