// import Cookies from 'js-cookie'
// cookie保存的天数
// import config from '@/config'
// import axios from './axios.js'
import { forEach, hasOneOf } from '@/libs/tools'
export const TOKEN_KEY = 'ACCESSTOKEN'
export const USERINFO_KEY = 'USERINFO'
export const ACCESSMENU_KEY = 'ACCESSMENU'
export const DICT_KEY = 'DICT'
export const TENANT_KEY = 'Tenant';
export const OUTSTATUS = 'outStatus';
export const ISAUTHORIZE = 'isAuthorize'
export const TENANTID = 'tenantId'
//存储前台账号等信息....
export const ACCOUNT = 'account';
//存储后台登陆信息...
export const ADMIN = 'admin';
export const reg={
  idcard: /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/,
  vehicle: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4,5}[A-Z0-9挂学警港澳]{1}$/,
  vin: /^[A-Z0-9]{17}$/,
  mobile: /^1[3456789]\d{9}$/,
}
export const setAdmin = (info) =>{
  localStorage.setItem(ADMIN,info || {})
}
export const getAdmin = () => {
  const admin = localStorage.getItem(ADMIN)
  return admin || "{}"
}
export const setTenantId = (type) =>{
  localStorage.setItem(TENANTID,type || 0)
}
export const getTenantId = (type) =>{
  const tenantId = localStorage.getItem(TENANTID)
  return tenantId || 0;
}
export const setIsAuthorize = (type) =>{
  localStorage.setItem(ISAUTHORIZE,type || 0)
}
export const getIsAuthorize = () =>{
  const isAuthorize = localStorage.getItem(ISAUTHORIZE)
  return isAuthorize || 0;
}
export const setOutStatus = (type) =>{
  localStorage.setItem(OUTSTATUS,type || 0)
}
export const setAccount = (info) =>{
  localStorage.setItem(ACCOUNT,info || {})
}
export const getAccount = () =>{
  const account = localStorage.getItem(ACCOUNT)
  return account || "{}";
}
export const getOutStatus = () =>{
  const outStatus = localStorage.getItem(OUTSTATUS)
  return outStatus || 0;
}
export const setToken = (token) => {
  // Cookies.set(TOKEN_KEY, token, {expires: config.cookieExpires || 1})

  localStorage.setItem(TOKEN_KEY, token || '')
}
export const setTenant = (info)=>{
  localStorage.setItem(TENANT_KEY, info ? JSON.stringify(info) : '')
}
export const getTenant = () => {
  const tean = localStorage.getItem(TENANT_KEY)
  return tean ? JSON.parse(tean) : false
}
export const getToken = () => {
  // const token = Cookies.get(TOKEN_KEY)
  const token = localStorage.getItem(TOKEN_KEY)
  return token || false
}
export const setUser = (info) => {
  localStorage.setItem(USERINFO_KEY, info ? JSON.stringify(info) : '')
}
export const getUser = () => {
  const val = localStorage.getItem(USERINFO_KEY)
  return val ? JSON.parse(val) : false
}
export const setMenu = (info) => {
  localStorage.setItem(ACCESSMENU_KEY, info ? JSON.stringify(info) : '')
}
export const getMenu = () => {
  const val = localStorage.getItem(ACCESSMENU_KEY)
  return val ? JSON.parse(val) : false
}
export const setDict = (info) => {
  localStorage.setItem(DICT_KEY, info ? JSON.stringify(info) : '')
}
export const getDict = () => {
  const val = localStorage.getItem(DICT_KEY)
  return val ? JSON.parse(val) : false
}

export const hasChild = (item) => {
  return item.children && item.children.length !== 0
}

const matchMenu = (access, menu) => {
  let flag = false
  for (let i in menu) {
    if (menu[i].id == access) {
      flag = menu[i]
      break
    } else if (menu[i].children) {
      flag = matchMenu(access, menu[i].children)
      if (flag) break
    }
  }
  return flag
}

