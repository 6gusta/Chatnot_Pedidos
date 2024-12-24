package com.crmbot.chatbot.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.crmbot.chatbot.Model.Contato;


public interface ContatoRepository  extends JpaRepository<Contato, Long>  {
    
}
