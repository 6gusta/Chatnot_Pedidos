package com.crmbot.chatbot.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.crmbot.chatbot.Model.Contato;
import com.crmbot.chatbot.Model.Pedidos;
import com.crmbot.chatbot.Repository.ContatoRepository;
import com.crmbot.chatbot.Repository.PedidosRepository;

import jakarta.transaction.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ContatosService {

    @Autowired
    private ContatoRepository contatosRepository;

    @Autowired
    private PedidosRepository pedidosRepository;

    // Método para registrar um contato
    public Contato ContatosCRM(String nome, String DataeHora, String telefone, String formaPagamento, String tipoDeservico) {
        try {
            Contato contato = new Contato();
            contato.setNome(nome);
            contato.setDataeHora(DataeHora);
            contato.setTelefone(telefone);
            contato.setFormaPagamento(formaPagamento);
            contato.setTipoDeservico(tipoDeservico);

            System.out.println("=-=-=-=- Reserva =-=-=-=- ");
            System.out.println("Nome : " + contato.getNome());
            System.out.println("Data e Hora : " + contato.getDataeHora());
            System.out.println("Telefone : " + contato.getTelefone());
            System.out.println("Tipo De Serviço : " + contato.getTipoDeservico());
            System.out.println("Forma de Pagamento : " + contato.getFormaPagamento());

            return contatosRepository.save(contato);

        } catch (Exception e) {
            System.out.println("Erro no cadastro da lead: " + e.getMessage());
            return null;
        }
    }

   
    public Pedidos PedidosClientes(String Nome, String IntemPedido, String FormaDepagamneto) {
        try {

            LocalDateTime dataHoraAtual = LocalDateTime.now();
            Pedidos pedidos = new Pedidos();
            pedidos.setNome(Nome);
            pedidos.setIntemPedido(IntemPedido);
            pedidos.setFormaDepagamneto(FormaDepagamneto);
            pedidos.setDataHoraRecebimento(dataHoraAtual);

           

            System.out.println("=-=-=-=- Pedido =-=-=-=- ");
            System.out.println("Pedido : " + pedidos.getIntemPedido());
            System.out.println("Nome Do Cliente : " + pedidos.getNome());
            System.out.println("Forma de Pagamento : " + pedidos.getFormaDepagamneto());
           

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


   
    public List<Pedidos> buscaPedidosCancelados() {
        return pedidosRepository.findByStatus("Finalizado");  // Exemplo de método para buscar pedidos finalizados
    }


    public List<Pedidos> buscaPedidosPendetes() {
        return pedidosRepository.findByStatus("Pendente");  // Exemplo de método para buscar pedidos finalizados
    }



    public List<Pedidos> buscarPedidosPorStatus(String status) {
        return pedidosRepository.findByStatus(status); // Supondo que você tenha um método no seu repository
    }


    public boolean cancelarPedido(Long pedidoId) {
        try {
            // Logando o ID do pedido que estamos tentando cancelar
            System.out.println("Tentando cancelar o pedido com ID: " +pedidoId);
    
            // Verifica se o pedido existe no banco de dados
            Pedidos pedido = pedidosRepository.findById(pedidoId).orElse(null);
            
            if (pedido == null) {
                System.out.println("Pedido com ID " + pedidoId + " não encontrado.");
                return false; // Pedido não encontrado
            }
    
            // Logando que encontramos o pedido e estamos tentando excluí-lo
            System.out.println("Pedido encontrado: " + pedido.toString() + ". Tentando excluir...");
    
            // Deletando o pedido
            pedidosRepository.delete(pedido);
    
            // Logando o sucesso da exclusão
            System.out.println("Pedido com ID " + pedidoId + " excluído com sucesso.");
            return true; // Pedido excluído com sucesso
        } catch (Exception e) {
            // Logando qualquer erro durante o processo
            System.err.println("Erro ao tentar cancelar o pedido com ID " + pedidoId + ": " + e.getMessage());
            e.printStackTrace(); // Exibe a stack trace completa para entender onde o erro ocorre
            return false; // Retorna false em caso de erro
        }
    }
    
}

    

    

