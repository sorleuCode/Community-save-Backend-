import React, { useState, useContext } from 'react';
import { PaymentContext } from '../../Context/PaymentContext';

const PaymentForm = () => {
  const [amount, setAmount] = useState('');
  const { makePayment } = useContext(PaymentContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await makePayment(amount);
      setAmount('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
      <button type="submit">Make Payment Now</button>
    </form>
  );
};

export default PaymentForm;
