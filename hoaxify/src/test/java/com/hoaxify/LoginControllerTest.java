package com.hoaxify;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.support.BasicAuthenticationInterceptor;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import com.hoaxify.error.ApiError;
import com.hoaxify.users.User;
import com.hoaxify.users.UserRepository;
import com.hoaxify.users.UserService;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class LoginControllerTest {
	
	private static final String API_1_0_LOGIN = "/api/1.0/login"; 
	
	@Autowired
	UserRepository userRepository;
	
	@Autowired
	UserService userService;
	
	@BeforeEach
	public void cleanup() {
		userRepository.deleteAll(); 
	}

	@Autowired
	TestRestTemplate testRestTemplate; 
	
	public <T> ResponseEntity<T> login(Class<T> responseType){
		return testRestTemplate.postForEntity(API_1_0_LOGIN, null, responseType);
	}
	
	public void authenticate() {
		testRestTemplate.getRestTemplate().getInterceptors().add(new BasicAuthenticationInterceptor("test-user", "P4ssword")); 
	}
	
	@Test
	public void postLogin_withoutUserCredentials_receiveUnauthorized() {
		ResponseEntity<Object> response = login(Object.class); 
		
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED); 
	}
	@Test
	public void postLogin_withIncorrectCredentials_receiveUnauthorized() {
		authenticate(); 
		ResponseEntity<Object> response = login(Object.class); 
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED); 
	}
	
	@Test 
	public void postLogin_withoutUserCredentials_receiveApiError() {
		ResponseEntity<ApiError> response = login(ApiError.class); 
		
		assertThat(response.getBody().getUrl()).isEqualTo(API_1_0_LOGIN);
	}
	
	@Test 
	public void postLogin_withoutUser_receiveApiErrorWithoutValidationErrors() {
		ResponseEntity<String> response = login(String.class); 
		
		assertThat(response.getBody().contains("validationErrors")).isFalse();
	
	}
	/* If it contains WWW-Authenticate in response header, then browser will 
	 * respond with it's own form for error
	 */
	
	@Test
	public void postLogin_withoutUser_receiveApiErrorWithoutWWWAuthenticateHeader() {
		ResponseEntity<String> response = login(String.class); 
		
		assertThat(response.getHeaders().containsKey("WWW-Authenticate")).isFalse();
	}
	
	@Test
	public void postLogin_withValidCredentials_receiveOk() {
		User user = new User(); 
		
		user.setDisplayName("test-display");
		user.setUserName("test-user");
		user.setPassword("P4ssword");
		
		userService.save(user); 
		authenticate(); 
		
		ResponseEntity<Object> response = login(Object.class); 
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
		
	}
	
	
	
}
