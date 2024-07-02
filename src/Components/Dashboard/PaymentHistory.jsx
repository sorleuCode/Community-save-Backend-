import React from 'react';

const PaymentHistory = ({ payments }) => {
  return (
    <div>
      <h2>Payment History</h2>
      <ul>
        {payments.map((payment) => (
          <li key={payment.id}>{payment.amount} on {payment.date}</li>
        ))}
      </ul>
    </div>
  );
};

export default PaymentHistory;
