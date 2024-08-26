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
            <span class="todo-text">${todo}</span>
            <div class="todo-actions">
                <button class="edit-btn" data-index="${index}">Edit</button>
                <button class="copy-btn" data-index="${index}">Copy</button>
                <button class="delete-btn" data-index="${index}">Delete</button>
            </div>
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

async function deleteTodo(index) {
    todos.splice(index, 1);
    renderTodos();
    await updateTodos();
}

function copyTodo(index) {
    const textToCopy = todos[index];
    navigator.clipboard.writeText(textToCopy).then(() => {
        alert('Todo copied to clipboard!');
    }, (err) => {
        console.error('Could not copy text: ', err);
    });
}

async function editTodo(index) {
    const newText = prompt('Edit your todo:', todos[index]);
    if (newText !== null && newText.trim() !== '') {
        todos[index] = newText.trim();
        renderTodos();
        await updateTodos();
    }
}

function handleTodoAction(e) {
    const index = parseInt(e.target.dataset.index);
    if (e.target.classList.contains('delete-btn')) {
        deleteTodo(index);
    } else if (e.target.classList.contains('copy-btn')) {
        copyTodo(index);
    } else if (e.target.classList.contains('edit-btn')) {
        editTodo(index);
    }
}

todoForm.addEventListener('submit', addTodo);
todoList.addEventListener('click', handleTodoAction);

// Load todos when the page loads
fetchTodos();