const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/user");

const {
    shareBoardWithUser
} = require("../controllers/board");


router.post(
  "/shareBoard",
  authMiddleware,
  shareBoardWithUser
);


module.exports = router;
