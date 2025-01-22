document.addEventListener('DOMContentLoaded', function() {
    const configButton = document.getElementById('configButton');
    const configModal = document.getElementById('configModal');
    const closeModal = document.getElementById('closeModal');
    const setStatusBtn = document.getElementById('setStatusBtn');
    const statusSelect = document.getElementById('statusSelect');
    const countdownElement = document.getElementById('countdown');

    let countdownTimer;

    // Abre o modal quando o botão de configurações é clicado
    configButton.addEventListener('click', function() {
        configModal.style.display = 'block';
    });

    // Fecha o modal quando o botão de fechar (X) é clicado
    closeModal.addEventListener('click', function() {
        configModal.style.display = 'none';
    });

    // Fecha o modal se o usuário clicar fora do modal
    window.addEventListener('click', function(event) {
        if (event.target === configModal) {
            configModal.style.display = 'none';
        }
    });

    // Lógica para aplicar o status e iniciar a contagem regressiva de 30 minutos
    setStatusBtn.addEventListener('click', function() {
        const status = statusSelect.value;  // Pega o status selecionado

        if (status === "concluido") {
            // Inicia a contagem de 30 minutos
            let timeRemaining = 30 * 60; // 30 minutos em segundos

            countdownElement.innerHTML = `Status: Concluído. Tempo restante: 30 minutos.`;

            // Atualiza a contagem regressiva a cada segundo
            countdownTimer = setInterval(function() {
                timeRemaining--;

                const minutes = Math.floor(timeRemaining / 60);
                const seconds = timeRemaining % 60;

                countdownElement.innerHTML = `Status: Concluído. Tempo restante: ${minutes}m ${seconds}s.`;

                // Quando a contagem chega a zero, altera o status automaticamente
                if (timeRemaining <= 0) {
                    clearInterval(countdownTimer);
                    countdownElement.innerHTML = `Status: Finalizado. Pedido concluído.`;
                    // Aqui você pode enviar uma requisição para atualizar o status no servidor
                    alert('O pedido foi automaticamente finalizado!');
                    // Exemplo de chamada para o servidor:
                    // fetch('/atualizar-status', { method: 'POST', body: JSON.stringify({ status: 'finalizado' }) });
                }
            }, 1000); // Atualiza a cada 1 segundo
        } else {
            alert('O pedido está em status Pendente. Não é necessário iniciar a contagem.');
        }

        // Fecha o modal após aplicar a configuração
        configModal.style.display = 'none';
    });
});
