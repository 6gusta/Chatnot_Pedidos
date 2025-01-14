package com.crmbot.chatbot.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.crmbot.chatbot.Model.Admin;
import com.crmbot.chatbot.Repository.AdminRepository;

@Service
public class ServiceUser {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Admin createAdmin(Admin admin) {
        admin.setPassword(passwordEncoder.encode(admin.getPassword())); // Criptografa a senha
        if (!admin.getRole().startsWith("ROLE_")) {
            admin.setRole("ROLE_" + admin.getRole().toUpperCase()); // Garante o formato correto
        }
        return adminRepository.save(admin);
    }
}
