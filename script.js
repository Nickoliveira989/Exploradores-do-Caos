/* ===============================
   ESTADO GLOBAL (DADOS)
================================ */
let classeAtual = null;
let ocupacaoAtual = null;
let periciasEscolhidas = [];
let habilidadesSelecionadas = [];

const HABILIDADES_DATA = {
    combatente: {
        limite: 2,
        opcoes: [
            { nome: "Ataque Brutal", tipo: "Ativa", custo: "1 ENG", efeito: "Sempre que acertar um ataque corpo a corpo, adicione +2 de dano ao resultado final." },
            { nome: "Guarda Firme", tipo: "Reativa", custo: "2 ENG", efeito: "Quando sofrer dano, reduza o dano recebido em 1d6." },
            { nome: "Golpe Preciso", tipo: "Passiva", custo: "—", efeito: "A margem de crítico de seus ataques corpo a corpo é reduzida em –2." },
            { nome: "Corpo Endurecido", tipo: "Passiva", custo: "—", efeito: "Você recebe +4 HP fixo." },
            { nome: "Investida", tipo: "Ativa", custo: "3 ENG", efeito: "Você se move até o alvo e realiza um ataque corpo a corpo com vantagem." }
        ]
    },
    atirador: {
        limite: 2,
        opcoes: [
            { nome: "Especialista Balístico", tipo: "Passiva", custo: "—", efeito: "Em ataques com armas de fogo, você recebe +3 de dano garantido." },
            { nome: "Mira Precisa", tipo: "Ativa", custo: "2 ENG", efeito: "Seu próximo ataque à distância recebe vantagem e ignora cobertura leve." },
            { nome: "Tiro Crítico", tipo: "Passiva", custo: "—", efeito: "A margem de crítico de armas de fogo é reduzida em –2." },
            { nome: "Recarga Rápida", tipo: "Passiva", custo: "—", efeito: "Recarregar uma arma de fogo não consome sua ação principal." },
            { nome: "Olhos de Águia", tipo: "Passiva", custo: "—", efeito: "Você recebe +2 em testes de Percepção relacionados a combate." }
        ]
    },
    suporte: {
        limite: 3,
        opcoes: [
            { nome: "Bandagem Improvisada", tipo: "Ativa", custo: "3 ENG", efeito: "Uma vez por cena, recupere 1d4 de HP de um aliado." },
            { nome: "Palavras Certas", tipo: "Ativa", custo: "2 ENG", efeito: "Uma vez por cena, recupere 1d4 de SAN de um aliado." },
            { nome: "Determinação", tipo: "Reativa", custo: "3 ENG", efeito: "Após falhar em um teste, role 1d6 e some ao resultado original." },
            { nome: "Mente Técnica", tipo: "Passiva", custo: "—", efeito: "Receba +2 em testes de Tecnologia, Medicina ou Investigação." },
            { nome: "Liderança", tipo: "Ativa", custo: "3 ENG", efeito: "Um aliado recebe +1d6 em seu próximo teste ou ataque." }
        ]
    },
    rastreador: {
        limite: 3,
        fixas: [
            { nome: "Costume", efeito: "Sobrevive 3 dias sem comer/dormir sem penalidades." },
            { nome: "Mapeamento", efeito: "Não precisa de testes para ler ou criar mapas (DT 15)." },
            { nome: "Camuflagem", efeito: "Furtividade (DT 10) para se esconder imóvel." },
            { nome: "Conhecimento da Superfície", efeito: "+2 em testes de Inteligência para identificar perigos da superfície." }
        ],
        opcoes: [
            { nome: "Rastreamento Avançado", tipo: "Passiva", custo: "—", efeito: "Receba +2 em testes de Sobrevivência para seguir rastros." },
            { nome: "Movimento Silencioso", tipo: "Passiva", custo: "—", efeito: "Você pode se mover enquanto furtivo sem penalidade." },
            { nome: "Explorador Nato", tipo: "Passiva", custo: "—", efeito: "Ignore um teste ambiental (clima/terreno) por cena." },
            { nome: "Olhar Analítico", tipo: "Reativa", custo: "2 ENG", efeito: "Vantagem no teste contra inimigo observado por 1 turno." },
            { nome: "Sobrevivência Extrema", tipo: "Passiva", custo: "—", efeito: "Grupo recebe +1 em Sobrevivência com você presente." }
        ]
    }
};


