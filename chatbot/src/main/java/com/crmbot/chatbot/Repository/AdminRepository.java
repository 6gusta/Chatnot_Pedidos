package com.crmbot.chatbot.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.crmbot.chatbot.Model.Admin;


public interface AdminRepository extends JpaRepository<Admin, Long> {

    Optional<Admin> findById(Long id);

    Admin findByUsername(String username);  

    
    
}
