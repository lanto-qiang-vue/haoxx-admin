<template>
<store-info-detail :data="datas" @save="saveStoreInfo"></store-info-detail>
</template>

<script>
  import StoreInfoDetail from '@/hxx-components/store-info-detail.vue'
	export default {
		name: "store-info",
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
