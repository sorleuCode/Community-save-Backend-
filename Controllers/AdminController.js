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

const getAdmins = async (req, res) => {
    const admins = await Admin.find().sort("-createdAt").select("-password");
    if (!admins) {
      res.status(500);
      throw new Error("Something went wrong");
    }
    res.status(200).json(admins);
};
  
const getAdmin = async (req, res) => {
    // try {
    const { adminId } = req.params;
  
    const admin = await Admin.findById(adminId);
  
    if (admin) {
      const { _id, fullname, email, role } = admin;
  
      res.status(200).json({
        _id,
        fullname,
        email,
        role,
      });
    } else {
      res.status(404).json({ message: "Admin not found" });
    }
    // } catch (error) {
    //   console.error(error.message);
    //   res.status(500).send("Server error");
    // }
  };

module.exports = {adminLogin, adminRegister, getAdmins, getAdmin}

