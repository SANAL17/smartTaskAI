
const express = require("express");
const router = express.Router();

const {
    generateTask,
    chatWithAI,
} = require("../controllers/aiController");

router.post("/generate-task", generateTask);
router.post("/chat", chatWithAI);

module.exports = router;
