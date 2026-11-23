const express = require("express");
const router = express.Router();

const { createTask, getAllTasks, getOneTask, deleteOneTask, updateTask } = require("../controllers/taskController");

router.post("/create-task", createTask);
router.post("/getAllTasks", getAllTasks);
router.post("/getOneTask/:id", getOneTask)
router.post("/delete/:id", deleteOneTask)
router.post("/update-task/:id", updateTask)

module.exports = router;
