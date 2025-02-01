package com.crmbot.chatbot.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Intems {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idIntems;
    
    private String nomeProduto;
    private String valor;
    private String qtdeEstoque;
    private String categoria;
    private String descricao;
    private String statusDis;

    // Getters e Setters
    public Long getIdIntems() {
        return idIntems;
    }
    public void setIdIntems(Long idIntems) {
        this.idIntems = idIntems;
    }
    public String getNomeProduto() {
        return nomeProduto;
    }
    public void setNomeProduto(String nomeProduto) {
        this.nomeProduto = nomeProduto;
    }
    public String getValor() {
        return valor;
    }
    public void setValor(String valor) {
        this.valor = valor;
    }
    public String getQtdeEstoque() {
        return qtdeEstoque;
    }
    public void setQtdeEstoque(String qtdeEstoque) {
        this.qtdeEstoque = qtdeEstoque;
    }
    public String getCategoria() {
        return categoria;
    }
    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }
    public String getDescricao() {
        return descricao;
    }
    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }
    public String getStatusDis() {
        return statusDis;
    }
    public void setStatusDis(String statusDis) {
        this.statusDis = statusDis;
    }
}
