import Axios from 'axios'
import baseURL from '_conf/url'
import { Message } from 'iview'
import store from '@/store'
// import Cookies from 'js-cookie'
// import { TOKEN_KEY } from '@/libs/util'
class httpRequest {
  constructor () {
    this.options = {
      method: '',
      url: ''
    }
    // 存储请求队列
    this.queue = {}
  }
  // 销毁请求实例
  destroy (url) {
    delete this.queue[url]
    const queue = Object.keys(this.queue)
    return queue.length
  }
  // 请求拦截
  interceptors (instance, url) {
    // 添加请求拦截器
    instance.interceptors.request.use(config => {
      // if (!config.url.includes('/users')) {
      //   config.headers['x-access-token'] = Cookies.get(TOKEN_KEY)
      // }
      // Spin.show()
      // 在发送请求之前做些什么
      return config
    }, error => {
      // 对请求错误做些什么
      return Promise.reject(error)
    })

    // 添加响应拦截器
    instance.interceptors.response.use((res) => {
      let { data } = res
      const is = this.destroy(url)
      if (!is) {
        setTimeout(() => {
          // Spin.hide()
        }, 500)
      }
      //登录服务接口...
      if(data[0]&&data[0].error == 0){
         return data;
      }
      if (!data.success || data.success !== true) {
        // 后端服务在个别情况下回报201，待确认
        // if (data.code === 401) {
        //   Cookies.remove(TOKEN_KEY)
        //   window.location.href = window.location.pathname + '#/login'
        //   Message.error('未登录，或登录失效，请登录')
        // } else {
        //   if (data.msg) Message.error(data.msg)
        // }
        // return false
        let flag = data.data ? true : false;
        if(flag && data.data.code == 808){
          Message.destroy();
          Message.error("登陆失效,请重新登陆");
          store.dispatch('handleLogOut')
          return false;
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
      return data
    }, (error) => {
      // alert(error);
      // Message.error('服务内部错误')
      // 对响应错误做点什么
      return Promise.reject(error)
    })
  }
  // 创建实例
  create (options) {
    let conf = {
      baseURL: options.baseURL || baseURL,
      // timeout: 2000,
      headers: options.headers ||
      {
        // 'Content-Type': 'application/json; charset=utf-8',
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      //   'X-URL-PATH': location.pathname
      },
      transformRequest: [function (data) {
        // Do whatever you want to transform the data
        let ret = ''
        for (let it in data) {
          ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
        return ret
      }]
    }
    return Axios.create(conf)
  }
  // 合并请求实例
  mergeReqest (instances = []) {
    //
  }
  // 请求实例
  request (options) {
    var instance = this.create(options)
    this.interceptors(instance, options.url)
    options = Object.assign({}, options)
    // console.log('options', options)
    this.queue[options.url] = instance
    return instance(options)
  }
}
export default httpRequest
