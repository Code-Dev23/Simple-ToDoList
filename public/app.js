// Ottenere riferimenti agli elementi del DOM
const form = document.getElementById('todo-form');
const inputTitle = document.getElementById('todo-input-title');
const inputDescription = document.getElementById('todo-input-description');
const list = document.getElementById('todo-list');

// Gestire l'invio del modulo
form.addEventListener('submit', e => {
  e.preventDefault();

  const taskTitle = inputTitle.value;
  const taskDescription = inputDescription.value;
  if (taskTitle) {
    const task = {
      title: taskTitle,
      description: taskDescription,
      complete: false
    };

    fetch('http://localhost:3000/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(task)
    })
      .then(response => response.json())
      .then(createdTask => {
        const listItem = createListItem(createdTask);
        list.appendChild(listItem);
        inputTitle.value = '';
        inputDescription.value = '';
      });
  }
});

// Funzione per creare un elemento della lista
function createListItem(task) {
  const listItem = document.createElement('li');
  listItem.className = 'bg-white shadow-md rounded p-4';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = task.complete;
  checkbox.className = 'mr-2';
  checkbox.addEventListener('change', () => {
    updateTask(task.id, { complete: checkbox.checked });
  });

  const title = document.createElement('h3');
  title.textContent = task.title;
  title.className = 'text-lg font-semibold mb-2';

  const description = document.createElement('p');
  description.textContent = task.description;
  description.className = 'text-gray-600';

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Elimina';
  deleteButton.className = 'bg-red-500 text-white px-4 py-2 rounded';
  deleteButton.addEventListener('click', function () {
    deleteTask(task.id);
    this.parentElement.remove();
  });

  listItem.appendChild(checkbox);
  listItem.appendChild(title);
  listItem.appendChild(description);
  listItem.appendChild(deleteButton);

  return listItem;
}

// Funzione per aggiornare una singola attività
function updateTask(taskId, updates) {
  fetch(`http://localhost:3000/tasks/${taskId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updates)
  });
}

// Funzione per eliminare una singola attività
function deleteTask(taskId) {
  fetch(`http://localhost:3000/tasks/${taskId}`, {
    method: 'DELETE'
  });
}

// Caricamento iniziale delle attività dalla API
window.onload = () => {
  loadTasks();
};

// Funzione per caricare le attività dalla API
function loadTasks() {
  fetch('http://localhost:3000/tasks')
    .then(response => response.json())
    .then(tasks => {
      list.innerHTML = ''; // Rimuove tutte le attività presenti nella lista
      tasks.forEach(task => {
        const listItem = createListItem(task);
        list.appendChild(listItem);
      });
    });
}