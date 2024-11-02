const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/user");
const {
  createTask,
  getAllTasks,
  getAndUpdateTaskStatus,
  updateChecklistItem,
  deleteTask,
  filterJobsByTimeframe,
  updateTask,
  getTaskById,
  countTasks
} = require("../controllers/task");

router.post("/create", authMiddleware, createTask);
router.get("/getAllTasks", authMiddleware, getAllTasks);
router.put("/getAndUpdateTaskStatus", authMiddleware, getAndUpdateTaskStatus);
router.delete('/tasks/:id',deleteTask);
router.put("/tasks/:taskId/checklist/:index", updateChecklistItem);
router.get("/tasks/filter/:timeframe",authMiddleware, filterJobsByTimeframe);
router.put('/updateTask/:taskId', updateTask);
router.get('/getTaskById/:id', getTaskById);
router.get('/count',authMiddleware,countTasks);




module.exports = router;