const atributos = {
    forca: 0,
    destreza: 0,
    constituicao: 0,
    inteligencia: 0,
    presenca: 0
};

const TODAS_PERICIAS = [
    "Atletismo", "Furtividade", "Mira", "Reflexo", "Arremesso", "Luta",
    "Investigação", "Sobrevivência", "História", "Medicina", "Ciências",
    "Mecanismo", "Tecnologia", "Intimidação", "Enganação", "Percepção",
    "Resistência Mental", "Artes", "Intuição", "Diplomacia"
];

const CLASSES = {
    combatente: { nome: 'Combatente', icone: 'fa-shield-halved', hp: (c) => 15 + (c * 2), san: (p) => 8 + (p * 2), eng: (d, c) => 5 + d + c },
    atirador: { nome: 'Atirador', icone: 'fa-crosshairs', hp: (c) => 8 + (c * 2), san: (p) => 10 + (p * 2), eng: (d, c) => 7 + d + c },
    suporte: { nome: 'Suporte', icone: 'fa-kit-medical', hp: (c) => 7 + (c * 2), san: (p) => 12 + (p * 2), eng: (d, c) => 9 + d + c },
    rastreador: { nome: 'Rastreador', icone: 'fa-shoe-prints', hp: (c) => 7 + (c * 2), san: (p) => 15 + (p * 2), eng: (d, c) => 6 + d + c }
};

const ocupacoes = {
    academico: { 
    nome: "Acadêmico / Estudante", 
    pericias: ["Ciências", "História"], 
    extra: "Escolha 1 perícia adicional: Intuição, Diplomacia, Tecnologia, Percepção ou Enganação",
    escolhaAdicional: ["Intuição", "Diplomacia", "Tecnologia", "Percepção", "Enganação"],
    maxPericiasExtras: 3 // Ele ganha 2 da classe + 1 da ocupação
},
    lutador: { nome: "Lutador", pericias: ["Luta", "Atletismo"], extra: "1x por cena: +2 em testes de Força ou Constituição." },
    artista: { nome: "Artista", pericias: ["Diplomacia", "Intuição"], extra: "1x por cena: adicione 1D8 em testes de Diplomacia." },
    atleta: { nome: "Atleta", pericias: ["Atletismo", "Reflexo"], extra: "Sempre que realizar Atletismo ou Reflexo, adicione +1D4." },
    agricultor: { nome: "Agricultor", pericias: ["Sobrevivência", "Percepção"], extra: "Testes de Sobrevivência: role 2d20 e escolha o melhor." },
    escritor: { nome: "Escritor", pericias: ["História", "Intuição"], extra: "+1 ponto fixo em todos os testes de Inteligência." },
    mercador: { nome: "Mercador", pericias: ["Intuição", "Enganação"], extra: "Diplomacia/Enganação/Intuição: adicione +1d4." },
    jornalista: { nome: "Jornalista", pericias: ["Investigação", "Resistência Mental"], extra: "1x por dia: recupera 1d4 de Sanidade (SAN)." },
    medico: { nome: "Médico / Socorrista", pericias: ["Medicina", "Resistência Mental"], extra: "Testes de Medicina: role 2d20 e escolha o melhor." },
    mecanico: { nome: "Mecânico", pericias: ["Tecnologia", "Mecanismo"], extra: "Sempre adicione 1D4 em Mecanismo ou Tecnologia." },
    bombeiro: { nome: "Bombeiro", pericias: ["Atletismo", "Resistência Mental"], extra: "1x por cena: ignore qualquer penalidade física ou mental." },
    militar: { nome: "Ex-Militar / Policial", pericias: ["Mira", "Reflexo"], extra: "1x por cena: +2 em testes de Mira e Reflexo." },
    detetive: { nome: "Detetive", pericias: ["Investigação", "Percepção"], extra: "Testes de Investigação/Percepção: role 2d20 e escolha o melhor." },
    psicologo: { nome: "Psicólogo / Terapeuta", pericias: ["Intuição", "Resistência Mental"], extra: "Descanso: aliado recupera 1d4 de SAN (1x por sessão)." },
    lider: { nome: "Líder Comunitário", pericias: ["Resistência Mental", "Diplomacia"], extra: "1x por cena: permite aliado somar +2 em teste que falhou." },
    hacker: { 
    nome: "Hacker", 
    pericias: ["Tecnologia", "Investigação"], 
    extra: "Especialista: +4 fixo em Tecnologia ou Investigação.",
    especialista: ["Tecnologia", "Investigação"] 
},
    criminoso: { nome: "Ex-Criminoso", pericias: ["Furtividade", "Enganação"], extra: "1x por cena: +1D4 em Furtividade ou Enganação." },
    engenheiro: { nome: "Engenheiro", pericias: ["Ciências", "Mecanismo"], extra: "+2 fixo em testes de Ciências e Mecanismo." },
    advogado: { nome: "Advogado", pericias: ["Diplomacia", "Enganação"], extra: "1x por cena: +1D8 em Diplomacia ou Intimidação." },
    comum: { nome: "Pessoa Comum", pericias: ["Sobrevivência", "Atletismo"], extra: "Você recebe +2 pontos de ENG (Energia)." }
};

