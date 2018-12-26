import { getBreadCrumbList, setTagNavListInLocalstorage, getMenuByRouter, getTagNavListFromLocalstorage, getHomeRoute, setDict, getDict,getTenant,setTenant,setOutStatus,getOutStatus,setAccount,getAccount,setAdmin,getAdmin} from '@/libs/util'
import routers from '@/router/routers'
import axios from '@/libs/api.request'
export default {
  state: {
    breadCrumbList: [],
    tagNavList: [],
    homeRoute: getHomeRoute(routers),
    local: '',
    dict: getDict() || '',
    tenant: getTenant() || '',
    outStatus: getOutStatus() || 0,
    pickingNumber: 0,
    windowInnerHeight: window.innerHeight,
    mathRand:0,
  },
  getters: {
    // menuList: (state, getters, rootState) => getMenuByRouter(routers, rootState.user.access)
    menuList: (state, getters, rootState) => {
      // console.log(rootState)
      return getMenuByRouter(routers, rootState.user)
    },
  },
  mutations: {
    setHomeRoute (state){
      state.homeRoute= getHomeRoute(routers)
    },
    setBreadCrumb (state, routeMetched) {
      state.breadCrumbList = getBreadCrumbList(routeMetched, state.homeRoute)
    },
    setTagNavList (state, list) {
      if (list) {
        state.tagNavList = [...list]
        setTagNavListInLocalstorage([...list])
      } else state.tagNavList = getTagNavListFromLocalstorage()
    },
    addTag (state, item, type = 'unshift') {
      if (state.tagNavList.findIndex(tag => tag.name === item.name) < 0) {
        if (type === 'push') state.tagNavList.push(item)
        else state.tagNavList.unshift(item)
        setTagNavListInLocalstorage([...state.tagNavList])
      }
    },
    setLocal (state, lang) {
      state.local = lang
    },
    setAdmin(state,info){
      state.admin = info;
      setAdmin(info);
    },
    setAccount(state,info){
      state.account = info;
      setAccount(info)
    },
    // getAccount(){
    //   return 22;
    // },
    setDict (state, info) {
      state.dict = info
      setDict(info)
    },
    setTenant(state,info){
       state.tenant = info
       setTenant(info)
    },
    setOutStatus(state,type){
      state.outStatus = type
      setOutStatus(type)
    },
    setPickingNumber(state,num){
      state.pickingNumber = num
    },
    setWindowInnerHeight(state,num){
      state.windowInnerHeight = num
    },
    setMathRand(state,num){
      state.mathRand = num;
    }
  },
  actions: {
    getPickingNumber ({ state, commit, rootState }) {
      return new Promise((resolve, reject) => {
        axios.request({
          url: '/tenant/repair/part_count/repair_part?access_token='+ rootState.user.token,
          method: 'get',
        }).then(res => {
          if (res.success === true) {
            commit('setPickingNumber', res.data[0].num)
            resolve(res)
          }else reject(res)
        }).then(res => {
          reject(res)
        })
      })
    }
  }
}
