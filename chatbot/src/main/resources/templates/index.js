document.addEventListener('DOMContentLoaded', function() {

    
    mostrarPedidos('pendente'); 
 
});

function mostrarPedidos(tipo) {
    const sections = document.querySelectorAll('.pedidos-tabela');
    sections.forEach(section => section.style.display = 'none'); // Oculta todas as seções

    const selectedSection = document.getElementById(`pedidos${capitalizeFirstLetter(tipo)}`);
    if (selectedSection) {
        selectedSection.style.display = 'block'; // Mostra apenas a seção correspondente
        buscarPedidos(tipo);
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}



function buscarPedidos(status) {
    const elementos = {
        pendente: {
            lista: document.getElementById('pedidosListPendentes'),
            tabela: document.getElementById('pedidosTablePendentes'),
            loading: document.getElementById('loadingPendentes'),
        },
        finalizado: {
            lista: document.getElementById('pedidosListFinalizados'),
            tabela: document.getElementById('pedidosTableFinalizados'),
            loading: document.getElementById('loadingFinalizados'),
        },
        emAndamento: {
            lista: document.getElementById('pedidosListEmAndamento'),
            tabela: document.getElementById('pedidosTableEmAndamento'),
            loading: document.getElementById('loadingEmAndamento'),
        },
        saiuPraEntrega: {
            lista: document.getElementById('pedidosListSaiuPraEntrega'),
            tabela: document.getElementById('pedidosTableSaiuPraEntrega'),
            loading: document.getElementById('loadingSaiuPraEntrega'),
        },
    };

    const { lista, tabela, loading } = elementos[status] || {};
    if (!lista || !tabela || !loading) {
        console.error('Status inválido:', status);
        return;
    }

    // Limpa a lista e esconde a tabela
    lista.innerHTML = '';
    tabela.style.display = 'none';
    loading.style.display = 'block';

    fetch(`http://localhost:8080/getPedidos?status=${status}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao buscar pedidos (status ${response.status}): ${response.statusText}`);
            }
            return response.json();
        })
        .then(pedidos => {
            loading.style.display = 'none';
            if (pedidos && pedidos.length > 0) {
                popularTabela(pedidos, lista, status);
                tabela.style.display = 'table';
            } else {
                lista.innerHTML = `<tr><td colspan="4" style="text-align: center;">Nenhum pedido ${status} encontrado.</td></tr>`;
                tabela.style.display = 'table';
            }
        })
        .catch(error => {
            loading.style.display = 'none';
            console.error('Erro ao buscar pedidos:', error);
            alert('Erro ao carregar pedidos: ' + error.message);
        });
}

function popularTabela(pedidos, tabela, status) {
    tabela.innerHTML = ''; // Limpa a tabela antes de popular os dados

    pedidos.forEach(pedido => {
        const row = document.createElement('tr');
        row.setAttribute('data-pedido-id', parseInt(pedido.idpedido)); // Adiciona ID como atributo

        // Verifica e formata os dados recebidos
        const nome = pedido.nome || 'Nome não informado';
        const itemPedido = pedido.intemPedido || 'Item não informado';
        const formaDePagamento = pedido.formaDepagamneto|| "Pagamento não informado";
        const dataRecebimento = pedido.dataHoraRecebimento
            ? new Date(pedido.dataHoraRecebimento).toLocaleString()
            : 'Data não informada';
        
            const total = pedido.total !== undefined 
            ? pedido.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) 
            : 'Total não informado';
       const telefone = pedido.numero || 'Numero não informado'

        // Constrói a linha da tabela
        row.innerHTML = `
            <td>${nome}</td>
            <td>${itemPedido}</td>
            <td>${formaDePagamento}</td>
             <td>${telefone}</td>
            <td>${dataRecebimento}</td>
             <td>${total}</td>
            ${status === 'pendente' ? `
                <td>
                    <button class="em-andamento" onclick="emAndamento(${pedido.idpedido}, 'emAndamento')">Em Andamento</button>
                    <button class="saiu-pra-entrega" onclick="saiuPraEntrega(${pedido.idpedido}, 'saiuPraEntrega')">Saiu Pra Entrega</button>
                    <button class="finalizar" onclick="finalizarPedido(${pedido.idpedido}, 'finalizado')">Finalizar</button>
                    <button class="cancelar" onclick="cancelarPedido(${pedido.idpedido})">Cancelar</button>
                </td>
                
                
            ` : status === 'emAndamento' ? `
                <td>
                    <button class="saiu-pra-entrega" onclick="saiuPraEntrega(${pedido.idpedido}, 'saiuPraEntrega')">Saiu Pra Entrega</button>
                    <button class="finalizar" onclick="finalizarPedido(${pedido.idpedido}, 'finalizado')">Finalizar</button>
                           <button class="cancelar" onclick="cancelarPedido(${pedido.idpedido})">Cancelar</button>
                </td>
                
            ` : status === 'saiuPraEntrega' ? `
                <td>
                    <button class="finalizar" onclick="finalizarPedido(${pedido.idpedido}, 'finalizado')">Finalizar</button>
                           <button class="cancelar" onclick="cancelarPedido(${pedido.idpedido})">Cancelar</button>
                </td>
                
            ` : ''}
        `;

        tabela.appendChild(row); // Adiciona a linha à tabela
    });
}

