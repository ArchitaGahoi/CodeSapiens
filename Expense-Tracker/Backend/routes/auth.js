const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/signup', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.send(user);
    } catch (err) {
        res.status(400).send({ error: 'Email may already be in use' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (user) res.send(user);
    else res.status(401).send({ error: 'Invalid credentials' });
});

module.exports = router;