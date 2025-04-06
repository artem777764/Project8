let notes = [];
const notesContainer = document.getElementById("notesContainer");
const addNoteBtn = document.getElementById("addNoteBtn");
const modal = document.getElementById("modal");
const closeModal = document.getElementById("closeModal");
const noteForm = document.getElementById("noteForm");
const noteTitle = document.getElementById("noteTitle");
const noteDesc = document.getElementById("noteDesc");
const noteIdField = document.getElementById("noteId");
const modalTitle = document.getElementById("modalTitle");
const connectionStatus = document.getElementById("connectionStatus");
const refreshStatus = document.getElementById("refreshStatus");
function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(notes));
}
function loadNotes() {
  const stored = localStorage.getItem("notes");
  if (stored) {
    notes = JSON.parse(stored);
  }
}
function renderNotes() {
  notesContainer.innerHTML = "";
  notes.forEach((note) => {
    const card = document.createElement("div");
    card.className = "note-card";
    const title = document.createElement("h3");
    title.textContent = note.title;
    const desc = document.createElement("p");
    desc.textContent = note.description;
    const actions = document.createElement("div");
    actions.className = "actions";
    const editBtn = document.createElement("button");
    editBtn.className = "action-btn";
    editBtn.textContent = "Редактировать";
    editBtn.addEventListener("click", () => editNote(note.id));
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "action-btn";
    deleteBtn.textContent = "Удалить";
    deleteBtn.addEventListener("click", () => deleteNote(note.id));
    actions.append(editBtn, deleteBtn);
    card.append(title, desc, actions);
    notesContainer.appendChild(card);
  });
}
function generateId() {
  return Date.now();
}
function openModal(editNoteData = null) {
  modal.style.display = "block";
  if (editNoteData) {
    modalTitle.textContent = "Редактировать заметку";
    noteTitle.value = editNoteData.title;
    noteDesc.value = editNoteData.description;
    noteIdField.value = editNoteData.id;
  } else {
    modalTitle.textContent = "Новая заметка";
    noteTitle.value = "";
    noteDesc.value = "";
    noteIdField.value = "";
  }
}
function closeModalWindow() {
  modal.style.display = "none";
}
noteForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const title = noteTitle.value;
  const description = noteDesc.value;
  const id = noteIdField.value;
  if (id) {
    notes = notes.map((note) =>
      note.id == id ? { id: Number(id), title, description } : note
    );
  } else {
    const newNote = { id: generateId(), title, description };
    notes.push(newNote);
  }
  saveNotes();
  renderNotes();
  closeModalWindow();
});
function deleteNote(id) {
  notes = notes.filter((note) => note.id !== id);
  saveNotes();
  renderNotes();
}
function editNote(id) {
  const noteToEdit = notes.find((note) => note.id === id);
  if (noteToEdit) {
    openModal(noteToEdit);
  }
}
function updateConnectionStatus() {
  fetch("https://www.gstatic.com/generate_204", {
    method: "GET",
    mode: "no-cors",
  })
    .then(() => {
      connectionStatus.textContent = "Онлайн";
    })
    .catch(() => {
      connectionStatus.textContent = "Офлайн";
    });
}
addNoteBtn.addEventListener("click", () => openModal());
closeModal.addEventListener("click", closeModalWindow);
window.addEventListener("click", function (e) {
  if (e.target === modal) {
    closeModalWindow();
  }
});
refreshStatus.addEventListener("click", updateConnectionStatus);
window.addEventListener("online", updateConnectionStatus);
window.addEventListener("offline", updateConnectionStatus);
function init() {
  loadNotes();
  renderNotes();
  updateConnectionStatus();
}
init();
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/ServiceWorker.js")
      .then((reg) => console.log("Service Worker зарегистрирован:", reg.scope))
      .catch((err) =>
        console.log("Ошибка при регистрации Service Worker:", err)
      );
  });
}