function saiuPraEntrega(pedidoId) {
    fetch(`http://localhost:8080/api/pedidos/${pedidoId}/SaiuPraEntrega`, { method: 'POST' })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(`Erro ao atualizar pedido: ${text}`); });
            }
            return response.json();
        })
        .then(pedidoAtualizado => {
            alert(`Pedido ${pedidoId} marcado como "Saiu Pra Entrega"!`);

            // Remover o pedido da tabela de pendentes
            const pedidosPendentes = document.getElementById('pedidosListPendentes');
            if (pedidosPendentes) {
                const pedidoElemento = pedidosPendentes.querySelector(`tr[data-pedido-id="${pedidoId}"]`);
                if (pedidoElemento) {
                    pedidosPendentes.removeChild(pedidoElemento);
                }
            }

            // Adicionar o pedido à tabela de pedidos "Saiu Para Entrega"
            const pedidosListSaiuParaEntrega = document.getElementById('pedidosListSaiuParaEntrega');
            if (pedidosListSaiuParaEntrega) {
                const pedidoRow = document.createElement('tr');
                pedidoRow.setAttribute('data-pedido-id', pedidoId);
                pedidoRow.innerHTML = `
                    <td>${pedidoAtualizado.nome || 'Nome não informado'}</td>
                    <td>${pedidoAtualizado.intemPedido || 'Item não informado'}</td>
                    <td>${pedidoAtualizado.formaDePagamento || 'Pagamento não informado'}</td>
                    <td>${new Date(pedidoAtualizado.dataHoraRecebimento).toLocaleString() || 'Data não informada'}</td>
                    <td>${pedidoAtualizado.numero || 'Número não informado'}</td>
                `;
                pedidosListSaiuParaEntrega.appendChild(pedidoRow);
            } else {
                console.error("Elemento 'pedidosListSaiuParaEntrega' não encontrado.");
            }

            // Mostrar a tabela de pedidos que saíram para entrega
            const pedidosSaiuParaEntrega = document.getElementById('pedidosSaiuParaEntrega');
            if (pedidosSaiuParaEntrega) {
                pedidosSaiuParaEntrega.style.display = 'block';
            } else {
                console.error("Elemento 'pedidosSaiuParaEntrega' não encontrado.");
            }

            const pedidosPendentesContainer = document.getElementById('pedidosPendentes');
            if (pedidosPendentesContainer) {
                pedidosPendentesContainer.style.display = 'none';
            } else {
                console.error("Elemento 'pedidosPendentes' não encontrado.");
            }
        })
        .catch(error => {
            console.error('Erro ao marcar pedido como "Saiu Pra Entrega":', error);
            alert('Erro ao atualizar status do pedido.');
        });
}



