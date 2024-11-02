const User = require("../models/user");
const BoardAccess = require("../models/board");

const shareBoardWithUser = async (req, res) => {
  try {
    const { boardId, userId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const boardAccess = await BoardAccess.findOne({ _id: boardId });
    if (!boardAccess) {
      return res.status(404).json({ message: "Board not found" });
    }

    if (!boardAccess.users.includes(userId)) {
      boardAccess.users.push(userId);
      await boardAccess.save();
      return res
        .status(200)
        .json({ message: `Board ${boardId} shared with user: ${userId}` });
    } else {
      return res
        .status(400)
        .json({ message: "User already has access to this board." });
    }
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};

module.exports = {
  shareBoardWithUser,
};
