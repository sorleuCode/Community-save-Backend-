const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    recievedPayment: { type: Number},
    paystackCustomerId: { type: Number, required: true }, // Paystack customer ID
    bankDetails: {
        bankName: { type: String, required: true },
        accountNumber: { type: String, required: true },
        bankCode: { type: String, required: true }, // Bank code required by Paystack for transfers
    },
    contributions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Thrift' }],
    createdAt: { type: Date, default: Date.now },
});

UserSchema.pre("save", async function (next) {
    if(!this.isModified("password")) {
        return next()
    }

    
    // hash password 
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next()
})

const User = mongoose.model("User", UserSchema);
module.exports = User;
