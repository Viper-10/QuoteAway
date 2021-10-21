package com.hoaxify;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
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
import com.hoaxify.quote.FamousQuote;
import com.hoaxify.quote.QuoteRepository;
import com.hoaxify.users.User;
import com.hoaxify.users.UserRepository;
import com.hoaxify.users.UserService;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class QuoteControllerTest {

	private static final String API_1_0_QUOTES = "/api/1.0/quotes";

	@Autowired
	TestRestTemplate testRestTemplate;
	
	@Autowired
	UserService userService;
	
	@Autowired
	UserRepository userRepository;
	
	@Autowired
	QuoteRepository hoaxRepository;
	
	@Before
	public void cleanup() {
		hoaxRepository.deleteAll();
		userRepository.deleteAll();
		testRestTemplate.getRestTemplate().getInterceptors().clear();
	}
	
	@Test
	public void postHoax_whenHoaxIsValidAndUserIsAuthorized_receiveOk() {
		userService.save(TestUtil.createValidUser("user1"));
		authenticate("user1");
		FamousQuote hoax = TestUtil.createValidHoax();
		ResponseEntity<Object> response = postHoax(hoax, Object.class);
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
	}
	

	@Test
	public void postHoax_whenHoaxIsValidAndUserIsUnauthorized_receiveUnauthorized() {
		FamousQuote hoax = TestUtil.createValidHoax();
		ResponseEntity<Object> response = postHoax(hoax, Object.class);
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
	}
	
	@Test
	public void postHoax_whenHoaxIsValidAndUserIsUnauthorized_receiveApiError() {
		FamousQuote hoax = TestUtil.createValidHoax();
		ResponseEntity<ApiError> response = postHoax(hoax, ApiError.class);
		assertThat(response.getBody().getStatus()).isEqualTo(HttpStatus.UNAUTHORIZED.value());
	}
	
	@Test
	public void postHoax_whenHoaxIsValidAndUserIsAuthorized_hoaxSavedToDatabase() {
		userService.save(TestUtil.createValidUser("user1"));
		authenticate("user1");
		FamousQuote hoax = TestUtil.createValidHoax();
		postHoax(hoax, Object.class);
		
		assertThat(hoaxRepository.count()).isEqualTo(1);
	}
	
	@Test
	public void postHoax_whenHoaxIsValidAndUserIsAuthorized_hoaxSavedToDatabaseWithTimestamp() {
		userService.save(TestUtil.createValidUser("user1"));
		authenticate("user1");
		FamousQuote hoax = TestUtil.createValidHoax();
		postHoax(hoax, Object.class);
		
		FamousQuote inDB = hoaxRepository.findAll().get(0);
		
		assertThat(inDB.getTimestamp()).isNotNull();
	}
	
	@Test
	public void postHoax_whenHoaxContentNullAndUserIsAuthorized_receiveBadRequest() {
		userService.save(TestUtil.createValidUser("user1"));
		authenticate("user1");
		FamousQuote hoax = new FamousQuote();
		ResponseEntity<Object> response = postHoax(hoax, Object.class);
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
	}

	@Test
	public void postHoax_whenHoaxContentLessThan10CharactersAndUserIsAuthorized_receiveBadRequest() {
		userService.save(TestUtil.createValidUser("user1"));
		authenticate("user1");
		FamousQuote hoax = new FamousQuote();
		hoax.setContent("123456789");
		ResponseEntity<Object> response = postHoax(hoax, Object.class);
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
	}
	
	@Test
	public void postHoax_whenHoaxContentIs5000CharactersAndUserIsAuthorized_receiveOk() {
		userService.save(TestUtil.createValidUser("user1"));
		authenticate("user1");
		FamousQuote hoax = new FamousQuote();
		String veryLongString = IntStream.rangeClosed(1, 5000).mapToObj(i -> "x").collect(Collectors.joining());
		hoax.setContent(veryLongString);
		ResponseEntity<Object> response = postHoax(hoax, Object.class);
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
	}
	
	
	@Test
	public void postHoax_whenHoaxContentMoreThan5000CharactersAndUserIsAuthorized_receiveBadRequest() {
		userService.save(TestUtil.createValidUser("user1"));
		authenticate("user1");
		FamousQuote hoax = new FamousQuote();
		String veryLongString = IntStream.rangeClosed(1, 5001).mapToObj(i -> "x").collect(Collectors.joining());
		hoax.setContent(veryLongString);
		ResponseEntity<Object> response = postHoax(hoax, Object.class);
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
	}
	

	@Test
	public void postHoax_whenHoaxContentNullAndUserIsAuthorized_receiveApiErrorWithValidationErrors() {
		userService.save(TestUtil.createValidUser("user1"));
		authenticate("user1");
		FamousQuote hoax = new FamousQuote();
		ResponseEntity<ApiError> response = postHoax(hoax, ApiError.class);
		Map<String, String> validationErrors = response.getBody().getValidationErrors();
		assertThat(validationErrors.get("content")).isNotNull();
	}
	
	@Test
	public void postHoax_whenHoaxIsValidAndUserIsAuthorized_hoaxSavedWithAuthenticatedUserInfo() {
		userService.save(TestUtil.createValidUser("user1"));
		authenticate("user1");
		FamousQuote hoax = TestUtil.createValidHoax();
		postHoax(hoax, Object.class);
		
		FamousQuote inDB = hoaxRepository.findAll().get(0);
		
		assertThat(inDB.getUser().getUsername()).isEqualTo("user1");
	}
	
	@Test
	public void postHoax_whenHoaxIsValidAndUserIsAuthorized_hoaxCanBeAccessedFromUserEntity() {
		userService.save(TestUtil.createValidUser("user1"));
		authenticate("user1");
		FamousQuote hoax = TestUtil.createValidHoax();
		postHoax(hoax, Object.class);

		User inDBUser = userRepository.findByUsername("user1");
		assertThat(inDBUser.getHoaxes().size()).isEqualTo(1);
		
	}
	private <T> ResponseEntity<T> postHoax(FamousQuote hoax, Class<T> responseType) {
		return testRestTemplate.postForEntity(API_1_0_QUOTES, hoax, responseType);
	}
	

	private void authenticate(String username) {
		testRestTemplate.getRestTemplate()
			.getInterceptors().add(new BasicAuthenticationInterceptor(username, "P4ssword$"));
	}
	
	@After
	public void cleanupAfter() {
		hoaxRepository.deleteAll();
	}
}
