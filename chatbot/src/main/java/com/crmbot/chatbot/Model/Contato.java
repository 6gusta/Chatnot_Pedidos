package com.crmbot.chatbot.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
public class Contato {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonProperty("nome") // Caso o nome no JSON seja diferente, você pode adicionar essa anotação
    private String nome;

    @JsonProperty("telefone") // O mesmo para telefone
    private String telefone;

    @JsonProperty("tipoDeservico;") // E-mail
    private String tipoDeservico;;

    @JsonProperty("DataeHora") // Campo leads7
    private String DataeHora;

    @JsonProperty("formaPagamento") // Campo leads7
    private String formaPagamento;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getTipoDeservico() {
        return tipoDeservico;
    }

    public void setTipoDeservico(String tipoDeservico) {
        this.tipoDeservico = tipoDeservico;
    }

    public String getDataeHora() {
        return DataeHora;
    }

    public void setDataeHora(String dataeHora) {
        DataeHora = dataeHora;
    }

    public String getFormaPagamento() {
        return formaPagamento;
    }

    public void setFormaPagamento(String formaPagamento) {
        this.formaPagamento = formaPagamento;
    }

   

    
}
