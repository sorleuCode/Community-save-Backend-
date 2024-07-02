import React, { createContext, useState, useEffect } from 'react';
import paymentService from '../Services/paymentService';
import authService from '../Services/authService';


const PaymentContext = createContext();
 const PaymentProvider = ({ children }) => {
  const [payments, setPayments] = useState(["feed", "good"]);
  const [user, setUser] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      const data = await paymentService.getPayments();
      setPayments(data);
    };
    fetchPayments();
  }, []);

  const makePayment = async (amount) => {
    const newPayment = await paymentService.makePayment(amount);
    setPayments((prevPayments) => [...prevPayments, newPayment]);
  };

  const autoDeduct = async () => {
    await paymentService.autoDeduct();
  };

  const selectRandomUser = async () => {
    await paymentService.selectRandomUser();
  };

  const deductWeekly = async () => {
    await paymentService.deductWeekly();
  };


  const login = async (email, password) => {
    const loggedInUser = await authService.login(email, password);
    setUser(loggedInUser);
  };

  const register = async (email, password) => {
    const registeredUser = await authService.register(email, password);
    setUser(registeredUser);
  };

  const Selector = () => {
    const { selectRandomUser } = useContext(PaymentContext);
  
    useEffect(() => {
      const interval = setInterval(() => {
        selectRandomUser();
      }, 604800000); // One week in milliseconds
  
      return () => clearInterval(interval);
    }, [selectRandomUser]);
  
  };


  const WeeklyDeduction = () => {
    const { deductWeekly } = useContext(PaymentContext);
  
    useEffect(() => {
      const interval = setInterval(() => {
        deductWeekly();
      }, 604800000); // One week in milliseconds
  
      return () => clearInterval(interval);
    }, [deductWeekly]) // Ensure deductWeekly is stable
  
  }

  
const AutoPayment = () => {
  const { autoDeduct } = useContext(PaymentContext);

  useEffect(() => {
    const interval = setInterval(() => {
      autoDeduct();
    }, 604800000); // One week in milliseconds

    return () => clearInterval(interval);
  }, [autoDeduct]);
};


  return (
    <PaymentContext.Provider value={{ login,AutoPayment, register, Selector, user, WeeklyDeduction,  payments, makePayment, autoDeduct, selectRandomUser, deductWeekly }}>
      {children}
    </PaymentContext.Provider>
  );
};

export  {PaymentContext, PaymentProvider}