<!--门店信息-->
<template>

    <div >
      <img :src="img" style=""/>
    </div>
    
</template>

<script>
  

  export default {
    components: {},
    name: "store-img",
    data() {
      return {
        img:''
      }
    },
    computed: {
      
    },
    activated(){
      this.getRouterData();
    },
    mounted() {
      
    },
    methods: {
      getRouterData(){
        var queryData=this.$route.query;
        if(queryData.img){
            
            this.img=queryData.img;
            console.log("有值",queryData);
        }else{
            console.log("没有值");
        }
        
      },
    }
  }
</script>

<style lang="less">

</style>
