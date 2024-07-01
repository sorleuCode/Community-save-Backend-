const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    paystackCustomerId: { type: String, required: true }, // Paystack customer ID
    bankDetails: {
        bankName: { type: String, required: true },
        accountNumber: { type: String, required: true },
        bankCode: { type: String, required: true }, // Bank code required by Paystack for transfers
    },
    contributions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Thrift' }],
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);