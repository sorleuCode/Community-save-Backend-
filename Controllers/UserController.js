const jwt = require('jsonwebtoken');
const User = require("../models/UserModel");
const paystack = require("../utils/paystack")



// User registration
const userRegister = async (req, res) => {
    const { fullname, email, password, bankName, accountNumber, bankCode } = req.body;
    try {
        const paystackCustomerId = await paystack.createCustomer(email, fullname, '');

        const user = new User({
            fullname,
            email,
            password,
            paystackCustomerId,
            bankDetails: {
                bankName,
                accountNumber,
                bankCode,
            },
        });
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// User login
const userLogin = async (req, res) => {
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