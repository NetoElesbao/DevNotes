// Elementos--------------------------------------------------------------------------------------------------------------------
const notesContainer = document.querySelector("#notes-container");

const noteContent = document.querySelector("#note-content");

const addNoteBtn = document.querySelector(".add-note");

// Funções--------------------------------------------------------------------------------------------------------------------

// Adiciona nota
function addNote() {
  const notes = getNotes();

  const noteObject = {
    id: generateId(),
    content: noteContent.value,
    fixed: false,
  };

  // Cria a nota
  const noteElement = createNote(noteObject.id, noteObject.content);

  //Adiciona a nota para ser exibida
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

  //   Evento de troca do atributo fixed da nota
  div.querySelector(".bi-pin").addEventListener("click", () => {
    toggleFixNote(id);
  });

  return div;
}

function toggleFixNote(id) {
  const notes = getNotes();
  //   debugger;
  const noteTarget = notes.filter((note) => note.id === id)[0];

  noteTarget.fixed = !noteTarget.fixed;

  saveNotesInLocalStorage(notes);

  loadNotes();
}

// Salva a nota no localStorage
function saveNotesInLocalStorage(notes) {
  localStorage.setItem("notes", JSON.stringify(notes));
}

// localStorage--------------

// Carrega as notas dp localStorage caso existam, caso não, cria um array vazio.
function getNotes() {
  const notes = JSON.parse(localStorage.getItem("notes") || "[]");

  const orderedNotes = notes.sort((a, b) => (b.fixed > a.fixed ? 10 : -10));

  return orderedNotes;
}

function loadNotes() {
  cleanNotes();

  getNotes().forEach((note) => {
    console.log("Entrou");

    const noteElement = createNote(note.id, note.content, note.fixed);

    notesContainer.appendChild(noteElement);
  });
}

function cleanNotes() {
  notesContainer.replaceChildren([]);
}

// Eventos--------------------------------------------------------------------------------------------------------------------

// Adiciona nota
addNoteBtn.addEventListener("click", () => {
  //   debugger;
  addNote();
});

// Inicialização
loadNotes();
