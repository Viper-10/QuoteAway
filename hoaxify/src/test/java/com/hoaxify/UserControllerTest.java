package com.hoaxify;

import static org.assertj.core.api.Assertions.assertThat;

import java.io.File;
import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.stream.IntStream;

import org.apache.commons.io.FileUtils;
import org.junit.After;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.support.BasicAuthenticationInterceptor;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import com.hoaxify.configuration.AppConfiguration;
import com.hoaxify.error.ApiError;
import com.hoaxify.shared.GenericResponse;
import com.hoaxify.users.User;
import com.hoaxify.users.UserRepository;
import com.hoaxify.users.UserService;
import com.hoaxify.users.vm.UserUpdateVM;
import com.hoaxify.users.vm.UserVM;

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
	
	@Autowired
	UserService userService;
	
	@Autowired
	AppConfiguration appConfiguration; 
	
	private UserUpdateVM createValidUserUpdateVM() {
		UserUpdateVM updateUser = new UserUpdateVM(); 
		updateUser.setDisplayName("newDisplayName");
		return updateUser; 
	}
	
	private ResponseEntity<Object> postSignUp(){
		User user = createValidUser(); 
		ResponseEntity<Object> response = testRestTemplate.postForEntity(API_1_0_USERS, user, Object.class);
		return response; 
	}
	
	public void authenticate(String username) {
		testRestTemplate.getRestTemplate().getInterceptors().add(new BasicAuthenticationInterceptor(username, "P4ssword$")); 
	}
	
	private <T> ResponseEntity<T> getUser(String username, Class<T> responseType) {
		String path = API_1_0_USERS + "/" + username; 
		
		return testRestTemplate.getForEntity(path, responseType);
	}
	private <T> ResponseEntity<T> putUser(long id, HttpEntity<?> requestEntity, Class<T> responseType) {
		String path = API_1_0_USERS + "/" + id; 
		return testRestTemplate.exchange(path, HttpMethod.PUT, requestEntity, responseType);
	}
	
	private <T> ResponseEntity<T> getUsers(ParameterizedTypeReference<T> parameterizedTypeReference) {
		return testRestTemplate.exchange(API_1_0_USERS, HttpMethod.GET, null, parameterizedTypeReference);
	}
	
	private <T> ResponseEntity<T> getUsers(ParameterizedTypeReference<T> parameterizedTypeReference, String path) {
		return testRestTemplate.exchange(path, HttpMethod.GET, null, parameterizedTypeReference);
	}
	
	private String readFileToBase64(String fileName) throws IOException{
		ClassPathResource imageResource = new ClassPathResource(fileName); 
		byte[] imageArr = FileUtils.readFileToByteArray(imageResource.getFile());
		String imageString = Base64.getEncoder().encodeToString(imageArr); 
		return imageString;
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

	@Test
	public void getUser_whenPageIsRequestedFor3ItemsPerPageWhereDBHas20Users_receive3Users() {
		IntStream
			.rangeClosed(1, 20)
			.mapToObj(i -> "test-user-" + i)
			.map(TestUtil::createValidUser).forEach(userRepository::save);
		
		String path = API_1_0_USERS + "?page=0&size=3";
		
		ResponseEntity<TestPage<Object>> response = getUsers(new ParameterizedTypeReference<TestPage<Object>>() {}, path);
		
		assertThat(response.getBody().getContent().size()).isEqualTo(3);
	}
	
	
	@Test
	public void getUser_whenPageSizeIsNotProvided_receivePageSizeAs10() {
		ResponseEntity<TestPage<Object>> response = getUsers(new ParameterizedTypeReference<TestPage<Object>>() {});
		assertThat(response.getBody().getSize()).isEqualTo(10); 
	}
	
	
	@Test
	public void getUser_whenPageSizeIsGreaterThan100_receivePageSizeAs100() {
		String path = API_1_0_USERS + "?size=500";
		ResponseEntity<TestPage<Object>> response = getUsers(new ParameterizedTypeReference<TestPage<Object>>() {}, path);
		assertThat(response.getBody().getSize()).isEqualTo(100); 
	}
	
	@Test
	public void getUser_whenPageSizeIsNegative_receivePageSizeAs10() {
		String path = API_1_0_USERS + "?size=-5";
		ResponseEntity<TestPage<Object>> response = getUsers(new ParameterizedTypeReference<TestPage<Object>>() {}, path);
		assertThat(response.getBody().getSize()).isEqualTo(10); 
	}
	@Test
	public void getUser_whenPageSizeIsNegative_receiveFirstPage() {
		String path = API_1_0_USERS + "?size=-5";
		ResponseEntity<TestPage<Object>> response = getUsers(new ParameterizedTypeReference<TestPage<Object>>() {}, path);
		assertThat(response.getBody().getNumber()).isEqualTo(0); 
	}
	
	@Test
	public void getUser_whenUserLoggedIn_receivePageWithoutLoggedInUser() {
		userService.save(TestUtil.createValidUser("user1"));
		userService.save(TestUtil.createValidUser("user2"));
		userService.save(TestUtil.createValidUser("user3"));
		
		authenticate("user1"); 
		
		ResponseEntity<TestPage<Object>> response = getUsers(new ParameterizedTypeReference<TestPage<Object>>() {});
		
		assertThat(response.getBody().getTotalElements()).isEqualTo(2);
		
	}
	
	@Test
	public void getUserByUsername_whenUserExist_receiveOk() {
		String username = "test-user"; 
		userService.save(TestUtil.createValidUser(username));
		ResponseEntity<Object> response = getUser(username, Object.class);
		
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
		
	}
	
	@Test
	public void getUserByUsername_whenUserDoesNotExist_receiveNotFound() {
		String username = "unknown-user"; 
		ResponseEntity<Object> response = getUser(username, Object.class);
		
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
		
	}
	@Test
	public void getUserByUsername_whenUserDoesNotExist_receiveApiError() {
		String username = "unknown-user"; 
		ResponseEntity<ApiError> response = getUser(username, ApiError.class);
		
		assertThat(response.getBody().getMessage().contains("unknown-user")).isTrue();
	}
	
	@Test
	public void getUserByUsername_whenUserExist_receiveWithoutPassword() {
		String username = "test-user"; 
		userService.save(TestUtil.createValidUser(username));
		ResponseEntity<String> response = getUser(username, String.class);
		
		assertThat(response.getBody().contains("password")).isFalse();		
	}

	
	@Test 
	public void putUser_whenUnauthorizedUserSendsTheRequest_receiveUnauthorized() {
		ResponseEntity<Object> response = putUser(123, null, Object.class); 
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED); 		
	}	
	
	@Test 
	public void putUser_whenAuthorizedUserSendsUpdateForAnotherUser_receiveForbidden() {
		User user = userService.save(TestUtil.createValidUser("user1"));
		authenticate(user.getUsername());
		
		// random user id 
		long anotherUserId = user.getId() + 123; 
		
		ResponseEntity<Object> response = putUser(anotherUserId, null, Object.class); 
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN); 		
	}
	
	@Test 
	public void putUser_whenValidRequestBodyFromAuthorizedUser_receiveOK() {
		User user = userService.save(TestUtil.createValidUser("user1"));
		authenticate(user.getUsername());
		
		UserUpdateVM updatedUser = createValidUserUpdateVM(); 
		
		HttpEntity<UserUpdateVM> requestEntity = new HttpEntity<>(updatedUser); 
		ResponseEntity<Object> response = putUser(user.getId(), requestEntity, Object.class);
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
	}
	
	@Test 
	public void putUser_whenValidRequestBodyFromAuthorizedUser_checkDisplayNameUpdated() {
		User user = userService.save(TestUtil.createValidUser("user1"));
		authenticate(user.getUsername());
		
		UserUpdateVM updatedUser = new UserUpdateVM(); 
		updatedUser.setDisplayName("newDisplayName");
		
		HttpEntity<UserUpdateVM> requestEntity = new HttpEntity<>(updatedUser); 
		
		putUser(user.getId(), requestEntity, Object.class);
		
		User userInDB = userRepository.findByUsername("user1"); 
		assertThat(userInDB.getDisplayName()).isEqualTo(updatedUser.getDisplayName()); 
	}
	@Test 
	public void putUser_whenValidRequestBodyFromAuthorized_receiveUserVMwithUpdatedDisplayName() {
		User user = userService.save(TestUtil.createValidUser("user1"));
		authenticate(user.getUsername());
		
		UserUpdateVM updatedUser = createValidUserUpdateVM(); 
		
		HttpEntity<UserUpdateVM> requestEntity = new HttpEntity<>(updatedUser); 
		ResponseEntity<UserVM> response = putUser(user.getId(), requestEntity, UserVM.class);
		
		assertThat(response.getBody().getDisplayName()).isEqualTo(updatedUser.getDisplayName()); 
	}
	
	@Test 
	public void putUser_whenAuthorizedUserSendsUpdateForAnotherUser_receiveApiError() {
		User user = userService.save(TestUtil.createValidUser("user1"));
		authenticate(user.getUsername());
		
		// random user id 
		long anotherUserId = user.getId() + 123; 
		
		ResponseEntity<ApiError> response = putUser(anotherUserId, null, ApiError.class); 
		assertThat(response.getBody().getUrl()).contains("/users/" + anotherUserId); 		
	}
	
	@Test 
	public void putUser_whenUnauthorizedUserSendsTheRequest_receiveApiError() {
		ResponseEntity<ApiError> response = putUser(123, null, ApiError.class); 
		assertThat(response.getBody().getUrl()).contains("users/123"); 		
	}	
	
	
	@Test
	public void putUser_withValidRequestBodyWithSupportedImageFromAuthorizedUser_receiveUserVMWithRandomImageName() throws IOException {
		User user = userService.save(TestUtil.createValidUser("user1")); 
		authenticate(user.getUsername()); 		
		UserUpdateVM updatedUser = createValidUserUpdateVM(); 
		
		String imageString = readFileToBase64("profile.png");  
		
		updatedUser.setImage(imageString);
		
		HttpEntity<UserUpdateVM> requestEntity = new HttpEntity<>(updatedUser); 
		ResponseEntity<UserVM> response = putUser(user.getId(), requestEntity, UserVM.class);
		
		
		assertThat(response.getBody().getImage()).isNotEqualTo("profile-image.png");
	}
	
	@Test
	public void putUser_withValidRequestBodyWithSupportedImageFromAuthorizedUser_imageIsStoredUnderProfileFolder() throws IOException {
		User user = userService.save(TestUtil.createValidUser("user1")); 
		authenticate(user.getUsername()); 		
		UserUpdateVM updatedUser = createValidUserUpdateVM(); 
		
		String imageString = readFileToBase64("profile.png");  
		
		updatedUser.setImage(imageString);
		
		HttpEntity<UserUpdateVM> requestEntity = new HttpEntity<>(updatedUser); 
		ResponseEntity<UserVM> response = putUser(user.getId(), requestEntity, UserVM.class);
		
		String storedImageName = response.getBody().getImage(); 
		String profilePicturePath = appConfiguration.getFullProfileImagesPath() + "/" + storedImageName; 
		
		File storedImage = new File(profilePicturePath); 
		assertThat(storedImage.exists()).isTrue(); 
	}
	
	// clears upload-test/profiles after each test
	@After 
	public void cleanDirectory() throws IOException {
		FileUtils.cleanDirectory(new File(appConfiguration.getFullProfileImagesPath()));
		FileUtils.cleanDirectory(new File(appConfiguration.getFullAttachmentsPath()));
	}
	
	
}
