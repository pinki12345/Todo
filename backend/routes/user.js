const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/user");

const {
  login,
  signup,
  getAllUsersExceptCurrent,
  updateUser
} = require("../controllers/user");

router.post("/signup", signup);
router.post("/login", login);
router.get(
  "/getAllUsersExceptCurrent",
  authMiddleware,
  getAllUsersExceptCurrent
);
router.put('/update', authMiddleware,updateUser);

module.exports = router;
