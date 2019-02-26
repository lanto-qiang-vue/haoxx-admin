<template>
  <div style="width:100%;height:100%;">
    <Modal
      v-model="showModal1"
      :fullscreen="true"
      :mask-closable="false"
      class="Hclass"
      :scrollable="true"
      :closable="false"
      :transfer= "false"
      :footer-hide="true"
      :transition-names="['', '']">
      <div slot="header" style="height:52px;">
        <div class="user-avator-dropdown" style="float:right;margin-top:-10px;">
          <Dropdown trigger="click" @on-click="handle">
            <div class="login-user">
              <p style="line-height:40px;height:30px;">{{loginName}}</p>
              <span>注册门店</span>
            </div>
            <div class="head" style="padding-top:10px;">
              <Avatar  icon="ios-person" size="large" class="avatar"/>
            </div>
            <!--<Icon :size="18" type="md-arrow-dropdown"></Icon>-->
            <DropdownMenu slot="list">
              <DropdownItem name="logout" style="width: 250px">退出登录</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      <!--<div style="height:10px;"></div>-->
  <store-info-detail :data="datas" @save="saveStoreInfo" @register="saveRegister" :type="1" @goback="goback"></store-info-detail>
    </Modal>
    <Modal
      v-model="showModal2"
      :fullscreen="true"
      class="Hclass"
      style="min-width:600px;"
      :mask-closable="false"
      :scrollable="true"
      :closable="false"
      :transfer= "false"
      :footer-hide="false"
      :transition-names="['', '']"
    >
      <div slot="header" style="height:52px;border:none;">
        <div class="user-avator-dropdown" style="float:right;margin-top:-10px;">
          <Dropdown trigger="click" @on-click="handle">
            <div class="login-user">
              <p style="line-height:40px;height:30px;">{{loginName}}</p>
              <span>注册门店</span>
            </div>
            <div class="head" style="padding-top:10px;">
              <Avatar icon="ios-person" size="large" class="avatar"/>
            </div>
            <DropdownMenu slot="list">
              <DropdownItem name="logout" style="width: 250px">退出登录</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    <!--<div style="height:10px;"></div>-->
    <common-table :showPage="false" :loading="tableType" v-model="tableData" :columns="columns"  @onRowDblclick="dbclick" :showSearch="false" :showOperate="false"  :show="showTable">
    </common-table>
      <div slot="footer" style="text-align:center;">
        <Button type="primary" @click="goback">注册门店</Button>
        <Button @click="getList()">刷新</Button>
      </div>
    </Modal>
    <Modal
      v-model="showModal"
      class="table-modal-detail pclass"
      width="90"
      :mask-closable="false"
      title="详情"
      :scrollable="true"
      :transfer= "false"
      :footer-hide="true"
      :transition-names="['', '']">
      <store-info-detail :data="detail" @register="saveRegister" :type="1" @goback="back"></store-info-detail>
    </Modal>
  </div>
