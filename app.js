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
    allTodos.forEach((todo, todoIndex)=>{
        let todoItem = createTodoItem(todo, todoIndex);
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