
const express = require("express");

const router = express.Router();

const {
    generateTask,
} = require("../controllers/aiController");

// Generate a task using AI
router.post("/generate-task", generateTask);

module.exports = router;