/* ===============================
   NAVEGAÇÃO E MODAIS
================================ */
function mostrarTela(id) {
    document.querySelectorAll('.tela').forEach(t => t.classList.remove('ativa'));
    const tela = document.getElementById(id);
    if(tela) tela.classList.add('ativa');
}

const abrirJogador = () => mostrarTela('tela-jogador');
const abrirMestre = () => mostrarTela('tela-mestre');
const voltarMenu = () => mostrarTela('menu');


function abrirModalClasse() { document.getElementById('modal-classe').classList.remove('hidden'); }
function fecharModalClasse() { document.getElementById('modal-classe').classList.add('hidden'); }
function abrirModalOcupacao() { document.getElementById('ocupacaoModal').classList.remove('hidden'); }
function fecharModalOcupacao() { document.getElementById('ocupacaoModal').classList.add('hidden'); }
function fecharModalPericias() { document.getElementById("modal-pericias").classList.add("hidden"); }

/* ===============================
   LÓGICA DOS ATRIBUTOS
================================ */
let pontosRestantes = 9; // Total de pontos para distribuir

function alterarAtributo(attr, delta) {
    // Calcula o total atual gasto
    let totalGasto = Object.values(atributos).reduce((a, b) => a + b, 0);
    
    // Bloqueia se tentar aumentar e não houver pontos
    if (delta > 0 && totalGasto >= 9) {
        mostrarAviso("Você já distribuiu todos os 9 pontos!");
        return;
    }
    
    let novoValor = atributos[attr] + delta;
    
    // Limites de 0 a 3 por atributo
    if (novoValor < 0 || novoValor > 3) return;

    atributos[attr] = novoValor;
    document.querySelector(`[data-atributo="${attr}"]`).textContent = novoValor;
    
    // Atualiza o contador visual de pontos
    pontosRestantes = 9 - (totalGasto + delta);
    const contadorEl = document.getElementById("ponto-atributo-contador");
    if (contadorEl) contadorEl.textContent = 9 - (totalGasto + delta);

    recalcularTudo();
}


