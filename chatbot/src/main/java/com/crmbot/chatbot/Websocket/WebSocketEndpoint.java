package com.crmbot.chatbot.Websocket;

import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.HashSet;
import java.util.Set;

@ServerEndpoint("/pedido")
public class WebSocketEndpoint {
    // Conjunto para armazenar todos os clientes conectados
    private static Set<Session> clientes = new HashSet<>();

    // Método para quando um cliente se conecta
    @OnOpen
    public void onOpen(Session session) {
        clientes.add(session);
        System.out.println("Novo cliente conectado: " + session.getId());
    }

    // Método para quando um cliente se desconecta
    @OnClose
    public void onClose(Session session) {
        clientes.remove(session);
        System.out.println("Cliente desconectado: " + session.getId());
    }

    // Método para processar mensagens do cliente (caso necessário)
    @OnMessage
    public void onMessage(String message, Session session) {
        System.out.println("Mensagem recebida: " + message);
    }

    // Método para quando ocorrer um erro na conexão
    @OnError
    public void onError(Session session, Throwable throwable) {
        System.out.println("Erro na conexão: " + throwable.getMessage());
    }

    // Enviar a atualização de status para todos os clientes conectados
    public static void enviarAtualizacao(String pedidoId, String status) {
        String mensagem = "{\"pedidoId\":\"" + pedidoId + "\", \"status\":\"" + status + "\"}";

        // Enviar a mensagem para todos os clientes conectados
        for (Session cliente : clientes) {
            try {
                if (cliente.isOpen()) {
                    cliente.getBasicRemote().sendText(mensagem);
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}

