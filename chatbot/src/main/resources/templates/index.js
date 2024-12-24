// Função para buscar os pedidos do backend
async function buscarPedidos() {
    try {
        // Fazendo a requisição GET para o backend
        const response = await fetch('http://localhost:8080/api/pedidos/getPedidos');
        
        // Verificando se a requisição foi bem-sucedida
        if (response.ok) {
            const pedidos = await response.json(); // Recebe os dados no formato JSON

            // Exibe os pedidos na tabela
            exibirPedidos(pedidos);
        } else {
            alert('Erro ao buscar pedidos!');
        }
    } catch (error) {
        console.error('Erro ao realizar requisição:', error);
        alert('Erro ao realizar requisição!');
    }
}

// Função para exibir os pedidos na tabela
function exibirPedidos(pedidos) {
    const tabela = document.getElementById('conteudoPedidos');
    tabela.innerHTML = ''; // Limpa a tabela antes de adicionar os novos pedidos

    // Adiciona uma linha na tabela para cada pedido
    pedidos.forEach(pedido => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${pedido.id}</td>
            <td>${pedido.nome}</td>
            <td>${pedido.intemPedido}</td>
            <td>${pedido.formaDepagamneto}</td>
            <td>
                <button class="finalizar" onclick="finalizarPedido(${pedido.id})">Finalizar</button>
                <button class="cancelar" onclick="cancelarPedido(${pedido.id})">Cancelar</button>
            </td>
        `;
        
        tabela.appendChild(row);
    });
}

// Função para finalizar um pedido (simula a ação)
async function finalizarPedido(id) {
    const response = await fetch(`http://localhost:8080/api/pedidos/${id}/finalizar`, { method: 'POST' });
    if (response.ok) {
        alert('Pedido finalizado com sucesso!');
        buscarPedidos(); // Atualiza a lista de pedidos
    } else {
        alert('Erro ao finalizar pedido.');
    }
}

// Função para cancelar um pedido (simula a ação)
async function cancelarPedido(id) {
    const response = await fetch(`http://localhost:8080/api/pedidos/${id}/cancelar`, { method: 'POST' });
    if (response.ok) {
        alert('Pedido cancelado com sucesso!');
        buscarPedidos(); // Atualiza a lista de pedidos
    } else {
        alert('Erro ao cancelar pedido.');
    }
}

// Carregar os pedidos assim que a página for carregada
window.onload = () => {
    buscarPedidos();
};
