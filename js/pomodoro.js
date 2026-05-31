const timerDisplay = document.getElementById("timer");
const durationInput = document.getElementById("durationInput");

const toggleBtn = document.getElementById("toggleBtn");
const resetBtn = document.getElementById("resetBtn");

const treeImage = document.getElementById("treeImage");

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

const clickSound = new Audio("/assets/pomodoro/click.mp3");

function playClick() {
  clickSound.currentTime = 0;
  clickSound.play();
}

document.addEventListener("click", playClick);

const TOTAL_FRAMES = 8;

const treeFrames = [
  "/assets/Pomodoro/tree-1.png",
  "/assets/Pomodoro/tree-2.png",
  "/assets/Pomodoro/tree-3.png",
  "/assets/Pomodoro/tree-4.png",
  "/assets/Pomodoro/tree-5.png",
  "/assets/Pomodoro/tree-6.png",
  "/assets/Pomodoro/tree-7.png",
  "/assets/Pomodoro/tree-8.png",
];

let totalSeconds = 25 * 60;
let remainingSeconds = totalSeconds;

let timerRunning = false;
let interval = null;

function updateDisplay() {
  const mins = Math.floor(remainingSeconds / 60);
  const secs = remainingSeconds % 60;

  timerDisplay.textContent = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  updateTree();
}

function updateTree() {
  const progress = totalSeconds
    ? (totalSeconds - remainingSeconds) / totalSeconds
    : 0;

  const frame = Math.min(Math.floor(progress * TOTAL_FRAMES), TOTAL_FRAMES - 1);

  treeImage.src = treeFrames[frame];
}

function startTimer() {
  if (timerRunning) return;

  timerRunning = true;

  interval = setInterval(() => {
    if (remainingSeconds <= 0) {
      clearInterval(interval);
      timerRunning = false;

      toggleBtn.textContent = "Start";
      treeImage.src = treeFrames[TOTAL_FRAMES - 1];

      return;
    }

    remainingSeconds--;
    updateDisplay();
  }, 1000);
}

function pauseTimer() {
  clearInterval(interval);
  timerRunning = false;
}

function toggleTimer() {
  if (timerRunning) {
    pauseTimer();
    toggleBtn.textContent = "Start";
  } else {
    startTimer();
    toggleBtn.textContent = "Pause";
  }
}

function resetTimer() {
  pauseTimer();

  totalSeconds = Number(durationInput.value) * 60;
  remainingSeconds = totalSeconds;

  toggleBtn.textContent = "Start";
  updateDisplay();
}

toggleBtn.addEventListener("click", toggleTimer);
resetBtn.addEventListener("click", resetTimer);

durationInput.addEventListener("input", () => {
  if (durationInput.value > 60) durationInput.value = 60;
  if (durationInput.value < 1) durationInput.value = 1;

  const newTotal = Number(durationInput.value) * 60;

  totalSeconds = newTotal;
  remainingSeconds = newTotal;

  updateDisplay();
});

// ---------------- TASKS ----------------

function saveTasks(tasks) {
  localStorage.setItem("pomodoroTasks", JSON.stringify(tasks));
}

function getTasks() {
  return JSON.parse(localStorage.getItem("pomodoroTasks")) || [];
}

function renderTasks() {
  const tasks = getTasks();

  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "task-item";

    li.innerHTML = `
      <div class="task-left">
        <input type="checkbox"
          ${task.done ? "checked" : ""}
          data-index="${index}">
        <span class="${task.done ? "completed" : ""}">
          ${task.text}
        </span>
      </div>
      <button class="delete-btn" data-delete="${index}">×</button>
    `;

    taskList.appendChild(li);
  });
}

addTaskBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();
  if (!text) return;

  const tasks = getTasks();
  tasks.push({ text, done: false });

  saveTasks(tasks);
  renderTasks();

  taskInput.value = "";
});

taskList.addEventListener("click", (e) => {
  const tasks = getTasks();

  if (e.target.dataset.delete !== undefined) {
    tasks.splice(Number(e.target.dataset.delete), 1);
    saveTasks(tasks);
    renderTasks();
  }
});

taskList.addEventListener("change", (e) => {
  if (e.target.type === "checkbox") {
    const tasks = getTasks();
    tasks[Number(e.target.dataset.index)].done = e.target.checked;

    saveTasks(tasks);
    renderTasks();
  }
});

updateDisplay();
renderTasks();
