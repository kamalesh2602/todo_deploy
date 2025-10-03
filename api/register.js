import dbConnect from "../lib/db.js";
import User from "../models/user.js";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    const { name, password } = req.body;
    if (!name || !password) {
      return res.status(400).json({ message: "Name and password required" });
    }

    try {
      const existing = await User.findOne({ name });
      if (existing) {
        return res.status(409).json({ message: "User already exists" });
      }
      await new User({ name, password }).save();
      return res.status(201).json({ message: "User registered" });
    } catch {
      return res.status(500).json({ message: "Server error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
