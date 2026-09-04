function continuar() {
    let servico = document.getElementById("servico").value;
    let profissional = document.getElementById("profissional").value;
    let data = document.getElementById("data").value;
    let horario = document.getElementById("horario").value;

    // Verifica o serviço
    if (servico === "") {
        alert("Por favor, escolha um serviço.");
        return;
    }

    // Verifica a profissional
    if (profissional === "") {
        alert("Por favor, escolha uma profissional.");
        return;
    }

    // Verifica a data
    if (data === "") {
        alert("Por favor, escolha uma data.");
        return;
    }

    // Impede datas passadas
    let hoje = new Date().toISOString().split("T")[0];

    if (data < hoje) {
        alert("Por favor, escolha uma data igual ou posterior a hoje.");
        return;
    }

    // Verifica o horário
    if (horario === "") {
        alert("Por favor, escolha um horário.");
        return;
    }

    // Formata a data para o padrão brasileiro
    let dataFormatada = data.split("-").reverse().join("/");

    // Busca os agendamentos salvos no navegador
    let agendamentos =
        JSON.parse(localStorage.getItem("agendamentos")) || [];

    // Verifica se o horário já está ocupado
    let horarioOcupado = agendamentos.some(function (agendamento) {
        return (
            agendamento.profissional === profissional &&
            agendamento.data === data &&
            agendamento.horario === horario
        );
    });

    if (horarioOcupado) {
        alert("⚠️ Este horário já está ocupado. Escolha outro horário.");
        return;
    }

    // Salva o novo agendamento
    agendamentos.push({
        servico: servico,
        profissional: profissional,
        data: data,
        horario: horario
    });

    localStorage.setItem(
        "agendamentos",
        JSON.stringify(agendamentos)
    );

    // Mostra a confirmação
    let confirmacao = document.getElementById("confirmacao");

    confirmacao.innerHTML = `
        <h2>✅ Agendamento realizado!</h2>
        <p><strong>Serviço:</strong> ${servico}</p>
        <p><strong>Profissional:</strong> ${profissional}</p>
        <p><strong>Data:</strong> ${dataFormatada}</p>
        <p><strong>Horário:</strong> ${horario}</p>
        <p>Agendamento confirmado com sucesso!</p>
    `;

    // Atualiza a lista de agendamentos
    mostrarAgendamentos();

    // Atualiza os horários disponíveis
    atualizarHorarios();
}
function mostrarAgendamentos() {
    let agendamentos =
        JSON.parse(localStorage.getItem("agendamentos")) || [];

    let lista = document.getElementById("listaAgendamentos");

    if (!lista) {
        return;
    }

    if (agendamentos.length === 0) {
        lista.innerHTML = "<p>Nenhum agendamento realizado.</p>";
        return;
    }

    lista.innerHTML = "";

    agendamentos.forEach(function (agendamento) {
        let dataFormatada =
            agendamento.data.split("-").reverse().join("/");

        lista.innerHTML += `
            <div>
                <p><strong>💅 Serviço:</strong> ${agendamento.servico}</p>
                <p><strong>👩 Profissional:</strong> ${agendamento.profissional}</p>
                <p><strong>📅 Data:</strong> ${dataFormatada}</p>
                <p><strong>🕐 Horário:</strong> ${agendamento.horario}</p>
                <hr>
            </div>
        `;
    });
}


function atualizarHorarios() {
    let profissional =
        document.getElementById("profissional").value;

    let data =
        document.getElementById("data").value;

    let horarioSelect =
        document.getElementById("horario");

    let agendamentos =
        JSON.parse(localStorage.getItem("agendamentos")) || [];

    for (let i = 0; i < horarioSelect.options.length; i++) {
        let opcao = horarioSelect.options[i];

        if (opcao.value === "") {
            continue;
        }

        let horario = opcao.value;

        let ocupado = agendamentos.some(function (agendamento) {
            return (
                agendamento.profissional === profissional &&
                agendamento.data === data &&
                agendamento.horario === horario
            );
        });

        if (ocupado) {
            opcao.disabled = true;
            opcao.textContent = horario + " — OCUPADO";
        } else {
            opcao.disabled = false;
            opcao.textContent = horario;
        }
    }

    horarioSelect.value = "";
}


// Mostra os agendamentos quando a página abre
mostrarAgendamentos();