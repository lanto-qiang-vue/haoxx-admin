<template>
  <div>
    <unit-select :data="data" @refresh="refresh"></unit-select>
    <unit-select :data="[]"></unit-select>
    <unit-select :data="[]"></unit-select>
    <unit-select :data="[]"></unit-select>
  </div>
</template>

<script>
  import unitSelect from '@/hxx-components/unit-select.vue'

  export default {
    name: "my-select",
    components: {unitSelect},
    data() {
      return {
        data:[],
      }
    },
    mounted(){
      // this.refresh();
    },
    methods: {
      refresh(){
        this.data=[];
        this.axios.request({
          url: '/tenant/repair/ttrepairworkorder/getShopClassList',
          method: 'post',
          data: {
            node: 0,
            access_token: this.$store.state.user.token
          }
        }).then(res => {
          if (res.success === true) {
            for(let i in res.data){
              var obj={code:'',itemId:''};
              obj.code=res.data[i].text;
              obj.itemId=res.data[i].itemId;
              this.data.push(obj);
            }
            console.log(JSON.stringify(this.data));
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
