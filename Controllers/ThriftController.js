const Thrift = require('../models/ThriftModel');
const User = require('../models/UserModel');
const paystack = require('../utils/paystack');


// Create a thrift (admin only)
const createThrift = async (req, res) => {
  const { name, description, planId, amount } = req.body;
  try {
      const existingThrift = await Thrift.findOne({planId});
      if (existingThrift) {
          return res.status(400).json({ message: 'Thrift with this planId already exists' });
      }
      const thrift = new Thrift({ name, description, planId , amount });
      thrift.contributions.push({amount});
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
        thrift.potentialReceiver.push(userId);
        // thrift.contributions.push({user: userId})
        await thrift.save();

        
        const amount = thrift.contributions[0].amount
        // console.log(amount)

        const user = await User.findById(userId);
        user.contributions.push(thrift._id);
        const email = user.email
        await user.save();


        const ref = await paystack.initializePayment(email, amount);

        console.log(ref)
        res.status(200).json(thrift)
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const paymentVerification = async (req, res) => {

    const { reference, planId } = req.body;
    try {
        const paymentDetails = await paystack.verifyPayment(reference);

        console.log("DETAILS" , paymentDetails)
        const {customer, authorization} = paymentDetails.data;

        console.log("cutomer", customer)
        

        // Create a subscription using the authorization code
        const subscriptionId = await paystack.createSubscription(customer.id, planId, authorization.authorization_code);

        res.status(200).json({ subscriptionId, paymentDetails });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }



}
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
const receiveThrift = async (req, res) => {
  try {
    const thrift = await Thrift.findById(req.params.id).populate(
      "participants"
    );
    // const thrift = await Thrift.findById(req.params.id).populate(
    //   "participants"
    // );
    const selectedUser =
      thrift.potentialReceiver[
        Math.floor(Math.random() * thrift.potentialReceiver.length)
      ];
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


const getAllThrifts = async (req, res) => {

    const thrift = await Thrift.find().sort("-createdAt");
  
    if (!thrift) {
      res.status(500)
      throw new Error("Something went wrong!")
    }
    res.status(200).json(thrift)
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

module.exports = { createThrift, joinThrift, deleteThrift, receiveThrift, contributeThrift, paymentVerification, getAllThrifts }
