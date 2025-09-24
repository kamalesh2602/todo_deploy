document.addEventListener('DOMContentLoaded', () => {
  const username = localStorage.getItem("username");
  if (!username) {
    alert("No user found. Please login first.");
    return;
  }

  document.querySelector('header h1').textContent = `Welcome ${username}`;

  const todoList = document.getElementById('todoList');
  const completedList = document.getElementById('completedList');
  const addTodoForm = document.getElementById('addTodoForm');
  const taskInput = document.getElementById('taskInput');

  // Fetch and display todos
  async function fetchTodos() {
    try {
      const res = await fetch(`https://tododeplo.netlify.app//api/todos/${username}`);
      if (!res.ok) throw new Error("Failed to fetch todos");

      const todos = await res.json();
      if (!Array.isArray(todos)) throw new Error("Invalid todos data");

      todoList.innerHTML = '';
      completedList.innerHTML = '';

      todos.forEach(todo => {
        const li = document.createElement('li');
        li.textContent = todo.task + " ";

        if (todo.completed) {
          // Delete button
          const delBtn = document.createElement('button');
          delBtn.textContent = 'Delete';
          delBtn.addEventListener('click', async () => {
            await fetch(`https://tododeplo.netlify.app//api/todos/${todo._id}`, { method: 'DELETE' });
            fetchTodos();
          });
          li.appendChild(delBtn);
          completedList.appendChild(li);
        } else {
          // Complete button
          const completeBtn = document.createElement('button');
          completeBtn.textContent = 'Complete';
          completeBtn.addEventListener('click', async () => {
            await fetch(`https://tododeplo.netlify.app//api/todos/${todo._id}`, { method: 'PATCH' });
            fetchTodos();
          });
          li.appendChild(completeBtn);
          todoList.appendChild(li);
        }
      });

    } catch (err) {
      console.error(err);
    }
  }

  fetchTodos();

  // Add new todo
  addTodoForm.addEventListener('submit', async e => {
    e.preventDefault();
    const task = taskInput.value.trim();
    if (!task) return;

    try {
      await fetch('https://tododeplo.netlify.app//api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: username, task })
      });
      taskInput.value = '';
      fetchTodos();
    } catch (err) {
      console.error(err);
    }
  });
});
