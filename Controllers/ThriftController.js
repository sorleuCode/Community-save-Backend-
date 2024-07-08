const Thrift = require('../models/ThriftModel');
const User = require('../models/UserModel');
const paystack = require('../utils/paystack');


// Create a thrift (admin only)
const createThrift = async (req, res) => {
    const { name, description, planId, amount } = req.body;


    try {

      const thriftExist = await Thrift.findOne({planId})
      if (thriftExist) {
        return res.status(400).json({ message: 'Thrift with this planId already exists' });
      }
      
        const thrift = new Thrift({ name, description, planId, amount, adminId: req.user._id });
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

        // Create a subscription using the authorization code
        const subscriptionId = await paystack.createSubscription(customer.id, planId, authorization.authorization_code);
        
        const paystackCustomerId =  customer.id

        console.log(paystackCustomerId)

        const user = await User.findOne({paystackCustomerId})
        console.log(user)


        const thrift = await Thrift.findOne({planId})
        console.log(thrift)

        if (!thrift) {
          return res.status(404).json({ message: 'Thrift plan not found' });
        }

    
        if (paymentDetails.data.status && user) {

          const amount = paymentDetails.data.amount / 100
          thrift.hasContributed.push(user._id)
          thrift.potentialReceiver.push(user._id)
          thrift.totalContributions += amount
          await thrift.save();
    
          }
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
const recieveThrift = async (req, res) => {
    try {
      const thrift = await Thrift.findById(req.params.id).populate('participants').populate('adminId');
      
      if (!thrift) {
        return res.status(404).json({ message: 'Thrift not found' });
      }
  
      // Check if all participants have contributed
      const allContributed = thrift.participants.every(participant => participant.hasContributed);
      
      if (!allContributed) {
        return res.status(400).json({ message: 'Not all participants have contributed' });
      }
  
      // Calculate the admin fee (e.g., 10% of total contributions)
      const adminFeePercentage = 0.10;
      const adminFee = thrift.totalContributions * adminFeePercentage;
      const payoutAmount = thrift.totalContributions - adminFee;
  
      // Select a random participant
      const selectedUser = thrift.participants[Math.floor(Math.random() * thrift.potentialReceiver.length)];
      thrift.selectedUser = selectedUser;
      await thrift.save();
  
      // Create a transfer recipient for the selected user and initiate transfer
      const recipientCode = await paystack.createTransferRecipient(
        selectedUser.fullname,
        selectedUser.bankDetails.accountNumber,
        selectedUser.bankDetails.bankCode
      );
      await paystack.initiateTransfer(recipientCode, payoutAmount);
  
      // Create a transfer recipient for the admin and initiate transfer
      const adminRecipientCode = await paystack.createTransferRecipient(
        thrift.admin.fullname,
        thrift.admin.bankDetails.accountNumber,
        thrift.admin.bankDetails.bankCode
      );
      await paystack.initiateTransfer(adminRecipientCode, adminFee);
  
      res.json({ selectedUser, adminFee });
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

module.exports = { createThrift, joinThrift, deleteThrift, recieveThrift, contributeThrift, paymentVerification, getAllThrifts }