package com.QuoteAway.quote;

import java.util.Date;
import java.util.List;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.QuoteAway.quote.vm.QuoteVM;
import com.QuoteAway.users.User;
import com.QuoteAway.users.UserService;

@Service
public class QuoteService {
	
	QuoteRepository quoteRepository;
	
	UserService userService;

	public QuoteService(QuoteRepository quoteRepository, UserService userService) {
		super();
		this.quoteRepository = quoteRepository;
		this.userService = userService;
	}
	
	public FamousQuote save(User user, FamousQuote quote) {
		quote.setTimestamp(new Date());
		quote.setUser(user);
		return quoteRepository.save(quote);
	}
	
	public Page<FamousQuote> getAllQuotes(Pageable pageable){
		return quoteRepository.findAll(pageable);
	}

	public Page<FamousQuote> getQuotesOfUser(String username, Pageable pageable) {
		User inDB = userService.getByUsername(username); 
		return quoteRepository.findByUser(inDB, pageable);
	}

	public Page<FamousQuote> getOldQuotes(long id, String username, Pageable pageable) {
		Specification<FamousQuote> spec = Specification.where(idLessThan(id));
		if(username != null) {
			User inDB = userService.getByUsername(username);
			spec = spec.and(userIs(inDB));
//		return quoteRepository.findByIdLessThanAndUser(id, inDB, pageable);
		}	

		return quoteRepository.findAll(spec, pageable);
//		return quoteRepository.findByIdLessThan(id, pageable);
	}

	public List<FamousQuote> getNewQuotes(long id, String username, Pageable pageable) {
		/* we're not using pageable since we need a list and not a page
		   including page for after(that is new quotes) will complicate the process, so we go with getting
		   the list of famous quotes instead of getting them page wise. */
		Specification<FamousQuote> spec = Specification.where(idGreaterThan(id));
		
		if(username != null) {			
			User inDB = userService.getByUsername(username);
			spec = spec.and(userIs(inDB));
//			return quoteRepository.findByIdGreaterThanAndUser(id, inDB, pageable.getSort());
		}
		
		return quoteRepository.findAll(spec, pageable.getSort());
//		return quoteRepository.findByIdGreaterThan(id, pageable.getSort());
	}
	


	public long getNewQuotesCount(long id, String username) {
		Specification<FamousQuote> spec = Specification.where(idGreaterThan(id));
		
		if(username != null) {
			User inDB = userService.getByUsername(username);
			spec = spec.and(userIs(inDB));
//			return quoteRepository.countByIdGreaterThanAndUser(id, inDB);	
		}
		return quoteRepository.count(spec);
//		return quoteRepository.countByIdGreaterThan(id);
	}
	
	private Specification<FamousQuote> userIs(User user){
		return (root, query, criteriaBuilder) -> {
				return criteriaBuilder.equal(root.get("user"), user);
		};
	}
	
	private Specification<FamousQuote> idLessThan(long id){
		return (root, query, criteriaBuilder) -> {
			return criteriaBuilder.lessThan(root.get("id"), id);
		};	
	}
	private Specification<FamousQuote> idGreaterThan(long id){
		return (root, query, criteriaBuilder) -> {
			return criteriaBuilder.greaterThan(root.get("id"), id);
		};	
	}
/* 
	public Page<FamousQuote> getOldQuotesOfUser(long id, String username, Pageable pageable) {
		User inDB = userService.getByUsername(username);
		return quoteRepository.findByIdLessThanAndUser(id, inDB, pageable);
	}
	
	public List<FamousQuote> getNewQuotesOfUser(long id, String username, Pageable pageable) {	
		User inDB = userService.getByUsername(username);
		return quoteRepository.findByIdGreaterThanAndUser(id, inDB, pageable.getSort());
	}
	
	public long getNewQuotesCountOfUser(long id, String username) {
		return quoteRepository.countByIdGreaterThanAndUser(id, userService.getByUsername(username));
	}
*/

	public void deleteQuote(long id) {
		quoteRepository.deleteById(id);
	}
} 