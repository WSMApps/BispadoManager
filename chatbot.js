const assistantToggle = document.querySelector("#assistant-toggle");
const assistantPanel = document.querySelector("#assistant-panel");
const assistantClose = document.querySelector("#assistant-close");
const assistantMessages = document.querySelector("#assistant-messages");
const assistantForm = document.querySelector("#assistant-form");
const assistantInput = document.querySelector("#assistant-input");
const assistantSuggestions = document.querySelector("#assistant-suggestions");
const assistantStartGuided = document.querySelector("#assistant-start-guided");
const assistantQuickReplies = document.querySelector("#assistant-quick-replies");
const officialManualUrl = "https://www.churchofjesuschrist.org/study/manual/general-handbook?lang=por";

const guidedSteps = [
  { type: "field", id: "ward", prompt: "Qual é o nome da ala?" },
  { type: "field", id: "meeting-date", prompt: "Qual é a data da reunião? Informe no formato DD/MM/AAAA.", date: true },
  { type: "field", id: "president", prompt: "Quem presidirá a reunião?" },
  { type: "field", id: "conducting", prompt: "Quem dirigirá a reunião?" },
  { type: "field", id: "regent", prompt: "Quem será o regente?" },
  { type: "field", id: "organist", prompt: "Quem será o organista?" },
  { type: "field", id: "receptionist", prompt: "Quem será o recepcionista?" },
  { type: "field", id: "leaders-present", prompt: "Há visitantes ou líderes para reconhecer? Informe os nomes ou digite “pular”.", optional: true },
  { type: "field", id: "announcements", prompt: "Quais são os anúncios? Você pode informar mais de um, separados por ponto e vírgula, ou digitar “pular”.", optional: true },
  { type: "field", id: "opening-hymn-name", prompt: "Qual é o nome do primeiro hino?" },
  { type: "field", id: "opening-hymn-number", prompt: "Qual é o número do primeiro hino?" },
  { type: "field", id: "opening-prayer", prompt: "Quem fará a primeira oração?" },
  { type: "field", id: "sacramental-hymn", prompt: "Qual é o nome do hino sacramental?" },
  { type: "field", id: "sacramental-hymn-number", prompt: "Qual é o número do hino sacramental?" },
  { type: "field", id: "speaker-1-name", prompt: "Quem será o primeiro orador?" },
  { type: "field", id: "speaker-1-topic", prompt: "Qual será o tema do primeiro orador?" },
  { type: "field", id: "speaker-2-name", prompt: "Quem será o segundo orador?" },
  { type: "field", id: "speaker-2-topic", prompt: "Qual será o tema do segundo orador?" },
  { type: "field", id: "special-hymn", prompt: "Qual é o nome do hino especial?" },
  { type: "field", id: "special-hymn-number", prompt: "Qual é o número do hino especial?" },
  { type: "field", id: "speaker-3-name", prompt: "Quem será o último orador?" },
  { type: "field", id: "speaker-3-topic", prompt: "Qual será o tema do último orador?" },
  { type: "field", id: "closing-hymn", prompt: "Qual é o nome do último hino?" },
  { type: "field", id: "closing-hymn-number", prompt: "Qual é o número do último hino?" },
  { type: "field", id: "closing-prayer", prompt: "Quem fará a última oração?" },
  {
    type: "list",
    prefix: "support",
    title: "apoio",
    plural: "apoios",
    fields: [
      { key: "name", label: "nome" },
      { key: "calling", label: "chamado" }
    ],
    max: 10
  },
  {
    type: "list",
    prefix: "release",
    title: "desobrigação",
    plural: "desobrigações",
    fields: [
      { key: "name", label: "nome" },
      { key: "calling", label: "chamado" }
    ],
    max: 10
  },
  {
    type: "list",
    prefix: "ordinance",
    title: "ordenança",
    plural: "ordenanças",
    fields: [
      { key: "type", label: "tipo de ordenança" },
      { key: "officiant", label: "quem realiza" },
      { key: "notes", label: "observações" }
    ],
    max: 3
  }
];

let guidedInterview = null;

