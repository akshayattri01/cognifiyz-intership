
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (q) => new Promise((res) => rl.question(q, res));

// Task class
class Task {
  constructor(id, title, description, status = "Pending") {
    this.id = id;
    this.title = title;
    this.description = description;
    this.status = status;
    this.createdAt = new Date().toLocaleString();
  }
}

// In-memory storage
let tasks = [];
let nextId = 1;

// ── CREATE
async function createTask() {
  console.log("\n── Create New Task ──");
  const title = await ask("Title: ");
  const description = await ask("Description: ");
  const task = new Task(nextId++, title.trim(), description.trim());
  tasks.push(task);
  console.log(`✅ Task #${task.id} "${task.title}" created!`);
}

// ── READ
function readTasks() {
  console.log("\n── All Tasks ──");
  if (tasks.length === 0) {
    console.log("No tasks found. Create one first!");
    return;
  }
  tasks.forEach((t) => {
    console.log(`\n[#${t.id}] ${t.title}`);
    console.log(`   📝 ${t.description}`);
    console.log(`   🔖 Status: ${t.status}`);
    console.log(`   🕐 Created: ${t.createdAt}`);
  });
}

// ── UPDATE
async function updateTask() {
  console.log("\n── Update Task ──");
  readTasks();
  if (tasks.length === 0) return;

  const id = parseInt(await ask("\nEnter Task ID to update: "));
  const task = tasks.find((t) => t.id === id);
  if (!task) {
    console.log("❌ Task not found!");
    return;
  }

  console.log(`\nEditing: "${task.title}" (press Enter to keep current value)`);
  const newTitle = await ask(`New Title [${task.title}]: `);
  const newDesc = await ask(`New Description [${task.description}]: `);
  console.log("Status options: Pending | In Progress | Completed");
  const newStatus = await ask(`New Status [${task.status}]: `);

  if (newTitle.trim()) task.title = newTitle.trim();
  if (newDesc.trim()) task.description = newDesc.trim();
  if (newStatus.trim()) task.status = newStatus.trim();

  console.log(`✅ Task #${id} updated!`);
}

// ── DELETE
async function deleteTask() {
  console.log("\n── Delete Task ──");
  readTasks();
  if (tasks.length === 0) return;

  const id = parseInt(await ask("\nEnter Task ID to delete: "));
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) {
    console.log("❌ Task not found!");
    return;
  }

  const confirm = await ask(`Are you sure you want to delete "${tasks[index].title}"? (y/n): `);
  if (confirm.toLowerCase() === "y") {
    tasks.splice(index, 1);
    console.log(`✅ Task #${id} deleted!`);
  } else {
    console.log("Cancelled.");
  }
}

// ── MAIN MENU
async function menu() {
  console.log("\n====================================");
  console.log("     TASK MANAGER - CRUD APP        ");
  console.log("====================================");

  while (true) {
    console.log("\n📋 MENU:");
    console.log("  1. Create Task");
    console.log("  2. View All Tasks");
    console.log("  3. Update Task");
    console.log("  4. Delete Task");
    console.log("  5. Exit");

    const choice = await ask("\nChoose an option (1-5): ");

    switch (choice.trim()) {
      case "1": await createTask(); break;
      case "2": readTasks(); break;
      case "3": await updateTask(); break;
      case "4": await deleteTask(); break;
      case "5":
        console.log("\n👋 Goodbye!");
        rl.close();
        process.exit(0);
      default:
        console.log("❌ Invalid option. Try again.");
    }
  }
}

menu();
