document.addEventListener('DOMContentLoaded', function() {
    const telefoneInput = document.getElementById('search');
    const searchButton = document.getElementById('searchButton');
    let telefoneAtual = ""; // Variável para armazenar o número de telefone

    const urlParams = new URLSearchParams(window.location.search);
    const pedidoNumero = urlParams.get('pedidoNumero');

    searchButton.addEventListener('click', function() {
        const Ntelefone = telefoneInput.value.trim();
        if (Ntelefone) {
            telefoneAtual = Ntelefone; // Armazena o telefone para atualizações
            console.log("Telefone Atual: ", telefoneAtual); // Depuração
            buscarTelefone(Ntelefone);
        } else {
            alert('Por favor, insira um número de telefone válido.');
        }
    });

    // Atualiza o conteúdo do modal a cada 10 segundos, chamando a função buscarTelefone
    setInterval(() => {
        if (telefoneAtual) { // Verifica se há um número de telefone válido
            buscarTelefone(telefoneAtual);
        }
    }, 10000); // 10000ms = 10 segundos
});

function buscarTelefone(numero) {
    fetch(`http://localhost:8080/GetNumero?numero=${encodeURIComponent(numero)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao buscar número de telefone (status ${response.status}): ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Dados do número de telefone:', data);
            if (data && data.length > 0) {
                // Atualiza somente o conteúdo do modal
                const pedido = data[0]; // Supondo que o primeiro item contém o pedido

                const statusColors = {
                    Pendente: "orange",
                    Finalizado: "green",
                    Cancelado: "red",
                };

                const orderDetailsElement = document.getElementById('orderDetails');
                orderDetailsElement.innerHTML = `
                    <div>
                        <h3>Pedido #${pedido.numero}</h3>
                        <p><strong>Nome:</strong> ${pedido.nome}</p>
                        <p><strong>Item Pedido:</strong> ${pedido.intemPedido}</p>
                         <p><strong>Total a Pagar:</strong> ${pedido.total}</p>
                        <p><strong>Forma de Pagamento:</strong> ${pedido.formaDepagamneto}</p>
                        <p>
                            <strong>Status:</strong> 
                            <span style="color: ${statusColors[pedido.status] || 'black'};">
                                ${pedido.status}
                            </span>
                        </p>
                        <p><strong>Data e Hora de Recebimento:</strong> ${new Date(pedido.dataHoraRecebimento).toLocaleString()}</p>
                    </div>
                `;

                // Exibir o modal, caso não esteja visível
                const modal = document.getElementById('orderModal');
                modal.style.display = 'block';

                // Fechar o modal ao clicar no X
                const closeModal = document.getElementById('closeModal');
                closeModal.onclick = () => {
                    modal.style.display = 'none';
                };

            } else {
                alert('Nenhum pedido encontrado para este número.');
            }
        })
        .catch(error => {
            console.error('Erro ao buscar número de telefone:', error);
            alert('Erro ao carregar os dados: ' + error.message);
        });
}
let remainingTime = 300; // 5 minutos em segundos
    const countdownElement = document.getElementById('countdown');

    const timerInterval = setInterval(() => {
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;

        countdownElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        if (remainingTime <= 0) {
            clearInterval(timerInterval); // Para o temporizador
            alert('O tempo acabou! O pedido foi cancelado.');
        }

        remainingTime--;
    }, 1000);