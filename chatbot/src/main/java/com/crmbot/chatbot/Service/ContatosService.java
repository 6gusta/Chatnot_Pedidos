package com.crmbot.chatbot.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.crmbot.chatbot.Model.Intems;
import com.crmbot.chatbot.Model.Pedidos;
import com.crmbot.chatbot.Repository.IntesRepository;
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

    

    @Autowired

    private IntesRepository intemsRepository;

    public Intems InserirEstoque(  String nomeProduto, String valor,String qtdeEstoque ){
        Intems intens = new Intems();

        intens.setNomeProduto(nomeProduto);
        intens.setValor(valor);
        intens.setQtdeEstoque(qtdeEstoque);


        return  intemsRepository.save(intens);


    }
   
    public Pedidos PedidosClientes(String Nome, String IntemPedido, String FormaDepagamneto , String numero ) {
        try {

            LocalDateTime dataHoraAtual = LocalDateTime.now();
            Pedidos pedidos = new Pedidos();
            pedidos.setNome(Nome);
            pedidos.setIntemPedido(IntemPedido);
            pedidos.setFormaDepagamneto(FormaDepagamneto);
            pedidos.setDataHoraRecebimento(dataHoraAtual);
            pedidos.setNumero(numero);
            

            List<Intems> itens = intemsRepository.findByNomeProduto(IntemPedido);

            if (!itens.isEmpty()) {  // Verifica se encontrou pelo menos um item
                Intems item = itens.get(0);  // Pega o primeiro item da lista
                double total = Double.parseDouble(item.getValor());  // Converte o valor para double
                pedidos.setTotal(total);
            } else {
                pedidos.setTotal(0);  // Caso não encontre o item, define total como 0
            }
            
            

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

@Transactional
public Pedidos EmAndamentos( Long pedidoId){
    System.out.println("mundando status para em Andamento do pedido com ID: " + pedidoId);
    return pedidosRepository.findById(pedidoId)
    .map(pedido ->{
        try {

            pedido.setStatus("emAndamento");
            Pedidos pesalvos = pedidosRepository.save(pedido);
            System.out.println("Pedido salvo: " + pesalvos);
            LocalDateTime dataHoraAtual = LocalDateTime.now();
            Pedidos pedidos = new Pedidos();
            pedidos.setDataHoraRecebimento(dataHoraAtual);

            return pesalvos;
            
        } catch (Exception e) {

            System.err.println("Erro ao salvar o pedido: " + e.getMessage()); // Log de erro
            e.printStackTrace(); // Imprime o stack trace para depuração
            throw new RuntimeException("Erro ao salvar o pedido: " + e.getMessage(), e);
            // TODO: handle exception
        }

    })
    .orElseThrow(() -> new RuntimeException("Pedido não encontrado com ID: " + pedidoId));
}

@Transactional
public Pedidos SaiuPraEntrega(Long pedidoId){
    System.out.println("mundando status para Saiu Pra entrega  do pedido com ID: " + pedidoId);

    return  pedidosRepository.findById(pedidoId)
    .map(pedidos ->{
        try {
            pedidos.setStatus("saiuPraEntrega");
            Pedidos pedidoentrega = pedidosRepository.save(pedidos);
            System.out.println("Pedido salvo: " + pedidoentrega);
            LocalDateTime dataHoraAtual = LocalDateTime.now();
            Pedidos pedidosentrega = new Pedidos();
            pedidos.setDataHoraRecebimento(dataHoraAtual);
            return pedidoentrega;
        } catch (Exception e) {
            System.err.println("Erro ao salvar o pedido: " + e.getMessage()); // Log de erro
            e.printStackTrace(); // Imprime o stack trace para depuração
            throw new RuntimeException("Erro ao salvar o pedido: " + e.getMessage(), e);
            // TODO: handle exception
        
        }

    }) .orElseThrow(() -> new RuntimeException("Pedido não encontrado com ID: " + pedidoId));
}






    public List<Pedidos> buscarPedidosPorStatus(String status) {
        System.out.println("Buscando pedidos com status: " + status);
        System.out.println("Consultando banco de dados para o status: " + status);
        return pedidosRepository.findByStatus(status); 
    }


    public List<Intems> BuscaEstoque(  String  NomeProduto){

        System.out.println("Buscando intem...: " + NomeProduto);

        

        return    intemsRepository.findByNomeProduto(NomeProduto);
  

        
    }


public  boolean ExcluirdoEstoque(Long idIntems ){
    try {
        System.out.println("busacando do estoque pra excluir com o id "+ idIntems);
        Intems intens = intemsRepository.findById(idIntems).orElse(null);

        if(intens == null){
            System.out.println("Intem com o ID " + idIntems+ " não encontrado");
            return false;
        }

        System.out.println("Intem Encontrado"+ intens.toString() + " Tentato retirar do Estoque...." );


        intemsRepository.delete(intens);

        System.out.println("Intem com ID " + idIntems + " excluído com sucesso.");

        return true; 


    } catch (Exception e) {
        System.err.println("Erro ao tentar cancelar o Intems com ID " + idIntems+ ": " + e.getMessage());
        e.printStackTrace(); 
        return false; 
    }
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

    

    

