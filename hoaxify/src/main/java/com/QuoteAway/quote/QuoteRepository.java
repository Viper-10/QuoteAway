package com.QuoteAway.quote;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.QuoteAway.users.User;
 
public interface QuoteRepository extends JpaRepository<FamousQuote, Long>, JpaSpecificationExecutor<FamousQuote>{
	
	// for Userpage
	Page<FamousQuote> findByUser(User user, Pageable pageable);
	
	
	// using spec instead of these repository methods.
	/*
	 * //for getOldQuotes (homepage) Page<FamousQuote> findByIdLessThan(long id,
	 * Pageable pageable);
	 * 
	 * //for getOldQuotes (Userpage) Page<FamousQuote> findByIdLessThanAndUser(long
	 * id, User user, Pageable pageable);
	 * 
	 * // we're not using pageable since we need a list and not a page // including
	 * page for after(that is new quotes) will complicate the process, so we go with
	 * getting // the list of famous quotes instead of getting them page wise.
	 * 
	 * // for getNewQuotes (homepage) List<FamousQuote> findByIdGreaterThan(long id,
	 * Sort sort);
	 * 
	 * // for getNewQuotes (userpage) List<FamousQuote>
	 * findByIdGreaterThanAndUser(long id, User user, Sort sort);
	 * 
	 * long countByIdGreaterThan(long id);
	 * 
	 * long countByIdGreaterThanAndUser(long id, User user);
	 */
}
