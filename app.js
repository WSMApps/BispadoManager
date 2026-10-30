const config = window.BISPADO_SUPABASE_CONFIG || {};
const status = document.querySelector("#app-status");
const form = document.querySelector("#agenda-form");
const createScreen = document.querySelector("#create-screen");
const agendaScreen = document.querySelector("#agenda-screen");
const preview = document.querySelector("#agenda-preview");
const placeholder = document.querySelector("#agenda-placeholder");
const previewContent = document.querySelector("#preview-content");
const previewContinuation = document.querySelector("#preview-continuation");
const agendaFirstPage = document.querySelector("#agenda-first-page");
const demoNotice = document.querySelector("#demo-notice");

const supabaseUrl = typeof config.url === "string" ? config.url.trim() : "";
const supabaseAnonKey = typeof config.anonKey === "string" ? config.anonKey.trim() : "";

if (!supabaseUrl || !supabaseAnonKey) {
  status.textContent = "Agenda disponível neste navegador. Supabase não configurado.";
} else if (typeof window.supabase?.createClient !== "function") {
  status.textContent = "Agenda disponível, mas não foi possível carregar a biblioteca do Supabase.";
} else {
  window.bispadoSupabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey);
  status.textContent = "Agenda disponível neste navegador. Cliente Supabase inicializado.";
}

function fieldValue(id) {
  return document.querySelector(`#${id}`).value.trim();
}

