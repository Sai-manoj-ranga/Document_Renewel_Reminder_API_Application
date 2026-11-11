import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://document-renewel-reminder-api.onrender.com', // Replace with your API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});
export default apiClient;