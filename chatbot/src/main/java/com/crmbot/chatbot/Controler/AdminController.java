package com.crmbot.chatbot.Controler;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.crmbot.chatbot.Model.Admin;
import com.crmbot.chatbot.Repository.AdminRepository;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminController(AdminRepository adminRepository, PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/create")
    public ResponseEntity<Admin> createAdmin(@RequestBody Admin admin) {
        System.out.println("Recebido: " + admin.getUsername() + ", " + admin.getPassword());
    
        if (adminRepository.findByUsername(admin.getUsername()) != null) {
            System.out.println("Usuário já existe: " + admin.getUsername());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    
        admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        admin.setRole("ROLE_ADMIN");
    
        Admin savedAdmin = adminRepository.save(admin);
        System.out.println("Usuário salvo com sucesso: " + savedAdmin.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(savedAdmin);
    }




    
}
