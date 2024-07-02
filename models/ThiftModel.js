const mongoose = require('mongoose');

const ThriftSchema = new mongoose.Schema({
    name: String,
    description: String,
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    contributions: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, amount: Number }],
    createdAt: { type: Date, default: Date.now },
    selectedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Thrift', ThriftSchema);