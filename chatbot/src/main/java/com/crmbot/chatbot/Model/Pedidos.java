package com.crmbot.chatbot.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Pedidos {

    @GeneratedValue(strategy = GenerationType.IDENTITY)

    @Id
    private long idpedido;
    private String DataHora;
    private String Nome;
    private String IntemPedido;
    private String FormaDepagamneto;
    private String status;

    public Pedidos(){
        this.status = "Pendente";
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
    public long getIdpedido() {
        return idpedido;
    }
    public void setIdpedido(long idpedido) {
        this.idpedido = idpedido;
    }
    public String getDataHora() {
        return DataHora;
    }
    public void setDataHora(String dataHora) {
        DataHora = dataHora;
    }
    public String getNome() {
        return Nome;
    }
    public void setNome(String nome) {
        Nome = nome;
    }
    public String getIntemPedido() {
        return IntemPedido;
    }
    public void setIntemPedido(String intemPedido) {
        IntemPedido = intemPedido;
    }
    public String getFormaDepagamneto() {
        return FormaDepagamneto;
    }
    public void setFormaDepagamneto(String formaDepagamneto) {
        FormaDepagamneto = formaDepagamneto;
    }

    
    
}