//判断权限菜单可见
export const showThisMenuEle = (item, access) => {
  // if (item.meta && item.meta.access && item.meta.access.length) {
  //   if (hasOneOf(item.meta.access, access)) return true
  //   else return false
  // } else return true

  if (!access.accessMenu || !access.userInfo) return false
  if (item.meta && item.meta.lgType && item.meta.access) {
    let lgType = access.userInfo.user.lgType, menu = access.accessMenu
    if (item.meta.lgType == lgType && matchMenu(item.meta.access, menu)) return true
    else return false
  } else return true
}

//获取图标
export const getIcon = (item, access) => {
  let lgType = access.userInfo.user.lgType, menuItem , icon=''
  if (item.meta && item.meta.lgType && item.meta.access) {
    menuItem = matchMenu(item.meta.access, access.accessMenu)
    if (item.meta.lgType == lgType && menuItem) {
      if(menuItem.iconFont) icon= 'fa '+ menuItem.iconFont
    }
    else if(item.children) icon= getIcon(item.children, access)
  }
  return icon
}
/**
 * @param {Array} list 通过路由列表得到菜单列表
 * @returns {Array}
 */
export const getMenuByRouter = (list, access) => {
  let res = []
  forEach(list, item => {
    if (!item.meta || (item.meta && !item.meta.hideInMenu)) {
      let obj = {
        icon: (item.meta && item.meta.icon) || '',
        name: item.name,
        meta: item.meta
      }
      let accessShow= showThisMenuEle(item, access)
      if ((hasChild(item) || (item.meta && item.meta.showAlways)) && accessShow) {
        obj.children = getMenuByRouter(item.children, access)
      }
      if (item.meta && item.meta.href) obj.href = item.meta.href
      if (accessShow) {
        obj.custom= getIcon(item, access)
        // console.log('custom',obj.custom)
        res.push(obj)
      }
    }
  })
  return res
}

/**
 * @param {Array} routeMetched 当前路由metched
 * @returns {Array}
 */
export const getBreadCrumbList = (routeMetched, homeRoute) => {
  let res = routeMetched.filter(item => {
    return item.meta === undefined || !item.meta.hide
  }).map(item => {
    let obj = {
      icon: (item.meta && item.meta.icon) || '',
      name: item.name,
      meta: item.meta
    }
    return obj
  })
  res = res.filter(item => {
    return !item.meta.hideInMenu
  })
  return [Object.assign(homeRoute, { to: homeRoute.path }), ...res]
}

export const showTitle = (item, vm) => vm.$config.useI18n ? vm.$t(item.name) : ((item.meta && item.meta.title) || item.name)

/**
 * @description 本地存储和获取标签导航列表
 */
export const setTagNavListInLocalstorage = list => {
  localStorage.tagNaveList = JSON.stringify(list)
}
/**
 * @returns {Array} 其中的每个元素只包含路由原信息中的name, path, meta三项
 */
export const getTagNavListFromLocalstorage = () => {
  const list = localStorage.tagNaveList
  return list ? JSON.parse(list) : []
}

/**
 * @param {Array} routers 路由列表数组
 * @description 用于找到路由列表中name为home的对象
 */
export const getHomeRoute = routers => {
  let i = -1
  let len = routers.length
  let homeRoute = {}
  while (++i < len) {
    let item = routers[i]
    if (item.children && item.children.length) {
      let res = getHomeRoute(item.children)
      if (res.name) return res
    } else {
      // console.log('getUser',getUser())
      if (!getUser()) return false
      if (item.name === (getUser().user.lgType==='1002' ? 'home' : 'admin-home')) homeRoute = item
    }
  }
  return homeRoute
}

/**
 * @param {*} list 现有标签导航列表
 * @param {*} newRoute 新添加的路由原信息对象
 * @description 如果该newRoute已经存在则不再添加
 */
export const getNewTagList = (list, newRoute) => {
  const { name, path, meta } = newRoute
  let newList = [...list]
  if (newList.findIndex(item => item.name === name) >= 0) return newList
  else newList.push({ name, path, meta })
  return newList
}

/**
 * @param {*} access 用户权限数组，如 ['super_admin', 'admin']
 * @param {*} route 路由列表
 */
const hasAccess = (access, route) => {
  if (route.meta && route.meta.access) return hasOneOf(access, route.meta.access)
  else return true
}