/* ===============================
   SISTEMA DE CLASSES, OCUPAÇÕES E PERÍCIAS
================================ */
function selecionarClasse(id) {
    classeAtual = id;
    habilidadesSelecionadas = []; // <--- ADICIONE ESTA LINHA AQUI (Reseta as habilidades)
    
    const dados = CLASSES[id];
    const campoClasse = document.getElementById('classe-atual');
    campoClasse.innerHTML = `<i class="fa-solid ${dados.icone}"></i> ${dados.nome}`;
    campoClasse.style.color = "#fff";
    
    fecharModalClasse();
    recalcularTudo();
    atualizarVisualPericias();
    atualizarVisualHabilidades(); // <--- E ADICIONE ESTA AQUI (Limpa o visual na ficha)
}

function carregarOcupacoes() {
    const lista = document.getElementById("listaOcupacoes");
    if (!lista) return;
    lista.innerHTML = ""; 
    for (let key in ocupacoes) {
        const btn = document.createElement("button");
        btn.innerHTML = `<i class="fa-solid fa-briefcase"></i> <span>${ocupacoes[key].nome}</span>`;
        btn.onclick = () => selecionarOcupacao(key);
        lista.appendChild(btn);
    }
}

function selecionarOcupacao(key) {
    ocupacaoAtual = ocupacoes[key];
    
    // 1. Atualiza o visual básico
    const labelOcup = document.getElementById("ocupacaoSelecionada");
    labelOcup.textContent = ocupacaoAtual.nome;
    labelOcup.style.color = "#fff";
    
    const periciasEl = document.getElementById("periciasTreinadas");
    periciasEl.innerHTML = ocupacaoAtual.pericias.map(p => `<li>${p}</li>`).join('');
    document.getElementById("caracteristicaExtra").textContent = ocupacaoAtual.extra;

    // 2. LIMPEZA DE CONFLITOS: Remove perícias manuais que agora são da Ocupação
    periciasEscolhidas = periciasEscolhidas.filter(p => !ocupacaoAtual.pericias.includes(p));

    // 3. CONTROLE DE LIMITE (O pulo do gato):
    // Se a nova ocupação não for Acadêmico (limite 2) e o usuário tiver 3, removemos a última.
    const novoLimite = ocupacaoAtual.maxPericiasExtras || 2;
    while (periciasEscolhidas.length > novoLimite) {
        periciasEscolhidas.pop(); // Remove a última selecionada até caber no limite
    }
    
    atualizarVisualPericias();
    fecharModalOcupacao();
    recalcularTudo();
}

function abrirModalPericias() {
    const grade = document.getElementById("grade-pericias-modal");
    grade.innerHTML = "";
    const periciasOcupacao = ocupacaoAtual ? ocupacaoAtual.pericias : [];

    TODAS_PERICIAS.forEach(p => {
        const estaNaOcupacao = periciasOcupacao.includes(p);
        const estaSelecionada = periciasEscolhidas.includes(p);
        const div = document.createElement("div");
        div.className = `item-pericia ${estaNaOcupacao ? 'bloqueada' : ''} ${estaSelecionada ? 'selecionada' : ''}`;
        
        div.innerHTML = `
            <span>${p}</span>
            ${estaNaOcupacao ? '<i class="fa-solid fa-lock"></i>' : ''}
            <span class="badge-nivel">${estaSelecionada ? (classeAtual === 'suporte' ? '+4' : '+2') : ''}</span>
        `;

        if (!estaNaOcupacao) div.onclick = () => alternarPericia(p);
        grade.appendChild(div);
    });
    document.getElementById("modal-pericias").classList.remove("hidden");
}

/* ===============================
   SISTEMA DE CLASSES, OCUPAÇÕES E PERÍCIAS
================================ */

// ... (mantenha selecionarClasse e carregarOcupacoes como estão)

