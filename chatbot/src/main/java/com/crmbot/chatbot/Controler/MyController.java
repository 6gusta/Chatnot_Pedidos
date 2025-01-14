package com.crmbot.chatbot.Controler;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.crmbot.chatbot.Model.Admin;
import com.crmbot.chatbot.Service.ServiceUser;

@RestController
@RequestMapping("/api/admin")
public class MyController {

    @Autowired
    private ServiceUser adminService;

    @PostMapping
    public ResponseEntity<?> createAdmin(@RequestBody Admin admin) {
        Admin createdAdmin = adminService.createAdmin(admin);
        return ResponseEntity.ok(createdAdmin);
    }

    @GetMapping("/")
    public String homePage() {
        return "index"; // Retorna o nome do template index".html
    }

}
