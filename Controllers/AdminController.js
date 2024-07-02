const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/AdminModel');




// Admin registration
const adminRegister = async (req, res) => {
    const { fullname, email, password } = req.body;
    try {
    
        const admin = new Admin({ fullname, email, password});
        await admin.save();
        res.status(201).json(admin);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Admin login
// const adminLogin = async (req, res) => {
//     const { email, password } = req.body;
//     try {
//         const admin = await Admin.findOne({ email });
//         if (admin && await bcrypt.compare(password, admin.password)) {
//             const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1d' });
//             res.json({ token, admin });
//         } else {
//             res.status(400).json({ message: 'Invalid credentials' });
//         }
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };

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
        
        const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, admin });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {adminLogin, adminRegister}

