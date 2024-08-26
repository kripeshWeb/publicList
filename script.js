const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

let todos = [];
const blobUrl = 'https://jsonblob.com/api/jsonBlob/1277666568400920576';

async function fetchTodos() {
    try {
        const response = await fetch(blobUrl);
        const data = await response.json();
        todos = data.todos;
        renderTodos();
    } catch (error) {
        console.error('Error fetching todos:', error);
        todos = [];
        renderTodos();
    }
}

async function updateTodos() {
    try {
        await fetch(blobUrl, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ todos })
        });
    } catch (error) {
        console.error('Error updating todos:', error);
    }
}

function renderTodos() {
    todoList.innerHTML = '';
    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${todo}</span>
            <button class="delete-btn" data-index="${index}">Delete</button>
        `;
        todoList.appendChild(li);
    });
}

async function addTodo(e) {
    e.preventDefault();
    const newTodo = todoInput.value.trim();
    if (newTodo) {
        todos.push(newTodo);
        todoInput.value = '';
        renderTodos();
        await updateTodos();
    }
}

async function deleteTodo(e) {
    if (e.target.classList.contains('delete-btn')) {
        const index = parseInt(e.target.dataset.index);
        todos.splice(index, 1);
        renderTodos();
        await updateTodos();
    }
}

todoForm.addEventListener('submit', addTodo);
todoList.addEventListener('click', deleteTodo);

// Load todos when the page loads
fetchTodos();