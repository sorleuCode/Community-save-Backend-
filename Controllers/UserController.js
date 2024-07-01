const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require("../models/UserModel");



// User registration
const userRegister = () => async (req, res) => {
    const { name, email, password, bankName, accountNumber, routingNumber } = req.body;
    try {
        const user = new User({
            name,
            email,
            password: await bcrypt.hash(password, 10),
            bankDetails: {
                bankName,
                accountNumber,
                routingNumber,
            },
        });
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// User login
const userLogin = () => async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ id: user._id, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '1d' });
            res.json({ token, user });
        } else {
            res.status(400).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {userRegister, userLogin};