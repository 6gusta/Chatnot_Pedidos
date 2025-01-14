package com.crmbot.chatbot.infra.securaty;

import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import com.crmbot.chatbot.Repository.AdminRepository;
import com.crmbot.chatbot.Model.Admin;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private AdminRepository adminRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Admin admin = adminRepository.findByUsername(username); // Seu código de obtenção do usuário
        if (admin == null) {
            throw new UsernameNotFoundException("User not found");
        }
        // Remova o prefixo 'ROLE_' caso ele já esteja presente no papel (role)
        String role = admin.getRole();
        if (role.startsWith("ROLE_")) {
            role = role.substring(5); // Remover 'ROLE_' do início da string
        }
    
        return new User(admin.getUsername(), admin.getPassword(), 
                        Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role)));
    }
}
