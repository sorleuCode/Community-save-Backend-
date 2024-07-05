const Thrift = require('../models/ThriftModel');
const User = require('../models/UserModel');
const paystack = require('../utils/paystack');


// Create a thrift (admin only) 
const createThrift = async (req, res) => {
    const { name, description, planId, amount } = req.body;
    try {
        const thrift = new Thrift({ name, description, planId, amount });
        thrift.contributions.push({ amount });
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

        const amount = thrift.contributions[0].amount;

        // console.log(amount)

        const user = await User.findById(userId);
        user.contributions.push(thrift._id);
        const email = user.email
        await user.save();


        const ref = await paystack.initializePayment(email, amount);

        console.log(ref)
        const verifyAuth = await paystack.verifyPayment(ref.data.reference)

        console.log(verifyAuth)

        await paystack.createSubscription(user.paystackCustomerId, thrift.planId);

        // Replace 5000 with the actual amount

        // Create a subscription for the user

        res.json(thrift);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// const verifyPayment = async(req, res) => {
//     const {reference} = req.query

//     try {

//         const verifyAuth = await paystack.verifyPayment(reference)

        
//     } catch (error) {
        
//     }
// }

// Contribute to a thrift
const contributeThrift = async (req, res) => {
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

        await thrift.deleteOne();
        res.json({ message: 'Thrift deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createThrift, joinThrift, deleteThrift, recieveThrift, contributeThrift }