function showScreen(screen) {
  const showAgenda = screen === "agenda";
  agendaScreen.hidden = !showAgenda;
  createScreen.hidden = showAgenda;
  (showAgenda ? agendaScreen : createScreen).querySelector("h1").focus();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function addEntry(container, label, value, theme) {
  const entry = document.createElement("div");
  entry.className = "agenda-entry";

  const entryLabel = document.createElement("span");
  entryLabel.className = "agenda-entry-label";
  entryLabel.textContent = `${label}:`;

  const entryValue = document.createElement("p");
  entryValue.className = "agenda-entry-value";
  entryValue.textContent = value || "A definir";

  entry.append(entryLabel, entryValue);

  if (theme !== undefined) {
    const entryTheme = document.createElement("p");
    entryTheme.className = "agenda-entry-theme";
    entryTheme.textContent = `Tema: ${theme || "A definir"}`;
    entry.append(entryTheme);
  }

  container.append(entry);
}

function addEntryRow(container, entries, rowClass = "") {
  const row = document.createElement("div");
  row.className = entries.length === 3
    ? "agenda-entry-row agenda-entry-row-three"
    : "agenda-entry-row";
  if (rowClass) {
    row.classList.add(rowClass);
  }

  for (const entry of entries) {
    addEntry(row, entry.label, entry.value);
  }

  container.append(row);
}

function addGroup(container, title, entries) {
  const group = document.createElement("section");
  group.className = "agenda-group";

  const heading = document.createElement("h3");
  heading.textContent = title;
  group.append(heading);

  for (const entry of entries) {
    addEntry(group, entry.label, entry.value, entry.theme);
  }

  container.append(group);
}

function addDetailsCard(container, title, entries) {
  const card = document.createElement("section");
  card.className = "agenda-message-block agenda-details-card";

  const heading = document.createElement("h3");
  heading.textContent = title;
  card.append(heading);

  for (const entry of entries) {
    addEntry(card, entry.label, entry.value);
  }

  container.append(card);
}

function addMessageBlock(container, title, message, blockClass = "") {
  const block = document.createElement("section");
  block.className = "agenda-message-block";
  if (blockClass) {
    block.classList.add(blockClass);
  }

  const heading = document.createElement("h3");
  heading.textContent = title;

  block.append(heading);
  if (message) {
    const paragraph = document.createElement("p");
    paragraph.textContent = message;
    block.append(paragraph);
  }
  container.append(block);
}

function addAnnouncementsBlock(container, announcements) {
  const block = document.createElement("section");
  block.className = "agenda-message-block agenda-announcements-block";

  const heading = document.createElement("h3");
  heading.textContent = "Anúncios";
  block.append(heading);

  if (announcements) {
    const paragraph = document.createElement("p");
    paragraph.textContent = announcements;
    block.append(paragraph);
  } else {
    const writingLines = document.createElement("div");
    writingLines.className = "agenda-writing-lines";
    writingLines.setAttribute("aria-label", "Espaço para escrever anúncios à mão");

    for (let line = 0; line < 3; line += 1) {
      writingLines.append(document.createElement("span"));
    }

    block.append(writingLines);
  }

  container.append(block);
}

function createHymnRow(label, hymnName, hymnNumber) {
  const hymnRow = document.createElement("div");
  hymnRow.className = "agenda-entry agenda-hymn-row";

  const hymnLabel = document.createElement("span");
  hymnLabel.className = "agenda-entry-label";
  hymnLabel.textContent = `${label}:`;

  const hymnTitle = document.createElement("p");
  hymnTitle.className = "agenda-entry-value";
  hymnTitle.textContent = hymnName || "A definir";

  const hymnNumberValue = document.createElement("span");
  hymnNumberValue.className = "agenda-hymn-number";
  hymnNumberValue.textContent = hymnNumber ? `nº ${hymnNumber}` : "";

  hymnRow.append(hymnLabel, hymnTitle, hymnNumberValue);
  return hymnRow;
}

function addOpeningBlock(container, hymnName, hymnNumber, prayer, continuationLabel) {
  const block = document.createElement("section");
  block.className = "agenda-message-block agenda-opening-block";

  const heading = document.createElement("h3");
  heading.textContent = "Abertura";
  block.append(heading, createHymnRow("Primeiro hino", hymnName, hymnNumber));
  const prayerRow = document.createElement("div");
  prayerRow.className = "agenda-entry agenda-prayer-row";

  const prayerLabel = document.createElement("span");
  prayerLabel.className = "agenda-entry-label";
  prayerLabel.textContent = "Primeira oração:";

  const prayerValue = document.createElement("p");
  prayerValue.className = "agenda-entry-value";
  prayerValue.textContent = prayer || "A definir";
  prayerRow.append(prayerLabel, prayerValue);

  const pageTurn = document.createElement("span");
  pageTurn.className = "agenda-page-turn";
  pageTurn.textContent = continuationLabel;
  prayerRow.append(pageTurn);

  block.append(prayerRow);
  container.append(block);
}

function addSacramentalBlock(container, hymnName, hymnNumber) {
  const block = document.createElement("section");
  block.className = "agenda-message-block agenda-sacramental-block";

  const heading = document.createElement("h3");
  heading.textContent = "Sacramento";
  block.append(heading, createHymnRow("Hino sacramental", hymnName, hymnNumber));

  const message = document.createElement("p");
  message.textContent = "O Sacramento será abençoado e distribuído a todos!";
  block.append(message);
  container.append(block);
}

function addContinuationBlock(container, ordinance, sustaining) {
  const continuation = document.createElement("div");
  continuation.className = "agenda-continuation";

  const sustainingCard = document.createElement("section");
  sustainingCard.className = "agenda-message-block agenda-continuation-card";

  const sustainingHeading = document.createElement("h3");
  sustainingHeading.textContent = "Apoios e desobrigações";
  sustainingCard.append(sustainingHeading);

  if (sustaining) {
    const details = document.createElement("p");
    details.textContent = sustaining;
    sustainingCard.append(details);
  } else {
    const writingLines = document.createElement("div");
    writingLines.className = "agenda-writing-lines agenda-continuation-writing-lines";
    writingLines.setAttribute("aria-label", "Espaço para escrever apoios e desobrigações à mão");

    for (let line = 0; line < 6; line += 1) {
      writingLines.append(document.createElement("span"));
    }

    sustainingCard.append(writingLines);
  }
  continuation.append(sustainingCard);

  const ordinanceCard = document.createElement("section");
  ordinanceCard.className = "agenda-message-block agenda-continuation-card";

  const ordinanceHeading = document.createElement("h3");
  ordinanceHeading.textContent = "Ordenanças";
  ordinanceCard.append(ordinanceHeading);

  if (ordinance) {
    const details = document.createElement("p");
    details.textContent = ordinance;
    ordinanceCard.append(details);
  } else {
    const writingLines = document.createElement("div");
    writingLines.className = "agenda-writing-lines agenda-continuation-writing-lines";
    writingLines.setAttribute("aria-label", "Espaço para escrever ordenanças à mão");

    for (let line = 0; line < 6; line += 1) {
      writingLines.append(document.createElement("span"));
    }

    ordinanceCard.append(writingLines);
  }
  continuation.append(ordinanceCard);

  container.append(continuation);
}

function renderAgenda() {
  previewContent.replaceChildren();
  previewContinuation.replaceChildren();
  const date = fieldValue("meeting-date");
  const formattedDate = date
    ? new Date(`${date}T12:00:00`).toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric"
    })
    : "";
  const welcome = fieldValue("welcome") || "Sejam todos bem-vindos à reunião sacramental";
  const welcomeDetails = [
    fieldValue("ward") ? `da Ala ${fieldValue("ward")}` : "",
    formattedDate ? `em ${formattedDate}` : ""
  ].filter(Boolean);
  addMessageBlock(
    previewContent,
    "Boas-vindas",
    `${welcome.replace(/[.!?]+$/, "")}${welcomeDetails.length ? ` ${welcomeDetails.join(", ")}` : ""}.`
  );
  const assignments = document.createElement("section");
  assignments.className = "agenda-message-block agenda-assignments-block";
  const assignmentsHeading = document.createElement("h3");
  assignmentsHeading.textContent = "Designações";
  assignments.append(assignmentsHeading);
  addEntryRow(assignments, [
    { label: "Presidida por", value: fieldValue("president") },
    { label: "Dirigida por", value: fieldValue("conducting") }
  ], "agenda-assignment-leaderships");
  addEntryRow(assignments, [
    { label: "Regente", value: fieldValue("regent") },
    { label: "Organista", value: fieldValue("organist") },
    { label: "Recepcionista", value: fieldValue("receptionist") }
  ]);
  previewContent.append(assignments);
  const visitors = fieldValue("leaders-present");
  addMessageBlock(
    previewContent,
    "Reconhecemos e damos as boas-vindas nesta manhã a todos que nos visitam.",
    visitors ? `Em especial ${visitors}.` : "",
    "agenda-recognition-block"
  );
  addAnnouncementsBlock(previewContent, fieldValue("announcements"));
  const openingHymnName = fieldValue("opening-hymn-name");
  const openingHymnNumber = fieldValue("opening-hymn-number");
  const ordinance = fieldValue("ordinance");
  const sustaining = fieldValue("sustaining");
  const continuationLabel = "Apoios e Ordenanças →";
  previewContent.classList.add("agenda-has-continuation");
  addOpeningBlock(
    previewContent,
    openingHymnName,
    openingHymnNumber,
    fieldValue("opening-prayer"),
    continuationLabel
  );
  addSacramentalBlock(
    previewContent,
    fieldValue("sacramental-hymn"),
    fieldValue("sacramental-hymn-number")
  );
  addDetailsCard(previewContent, "Oradores", [
    {
      label: "Primeiro orador",
      value: fieldValue("speaker-1-name"),
      theme: fieldValue("speaker-1-topic")
    },
    {
      label: "Segundo orador",
      value: fieldValue("speaker-2-name"),
      theme: fieldValue("speaker-2-topic")
    },
    {
      label: "Hino especial / Apresentação Coral",
      value: fieldValue("special-hymn")
    }
  ]);
  addDetailsCard(previewContent, "Encerramento", [
    {
      label: "Último orador",
      value: fieldValue("speaker-3-name"),
      theme: fieldValue("speaker-3-topic")
    },
    { label: "Último hino", value: fieldValue("closing-hymn") },
    { label: "Última oração", value: fieldValue("closing-prayer") }
  ]);
  addContinuationBlock(previewContinuation, ordinance, sustaining);

  preview.hidden = false;
  placeholder.hidden = true;
}