function alternarPericia(nome) {
    const index = periciasEscolhidas.indexOf(nome);
    
    // Se já estiver selecionada, removemos (independente de ocupação)
    if (index > -1) {
        periciasEscolhidas.splice(index, 1);
    } else {
        // Lógica de limite de perícias
        const limiteBase = 2;
        const eAcademico = ocupacaoAtual && ocupacaoAtual.maxPericiasExtras === 3;
        
        if (periciasEscolhidas.length < limiteBase) {
            // Se tem menos de 2, qualquer uma entra
            periciasEscolhidas.push(nome);
        } else if (eAcademico && periciasEscolhidas.length === 2) {
            // Se já tem 2 e é Acadêmico, a 3ª precisa estar na lista dele
            if (ocupacaoAtual.escolhaAdicional.includes(nome)) {
                periciasEscolhidas.push(nome);
            } else {
                mostrarAviso("Para sua 3ª perícia de Acadêmico, escolha entre: " + ocupacaoAtual.escolhaAdicional.join(", "));
                return; // Para não atualizar o visual sem necessidade
            }
        } else {
            mostrarAviso(`Você só pode escolher ${eAcademico ? '3' : '2'} perícias extras!`);
            return;
        }
    }
    atualizarVisualPericias();
    abrirModalPericias(); 
}

function atualizarVisualPericias() {
    const listaFicha = document.getElementById("lista-pericias-selecionadas");
    if (!listaFicha) return;

    const periciasOcupacao = ocupacaoAtual ? ocupacaoAtual.pericias : [];
    const limiteExtras = (ocupacaoAtual && ocupacaoAtual.maxPericiasExtras) ? 3 : 2;
    
    // Atualiza o contador no botão da ficha
    const infoLabel = document.getElementById("info-selecao-pericias");
    if (infoLabel) infoLabel.textContent = `Selecionar Perícias (${periciasEscolhidas.length}/${limiteExtras})`;

    // Gerar Badges da Ocupação (com regra de Hacker)
    let html = periciasOcupacao.map(p => {
        let bonusEspecialista = "";
        if (ocupacaoAtual?.especialista?.includes(p)) {
            bonusEspecialista = ` <strong>+4</strong>`;
        }
        return `<li class="badge-pericia"><i class="fa-solid fa-briefcase"></i> ${p}${bonusEspecialista}</li>`;
    }).join('');

    // Gerar Badges das Escolhidas Manualmente
    const bonusClasse = (classeAtual === 'suporte') ? 4 : 2;
    html += periciasEscolhidas.map(p => `
        <li class="badge-pericia badge-extra">${p} <strong>+${bonusClasse}</strong></li>
    `).join('');

    listaFicha.innerHTML = html;
}

function abrirModalHabilidades() {
    if (!classeAtual) { mostrarAviso("Escolha uma classe primeiro!"); return; }
    
    const dados = HABILIDADES_DATA[classeAtual];
    document.getElementById("nome-classe-modal").textContent = CLASSES[classeAtual].nome;
    document.getElementById("regra-classe-modal").textContent = `Escolha ${dados.limite} habilidades.`;
    
    const container = document.getElementById("lista-habilidades-modal");
    container.innerHTML = "";

    dados.opcoes.forEach(hab => {
        const selecionada = habilidadesSelecionadas.some(h => h.nome === hab.nome);
        const div = document.createElement("div");
        div.className = `item-habilidade ${selecionada ? 'selecionada' : ''}`;
        div.innerHTML = `
            <div class="hab-topo">
                <strong>${hab.nome}</strong>
                <span class="hab-meta">${hab.tipo} | ${hab.custo}</span>
            </div>
            <p class="hab-desc">${hab.efeito}</p>
        `;
        div.onclick = () => alternarHabilidade(hab);
        container.appendChild(div);
    });

    document.getElementById("modal-habilidades").classList.remove("hidden");
}

function alternarHabilidade(hab) {
    const dadosClasse = HABILIDADES_DATA[classeAtual];
    const index = habilidadesSelecionadas.findIndex(h => h.nome === hab.nome);

    if (index > -1) {
        habilidadesSelecionadas.splice(index, 1);
    } else {
        if (habilidadesSelecionadas.length < dadosClasse.limite) {
            habilidadesSelecionadas.push(hab);
        } else {
            mostrarAviso(`Limite de ${dadosClasse.limite} habilidades atingido!`);
        }
    }
    atualizarVisualHabilidades();
    abrirModalHabilidades(); // Renderiza novamente para mostrar a seleção
}

