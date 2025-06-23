import axios from 'axios';

const api = axios.create({
  baseURL: 'https://e-ticket-server-afxw.onrender.com/api',
});

export default api; 