package com.QuoteAway.quote;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.QuoteAway.users.User;
 
public interface QuoteRepository extends JpaRepository<FamousQuote, Long>{
	
	Page<FamousQuote> findByUser(User user, Pageable pageable);
}
