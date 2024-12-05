const mongoose = require('mongoose');

const ThriftSchema = new mongoose.Schema({
    name: String,
    description: String,
    amount: { type: Number },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    hasContributed: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    potentialReceiver: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    adminId: { type: String, required: true },
    contributions: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, amount: Number }],
    planId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    selectedUser: { type: String },
    totalContributions: { type: Number, default: 0 }

});

module.exports = mongoose.model('Thrift', ThriftSchema);