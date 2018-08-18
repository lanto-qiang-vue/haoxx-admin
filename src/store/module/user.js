// import { login, logout, getUserInfo } from '@/api/user'
import { setToken, getToken, setUser, getUser, setMenu, getMenu } from '@/libs/util'
import router from '@/router'

export default {
  state: {
    // userName: '',
    // userId: '',
    // avatorImgPath: '',
    // access: '',

    token: getToken() || '',
    userInfo: getUser() || '',
    accessMenu: getMenu() || ''
  },
  mutations: {
    // setAvator (state, avatorPath) {
    //   state.avatorImgPath = avatorPath
    // },
    // setUserId (state, id) {
    //   state.userId = id
    // },
    // setUserName (state, name) {
    //   state.userName = name
    // },
    // setAccess (state, access) {
    //   state.access = access
    // },

    setToken (state, token) {
      state.token = token
      setToken(token)
    },
    setUser (state, info) {
      state.userInfo = info
      setUser(info)
    },
    setMenu (state, info) {
      state.accessMenu = info
      setMenu(info)
    }
  },
  actions: {
    // 登录
    // handleLogin ({ commit }, {userName, password}) {
    //   userName = userName.trim()
    //   return new Promise((resolve, reject) => {
    //     login({
    //       userName,
    //       password
    //     }).then(res => {
    //       const data = res.data
    //       commit('setToken', data.token)
    //       resolve()
    //     }).catch(err => {
    //       reject(err)
    //     })
    //   })
    // },
    // 退出登录
    handleLogOut ({ state, commit }) {
      return new Promise((resolve, reject) => {
        // logout(state.token).then(() => {
        //   commit('setToken', '')
        //   commit('setAccess', [])
        //   resolve()
        // }).catch(err => {
        //   reject(err)
        // })
        // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口

        let loginType = state.userInfo.user.lgType
        commit('setToken', '')
        commit('setUser', '')
        commit('setMenu', '')
        router.push({
          name: loginType == '1002' ? 'login' : 'admin-login'
        })
        resolve()
      })
    }
    // 获取用户相关信息
    // getUserInfo ({ state, commit }) {
    //   return new Promise((resolve, reject) => {
    //     getUserInfo(state.token).then(res => {
    //       const data = res.data
    //       commit('setAvator', data.avator)
    //       commit('setUserName', data.user_name)
    //       commit('setUserId', data.user_id)
    //       commit('setAccess', data.access)
    //       resolve(data)
    //     }).catch(err => {
    //       reject(err)
    //     })
    //   })
    // }
  }
}
