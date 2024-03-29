const path = require('path')
const fs = require('fs')

const resolve = dir => {
  return path.join(__dirname, dir)
}
const env = process.env.NODE_ENV || 'development'
fs.writeFileSync(path.join(__dirname, './config/env.js'), `export default '${env}'
`)

// 项目部署基础
// 默认情况下，我们假设你的应用将被部署在域的根目录下,
// 例如：https://www.my-app.com/
// 默认：'/'
// 如果您的应用程序部署在子路径中，则需要在这指定子路径
// 例如：https://www.foobar.com/my-app/
// 需要将它改为'/my-app/'
const BASE_URL = '/'

module.exports = {
  // Project deployment base
  // By default we assume your app will be deployed at the root of a domain,
  // e.g. https://www.my-app.com/
  // If your app is deployed at a sub-path, you will need to specify that
  // sub-path here. For example, if your app is deployed at
  // https://www.foobar.com/my-app/
  // then change this to '/my-app/'
  baseUrl: BASE_URL,
  // tweak internal webpack configuration.
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
      .set('_c', resolve('src/components'))
      .set('_conf', resolve('config'))
  },
  // 打包时不生成.map文件
  productionSourceMap: false,
  devServer: {
    proxy: {
      '/api/': {
        // target: 'http://192.168.169.231:10032/hxx-proxy/',
        target: 'https://weixin.test.hoxiuxiu.com/hxx-proxy/',
        // target: 'http://developer.hxx.hoxiuxiu.com/',
        // target:'http://192.168.169.124:8871',
        // target:'https://hxx.hoxiuxiu.com/api/',
        pathRewrite: {'^/api/': ''},
        secure: false
      },
      '/other/': {
        // target: 'http://192.168.169.231:8888/',
        target: 'https://www.test.shanghaiqixiu.org/proxy/',
        // target:'http://api.hoxiuxiu.com/',
        pathRewrite: {'^/other/': ''},
        secure: false
      },
      '/poxy-next/':{
        // target:'http://192.168.169.231:8888/',
        target: 'https://www.test.shanghaiqixiu.org/proxy/',
        // target:'https://callcenter.test.hoxiuxiu.com/',
        pathRewrite: {'^/poxy-next/': ''},
        secure: false
      },
      '/poxy-after/':{
        // target:'http://192.168.169.231:8888/',
        target: 'https://www.test.shanghaiqixiu.org/proxy/',
        // target:'http://192.168.169.126:8872',
        pathRewrite: {'^/poxy-after/': ''},
        secure: false
      },
      '/poxy-shqx/':{
        // target:'http://192.168.169.231:8888/',
        target: 'https://www.test.shanghaiqixiu.org/proxy/',
        // target:'http://192.168.169.118:8871',
        // target:'https://hxx.hoxiuxiu.com/poxy-shqx/',
        // target:'https://hxx.test.hoxiuxiu.com/poxy-shqx',
        // target:'https://www.shanghaiqixiu.org/proxy/',
        pathRewrite: {'^/poxy-shqx/': ''},
        secure: false
       }
    }
  }

}
