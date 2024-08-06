document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const logoutButton = document.getElementById('logout-button');
    const summaryForm = document.getElementById('summary-form');
    const summaryList = document.getElementById('summary-list');
    const searchInput = document.getElementById('search');
    const yearSelect = document.getElementById('year-select');
    const subjectSelect = document.getElementById('subject-select');
    const contentDiv = document.getElementById('content');
    const authDiv = document.getElementById('auth');
    const loginMessage = document.getElementById('login-message');

    // Função para exibir os resumos armazenados
    function displaySummaries() {
        const summaries = JSON.parse(localStorage.getItem('summaries')) || [];
        summaryList.innerHTML = '';
        summaries.forEach((summary) => {
            const summaryItem = document.createElement('div');
            summaryItem.classList.add('summary-item');
            
            // Criar link para o arquivo
            let fileLink = '';
            if (summary.file) {
                fileLink = `<p><a href="${summary.file}" target="_blank">Baixe o arquivo</a></p>`;
            }

            summaryItem.innerHTML = `
                <h3>${summary.subject}</h3>
                <p><strong>Ano:</strong> ${summary.year}</p>
                <p><strong>Nome:</strong> ${summary.name}</p>
                <p>${summary.summary}</p>
                ${fileLink}
            `;
            summaryList.appendChild(summaryItem);
        });
    }

    // Função para salvar um resumo
    function saveSummary(subject, year, name, summary, file) {
        const summaries = JSON.parse(localStorage.getItem('summaries')) || [];
        summaries.push({ subject, year, name, summary, file });
        localStorage.setItem('summaries', JSON.stringify(summaries));
    }

    // Função para lidar com o login
    function handleLogin(username) {
        localStorage.setItem('username', username);
        authDiv.style.display = 'none';
        contentDiv.style.display = 'block';
        displaySummaries();
    }

    // Função para lidar com o logout
    function handleLogout() {
        localStorage.removeItem('username');
        authDiv.style.display = 'block';
        contentDiv.style.display = 'none';
    }

    // Função para limpar todos os resumos
    function clearSummaries() {
        localStorage.removeItem('summaries');
        displaySummaries();
    }

    // Evento de envio do formulário de login
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        if (username) {
            handleLogin(username);
        } else {
            loginMessage.textContent = 'Por favor, insira um nome de usuário.';
        }
    });

    // Evento de clique no botão de logout
    logoutButton.addEventListener('click', handleLogout);

    // Evento de envio do formulário de resumo
    summaryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const subject = document.getElementById('subject').value.trim();
        const year = document.getElementById('year').value.trim();
        const name = document.getElementById('name').value.trim();
        const summary = document.getElementById('summary').value.trim();

        const fileInput = document.getElementById('file-upload');
        const file = fileInput.files[0] ? URL.createObjectURL(fileInput.files[0]) : '';

        if (subject && year && name && summary) {
            saveSummary(subject, year, name, summary, file);
            displaySummaries();
            summaryForm.reset();
        }
    });

    // Evento de entrada no campo de pesquisa
    searchInput.addEventListener('input', () => {
        const filterSubject = subjectSelect.value.toLowerCase();
        const filterYear = yearSelect.value;
        const filterText = searchInput.value.toLowerCase();
        const items = summaryList.getElementsByClassName('summary-item');
        Array.from(items).forEach(item => {
            const text = item.textContent.toLowerCase();
            const isMatchingSubject = filterSubject === 'all' || text.includes(filterSubject);
            const isMatchingYear = filterYear === 'all' || text.includes(filterYear);
            const isMatchingText = text.includes(filterText);
            item.style.display = (isMatchingSubject && isMatchingYear && isMatchingText) ? '' : 'none';
        });
    });

    // Verificar se o usuário já está logado
    if (localStorage.getItem('username')) {
        handleLogin(localStorage.getItem('username'));
    }

    // Limpar todos os resumos ao iniciar a página (opcional, se necessário)
    clearSummaries();
});
