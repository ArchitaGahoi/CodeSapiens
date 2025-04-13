const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/expense_tracker', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/expenses', require('./routes/expenses'));

app.listen(5000, () => console.log('Server running on port 5000'));