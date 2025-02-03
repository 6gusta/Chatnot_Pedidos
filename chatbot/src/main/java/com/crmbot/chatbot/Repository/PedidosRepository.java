package com.crmbot.chatbot.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.crmbot.chatbot.Model.Pedidos;


@Repository
public interface PedidosRepository   extends JpaRepository<Pedidos, Long>  {

   

	List<Pedidos> findByStatus(String string);

	List<Pedidos> findByNumero(String numero);

	@Query("SELECT SUM(p.total) FROM Pedidos p WHERE p.dataHoraRecebimento >= CURRENT_DATE")
Optional<Double> calcularTotalVendasDeHoje();
	
	

    
    
}
