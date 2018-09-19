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
  export default {
    name: "storeRegister",
    components: {StoreInfoDetail,commonTable},
    data(){
      return{
        datas:{},
        tableData:[],
        showTable:false,
        columns:[
        {title: '员工姓名', key: 'USER_NAME', sortable: true, minWidth: 140},
        {title: '职务', key: 'GROUP_NO', sortable: true, minWidth: 140,
          render: (h,params) =>h('span',getName(this.jobtitle,params.row.PROFESSION))
        },
        {title: '员工电话', key: 'TEL_PHONE', sortable: true, minWidth: 140},
      ],
        showId:1,
      }
    },
    mounted(){

    },
    methods:{
      goback(){
        this.showId = 2;
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
