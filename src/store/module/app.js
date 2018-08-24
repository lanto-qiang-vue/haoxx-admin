import { getBreadCrumbList, setTagNavListInLocalstorage, getMenuByRouter, getTagNavListFromLocalstorage, getHomeRoute, setDict, getDict,getTenant,setTenant} from '@/libs/util'
import routers from '@/router/routers'
export default {
  state: {
    breadCrumbList: [],
    tagNavList: [],
    homeRoute: getHomeRoute(routers),
    local: '',

    dict: getDict() || '',
    tenant: getTenant() || '',
  },
  getters: {
    // menuList: (state, getters, rootState) => getMenuByRouter(routers, rootState.user.access)
    menuList: (state, getters, rootState) => {
      // console.log(rootState)
      return getMenuByRouter(routers, rootState.user)
    },
    loginType: (state, getters, rootState) => {
      // console.log(rootState)
      return rootState.user.userInfo? rootState.user.userInfo.user.lgType: false
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

    setDict (state, info) {
      state.dict = info
      setDict(info)
    },
    setTenant(state,info){
       state.tenant = info
       setTenant(info)
    }
  }
}
