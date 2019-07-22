import Axios from 'axios'
import baseURL from '_conf/url'
import { Message } from 'iview'
import store from '@/store'

let axiosHxx= Axios.create({
  baseURL: baseURL,
  timeout: 6000,
  headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'},
  transformRequest: [function (data) {
    // console.log('data', Object.prototype.toString.call(data))
    let ret = '',hashxxtoken= false, token= store.state.user.token, dataType=Object.prototype.toString.call(data);
    switch(dataType){
      case '[object Object]': {
        for (let key in data) {
          let item = data[key]
          if (ret) ret += '&';
          if (key == 'access_token') {
            if (item) hashxxtoken = true;
            else continue
          }
          ret += (encodeURIComponent(key) + '=' + encodeURIComponent(typeof item == 'object' ? JSON.stringify(item) : item))
        }
        if (!hashxxtoken && token) ret += ('&' + encodeURIComponent('access_token') + '=' + encodeURIComponent(token))
        break
      }
      case '[object FormData]':{
        if(!data.has('access_token')){
          data.append('access_token' , token);
        }
        ret= data
        break
      }
    }

    return ret
  }]
});

axiosHxx.interceptors.response.use(response => {
  let { data } = response
  if (!data.success || data.success !== true) {
    let flag = data.data ? true : false;
    if(flag && data.data.code == 808){
      Message.destroy();
      Message.error("登陆过期,请重新登陆");
      store.dispatch('handleLogOut')
      // return false;
    }
    if(data.hasOwnProperty("Exception")){
      if(data["Exception"].hasOwnProperty("message")){
        Message.error(data.Exception.message || '服务内部错误3')
      }else{
        Message.error(data.title || '服务内部错误2')
      }
    }else{
      Message.error(data.title || '服务内部错误1')
    }
  }
  return data;
}, error => {
  return Promise.reject(error)
});

export default axiosHxx
