// Elementos--------------------------------------------------------------------------------------------------------------------
const notesContainer = document.querySelector("#notes-container");

const noteContent = document.querySelector("#note-content");

const addNoteBtn = document.querySelector(".add-note");

const searchInput = document.querySelector("#search-input");

const exportNotesBtn = document.querySelector("#export-notes");

// Funções--------------------------------------------------------------------------------------------------------------------

// Adiciona nota
function addNote() {
  const notes = getNotesInLocalStorage();

  const noteObject = {
    id: generateId(),
    content: noteContent.value,
    fixed: false,
  };

  // Cria a nota
  const noteElement = createNote(noteObject.id, noteObject.content);

  // Adiciona a nota para ser exibida
  notesContainer.appendChild(noteElement);

  notes.push(noteObject);

  saveNotesInLocalStorage(notes); // Tentar resolver o porquê as notas estão sendo salvas vazias

  noteContent.value = "";
}

// Gera o Id da nota
function generateId() {
  return Math.floor(Math.random() * 5000);
}

// Cria a nota
function createNote(id, content, fixed = false) {
  const div = document.createElement("div");
  div.classList.add("note");

  //   Forma 1
  //   div.innerHTML = `<textarea placeholder="Adicione algum texto">${content}</textarea>

  //           <i class="bi bi-pin"></i>

  //           <i class="bi bi-x-lg"></i>

  //           <i class="bi bi-file-earmark-plus"></i>`;

  // Forma 2
  if (fixed) {
    div.classList.add("fixed");
  }

  const textarea = document.createElement("textarea");
  textarea.value = content;
  textarea.placeholder = "Adicione algum texto";
  div.appendChild(textarea);

  const pinBtn = document.createElement("i");
  pinBtn.classList.add(...["bi"], ["bi-pin"]);
  div.appendChild(pinBtn);

  const deleteBtn = document.createElement("i");
  deleteBtn.classList.add(...["bi"], ["bi-x-lg"]);
  div.appendChild(deleteBtn);

  const copyBtn = document.createElement("i");
  copyBtn.classList.add(...["bi"], ["bi-file-earmark-plus"]);
  div.appendChild(copyBtn);

  // Evento pra atualizar content (sim, uma forma bem duvidosa pra atualizar uma nota, mas pra esse contexto é mais prático)
  div.querySelector("textarea").addEventListener("keyup", (event) => {
    const content = event.target.value;

    updateNote(id, content);
  });

  //   Evento de troca do atributo fixed da nota
  div.querySelector(".bi-pin").addEventListener("click", () => {
    toggleFixNote(id);
  });

  // Evento de deletar nota
  div.querySelector(".bi-x-lg").addEventListener("click", () => {
    deleteNote(id, div);
  });

  // Evento de duplicar nota
  div.querySelector(".bi-file-earmark-plus").addEventListener("click", () => {
    // debugger;
    duplicateNote(id);
  });

  return div;
}

// Atualiza content de nota
function updateNote(id, newContent) {
  const notes = getNotesInLocalStorage();

  const noteTarget = notes.filter((note) => note.id === id)[0];

  noteTarget.content = newContent;

  saveNotesInLocalStorage(notes);
}

// Troca o atributo fixed
function toggleFixNote(id) {
  const notes = getNotesInLocalStorage();
  //   debugger;
  const noteTarget = notes.filter((note) => note.id === id)[0];

  noteTarget.fixed = !noteTarget.fixed;

  saveNotesInLocalStorage(notes);

  loadNotes();
}

// Deleta nota
function deleteNote(id, element) {
  // Aqui o método filter retém a nota a ser excluída, impendindo-a de adentrar ao array.
  const notes = getNotesInLocalStorage().filter((note) => note.id !== id);

  // Aqui o array já filtrado é acrescentado ao localStorage.
  saveNotesInLocalStorage(notes);

  // Aqui o elemento nota em questão é removido da tela.
  notesContainer.removeChild(element);
}

// Duplica nota
function duplicateNote(id) {
  const notesLS = getNotesInLocalStorage();

  const noteTarget = getNotesInLocalStorage().filter(
    (note) => note.id === id
  )[0];

  const noteDuplicated = {
    id: generateId(),
    content: noteTarget.content,
    fixed: noteTarget.fixed,
  };

  const noteElement = createNote(
    noteDuplicated.id,
    noteDuplicated.content,
    noteDuplicated.fixed
  );

  notesContainer.appendChild(noteElement);

  notesLS.push(noteDuplicated);

  saveNotesInLocalStorage(notesLS);
}

// Salva a nota no localStorage
function saveNotesInLocalStorage(notes) {
  localStorage.setItem("notes", JSON.stringify(notes));
}

// localStorage--------------

// Carrega as notas dp localStorage caso existam, caso não, cria um array vazio.
function getNotesInLocalStorage() {
  const notes = JSON.parse(localStorage.getItem("notes") || "[]");

  const orderedNotes = notes.sort((a, b) => (b.fixed > a.fixed ? 10 : -10));

  return orderedNotes;
}

function loadNotes() {
  cleanNotes();

  getNotesInLocalStorage().forEach((note) => {
    const noteElement = createNote(note.id, note.content, note.fixed);

    notesContainer.appendChild(noteElement);
  });
}

// Limpa as notas da tela do usuário
function cleanNotes() {
  notesContainer.replaceChildren([]);
}

// Faz a pesquisa das notas no localStorage
function searchNotes(search) {
  const searchNormalized = search.toLowerCase();

  const searchResults = getNotesInLocalStorage().filter((note) => {
    // debugger;
    const noteNormalized = note.content.toLowerCase();

    return noteNormalized.includes(searchNormalized);
  });

  console.log(searchNormalized);

  if (searchNormalized !== "") {
    cleanNotes();

    searchResults.forEach((note) => {
      const noteElement = createNote(note.id, note.content);
      notesContainer.appendChild(noteElement);
    });

    return;
  }

  cleanNotes();

  loadNotes();
}

// Exporta csv (método)
function exportData() {
  // Puxa as notas do localStorage
  const notes = getNotesInLocalStorage();

  // Cria um array com dois arrays internos
  const csvString = [
    ["ID", "Conteúdo", "Fixado?"],
    ...notes.map((note) => [note.id, note.content, note.fixed]),
  ]
    .map((element) => element.join(","))
    .join("\n");

  // Cria uma ancora
  const a_element = document.createElement("a");
  a_element.href = "data:text/csv;charset=utf-8," + encodeURI(csvString);

  a_element.target = "_blank";

  a_element.download = "notes.csv";

  a_element.click();
}

cleanNotes();

loadNotes();

// Eventos--------------------------------------------------------------------------------------------------------------------

// Adiciona nota
addNoteBtn.addEventListener("click", () => {
  addNote();
});

noteContent.addEventListener("keydown", (event) => {
  if (event.key == "Enter") {
    addNote();
  }
});

// Pesquisa a nota
searchInput.addEventListener("keyup", (event) => {
  const search = event.target.value;

  searchNotes(search);
});

// Exporta CSV
exportNotesBtn.addEventListener("click", () => {
  exportData();
});

// Inicialização
loadNotes();