</template>
<script>
  import { mapActions } from 'vuex'
  import StoreInfoDetail from '@/hxx-components/store-info-detail.vue'
  import commonTable from '@/hxx-components/common-table.vue'
  import { getName, getDictGroup, getCreate,getTenantId } from '@/libs/util.js'
  export default {
    name: "storeRegister",
    components: {StoreInfoDetail,commonTable},
    data(){
      return{
        datas:{},
        tableData:[],
        showModal1:true,
        showModal2:false,
        tableType:false,
        showModal:false,
        detail:{},
        showTable:false,
        tenantId:0,
        columns:[
          {title: '门店商户号', key: 'TENANT_NUM', sortable: true, minWidth: 140},
          {title: '门店名称', key: 'TENANT_NAME', sortable: true, minWidth: 140},
          {title: '门店地址', key: 'TENANT_ADD', sortable: true, minWidth: 140},
          {title: '联系人姓名', key: 'LINK_MAN', sortable: true, minWidth: 140},
          {title: '联系方式', key: 'LINK_TEL', sortable: true, minWidth: 140},
          {title: '营业状态', key: 'STATUS', sortable: true, minWidth: 140,
            render: (h,params) =>h('span',getName(this.statusList,params.row.STATUS))
          },
          {title: '审核状态', key: 'CHECK_STATUS', sortable: true, minWidth: 140,
            // render: (h,params) =>h('span',getName(this.checkList,params.row.CHECK_STATUS))
            render: (h, params) => {
              var buttonContent= getName(this.checkList,params.row.CHECK_STATUS);
              let disabled = false;
              switch(params.row.CHECK_STATUS){
                case "10351001":
                  var buttonStatus = "primary";
                  break;
                case "10351002":
                  var buttonStatus = "success";
                  buttonContent = "进入门店";
                  break;
                default:
                  var buttonStatus = "error";
                  break;
              }
              if(buttonStatus == 'success' && params.row.CLIENTAUTHORIZATION != 1) disabled = true;
              if(params.row.TENANT_ID == this.tenantId){

              }
              return h('div', [
                h('Button', {
                  props: {
                    type: buttonStatus,
                    size: 'large',
                    disabled:disabled,
                  },
                  style: {
                    width:"100px",
                    textAlign: "center",
                  },
                  on: {
                    click: (index) => {
                      if(buttonStatus == 'success'){
                        this.switchStore(params.row.TENANT_ID);
                      }
                    }
                  }
                }, buttonContent),
              ]);
            }
          },
      ],
        showId:1,
      }
    },
    mounted(){
      this.tenantId = getTenantId();
      if(this.$store.state.app.outStatus == 1){
        this.showModal1 = false;
        this.showModal2 = true;
      }
      if(this.$store.state.app.outStatus != 0)this.getList();
    },
    computed:{
      statusList(){
      return getDictGroup(this.$store.state.app.dict,'1034');
      },
      checkList(){
      return getDictGroup(this.$store.state.app.dict,'1035');
      },
      loginName(){
        return  this.$store.state.user.userInfo.user.userName;
      }
    },
    methods:{
      ...mapActions([
        'handleLogOut',
        'getPickingNumber'
      ]),
handle(){
  this.handleLogOut().then(() => {

  })
},
      back(){
        this.showModal = false;
      },
      dbclick(row){
        this.axios.request({
          url: '/register/tenantregister/getTenantPicture',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            tenantId:row.TENANT_ID,
            page:1,
            limit:25
          }
        }).then(res => {
          if (res.success === true) {
            this.detail = row;
              this.detail["ROAD_FILE_PATH"] = res.data[0].ROAD_FILE_PATH;
              this.detail["BUS_FILE_PATH"] = res.data[0].BUS_FILE_PATH;
              this.detail["TENANT_FILE_PATH"] = res.data[0].TENANT_FILE_PATH;
            this.showModal = true;
          }
        })
      },
      getList(){
        this.showTable = Math.random();
        this.tableType = true;
        this.axios.request({
          url: '/register/tenantregister/list',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            page:1,
            limit:25
          }
        }).then(res => {
          if (res.success === true) {
            this.tableType = false;
            this.tableData = res.data;
          }
        })
      },
      goback(){
        this.showModal1 = !this.showModal1;
        this.showModal2 = !this.showModal2;
        this.showTable = Math.random();
      },
      getStoreInfo(){
        this.axios.request({
          url: '/tenant/basedata/tenantinfo/info',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token
          }
        }).then(res => {
          if (res.success === true) {
            this.datas= res.data
          }
        })
      },
      saveStoreInfo( data){
        this.axios.request({
          url: '/tenant/basedata/tenantinfo/save',
          method: 'post',
          data: {
            data: JSON.stringify(data),
            access_token: this.$store.state.user.token
          }
        }).then(res => {
          if (res.success === true) {
            this.getStoreInfo()
            this.$Message.success('保存成功');
          }
        })
      },
      saveRegister(data){
        this.$Spin.show();
        this.axios.request({
          url: '/register/tenantregister/save',
          method: 'post',
          data: {
            data: JSON.stringify(data),
            access_token: this.$store.state.user.token
          }
        }).then(res => {
          if (res.success === true) {
            this.showModal = false;
            setTimeout(this.hint,1000);
          }else{
            setTimeout(()=>{
              this.$Modal.error({
                title:'系统提示',
                content:res.Exception.message,
              });
            },300);
            this.$Spin.hide();
          }
        })
      },
      hint(){
        this.$Spin.hide();
        this.$Modal.success({title:'系统提示',content:'门店注册成功，请等待门店审核成功后即可登录系统管理该门店！',onOk:this.fllow});
      },
      fllow(){
        this.getList();
        this.showModal2 = true;
        this.showModal1 = false;
      },
      switchStore(id){
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
