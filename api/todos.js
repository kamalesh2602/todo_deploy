import dbConnect from "../lib/db.js";
import Todo from "../models/todo.js";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    const { name } = req.query;
    try {
      const todos = await Todo.find({ name });
      return res.json(todos);
    } catch {
      return res.status(500).json({ message: "Failed to fetch todos" });
    }
  }

  if (req.method === "POST") {
    const { name, task } = req.body;
    if (!name || !task) return res.status(400).json({ message: "Name and task required" });

    try {
      const todo = new Todo({ name, task });
      await todo.save();
      return res.status(201).json(todo);
    } catch {
      return res.status(500).json({ message: "Failed to create todo" });
    }
  }

  if (req.method === "PATCH") {
    const { id } = req.query;
    try {
      const updated = await Todo.findByIdAndUpdate(id, { completed: true }, { new: true });
      return res.json(updated);
    } catch {
      return res.status(500).json({ message: "Failed to update todo" });
    }
  }

  if (req.method === "DELETE") {
    const { id } = req.query;
    try {
      await Todo.findByIdAndDelete(id);
      return res.json({ message: "Todo deleted" });
    } catch {
      return res.status(500).json({ message: "Failed to delete todo" });
    }
  }

  res.status(405).json({ message: "Method not allowed" });
}
