const mongoose = require("mongoose");

const boardAccessSchema = new mongoose.Schema({
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ]
}, { timestamps: true }); 

const Board = mongoose.model("Board", boardAccessSchema);
module.exports = Board;

