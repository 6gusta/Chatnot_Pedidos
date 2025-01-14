package com.crmbot.chatbot.Service;

import org.springframework.beans.factory.annotation.Autowired;

import com.crmbot.chatbot.Model.Contato;
import com.crmbot.chatbot.Repository.ContatoRepository;

public class ReservasService {

    @Autowired
    private ContatoRepository contatosRepository;


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
    
}
