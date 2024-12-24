package com.crmbot.chatbot.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.crmbot.chatbot.Model.Pedidos;


@Repository
public interface PedidosRepository   extends JpaRepository<Pedidos, Long>  {
    
}
