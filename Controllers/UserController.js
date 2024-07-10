const jwt = require('jsonwebtoken');
const User = require("../models/UserModel");
const paystack = require("../utils/paystack")
const bcrypt = require("bcryptjs")

// User registration
const userRegister = async (req, res) => {
    const { fullname, email, password, bankName, accountNumber, bankCode } = req.body;

    const userExist = await User.findOne({ email })

    if (userExist) {
        return res.status(400).json({ message: 'User with this email already exists' });
    }

    const names = fullname.split(' ');
    const firstName = names[0];
    const lastName = names.slice(1).join(' ') || '';
    try {
        const paystackCustomerId = await paystack.createCustomer(email, firstName, lastName)
        console.log("here")
        console.log(paystackCustomerId)

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


// get all users

const getAllUsers = async (req, res) => {

    const users = await User.find().sort("-createdAt");

    if (!users) {
        res.status(500)
        throw new Error("Something went wrong!")
    }
    res.status(200).json(users)
};

const updateUser = async (req, res) => {
    try {
      const userId = req.params.id;
      console.log(`Updating user with ID: ${userId}`);
  
      const user = await User.findById(userId);
  
      if (!user) {
        console.error(`User with ID ${userId} not found`);
        return res.status(404).json({ error: "User not found" });
      }
  
      const { email, fullname, bankName, accountNumber, bankCode } = req.body;
  
      if (email) user.email = email;
      if (fullname) user.fullname = fullname;
  
      // Ensure bankDetails object exists before updating its properties
      if (!user.bankDetails) {
        user.bankDetails = {};
      }
      if (bankName) user.bankDetails.bankName = bankName;
      if (accountNumber) user.bankDetails.accountNumber = accountNumber;
      if (bankCode) user.bankDetails.bankCode = bankCode;
  
      const updatedUserDetails = await user.save();
      res.json(updatedUserDetails);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(400).json({ message: error.message });
    }
  };
  
  
module.exports = { userRegister, userLogin, getAllUsers, updateUser };