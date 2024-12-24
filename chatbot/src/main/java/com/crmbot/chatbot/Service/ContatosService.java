package com.crmbot.chatbot.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.crmbot.chatbot.Model.Contato;
import com.crmbot.chatbot.Model.Pedidos;
import com.crmbot.chatbot.Repository.ContatoRepository;
import com.crmbot.chatbot.Repository.PedidosRepository;
import java.util.List;  // Importando a interface correta para List
import java.util.ArrayList;

@Service
public class ContatosService {

    @Autowired
    private ContatoRepository contatosRepository;

    @Autowired
    private PedidosRepository pedidosRepository;

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
            System.out.println(" Data e Hora  : " + contato.getDataeHora());
            System.out.println("Telefone : " + contato.getTelefone());
            System.out.println(" Tipo De Serviço  : " + contato.getTipoDeservico());
            System.out.println(" Forma de Pagamento : " + contato.getFormaPagamento());

            return contatosRepository.save(contato);

        } catch (Exception e) {
            System.out.println(" erro no cadastro da lead" + e.getMessage());
            return null;
        }
    }

    public Pedidos PedidosClientes(String Nome, String IntemPedido, String FormaDepagamneto) {
        try {
            Pedidos pedidos = new Pedidos();
            pedidos.setNome(Nome);
            pedidos.setIntemPedido(IntemPedido);
            pedidos.setFormaDepagamneto(FormaDepagamneto);

            System.out.println(" =-=-=-=-Pedido =-=-=-=-  : " + pedidos.getIntemPedido());
            System.out.println("  Nome Do Cliente  : " + pedidos.getNome());
            System.out.println(" Forma de Pagamento : " + pedidos.getFormaDepagamneto());

            return pedidosRepository.save(pedidos);

        } catch (Exception e) {
            System.out.println(" erro ao envia os pedidos " + e.getMessage());
        }
        return null;
    }

    public List<Pedidos> buscarTodosPedidos() {
        return pedidosRepository.findAll(); // Retorna todos os pedidos
    }
}
