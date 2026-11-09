const assistantToggle = document.querySelector("#assistant-toggle");
const assistantPanel = document.querySelector("#assistant-panel");
const assistantClose = document.querySelector("#assistant-close");
const assistantMessages = document.querySelector("#assistant-messages");
const assistantForm = document.querySelector("#assistant-form");
const assistantInput = document.querySelector("#assistant-input");
const assistantSuggestions = document.querySelector("#assistant-suggestions");
const officialManualUrl = "https://www.churchofjesuschrist.org/study/manual/general-handbook?lang=por";

const fallbackExamples = [];
const lastFriendlyReplyIndexes = new Map();
const fallbackReply = "Ainda não tenho uma resposta preparada para isso. Você pode reformular ou explicar um pouco o que quis dizer? Também posso ajudar com a agenda, hinos ou busca no índice do Manual Geral.";

const friendlyIntents = [
  {
    name: "greeting",
    phrases: ["oi", "ola", "oi tudo bem", "ola tudo bem", "e ai", "eae", "eai", "oie", "opa", "salve", "fala", "fala ai", "bom dia", "boa tarde", "boa noite", "saudacoes"],
    replies: [
      "Olá! Como posso ajudar? Posso orientar sobre a agenda, hinos ou buscar um assunto no índice do Manual Geral.",
      "Opa! O que você precisa? Posso ajudar com a agenda, hinos ou a busca no índice do Manual Geral."
    ]
  },
  {
    name: "check-in",
    phrases: ["tudo bem", "como vai", "como voce esta", "como voce vai", "como voce esta hoje", "como voce tem passado", "tudo certo por ai", "suave", "suave por ai", "tranquilo", "tranquila", "beleza"],
    replies: ["Tudo bem, obrigado! Como posso ajudar?", "Tudo certo. O que você precisa?"]
  },
  {
    name: "thanks",
    phrases: ["obrigado", "obrigada", "muito obrigado", "muito obrigada", "obrigado pela ajuda", "obrigada pela ajuda", "obrigado por ajudar", "obrigada por ajudar", "obrigado tambem", "obrigada tambem", "valeu", "valeu pela ajuda", "valeu pela forca", "valeu mesmo", "valeu cara", "valeu mano", "valeu tambem", "brigadao", "agradeco", "agradeco muito", "agradeco pela ajuda", "agradecido", "agradecida", "sou grato", "sou grata", "grato", "grata", "gratidao", "salvou", "quebrou um galho"],
    replies: ["Por nada!", "Imagina!", "Que bom que foi útil."]
  },
  {
    name: "together",
    phrases: ["e nois", "tamo junto"],
    replies: ["É isso! Estou por aqui se precisar.", "Tamo junto! Se precisar, é só chamar."]
  },
  {
    name: "farewell",
    phrases: ["tchau", "tchau ate mais", "ate", "ate mais", "ate logo", "ate a proxima", "ate amanha", "falou", "falou entao", "fui", "a gente se fala", "tenha um bom dia", "tenha uma boa tarde", "tenha uma boa noite", "bom descanso"],
    replies: ["Até mais!", "Combinado, até!", "Até a próxima!"]
  },
  {
    name: "apology",
    phrases: ["desculpa", "desculpe", "foi mal", "mals ai", "perdao"],
    replies: ["Sem problema.", "Tranquilo!"]
  },
  {
    name: "help",
    phrases: ["ajuda", "help", "o que voce sabe", "o que posso perguntar", "como pode me ajudar", "voce pode me ajudar", "o que posso fazer", "que pode fazer por mim", "quais suas funcoes", "quais sao suas funcoes", "o que voce faz"],
    replies: [
      "Posso orientar você no preenchimento, edição e impressão da agenda, ajudar com hinos ou procurar palavras-chave no índice do Manual Geral. O que você gostaria de saber?",
      "Posso ajudar com a agenda sacramental, hinos e busca de assuntos no índice do Manual Geral. Por onde quer começar?"
    ]
  },
  {
    name: "confirmation",
    phrases: ["sim", "isso", "exatamente", "correto", "certo", "entendi", "compreendi", "ok", "okay", "ok beleza", "beleza entao", "pode ser", "fechado", "fechou", "demorou", "combinado", "continua", "continuar", "prossegue", "prossiga", "segue"],
    replies: ["Combinado. Vamos em frente.", "Certo. Como posso ajudar agora?"]
  },
  {
    name: "negative",
    phrases: ["nao", "negativo", "agora nao", "nao obrigado", "nao obrigada", "deixa pra la", "deixa para la"],
    replies: ["Tudo bem, sem problema.", "Certo. Se precisar depois, estarei por aqui."]
  },
  {
    name: "positive-reaction",
    phrases: ["legal", "bacana", "show", "massa", "da hora", "top", "otimo", "otima", "maravilha", "que bom", "muito bom", "excelente", "gostei", "bom trabalho", "otimo trabalho", "obrigado gostei", "adorei"],
    replies: ["Boa! Que bom que foi útil.", "Legal. Posso ajudar com mais alguma coisa?"]
  },
  {
    name: "laughter",
    phrases: ["risos", "haha", "hahaha", "kkk", "kkkk", "rs", "rsrs"],
    replies: ["😊 O que mais posso fazer por você?", "😊 Se precisar de algo, é só falar."]
  },
  {
    name: "confusion",
    phrases: ["nao entendi", "nao compreendi", "nao saquei"],
    replies: ["Sem problema. Quer que eu explique de outro jeito?", "Entendi. Diga qual parte ficou confusa e tento esclarecer."]
  }
];

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
    answer: "Abra “Agenda Sacramental” e escolha “Criar agenda” para preencher o formulário. Depois, use “Revisar agenda” para conferir a prévia."
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
    answer: "O rascunho da agenda é salvo automaticamente apenas neste navegador e pode ser apagado com “Limpar campos”. As perguntas feitas ao chat são processadas localmente e não são enviadas a serviços externos."
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
    answer: "Não tenho time nem preferências pessoais; sou um assistente virtual. Posso ajudar com a agenda, hinos ou busca de assuntos no índice."
  },
  {
    phrases: ["quantos anos voce tem", "qual sua idade", "sua idade"],
    answer: "Não tenho idade; sou um assistente virtual, não uma pessoa. Posso ajudar com a agenda, hinos ou busca de assuntos no índice."
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

function canonicalizeConversationalVariants(normalized) {
  const aliases = new Map([
    ["vc", "voce"],
    ["vcs", "voces"],
    ["vlw", "valeu"],
    ["flw", "falou"],
    ["obg", "obrigado"],
    ["obgd", "obrigado"],
    ["brigado", "obrigado"],
    ["blz", "beleza"],
    ["tbm", "tambem"],
    ["tb", "tambem"],
    ["td", "tudo"]
  ]);
  return normalized.split(" ").map((word) => aliases.get(word) || word).join(" ");
}

function editDistanceAtMostOne(first, second) {
  if (Math.abs(first.length - second.length) > 1) {
    return false;
  }

  let firstIndex = 0;
  let secondIndex = 0;
  let differences = 0;

  while (firstIndex < first.length && secondIndex < second.length) {
    if (first[firstIndex] === second[secondIndex]) {
      firstIndex += 1;
      secondIndex += 1;
      continue;
    }

    differences += 1;
    if (differences > 1) {
      return false;
    }

    if (first.length > second.length) {
      firstIndex += 1;
    } else if (second.length > first.length) {
      secondIndex += 1;
    } else {
      firstIndex += 1;
      secondIndex += 1;
    }
  }

  return differences + Number(firstIndex < first.length || secondIndex < second.length) <= 1;
}

function matchFriendlyIntent(normalizedQuestion) {
  const normalized = canonicalizeConversationalVariants(normalizedQuestion);
  const questionWords = normalized.split(" ");
  const matches = [];

  for (const intent of friendlyIntents) {
    for (const phrase of intent.phrases) {
      const phraseWords = phrase.split(" ");
      if (questionWords.length !== phraseWords.length) {
        continue;
      }

      let differences = 0;
      let exactWords = 0;
      let withinThreshold = true;
      for (let index = 0; index < phraseWords.length; index += 1) {
        if (questionWords[index] === phraseWords[index]) {
          exactWords += 1;
        } else if (
          questionWords[index].length >= 4
          && phraseWords[index].length >= 4
          && editDistanceAtMostOne(questionWords[index], phraseWords[index])
        ) {
          differences += 1;
        } else {
          withinThreshold = false;
          break;
        }
      }

      if (withinThreshold && differences <= 1) {
        matches.push({ intent, differences, exactWords });
      }
    }
  }

  matches.sort((first, second) => first.differences - second.differences || second.exactWords - first.exactWords);
  const best = matches[0];
  if (!best) {
    return null;
  }

  const competingIntents = matches.filter((match) =>
    match.differences === best.differences
    && match.exactWords === best.exactWords
    && match.intent.name !== best.intent.name
  );
  return competingIntents.length === 0 ? best.intent : null;
}

function chooseFriendlyReply(intent) {
  const previousIndex = lastFriendlyReplyIndexes.get(intent.name);
  const nextIndex = previousIndex === undefined ? 0 : (previousIndex + 1) % intent.replies.length;
  lastFriendlyReplyIndexes.set(intent.name, nextIndex);
  return intent.replies[nextIndex];
}

function splitFriendlyPrefix(question) {
  const normalized = canonicalizeConversationalVariants(normalizeQuestion(question));
  const connectors = new Set(["agora", "entao", "mas", "e", "tambem", "me", "pode", "podemos", "queria", "quero", "preciso", "como", "voce", "por"]);
  const candidates = [];

  for (const intent of friendlyIntents) {
    if (!["greeting", "thanks", "together", "positive-reaction", "apology"].includes(intent.name)) {
      continue;
    }

    for (const phrase of intent.phrases) {
      const prefix = canonicalizeConversationalVariants(phrase);
      if (!normalized.startsWith(`${prefix} `)) {
        continue;
      }

      const remainingQuestion = normalized.slice(prefix.length).trim();
      if (connectors.has(remainingQuestion.split(" ")[0])) {
        candidates.push({ intent, prefixLength: prefix.length, remainingQuestion });
      }
    }
  }

  candidates.sort((first, second) => second.prefixLength - first.prefixLength);
  const best = candidates[0];
  if (!best || (candidates[1] && candidates[1].prefixLength === best.prefixLength && candidates[1].intent.name !== best.intent.name)) {
    return null;
  }

  return best;
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

function getFriendlyInteractionReply(normalizedQuestion) {
  const intent = matchFriendlyIntent(normalizedQuestion);
  return intent ? chooseFriendlyReply(intent) : null;
}

function getLocalAnswer(question, originalQuestion = question) {
  const normalizedQuestion = canonicalizeConversationalVariants(normalizeQuestion(question));
  const friendlyReply = getFriendlyInteractionReply(normalizedQuestion);

  if (friendlyReply) {
    return friendlyReply;
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

  if (/\b(resuma|resume|resumir|resumo)\b/.test(normalizedQuestion)) {
    return "Tenho resumos locais preparados sobre alguns assuntos do Manual Geral e posso localizar referências pelo tema ou número do item. Não consigo criar automaticamente um resumo de texto livre; se você indicar o assunto, procuro o conteúdo disponível na base local.";
  }

  fallbackExamples.push({ message: originalQuestion, intent: "sem correspondência" });
  if (fallbackExamples.length > 20) {
    fallbackExamples.shift();
  }
  return fallbackReply;
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
      let exactMatches = 0;
      const matches = queryTerms.map((term) => titleTerms.some((titleTerm) => {
        const normalizedTerm = normalizeManualIndexTerm(term);
        const normalizedTitleTerm = normalizeManualIndexTerm(titleTerm);
        const exact = titleTerm === term
          || (normalizedTerm.length >= 4 && normalizedTerm === normalizedTitleTerm);
        if (exact) {
          exactMatches += 1;
          return true;
        }

        return (term.length >= 4 && titleTerm.startsWith(term))
          || (titleTerm.length >= 4 && term.startsWith(titleTerm))
          || (normalizedTerm.length >= 5
            && normalizedTitleTerm.length >= 5
            && editDistanceAtMostOne(normalizedTerm, normalizedTitleTerm));
      }));
      const matchedTerms = matches.filter(Boolean).length;

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
      || a.section.length - b.section.length
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

function normalizeManualIndexTerm(term) {
  const suffixes = ["acoes", "acao", "imentos", "imento", "amentos", "amento", "idades", "idade", "adores", "adoras", "ador", "adora", "icoes", "icao", "ados", "adas", "idos", "idas", "ando", "endo", "indo", "ado", "ada", "ido", "ida", "ar", "er", "ir"];
  const suffix = suffixes.find((candidate) => term.length - candidate.length >= 4 && term.endsWith(candidate));
  const stem = suffix ? term.slice(0, -suffix.length) : term;
  return stem.endsWith("s") && stem.length > 4 ? stem.slice(0, -1) : stem;
}

function getManualIndexSuggestions(normalizedQuestion) {
  const manualIndex = window.SECRETARIO_MANUAL_INDEX;
  if (!Array.isArray(manualIndex)) {
    return [];
  }

  const terms = normalizedQuestion.split(" ").filter((term) => term.length >= 4);
  if (terms.length === 0 || findManualIndexMatch(normalizedQuestion, manualIndex, normalizedQuestion)) {
    return [];
  }

  return findManualIndexMatches(normalizedQuestion, manualIndex, 4)
    .filter((entry) => entry.score >= 2 && entry.coverage >= 0.5 && entry.matchedTerms >= Math.min(2, terms.length));
}

function displayManualIndexSuggestions(entries) {
  assistantSuggestions.replaceChildren();
  assistantSuggestions.setAttribute("aria-label", "Sugestões aproximadas de itens do Manual Geral");

  for (const entry of entries) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = `${entry.section} — ${entry.title} (p. ${entry.page})`;
    button.dataset.question = entry.section;
    assistantSuggestions.append(button);
  }

  assistantSuggestions.hidden = entries.length === 0;
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
    return "Abri a tela “Criar agenda”. Preencha os campos do formulário e selecione “Revisar agenda” para conferir a prévia.";
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
    return "Abri a tela da agenda. Se ainda não houver uma prévia, escolha “Criar agenda” para preencher o formulário.";
  }

  return null;
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

function sendQuestion(question) {
  const trimmedQuestion = question.trim();

  if (!trimmedQuestion) {
    return;
  }

  appendMessage(trimmedQuestion, "user");
  assistantSuggestions.hidden = true;
  assistantInput.value = "";

  const normalizedOriginal = canonicalizeConversationalVariants(normalizeQuestion(trimmedQuestion));
  if (normalizedOriginal === "ver falhas" || normalizedOriginal === "ver mensagens sem resposta") {
    const report = fallbackExamples.length
      ? fallbackExamples.map((example, index) => `${index + 1}. ${example.message} (${example.intent})`).join("\n")
      : "Ainda não há mensagens sem resposta nesta sessão.";
    appendMessage(report, "assistant");
    return;
  }

  if (normalizedOriginal === "limpar falhas" || normalizedOriginal === "limpar mensagens sem resposta") {
    fallbackExamples.length = 0;
    appendMessage("Pronto. As mensagens sem resposta desta sessão foram apagadas.", "assistant");
    return;
  }

  const friendlyPrefix = splitFriendlyPrefix(trimmedQuestion);
  const questionToHandle = friendlyPrefix?.remainingQuestion || trimmedQuestion;
  if (friendlyPrefix) {
    appendMessage(chooseFriendlyReply(friendlyPrefix.intent), "assistant");
  }

  const normalizedQuestion = canonicalizeConversationalVariants(normalizeQuestion(questionToHandle));
  const navigationResult = handleNavigationRequest(normalizedQuestion);
  const localAnswer = navigationResult || getLocalAnswer(questionToHandle, trimmedQuestion);
  appendMessage(localAnswer, "assistant");
  displayManualIndexSuggestions(navigationResult ? [] : getManualIndexSuggestions(normalizedQuestion));
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
    sendQuestion(event.target.dataset.question || event.target.textContent);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !assistantPanel.hidden) {
    assistantPanel.hidden = true;
    assistantToggle.setAttribute("aria-expanded", "false");
    assistantToggle.focus();
  }
});