const responseTopics = [
  {
    phrases: [
      "criar agenda",
      "montar agenda",
      "preencher agenda",
      "como monto a agenda",
      "como monto a agenda sacramental",
      "como montar a agenda sacramental",
      "como criar a agenda",
      "nova agenda",
      "criar uma agenda",
      "montar a agenda",
      "formulario",
      "cadastro",
      "comecar agenda",
      "por onde comeco"
    ],
    answer: "Você pode preencher manualmente: abra “Agenda Sacramental” e escolha “Criar agenda”. Ou use o botão com o ícone de folha e “+” no cabeçalho do chat para responder às perguntas e gerar a prévia."
  },
  {
    phrases: [
      "salvar agenda",
      "salvar e visualizar",
      "visualizar agenda",
      "conferir agenda",
      "atualizar agenda",
      "depois de preencher"
    ],
    answer: "Preencha as etapas e selecione “Revisar agenda” para conferir a prévia. Para corrigir algum dado, escolha “Editar agenda” e volte à etapa correspondente."
  },
  {
    phrases: [
      "imprimir",
      "impressao",
      "imprimir agenda",
      "imprimir a agenda",
      "imprimir ata",
      "imprimir a ata",
      "como imprimo",
      "imprimo a agenda",
      "imprimo a ata",
      "salvar pdf",
      "gerar pdf",
      "salvar como pdf",
      "pdf",
      "papel"
    ],
    answer: "Primeiro gere ou confira a agenda preenchida. Depois, use o botão “Imprimir agenda”. A impressão é organizada em duas páginas no formato A4; na janela de impressão do navegador você também pode escolher “Salvar como PDF”."
  },
  {
    phrases: [
      "dados salvos",
      "salva os dados",
      "salva minhas informacoes",
      "onde ficam os dados",
      "dados armazenados",
      "privacidade",
      "supabase",
      "permanecem",
      "atualizar a pagina"
    ],
    answer: "O rascunho da agenda é salvo automaticamente apenas neste navegador e pode ser apagado com “Limpar campos”. O modelo generativo, quando ativado, processa as perguntas neste dispositivo. Para baixá-lo pela primeira vez é necessária conexão à internet."
  },
  {
    phrases: [
      "limpar campos",
      "apagar campos",
      "limpar formulario",
      "comecar do zero",
      "resetar formulario",
      "zerar formulario"
    ],
    answer: "Na tela de cadastro, use “Limpar campos” para limpar o formulário. Os valores de exemplo são carregados novamente quando a página é atualizada."
  },
  {
    phrases: [
      "editar agenda",
      "alterar agenda",
      "mudar informacoes",
      "corrigir agenda",
      "editar os campos",
      "alterar os campos"
    ],
    answer: "Na tela da agenda preenchida, escolha “Editar agenda”, ajuste os campos por etapa e selecione “Revisar agenda” para atualizar a prévia."
  },
  {
    phrases: [
      "hino",
      "hinos",
      "numero do hino",
      "numero de hino",
      "hino especial",
      "hino final",
      "hino de encerramento"
    ],
    answer: "Cada hino tem campos separados para o nome e o número. Posso procurar hinos pelo título ou pelo número no índice do hinário simplificado que você enviou."
  },
  {
    phrases: [
      "apoios",
      "desobrigacoes",
      "ordenancas",
      "testemunhos",
      "segunda pagina",
      "segunda folha"
    ],
    answer: "A segunda página da agenda reúne Apoios, Desobrigações, Ordenanças e Testemunhos. Apoios, desobrigações e ordenanças são preenchidos no cadastro; os espaços para testemunhos podem ser preenchidos à mão depois de imprimir."
  },
  {
    phrases: [
      "oradores",
      "discursos",
      "orador",
      "tema da mensagem",
      "ultimo orador"
    ],
    answer: "Na tela “Criar agenda”, preencha o nome e o tema de cada orador nos campos da seção de oradores. Depois, salve e visualize a agenda para conferir."
  },
  {
    phrases: [
      "o que voce faz",
      "como voce funciona",
      "quem e voce",
      "voce e uma ia",
      "inteligencia artificial",
      "generativa",
      "secretarioai",
      "voce e uma pessoa",
      "voce e o bispo",
      "voce e membro da igreja"
    ],
    answer: "Sou o SecretárioAI, uma persona sintética de inteligência artificial e assistente virtual do BispadoManager. Não sou uma pessoa ou membro real, nem bispo, líder eclesiástico ou representante oficial da Igreja. Ajudo a organizar a agenda e a localizar informações em fontes oficiais; minhas respostas não substituem o Manual Geral vigente nem a orientação de líderes locais."
  },
  {
    phrases: ["qual seu time", "para que time voce torce", "time do coracao", "torce pelo sao paulo", "voce torce para quem"],
    answer: "Como personagem, torço pelo São Paulo! Essa preferência não interfere nas minhas respostas sobre a Igreja ou sobre a agenda."
  },
  {
    phrases: ["quantos anos voce tem", "qual sua idade", "sua idade"],
    answer: "Como personagem fictício, tenho 32 anos. Sou uma persona sintética de inteligência artificial, não uma pessoa real."
  },
  {
    phrases: [
      "o que e o bispadomanager",
      "sobre o site",
      "para que serve",
      "qual a funcao do site",
      "agenda sacramental"
    ],
    answer: "O BispadoManager ajuda a organizar a agenda da reunião sacramental: você preenche as designações e a programação, confere uma prévia e pode imprimir em A4."
  }
];

