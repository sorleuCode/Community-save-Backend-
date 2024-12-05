const bcrypt = require('bcryptjs');
const Admin = require('../models/AdminModel');
const createToken = require("../utils/index")




// Admin registration

const adminRegister = async (req, res) => {
    const { fullname, email, password, bankName, accountNumber, bankCode } = req.body;

    try {
        const existingUserByEmail = await Admin.findOne({ email });
        if (existingUserByEmail) {
            return res.status(400).json({ message: 'Admin with this email already exists' });
        }

        const admin = new Admin({
            fullname, email, password, bankDetails: {
                bankName,
                accountNumber,
                bankCode,
            },
        });
        await admin.save();
        const token = createToken(admin._id);

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 86400), // 1 day
            sameSite: "none",
            secure: true
        });

        res.status(201).json({ message: 'Admin registered successfully', admin, token });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


const adminLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = createToken(admin._id);

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 86400), // 1 day
            sameSite: "none",
            secure: true
        });

        admin.password = ""


        res.status(200).json({ message: 'Admin logged in successfully', admin });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};



const logoutAdmin = async (req, res) => {


    // Clear the "token" cookie by setting it to an empty string and an expiration date in the past
    res.cookie("token", "", {
        path: "/",
        httpOnly: true,
        expires: new Date(0), // Setting the expiration date to a time in the past to effectively delete the cookie
        sameSite: "none",     // This attribute helps with cross-site request protection
        secure: true,         // Ensures the cookie is sent only over HTTPS
    });

    // Send a 200 OK response with a message indicating successful logout
    res.status(200).json({ message: "Logout successful" });
};

const updateAdmin = async (req, res) => {
    try {
        const adminId = req.params.id;
        console.log(`Updating Admin with ID: ${adminId}`);

        const admin = await Admin.findById(adminId);

        if (!admin) {
            console.error(`User with ID ${adminId} not found`);
            return res.status(404).json({ error: "User not found" });
        }

        const { email, fullname, bankName, accountNumber, bankCode } = req.body;

        if (email) admin.email = email;
        if (fullname) admin.fullname = fullname;

        // Ensure bankDetails object exists before updating its properties
        if (!admin.bankDetails) {
            admin.bankDetails = {};
        }
        if (bankName) admin.bankDetails.bankName = bankName;
        if (accountNumber) admin.bankDetails.accountNumber = accountNumber;
        if (bankCode) admin.bankDetails.bankCode = bankCode;

        const updatedAdminDetails = await admin.save();
        res.json(updatedAdminDetails);
    } catch (error) {
        console.error('Error updating admin:', error);
        res.status(400).json({ message: error.message });
    }
};



module.exports = { adminLogin, adminRegister, logoutAdmin, updateAdmin }