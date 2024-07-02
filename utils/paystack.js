const paystack = require('paystack-api')(process.env.PAYSTACK_SECRET_KEY);

const createCustomer = async (email, firstName, lastName) => {
    try {
        const customer = await paystack.customer.create({
            email,
            first_name: firstName,
            last_name: lastName,
        });
        return customer.data.id;
    } catch (error) {
        throw error;
    }
};

const createSubscription = async (customerId, planId) => {
    try {
        const subscription = await paystack.subscription.create({
            customer: customerId,
            plan: planId,
        });
        return subscription.data.id;
    } catch (error) {
        throw error;
    }
};

const createTransferRecipient = async (name, accountNumber, bankCode) => {
    try {
        const recipient = await paystack.transferRecipient.create({
            type: 'nuban',
            name,
            account_number: accountNumber,
            bank_code: bankCode,
        });
        return recipient.data.recipient_code;
    } catch (error) {
        throw error;
    }
};

const initiateTransfer = async (recipientCode, amount) => {
    try {
        const transfer = await paystack.transfer.initiate({
            source: 'balance',
            amount: amount * 100, // Convert to kobo
            recipient: recipientCode,
        });
        return transfer.data;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createCustomer,
    createSubscription,
    createTransferRecipient,
    initiateTransfer,
};
