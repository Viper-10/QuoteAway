package com.QuoteAway;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import java.util.Map;
import java.util.Optional;
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
import com.QuoteAway.shared.GenericResponse;
import com.QuoteAway.users.QuoteAwayUser;
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
		QuoteAwayUser user = userService.save(TestUtil.createValidUser("user1"));
		authenticate("user1");
		FamousQuote quote = TestUtil.createValidQuote();
		postQuote(quote, Object.class);
		
		EntityManager entityManager = entityManagerFactory.createEntityManager(); 
		
		QuoteAwayUser inDBUser = entityManager.find(QuoteAwayUser.class, user.getId());
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
		
		QuoteAwayUser user = userService.save(TestUtil.createValidUser("user1"));
		quoteService.save(user, TestUtil.createValidQuote());
		quoteService.save(user, TestUtil.createValidQuote());
		quoteService.save(user, TestUtil.createValidQuote());
		
		ResponseEntity<TestPage<Object>> response = getQuotes(new ParameterizedTypeReference<TestPage<Object>>() {});
		assertThat(response.getBody().getTotalElements()).isEqualTo(3);
	}
	
	@Test
	public void getQuotes_whenThereAreQuotes_receivePageWithQuoteVM() {
		
		QuoteAwayUser user = userService.save(TestUtil.createValidUser("user1"));
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
		QuoteAwayUser user = userService.save(TestUtil.createValidUser("user1"));
		quoteService.save(user, TestUtil.createValidQuote());
		
		ResponseEntity<TestPage<QuoteVM>> response = getQuotesOfUser("user1", new ParameterizedTypeReference<TestPage<QuoteVM>>() {});
		QuoteVM storedQuote = response.getBody().getContent().get(0);
		assertThat(storedQuote.getUser().getUsername()).isEqualTo("user1");
	}	
	
	@Test
	public void getQuotesOfUser_whenUserExistsWithMultipleQuotes_receivePageWithMatchingQuotesCount() {
		QuoteAwayUser user = userService.save(TestUtil.createValidUser("user1"));
		quoteService.save(user, TestUtil.createValidQuote());
		quoteService.save(user, TestUtil.createValidQuote());
		quoteService.save(user, TestUtil.createValidQuote());
		
		ResponseEntity<TestPage<QuoteVM>> response = getQuotesOfUser("user1", new ParameterizedTypeReference<TestPage<QuoteVM>>() {});
		assertThat(response.getBody().getTotalElements()).isEqualTo(3);
	}	
	
	@Test
	public void getQuotesOfUser_whenMultipleUsersExistWithMultipleQuotes_receivePageWithMatchingQuotesCount() {
		QuoteAwayUser user1 = userService.save(TestUtil.createValidUser("user1"));
		
		IntStream.rangeClosed(1, 3).forEach(i ->{
			quoteService.save(user1, TestUtil.createValidQuote());
		});
		
		QuoteAwayUser user2 = userService.save(TestUtil.createValidUser("user2"));
		
		IntStream.rangeClosed(1, 5).forEach(i ->{
			quoteService.save(user2, TestUtil.createValidQuote());
		});
		
		
		ResponseEntity<TestPage<QuoteVM>> response = getQuotesOfUser("user2", new ParameterizedTypeReference<TestPage<QuoteVM>>() {});
		assertThat(response.getBody().getTotalElements()).isEqualTo(5);
	}	
	
	@Test
	public void getOldQuotes_whenThereAreNoQuotes_receiveOk() {
		ResponseEntity<Object> response = getOldQuotes(5, new ParameterizedTypeReference<Object>() {}); 
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
	}
	
	@Test
	public void getOldQuotes_whenThereAreNoQuotes_receivePageWithItemsProvidedId() {
		
		QuoteAwayUser user = userService.save(TestUtil.createValidUser("user1"));
		quoteService.save(user, TestUtil.createValidQuote());
		quoteService.save(user, TestUtil.createValidQuote());
		quoteService.save(user, TestUtil.createValidQuote());
		
		FamousQuote fourth = quoteService.save(user, TestUtil.createValidQuote());
		quoteService.save(user, TestUtil.createValidQuote());
		
		ResponseEntity<TestPage<Object>> response = getOldQuotes(fourth.getId(), new ParameterizedTypeReference<TestPage<Object>>() {}); 
		assertThat(response.getBody().getTotalElements()).isEqualTo(3);
	}
	
	@Test
	public void getOldQuotesOfUser_whenUserExistThereAreNoQuotes_receiveOk() {
		userService.save(TestUtil.createValidUser("user1"));
		ResponseEntity<Object> response = getOldQuotesOfUser(5, "user1", new ParameterizedTypeReference<Object>() {}); 
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
	}
	
	@Test
	public void getOldQuotesOfUser_whenUserDoesNotExist_receiveNotFound() {
		ResponseEntity<Object> response = getOldQuotesOfUser(5, "user1", new ParameterizedTypeReference<Object>() {}); 
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
	}
	
	@Test
	public void getOldQuotesOfUser_whenUserExistAndThereAreQuotes_receivePageWithItemsBeforeProvidedId() {
		
		QuoteAwayUser user = userService.save(TestUtil.createValidUser("user1"));
		quoteService.save(user, TestUtil.createValidQuote());
		quoteService.save(user, TestUtil.createValidQuote());
		quoteService.save(user, TestUtil.createValidQuote());
		
		FamousQuote fourth = quoteService.save(user, TestUtil.createValidQuote());
		quoteService.save(user, TestUtil.createValidQuote());
		
		ResponseEntity<TestPage<Object>> response = getOldQuotesOfUser(fourth.getId(), "user1", new ParameterizedTypeReference<TestPage<Object>>() {}); 
		assertThat(response.getBody().getTotalElements()).isEqualTo(3);
	}

	@Test
	public void getOldQuotesOfUser_whenUserExistAndThereAreNoQuotes_receivePageWithZeroItemsBeforeProvidedId() {
		
		QuoteAwayUser user = userService.save(TestUtil.createValidUser("user1"));
		quoteService.save(user, TestUtil.createValidQuote());
		quoteService.save(user, TestUtil.createValidQuote());
		quoteService.save(user, TestUtil.createValidQuote());
		
		FamousQuote fourth = quoteService.save(user, TestUtil.createValidQuote());
		quoteService.save(user, TestUtil.createValidQuote());
		
		userService.save(TestUtil.createValidUser("user2"));
		
		ResponseEntity<TestPage<Object>> response = getOldQuotesOfUser(fourth.getId(), "user2", new ParameterizedTypeReference<TestPage<Object>>() {}); 
		assertThat(response.getBody().getTotalElements()).isEqualTo(0);
	}
	
	@Test
	public void getNewQuotes_whenThereAreQuotes_receiveListOfItemsAfterProvidedId() {
		
		QuoteAwayUser user = userService.save(TestUtil.createValidUser("user1"));
		quoteService.save(user, TestUtil.createValidQuote());
		quoteService.save(user, TestUtil.createValidQuote());
		quoteService.save(user, TestUtil.createValidQuote());
		
		FamousQuote fourth = quoteService.save(user, TestUtil.createValidQuote());
		quoteService.save(user, TestUtil.createValidQuote());
	
		ResponseEntity<List<Object>> response = getNewQuotes(fourth.getId(), new ParameterizedTypeReference<List<Object>>() {}); 
		assertThat(response.getBody().size()).isEqualTo(1);
	}
	
	@Test
	public void getNewQuotesOfUser_whenUserExistThereAreNoQuotes_receiveOk() {
		userService.save(TestUtil.createValidUser("user1"));
		ResponseEntity<Object> response = getOldQuotesOfUser(5, "user1", new ParameterizedTypeReference<Object>() {}); 
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
	}
	
	@Test
	public void getNewQuotesOfUser_whenUserExistAndThereAreQuotes_receivePageWithItemsAfterProvidedId() {
		
		QuoteAwayUser user = userService.save(TestUtil.createValidUser("user1"));
		quoteService.save(user, TestUtil.createValidQuote());
		quoteService.save(user, TestUtil.createValidQuote());
		quoteService.save(user, TestUtil.createValidQuote());
		
		FamousQuote fourth = quoteService.save(user, TestUtil.createValidQuote());
		quoteService.save(user, TestUtil.createValidQuote());
		
		ResponseEntity<List<Object>> response = getNewQuotesOfUser(fourth.getId(), "user1", new ParameterizedTypeReference<List<Object>>() {}); 
		assertThat(response.getBody().size()).isEqualTo(1);
	}
	
	@Test
	public void getNewQuotesOfUser_whenUserDoesNotExist_receiveNotFound() {
		ResponseEntity<Object> response = getNewQuotesOfUser(5, "user1", new ParameterizedTypeReference<Object>() {}); 
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
	}

	@Test
	public void getNewQuotesOfUser_whenUserExistAndThereAreNoQuotes_receivePageWithZeroItemsBeforeProvidedId() {
		
		QuoteAwayUser user = userService.save(TestUtil.createValidUser("user1"));
		quoteService.save(user, TestUtil.createValidQuote());
		quoteService.save(user, TestUtil.createValidQuote());
		quoteService.save(user, TestUtil.createValidQuote());
		
		FamousQuote fourth = quoteService.save(user, TestUtil.createValidQuote());
		quoteService.save(user, TestUtil.createValidQuote());
		
		userService.save(TestUtil.createValidUser("user2"));
		
		ResponseEntity<List<Object>> response = getNewQuotesOfUser(fourth.getId(), "user2", new ParameterizedTypeReference<List<Object>>() {}); 
		assertThat(response.getBody().size()).isEqualTo(0);
	}	
	
	@Test
	public void getNewQuoteCount_whenThereAreQuotes_receiveCountAfterProvidedId() {
		
		QuoteAwayUser user = userService.save(TestUtil.createValidUser("user1"));
		quoteService.save(user, TestUtil.createValidQuote());
		quoteService.save(user, TestUtil.createValidQuote());
		quoteService.save(user, TestUtil.createValidQuote());
		
		FamousQuote fourth = quoteService.save(user, TestUtil.createValidQuote());
		quoteService.save(user, TestUtil.createValidQuote());
		
		ResponseEntity<Map<String, Long>> response = getNewQuoteCount(fourth.getId(), new ParameterizedTypeReference<Map<String, Long>>() {}); 
		assertThat(response.getBody().get("count")).isEqualTo(1);
	}
	
	@Test
	public void getNewQuoteCountOfUser_whenThereAreQuotes_receiveCountAfterProvidedId() {
		
		QuoteAwayUser user = userService.save(TestUtil.createValidUser("user1"));
		quoteService.save(user, TestUtil.createValidQuote());
		quoteService.save(user, TestUtil.createValidQuote());
		quoteService.save(user, TestUtil.createValidQuote());
		
		FamousQuote fourth = quoteService.save(user, TestUtil.createValidQuote());
		quoteService.save(user, TestUtil.createValidQuote());
		
		userService.save(TestUtil.createValidUser("user2"));
		
		ResponseEntity<Map<String, Long>> response = getNewQuoteCountOfUser(fourth.getId(), "user1", new ParameterizedTypeReference<Map<String, Long>>() {}); 
		assertThat(response.getBody().get("count")).isEqualTo(1);
	}	
	
	@Test
	public void deleteQuote_whenUserIsUnAuthorized_receiveUnauthorized() {
		ResponseEntity<Object> response = deleteQuote(555, Object.class);
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
	}

	@Test
	public void deleteQuote_whenUserIsAuthorized_receiveOk() {
		QuoteAwayUser user = userService.save(TestUtil.createValidUser("user1"));
		authenticate("user1");
		FamousQuote quote = quoteService.save(user, TestUtil.createValidQuote());
	
		ResponseEntity<Object> response = deleteQuote(quote.getId(), Object.class);
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
	}

	@Test
	public void deleteQuote_whenUserIsAuthorized_quoteRemovedFromDatabase() {
		QuoteAwayUser user = userService.save(TestUtil.createValidUser("user1"));
		authenticate("user1");
		FamousQuote quote = quoteService.save(user, TestUtil.createValidQuote());
		
		deleteQuote(quote.getId(), Object.class);
		Optional<FamousQuote> inDB = quoteRepository.findById(quote.getId());
		assertThat(inDB.isPresent()).isFalse();
	}

	@Test
	public void deleteQuote_whenQuoteIsOwnedByAnotherUser_receiveForbidden() {
		userService.save(TestUtil.createValidUser("user1"));
		authenticate("user1");
		QuoteAwayUser quoteOwner = userService.save(TestUtil.createValidUser("quote-owner"));
		
		FamousQuote quote = quoteService.save(quoteOwner, TestUtil.createValidQuote());
		
		ResponseEntity<Object> response = deleteQuote(quote.getId(), Object.class);
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
	}

	@Test
	public void deleteQuote_whenQuoteDoesNotExist_receiveForbidden() {
		userService.save(TestUtil.createValidUser("user1"));
		authenticate("user1");
		
		ResponseEntity<Object> response = deleteQuote(555, Object.class);
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
	}

	@Test
	public void deleteQuote_whenUserIsAuthorized_receiveGenericResponse() {
		QuoteAwayUser user = userService.save(TestUtil.createValidUser("user1"));
		authenticate("user1");
		FamousQuote quote = quoteService.save(user, TestUtil.createValidQuote());
		
		ResponseEntity<GenericResponse> response = deleteQuote(quote.getId(), GenericResponse.class);
		assertThat(response.getBody().getMessage()).isNotNull();
	}

	public <T> ResponseEntity<T> getNewQuotes(long quoteId, ParameterizedTypeReference<T> responseType){
		String path = API_1_0_QUOTES + "/" + quoteId + "?direction=after&page=0&size=5&sort=id,desc";
		return testRestTemplate.exchange(path, HttpMethod.GET, null, responseType);	
	}
	
	public <T> ResponseEntity<T> getNewQuoteCount(long quoteId, ParameterizedTypeReference<T> responseType){
		String path = API_1_0_QUOTES + "/" + quoteId +"?direction=after&count=true";
		return testRestTemplate.exchange(path, HttpMethod.GET, null, responseType);
	}
	
	public <T> ResponseEntity<T> deleteQuote(long quoteId, Class<T> responseType){
		return testRestTemplate.exchange(API_1_0_QUOTES + "/" + quoteId, HttpMethod.DELETE, null, responseType);
	}	
	
	public <T> ResponseEntity<T> getNewQuotesOfUser(long quoteId, String username, ParameterizedTypeReference<T> responseType){
		String path = "/api/1.0/users/"+ username + "/quotes/" + quoteId + "?direction=after&page=0&size=5&sort=id,desc";
		return testRestTemplate.exchange(path, HttpMethod.GET, null, responseType);	
	}
	public <T> ResponseEntity<T> getNewQuoteCountOfUser(long quoteId, String username, ParameterizedTypeReference<T> responseType){
		String path = "/api/1.0/users/"+ username + "/quotes/" + quoteId + "?direction=after&count=true";
		return testRestTemplate.exchange(path, HttpMethod.GET, null, responseType);	
	}
	
	public <T> ResponseEntity<T> getOldQuotes(long quoteId, ParameterizedTypeReference<T> responseType){
		String path = API_1_0_QUOTES + "/" + quoteId + "?direction=before&page=0&size=5&sort=id,desc";
		return testRestTemplate.exchange(path, HttpMethod.GET, null, responseType);	
	}
	
	public <T> ResponseEntity<T> getOldQuotesOfUser(long quoteId, String username, ParameterizedTypeReference<T> responseType){
		String path = "/api/1.0/users/"+ username + "/quotes/" + quoteId + "?direction=before&page=0&size=5&sort=id,desc";
		return testRestTemplate.exchange(path, HttpMethod.GET, null, responseType);	
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
