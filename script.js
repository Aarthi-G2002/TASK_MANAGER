const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const filterBtns = document.querySelectorAll('.filter-btn');
const sortBtn = document.getElementById('sort-btn');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';
let sortNewest = true;

function saveTasksToLocal() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function showTasks() {
  taskList.innerHTML = '';

  let filtered = tasks.filter(task => {
    if (currentFilter === 'pending') return !task.completed;
    if (currentFilter === 'completed') return task.completed;
    return true;
  });

  if (sortNewest) {
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else {
    filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }

  filtered.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task-item';
    if (task.completed) li.classList.add('completed');

    li.innerHTML = `
      <span>${task.text}</span>
      <div class="task-actions">
        <button class="complete-btn">${task.completed ? 'Undo' : 'Complete'}</button>
        <button class="delete-btn">Delete</button>
      </div>
    `;

    li.querySelector('.complete-btn').onclick = () => {
      task.completed = !task.completed;
      saveTasksToLocal();
      showTasks();
    };

    li.querySelector('.delete-btn').onclick = () => {
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasksToLocal();
      showTasks();
    };

    taskList.appendChild(li);
  });
}

function addTask() {
  const text = taskInput.value.trim();
  if (text === '') return;

  const newTask = {
    id: Date.now(),
    text: text,
    completed: false,
    createdAt: new Date().toISOString()
  };

  tasks.push(newTask);
  saveTasksToLocal();
  taskInput.value = '';
  showTasks();
}

addBtn.onclick = addTask;

taskInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') addTask();
});

filterBtns.forEach(btn => {
  btn.onclick = () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.textContent.toLowerCase();
    showTasks();
  };
});

sortBtn.onclick = () => {
  sortNewest = !sortNewest;
  sortBtn.textContent = sortNewest ? 'Sort by Newest' : 'Sort by Oldest';
  showTasks();
};

showTasks();
