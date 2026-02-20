const axios = require('axios');

const api = axios.create({ 
    baseURL: 'http://localhost:8080/api' 
});

const getProtectedData = async (token) => {
  return await api.get('/data', {
    headers: { 
        Authorization: `Bearer ${token}` 
    }
  });
};

module.exports = { getProtectedData };