<template>
  <div style="width:100%;height:100%;">
  <store-info-detail :data="datas" v-show="showId == 1" @save="saveStoreInfo" @register="saveRegister" @goback="goback"></store-info-detail>
    <common-table v-show="showId == 2" v-model="tableData" :columns="columns" :showSearch="false" :showOperate="false"  :show="showTable">
    </common-table>
  </div>
</template>
<script>
  import StoreInfoDetail from '@/hxx-components/store-info-detail.vue'
  import commonTable from '@/hxx-components/common-table.vue'
  import { getName, getDictGroup, getCreate } from '@/libs/util.js'
  export default {
    name: "storeRegister",
    components: {StoreInfoDetail,commonTable},
    data(){
      return{
        datas:{},
        tableData:[],
        showTable:false,
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
            render: (h,params) =>h('span',getName(this.checkList,params.row.CHECK_STATUS))
          },
      ],
        showId:1,
      }
    },
    mounted(){

    },
    computed:{
      statusList(){
      return getDictGroup(this.$store.state.app.dict,'1034');
      },
      checkList(){
      return getDictGroup(this.$store.state.app.dict,'1035');
      }
    },
    methods:{
      getList(){
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
            this.tableData = res.data;
          }
        })
      },
      goback(){
        this.showId = 2;
        this.showTable = Math.random();
        this.getList();
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
        this.axios.request({
          url: '/register/tenantregister/save',
          method: 'post',
          data: {
            data: JSON.stringify(data),
            access_token: this.$store.state.user.token
          }
        }).then(res => {
          if (res.success === true) {
            setTimeout(this.hint,1000);
          }
        })
      },
      hint(){
        this.$Modal.success({title:'系统提示',content:'门店注册成功，请等待门店审核成功后即可登录系统管理该门店！'});
      }
    }
  }
</script>

<style scoped>

</style>