function emAndamento(pedidoId) {
    fetch(`http://localhost:8080/api/pedidos/${pedidoId}/EmAndamento`, { method: 'POST' })
    
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(`Erro ao marcar pedido como "Em Andamento": ${text}`); });
            }
            return response.json();
        })
        .then(pedidoAtualizado => {
            alert(`Pedido ${pedidoId} marcado como "Em Andamento"!`);
            
            // Remover o pedido da tabela de pendentes
            const pedidosPendentes = document.getElementById('pedidosListPendentes');
            const pedidoElemento = pedidosPendentes.querySelector(`tr[data-pedido-id="${parseInt(pedidoId)}"]`);
            if (pedidoElemento) {
                pedidosPendentes.removeChild(pedidoElemento);
            }
            
            // Adicionar o pedido à tabela de "Em Andamento"
            const pedidosListEmAndamento = document.getElementById('pedidosListEmAndamento');
            const pedidoRow = document.createElement('tr');
            pedidoRow.setAttribute('data-pedido-id', pedidoId);
            pedidoRow.innerHTML = `
                <td>${pedidoAtualizado.nome || 'Nome não informado'}</td>
                <td>${pedidoAtualizado.itemPedido || 'Item não informado'}</td>
                <td>${pedidoAtualizado.formaDePagamento || 'Pagamento não informado'}</td>
                <td>${new Date(pedidoAtualizado.dataHoraRecebimento).toLocaleString() || 'Data não informada'}</td>
            `;
            pedidosListEmAndamento.appendChild(pedidoRow);

            // Mostrar a tabela de pedidos em andamento
            document.getElementById('pedidosEmAndamento').style.display = 'block';
            document.getElementById('pedidosPendentes').style.display = 'none';
        })
        .catch(error => {
            console.error('Erro ao marcar pedido como "Em Andamento":', error);
            alert('Erro ao atualizar status do pedido.');
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





configButton.onclick = () => {
    configModal.style.display = "block";
};

closeModal.onclick = () => {
    configModal.style.display = "none";
};

// Abrir e fechar modal de estoque
const estoqueModal = document.getElementById("estoqueModal");
const estoqueButton = document.getElementById("estoqueButton");
const closeEstoqueModal = document.getElementById("closeEstoqueModal");

estoqueButton.onclick = () => {
    estoqueModal.style.display = "block";
};

closeEstoqueModal.onclick = () => {
    estoqueModal.style.display = "none";
};

const dashboardModal = document.getElementById("dashboardModal");
const botaoMargemLucro = document.getElementById("botaoMargemLucro");
const closeDashboardModal = document.getElementById("closeDashboardModal");

// Abrir modal e atualizar os dados
botaoMargemLucro.onclick = () => {
    dashboardModal.style.display = "block";
    atualizarDashboard();
};

// Fechar modal ao clicar no botão "X"
closeDashboardModal.onclick = () => {
    dashboardModal.style.display = "none";
};

// Fechar modal ao clicar fora dele
window.onclick = (event) => {
    if (event.target === dashboardModal) {
        dashboardModal.style.display = "none";
    }
};

// Função para atualizar os dados do Dashboard com dados reais do back-end
async function atualizarDashboard() {
    try {
        // Captura o valor selecionado no filtro
        const filtro = document.getElementById('dateFilter').value;

        // Faz a requisição para o backend, enviando o filtro como parâmetro
        const respostaVendas = await fetch(`http://localhost:8080/total?periodo=${filtro}`);
        
        // Verifica se a resposta foi bem-sucedida
        if (!respostaVendas.ok) {
            throw new Error('Erro ao recuperar os dados do backend');
        }

        // Converte a resposta para JSON
        const totalVendas = await respostaVendas.json();

        // Atualiza os valores na interface
        document.getElementById('lucroTotal').textContent = totalVendas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        // Atualiza o gráfico
        const ctx = document.getElementById('graficoLucro').getContext('2d');

        // Remove o gráfico anterior antes de criar um novo
        if (window.meuGrafico) {
            window.meuGrafico.destroy();
        }

        // Cria um novo gráfico com os dados recebidos
        window.meuGrafico = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Lucro'],
                datasets: [{
                    label: 'Valores (R$)',
                    data: [totalVendas],
                    backgroundColor: ['#4caf50'],
                    borderColor: ['#388e3c'],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                            }
                        }
                    }
                }
            }
        });

    } catch (error) {
        console.error('Erro ao carregar os dados:', error);
        // Exibe uma mensagem de erro na interface caso haja falha
        document.getElementById('lucroTotal').textContent = 'Erro ao carregar os dados';
    }
}

