const mongoose = require('mongoose');
const ExpenseSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    amount: Number,
    description: String,
    category: String,
    date: String,
    type: String,
});
module.exports = mongoose.model('Expense', ExpenseSchema);