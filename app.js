const todoForm = document.querySelector('form');
const todoInput = document.getElementById('todo-input');
const todoListUL = document.getElementById('todo-list');

let allTodos = getTodos();
updateTodoList();

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
        todoInput.value = "";
    }
}
function updateTodoList(){
    todoListUL.innerHTML = "";
    
    // Sort todos: incomplete first, then completed
    const sortedTodos = [...allTodos].sort((a, b) => {
        if (a.completed === b.completed) return 0;
        return a.completed ? 1 : -1; // Put incomplete tasks first
    });
    
    // Create and append todo items in the new order
    sortedTodos.forEach((todo, index) => {
        // Find the original index in allTodos array to maintain correct references
        const originalIndex = allTodos.findIndex(t => t === todo);
        let todoItem = createTodoItem(todo, originalIndex);
        todoListUL.append(todoItem);
    });
    
    // Update progress bar
    updateProgressBar();
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
        updateTodoList(); // Update the list to reorder and update progress
        checkAllCompleted(); // Check if all tasks are complete
    })    
    checkbox.checked = todo.completed;
    return todoLI;
}
function deleteTodoItem(todoIndex){
    allTodos = allTodos.filter((_, i)=> i !== todoIndex);
    saveTodos();
    updateTodoList();
}
function saveTodos(){
    const todosJson = JSON.stringify(allTodos)
    localStorage.setItem("todos", todosJson)
}
function getTodos(){
    const todos = localStorage.getItem("todos") || "[]";
    return JSON.parse(todos);
}

// Update the progress bar with the current completion ratio
function updateProgressBar() {
    const totalTasks = allTodos.length;
    const completedTasks = allTodos.filter(todo => todo.completed).length;
    
    // Update the progress text (fraction)
    const progressText = document.querySelector('.progress-text');
    progressText.textContent = `${completedTasks}/${totalTasks}`;
    
    // Update the progress bar fill
    const progressFill = document.querySelector('.progress-fill');
    const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    progressFill.style.width = `${progressPercentage}%`;
}

// Check if all tasks are complete and trigger celebration if they are
function checkAllCompleted() {
    if (allTodos.length === 0) return; // Don't celebrate if there are no tasks
    
    const allCompleted = allTodos.every(todo => todo.completed);
    
    if (allCompleted) {
        startCelebration();
    } else {
        stopCelebration();
    }
}

// Start the celebration animation
function startCelebration() {
    // Add the celebration container if it doesn't exist
    if (!document.querySelector('.celebration-container')) {
        const celebrationContainer = document.createElement('div');
        celebrationContainer.className = 'celebration-container';
        document.body.appendChild(celebrationContainer);
        
        // Create confetti elements
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            // Set CSS variables for random movement direction
            confetti.style.setProperty('--random-x', Math.random());
            confetti.style.setProperty('--random-y', Math.random());
            confetti.style.setProperty('--random-rotate', Math.random());
            confetti.style.animationDelay = `${Math.random() * 1.0}s`; // Increased from 0.3s to 1.0s for slower appearance
            confetti.style.backgroundColor = getRandomColor();
            celebrationContainer.appendChild(confetti);
        }
    }
    
    // Show the celebration
    document.querySelector('.celebration-container').classList.add('active');
    
    // Automatically stop celebration after 5 seconds
    setTimeout(stopCelebration, 7000);
}

// Stop the celebration animation
function stopCelebration() {
    const celebrationContainer = document.querySelector('.celebration-container');
    if (celebrationContainer) {
        celebrationContainer.classList.remove('active');
    }
}

// Helper function to generate random colors for confetti
function getRandomColor() {
    const colors = [
        '#ff0000', '#00ff00', '#0000ff', '#ffff00', 
        '#ff00ff', '#00ffff', '#ff8000', '#8000ff'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}