/**
 * 权鉴
 * @param {*} name 即将跳转的路由name
 * @param {*} access 用户权限数组
 * @param {*} routes 路由列表
 * @description 用户是否可跳转到该页
 */
export const canTurnTo = (name, access, routes) => {
  const routePermissionJudge = (list) => {
    return list.some(item => {
      if (item.children && item.children.length) {
        return routePermissionJudge(item.children)
      } else if (item.name === name) {
        return hasAccess(access, item)
      }
    })
  }

  return routePermissionJudge(routes)
}

/**
 * @param {String} url
 * @description 从URL中解析参数
 */
export const getParams = url => {
  let paramObj = {}, arr= url.split('?')
  if(arr.length>1){
    let keyValueArr = arr[1].split('&')
    keyValueArr.forEach(item => {
      const keyValue = item.split('=')
      paramObj[keyValue[0]] = keyValue[1]
    })
  }
  return paramObj
}
export const setParams = obj => {
  let arr=[]
  for(let key in obj){
    arr.push(`${key}=${obj[key]}`)
  }
  return `?${arr.join('&')}`
}

/**
 * @param {Array} list 标签列表
 * @param {String} name 当前关闭的标签的name
 */
export const getNextName = (list, name) => {
  let res = ''
  if (list.length === 2) {
    res = 'home'
  } else {
    if (list.findIndex(item => item.name === name) === list.length - 1) res = list[list.length - 2].name
    else res = list[list.findIndex(item => item.name === name) + 1].name
  }
  return res
}

/**
 * @param {Number} times 回调函数需要执行的次数
 * @param {Function} callback 回调函数
 */
export const doCustomTimes = (times, callback) => {
  let i = -1
  while (++i < times) {
    callback()
  }
}

/**
 * @param {Object} file 从上传组件得到的文件对象
 * @returns {Promise} resolve参数是解析后的二维数组
 * @description 从Csv文件中解析出表格，解析成二维数组
 */
export const getArrayFromFile = (file) => {
  let nameSplit = file.name.split('.')
  let format = nameSplit[nameSplit.length - 1]
  return new Promise((resolve, reject) => {
    let reader = new FileReader()
    reader.readAsText(file) // 以文本格式读取
    let arr = []
    reader.onload = function (evt) {
      let data = evt.target.result // 读到的数据
      let pasteData = data.trim()
      arr = pasteData.split((/[\n\u0085\u2028\u2029]|\r\n?/g)).map(row => {
        return row.split('\t')
      }).map(item => {
        return item[0].split(',')
      })
      if (format === 'csv') resolve(arr)
      else reject(new Error('[Format Error]:你上传的不是Csv文件'))
    }
  })
}

/**
 * @param {Array} array 表格数据二维数组
 * @returns {Object} { columns, tableData }
 * @description 从二维数组中获取表头和表格数据，将第一行作为表头，用于在iView的表格中展示数据
 */
export const getTableDataFromArray = (array) => {
  let columns = []
  let tableData = []
  if (array.length > 1) {
    let titles = array.shift()
    columns = titles.map(item => {
      return {
        title: item,
        key: item
      }
    })
    tableData = array.map(item => {
      let res = {}
      item.forEach((col, i) => {
        res[titles[i]] = col
      })
      return res
    })
  }
  return {
    columns,
    tableData
  }
}

export const findNodeUpper = (ele, tag) => {
  if (ele.parentNode) {
    if (ele.parentNode.tagName === tag.toUpperCase()) {
      return ele.parentNode
    } else {
      return findNodeUpper(ele.parentNode, tag)
    }
  }
}

export const findNodeDownward = (ele, tag) => {
  const tagName = tag.toUpperCase()
  if (ele.childNodes.length) {
    let i = -1
    let len = ele.childNodes.length
    while (++i < len) {
      let child = ele.childNodes[i]
      if (child.tagName === tagName) return child
      else return findNodeDownward(child, tag)
    }
  }
}

export const showByAccess = (access, canViewAccess) => {
  return hasOneOf(canViewAccess, access)
}
/**
 * resource Array
 * parameters [keyName,returnName,findValue]
 * */
