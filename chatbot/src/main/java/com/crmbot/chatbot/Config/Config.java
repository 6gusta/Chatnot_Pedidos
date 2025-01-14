package com.crmbot.chatbot.Config;

import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

public class Config implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/pedidos/**")  // Permite que as requisições sejam feitas para essa URL
                .allowedOrigins("http://127.0.0.1:5500") // Domínio do frontend
                .allowedMethods("GET", "POST", "PUT", "DELETE") // Métodos permitidos
                .allowedHeaders("*"); // Permite todos os cabeçalhos

        // Adicionando as rotas de autenticação (login e register)
        registry.addMapping("/auth/**") // Permite as rotas de autenticação
                .allowedOrigins("http://127.0.0.1:5500") // Domínio do frontend
                .allowedMethods("POST") // Permite apenas POST para login e register
                .allowedHeaders("*"); // Permite todos os cabeçalhos
    }
}