const exampleValues = {
  president: "William Serafim Mesquita",
  conducting: "Geraldo Antônio Claret Mesquita",
  regent: "Inêz Gruchka",
  organist: "Elaine Aparecida de Oliveira Mesquita",
  receptionist: "Geraldo Donizetti da Silva",
  "meeting-date": "2026-12-30",
  ward: "Guararema",
  welcome: "Sejam todos bem-vindos à reunião sacramental.",
  "leaders-present": "Presidente Exemplo e líderes convidados",
  announcements: "Mutirão da capela no sábado, às 9h.\nAtividade da ala na próxima sexta-feira.",
  "opening-hymn-name": "Vinde, Ó Santos",
  "opening-hymn-number": "20",
  "opening-prayer": "Irmã Exemplo",
  "sacramental-hymn": "Em Humildade, Senhor",
  "sacramental-hymn-number": "98",
  sustaining: "Apoio: Carlos Exemplo para o chamado de professor.\nDesobrigação: Pedro Exemplo do chamado de secretário.",
  "sacramental-hymn": "Em Humildade, Senhor",
  "speaker-1-name": "Evaldo Lucas de souza",
  "speaker-1-topic": "A importância da oração diária",
  "speaker-2-name": "Eliene de jesus Santos",
  "speaker-2-topic": "Servir ao próximo com amor",
  "speaker-3-name": "Rafael Moroni Alves Mesquita",
  "speaker-3-topic": "Encontrar paz em Jesus Cristo",
  "special-hymn": "Sou um Filho de Deus",
  "closing-hymn": "Comigo Habita",
  "closing-prayer": "Ariannys Milena Torres Valest"
};

