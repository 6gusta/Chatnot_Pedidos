document.addEventListener('DOMContentLoaded', function() {
    mostrarPedidos('pendente'); // Carrega os pedidos pendentes ao carregar a página
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
                return response.text().then(text => {throw new Error(`Erro ao finalizar pedido (status ${response.status}): ${text}`)});
            }
            return response.json();
        })
        .then(pedidoFinalizado => {
            alert(`Pedido ${pedidoId} finalizado!`);
        
            const pedidosPendentes = document.getElementById('pedidosListPendentes');
            const pedidoElemento = pedidosPendentes.querySelector(`tr[data-pedido-id="${parseInt(pedidoId)}"]`);
            if (pedidoElemento) {
                pedidosPendentes.removeChild(pedidoElemento);
            }
        
            buscarPedidos('Finalizado'); 
        })
        .catch(error => {
            console.error('Erro ao finalizar pedido:', error);
            alert('Erro ao finalizar pedido: ' + error.message);
        });
}



function cancelarPedido(pedidoId) {
    fetch(`http://localhost:80840/api/pedidos/${pedidoId}/cancelar`, {
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

