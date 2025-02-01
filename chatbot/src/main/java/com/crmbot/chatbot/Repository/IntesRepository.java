package com.crmbot.chatbot.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.crmbot.chatbot.Model.Intems;

public interface IntesRepository  extends JpaRepository<Intems, Long> {

    List<Intems> findByNomeProduto(String nomeProduto);

    
}
