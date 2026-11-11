import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://document-renewel-reminder-api-application.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});
export default apiClient;