function normalizeQuestion(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function scorePhraseMatch(normalizedQuestion, phrase) {
  const normalizedPhrase = normalizeQuestion(phrase);

  if (normalizedQuestion.includes(normalizedPhrase)) {
    return normalizedPhrase.length * 2 + normalizedPhrase.split(" ").length * 5;
  }

  const ignoredWords = new Set([
    "a", "as", "ao", "aos", "com", "da", "das", "de", "do", "dos",
    "e", "em", "igreja", "manual", "me", "na", "nas", "no", "nos",
    "o", "os", "para", "por", "que", "sacramental", "sobre", "um", "uma",
    "voce"
  ]);
  const questionWords = new Set(
    normalizedQuestion.split(" ").filter((word) => word.length > 2 && !ignoredWords.has(word))
  );
  const phraseWords = [...new Set(
    normalizedPhrase.split(" ").filter((word) => word.length > 2 && !ignoredWords.has(word))
  )];

  if (phraseWords.length === 1) {
    const [word] = phraseWords;
    return word.length >= 6 && questionWords.has(word) ? 13 + word.length / 100 : 0;
  }

  if (phraseWords.length < 2) {
    return 0;
  }

  const matchedWords = phraseWords.filter((word) => questionWords.has(word)).length;
  const matchedSpecificWord = phraseWords.find((word) => questionWords.has(word) && word.length >= 6);
  if (
    matchedWords === 0
    || (matchedWords === 1 && (!matchedSpecificWord || phraseWords.length > 2))
    || (matchedWords > 1 && matchedWords / phraseWords.length < 0.75)
  ) {
    return 0;
  }

  return matchedWords * 10 + (matchedWords / phraseWords.length) * 10 + phraseWords.length / 100;
}

function getLocalAnswer(question) {
  const normalizedQuestion = normalizeQuestion(question);
  const greeting = /^(oi|ola|bom dia|boa tarde|boa noite|tudo bem|ola tudo bem|e ai)$/.test(normalizedQuestion);

  if (greeting) {
    return "Olá! Sou o SecretárioAI, assistente virtual do BispadoManager. Posso ajudar a organizar a agenda sacramental e localizar informações em fontes oficiais da Igreja.";
  }

  if (/^(obrigado|obrigada|muito obrigado|muito obrigada|valeu|agradeco)$/.test(normalizedQuestion)) {
    return "Por nada! Fico feliz em ajudar. Se quiser montar uma agenda, use o botão com o ícone de folha no cabeçalho do chat.";
  }

  if (/^(tchau|ate mais|ate logo|ate a proxima)$/.test(normalizedQuestion)) {
    return "Até mais! Quando precisar, estarei aqui para ajudar.";
  }

  if (/^(tudo bem|como vai|como voce esta|como voce vai)$/.test(normalizedQuestion)) {
    return "Tudo certo por aqui, obrigado por perguntar! Como posso ajudar?";
  }

  if (/^(ajuda|help|o que voce sabe|o que posso perguntar|como pode me ajudar)$/.test(normalizedQuestion)) {
    return "Posso explicar como preencher, editar e imprimir a agenda, falar sobre hinos e designações ou conduzir o preenchimento. Para começar, use o botão com o ícone de folha no cabeçalho do chat.";
  }

  if (/^(sim|nao|ok|certo|entendi|pode ser|legal|bacana|show|beleza)$/.test(normalizedQuestion)) {
    return "Certo! Se quiser montar uma agenda passo a passo, use o botão com o ícone de folha e “+” no cabeçalho do chat. Também posso responder dúvidas sobre o preenchimento e a impressão.";
  }

  const navigationResult = handleNavigationRequest(normalizedQuestion);
  if (navigationResult) {
    return navigationResult;
  }

  const knowledgeBaseAnswer = findKnowledgeBaseAnswer(normalizedQuestion, question);
  if (knowledgeBaseAnswer) {
    return knowledgeBaseAnswer;
  }

  const hymnAnswer = findHymnCatalogAnswer(normalizedQuestion);
  if (hymnAnswer) {
    return hymnAnswer;
  }

  const matchingTopic = findMatchingTopic(normalizedQuestion);
  if (matchingTopic?.answer) {
    return matchingTopic.answer;
  }

  if (/\bmanual\b|\bmanual geral\b|\breunioes?\b|\bconselhos?\b|\bbatismo\b|\bordenancas?\b|\bsacramental\b|\bministracao\b/.test(normalizedQuestion)) {
    return `Posso responder com resumos locais preparados e localizar outros assuntos no índice do Manual Geral enviado (versão 2/25), mas não tenho o texto completo nem um resumo de cada seção. Se você informar o assunto com mais palavras ou o número do item, posso procurar uma referência relacionada. Para instruções completas e atualizadas, consulte o Manual Geral oficial: ${officialManualUrl}`;
  }

  return "Ainda não tenho uma resposta preparada para essa pergunta. Posso ajudar com outra coisa?";
}

function findKnowledgeBaseAnswer(normalizedQuestion, originalQuestion = "") {
  const knowledgeBase = window.SECRETARIO_KNOWLEDGE_BASE;
  const manualIndex = window.SECRETARIO_MANUAL_INDEX;

  if (!Array.isArray(knowledgeBase) && !Array.isArray(manualIndex)) {
    return null;
  }

  const indexedMatch = findManualIndexMatch(normalizedQuestion, manualIndex, originalQuestion, false);
  if (indexedMatch) {
    const sectionKnowledge = Array.isArray(knowledgeBase)
      ? knowledgeBase.find((entry) => entry.section === indexedMatch.section)
      : null;

    if (sectionKnowledge) {
      return `${sectionKnowledge.answer}\nManual Geral oficial: ${officialManualUrl}`;
    }

    if (indexedMatch.exact) {
      const label = indexedMatch.section.includes(".") ? "item" : "capítulo";
      return `No Manual Geral enviado (versão 2/25), o ${label} ${indexedMatch.section} é “${indexedMatch.title}” (p. ${indexedMatch.page}). Esse índice localiza o subtítulo; para detalhes e instruções completas, consulte o item na edição oficial vigente.\nManual Geral oficial: ${officialManualUrl}`;
    }
  }

  let bestEntry = null;
  let bestScore = 0;

  for (const entry of knowledgeBase || []) {
    for (const phrase of entry.phrases) {
      const score = scorePhraseMatch(normalizedQuestion, phrase);
      if (score > bestScore) {
        bestEntry = entry;
        bestScore = score;
      }
    }
  }

  if (bestEntry) {
    return bestEntry.section
      ? `${bestEntry.answer}\nManual Geral oficial: ${officialManualUrl}`
      : bestEntry.answer;
  }

  const titleMatch = indexedMatch || findManualIndexMatch(normalizedQuestion, manualIndex, originalQuestion);
  if (titleMatch) {
    const sectionKnowledge = Array.isArray(knowledgeBase)
      ? knowledgeBase.find((entry) => entry.section === titleMatch.section)
      : null;

    if (sectionKnowledge) {
      return `${sectionKnowledge.answer}\nManual Geral oficial: ${officialManualUrl}`;
    }

    const label = titleMatch.section.includes(".") ? "item" : "capítulo";
    return `No Manual Geral enviado (versão 2/25), o ${label} ${titleMatch.section} é “${titleMatch.title}” (p. ${titleMatch.page}). Esse índice localiza o subtítulo; para detalhes e instruções completas, consulte o item na edição oficial vigente.\nManual Geral oficial: ${officialManualUrl}`;
  }

  const indexMatches = findManualIndexMatches(normalizedQuestion, manualIndex);
  if (indexMatches.length > 0) {
    const references = indexMatches
      .map((entry) => `• Item ${entry.section} — “${entry.title}” (p. ${entry.page})`)
      .join("\n");
    return `Encontrei estas referências pelos termos do título no índice local do Manual Geral enviado (versão 2/25):\n${references}\nA busca localiza títulos, não o texto nem um resumo deste item. Consulte a edição oficial vigente para ler o conteúdo completo.\nManual Geral oficial: ${officialManualUrl}`;
  }

  if (/\bmanual geral\b|\bmanual da igreja\b|\bpdf do manual\b|\bo que voce sabe do manual\b|\bo que pode me falar sobre o manual\b|\bme fale sobre o manual\b|\bfale sobre o manual\b/.test(normalizedQuestion)) {
    return `O índice local contém 1.317 títulos de capítulos, seções e subseções numeradas do Manual Geral enviado (versão 2/25), com seus números e páginas. Há respostas resumidas para alguns assuntos, mas o índice não reproduz nem resume o texto integral. Consulte a edição oficial vigente para instruções completas e atualizadas.\nManual Geral oficial: ${officialManualUrl}`;
  }

  return null;
}

function findManualIndexMatch(normalizedQuestion, manualIndex, originalQuestion, includeTitles = true) {
  if (!Array.isArray(manualIndex)) {
    return null;
  }

  const referenceMatch = /\b(?:item|secao|subsecao|capitulo)\s+(\d{1,2}(?:\s+\d{1,2}){0,3})\b/.exec(normalizedQuestion)
    || /\b(\d{1,2}(?:\.\d{1,3}){1,3})\b/.exec(originalQuestion)
    || /^(\d{1,2}(?:\s+\d{1,2}){0,3})(?:\s|$)/.exec(normalizedQuestion);

  if (referenceMatch) {
    const section = referenceMatch[1].trim().replace(/\s+/g, ".").replace(/\.+/g, ".");
    const entry = manualIndex.find((item) => item.section === section);
    if (entry) {
      return { ...entry, exact: true };
    }
  }

  if (!includeTitles) {
    return null;
  }

  const matchingTitle = manualIndex
    .map((item) => ({ ...item, normalizedTitle: normalizeQuestion(item.title) }))
    .filter((item) => item.normalizedTitle.length >= 10 && normalizedQuestion.includes(item.normalizedTitle))
    .sort((a, b) => b.normalizedTitle.length - a.normalizedTitle.length)[0];

  return matchingTitle ? { ...matchingTitle, exact: true } : null;
}

function findManualIndexMatches(normalizedQuestion, manualIndex, limit = 5) {
  if (!Array.isArray(manualIndex)) {
    return [];
  }

  const ignoredWords = new Set([
    "a", "as", "ao", "aos", "com", "da", "das", "de", "do", "dos",
    "e", "em", "entre", "para", "por", "que", "sobre", "um", "uma",
    "qual", "quais", "onde", "como", "manual", "geral", "igreja",
    "item", "itens", "secao", "subsecao", "capitulo", "capitulos"
  ]);
  const queryTerms = [...new Set(
    normalizedQuestion
      .split(" ")
      .filter((term) => term.length >= 3 && !ignoredWords.has(term))
  )];

  if (queryTerms.length === 0) {
    return [];
  }

  return manualIndex
    .map((entry) => {
      const titleTerms = normalizeQuestion(entry.title).split(" ");
      const matches = queryTerms.map((term) => titleTerms.some((titleTerm) => (
        titleTerm === term
        || (term.length >= 4 && titleTerm.startsWith(term))
        || (titleTerm.length >= 4 && term.startsWith(titleTerm))
      )));
      const matchedTerms = matches.filter(Boolean).length;
      const exactMatches = queryTerms.filter((term) => titleTerms.includes(term)).length;

      return {
        ...entry,
        score: exactMatches * 4 + matchedTerms,
        matchedTerms,
        exactMatches,
        coverage: matchedTerms / queryTerms.length
      };
    })
    .filter((entry) => entry.matchedTerms > 0 && entry.coverage >= 0.5)
    .sort((a, b) => (
      b.score - a.score
      || b.coverage - a.coverage
      || b.section.length - a.section.length
    ))
    .slice(0, limit);
}

function findHymnCatalogAnswer(normalizedQuestion) {
  const catalog = window.SECRETARIO_HYMN_CATALOG;

  if (!Array.isArray(catalog)) {
    return null;
  }

  const asksAboutSacramentalHymns = /\bsacrament/.test(normalizedQuestion);
  const matchingTitle = catalog
    .map((hymn) => ({ ...hymn, normalizedTitle: normalizeQuestion(hymn.title) }))
    .filter((hymn) => normalizedQuestion.includes(hymn.normalizedTitle))
    .sort((a, b) => b.normalizedTitle.length - a.normalizedTitle.length)[0];

  if (matchingTitle && asksAboutSacramentalHymns) {
    return matchingTitle.categories?.includes("sacramental")
      ? `Sim. “${matchingTitle.title}” (hino ${matchingTitle.number}) está marcado como sacramental no catálogo.`
      : `“${matchingTitle.title}” (hino ${matchingTitle.number}) não está marcado como sacramental no catálogo.`;
  }

  if (matchingTitle) {
    return `No catálogo local, “${matchingTitle.title}” é o hino ${matchingTitle.number}.`;
  }

  const numberMatch = /\bnumero\s+(?:do\s+)?hino\s+(\d{1,4})\b|\bhino\s+(?:numero\s+)?(\d{1,4})\b/.exec(normalizedQuestion);
  const contextualNumber = /\bhino\b.*\b(\d{1,4})\b/.exec(normalizedQuestion);
  const matchedNumber = numberMatch?.[1] || numberMatch?.[2] || contextualNumber?.[1];
  if (matchedNumber) {
    const number = Number(matchedNumber);
    const hymn = catalog.find((entry) => entry.number === number);

    if (hymn && asksAboutSacramentalHymns) {
      return hymn.categories?.includes("sacramental")
        ? `Sim. “${hymn.title}” (hino ${number}) está marcado como sacramental no catálogo.`
        : `“${hymn.title}” (hino ${number}) não está marcado como sacramental no catálogo.`;
    }

    return hymn
      ? `No catálogo local, o hino ${number} é “${hymn.title}”.`
      : `Não encontrei o número ${number} no catálogo local de hinos.`;
  }

  if (asksAboutSacramentalHymns) {
    const sacramentalHymns = catalog
      .filter((hymn) => hymn.categories?.includes("sacramental"))
      .sort((a, b) => a.number - b.number);

    return sacramentalHymns.length
      ? `Hinos marcados como sacramentais no catálogo:\n${sacramentalHymns.map((hymn) => `${hymn.number} — ${hymn.title}`).join("\n")}`
      : "Ainda não há hinos marcados como sacramentais no catálogo.";
  }

  const asksSpecificHymn = /\b(?:numero|nome|qual|procure|buscar|encontrar)\b/.test(normalizedQuestion);
  if (/\bhinos?\b/.test(normalizedQuestion) && asksSpecificHymn) {
    return "Não localizei esse título no catálogo local de hinos.";
  }

  return null;
}

function findMatchingTopic(normalizedQuestion) {
  let bestTopic = null;
  let bestScore = 0;

  for (const topic of responseTopics) {
    for (const phrase of topic.phrases) {
      const score = scorePhraseMatch(normalizedQuestion, phrase);
      if (score > bestScore) {
        bestTopic = topic;
        bestScore = score;
      }
    }
  }

  return bestTopic;
}

function handleNavigationRequest(normalizedQuestion) {
  const wantsForm = [
    "abrir formulario",
    "ir para formulario",
    "abrir cadastro",
    "ir para cadastro",
    "tela de cadastro",
    "quero preencher manualmente"
  ].some((phrase) => normalizedQuestion.includes(phrase));

  if (wantsForm) {
    document.querySelector('[data-screen="agenda"]').click();
    document.querySelector("#create-agenda-button").click();
    return "Abri a tela “Criar agenda”. Você pode preencher os campos manualmente ou usar o botão com o ícone de folha e “+” no cabeçalho do chat para receber orientação.";
  }

  const wantsAgenda = [
    "abrir agenda",
    "ver agenda",
    "mostrar agenda",
    "ir para agenda",
    "voltar para agenda"
  ].some((phrase) => normalizedQuestion.includes(phrase));

  if (wantsAgenda) {
    document.querySelector('[data-screen="agenda"]').click();
    return "Abri a tela da agenda. Se ainda não houver uma prévia, escolha “Criar agenda” ou peça para eu montar com você.";
  }

  return null;
}

function isConversationControl(question) {
  const normalized = normalizeQuestion(question);
  return /^(repetir|repete|repita|nao entendi|pode repetir|repetir pergunta|ajuda|help|o que eu respondo|o que devo responder|como respondo|posso pular|obrigado|obrigada|muito obrigado|muito obrigada|valeu|agradeco|oi|ola|bom dia|boa tarde|boa noite|tudo bem|tchau|ate mais|cancelar)$/.test(normalized);
}

function handleGuidedConversation(question) {
  const normalized = normalizeQuestion(question);

  if (["repetir", "repete", "repita", "nao entendi", "pode repetir", "repetir pergunta"].includes(normalized)) {
    askGuidedStep();
    return true;
  }

  if (["ajuda", "help", "o que eu respondo", "o que devo responder", "como respondo", "posso pular"].includes(normalized)) {
    if (guidedInterview.phase === "confirm-reset") {
      appendMessage("Responda “sim” para começar uma nova agenda ou “não” para manter os dados atuais.", "assistant");
    } else {
      appendMessage("Responda à pergunta atual, digite “pular” para deixar o campo em branco ou “cancelar” para encerrar a entrevista.", "assistant");
      askGuidedStep();
    }
    return true;
  }

  if (/^(obrigado|obrigada|muito obrigado|muito obrigada|valeu|agradeco)$/.test(normalized)) {
    appendMessage("Por nada! Vamos continuar.", "assistant");
    askGuidedStep();
    return true;
  }

  if (/^(oi|ola|bom dia|boa tarde|boa noite|tudo bem)$/.test(normalized)) {
    appendMessage("Olá! Estou aqui para ajudar. Vamos continuar o preenchimento.", "assistant");
    askGuidedStep();
    return true;
  }

  const matchingTopic = findMatchingTopic(normalized);
  if (matchingTopic) {
    appendMessage(matchingTopic.answer, "assistant");
    askGuidedStep();
    return true;
  }

  return false;
}

function appendMessage(message, role) {
  const paragraph = document.createElement("p");
  paragraph.className = `secretario-message secretario-message-${role}`;
  const manualUrlPattern = /https:\/\/www\.churchofjesuschrist\.org\/study\/manual\/general-handbook\?lang=por/g;
  let lastIndex = 0;

  for (const match of message.matchAll(manualUrlPattern)) {
    paragraph.append(document.createTextNode(message.slice(lastIndex, match.index)));

    const link = document.createElement("a");
    link.href = match[0];
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Abrir Manual Geral oficial";
    paragraph.append(link);
    lastIndex = match.index + match[0].length;
  }

  paragraph.append(document.createTextNode(message.slice(lastIndex)));
  assistantMessages.append(paragraph);
  assistantMessages.scrollTop = assistantMessages.scrollHeight;
}

function setQuickReplies(options = []) {
  assistantQuickReplies.replaceChildren();

  for (const option of options) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = option.label;
    button.dataset.answer = option.answer;
    assistantQuickReplies.append(button);
  }

  assistantQuickReplies.hidden = options.length === 0;
}