function atualizarVisualHabilidades() {
    const listaFicha = document.getElementById("lista-habilidades-selecionadas");
    const infoLabel = document.getElementById("info-selecao-habilidades");
    if (!listaFicha || !classeAtual) return;

    const dados = HABILIDADES_DATA[classeAtual];
    infoLabel.textContent = `Selecionar Habilidades (${habilidadesSelecionadas.length}/${dados.limite})`;

    let html = "";

    // Se for Rastreador, mostra as fixas primeiro
    if (classeAtual === 'rastreador') {
        html += dados.fixas.map(h => `
            <li class="badge-pericia" style="background: rgba(255,255,255,0.05); border-color: #555;">
                <div style="width: 100%">
                    <small style="color: #aaa; text-transform: uppercase; font-size: 0.6rem;">Fixa</small><br>
                    <strong>${h.nome}</strong>: <span style="font-size: 0.75rem;">${h.efeito}</span>
                </div>
            </li>
        `).join('');
    }

    // Mostra as selecionadas
    html += habilidadesSelecionadas.map(h => `
        <li class="badge-pericia badge-extra" style="border-left: 4px solid #b11212;">
            <div style="width: 100%">
                <strong>${h.nome}</strong> <small>(${h.tipo} | ${h.custo})</small><br>
                <span style="font-size: 0.75rem;">${h.efeito}</span>
            </div>
        </li>
    `).join('');

    listaFicha.innerHTML = html;
}

function fecharModalHabilidades() {
    document.getElementById("modal-habilidades").classList.add("hidden");
}

   /* ===============================
   CÁLCULOS FINAIS
================================ */
function recalcularTudo() {
    if (!classeAtual) return;

    const c = CLASSES[classeAtual];
    const hp = c.hp(atributos.constituicao);
    const san = c.san(atributos.presenca);
    let eng = c.eng(atributos.destreza, atributos.constituicao);
    const def = 9 + atributos.destreza;

    // Aplica bônus da ocupação Pessoa Comum
    if (ocupacaoAtual && ocupacaoAtual.nome === "Pessoa Comum") eng += 2;

    atualizarBarra('hp', hp);
    atualizarBarra('san', san);
    atualizarBarra('eng', eng);
    
    const defEl = document.getElementById('def');
    if (defEl) defEl.textContent = def;
}

function atualizarBarra(tipo, valor) {
    const el = document.getElementById(tipo);
    if (!el) return;
    el.textContent = `${valor} / ${valor}`;
    const barraContainer = el.closest('.barra');
    if (barraContainer) {
        const barraInterna = barraContainer.querySelector('.barra-interna');
        if (barraInterna) barraInterna.style.width = '100%';
    }
}

/* ===============================
   INICIALIZAÇÃO
================================ */
document.addEventListener('DOMContentLoaded', () => {
    carregarOcupacoes();
    
    const btnSalvar = document.querySelector('.salvar');
    if (btnSalvar) {
        // Agora ele chama a função real de salvar que você criou!
        btnSalvar.onclick = salvarPersonagem; 
    }
});

/* ===============================
   SISTEMA DE PERSISTÊNCIA (STORAGE)
================================ */

function abrirMeusPersonagens() {
    mostrarTela('tela-meus-personagens');
    renderizarListaPersonagens();
}

