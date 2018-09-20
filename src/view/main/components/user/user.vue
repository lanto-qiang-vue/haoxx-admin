<template>
  <div class="user-avator-dropdown">
    <div class="switch-store" v-if="this.$store.state.user.userInfo.isManage">
      <Dropdown trigger="click" placement="bottom-end"
                @on-click="openSwitchStore" @on-visible-change="dropdownVisible">
        <Tooltip content="点击切换门店" placement="bottom" :disabled="disabledDropdown" style="width: 60px">
          <Icon custom="fa fa-exchange" :size="24"></Icon>
        </Tooltip>
        <DropdownMenu slot="list">
          <div class="store-block">
            <div class="title">
              <Button type="primary" custom-icon="fa fa-plus" @click="linkTo"  style="margin-right: 10px">注册新门店</Button>
              <Button  custom-icon="fa fa-refresh" @click="getStoreList">刷新</Button>
            </div>
            <Table :columns="columns" :data="data" size="small" stripe border :loading="loading" ></Table>
          </div>
        </DropdownMenu>
      </Dropdown>
    </div>
    <Dropdown trigger="click" @on-click="handleClick">
      <div class="login-user">
        <p :class="{on: this.$store.getters.loginType=='1001'}">{{loginUserName}}</p>
        <span>{{storeName}}</span>
      </div>
      <div class="head">
        <Avatar :src="userAvator" icon="ios-person" size="large" class="avatar"/>
      </div>
      <!--<Icon :size="18" type="md-arrow-dropdown"></Icon>-->
      <DropdownMenu slot="list">
        <DropdownItem name="logout" style="width: 250px">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { getName, getDictGroup } from '@/libs/util.js'
export default {
  name: 'User',
  props: {
    userAvator: {
      type: String,
      default: ''
    }
  },
  data(){
    return{
      disabledDropdown: false,
      columns:[
        {title: '序号',  minWidth: 60, type: 'index'},
        {title: '门店商户号', key: 'TENANT_NUM', minWidth: 100},
        {title: '门店名称', key: 'TENANT_NAME', minWidth: 150},
        {title: '操作', key: 'CHECK_STATUS', minWidth: 100,
          render: (h, params) => {
            // console.log(params)
            let text= '', disabled= true, val= params.row[params.column.key];
            text= getName(this.CHECK_STATUS_group, val)
            if(val== '10351002') {
              disabled= false;
              text='点击切换'
            }
            if(params.row.TENANT_ID== this.$store.state.user.userInfo.tenant.tenantId){
              disabled= true
              text= '当前门店';
            }
          return h( 'Button', {
            style:{
              fontSize: '12px'
            },
            props: {
              type: 'info',
              size: 'small',
              disabled: disabled
            },
            on: {
              click: () => { this.switchStore(disabled, params.row.TENANT_ID)}
            },
          }, text)}
        },
      ],
      data: [],
      loading: false
    }
  },
  computed: {
    loginUserName(){
      return this.$store.state.user.userInfo?this.$store.state.user.userInfo.user.userName:''
    },
    storeName(){
      return this.$store.getters.loginType=='1002'?
        ('(商户号：'+ this.$store.state.user.userInfo.tenant.tenantNum+')'+
        this.$store.state.user.userInfo.tenant.tenantName) : ''
    },
    CHECK_STATUS_group(){
      return getDictGroup(this.$store.state.app.dict, '1035')
    }
  },
  methods: {
    ...mapActions([
      'handleLogOut',
      'getPickingNumber'
    ]),
    handleClick (name) {
      switch (name) {
        case 'logout': {
          this.handleLogOut().then(() => {

          })
          break
        }
      }
    },
    linkTo(){
      this.$router.push('/storeRegister');
    },
    getStoreList(){
      this.loading=true
      this.axios.request({
        url: '/register/tenantregister/list',
        method: 'post',
        data: {
          page: 1,
          start: 0,
          limit: 100,
          access_token: this.$store.state.user.token
        }
      }).then(res => {
        if (res.success === true) {
          this.data= res.data
          this.loading= false
        }
      })
    },
    openSwitchStore(){
      if(!this.data.length) this.getStoreList()
    },
    switchStore(disabled, id){
      if(disabled) return
      this.$Spin.show();
      this.axios.request({
        url: '/register/tenantregister/changeTenant',
        method: 'post',
        data: {
          tenantId: id,
          access_token: this.$store.state.user.token
        }
      }).then(res => {
        if (res.success === true) {
          this.$store.commit('setToken', res.data)
          this.getPickingNumber()
          let getInfo = Promise.all([ new Promise((resolve, reject) => {
            this.axios.request({
              url: '/tenant/common/getLoginUser',
              method: 'post',
              data: {
                access_token: this.$store.state.user.token
              }
            }).then(res => {
              if (res.success === true) {
                this.$store.commit('setUser', res.data)
                resolve()
              } else reject()
            }).then(err => {
              reject(err)
            })
          }),
            new Promise((resolve, reject) => {
              this.axios.request({
                url: '/tenant/common/getMenu',
                method: 'post',
                data: {
                  node: 'root',
                  access_token: this.$store.state.user.token
                }
              }).then(res => {
                if (res.success === true) {
                  this.$store.commit('setMenu', res.children)
                  resolve()
                } else reject()
              }).then(err => {
                reject(err)
              })
            })
          ])
          getInfo.then(() => {
            let route=[]
            this.$router.push({name: 'home'})
            route.push({
              name: this.$route.name,
              path: this.$route.path,
              meta: this.$route.meta,
            })
            // console.log(route)
            this.$store.commit('setTagNavList', route)
            this.$Spin.hide()
          })
        }
      })
    },
    dropdownVisible(visibel){
      // console.log(visibel)
      if(visibel) {
        if(!this.data.length) this.getStoreList()
        this.disabledDropdown= true
      }
      else this.disabledDropdown= false
    }
  }
}
</script>

<style scoped lang="less">
.user-avator-dropdown{
  cursor: pointer;
  display: inline-block;
  vertical-align: middle;
  font-size: 0;
  .switch-store{
    display: inline-block;
    width: 60px;
    text-align: center;
    border-left: 1px solid #F0F0F0;
    border-right: 1px solid #F0F0F0;
    .store-block{
      width: 420px;
      text-align: left;
      .title{
        padding: 0 10px;
        overflow: hidden;
        margin-bottom: 5px;
        .ivu-btn{
          /*vertical-align: top;*/
          float: left;
        }
      }

    }
  }
  .login-user{
    display: inline-block;
    height: 64px;
    text-align: right;
    vertical-align: middle;
    padding-left: 5px;
    padding-right: 5px;
    border-right: 1px solid #F0F0F0;
    p{
      line-height: 34px;
      font-size: 16px;
      vertical-align: top;
    }
    p.on{
      line-height: 64px;
    }
    span{
      vertical-align: top;
      line-height: 24px;
      font-size: 13px;
      color: #2D8cF0;
    }
  }
  .head{
    padding: 0 10px;
    height: 64px;
    display: inline-block;
    vertical-align: top;
    .avatar{
      background-color: #2D8cF0;
      vertical-align: middle;
    }
  }
  .switch-store:hover, .login-user:hover, .head:hover{
    background-color: #F0F0F0;
  }
}
</style>
<style lang="less">
  .store-block{
    .ivu-table{
      line-height: 40px;
    }
  }
</style>
