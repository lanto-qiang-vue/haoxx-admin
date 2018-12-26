<template>
  <Tooltip class="picking-number"  content="好修修商城">
    <div class="text" @click="goTo">
      <span style="color:blue">好修修商城</span>
    </div>
  </Tooltip>
</template>

<script>
  export default {
    name: "shop",
    methods:{
      goTo(){
        window.open("http://mall.hoxiuxiu.com/dq/login/login.html?token="+this.$store.state.user.token);
      }
    },
  }
</script>

<style scoped lang="less">
  .picking-number{
    display: inline-block;
    height: 50px;
    line-height: 50x;
    border-left: 1px solid #F0F0F0;
    border-right: 1px solid #F0F0F0;
    font-size: 14px;
    vertical-align: top;
    cursor: pointer;
    .text{
      padding: 0 10px;
      width: 100%;
      height: 100%;
    }
    .red{
      color: red;
    }
  }
  .picking-number:hover{
    background-color: #F0F0F0;
  }
</style>