for (const [id, value] of Object.entries(exampleValues)) {
  document.querySelector(`#${id}`).value = value;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  demoNotice.hidden = true;
  renderAgenda();
  showScreen("agenda");
});

form.addEventListener("input", () => {
  demoNotice.hidden = true;
});

form.addEventListener("reset", () => {
  demoNotice.hidden = true;
});

document.querySelector("#create-agenda-button").addEventListener("click", () => {
  showScreen("create");
});

document.querySelector("#cancel-agenda-button").addEventListener("click", () => {
  showScreen("agenda");
});

document.querySelector("#print-agenda").addEventListener("click", () => {
  window.print();
});

window.addEventListener("beforeprint", () => {
  const root = document.documentElement;
  const baseFontSize = 16;
  const printableHeight = (297 - 24) * 96 / 25.4 - 12;
  let minimumFit = 0;
  let maximumFit = 1;

  root.style.setProperty("--print-font-size", `${baseFontSize}px`);

  if (agendaFirstPage.getBoundingClientRect().height > printableHeight) {
    for (let attempt = 0; attempt < 16; attempt += 1) {
      const fit = (minimumFit + maximumFit) / 2;
      root.style.setProperty("--print-font-size", `${baseFontSize * fit}px`);

      if (agendaFirstPage.getBoundingClientRect().height <= printableHeight) {
        minimumFit = fit;
      } else {
        maximumFit = fit;
      }
    }

    root.style.setProperty("--print-font-size", `${baseFontSize * minimumFit}px`);
  }
});

window.addEventListener("afterprint", () => {
  document.documentElement.style.removeProperty("--print-font-size");
});

renderAgenda();
