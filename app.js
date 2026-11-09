const config = window.BISPADO_SUPABASE_CONFIG || {};
const status = document.querySelector("#app-status");
const form = document.querySelector("#agenda-form");
const homeScreen = document.querySelector("#home-screen");
const createScreen = document.querySelector("#create-screen");
const agendaScreen = document.querySelector("#agenda-screen");
const preview = document.querySelector("#agenda-preview");
const placeholder = document.querySelector("#agenda-placeholder");
const previewContent = document.querySelector("#preview-content");
const previewContinuation = document.querySelector("#preview-continuation");
const agendaFirstPage = document.querySelector("#agenda-first-page");
const demoNotice = document.querySelector("#demo-notice");
const agendaSteps = [...form.querySelectorAll(".form-section")];
const agendaProgress = document.querySelector("#agenda-progress-steps");
const draftStatus = document.querySelector("#draft-status");
const previousStepButton = document.querySelector("#previous-step-button");
const nextStepButton = document.querySelector("#next-step-button");
const reviewAgendaButton = document.querySelector("#review-agenda-button");
const draftStorageKey = "bispado-manager-agenda-draft-v1";
let activeAgendaStep = 0;
let draftStorageAvailable = true;

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
  const screens = {
    home: homeScreen,
    agenda: agendaScreen,
    create: createScreen
  };
  const activeScreen = screens[screen];

  if (!activeScreen) {
    throw new Error(`Tela desconhecida: ${screen}`);
  }

  for (const screenElement of Object.values(screens)) {
    screenElement.hidden = screenElement !== activeScreen;
  }

  const navigationScreen = screen === "create" ? "agenda" : screen;
  document.querySelectorAll(".primary-nav [data-screen]").forEach((link) => {
    if (link.dataset.screen === navigationScreen) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  activeScreen.querySelector("h1").focus();
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
    if (entry.hymnNumber !== undefined) {
      card.append(createHymnRow(entry.label, entry.value, entry.hymnNumber));
    } else {
      addEntry(card, entry.label, entry.value);
    }
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

function addWelcomeBlock(container, ward, date, visitors) {
  const block = document.createElement("section");
  block.className = "agenda-message-block";

  const heading = document.createElement("h3");
  heading.textContent = "Boas-vindas";

  const greeting = document.createElement("p");
  const details = [
    ward ? `da Ala ${ward}` : "",
    date ? `em ${date}` : ""
  ].filter(Boolean);
  greeting.textContent = `Sejam todos bem-vindos à reunião sacramental${details.length ? ` ${details.join(", ")}` : ""}.`;
  block.append(heading, greeting);

  if (visitors) {
    const recognition = document.createElement("p");
    recognition.className = "agenda-welcome-recognition";
    recognition.textContent = `Reconhecemos e damos as boas-vindas nesta manhã a todos que nos visitam. Em especial ${visitors}.`;
    block.append(recognition);
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

function createAgendaWatermark() {
  const watermark = document.createElement("img");
  watermark.className = "agenda-watermark";
  watermark.src = "salt-lake-temple-watermark.jpg";
  watermark.alt = "";
  watermark.setAttribute("aria-hidden", "true");
  return watermark;
}

function addOpeningBlock(container, hymnName, hymnNumber, prayer) {
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

function createAssignmentFormRows(prefix, sectionLabel, fields, count) {
  const rows = document.querySelector(`#${prefix}-entry-fields`);

  for (let index = 1; index <= count; index += 1) {
    const row = document.createElement("tr");

    for (const field of fields) {
      const cell = document.createElement("td");
      const input = document.createElement("input");
      input.id = `${prefix}-${field}-${index}`;
      input.name = input.id;
      input.type = "text";
      const fieldLabel = {
        name: "Nome",
        calling: "Chamado",
        type: "Tipo de ordenança",
        officiant: "Quem realiza",
        notes: "Observações"
      }[field];
      input.setAttribute("aria-label", `${sectionLabel} ${index} - ${fieldLabel}`);
      cell.append(input);
      row.append(cell);
    }

    rows.append(row);
  }
}

function getAssignmentEntries(prefix, fields, count) {
  return Array.from({ length: count }, (_, index) =>
    Object.fromEntries(fields.map((field) => [field, fieldValue(`${prefix}-${field}-${index + 1}`)]))
  );
}

function addAssignmentTable(container, entries, label, columns) {
  const table = document.createElement("table");
  table.className = "agenda-assignment-table";
  table.setAttribute("aria-label", label);
  table.setAttribute("role", "table");
  table.style.setProperty("--column-count", String(columns.length));
  table.style.setProperty("--row-count", String(entries.length));

  const header = document.createElement("thead");
  header.setAttribute("role", "rowgroup");
  const headerRow = document.createElement("tr");
  headerRow.setAttribute("role", "row");
  for (const title of columns.map((column) => column.label)) {
    const cell = document.createElement("th");
    cell.scope = "col";
    cell.setAttribute("role", "columnheader");
    cell.textContent = title;
    headerRow.append(cell);
  }
  header.append(headerRow);
  table.append(header);

  const body = document.createElement("tbody");
  body.setAttribute("role", "rowgroup");
  for (const entry of entries) {
    const row = document.createElement("tr");
    row.setAttribute("role", "row");
    for (const column of columns) {
      const cell = document.createElement("td");
      cell.setAttribute("role", "cell");
      cell.textContent = entry[column.field];
      if (entry[column.field]) {
        cell.title = entry[column.field];
      }
      row.append(cell);
    }
    body.append(row);
  }
  table.append(body);
  container.append(table);
}

function addContinuationBlock(container, supportEntries, releaseEntries, ordinanceEntries) {
  const continuation = document.createElement("div");
  continuation.className = "agenda-continuation";
  continuation.append(createAgendaWatermark());

  const pageContent = document.createElement("div");
  pageContent.className = "agenda-page-content agenda-continuation-content";

  for (const { title, entries, columns } of [
    { title: "Apoios", entries: supportEntries, columns: [{ field: "name", label: "Nome" }, { field: "calling", label: "Chamado" }] },
    { title: "Desobrigações", entries: releaseEntries, columns: [{ field: "name", label: "Nome" }, { field: "calling", label: "Chamado" }] },
    { title: "Ordenanças", entries: ordinanceEntries, columns: [{ field: "type", label: "Tipo de ordenança" }, { field: "officiant", label: "Quem realiza" }, { field: "notes", label: "Observações" }] }
  ]) {
    const card = document.createElement("section");
    card.className = "agenda-message-block agenda-continuation-card";

    const heading = document.createElement("h3");
    heading.textContent = title;
    card.append(heading);
    addAssignmentTable(card, entries, title, columns);
    pageContent.append(card);
  }

  const testimonies = document.createElement("section");
  testimonies.className = "agenda-message-block agenda-continuation-card agenda-testimonies-card";
  const testimoniesHeading = document.createElement("h3");
  testimoniesHeading.textContent = "Testemunhos";
  testimonies.append(testimoniesHeading);

  const testimonyLines = document.createElement("table");
  testimonyLines.className = "agenda-testimony-lines";
  testimonyLines.setAttribute("aria-label", "Espaço para escrever testemunhos à mão");
  testimonyLines.setAttribute("role", "table");
  testimonyLines.style.setProperty("--row-count", "15");
  const testimonyBody = document.createElement("tbody");
  testimonyBody.setAttribute("role", "rowgroup");
  for (let line = 0; line < 15; line += 1) {
    const row = document.createElement("tr");
    row.setAttribute("role", "row");
    const cell = document.createElement("td");
    cell.setAttribute("role", "cell");
    row.append(cell);
    testimonyBody.append(row);
  }
  testimonyLines.append(testimonyBody);
  testimonies.append(testimonyLines);
  pageContent.append(testimonies);

  continuation.append(pageContent);
  container.append(continuation);
}

createAssignmentFormRows("support", "Apoio", ["name", "calling"], 10);
createAssignmentFormRows("release", "Desobrigação", ["name", "calling"], 10);
createAssignmentFormRows("ordinance", "Ordenança", ["type", "officiant", "notes"], 3);

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
  addWelcomeBlock(
    previewContent,
    fieldValue("ward"),
    formattedDate,
    fieldValue("leaders-present")
  );
  const assignments = document.createElement("section");
  assignments.className = "agenda-message-block agenda-assignments-block";
  const assignmentsHeading = document.createElement("h3");
  assignmentsHeading.textContent = "Designações";
  assignments.append(assignmentsHeading);
  for (const entry of [
    { label: "Presidida", value: fieldValue("president") },
    { label: "Dirigida", value: fieldValue("conducting") },
    { label: "Regente", value: fieldValue("regent") },
    { label: "Organista", value: fieldValue("organist") },
    { label: "Recepção", value: fieldValue("receptionist") }
  ]) {
    addEntry(assignments, entry.label, entry.value);
  }
  previewContent.append(assignments);
  addAnnouncementsBlock(previewContent, fieldValue("announcements"));
  const openingHymnName = fieldValue("opening-hymn-name");
  const openingHymnNumber = fieldValue("opening-hymn-number");
  const supportEntries = getAssignmentEntries("support", ["name", "calling"], 10);
  const releaseEntries = getAssignmentEntries("release", ["name", "calling"], 10);
  const ordinanceEntries = getAssignmentEntries("ordinance", ["type", "officiant", "notes"], 3);
  addOpeningBlock(
    previewContent,
    openingHymnName,
    openingHymnNumber,
    fieldValue("opening-prayer")
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
      label: "Hino especial",
      value: fieldValue("special-hymn"),
      hymnNumber: fieldValue("special-hymn-number")
    }
  ]);
  addDetailsCard(previewContent, "Encerramento", [
    {
      label: "Último orador",
      value: fieldValue("speaker-3-name"),
      theme: fieldValue("speaker-3-topic")
    },
    {
      label: "Último hino",
      value: fieldValue("closing-hymn"),
      hymnNumber: fieldValue("closing-hymn-number")
    },
    { label: "Última oração", value: fieldValue("closing-prayer") }
  ]);
  addContinuationBlock(previewContinuation, supportEntries, releaseEntries, ordinanceEntries);

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
  "leaders-present": "Presidente Exemplo e líderes convidados",
  announcements: "Mutirão da capela no sábado, às 9h.\nAtividade da ala na próxima sexta-feira.",
  "opening-hymn-name": "Vinde, Ó Santos",
  "opening-hymn-number": "20",
  "opening-prayer": "Irmã Exemplo",
  "sacramental-hymn": "Ó Deus Senhor Eterno",
  "sacramental-hymn-number": "98",
  "special-hymn": "Sou um Filho de Deus",
  "special-hymn-number": "193",
  "closing-hymn": "Comigo Habita",
  "closing-hymn-number": "97",
  "support-name-1": "Carlos Exemplo",
  "support-calling-1": "Professor",
  "release-name-1": "Pedro Exemplo",
  "release-calling-1": "Secretário",
  "ordinance-type-1": "Bênção",
  "ordinance-officiant-1": "Carlos Exemplo",
  "ordinance-notes-1": "Durante a reunião",
  "speaker-1-name": "Evaldo Lucas de souza",
  "speaker-1-topic": "A importância da oração diária",
  "speaker-2-name": "Eliene de jesus Santos",
  "speaker-2-topic": "Servir ao próximo com amor",
  "speaker-3-name": "Rafael Moroni Alves Mesquita",
  "speaker-3-topic": "Encontrar paz em Jesus Cristo",
  "closing-prayer": "Ariannys Milena Torres Valest"
};

for (const [id, value] of Object.entries(exampleValues)) {
  document.querySelector(`#${id}`).value = value;
}

function updateAgendaStep(stepIndex, focusHeading = false) {
  activeAgendaStep = stepIndex;

  agendaSteps.forEach((section, index) => {
    section.hidden = index !== activeAgendaStep;
    const progressItem = agendaProgress.children[index];
    progressItem.classList.toggle("is-current", index === activeAgendaStep);
    progressItem.classList.toggle("is-complete", index < activeAgendaStep);
    if (index === activeAgendaStep) {
      progressItem.setAttribute("aria-current", "step");
    } else {
      progressItem.removeAttribute("aria-current");
    }
  });

  previousStepButton.disabled = activeAgendaStep === 0;
  nextStepButton.hidden = activeAgendaStep === agendaSteps.length - 1;
  reviewAgendaButton.hidden = activeAgendaStep !== agendaSteps.length - 1;
  draftStatus.textContent = `Etapa ${activeAgendaStep + 1} de ${agendaSteps.length}`;

  if (focusHeading) {
    const heading = agendaSteps[activeAgendaStep].querySelector("h2");
    heading.tabIndex = -1;
    heading.focus();
  }
}

for (const [index, section] of agendaSteps.entries()) {
  const item = document.createElement("li");
  item.textContent = section.querySelector("h2").textContent;
  item.setAttribute("aria-label", `Etapa ${index + 1}: ${item.textContent}`);
  agendaProgress.append(item);
}

function saveDraft() {
  if (!draftStorageAvailable) {
    return;
  }

  const values = {};
  for (const field of form.querySelectorAll("input[name], textarea[name], select[name]")) {
    values[field.name] = field.value;
  }

  try {
    window.localStorage.setItem(draftStorageKey, JSON.stringify(values));
    draftStatus.textContent = `Etapa ${activeAgendaStep + 1} de ${agendaSteps.length} · Rascunho salvo neste navegador`;
  } catch (error) {
    draftStorageAvailable = false;
    draftStatus.textContent = "Não foi possível salvar o rascunho neste navegador.";
    console.error("Falha ao salvar o rascunho da agenda.", error);
  }
}

function restoreDraft() {
  try {
    const serializedDraft = window.localStorage.getItem(draftStorageKey);
    if (!serializedDraft) {
      return;
    }

    const values = JSON.parse(serializedDraft);
    if (!values || typeof values !== "object" || Array.isArray(values)) {
      throw new TypeError("O rascunho salvo não contém um objeto de campos válido.");
    }

    for (const [name, value] of Object.entries(values)) {
      const field = form.elements.namedItem(name);
      if (
        (field instanceof HTMLInputElement
          || field instanceof HTMLTextAreaElement
          || field instanceof HTMLSelectElement)
        && typeof value === "string"
      ) {
        field.value = value;
      }
    }

    demoNotice.textContent = "Rascunho anterior recuperado deste navegador. Confira os dados antes de salvar.";
    draftStatus.textContent = "Rascunho recuperado deste navegador";
  } catch (error) {
    draftStorageAvailable = false;
    draftStatus.textContent = "Não foi possível recuperar o rascunho salvo.";
    console.error("Falha ao recuperar o rascunho da agenda.", error);
  }
}

updateAgendaStep(0);
restoreDraft();

form.addEventListener("submit", (event) => {
  event.preventDefault();
  demoNotice.hidden = true;
  renderAgenda();
  document.querySelector("#create-agenda-button").textContent = "Editar agenda";
  showScreen("agenda");
});

form.addEventListener("input", () => {
  demoNotice.hidden = true;
  saveDraft();
});

form.addEventListener("reset", () => {
  demoNotice.hidden = true;
  try {
    window.localStorage.removeItem(draftStorageKey);
    draftStatus.textContent = "Rascunho removido deste navegador";
  } catch (error) {
    draftStorageAvailable = false;
    draftStatus.textContent = "Não foi possível remover o rascunho salvo.";
    console.error("Falha ao remover o rascunho da agenda.", error);
  }
  updateAgendaStep(0);
});

previousStepButton.addEventListener("click", () => {
  if (activeAgendaStep > 0) {
    updateAgendaStep(activeAgendaStep - 1, true);
  }
});

nextStepButton.addEventListener("click", () => {
  if (activeAgendaStep < agendaSteps.length - 1) {
    updateAgendaStep(activeAgendaStep + 1, true);
  }
});

document.querySelector("#create-agenda-button").addEventListener("click", () => {
  updateAgendaStep(0);
  document.querySelector("#create-agenda-button").textContent = preview.hidden ? "Criar agenda" : "Editar agenda";
  showScreen("create");
});

document.querySelector("#open-agenda-button").addEventListener("click", () => {
  showScreen("agenda");
});

document.querySelectorAll(".primary-nav [data-screen]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    showScreen(link.dataset.screen);
  });
});

