package com.crmbot.chatbot.Model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

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
    private LocalDateTime dataHoraRecebimento;
    private String numero;
    private double total; 

   

    public double getTotal() {
        return total;
    }
    public void setTotal(double total) {
        this.total = total;
    }
    public String getNumero() {
        return numero;
    }
    public void setNumero(String numero) {
        this.numero = numero;
    }
    public LocalDateTime getDataHoraRecebimento() {
        return dataHoraRecebimento;
    }
    public void setDataHoraRecebimento(LocalDateTime dataHoraRecebimento) {
        this.dataHoraRecebimento = dataHoraRecebimento;
    }
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
