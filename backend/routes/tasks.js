
const express = require('express');
const Task = require('../models/Task');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all tasks for the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId }).sort({ order: 1 });
    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new task
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, category, priority, dueDate, completed } = req.body;
    
    // Get the highest order value for the user's tasks
    const highestOrderTask = await Task.findOne({ userId: req.userId }).sort('-order');
    const order = highestOrderTask ? highestOrderTask.order + 1 : 0;
    
    const task = new Task({
      userId: req.userId,
      title,
      description,
      category,
      priority,
      dueDate,
      completed,
      order
    });
    
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific task
router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.userId });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json(task);
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a task
router.put('/:id', auth, async (req, res) => {
  try {
    const updates = req.body;
    
    // Make sure the user can't update the userId
    delete updates.userId;
    
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      updates,
      { new: true }
    );
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json(task);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update task ordering
router.post('/reorder', auth, async (req, res) => {
  try {
    const { tasks } = req.body;
    
    // Validate the tasks array
    if (!Array.isArray(tasks)) {
      return res.status(400).json({ message: 'Tasks must be an array' });
    }
    
    // Update the order of each task
    const updatePromises = tasks.map((task, index) => {
      return Task.findOneAndUpdate(
        { _id: task.id, userId: req.userId },
        { order: index },
        { new: true }
      );
    });
    
    await Promise.all(updatePromises);
    
    res.json({ message: 'Tasks reordered successfully' });
  } catch (error) {
    console.error('Reorder tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
