package com.QuoteAway;

import static org.assertj.core.api.Assertions.assertThat;

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
import org.springframework.http.client.support.BasicAuthenticationInterceptor;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import com.QuoteAway.error.ApiError;
import com.QuoteAway.users.User;
import com.QuoteAway.users.UserRepository;
import com.QuoteAway.users.UserService;

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
		testRestTemplate.getRestTemplate().getInterceptors().clear(); 
	}

	@Autowired
	TestRestTemplate testRestTemplate; 
	
	public <T> ResponseEntity<T> login(Class<T> responseType){
		return testRestTemplate.postForEntity(API_1_0_LOGIN, null, responseType);
	}
	
	public <T> ResponseEntity<T> login(ParameterizedTypeReference<T> responseType){
		return testRestTemplate.exchange(API_1_0_LOGIN, HttpMethod.POST, null, responseType);
	}
	
	public void authenticate() {
		testRestTemplate.getRestTemplate().getInterceptors().add(new BasicAuthenticationInterceptor("priyadharshan", "P4ssword$")); 
	}
	
	@Test
	public void postLogin_withoutUserCredentials_receiveUnauthorized() {
		ResponseEntity<Object> response = login(Object.class); 
		
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED); 
	}
	@Test
	public void postLogin_withIncorrectCredentials_receiveUnauthorized() {
		
		// since we've not even stored any user in db, all the username and password are incorrect credentials. 
	
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
		User user = TestUtil.createValidUser();
		
		userService.save(user); 
		authenticate(); 
		
		ResponseEntity<Object> response = login(Object.class); 
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
	}
	
	@Test
	public void postLogin_withValidCredentials_receiveLoggedInUser() {
		User user = TestUtil.createValidUser();
		
		User inDB = userService.save(user); 
		authenticate(); 
		
		ResponseEntity<Map<String, Object>> response = login(new ParameterizedTypeReference<Map<String, Object>>(){});
		
		Map<String, Object> body = response.getBody(); 
		
		Integer id = (Integer)body.get("id");
		
		assertThat(id).isEqualTo(inDB.getId());
	}
	
	
	@Test
	public void postLogin_withValidCredentials_receiveLoggedInUserImage() {
		User user = TestUtil.createValidUser();
		
		User inDB = userService.save(user); 
		authenticate(); 
		
		ResponseEntity<Map<String, Object>> response = login(new ParameterizedTypeReference<Map<String, Object>>(){});
		
		Map<String, Object> body = response.getBody(); 
		
		String image = (String)body.get("image");
		
		assertThat(image).isEqualTo(inDB.getImage());
	}
	@Test
	public void postLogin_withValidCredentials_receiveLoggedInUserDisplayName() {
		User user = TestUtil.createValidUser();
		
		User inDB = userService.save(user); 
		authenticate(); 
		
		ResponseEntity<Map<String, Object>> response = login(new ParameterizedTypeReference<Map<String, Object>>(){});
		
		Map<String, Object> body = response.getBody(); 
		
		String displayName = (String)body.get("displayName");
		
		assertThat(displayName).isEqualTo(inDB.getDisplayName());
	}
	
	
	
}
