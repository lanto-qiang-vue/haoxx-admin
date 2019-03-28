<template>
<div>
    <a v-for="item in row.chilrens" @click="to(item.TENANT_ID)">{{item.TENANT_NAME}}&nbsp;&nbsp;&nbsp;&nbsp;</a>
</div>
</template>
<script>
  export default {
    props: {
      row: Object
    },
    mounted(){
      console.log(JSON.stringify(this.row));
    },
    methods:{
      to(id){
        this.$router.push({path:'/store-info-list',query:{id:id}});
      }
    }
  };
</script>