document.querySelector("#cancel-agenda-button").addEventListener("click", () => {
  showScreen("agenda");
});

document.querySelector("#print-agenda").addEventListener("click", () => {
  const printWindow = window.open("about:blank", "_blank");

  if (!printWindow) {
    status.textContent = "Permita pop-ups para abrir a impressão da ata.";
    return;
  }

  const printDocument = printWindow.document;
  printDocument.documentElement.lang = "pt-BR";
  printDocument.head.replaceChildren();

  const base = printDocument.createElement("base");
  base.href = document.baseURI;

  const title = printDocument.createElement("title");
  title.textContent = "Agenda sacramental";

  const stylesheet = printDocument.createElement("link");
  stylesheet.rel = "stylesheet";
  stylesheet.href = new URL("styles.css", document.baseURI).href;

  printDocument.head.append(base, title, stylesheet);

  const main = printDocument.createElement("main");
  const screen = printDocument.createElement("section");
  screen.id = "agenda-screen";
  const panel = printDocument.createElement("aside");
  panel.className = "preview-panel";
  const printPreview = printDocument.createElement("article");
  printPreview.id = "agenda-preview";
  printPreview.className = "agenda-preview";
  printPreview.append(
    agendaFirstPage.cloneNode(true),
    previewContinuation.cloneNode(true)
  );
  panel.append(printPreview);
  screen.append(panel);
  main.append(screen);
  printDocument.body.replaceChildren(main);

  stylesheet.addEventListener("load", async () => {
    try {
      await Promise.all(Array.from(printDocument.images, (image) => image.decode()));
      await printDocument.fonts.ready;

      const fitPageOne = () => {
        const root = printDocument.documentElement;
        const pageContent = printDocument.querySelector(".agenda-first-page > .agenda-page-content");
        let minimumScale = 0.5;
        let maximumScale = 1;
        root.style.setProperty("--print-font-size", "16px");

        if (pageContent.scrollHeight > pageContent.clientHeight + 1) {
          for (let attempt = 0; attempt < 14; attempt += 1) {
            const scale = (minimumScale + maximumScale) / 2;
            root.style.setProperty("--print-font-size", `${16 * scale}px`);

            if (pageContent.scrollHeight <= pageContent.clientHeight + 1) {
              minimumScale = scale;
            } else {
              maximumScale = scale;
            }
          }

          root.style.setProperty("--print-font-size", `${16 * minimumScale}px`);
        }
      };

      printWindow.addEventListener("beforeprint", () => {
        fitPageOne();
      }, { once: true });
      printWindow.addEventListener("afterprint", () => printWindow.close(), { once: true });
      printWindow.focus();
      printWindow.print();
    } catch (error) {
      printWindow.close();
      status.textContent = "Não foi possível preparar a impressão da ata.";
      console.error("Falha ao preparar a impressão da ata.", error);
    }
  }, { once: true });

  stylesheet.addEventListener("error", () => {
    printWindow.close();
    status.textContent = "Não foi possível carregar o estilo de impressão da ata.";
  }, { once: true });
});

window.addEventListener("beforeprint", () => {
  const root = document.documentElement;
  const agendaPageContent = agendaFirstPage.querySelector(".agenda-page-content");
  const baseFontSize = 16;
  const printableHeight = (297 - 24) * 96 / 25.4 - 12;
  let minimumFit = 0.5;
  let maximumFit = 1;

  root.style.setProperty("--print-font-size", `${baseFontSize}px`);

  if (agendaPageContent.getBoundingClientRect().height > printableHeight) {
    for (let attempt = 0; attempt < 16; attempt += 1) {
      const fit = (minimumFit + maximumFit) / 2;
      root.style.setProperty("--print-font-size", `${baseFontSize * fit}px`);

      if (agendaPageContent.getBoundingClientRect().height <= printableHeight) {
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
