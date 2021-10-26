package com.QuoteAway;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.PersistenceUnit;

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

import com.QuoteAway.error.ApiError;
import com.QuoteAway.quote.FamousQuote;
import com.QuoteAway.quote.QuoteRepository;
import com.QuoteAway.users.User;
import com.QuoteAway.users.UserRepository;
import com.QuoteAway.users.UserService;

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
	QuoteRepository quoteRepository;
	
	@PersistenceUnit
	private EntityManagerFactory entityManagerFactory;
	
	@Before
	public void cleanup() {
		quoteRepository.deleteAll();
		userRepository.deleteAll();
		testRestTemplate.getRestTemplate().getInterceptors().clear();
	}
	
	@Test
	public void postQuote_whenquoteIsValidAndUserIsAuthorized_receiveOk() {
		userService.save(TestUtil.createValidUser("user1"));
		authenticate("user1");
		FamousQuote quote = TestUtil.createValidQuote();
		ResponseEntity<Object> response = postQuote(quote, Object.class);
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
	}
	

	@Test
	public void postQuote_whenquoteIsValidAndUserIsUnauthorized_receiveUnauthorized() {
		FamousQuote quote = TestUtil.createValidQuote();
		ResponseEntity<Object> response = postQuote(quote, Object.class);
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
	}
	
	@Test
	public void postQuote_whenquoteIsValidAndUserIsUnauthorized_receiveApiError() {
		FamousQuote quote = TestUtil.createValidQuote();
		ResponseEntity<ApiError> response = postQuote(quote, ApiError.class);
		assertThat(response.getBody().getStatus()).isEqualTo(HttpStatus.UNAUTHORIZED.value());
	}
	
	@Test
	public void postQuote_whenquoteIsValidAndUserIsAuthorized_quoteSavedToDatabase() {
		userService.save(TestUtil.createValidUser("user1"));
		authenticate("user1");
		FamousQuote quote = TestUtil.createValidQuote();
		postQuote(quote, Object.class);
		
		assertThat(quoteRepository.count()).isEqualTo(1);
	}
	
	@Test
	public void postQuote_whenquoteIsValidAndUserIsAuthorized_quoteSavedToDatabaseWithTimestamp() {
		userService.save(TestUtil.createValidUser("user1"));
		authenticate("user1");
		FamousQuote quote = TestUtil.createValidQuote();
		postQuote(quote, Object.class);
		
		FamousQuote inDB = quoteRepository.findAll().get(0);
		
		assertThat(inDB.getTimestamp()).isNotNull();
	}
	
	@Test
	public void postQuote_whenquoteContentNullAndUserIsAuthorized_receiveBadRequest() {
		userService.save(TestUtil.createValidUser("user1"));
		authenticate("user1");
		FamousQuote quote = new FamousQuote();
		ResponseEntity<Object> response = postQuote(quote, Object.class);
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
	}

	@Test
	public void postQuote_whenquoteContentLessThan10CharactersAndUserIsAuthorized_receiveBadRequest() {
		userService.save(TestUtil.createValidUser("user1"));
		authenticate("user1");
		FamousQuote quote = new FamousQuote();
		quote.setContent("123456789");
		ResponseEntity<Object> response = postQuote(quote, Object.class);
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
	}
	
	@Test
	public void postQuote_whenquoteContentIs5000CharactersAndUserIsAuthorized_receiveOk() {
		userService.save(TestUtil.createValidUser("user1"));
		authenticate("user1");
		FamousQuote quote = new FamousQuote();
		String veryLongString = IntStream.rangeClosed(1, 5000).mapToObj(i -> "x").collect(Collectors.joining());
		quote.setContent(veryLongString);
		ResponseEntity<Object> response = postQuote(quote, Object.class);
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
	}
	
	
	@Test
	public void postQuote_whenquoteContentMoreThan5000CharactersAndUserIsAuthorized_receiveBadRequest() {
		userService.save(TestUtil.createValidUser("user1"));
		authenticate("user1");
		FamousQuote quote = new FamousQuote();
		String veryLongString = IntStream.rangeClosed(1, 5001).mapToObj(i -> "x").collect(Collectors.joining());
		quote.setContent(veryLongString);
		ResponseEntity<Object> response = postQuote(quote, Object.class);
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
	}
	

	@Test
	public void postQuote_whenquoteContentNullAndUserIsAuthorized_receiveApiErrorWithValidationErrors() {
		userService.save(TestUtil.createValidUser("user1"));
		authenticate("user1");
		FamousQuote quote = new FamousQuote();
		ResponseEntity<ApiError> response = postQuote(quote, ApiError.class);
		Map<String, String> validationErrors = response.getBody().getValidationErrors();
		assertThat(validationErrors.get("content")).isNotNull();
	}
	
	@Test
	public void postQuote_whenquoteIsValidAndUserIsAuthorized_quoteSavedWithAuthenticatedUserInfo() {
		userService.save(TestUtil.createValidUser("user1"));
		authenticate("user1");
		FamousQuote quote = TestUtil.createValidQuote();
		postQuote(quote, Object.class);
		
		FamousQuote inDB = quoteRepository.findAll().get(0);
		
		assertThat(inDB.getUser().getUsername()).isEqualTo("user1");
	}
	
	@Test
	public void postQuote_whenquoteIsValidAndUserIsAuthorized_quoteCanBeAccessedFromUserEntity() {
		User user = userService.save(TestUtil.createValidUser("user1"));
		authenticate("user1");
		FamousQuote quote = TestUtil.createValidQuote();
		postQuote(quote, Object.class);
		
		EntityManager entityManager = entityManagerFactory.createEntityManager(); 
		
		User inDBUser = entityManager.find(User.class, user.getId());
		assertThat(inDBUser.getQuotes().size()).isEqualTo(1);
		
	}
	private <T> ResponseEntity<T> postQuote(FamousQuote quote, Class<T> responseType) {
		return testRestTemplate.postForEntity(API_1_0_QUOTES, quote, responseType);
	}
	

	private void authenticate(String username) {
		testRestTemplate.getRestTemplate()
			.getInterceptors().add(new BasicAuthenticationInterceptor(username, "P4ssword$"));
	}
	
	@After
	public void cleanupAfter() {
		quoteRepository.deleteAll();
	}
}
