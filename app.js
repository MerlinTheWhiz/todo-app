const todoForm = document.querySelector('form');
const todoInput = document.getElementById('todo-input');
const todoListUL = document.getElementById('todo-list');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');

let allTodos = getTodos();

// Create confetti container
const confettiContainer = document.createElement('div');
confettiContainer.className = 'confetti-container';
document.body.appendChild(confettiContainer);

// Function to create confetti pieces
function createConfetti() {
    confettiContainer.innerHTML = '';
    const colors = ['#00A8E8', '#F9F9F9', '#4A4D57', '#ff0033', '#ffcc00'];
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = Math.random() * 10 + 5 + 'px';
        confetti.style.height = Math.random() * 10 + 5 + 'px';
        confetti.style.animationDuration = Math.random() * 2 + 2 + 's';
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        confettiContainer.appendChild(confetti);
    }
}

updateTodoList();
updateProgressBar();

todoForm.addEventListener('submit', function(e){
    e.preventDefault();
    addTodo();
})
function addTodo(){
    const todoText = todoInput.value.trim();
    if(todoText.length > 0){
        const todoObject = {
            text: todoText,
            completed: false
        }
        allTodos.push(todoObject);
        updateTodoList();
        saveTodos();
        updateProgressBar();
        todoInput.value = "";
    }
}
function updateProgressBar() {
    const totalTasks = allTodos.length;
    if (totalTasks === 0) {
        progressBar.style.width = '0%';
        progressText.textContent = '0/0';
        return;
    }
    
    const completedTasks = allTodos.filter(todo => todo.completed).length;
    const percentage = Math.round((completedTasks / totalTasks) * 100);
    
    progressBar.style.width = `${percentage}%`;
    progressText.textContent = `${completedTasks}/${totalTasks}`;
    
    // Add celebration animation when all tasks are completed
    if (completedTasks === totalTasks && totalTasks > 0) {
        document.body.classList.add('celebration');
        createConfetti();
        setTimeout(() => {
            document.body.classList.remove('celebration');
        }, 3000);
    } else {
        document.body.classList.remove('celebration');
    }
}

function updateTodoList(){
    todoListUL.innerHTML = "";
    
    // Sort todos: uncompleted first, then completed
    const sortedTodos = [...allTodos].sort((a, b) => {
        if (a.completed === b.completed) return 0;
        return a.completed ? 1 : -1;
    });
    
    sortedTodos.forEach((todo, displayIndex) => {
        // Find the original index in allTodos array
        const originalIndex = allTodos.findIndex(t => t === todo);
        let todoItem = createTodoItem(todo, originalIndex);
        todoListUL.append(todoItem);
    })
}
function createTodoItem(todo, todoIndex){
    const todoId = "todo-"+todoIndex;
    const todoLI = document.createElement("li");
    const todoText = todo.text;
    todoLI.className = "todo";
    todoLI.innerHTML = `
        <input type="checkbox" id="${todoId}">
        <label class="custom-checkbox" for="${todoId}">
            <span class="material-symbols-outlined">
                check
                </span>
        </label>
        <label for="${todoId}" class="todo-text">
            ${todoText}
        </label>
        <button class="delete-button">
            <span class="material-symbols-outlined">
                delete
                </span>
        </button>
    `
    const deleteButton = todoLI.querySelector(".delete-button");
    deleteButton.addEventListener("click", ()=>{
        deleteTodoItem(todoIndex)
    })
    const checkbox = todoLI.querySelector("input");
    checkbox.addEventListener("click", ()=>{
        allTodos[todoIndex].completed = checkbox.checked;
        saveTodos();
        updateProgressBar();
        updateTodoList(); // Re-sort the list when completion status changes
    })    
    checkbox.checked = todo.completed;
    return todoLI;
}
function deleteTodoItem(todoIndex){
    allTodos = allTodos.filter((_, i)=> i !== todoIndex);
    saveTodos();
    updateTodoList();
    updateProgressBar();
}
function saveTodos(){
    const todosJson = JSON.stringify(allTodos)
    localStorage.setItem("todos", todosJson)
}
function getTodos(){
    const todos = localStorage.getItem("todos") || "[]";
    return JSON.parse(todos);
}