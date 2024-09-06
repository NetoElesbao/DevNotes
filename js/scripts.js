// Elementos--------------------------------------------------------------------------------------------------------------------
const notesContainer = document.querySelector("#notes-container");

const noteContent = document.querySelector("#note-content");

const addNoteBtn = document.querySelector(".add-note");

// Funções--------------------------------------------------------------------------------------------------------------------

// Adiciona nota
function addNote() {
  //   console.log("Funcionou!");
  //   debugger;

  const noteObject = {
    id: generateId(),
    content: noteContent.value,
    fixed: false,
  };

  const noteElement = createNote(noteObject.id, noteObject.content);
  //   console.log(noteElement);
  notesContainer.appendChild(noteElement);
}

// Gera o Id da nota
function generateId() {
  return Math.floor(Math.random() * 5000);
}

// Cria a nota
function createNote(id, content, fixed) {
  const div = document.createElement("div");
  div.classList.add("note");

  //   Forma 1
  div.innerHTML = `<textarea placeholder="Adicione algum texto">${content}</textarea>

          <i class="bi bi-pin"></i>

          <i class="bi bi-x-lg"></i>

          <i class="bi bi-file-earmark-plus"></i>`;

  //   // Forma 2
  //   const textarea = document.createElement("textarea");

  //   textarea.value = content;

  //   textarea.placeholder = "Adicione algum texto";

  //   div.appendChild(textarea);

  //   const iconOne =

  return div;
}

// Eventos--------------------------------------------------------------------------------------------------------------------
addNoteBtn.addEventListener("click", () => addNote());
