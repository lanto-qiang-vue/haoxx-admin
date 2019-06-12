import axios from 'axios'
import store from '@/store'
import { Message } from 'iview'
import baseURL from '_conf/url'
const fxios = axios.create({
  baseURL:baseURL,
  timeout: 10000,
});

fxios.interceptors.request.use(function (config) {
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

fxios.interceptors.response.use(function (response) {
  console.log(response);
  return response.data;
}, function (error) {
  // 对响应错误做点什么
  console.log("error",error);
  return Promise.reject(error);
});
export default fxios;