function writeFormValue(id, value) {
  const field = document.getElementById(id);

  if (!(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement)) {
    throw new Error(`Campo da agenda não encontrado: ${id}`);
  }

  field.value = value;
  field.dispatchEvent(new Event("input", { bubbles: true }));
}

function isSkipAnswer(answer) {
  return ["pular", "pule", "passar", "deixar em branco"].includes(normalizeQuestion(answer));
}

function parseYesNo(answer) {
  const normalized = normalizeQuestion(answer);

  if (["sim", "s", "quero", "pode", "vamos"].includes(normalized)) {
    return true;
  }

  if (["nao", "n", "nao quero", "nenhum", "nenhuma", "nao ha", "pular"].includes(normalized)) {
    return false;
  }

  return null;
}

function parseMeetingDate(answer) {
  const value = answer.trim();
  const isoDate = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  const localDate = /^(\d{1,2})[/. -](\d{1,2})[/. -](\d{4})$/.exec(value);
  const parts = isoDate
    ? { year: Number(isoDate[1]), month: Number(isoDate[2]), day: Number(isoDate[3]) }
    : localDate
      ? { year: Number(localDate[3]), month: Number(localDate[2]), day: Number(localDate[1]) }
      : null;

  if (!parts) {
    return null;
  }

  const date = new Date(Date.UTC(parts.year, parts.month - 1, parts.day));
  if (
    date.getUTCFullYear() !== parts.year
    || date.getUTCMonth() !== parts.month - 1
    || date.getUTCDate() !== parts.day
  ) {
    return null;
  }

  return `${parts.year}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}`;
}