export const find = (resource,parameters)=>{
  // if(parameters[0] && parameters[1] && parameters[2]){
    for(let i in resource){
      if(resource[i][parameters[0]] == parameters[2]){
        return resource[i][parameters[1]];
      }
    }
  // }
   return "";
}
export const getName = (arr, code) => {
  for (let i in arr){
    if(arr[i].code==code)
      return arr[i].name
  }
}
export const getCode = (arr, name) => {
  for (let i in arr){
    if(arr[i].name==name)
      return arr[i].code
  }
}
export const getCreate = (arr,code) =>{
for(let i in arr){
if(arr[i].USER_ID ==code){
return arr[i].USER_NAME
}
}
}
export const getDictGroup = (arr, group) => {
  let res= []
  for (let i in arr){
    if(arr[i].group==group)
      res.push(arr[i])
  }
  return res
}

export const getUserInfo = (arr, group) => {
  for (let i in arr){
    if(arr[i].PARAM_ID==group)
      return arr[i].PARAM_VALUE
  }

}

export const getBtns = (access, menu) => {
    let btnAction = ''
    for (let i in menu) {
      if (menu[i].id == access) {
        // console.log('btnAction', menu[i].btnAction)
        btnAction = menu[i].btnAction|| ''
        break
      } else if (menu[i].children) {
        btnAction = getBtns(access, menu[i].children)
        if (btnAction) break
      }
    }
    return btnAction
}
/**
 * @param {obj} 任意参数
 * @returns {String}
 * @description 判断参数类型
 */
export const getType = (obj) => {
  //tostring会返回对应不同的标签的构造函数
  let toString = Object.prototype.toString;
  let map = {
    '[object Boolean]'  : 'boolean',
    '[object Number]'   : 'number',
    '[object String]'   : 'string',
    '[object Function]' : 'function',
    '[object Array]'    : 'array',
    '[object Date]'     : 'date',
    '[object RegExp]'   : 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]'     : 'null',
    '[object Object]'   : 'object'
  };
  if(obj instanceof Element) {
    return 'element';
  }
  return map[toString.call(obj)];
}

/**
 * @param {data} 任意参数
 * @returns {Object}
 * @description 任意数据深拷贝
 */
export const deepClone = (data) => {
  let type = getType(data);
  let obj;
  if(type === 'array'){
    obj = [];
  } else if(type === 'object'){
    obj = {};
  } else {
    //不再具有下一层次
    return data;
  }
  if(type === 'array'){
    for(let i = 0, len = data.length; i < len; i++){
      obj.push(deepClone(data[i]));
    }
  } else if(type === 'object'){
    for(let key in data){
      obj[key] = deepClone(data[key]);
    }
  }
  return obj;
}


