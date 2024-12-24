package com.crmbot.chatbot.Controler;





import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;  // Importando a interface correta para List
import java.util.ArrayList;



import com.crmbot.chatbot.Model.Pedidos;
import com.crmbot.chatbot.Service.ContatosService;

@RestController
@CrossOrigin(origins = "*")
public class ApiController {

    @Autowired
    private ContatosService contatosService;
    
    @GetMapping("/getData")
    public ResponseEntity<String> getData(@RequestParam(name = "nome") String nome, 
                                          @RequestParam(name = "telefone") String telefone) {
        System.out.println("Nome: " + nome + ", Telefone: " + telefone);
        String responseMessage = "Nome: " + nome + ", Telefone: " + telefone;
        return ResponseEntity.ok(responseMessage);
    }

    @PostMapping("/sendData")
    public ResponseEntity<String> sendData(@RequestBody Pedidos pedidos) {
        try {
            // Exibe os dados recebidos no console
            System.out.println("Dados recebidos: " + pedidos);
            System.out.println("Item do Pedido: " + pedidos.getIntemPedido());
            System.out.println("Nome: " + pedidos.getNome());
            System.out.println("Forma de Pagamento: " + pedidos.getFormaDepagamneto());
    
            // Chama o serviço para salvar os dados no CRM
            contatosService.PedidosClientes(pedidos.getNome(), pedidos.getIntemPedido(), pedidos.getFormaDepagamneto());
    
            return ResponseEntity.ok("Dados processados com sucesso");
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Erro ao processar os dados", HttpStatus.BAD_REQUEST);
        }
    }

     @GetMapping("/getPedidos")
    public ResponseEntity<List<Pedidos>> getPedidos() {
        List<Pedidos> pedidos = contatosService.buscarTodosPedidos(); // Aqui você busca todos os pedidos do banco de dados
        return ResponseEntity.ok(pedidos);
    }
    
    
}    

   
    
    

    
    