function askGuidedStep() {
  if (!guidedInterview) {
    return;
  }

  if (guidedInterview.phase === "confirm-reset") {
    setQuickReplies([
      { label: "Sim", answer: "sim" },
      { label: "Não", answer: "não" }
    ]);
    appendMessage("Deseja começar uma nova agenda? Responda “sim” ou “não”.", "assistant");
    return;
  }

  if (guidedInterview.activeList) {
    const list = guidedInterview.activeList;

    if (list.phase === "next") {
      setQuickReplies([
        { label: "Sim, adicionar", answer: "sim" },
        { label: "Não, continuar", answer: "não" }
      ]);
      appendMessage(`Deseja adicionar mais ${list.step.plural}? Responda “sim” ou “não”.`, "assistant");
      return;
    }

    const field = list.step.fields[list.fieldIndex];
    const listOptions = [{ label: "Pular", answer: "pular" }];
    if (list.fieldIndex === 0) {
      listOptions.push({ label: "Encerrar lista", answer: "fim" });
    }
    setQuickReplies(listOptions);
    const firstFieldHelp = list.fieldIndex === 0
      ? " Digite “fim” para encerrar esta lista ou “pular” para deixar esta linha vazia."
      : " Você pode digitar “pular” para deixar em branco.";
    appendMessage(
      `Informe ${field.label} para ${list.step.title} ${list.index}.${firstFieldHelp}`,
      "assistant"
    );
    return;
  }

  const step = guidedSteps[guidedInterview.stepIndex];

  if (!step) {
    guidedInterview = null;
    setQuickReplies();
    appendMessage("Pronto! Preenchi a agenda. Vou abrir a prévia para você conferir; se precisar, escolha “Criar agenda” para fazer ajustes.", "assistant");
    document.querySelector("#agenda-form").requestSubmit();
    return;
  }

  if (step.type === "list") {
    setQuickReplies([
      { label: "Sim", answer: "sim" },
      { label: "Não", answer: "não" }
    ]);
    appendMessage(`Deseja cadastrar ${step.plural}? Responda “sim” ou “não”.`, "assistant");
    return;
  }

  setQuickReplies([{ label: "Pular", answer: "pular" }]);
  const optionalHint = step.optional ? " Você pode digitar “pular” para deixar em branco." : " Se não souber, pode digitar “pular”.";
  appendMessage(`${step.prompt}${optionalHint}`, "assistant");
}

