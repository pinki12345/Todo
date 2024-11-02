const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ["BACKLOG", "TO-DO", "PROGRESS", "DONE"],
    default: "TO-DO",
  },
  assign: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  priority: {
    type: String,
    enum: ["LOW PRIORITY", "MODERATE PRIORITY", "HIGH PRIORITY"],
    required: true,
  },
  dueDate: {
    type: Date,
    default: null,
  },
  checklist: [
    {
      text: {
        type: String,
        required: true,
        trim: true,
      },
      completed: {
        type: Boolean,
        default: false,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
