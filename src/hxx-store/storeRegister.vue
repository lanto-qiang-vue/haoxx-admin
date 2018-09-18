<template>
  <div style="width:90%;height:80%;background:red;margin:0 auto;">
  <store-info-detail :data="datas" @save="saveStoreInfo"></store-info-detail>
  </div>
</template>

<script>
  import StoreInfoDetail from '@/hxx-components/store-info-detail.vue'
  export default {
    name: "storeRegister",
    components: {StoreInfoDetail},
    data(){
      return{
        datas:{}
      }
    },
    mounted(){
      this.getStoreInfo()
    },
    methods:{
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
      }
    }
  }
</script>

<style scoped>

</style>
