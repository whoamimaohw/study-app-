// ===== STUDY APP =====

// --- Tab Switching ---
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

// ===== NOTES =====
let notes = JSON.parse(localStorage.getItem('studyNotes') || '[]');

const noteTitleEl = document.getElementById('note-title');
const noteBodyEl  = document.getElementById('note-body');
const saveNoteBtn = document.getElementById('save-note');
const notesListEl = document.getElementById('notes-list');

function renderNotes() {
  notesListEl.innerHTML = '';
  if (notes.length === 0) {
    notesListEl.innerHTML = '<p style="color:#999;font-style:italic;">No notes yet. Start writing above!</p>';
    return;
  }
  notes.slice().reverse().forEach((note, i) => {
    const realIndex = notes.length - 1 - i;
    const card = document.createElement('div');
    card.className = 'note-card';
    card.innerHTML = `
      <h3>${escapeHtml(note.title) || 'Untitled'}</h3>
      <p>${escapeHtml(note.body)}</p>
      <button class="delete-btn" data-index="${realIndex}" title="Delete">&#x2715;</button>
    `;
    notesListEl.appendChild(card);
  });

  notesListEl.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      notes.splice(Number(btn.dataset.index), 1);
      saveNotesToStorage();
      renderNotes();
    });
  });
}

function saveNotesToStorage() {
  localStorage.setItem('studyNotes', JSON.stringify(notes));
}

saveNoteBtn.addEventListener('click', () => {
  const title = noteTitleEl.value.trim();
  const body  = noteBodyEl.value.trim();
  if (!body) return;
  notes.push({ title, body, date: new Date().toLocaleDateString() });
  saveNotesToStorage();
  noteTitleEl.value = '';
  noteBodyEl.value  = '';
  renderNotes();
});

renderNotes();

// ===== QUIZ =====
let cards = JSON.parse(localStorage.getItem('studyCards') || '[]');
let currentIndex = 0;

const quizQuestionEl = document.getElementById('quiz-question');
const quizAnswerEl   = document.getElementById('quiz-answer');
const addCardBtn     = document.getElementById('add-card');
const quizAreaEl     = document.getElementById('quiz-area');
const flashcardEl    = document.getElementById('flashcard');
const cardInnerEl    = document.getElementById('card-inner');
const cardFrontEl    = document.getElementById('card-front');
const cardBackEl     = document.getElementById('card-back');
const cardCounterEl  = document.getElementById('card-counter');
const prevCardBtn    = document.getElementById('prev-card');
const nextCardBtn    = document.getElementById('next-card');
const noCardsMsg     = document.getElementById('no-cards-msg');

function saveCardsToStorage() {
  localStorage.setItem('studyCards', JSON.stringify(cards));
}

function updateQuizUI() {
  if (cards.length === 0) {
    quizAreaEl.style.display = 'none';
    noCardsMsg.style.display = 'block';
    return;
  }
  quizAreaEl.style.display = 'block';
  noCardsMsg.style.display = 'none';
  if (currentIndex >= cards.length) currentIndex = cards.length - 1;
  if (currentIndex < 0) currentIndex = 0;
  cardFrontEl.textContent = cards[currentIndex].question;
  cardBackEl.textContent  = cards[currentIndex].answer;
  cardCounterEl.textContent = (currentIndex + 1) + ' / ' + cards.length;
  cardInnerEl.classList.remove('flipped');
}

addCardBtn.addEventListener('click', () => {
  const q = quizQuestionEl.value.trim();
  const a = quizAnswerEl.value.trim();
  if (!q || !a) return;
  cards.push({ question: q, answer: a });
  saveCardsToStorage();
  quizQuestionEl.value = '';
  quizAnswerEl.value   = '';
  currentIndex = cards.length - 1;
  updateQuizUI();
});

flashcardEl.addEventListener('click', () => {
  cardInnerEl.classList.toggle('flipped');
});

prevCardBtn.addEventListener('click', () => {
  if (currentIndex > 0) { currentIndex--; updateQuizUI(); }
});

nextCardBtn.addEventListener('click', () => {
  if (currentIndex < cards.length - 1) { currentIndex++; updateQuizUI(); }
});

updateQuizUI();

// --- Utility ---
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
