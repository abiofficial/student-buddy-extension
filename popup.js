document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tablink');
  tabs.forEach(tab => tab.addEventListener('click', () => openTab(tab.dataset.tab)));

  openTab('todo');
  loadTasks();
  loadNotes();
  fetchQuote();
  updateProgress();

  document.getElementById('addTaskBtn').addEventListener('click', addTask);
  document.getElementById('saveNotesBtn').addEventListener('click', saveNotes);
  document.getElementById('startTimerBtn').addEventListener('click', startTimer);
  document.getElementById('resetTimerBtn').addEventListener('click', resetTimer);
  document.getElementById('toggleThemeBtn').addEventListener('click', toggleTheme);
});

function openTab(tabName) {
  document.querySelectorAll('.tabcontent').forEach(tab => tab.style.display = 'none');
  document.getElementById(tabName).style.display = 'block';
}

/* ---- TO-DO ---- */
function addTask() {
  const taskInput = document.getElementById('taskInput');
  if (taskInput.value.trim()) {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    tasks.push({ text: taskInput.value, done: false });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    taskInput.value = '';
    loadTasks();
    updateProgress();
  }
}

function toggleTask(index) {
  const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  tasks[index].done = !tasks[index].done;
  localStorage.setItem('tasks', JSON.stringify(tasks));
  loadTasks();
  updateProgress();
}

function loadTasks() {
  const list = document.getElementById('taskList');
  list.innerHTML = '';
  const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  tasks.forEach((task, i) => {
    const li = document.createElement('li');
    li.textContent = task.text;
    li.style.textDecoration = task.done ? 'line-through' : 'none';
    li.onclick = () => toggleTask(i);
    list.appendChild(li);
  });
}

function updateProgress() {
  const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  const completed = tasks.filter(t => t.done).length;
  const total = tasks.length;
  document.getElementById('taskProgress').innerText = total ? `Completed ${completed}/${total} tasks` : '';
}

/* ---- NOTES ---- */
function saveNotes() {
  const notes = document.getElementById('notesArea').value;
  localStorage.setItem('notes', notes);
}

function loadNotes() {
  document.getElementById('notesArea').value = localStorage.getItem('notes') || '';
}

/* ---- QUOTES ---- */
function fetchQuote() {
  fetch('https://type.fit/api/quotes')
    .then(res => res.json())
    .then(data => {
      const random = data[Math.floor(Math.random() * data.length)];
      document.getElementById('quote').innerText = `"${random.text}" - ${random.author || 'Unknown'}`;
    });
}

/* ---- TIMER ---- */
let timer, timeLeft = 1500;
function startTimer() {
  clearInterval(timer);
  timer = setInterval(() => {
    if (timeLeft <= 0) {
      clearInterval(timer);
      alert('Time is up! Take a break.');
    } else {
      timeLeft--;
      updateTimerDisplay();
    }
  }, 1000);
}
function resetTimer() {
  clearInterval(timer);
  timeLeft = 1500;
  updateTimerDisplay();
}
function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  document.getElementById('timerDisplay').innerText = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/* ---- THEME ---- */
function toggleTheme() {
  document.body.classList.toggle('dark');
}