document.addEventListener('DOMContentLoaded', function() {

    
    mostrarPedidos('pendente'); 
 
});

function mostrarPedidos(tipo) {
    if (tipo === 'pendente') {
        document.getElementById('pedidosPendente').style.display = 'block';
        document.getElementById('pedidosFinalizado').style.display = 'none';
        buscarPedidos('pendente'); // Passando o status como Pendente
    } else {
        document.getElementById('pedidosPendente').style.display = 'none';
        document.getElementById('pedidosFinalizado').style.display = 'block';
        buscarPedidos('Finalizado'); // Passando o status como Finalizado
    }
}



function buscarPedidos(status) {
    const pedidosList = status === 'pendente' ? document.getElementById('pedidosListPendentes') : document.getElementById('pedidosListFinalizados');
    const pedidosTable = status === 'pendente' ? document.getElementById('pedidosTablePendentes') : document.getElementById('pedidosTableFinalizados');
    const loadingElement = status === 'pendente' ? document.getElementById('loadingPendentes') : document.getElementById('loadingFinalizados');

    // Limpa a lista de pedidos e esconde a tabela
    pedidosList.innerHTML = '';
    pedidosTable.style.display = 'none';

    if (loadingElement) {
        loadingElement.style.display = 'block';
    }

    fetch(`http://localhost:8080/getPedidos?status=${status}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao buscar pedidos (status ${response.status}): ${response.statusText}`);
            }
            return response.json();
        })
        .then(pedidos => {
            if (loadingElement) {
                loadingElement.style.display = 'none';
            }
            if (pedidos && pedidos.length > 0) {
                popularTabela(pedidos, pedidosList, status);
                pedidosTable.style.display = 'table';
            } else {
                pedidosList.innerHTML = '<tr><td colspan="4" style="text-align: center;">Nenhum pedido encontrado.</td></tr>';
                pedidosTable.style.display = 'table';
            }
        })
        .catch(error => {
            if (loadingElement) {
                loadingElement.style.display = 'none';
            }
            console.error('Erro ao buscar pedidos:', error);
            alert('Erro ao carregar pedidos: ' + error.message);
        });
}

function popularTabela(pedidos, tabela, status) {
    tabela.innerHTML = '';
    pedidos.forEach(pedido => {
        const row = document.createElement('tr');
        row.setAttribute('data-pedido-id', parseInt(pedido.idpedido)); 

        row.innerHTML = `
            <td>${pedido.nome || 'Nome não informado'}</td>
            <td>${pedido.intemPedido || 'Item não informado'}</td>
            <td>${pedido.formaDepagamneto || 'Pagamento não informado'}</td>
            <td>${pedido.dataHoraRecebimento || 'data não informado'}</td>
            ${status === 'pendente' ? `
                <td>
                    <button class="finalizar" onclick="finalizarPedido(${pedido.idpedido})">Finalizar</button>
                    <button class="cancelar" onclick="cancelarPedido(${pedido.idpedido})">Cancelar</button>
                </td>` : ''}
        `;
        tabela.appendChild(row);
    });
}

function finalizarPedido(pedidoId) {
    fetch(`http://localhost:8080/api/pedidos/${pedidoId}/finalizar`, { method: 'POST' })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(`Erro ao finalizar pedido (status ${response.status}): ${text}`) });
            }
            return response.json();
        })
        .then(pedidoFinalizado => {
            alert(`Pedido ${pedidoId} finalizado!`);
            
            // Remover o pedido da tabela de pendentes
            const pedidosPendentes = document.getElementById('pedidosListPendentes');
            const pedidoElemento = pedidosPendentes.querySelector(`tr[data-pedido-id="${parseInt(pedidoId)}"]`);
            if (pedidoElemento) {
                pedidosPendentes.removeChild(pedidoElemento);
            }
            
            // Adicionar o pedido à tabela de finalizados
            const pedidosListFinalizados = document.getElementById('pedidosListFinalizados');
            const pedidoRow = document.createElement('tr');
            pedidoRow.setAttribute('data-pedido-id', pedidoId);
            pedidoRow.innerHTML = `
                <td>${pedidoFinalizado.nome}</td>
                <td>${pedidoFinalizado.intemPedido}</td>
                <td>${pedidoFinalizado.formaDepagamneto}</td>
                <td>${pedidoFinalizado.dataHoraRecebimento}</td>
            `;
            pedidosListFinalizados.appendChild(pedidoRow);

            // Mostrar a tabela de finalizados
            document.getElementById('pedidosFinalizado').style.display = 'block';
            document.getElementById('pedidosPendente').style.display = 'none';
        })
        .catch(error => {
            console.error('Erro ao finalizar pedido:', error);
            alert('Erro ao finalizar pedido: ' + error.message);
        });
}




