const Task = require("../models/task");
const User = require("../models/user");

const createTask = async (req, res) => {
  try {
    const userId = req.user._id;
    const { title, status, priority, dueDate, checklist, assignedUsers } =
      req.body;
    if (!title || !priority) {
      return res
        .status(400)
        .json({ message: "Title and priority are required." });
    }
    const newTask = new Task({
      title,
      status,
      priority,
      dueDate,
      checklist,
      assign: assignedUsers || [],
    });
    await newTask.save();
    await User.findByIdAndUpdate(userId, {
      $push: { tasksCreated: newTask._id },
    });
    if (Array.isArray(assignedUsers) && assignedUsers.length > 0) {
      await Promise.all(
        assignedUsers.map(async (assignedUserId) => {
          await User.findByIdAndUpdate(assignedUserId, {
            $addToSet: { tasksAssigned: newTask._id },
          });
        })
      );
    }
    return res.status(201).json({
      message: "Task created successfully.",
      task: newTask,
    });
  } catch (error) {
    console.error("Error creating task:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const getAllTasks = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).populate("tasksCreated");

    const createdTasks = await Task.find({
      _id: { $in: user.tasksCreated },
    }).populate({
      path: "assign",
      select: "email",
    });

    const response = {
      success: true,
      createdTasks: createdTasks || [],
      assignedTasks: user?.tasksAssigned || [],
    };

    if (
      !user ||
      (user.tasksCreated.length === 0 && user.tasksAssigned.length === 0)
    ) {
      response.message = "No tasks found for this user.";
    }

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

const getAndUpdateTaskStatus = async (req, res) => {
  const { jobId, status } = req.body;
  try {
    const validStatuses = ["BACKLOG", "TO-DO", "PROGRESS", "DONE"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status provided" });
    }
    const updatedTask = await Task.findOneAndUpdate(
      { _id: jobId },
      { status: status },
      { new: true }
    );

    if (!updatedTask) {
      return res
        .status(404)
        .json({ message: "Task not found for the given jobId" });
    }
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Error updating task status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateChecklistItem = async (req, res) => {
  const { taskId, index } = req.params;
  const { completed } = req.body;
  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    if (index < 0 || index >= task.checklist.length) {
      return res.status(400).json({ message: "Invalid checklist item index" });
    }
    task.checklist[index].completed = completed;
    await task.save();
    res.status(200).json({ message: "Checklist item updated", task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    await User.updateMany(
      {
        $or: [{ tasksCreated: id }, { tasksAssigned: id }],
      },
      {
        $pull: { tasksCreated: id, tasksAssigned: id },
      }
    );
    res
      .status(200)
      .json({ message: "Task deleted successfully and references removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const getDateRange = (timeframe) => {
  const now = new Date();
  let start, end;

  switch (timeframe) {
    case "today":
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      break;
    case "thisWeek":
      const firstDayOfWeek = now.getDate() - now.getDay();
      start = new Date(now.getFullYear(), now.getMonth(), firstDayOfWeek);
      end = new Date(now.getFullYear(), now.getMonth(), firstDayOfWeek + 7);
      break;
    case "thisMonth":
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      break;
    default:
      throw new Error("Invalid timeframe");
  }

  return { start, end };
};

const filterJobsByTimeframe = async (req, res) => {
  const { timeframe } = req.params;
  const { start, end } = getDateRange(timeframe);
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate("tasksCreated");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const createdTasks = await Task.find({
      _id: { $in: user.tasksCreated },
      createdAt: { $gte: start, $lte: end },
    }).populate({
      path: "assign",
      select: "email",
    });
    const assignedTasks = await Task.find({
      _id: { $in: user.tasksAssigned },
      createdAt: { $gte: start, $lte: end },
    }).populate({
      path: "assign",
      select: "email",
    });

    const response = {
      success: true,
      createdTasks: createdTasks || [],
      assignedTasks: assignedTasks || [],
    };

    if (createdTasks.length === 0 && assignedTasks.length === 0) {
      response.message =
        "No tasks found for this user in the specified timeframe.";
    }

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res
      .status(500)
      .json({ success: false, message: "Error retrieving tasks", error });
  }
};

const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, status, priority, dueDate, checklist, assignedUsers } =
      req.body;
    console.log("assignedUsers______", assignedUsers);
    const existingTask = await Task.findById(taskId);
    if (!existingTask) {
      return res.status(404).json({ message: "Task not found." });
    }
    if (title !== undefined) existingTask.title = title;
    if (status !== undefined) existingTask.status = status;
    if (priority !== undefined) existingTask.priority = priority;
    if (dueDate !== undefined) existingTask.dueDate = dueDate;
    if (checklist !== undefined) existingTask.checklist = checklist;
    if (assignedUsers !== undefined) {
      await Promise.all(
        existingTask.assign.map(async (oldUserId) => {
          await User.findByIdAndUpdate(oldUserId, {
            $pull: { tasksAssigned: existingTask._id },
          });
        })
      );
      await Promise.all(
        assignedUsers.map(async (assignedUserId) => {
          await User.findByIdAndUpdate(assignedUserId, {
            $addToSet: { tasksAssigned: existingTask._id },
          });
        })
      );
      existingTask.assign = assignedUsers;
    }

    await existingTask.save();

    return res.status(200).json({
      message: "Task updated successfully.",
      task: existingTask,
    });
  } catch (error) {
    console.error("Error updating task:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const getTaskById = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(task);
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const countTasks = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId)
      .populate("tasksCreated")
      .populate("tasksAssigned");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const statuses = ["BACKLOG", "TO-DO", "PROGRESS", "DONE"];
    const taskCounts = {
      BACKLOG: 0,
      "TO-DO": 0,
      PROGRESS: 0,
      DONE: 0,
      "HIGH PRIORITY": 0,
      "MODERATE PRIORITY": 0,
      "LOW PRIORITY": 0,
      DUE_DATE_SET: 0,
    };

    for (const status of statuses) {
      const count = await Task.countDocuments({
        $or: [
          { _id: { $in: user.tasksCreated }, status },
          { _id: { $in: user.tasksAssigned }, status },
        ],
      });
      taskCounts[status] = count;
    }

    for (const priority of ["HIGH PRIORITY", "MODERATE PRIORITY", "LOW PRIORITY"]) {
      const count = await Task.countDocuments({
        $or: [
          { _id: { $in: user.tasksCreated }, priority },
          { _id: { $in: user.tasksAssigned }, priority },
        ],
      });
      taskCounts[priority] = count;
    }

    const dueDateCount = await Task.countDocuments({
      $or: [
        {
          _id: { $in: user.tasksCreated },
          dueDate: { $ne: null },
          status: { $ne: "DONE" }, 
          dueDate: { $lt: new Date() }, 
        },
        {
          _id: { $in: user.tasksAssigned },
          dueDate: { $ne: null },
          status: { $ne: "DONE" },  
          dueDate: { $lt: new Date() }, 
        },
      ],
    });
    
    taskCounts.DUE_DATE_SET = dueDateCount;

    const response = {
      success: true,
      taskCounts,
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred while counting tasks." });
  }
};



module.exports = {
  createTask,
  deleteTask,
  getAllTasks,
  getAndUpdateTaskStatus,
  updateChecklistItem,
  filterJobsByTimeframe,
  updateTask,
  getTaskById,
  countTasks,
};
