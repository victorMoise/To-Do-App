class Task {
    constructor(text, completed = false) {
        this.text = text;
        this.completed = completed;
    }

    markCompleted() {
        this.completed = true;
    }

    markIncomplete() {
        this.completed = false;
    }
}

const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTask");

let tasks = []; 

addTaskButton.addEventListener("click", function() {
    const taskText = taskInput.value.trim();

    if (taskText !== "") {
        const newTask = new Task(taskText);
        tasks.push(newTask);
        saveTasksToLocalStorage();
        renderTasks();
        taskInput.value = "";
    } 
});

function saveTasksToLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasksFromStorage() {
    const savedTasks = JSON.parse(localStorage.getItem("tasks"));

    if (savedTasks) {
        tasks = savedTasks.map(taskData => {
            const task = new Task(taskData.text, taskData.completed);
            return task;
        });
    }
}

function renderTasks() {
    const taskGrid = document.getElementById("taskGrid");
    taskGrid.innerHTML = ""; 

    tasks.forEach((task, index) => {
        const taskCell = document.createElement("div");
        taskCell.classList.add("task-cell");

        const taskText = document.createElement("span");
        taskText.textContent = task.text;

        const completeButton = document.createElement("button");
        completeButton.textContent = "✓";
        completeButton.classList.add("uncompleted-checkmark")

        const expandButton = document.createElement("button");
        expandButton.textContent = "...";
        expandButton.classList.add("expand-text")

        if (task.completed) {
            taskCell.classList.add("completed");
        }

        completeButton.addEventListener("click", function() {
            toggleTaskCompletion(index);
        });

        taskCell.appendChild(completeButton);
        taskCell.appendChild(taskText);
        taskGrid.appendChild(taskCell);
        taskCell.appendChild(expandButton);
    });
}

function toggleTaskCompletion(index) {
    tasks[index].completed = !tasks[index].completed;

    if (tasks[index].completed) {
        tasks.splice(index, 1);
    }

    saveTasksToLocalStorage();
    renderTasks();
}


// the reset button
const resetButton = document.getElementById("resetTasks")
const confirmationPopup = document.getElementById("confirmationPopup");
const confirmResetButton = document.getElementById("confirmReset");
const cancelResetButton = document.getElementById("cancelReset");

resetButton.addEventListener("click", function() {
    confirmationPopup.style.display = "block";
});

confirmResetButton.addEventListener("click", function() {
    tasks = [];
    saveTasksToLocalStorage();
    renderTasks();
    confirmationPopup.style.display = "none";
});

cancelResetButton.addEventListener("click", function() {
    confirmationPopup.style.display = "none";
});


// "..." expand text button
document.addEventListener("DOMContentLoaded", function () {
    const expandButtons = document.querySelectorAll(".expand-text");
    expandButtons.forEach((button, index) => {
        button.addEventListener("click", function (event) {
            event.stopPropagation();
            showTaskPopup(tasks[index].text);
        });
    });
});

function showTaskPopup(taskText) {
    const popupText = document.querySelector("#taskPopup #popupText");
    popupText.textContent = taskText;

    const taskPopup = document.getElementById("taskPopup");
    taskPopup.classList.add("show"); 
}

document.addEventListener("click", function () {
    hideTaskPopup();
});

function hideTaskPopup() {
    const taskPopup = document.getElementById("taskPopup");
    taskPopup.classList.remove("show"); 
}


// never delete these
loadTasksFromStorage();
renderTasks();