function finishActiveList() {
  guidedInterview.activeList = null;
  guidedInterview.stepIndex += 1;
  askGuidedStep();
}

function answerActiveList(answer) {
  const list = guidedInterview.activeList;
  const normalized = normalizeQuestion(answer);

  if (list.phase === "next") {
    const addAnother = parseYesNo(answer);

    if (addAnother === null) {
      appendMessage(`Responda “sim” para adicionar mais ${list.step.plural} ou “não” para continuar.`, "assistant");
      return;
    }

    if (!addAnother) {
      finishActiveList();
      return;
    }

    if (list.index === list.step.max) {
      appendMessage(`A lista permite até ${list.step.max} itens. Vou continuar para a próxima etapa.`, "assistant");
      finishActiveList();
      return;
    }

    list.index += 1;
    list.fieldIndex = 0;
    list.values = {};
    list.phase = "field";
    askGuidedStep();
    return;
  }

  if (list.fieldIndex === 0 && normalized === "fim") {
    finishActiveList();
    return;
  }

  if (list.fieldIndex === 0 && isSkipAnswer(answer)) {
    if (list.index === list.step.max) {
      finishActiveList();
      return;
    }

    list.index += 1;
    askGuidedStep();
    return;
  }

  const field = list.step.fields[list.fieldIndex];
  list.values[field.key] = isSkipAnswer(answer) ? "" : answer.trim();
  list.fieldIndex += 1;

  if (list.fieldIndex < list.step.fields.length) {
    askGuidedStep();
    return;
  }

  for (const listField of list.step.fields) {
    writeFormValue(`${list.step.prefix}-${listField.key}-${list.index}`, list.values[listField.key]);
  }
  list.phase = "next";
  askGuidedStep();
}

