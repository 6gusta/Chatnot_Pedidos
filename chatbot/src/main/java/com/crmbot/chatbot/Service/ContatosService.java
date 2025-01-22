package com.crmbot.chatbot.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.crmbot.chatbot.Model.Pedidos;
import com.crmbot.chatbot.Repository.PedidosRepository;
import com.crmbot.chatbot.Websocket.WebSocketEndpoint;
import com.fasterxml.jackson.core.JsonProcessingException;

import org.springframework.cache.annotation.Cacheable;
import jakarta.transaction.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ContatosService {



    @Autowired
    private PedidosRepository pedidosRepository;

    


   
    public Pedidos PedidosClientes(String Nome, String IntemPedido, String FormaDepagamneto , String numero ) {
        try {

            LocalDateTime dataHoraAtual = LocalDateTime.now();
            Pedidos pedidos = new Pedidos();
            pedidos.setNome(Nome);
            pedidos.setIntemPedido(IntemPedido);
            pedidos.setFormaDepagamneto(FormaDepagamneto);
            pedidos.setDataHoraRecebimento(dataHoraAtual);
            pedidos.setNumero(numero);

            System.out.println("=-=-=-=- Pedido =-=-=-=- ");
            System.out.println("Pedido : " + pedidos.getIntemPedido());
            System.out.println("Nome Do Cliente : " + pedidos.getNome());
            System.out.println("Forma de Pagamento : " + pedidos.getFormaDepagamneto());
            System.out.println("Nome Do Cliente : " + pedidos.getNumero());


            return pedidosRepository.save(pedidos);

        } catch (Exception e) {
            System.out.println("Erro ao enviar os pedidos: " + e.getMessage());
        }
        return null;
    }



    @Transactional
    public Pedidos finalizarpedido(Long pedidoId) {
    System.out.println("Iniciando finalização do pedido com ID: " + pedidoId);
    return pedidosRepository.findById(pedidoId)
            .map(pedido -> {
                try {
                    pedido.setStatus("Finalizado");
                    Pedidos pedidoSalvo = pedidosRepository.save(pedido);
                    System.out.println("Pedido salvo: " + pedidoSalvo);
                    LocalDateTime dataHoraAtual = LocalDateTime.now();
                    Pedidos pedidos = new Pedidos();
                    pedidos.setDataHoraRecebimento(dataHoraAtual);
                    return pedidoSalvo;
                
                } catch (Exception e) {
                    System.err.println("Erro ao salvar o pedido: " + e.getMessage()); // Log de erro
                    e.printStackTrace(); // Imprime o stack trace para depuração
                    throw new RuntimeException("Erro ao salvar o pedido: " + e.getMessage(), e); // Re-lança a exceção!
                }
            })
            .orElseThrow(() -> new RuntimeException("Pedido não encontrado com ID: " + pedidoId));
}



    public List<Pedidos> buscarPedidosPorStatus(String status) {
        System.out.println("Buscando pedidos com status: " + status);
        System.out.println("Consultando banco de dados para o status: " + status);
        return pedidosRepository.findByStatus(status); 
    }

public boolean cancelarPedido(Long pedidoId) {
        try {

            System.out.println("Tentando cancelar o pedido com ID: " +pedidoId);
    
        
            Pedidos pedido = pedidosRepository.findById(pedidoId).orElse(null);
            
            if (pedido == null) {
                System.out.println("Pedido com ID " + pedidoId + " não encontrado.");
                return false;
            }
    
    
            System.out.println("Pedido encontrado: " + pedido.toString() + ". Tentando excluir...");
    
        
            pedidosRepository.delete(pedido);
    
        
            System.out.println("Pedido com ID " + pedidoId + " excluído com sucesso.");
            return true; 
        } catch (Exception e) {
        
            System.err.println("Erro ao tentar cancelar o pedido com ID " + pedidoId + ": " + e.getMessage());
            e.printStackTrace(); 
            return false; 
        }
    }

   public List<Pedidos> buscaPedidoPorTelefone(String numero ){

    System.out.println("Buscando numero de telefone " +numero);

    return pedidosRepository.findByNumero(numero);

    
   }
   public void finalizarPedido(String pedidoId) {
    // Aqui você atualiza o pedido no banco de dados, etc.

    // Depois, notifique todos os clientes via WebSocket
    WebSocketEndpoint.enviarAtualizacao(pedidoId, "Finalizado");
}





}

    

    

