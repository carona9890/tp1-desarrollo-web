// Referencias al DOM
const form = document.getElementById('todo-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const validationMsg = document.getElementById('validation-msg');

// Estado de la aplicación (Persistencia: Leer de localStorage)
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Función para guardar en LocalStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// READ: Función para renderizar las tareas en el DOM
function renderTasks() {
    taskList.innerHTML = '';
    
    tasks.forEach((task) => {
        const li = document.createElement('li');
        if (task.completed) li.classList.add('completed');

        li.innerHTML = `
            <span class="task-text" onclick="toggleComplete(${task.id})">${task.text}</span>
            <div class="actions">
                <button class="btn-edit" onclick="editTask(${task.id})">Editar</button>
                <button class="btn-delete" onclick="deleteTask(${task.id})">Borrar</button>
            </div>
        `;
        taskList.appendChild(li);
    });
}

// VALIDACIÓN: Comprobar que el input es válido
function validateInput(text) {
    if (text.trim() === '') {
        return 'La tarea no puede estar vacía.';
    }
    if (text.trim().length < 3) {
        return 'La tarea debe tener al menos 3 caracteres.';
    }
    return null; // Nulo significa que no hay errores
}

// CREATE: Función para añadir una tarea
form.addEventListener('submit', function(e) {
    e.preventDefault(); // Evitar que la página se recargue
    const text = taskInput.value;

    // Ejecutar validación
    const error = validateInput(text);
    if (error) {
        validationMsg.textContent = error;
        validationMsg.style.display = 'block';
        return;
    }

    // Ocultar mensaje de error si todo está bien
    validationMsg.style.display = 'none';

    // Crear nueva tarea
    const newTask = {
        id: Date.now(), // ID único basado en el tiempo
        text: text.trim(),
        completed: false
    };

    tasks.push(newTask);
    taskInput.value = ''; // Limpiar input
    
    saveTasks();
    renderTasks();
});

// UPDATE: Función para marcar como completada
function toggleComplete(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    saveTasks();
    renderTasks();
}

// UPDATE: Función para editar el texto de la tarea
function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const newText = prompt('Edita tu tarea:', task.text);
    
    if (newText !== null) {
        const error = validateInput(newText);
        if (error) {
            alert(error); // Validación mediante alerta rápida en la edición
            return;
        }
        
        tasks = tasks.map(t => {
            if (t.id === id) {
                return { ...t, text: newText.trim() };
            }
            return t;
        });
        
        saveTasks();
        renderTasks();
    }
}

// DELETE: Función para borrar una tarea
function deleteTask(id) {
    if(confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
    }
}

// Inicializar la aplicación mostrando las tareas guardadas
renderTasks();