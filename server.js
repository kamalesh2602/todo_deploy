require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully.'))
  .catch(err => console.error('Mongoose connection failed:', err));

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
});
const User = mongoose.model('User', userSchema);

// Todo Schema
const todoSchema = new mongoose.Schema({
  name: { type: String, required: true },      // username
  task: { type: String, required: true },
  completed: { type: Boolean, default: false }
});
const Todo = mongoose.model('Todo', todoSchema);

// User routes
app.post('/api/register', async (req, res) => {
  const { name, password } = req.body;
  if (!name || !password) return res.status(400).json({ message: 'Name and password required' });
  try {
    if (await User.findOne({ name })) return res.status(409).json({ message: 'User exists' });
    await new User({ name, password }).save();
    res.status(201).json({ message: 'User registered' });
  } catch { res.status(500).json({ message: 'Server error' }); }
});

app.post('/api/login', async (req, res) => {
  const { name, password } = req.body;
  if (!name || !password) return res.status(400).json({ message: 'Name and password required' });
  try {
    const user = await User.findOne({ name, password });
    if (user) res.status(200).json({ message: 'Login successful' });
    else res.status(401).json({ message: 'Invalid credentials' });
  } catch { res.status(500).json({ message: 'Server error' }); }
});

// Todo routes
app.get('/api/todos/:name', async (req, res) => {
  try {
    const todos = await Todo.find({ name: req.params.name });
    res.json(todos);
  } catch { res.status(500).json({ message: 'Failed to fetch todos.' }); }
});

app.post('/api/todos', async (req, res) => {
  const { name, task } = req.body;
  if (!name || !task) return res.status(400).json({ message: 'Name and task required' });
  try {
    const todo = new Todo({ name, task });
    await todo.save();
    res.status(201).json(todo);
  } catch { res.status(500).json({ message: 'Failed to create todo.' }); }
});

app.patch('/api/todos/:id', async (req, res) => {
  try {
    const updated = await Todo.findByIdAndUpdate(req.params.id, { completed: true }, { new: true });
    res.json(updated);
  } catch { res.status(500).json({ message: 'Failed to update todo.' }); }
});

app.delete('/api/todos/:id', async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Todo deleted.' });
  } catch { res.status(500).json({ message: 'Failed to delete todo.' }); }
});

// Start server
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