function salvarPersonagem() {
    const nomeJogador = document.getElementById("input-nome-jogador")?.value || "Desconhecido";
    const nomePersonagem = document.getElementById("input-nome-personagem")?.value || "Sem Nome";
    const idade = document.getElementById("input-idade")?.value || "—";

    if (nomePersonagem === "Sem Nome") {
        mostrarAviso("Dê um nome ao seu sobrevivente!");
        return;
    }
    
    const personagem = {
        id: Date.now(),
        nomeJogador,
        nomePersonagem,
        idade,
        classe: classeAtual ? CLASSES[classeAtual].nome : "Nenhuma",
        ocupacao: ocupacaoAtual?.nome || "Nenhuma",
        atributos: { ...atributos },
        pericias: [...periciasEscolhidas],
        habilidades: [...habilidadesSelecionadas]
    };

    let salvos = JSON.parse(localStorage.getItem('exploradores_caos_fichas')) || [];
    salvos.push(personagem);
    localStorage.setItem('exploradores_caos_fichas', JSON.stringify(salvos));

    mostrarAviso("Ficha salva com sucesso!");
    abrirJogador();
}

function visualizarPersonagem(id) {
    const salvos = JSON.parse(localStorage.getItem('exploradores_caos_fichas')) || [];
    const p = salvos.find(perso => perso.id === id);

    if (!p) return;

    // 1. Nome como digitado (sem maiúsculas forçadas)
    document.getElementById('resumo-nome-jogador').textContent = p.nomeJogador;
    document.getElementById('resumo-nome-personagem').textContent = p.nomePersonagem;
    document.getElementById('resumo-idade').textContent = p.idade;
    document.getElementById('resumo-classe').textContent = p.classe;
    document.getElementById('resumo-ocupacao').textContent = p.ocupacao;

    // Cálculos de Status
    const classeKey = Object.keys(CLASSES).find(key => CLASSES[key].nome === p.classe);
    const cFormula = CLASSES[classeKey];
    if (cFormula) {
        const hp = cFormula.hp(p.atributos.constituicao);
        const san = cFormula.san(p.atributos.presenca);
        let eng = cFormula.eng(p.atributos.destreza, p.atributos.constituicao);
        if (p.ocupacao === "Pessoa Comum") eng += 2;
        const def = 9 + p.atributos.destreza;
        document.getElementById('resumo-status').textContent = `HP: ${hp} | SAN: ${san} | ENG: ${eng} | DEF: ${def}`;
    }

    // 2. Unindo Perícias da Ocupação + Escolhidas
    // Buscamos as perícias fixas da ocupação atual nos dados globais
    const ocupacaoData = Object.values(ocupacoes).find(o => o.nome === p.ocupacao);
    const periciasOcupacao = ocupacaoData ? ocupacaoData.pericias : [];
    const todasPericias = [...periciasOcupacao, ...p.pericias];
    
    document.getElementById('resumo-pericias').textContent = todasPericias.join(', ');

    // Atributos e Habilidades
    const atalhos = { forca: "FOR", destreza: "DES", constituicao: "CON", inteligencia: "INT", presenca: "PRE" };
    document.getElementById('resumo-atributos').textContent = Object.entries(p.atributos)
        .map(([key, val]) => `${atalhos[key]}: ${val}`).join(' | ');

    const containerHabs = document.getElementById('resumo-habilidades');
    containerHabs.innerHTML = p.habilidades.map(h => `
        <div style="margin-bottom: 5px; font-size: 0.8rem;">• ${h.nome}</div>
    `).join('');

    document.getElementById('resumo-data').textContent = `Gerado em: ${new Date(p.id).toLocaleDateString('pt-BR')}`;
    document.getElementById('modal-visualizar').classList.remove('hidden');
}

function fecharModalVisualizar() {
    document.getElementById('modal-visualizar').classList.add('hidden');
}