// Chama a função ao carregar a página para exibir os dados iniciais
atualizarDashboard();



const adicionarEstoqueBtn = document.getElementById('adicionarEstoqueBtn');
const produtoInput = document.getElementById('produtoInput');
const valorProduto = document.getElementById('valorProduto');
const estoqueResultado = document.getElementById('estoqueResultado');
const adicionarEstoqueBtn2 = document.getElementById('adicionarEstoqueBtn2');

// Evento para buscar o produto e exibir informações
adicionarEstoqueBtn.addEventListener('click', () => {
    const produto = produtoInput.value.trim();

    if (!produto) {
        alert("Por favor, insira o nome do produto.");
        return;
    }

    // Fazer a requisição à API
    fetch(`http://localhost:8080/GetEstoque?NomeProduto=${produto}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data && data.length > 0) {
                // Preencher o valor do produto no campo readonly
                valorProduto.value = data[0].valor;
                estoqueResultado.value = data[0].qtdeEstoque;

                // Mostrar os resultados do estoque
                let resultHTML = '<ul>';
                data.forEach(item => {
                    resultHTML += `<li>Nome do  Intem : ${item.nomeProduto}
                     Quantidade Do intem no Estoque: ${item.qtdeEstoque}</li>`;
                });
                resultHTML += '</ul>';
                estoqueResultado.innerHTML = resultHTML;
            } else {
                estoqueResultado.innerHTML = 'Nenhum produto encontrado.';
            }
        })
        .catch(error => {
            console.error('Erro na requisição:', error);
            estoqueResultado.innerHTML = 'Erro ao consultar o estoque.';
        });
});




const adicionarEstoque = () => {
    const nomeProduto = produtoInput.value;
    const valor = parseFloat(valorProduto.value);
    const qtdeEstoque = parseInt(estoqueResultado.value);

    if (!nomeProduto || isNaN(valor) || isNaN(qtdeEstoque)) {
        alert("Preencha todos os campos corretamente antes de adicionar ao estoque.");
        return;
    }

    const dados = {
        nomeProduto: nomeProduto,
        valor: valor,
        qtdeEstoque: qtdeEstoque
    };

    fetch("http://localhost:8080/PostEstoque", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
    })
    .then(response => response.json())
    .then(data => {
        alert("Estoque atualizado com sucesso!");
        console.log("Resposta do servidor:", data);
    })
    .catch(error => {
        console.error("Erro ao atualizar o estoque:", error);
        alert("Erro ao atualizar o estoque.");
    });
};

document.getElementById("adicionarEstoqueBtn2").addEventListener("click", adicionarEstoque);




function excluirItemEstoque(idIntems) {
    fetch(`http://localhost:8080/api/pedidos/${idIntems}/excluir`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            alert(`Item ${idIntems} retirado do estoque!`);
            console.log(`Item ${idIntems} excluído com sucesso no servidor.`);
            
            const listaItens = document.getElementById('itensEstoque');
            const itemElemento = listaItens.querySelector(`tr[data-item-id="${parseInt(idIntems)}"]`);
            if (itemElemento) {
                listaItens.removeChild(itemElemento);
                console.log(`Item ${idIntems} removido da lista no DOM.`);
            } else {
                console.log(`Elemento do item ${idIntems} não encontrado no DOM.`);
            }
        } else {
            alert('Erro ao excluir item!');
            console.log('Erro ao excluir o item, status HTTP:', response.status);

            response.text().then(text => {
                console.log('Detalhes do erro do servidor:', text);
            });
        }
    })
    .catch(error => {
        console.error('Erro ao excluir item:', error);
        alert('Erro ao excluir item!');
    });
}

document.getElementById("adicionarEstoqueBtn3").addEventListener("click", function() {
    const idIntems = this.getAttribute("data-item-id"); 
    if (idIntems) {
        excluirItemEstoque(idIntems);
    } else {
        alert("ID do item não encontrado.");
    }
});

