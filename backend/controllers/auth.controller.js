const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = new User({ name, email, password });
        await user.save();

        const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
        res.status(201).json({ user, token });
    } catch (error) {
        console.error('Signup Error:', error);
        res.status(400).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid login credentials' });
        }

        const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
        res.json({ user, token });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(400).json({ error: error.message });
    }
};

exports.getProfile = async (req, res) => {
    res.json(req.user);
};
