package com.crmbot.chatbot.infra.securaty;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.http.HttpStatus;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()  // Desabilitar CSRF para facilitar testes
            .authorizeHttpRequests()
            .requestMatchers("/api/admin", "/sendData", "/getPedidos", "/api/pedidos/**", "/GetNumero").permitAll()// Permite o acesso ao endpoint de criação de admin
            .requestMatchers("/pedido").permitAll()  
            .anyRequest().authenticated()  // Requer autenticação para qualquer outra requisição
            .and()
            .formLogin()
                .loginProcessingUrl("/login")  // URL que processa o login
                .defaultSuccessUrl("http://127.0.0.1:5500/chatbot/src/main/resources/templates/index.html", true) // Redireciona para a página externa
                .failureHandler((request, response, exception) -> {
                    response.setContentType("application/json");
                    response.setStatus(HttpStatus.UNAUTHORIZED.value());
                    response.getWriter().write("{\"message\": \"Login failed: " + exception.getMessage() + "\"}");
                })
                .permitAll()
            .and()
            .logout()
                .permitAll();
        
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
