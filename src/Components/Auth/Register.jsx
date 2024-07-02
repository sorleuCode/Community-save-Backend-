import React, { useState, useContext } from 'react';
import  {PaymentContext}  from '../../Context/PaymentContext';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useContext(PaymentContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(email, password);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;