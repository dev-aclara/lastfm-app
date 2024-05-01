import axios, { AxiosInstance } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: 'http://ws.audioscrobbler.com/2.0/',
  timeout: 10000,
});

export default api;