function renderizarListaPersonagens() {
    const container = document.getElementById('lista-personagens-salvos');
    const salvos = JSON.parse(localStorage.getItem('exploradores_caos_fichas')) || [];

    if (salvos.length === 0) {
        container.innerHTML = "<p style='text-align:center; opacity:0.5;'>Nenhum sobrevivente encontrado.</p>";
        return;
    }

    container.innerHTML = salvos.map(p => `
        <div class="card-personagem-salvo">
            <div class="info">
                <strong>${p.nomePersonagem}</strong>
                <span>${p.classe} | ${p.ocupacao}</span>
            </div>
            <div class="acoes-card">
                <button class="btn-visualizar" onclick="visualizarPersonagem(${p.id})">
                    <i class="fa-solid fa-eye"></i> Visualizar
                </button>
                <button class="btn-excluir" onclick="excluirPersonagem(${p.id})" title="Excluir">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}


async function excluirPersonagem(id) {
    // Agora usamos nossa função bonitona em vez do confirm()
    const confirmou = await perguntar("ZONA DE PERIGO", "Deseja realmente apagar este sobrevivente? Esta ação é irreversível.");

    if (confirmou) {
        let salvos = JSON.parse(localStorage.getItem('exploradores_caos_fichas')) || [];
        salvos = salvos.filter(p => p.id !== id);
        localStorage.setItem('exploradores_caos_fichas', JSON.stringify(salvos));
        
        renderizarListaPersonagens();
        mostrarAviso("Registro eliminado do sistema."); // Usando o seu novo Toast!
    }
}

/* ===============================
   FUNÇÕES DE RESET E CRIAÇÃO
================================ */

const abrirCriarPersonagem = () => {
    resetarEstado(); // Garante que a ficha esteja limpa
    mostrarTela('tela-criar');
};

function resetarEstado() {
    // 1. Reseta as variáveis de controle
    classeAtual = null;
    ocupacaoAtual = null;
    periciasEscolhidas = [];
    habilidadesSelecionadas = [];
    
    // 2. Reseta os atributos para zero
    for (let a in atributos) {
        atributos[a] = 0;
        const display = document.querySelector(`[data-atributo="${a}"]`);
        if (display) display.textContent = "0";
    }
    
    // 3. Limpa os campos de texto (Nome, Idade, etc)
    document.querySelectorAll('.tela-criar input').forEach(input => input.value = "");
    
    // 4. Reseta os labels visuais de Classe e Ocupação
    const labelClasse = document.getElementById('classe-atual');
    if (labelClasse) {
        labelClasse.textContent = "Nenhuma classe";
        labelClasse.style.color = "#888";
    }

    const labelOcup = document.getElementById("ocupacaoSelecionada");
    if (labelOcup) {
        labelOcup.textContent = "Nenhuma";
        labelOcup.style.color = "#888";
    }

    // 5. Reseta o contador de pontos de atributo
    const contadorAtal = document.getElementById('ponto-atributo-contador');
    if (contadorAtal) contadorAtal.textContent = "9";
    
    // 6. Limpa as listas de perícias e habilidades da interface
    const listaPericias = document.getElementById("lista-pericias-selecionadas");
    if (listaPericias) listaPericias.innerHTML = "";
    
    const listaHabs = document.getElementById("lista-habilidades-selecionadas");
    if (listaHabs) listaHabs.innerHTML = "";

    const periciasOcup = document.getElementById("periciasTreinadas");
    if (periciasOcup) periciasOcup.innerHTML = "";

    const extraOcup = document.getElementById("caracteristicaExtra");
    if (extraOcup) extraOcup.textContent = "—";

    // 7. Zera as barras de HP/SAN/ENG
    recalcularTudo();
}

function mostrarAviso(mensagem) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = mensagem;
    
    container.appendChild(toast);

    // Remove do HTML depois que a animação de sumir termina
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function perguntar(titulo, mensagem) {
    return new Promise((resolve) => {
        const modal = document.getElementById('modal-confirmacao');
        const btnSim = document.getElementById('btn-confirm-sim');
        const btnNao = document.getElementById('btn-confirm-nao');

        document.getElementById('confirm-titulo').textContent = titulo;
        document.getElementById('confirm-mensagem').textContent = mensagem;

        modal.classList.remove('hidden');

        // Função interna para fechar e retornar a resposta
        const fechar = (resposta) => {
            modal.classList.add('hidden');
            btnSim.onclick = null;
            btnNao.onclick = null;
            resolve(resposta);
        };

        btnSim.onclick = () => fechar(true);
        btnNao.onclick = () => fechar(false);
    });
}