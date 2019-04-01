<template>
  <Layout style="height: 100%" class="main">
    <Sider hide-trigger  collapsible :width="width" :collapsed-width="64" v-model="collapsed" @on-collapse="onCollapse" class="left-sider" :style="{overflow: 'hidden'}">
      <side-menu v-show="showMenu" accordion ref="sideMenu" :active-name="$route.name" :collapsed="collapsed" @on-select="turnToPage" :menu-list="menuList">
        <!-- 需要放在菜单上面的内容，如Logo，写在side-menu标签内部，如下 -->
        <div class="logo-con">
          <!--<img v-show="!collapsed" :src="maxLogo" key="max-logo" />-->
          <!--<img v-show="collapsed" :src="minLogo" key="min-logo" />-->
          <img src="../../assets/images/haoxiuxiu-logo2.png" />
           <p v-show="!collapsed">门店管理系统</p>
           <!--<p v-show="collapsed" >好修修</p>-->
        </div>
      </side-menu>
    </Sider>
    <Layout>
      <Header class="header-con">
        <header-bar :collapsed="collapsed" @on-coll-change="handleCollapsedChange">
          <fullscreen v-model="isFullscreen"/>
          <!--<change-password></change-password>-->
          <picking-number ></picking-number>
          <user slot="right" :user-avator="userAvator"/>
          <!--<shop slot="right"></shop>-->
          <!--<authrization slot="right" v-if="!this.$store.state.user.userInfo.isManage && this.$store.state.user.userInfo.user.lgType == 1002"></authrization>-->
          <authrization slot="right" v-if="this.$store.state.user.userInfo.user.lgType == 1002"></authrization>
          <operation-description slot="right"></operation-description>
          <!--<language @on-lang-change="setLocal" style="margin-right: 10px;" :lang="local"/>-->
        </header-bar>
      </Header>
      <Content class="main-content-con">
        <Layout class="main-layout-con">
          <protocol :protocolShow="protocolShow" :type="2"></protocol>
          <div class="tag-nav-wrapper">
            <tags-nav :value="$route" @input="handleClick" :list="tagNavList" @on-close="handleCloseTag"/>
          </div>
          <Content class="content-wrapper">
            <keep-alive :include="cacheList">
              <router-view/>
            </keep-alive>
          </Content>
        </Layout>
      </Content>
    </Layout>
  </Layout>
</template>
<script>
  import protocol from '@/hxx-components/protocol.vue';
import SideMenu from './components/side-menu'
import Shop from './components/shop/shop.vue';
import Authrization from './components/authrization/authrization.vue';
import OperationDescription from './components/operation-description/operation-description.vue';
import HeaderBar from './components/header-bar'
import TagsNav from './components/tags-nav'
import User from './components/user'
import Fullscreen from './components/fullscreen'
import Language from './components/language'
import PickingNumber from './components/picking-number/picking-number.vue'
import ChangePassword from './components/change-password/change-password.vue'
import { mapMutations, mapActions } from 'vuex'
import { getNewTagList, getNextName } from '@/libs/util'
import minLogo from '@/assets/images/logo-min.jpg'
import maxLogo from '@/assets/images/logo.jpg'
import './main.less'
export default {
  name: 'Main',
  components: {
    SideMenu,
    HeaderBar,
    Language,
    TagsNav,
    Fullscreen,
    User,
    PickingNumber,
    ChangePassword,
    Shop,
    protocol,
    Authrization,
    OperationDescription
  },
  data () {
    return {
      collapsed: false,
      protocolShow:false,
      minLogo,
      maxLogo,
      width:250,
      isFullscreen: false,
      showMenu: true
    }
  },
  computed: {
    tagNavList () {
      return this.$store.state.app.tagNavList
    },
    tagRouter () {
      return this.$store.state.app.tagRouter
    },
    userAvator () {
      return this.$store.state.user.avatorImgPath
    },
    cacheList () {
      return this.tagNavList.length ? this.tagNavList.filter(item => !(item.meta && item.meta.notCache)).map(item => item.name) : []
    },
    menuList () {
      return this.$store.getters.menuList
    },
    local () {
      return this.$store.state.app.local
    },
    isShow(){
      // alert(this.$store.state.app.outStatus);
      return this.$store.state.app.outStatus
    }
  },
  methods: {
    ...mapMutations([
      'setBreadCrumb',
      'setTagNavList',
      'addTag',
      'setLocal',
      'setHomeRoute'
    ]),
    ...mapActions([
      'handleLogin'
    ]),
    onCollapse(state){
      // console.log(state)
      let self= this
      this.showMenu= false
      setTimeout(function () {
        self.showMenu= true
      },300)
    },
    turnToPage (name) {
      if (name.indexOf('isTurnByHref_') > -1) {
        window.open(name.split('_')[1])
        return
      }
      this.$router.push({
        name: name
      })
    },
    handleCollapsedChange (state) {
      this.collapsed = state
    },
    handleCloseTag (res, type, name) {
      const nextName = getNextName(this.tagNavList, name)
      this.setTagNavList(res)
      let openName = ''
      if (type === 'all') {
        if(this.$store.state.user.userInfo.user.lgType == 1001){
          this.turnToPage('admin-home')
        }else{
          this.turnToPage('home')
        }
        openName = 'home'
      } else if (this.$route.name === name) {
        if(this.$store.state.user.userInfo.user.lgType == 1001 && nextName == 'home'){
          this.$router.push({ name:"admin-home"})
          openName = "admin-home"
        }else{
          this.$router.push({ name: nextName })
          openName = nextName
        }
      }
      this.$refs.sideMenu.updateOpenName(openName)
    },
    handleClick (item) {
      this.turnToPage(item.name)
    }
  },
  watch: {
    '$route' (newRoute) {
      this.setBreadCrumb(newRoute.matched)
      this.setTagNavList(getNewTagList(this.tagNavList, newRoute))
    }
  },
  mounted () {
    /**
     * @description 初始化设置面包屑导航和标签导航
     */
    this.setTagNavList()
    // this.addTag(this.$store.state.app.homeRoute)
    this.setHomeRoute()
    this.$store.state.app.homeRoute? this.addTag(this.$store.state.app.homeRoute): false;
    this.setBreadCrumb(this.$route.matched)
    // 设置初始语言
    this.setLocal(this.$i18n.locale)
    //检查协议字段
    // this.$store.state.user.userInfo.user.isAgreement = 3;
    // let data = this.$store.state.user.userInfo;
    // data.user.isAgreement = 1;
    // this.$store.commit('setUser',data)
    // console.log(JSON.stringify(data.user));
    // console.log(this.$store.state.user.userInfo.user.isAgreement);
if(this.$store.state.user.userInfo.user.lgType == 1001) this.width = 240;
else this.width = 200;
    if(this.$store.state.user.userInfo.user.isAgreement == 0){
       this.protocolShow = true;
    }
    // 文档提示
    // this.$Notice.info({
    //   title: '想快速上手，去看文档吧',
    //   duration: 0,
    //   render: (h) => {
    //     return h('p', {
    //       style: {
    //         fontSize: '13px'
    //       }
    //     }, [
    //       '点击',
    //       h('a', {
    //         attrs: {
    //           href: 'https://lison16.github.io/iview-admin-doc/#/',
    //           target: '_blank'
    //         }
    //       }, 'iview-admin2.0文档'),
    //       '快速查看'
    //     ])
    //   }
    // })
  }
}
</script>
