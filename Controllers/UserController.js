

const Thrift = require('../models/ThriftModel');
const User = require('../models/UserModel');
const paystack = require('../paystack');


// Create a thrift (admin only) 
const createThrift = async (req, res) => {
    const { name, description, planId } = req.body;
    try {
        const thrift = new Thrift({ name, description, planId });
        await thrift.save();
        res.status(201).json(thrift);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Join a thrift

const joinThrift = async (req, res) => {
    const { userId } = req.body;
    try {
        const thrift = await Thrift.findById(req.params.id);
        thrift.participants.push(userId);
        await thrift.save();

        const user = await User.findById(userId);
        user.contributions.push(thrift._id);
        await user.save();

        // Create a subscription for the user
        await paystack.createSubscription(user.paystackCustomerId, thrift.planId);

        res.json(thrift);
const bcrypt = require('bcryptjs');
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

// Contribute to a thrift
const contributeThrift =  async (req, res) => {
    const { userId, amount } = req.body;
    try {
        const thrift = await Thrift.findById(req.params.id);
        thrift.contributions.push({ user: userId, amount });
        await thrift.save();
        res.json(thrift);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Select a user to receive contributions (admin only)
const recieveThrift = async (req, res) => {
    try {
        const thrift = await Thrift.findById(req.params.id).populate('participants');
        const selectedUser = thrift.participants[Math.floor(Math.random() * thrift.participants.length)];
        thrift.selectedUser = selectedUser;
        await thrift.save();

        // Create a transfer recipient and initiate transfer
        const recipientCode = await paystack.createTransferRecipient(
            selectedUser.name,
            selectedUser.bankDetails.accountNumber,
            selectedUser.bankDetails.bankCode
        );
        await paystack.initiateTransfer(recipientCode, thrift.totalContributions);

        res.json(selectedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a thrift (admin only)
const deleteThrift = async (req, res) => {
    try {
        const thrift = await Thrift.findById(req.params.id);
        if (!thrift) {
            return res.status(404).json({ message: 'Thrift not found' });
        }

        await thrift.remove();
        res.json({ message: 'Thrift deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {createThrift, joinThrift, deleteThrift, recieveThrift, contributeThrift}
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
