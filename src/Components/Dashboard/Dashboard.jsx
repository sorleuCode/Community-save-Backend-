import React, { useContext } from 'react';
import { PaymentContext } from '../../Context/PaymentContext';
import PaymentHistory from '../Dashboard/PaymentHistory';

const Dashboard = () => {
  const { payments, user } = useContext(PaymentContext);

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <PaymentHistory payments={payments} />
    </div>
  );
};

export default Dashboard;