package com.crmbot.chatbot.Controler;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

//import com.crmbot.chatbot.Model.Contato;
//import com.crmbot.chatbot.Service.ContatosService;
import java.util.Map;

@RestController
@RequestMapping("Contatos")
@CrossOrigin(origins = "*")
public class ControllerContato {

    @Autowired
    ///private ContatosService contatosService;

    @PostMapping()
    public ResponseEntity<String> criarContato(@RequestBody Map<String, Object> request) {

        try {
            // Acessando os dados corretamente a partir do Map
            //String nome = (String) request.get("nome");
           // String telefone = (String) request.get("telefone");
            //String email = (String) request.get("email");
           // String leads7 = (String) request.get("leads7");

            // Criando o objeto Contatos
           // Contato contato = new Contato();
           // contato.setNome(nome);
            //contato.setTelefone(telefone);
            //contato.setEmail(email);
            //contato.setLeads7(leads7);

            // Chama o serviço para salvar os dados no CRM
          //  contatosService.ContatosCRM(contato.getNome(), contato.getTelefone(), contato.getEmail(), contato.getLeads7());

            // Retorna resposta de sucesso
            return new ResponseEntity<>("Dados da lead coletados com sucesso", HttpStatus.CREATED);

        } catch (Exception e) {
            e.printStackTrace();  // Logar o erro
            return new ResponseEntity<>("Erro ao criar a LEAD", HttpStatus.BAD_REQUEST);
        }
    }

    
}
