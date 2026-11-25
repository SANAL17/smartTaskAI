const mongoose = require("mongoose");
const Tasks = require("../models/Task");

const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      startDate,
      dueDate,
      completedDate,
      user,
    } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Title is required",
      });
    }

    if (!user || !mongoose.Types.ObjectId.isValid(user)) {
      return res.status(400).json({
        message: "A valid user ID is required",
      });
    }

    const newTask = await Tasks.create({
      title,
      description,
      status,
      priority,
      startDate: startDate || Date.now(),
      dueDate,
      completedDate,
      user,
    });

    res.status(201).json({
      message: "Task Created Successfull",
      task: newTask,
    });
  } catch (error) {
    res.status(501).json({
      message: "Error in creating task",
      error: error.message,
    });
  }
};

const getAllTasks = async (req, res) => {
  try {
    const { user } = req.body;

    if (!user || !mongoose.Types.ObjectId.isValid(user)) {
      return res.status(400).json({
        message: "A valid user ID is required",
      });
    }

    const tasks = await Tasks.find({ user }).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Tasks fetched successfully",
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching all tasks",
      error: error.message,
    });
  }
};

const getOneTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    if (taskId) {
      const task = await Tasks.findById(taskId);
      res.status(200).json({
        messgae: "Task get successfull",
        task: task,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "error in get one task",
      error: err.message,
    });
  }
};

const deleteOneTask = async (req, res) => {
  try {
    const deleteTask = await Tasks.findByIdAndDelete(req.params.id);
    if (!deleteTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }
    res.status(200).json({
      message: "Task deleted successfully",
      task: deleteTask,
    });
  } catch (err) {
    res.status(500).json({
      message: "error in delete",
      error: err.message,
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      startDate,
      dueDate,
      completedDate,
    } = req.body;
    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (status !== undefined) updates.status = status;
    if (priority !== undefined) updates.priority = priority;
    if (startDate !== undefined) updates.startDate = startDate || new Date();
    if (dueDate !== undefined) updates.dueDate = dueDate;
    if (completedDate !== undefined) updates.completedDate = completedDate;

    const updated = await Tasks.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json({
      message: "Task updated successfully",
      task: updated,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error in update",
      error: err.message,
    });
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getOneTask,
  deleteOneTask,
  updateTask,
};
