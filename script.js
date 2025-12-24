// Select DOM elements
const taskInput = document.getElementById('taskInput');
const categoryInput = document.getElementById('categoryInput');
const dateInput = document.getElementById('dateInput');
const filterSelect = document.getElementById('filterSelect');
const taskList = document.getElementById('taskList');

// Load tasks from LocalStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// --- HELPER FUNCTIONS ---

function saveLocal() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function isOverdue(dateString) {
    if (!dateString) return false; 
    const today = new Date().toISOString().split('T')[0];
    return dateString < today;
}

function isToday(dateString) {
    const today = new Date().toISOString().split('T')[0];
    return dateString === today;
}

// --- CORE FUNCTIONS ---

function renderTasks() {
    taskList.innerHTML = ''; 
    const filterValue = filterSelect.value; 

    tasks.forEach(task => {
        // 1. FILTERING LOGIC
        let shouldShow = false;

        if (filterValue === 'all') {
            shouldShow = true;
        } else if (filterValue === 'today') {
            shouldShow = isToday(task.date);
        } else if (filterValue === 'overdue') {
            // Only show overdue if it is NOT completed
            shouldShow = isOverdue(task.date) && !task.completed;
        } else {
            shouldShow = task.category === filterValue;
        }

        if (!shouldShow) return;

        // 2. DETERMINE STATES
        // If task is completed, it is NOT overdue visually
        const isTaskOverdue = !task.completed && isOverdue(task.date);
        
        // 3. BUILD HTML
        const li = document.createElement('li');
        
        // Add dynamic classes
        li.className = `task-item border-${task.category} ${isTaskOverdue ? 'overdue' : ''} ${task.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <div class="task-left">
                <input 
                    type="checkbox" 
                    ${task.completed ? 'checked' : ''} 
                    onchange="toggleTask(${task.id})"
                >
                <div class="task-content">
                    <span class="task-text">${task.text}</span>
                    <span class="task-meta">
                        ${task.category} • ${task.date || 'No Date'} 
                        ${isTaskOverdue ? '(Overdue!)' : ''}
                    </span>
                </div>
            </div>
            
            <button class="delete-btn" onclick="deleteTask(${task.id})">✕</button>
        `;

        taskList.appendChild(li);
    });
}

function addTask() {
    const text = taskInput.value;
    const category = categoryInput.value;
    const date = dateInput.value;

    if (text === '') {
        alert("Please enter a task!");
        return;
    }

    const newTask = {
        id: Date.now(), 
        text: text,
        category: category,
        date: date,
        completed: false // Default to false
    };

    tasks.push(newTask);
    saveLocal();
    renderTasks();

    taskInput.value = '';
    dateInput.value = '';
}

// NEW: Toggle Complete Status
function toggleTask(id) {
    // Find the task in the array
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed; // Flip true/false
        saveLocal();
        renderTasks();
    }
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveLocal();
    renderTasks();
}

function filterTasks() {
    renderTasks();
}

// Initial Render
renderTasks();

function enableSwipeToDelete(taskElement, onDelete) {
  let startX = 0;
  let currentX = 0;

  taskElement.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    taskElement.classList.add("swiping");
  });

  taskElement.addEventListener("touchmove", (e) => {
    currentX = e.touches[0].clientX;
    const diff = currentX - startX;

    if (diff < 0) {
      taskElement.style.transform = `translateX(${diff}px)`;
      taskElement.classList.add("show-delete");
    }
  });

  taskElement.addEventListener("touchend", () => {
    const diff = currentX - startX;

    taskElement.classList.remove("swiping");
    taskElement.style.transform = "";

    if (diff < -80) {
      onDelete();
    } else {
      taskElement.classList.remove("show-delete");
    }
  });
}