function answerGuidedQuestion(answer) {
  const normalized = normalizeQuestion(answer);

  if (handleGuidedConversation(answer)) {
    return;
  }

  if (normalized === "cancelar") {
    guidedInterview = null;
    setQuickReplies();
    appendMessage("Entrevista cancelada. As respostas já informadas continuam no formulário desta página.", "assistant");
    return;
  }

  if (guidedInterview.phase === "confirm-reset") {
    const shouldStart = parseYesNo(answer);

    if (shouldStart === null) {
      appendMessage("Responda “sim” para começar uma nova agenda ou “não” para manter os dados atuais.", "assistant");
      return;
    }

    if (!shouldStart) {
      guidedInterview = null;
      setQuickReplies();
      appendMessage("Tudo bem. Mantive os dados atuais sem alterações.", "assistant");
      return;
    }

    document.querySelector('[data-screen="agenda"]').click();
    document.querySelector("#create-agenda-button").click();
    document.querySelector("#agenda-form").reset();
    guidedInterview = { stepIndex: 0 };
    appendMessage("Vamos preencher a agenda. Você pode responder “pular” em qualquer pergunta ou “cancelar” para parar; nada será enviado para fora deste navegador.", "assistant");
    askGuidedStep();
    return;
  }

  if (guidedInterview.activeList) {
    answerActiveList(answer);
    return;
  }

  const step = guidedSteps[guidedInterview.stepIndex];
  if (step.type === "list") {
    const includeList = parseYesNo(answer);

    if (includeList === null) {
      appendMessage(`Responda “sim” ou “não” para cadastrar ${step.plural}.`, "assistant");
      return;
    }

    if (!includeList) {
      guidedInterview.stepIndex += 1;
      askGuidedStep();
      return;
    }

    guidedInterview.activeList = {
      step,
      index: 1,
      fieldIndex: 0,
      phase: "field",
      values: {}
    };
    askGuidedStep();
    return;
  }

  if (isSkipAnswer(answer)) {
    writeFormValue(step.id, "");
  } else if (step.date) {
    const date = parseMeetingDate(answer);

    if (!date) {
      appendMessage("Não consegui reconhecer essa data. Informe no formato DD/MM/AAAA ou digite “pular”.", "assistant");
      return;
    }

    writeFormValue(step.id, date);
  } else {
    writeFormValue(step.id, answer.trim());
  }

  guidedInterview.stepIndex += 1;
  askGuidedStep();
}

