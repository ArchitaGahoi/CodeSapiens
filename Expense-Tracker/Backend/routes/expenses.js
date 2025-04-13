const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');

router.get('/:userId', async (req, res) => {
    const expenses = await Expense.find({ userId: req.params.userId });
    res.send(expenses);
});

router.post('/', async (req, res) => {
    const expense = new Expense(req.body);
    await expense.save();
    res.send(expense);
});

router.put('/:id', async (req, res) => {
    const updated = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(updated);
});

router.delete('/:id', async (req, res) => {
    await Expense.findByIdAndDelete(req.params.id);
    res.send({ success: true });
});

module.exports = router;