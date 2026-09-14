// ==========================================
// TASKFLOW - CHAT TO-DO APP
// ==========================================


// Get elements
const taskInput = document.getElementById("taskInput");
const taskArea = document.getElementById("taskArea");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");


// ==========================================
// DATA
// ==========================================

let tasks = JSON.parse(localStorage.getItem("taskflowTasks")) || [];

let currentFilter = "all";


// ==========================================
// SAVE TASKS
// ==========================================

function saveTasks() {

    localStorage.setItem(
        "taskflowTasks",
        JSON.stringify(tasks)
    );

}


// ==========================================
// ADD TASK
// ==========================================

function addTask() {

    const text = taskInput.value.trim();

    if (text === "") {

        showToast("Please enter a task!");

        taskInput.focus();

        return;
    }


    const task = {

        id: Date.now(),

        text: text,

        completed: false,

        createdAt: new Date().toLocaleString()

    };


    tasks.unshift(task);


    saveTasks();


    taskInput.value = "";


    renderTasks();


    showToast("Task added successfully!");


    taskInput.focus();

}


// ==========================================
// ENTER KEY
// ==========================================

taskInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {

        addTask();

    }

});


// ==========================================
// DISPLAY TASKS
// ==========================================

function renderTasks() {

    taskArea.innerHTML = "";


    let filteredTasks = tasks;


    // Filter
    if (currentFilter === "pending") {

        filteredTasks = tasks.filter(
            task => !task.completed
        );

    }


    if (currentFilter === "completed") {

        filteredTasks = tasks.filter(
            task => task.completed
        );

    }


    // Search
    const searchText =
        searchInput.value.toLowerCase().trim();


    if (searchText !== "") {

        filteredTasks = filteredTasks.filter(
            task =>
                task.text
                    .toLowerCase()
                    .includes(searchText)
        );

    }


    // Empty state
    if (filteredTasks.length === 0) {

        emptyState.style.display = "block";

    } else {

        emptyState.style.display = "none";

    }


    // Create task elements
    filteredTasks.forEach(task => {

        const taskElement =
            document.createElement("div");


        taskElement.className =
            "task";


        if (task.completed) {

            taskElement.classList.add("completed");

        }


        taskElement.innerHTML = `

            <div
                class="task-checkbox"
                onclick="toggleTask(${task.id})"
            >
                ${task.completed ? "✓" : ""}
            </div>


            <div class="task-text">
                ${escapeHTML(task.text)}
            </div>


            <div class="task-time">
                ${task.createdAt}
            </div>


            <button
                class="delete-btn"
                onclick="deleteTask(${task.id})"
                title="Delete task"
            >
                🗑️
            </button>

        `;


        taskArea.appendChild(taskElement);

    });


    updateStats();

}


// ==========================================
// TOGGLE TASK
// ==========================================

function toggleTask(id) {

    const task =
        tasks.find(task => task.id === id);


    if (!task) return;


    task.completed = !task.completed;


    saveTasks();


    renderTasks();


    if (task.completed) {

        showToast("Task completed! 🎉");

    } else {

        showToast("Task moved to pending.");

    }

}


// ==========================================
// DELETE TASK
// ==========================================

function deleteTask(id) {

    const confirmed =
        confirm("Delete this task?");


    if (!confirmed) return;


    tasks =
        tasks.filter(task => task.id !== id);


    saveTasks();


    renderTasks();


    showToast("Task deleted.");

}


// ==========================================
// CLEAR ALL
// ==========================================

function clearAllTasks() {

    if (tasks.length === 0) {

        showToast("There are no tasks to clear.");

        return;

    }


    const confirmed =
        confirm(
            "Are you sure you want to delete all tasks?"
        );


    if (!confirmed) return;


    tasks = [];


    saveTasks();


    renderTasks();


    showToast("All tasks deleted.");

}


// ==========================================
// FILTER - ALL
// ==========================================

function showAllTasks() {

    currentFilter = "all";

    document.getElementById("pageTitle")
        .textContent = "My Tasks";


    updateActiveMenu(0);

    renderTasks();

}


// ==========================================
// FILTER - PENDING
// ==========================================

function showPendingTasks() {

    currentFilter = "pending";

    document.getElementById("pageTitle")
        .textContent = "Pending Tasks";


    updateActiveMenu(1);

    renderTasks();

}


// ==========================================
// FILTER - COMPLETED
// ==========================================

function showCompletedTasks() {

    currentFilter = "completed";

    document.getElementById("pageTitle")
        .textContent = "Completed Tasks";


    updateActiveMenu(2);

    renderTasks();

}


// ==========================================
// ACTIVE SIDEBAR MENU
// ==========================================

function updateActiveMenu(index) {

    const buttons =
        document.querySelectorAll(
            ".sidebar-menu .menu-item"
        );


    buttons.forEach(button => {

        button.classList.remove("active");

    });


    if (buttons[index]) {

        buttons[index].classList.add("active");

    }

}


// ==========================================
// SEARCH
// ==========================================

function searchTasks() {

    renderTasks();

}


// ==========================================
// STATISTICS
// ==========================================

function updateStats() {

    const total = tasks.length;


    const completed =
        tasks.filter(
            task => task.completed
        ).length;


    const pending =
        total - completed;


    document.getElementById("totalTasks")
        .textContent = total;


    document.getElementById("pendingTasks")
        .textContent = pending;


    document.getElementById("completedTasks")
        .textContent = completed;


    document.getElementById("allCount")
        .textContent = total;


    document.getElementById("pendingCount")
        .textContent = pending;


    document.getElementById("completedCount")
        .textContent = completed;

}


// ==========================================
// DARK MODE
// ==========================================

function toggleTheme() {

    document.body.classList.toggle("dark");


    const isDark =
        document.body.classList.contains("dark");


    localStorage.setItem(
        "taskflowDarkMode",
        isDark
    );


    document.getElementById("themeIcon")
        .textContent =
        isDark ? "☀️" : "🌙";


    showToast(
        isDark
            ? "Dark mode enabled."
            : "Light mode enabled."
    );

}


// ==========================================
// LOAD THEME
// ==========================================

function loadTheme() {

    const darkMode =
        localStorage.getItem("taskflowDarkMode");


    if (darkMode === "true") {

        document.body.classList.add("dark");

        document.getElementById("themeIcon")
            .textContent = "☀️";

    }

}


// ==========================================
// DATE
// ==========================================

function showDate() {

    const today = new Date();


    const options = {

        weekday: "long",

        year: "numeric",

        month: "long",

        day: "numeric"

    };


    document.getElementById("dateText")
        .textContent =
        today.toLocaleDateString(
            "en-US",
            options
        );

}


// ==========================================
// TOAST MESSAGE
// ==========================================

function showToast(message) {

    const toast =
        document.getElementById("toast");


    toast.textContent = message;


    toast.classList.add("show");


    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}


// ==========================================
// INFORMATION BUTTON
// ==========================================

function showInfo() {

    showToast(
        "Type your task in the message box."
    );

}


// ==========================================
// SECURITY
// ==========================================

function escapeHTML(text) {

    const div =
        document.createElement("div");


    div.textContent = text;


    return div.innerHTML;

}


// ==========================================
// INITIALIZE APP
// ==========================================

loadTheme();

showDate();

renderTasks();

taskInput.focus();