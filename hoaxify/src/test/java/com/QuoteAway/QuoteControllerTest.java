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
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.support.BasicAuthenticationInterceptor;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import com.QuoteAway.error.ApiError;
import com.QuoteAway.quote.FamousQuote;
import com.QuoteAway.quote.QuoteRepository;
import com.QuoteAway.quote.QuoteService;
import com.QuoteAway.quote.vm.QuoteVM;
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
	
	@Autowired
	QuoteService quoteService;
	
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
	
	@Test
	public void getQuotes_whenThereAreNoQuotes_receiveOk() {
		ResponseEntity<Object> response = getQuotes(new ParameterizedTypeReference<Object>() {});
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
	}
	
	@Test
	public void getQuotes_whenThereAreNoQuotes_receivePageWithZeroItems() {
		ResponseEntity<TestPage<Object>> response = getQuotes(new ParameterizedTypeReference<TestPage<Object>>() {});
		assertThat(response.getBody().getTotalElements()).isEqualTo(0);
	}
	
	@Test
	public void getQuotes_whenThereAreQuotes_receivePageWithtems() {
		
		User user = userService.save(TestUtil.createValidUser("user1"));
		quoteService.save(user, TestUtil.createValidQuote());
		quoteService.save(user, TestUtil.createValidQuote());
		quoteService.save(user, TestUtil.createValidQuote());
		
		ResponseEntity<TestPage<Object>> response = getQuotes(new ParameterizedTypeReference<TestPage<Object>>() {});
		assertThat(response.getBody().getTotalElements()).isEqualTo(3);
	}
	
	@Test
	public void getQuotes_whenThereAreQuotes_receivePageWithQuoteVM() {
		
		User user = userService.save(TestUtil.createValidUser("user1"));
		quoteService.save(user, TestUtil.createValidQuote());
		
		ResponseEntity<TestPage<QuoteVM>> response = getQuotes(new ParameterizedTypeReference<TestPage<QuoteVM>>() {});
		QuoteVM storedQuote = response.getBody().getContent().get(0);
		
		assertThat(storedQuote.getUser().getUsername()).isEqualTo("user1");
	}
	
	@Test
	public void postQuote_whenquoteIsValidAndUserIsAuthorized_receiveQuoteVM() {
		userService.save(TestUtil.createValidUser("user1"));
		authenticate("user1");
		FamousQuote quote = TestUtil.createValidQuote();
		ResponseEntity<QuoteVM> response = postQuote(quote, QuoteVM.class);
		assertThat(response.getBody().getUser().getUsername()).isEqualTo("user1");
	}
	
	@Test
	public void getQuotesOfUser_whenUserExists_recieveOk() {
		userService.save(TestUtil.createValidUser("user1"));
		String path = "/api/1.0/users/user1/quotes";
		
		ResponseEntity<Object> response = testRestTemplate.getForEntity(path, Object.class);
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
	}
	
	@Test
	public void getQuotesOfUser_whenUserDoesNotExist_recieveNotFound() {
		
		ResponseEntity<Object> response = getQuotesOfUser("unknown-user", new ParameterizedTypeReference<Object>() {});
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
	}	
	
	@Test
	public void getQuotesOfUser_whenUserExists_recievePageWithZeroHoaxes() {
		userService.save(TestUtil.createValidUser("user1"));
		ResponseEntity<TestPage<Object>> response = getQuotesOfUser("user1", new ParameterizedTypeReference<TestPage<Object>>() {});
		assertThat(response.getBody().getTotalElements()).isEqualTo(0);
	}
	
	@Test
	public void getQuotesOfUser_whenUserExistsWithQuotes_receivePageWithQuoteVM() {
		User user = userService.save(TestUtil.createValidUser("user1"));
		quoteService.save(user, TestUtil.createValidQuote());
		
		ResponseEntity<TestPage<QuoteVM>> response = getQuotesOfUser("user1", new ParameterizedTypeReference<TestPage<QuoteVM>>() {});
		QuoteVM storedQuote = response.getBody().getContent().get(0);
		assertThat(storedQuote.getUser().getUsername()).isEqualTo("user1");
	}	
	
	@Test
	public void getQuotesOfUser_whenUserExistsWithMultipleQuotes_receivePageWithMatchingQuotesCount() {
		User user = userService.save(TestUtil.createValidUser("user1"));
		quoteService.save(user, TestUtil.createValidQuote());
		quoteService.save(user, TestUtil.createValidQuote());
		quoteService.save(user, TestUtil.createValidQuote());
		
		ResponseEntity<TestPage<QuoteVM>> response = getQuotesOfUser("user1", new ParameterizedTypeReference<TestPage<QuoteVM>>() {});
		assertThat(response.getBody().getTotalElements()).isEqualTo(3);
	}	
	
	@Test
	public void getQuotesOfUser_whenMultipleUsersExistWithMultipleQuotes_receivePageWithMatchingQuotesCount() {
		User user1 = userService.save(TestUtil.createValidUser("user1"));
		
		IntStream.rangeClosed(1, 3).forEach(i ->{
			quoteService.save(user1, TestUtil.createValidQuote());
		});
		
		User user2 = userService.save(TestUtil.createValidUser("user2"));
		
		IntStream.rangeClosed(1, 5).forEach(i ->{
			quoteService.save(user2, TestUtil.createValidQuote());
		});
		
		
		ResponseEntity<TestPage<QuoteVM>> response = getQuotesOfUser("user2", new ParameterizedTypeReference<TestPage<QuoteVM>>() {});
		assertThat(response.getBody().getTotalElements()).isEqualTo(5);
	}	
	
	
	private <T> ResponseEntity<T> postQuote(FamousQuote quote, Class<T> responseType) {
		return testRestTemplate.postForEntity(API_1_0_QUOTES, quote, responseType);
	}
	
	private <T> ResponseEntity<T> getQuotes(ParameterizedTypeReference<T> parameterizedTypeReference) {
		return testRestTemplate.exchange(API_1_0_QUOTES, HttpMethod.GET, null, parameterizedTypeReference);
	}
	
	private <T> ResponseEntity<T> getQuotesOfUser(String username, ParameterizedTypeReference<T> parameterizedTypeReference) {
		String path = "/api/1.0/users/" + username + "/quotes";
		return testRestTemplate.exchange(path, HttpMethod.GET, null, parameterizedTypeReference);
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