function cancelarPedido(pedidoId) {
    fetch(`http://localhost:8080/api/pedidos/${pedidoId}/cancelar`, {
        method: 'DELETE' 
    })
    .then(response => {
        if (response.ok) {
    
            alert(`Pedido ${pedidoId} cancelado!`);
            console.log(`Pedido ${pedidoId} cancelado com sucesso no servidor.`);
            
            const pedidosPendentes = document.getElementById('pedidosListPendentes');
            const pedidoElemento = pedidosPendentes.querySelector(`tr[data-pedido-id="${parseInt(pedidoId)}"]`);
            if (pedidoElemento) {
                pedidosPendentes.removeChild(pedidoElemento);
                console.log(`Pedido ${pedidoId} removido da lista no DOM.`);
            } else {
                console.log(`Elemento de pedido ${pedidoId} não encontrado no DOM.`);
            }
        } else {
        
            alert('Erro ao cancelar pedido!');
            console.log('Erro ao cancelar o pedido, status HTTP:', response.status);

    
            response.text().then(text => {
                console.log('Detalhes do erro do servidor:', text);
            });
        }
    })
    .catch(error => {
    
        console.error('Erro ao cancelar pedido:', error);
        alert('Erro ao cancelar pedido!');
    });
}

// Seleção de elementos
const configButton = document.getElementById('configButton');
const configModal = document.getElementById('configModal');
const closeModal = document.getElementById('closeModal');
const buscarPedidosBtn = document.getElementById('buscarPedidosBtn');
const numeroPedidoInput = document.getElementById('numeroPedido');
const pedidoSelect = document.getElementById('pedidoSelect');
const setStatusBtn = document.getElementById('setStatusBtn');
const timeInput = document.getElementById('timeInput');

// Abre o modal
configButton.addEventListener('click', function () {
    configModal.style.display = 'block';
});

// Fecha o modal
closeModal.addEventListener('click', function () {
    configModal.style.display = 'none';
});

// Função para buscar os pedidos pelo número
buscarPedidosBtn.addEventListener('click', function () {
    const numero = numeroPedidoInput.value.trim();

    if (numero) {
        // Faz a requisição ao backend
        fetch(`http://localhost:8080/GetNumero?numero=${numero}`)
            .then(response => response.json())
            .then(pedidos => {
                pedidoSelect.innerHTML = ''; // Limpa o select
                if (pedidos.length > 0) {
                    pedidos.forEach(pedido => {
                        const option = document.createElement('option');
                        option.value = pedido.idpedido; // Assumindo que o pedido tem um campo id
                        option.textContent = `Pedido #${pedido.numero} - ${pedido.intemPedido}`;
                        pedidoSelect.appendChild(option);
                    });
                } else {
                    alert('Nenhum pedido encontrado para este número.');
                }
            })
            .catch(error => {
                console.error('Erro ao buscar pedidos:', error);
                alert('Erro ao buscar pedidos.');
            });
    } else {
        alert('Por favor, insira um número de telefone.');
    }
});

// Função para iniciar a contagem de 30 minutos e atualizar o pedido após o tempo
function iniciarContagem(pedidoId, status, tempoConfig) {
    let tempo = tempoConfig * 60; // Converter minutos em segundos

    const countdownElement = document.getElementById('countdown');
    countdownElement.innerHTML = `Tempo restante: ${tempo} segundos`;

    const interval = setInterval(function () {
        tempo--;
        countdownElement.innerHTML = `Tempo restante: ${tempo} segundos`;

        if (tempo <= 0) {
            clearInterval(interval);

            // Atualiza o pedido no backend automaticamente após o tempo
            fetch(`http://localhost:8080/api/pedidos/${pedidoId}/finalizar`, {
                method: 'POST',
                body: JSON.stringify({ status: status }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(data => {
                    alert('O pedido foi atualizado automaticamente após o tempo definido!');
                    countdownElement.innerHTML = ''; // Limpa o contador após a finalização
                })
                .catch(error => {
                    console.error('Erro ao finalizar pedido automaticamente:', error);
                    alert('Erro ao finalizar pedido automaticamente.');
                });
        }
    }, 1000); // Atualiza o contador a cada 1 segundo
}

// Aplicar status e iniciar contagem
setStatusBtn.addEventListener('click', function () {
    const pedidoId = pedidoSelect.value;
    const status = document.getElementById('statusSelect').value;
    const tempoConfig = parseInt(timeInput.value, 10); // Pega o valor do campo de tempo

    if (pedidoId && status && tempoConfig > 0) {
        alert(`O cronômetro de ${tempoConfig} minutos foi iniciado para este pedido.`);
        iniciarContagem(pedidoId, status, tempoConfig);
    } else {
        alert('Por favor, selecione um pedido, um status e defina um tempo válido.');
    }
});