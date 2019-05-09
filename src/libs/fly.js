import axios from 'axios'
import store from '@/store'
import { Message } from 'iview'
const fly = axios.create({
  baseURL: '/poxy-shqx/',
  timeout: 1000,
  transformRequest: [function (data) {
    return JSON.stringify(data)
  }],
});
fly.interceptors.request.use(function (config) {
  config.headers = {'token':store.state.user.token,'Content-Type': 'application/json; charset=utf-8'}
  if(config.url.indexOf("?") > -1){
    config.url = config.url + "&userId="+ store.state.user.userInfo.user.userId;
  }else{
    config.url = config.url + "?userId="+store.state.user.userInfo.user.userId;
  }
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});
fly.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  if(response.data.code &&response.data.code != 0) Message.info(response.data.status);
  return response.data;
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});
export default fly;