export const  base64ToBlob= (dataurl) => {
  var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

export const imgUrlToBase64 = (url, callBack) => {
  var image = new Image();

  image.onload=function(){

    // for( let key in image){
    // console.log('key', key)
    // }
    // console.log('image.currentSrc', image.currentSrc)
    var width = image.width;
    var height = image.height;
    _compress( url,
      {width: width, height:height, quality: 0.6, type: ''} ,
      image.name,
      callBack
    )
  };
  image.src= url;

}

/**
 * @param {thisfile} 图片文件
 * @param {callBack} 回调函数
 * @returns {base64, filename}
 * @description 图片压缩并转base64
 */
export const imgToBase64 = (thisfile, callBack) => {
  // var file= $(domName).get(0).files[0]
  var file= thisfile
  var reader = new FileReader();
  reader.readAsDataURL(file)
  reader.onload = function (e) {
    var image = new Image();
    var self= this
    image.src= e.target.result;
    image.onload=function(){
      var width = image.width;
      var height = image.height;
      _compress(self.result,
        {width: width, height:height, quality: 0.6, type: file.type} ,
        file.name,
        callBack
      )
    };
  }
}
export const _compress = (path, obj, name, callBack) => {
  var img = new Image();
  img.src = path;
  img.onload = function () {
    var that = this;
    // 默认按比例压缩
    var w = that.width,
      h = that.height,
      scale = w / h;
    w = obj.width || w;
    h = obj.height || (w / scale);
    var quality = 0.7;  // 默认图片质量为0.7
    //生成canvas
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    // 创建属性节点
    var anw = document.createAttribute("width");
    anw.nodeValue = w;
    var anh = document.createAttribute("height");
    anh.nodeValue = h;
    canvas.setAttributeNode(anw);
    canvas.setAttributeNode(anh);
    ctx.drawImage(that, 0, 0, w, h);
    // 图像质量
    if (obj.quality && obj.quality <= 1 && obj.quality > 0) {
      quality = obj.quality;
    }
    // quality值越小，所绘制出的图像越模糊
    var base64 = canvas.toDataURL(obj.type|| 'image/png', quality);
    // console.log(base64)
    // 返回base64的值
    callBack(base64, name )
  }

}

export const formatMoney =(val, decimals, dec_point, thousands_sep)=> {
  /*
  　　 * 参数说明：
  　　 * number：要格式化的数字
  　　 * decimals：保留几位小数
  　　 * dec_point：小数点符号
  　　 * thousands_sep：千分位符号
  　　 * */
  if(val=== undefined || val=== null ) return ''
  let number = (val + '').replace(/[^0-9+-Ee.]/g, '');
  let n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 2 : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = function(n, prec) {
      let k = Math.pow(10, prec);
      return '' + Math.ceil(n * k) / k;
    };

  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  let re = /(-?\d+)(\d{3})/;
  while(re.test(s[0])) {
    s[0] = s[0].replace(re, "$1" + sep + "$2");
  }

  if((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}
export  const checkVin = (str)=>{
  if(str.length != 17){
    console.log("车架号长度不够");
    return false;
  }
  var vin = {
    "0":0,
    "1":1,
    "2":2,
    "3":3,
    "4":4,
    "5":5,
    "6":6,
    "7":7,
    "8":8,
    "9":9,
    "A":1,
    "B":2,
    "C":3,
    "D":4,
    "E":5,
    "F":6,
    "G":7,
    "H":8,
    "J":1,
    "K":2,
    "L":3,
    "M":4,
    "N":5,
    "P":7,
    "R":9,
    "S":2,
    "T":3,
    "U":4,
    "V":5,
    "W":6,
    "X":7,
    "Y":8,
    "Z":9,
  }
  var power = [8,7,6,5,4,3,2,10,0,9,8,7,6,5,4,3,2];
  var value = 0;
  for(let i =0;i<str.length;i++){
    if(!vin[str[i]] && str[i] != 0){
      //0为false 特殊处理...
      console.log("出现陌生字母",str[i]);
      return false;
    }else{
      value += vin[str[i]] * power[i];
    }
  }
  console.log("计算完毕",value);
  var y =  value % 11;
  console.log("余数",y);
  //转X为10
  var x = 0;
  if(str[8] == "X") x = 10
  else x = str[8];
  if(y == x){
    console.log("校验通过");
    return true;
  }else{
    console.log("校验失败");
    return false;
  }
}

export  const initVer=(v)=>{
  let hxxver = localStorage.getItem('hxxver'), ver= parseFloat(v|| 1);
  if(!hxxver || (hxxver && parseFloat(hxxver)!=ver)){
    localStorage.clear()
    localStorage.setItem('hxxver', ver)
  }
}

export const upImg= ({axios, $store}, callback) => {
    let input = document.createElement("input");
    input.setAttribute("type", 'file');
    input.setAttribute("accept", "image/*");
    input.onchange= ()=>{
      let img= input.files[0]
      // console.log('input.files[0]', input.files[0])
      imgToBase64(img, (base64, name ) => {
        let formdata = new FormData();
        formdata.append('file' , base64ToBlob(base64), name);
        // formdata.append('access_token' , $store.state.user.token);
        axios.post('/tenant/upload/picture', formdata,
          {headers: {'Content-Type': 'multipart/form-data'}}
        ).then( (res) => {
          if(res.success && callback){
            callback(res.data.path, base64)
          }
        })
      })
    }
    input.click()
}
