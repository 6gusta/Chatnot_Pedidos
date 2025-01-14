package com.crmbot.chatbot.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.crmbot.chatbot.Model.Admin;

public interface  UserRepository extends JpaRepository<Admin, Long>{

    Admin findByUsername(String username);
    
}
