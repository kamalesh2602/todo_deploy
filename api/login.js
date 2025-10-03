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
      const user = await User.findOne({ name, password });
      if (user) return res.json({ message: "Login successful" });
      else return res.status(401).json({ message: "Invalid credentials" });
    } catch {
      return res.status(500).json({ message: "Server error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
