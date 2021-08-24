package com.hoaxify.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hoaxify.entities.User;

public interface UserRepository extends JpaRepository<User, Long>{

}
