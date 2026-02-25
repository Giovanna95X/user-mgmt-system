import axios from 'axios';
import { getToken, clearAuth } from '../store/auth';

// 创建 axios 实例
const client = axios.create({
  baseURL: 'http://localhost:3001/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器：自动附加 Authorization Bearer Token
client.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器：处理 401 自动跳转登录
client.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // 清除本地认证信息并跳转到登录页
      clearAuth();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default client;
