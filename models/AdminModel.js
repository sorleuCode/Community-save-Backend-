const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

const AdminSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, default: 'admin' },
    createdAt: { type: Date, default: Date.now },
});

AdminSchema.pre("save", async function (next) {
    if(!this.isModified("password")) {
        return next()
    }

    
    // hash password 
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next()
})

const Admin = mongoose.model("Admin", AdminSchema);
module.exports = Admin;