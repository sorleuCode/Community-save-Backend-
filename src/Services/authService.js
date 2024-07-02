import api from '../utils/api';

const login = async (email, password) => {
  const response = await api.post('/login', { email, password });
  return response.data;
};

const register = async (email, password) => {
  const response = await api.post('/register', { email, password });
  return response.data;
};

export default {
  login,
  register,
};
