
const readline = require("readline");
const fs = require("fs");
const path = require("path");

const FILE_PATH = path.join(__dirname, "tasks.json");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((res) => rl.question(q, res));

class Task {
  constructor(id, title, description, status = "Pending") {
    this.id = id;
    this.title = title;
    this.description = description;
    this.status = status;
    this.createdAt = new Date().toLocaleString();
  }
}

// ── FILE OPERATIONS
function loadTasks() {
  try {
    if (!fs.existsSync(FILE_PATH)) return { tasks: [], nextId: 1 };
    const data = fs.readFileSync(FILE_PATH, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.log("⚠️  Error loading tasks file. Starting fresh.");
    return { tasks: [], nextId: 1 };
  }
}

function saveTasks(tasks, nextId) {
  try {
    fs.writeFileSync(FILE_PATH, JSON.stringify({ tasks, nextId }, null, 2), "utf-8");
    console.log("💾 Tasks saved to file.");
  } catch (err) {
    console.log("❌ Error saving tasks:", err.message);
  }
}

// Load existing data on startup
let { tasks, nextId } = loadTasks();

// ── CRUD OPERATIONS
async function createTask() {
  console.log("\n── Create New Task ──");
  const title = await ask("Title: ");
  const description = await ask("Description: ");
  const task = new Task(nextId++, title.trim(), description.trim());
  tasks.push(task);
  saveTasks(tasks, nextId);
  console.log(`✅ Task #${task.id} "${task.title}" created and saved!`);
}

function readTasks() {
  console.log("\n── All Tasks ──");
  if (tasks.length === 0) {
    console.log("No tasks found.");
    return;
  }
  tasks.forEach((t) => {
    console.log(`\n[#${t.id}] ${t.title}`);
    console.log(`   📝 ${t.description}`);
    console.log(`   🔖 Status: ${t.status}`);
    console.log(`   🕐 Created: ${t.createdAt}`);
  });
  console.log(`\nTotal: ${tasks.length} task(s)`);
}

async function updateTask() {
  console.log("\n── Update Task ──");
  readTasks();
  if (tasks.length === 0) return;

  const id = parseInt(await ask("\nEnter Task ID to update: "));
  const task = tasks.find((t) => t.id === id);
  if (!task) { console.log("❌ Task not found!"); return; }

  console.log(`\nEditing: "${task.title}" (press Enter to keep current)`);
  const newTitle = await ask(`New Title [${task.title}]: `);
  const newDesc = await ask(`New Description [${task.description}]: `);
  console.log("Status options: Pending | In Progress | Completed");
  const newStatus = await ask(`New Status [${task.status}]: `);

  if (newTitle.trim()) task.title = newTitle.trim();
  if (newDesc.trim()) task.description = newDesc.trim();
  if (newStatus.trim()) task.status = newStatus.trim();

  saveTasks(tasks, nextId);
  console.log(`✅ Task #${id} updated and saved!`);
}

async function deleteTask() {
  console.log("\n── Delete Task ──");
  readTasks();
  if (tasks.length === 0) return;

  const id = parseInt(await ask("\nEnter Task ID to delete: "));
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) { console.log("❌ Task not found!"); return; }

  const confirm = await ask(`Delete "${tasks[index].title}"? (y/n): `);
  if (confirm.toLowerCase() === "y") {
    tasks.splice(index, 1);
    saveTasks(tasks, nextId);
    console.log(`✅ Task #${id} deleted and file updated!`);
  } else {
    console.log("Cancelled.");
  }
}

// ── MAIN MENU
async function menu() {
  console.log("\n====================================");
  console.log("  TASK MANAGER WITH FILE STORAGE    ");
  console.log("====================================");
  console.log(`📂 Data file: ${FILE_PATH}`);
  console.log(`📋 Loaded ${tasks.length} existing task(s).`);

  while (true) {
    console.log("\n📋 MENU:");
    console.log("  1. Create Task");
    console.log("  2. View All Tasks");
    console.log("  3. Update Task");
    console.log("  4. Delete Task");
    console.log("  5. Exit");

    const choice = await ask("\nChoose (1-5): ");
    switch (choice.trim()) {
      case "1": await createTask(); break;
      case "2": readTasks(); break;
      case "3": await updateTask(); break;
      case "4": await deleteTask(); break;
      case "5":
        console.log("\n👋 All data saved. Goodbye!");
        rl.close();
        process.exit(0);
      default:
        console.log("❌ Invalid option.");
    }
  }
}

menu();
