package com.QuoteAway.quote;

import org.springframework.data.jpa.repository.JpaRepository;

public interface QuoteRepository extends JpaRepository<FamousQuote, Long>{
}
