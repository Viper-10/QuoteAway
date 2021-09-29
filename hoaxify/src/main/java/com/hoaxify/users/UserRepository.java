package com.hoaxify.users;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UserRepository extends JpaRepository<User, Long>{
	User findByUsername(String username);
	
	Page<User> findByUsernameNot(String username, Pageable pageable); 
	
//	@Query(nativeQuery = true, value = "SELECT * from user")
//	Page<UserProjection> custom_getAllUsersProjection(Pageable pageable);
}
