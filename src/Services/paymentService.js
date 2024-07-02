import api from '../utils/api';

const getPayments = async () => {
  const response = await api.get('/payments');
  return response.data;
};

const makePayment = async (amount) => {
  const response = await api.post('/payments', { amount });
  return response.data;
};

const autoDeduct = async () => {
  const response = await api.post('/auto-deduct');
  return response.data;
};

const selectRandomUser = async () => {
  const response = await api.post('/select-random-user');
  return response.data;
};

const deductWeekly = async () => {
  const response = await api.post('/deduct-weekly');
  return response.data;
};

export default {
  getPayments,
  makePayment,
  autoDeduct,
  selectRandomUser,
  deductWeekly,
};