function startGuidedInterview() {
  guidedInterview = { phase: "confirm-reset" };
  setQuickReplies([
    { label: "Sim", answer: "sim" },
    { label: "Não", answer: "não" }
  ]);
  appendMessage("Vou iniciar uma nova agenda e limpar os valores atuais do formulário, inclusive os exemplos. Deseja começar? Responda “sim” ou “não”.", "assistant");
}

function isGuidedStartIntent(question) {
  const normalized = normalizeQuestion(question);
  return normalized.includes("montar agenda")
    || normalized.includes("montar a agenda")
    || normalized.includes("preencher agenda")
    || normalized.includes("preencher a agenda")
    || normalized.includes("criar agenda comigo")
    || normalized.includes("criar a agenda comigo");
}

function sendQuestion(question) {
  const trimmedQuestion = question.trim();

  if (!trimmedQuestion) {
    return;
  }

  appendMessage(trimmedQuestion, "user");
  assistantSuggestions.hidden = true;
  assistantInput.value = "";

  if (guidedInterview) {
    if (isGuidedStartIntent(trimmedQuestion)) {
      appendMessage("A entrevista já está em andamento. Responda à pergunta atual ou digite “cancelar” para parar.", "assistant");
    } else if (isConversationControl(trimmedQuestion) || findMatchingTopic(normalizeQuestion(trimmedQuestion))) {
      if (!handleGuidedConversation(trimmedQuestion)) {
        answerGuidedQuestion(trimmedQuestion);
      }
    } else {
      answerGuidedQuestion(trimmedQuestion);
    }
  } else if (isGuidedStartIntent(trimmedQuestion)) {
    startGuidedInterview();
  } else {
    const normalizedQuestion = normalizeQuestion(trimmedQuestion);
    const navigationResult = handleNavigationRequest(normalizedQuestion);
    const localAnswer = navigationResult || getLocalAnswer(trimmedQuestion);
    appendMessage(localAnswer, "assistant");
  }

  if (guidedInterview) {
    assistantInput.focus();
  }
}

assistantToggle.addEventListener("click", () => {
  assistantPanel.hidden = !assistantPanel.hidden;
  assistantToggle.setAttribute("aria-expanded", String(!assistantPanel.hidden));

  if (!assistantPanel.hidden) {
    assistantInput.focus();
  }
});

assistantClose.addEventListener("click", () => {
  assistantPanel.hidden = true;
  assistantToggle.setAttribute("aria-expanded", "false");
  assistantToggle.focus();
});

assistantForm.addEventListener("submit", (event) => {
  event.preventDefault();
  sendQuestion(assistantInput.value);
});

assistantSuggestions.addEventListener("click", (event) => {
  if (event.target instanceof HTMLButtonElement) {
    sendQuestion(event.target.textContent);
  }
});

assistantQuickReplies.addEventListener("click", (event) => {
  if (event.target instanceof HTMLButtonElement) {
    sendQuestion(event.target.dataset.answer || event.target.textContent);
  }
});

assistantStartGuided.addEventListener("click", () => {
  appendMessage("Montar uma nova agenda", "user");
  assistantSuggestions.hidden = true;
  startGuidedInterview();
  assistantInput.focus();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !assistantPanel.hidden) {
    assistantPanel.hidden = true;
    assistantToggle.setAttribute("aria-expanded", "false");
    assistantToggle.focus();
  }
});
