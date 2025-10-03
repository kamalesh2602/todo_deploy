import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema({
  name: { type: String, required: true },   // user name
  task: { type: String, required: true },
  completed: { type: Boolean, default: false }
});

export default mongoose.models.Todo || mongoose.model("Todo", TodoSchema);
