<template>
  <Tooltip v-show="show" class="picking-number"  content="总店授权">
    <div class="text" @click="authrization">
      <span>{{value == 0 ? '总店授权' : '取消总店授权'}}</span>
    </div>
  </Tooltip>
</template>

<script>
  import {setIsAuthorize,getIsAuthorize} from '@/libs/util'
    export default {
        name: "authrization",
      data(){
          return {
            value:0,
            show:false,
          }
      },
       methods:{
         authrization(){
           let text;
           if(this.value ==0) text = "对总店进行授权。总店将有权限切换到当前门店";
           else text = "取消对总店进行授权。总店将有没有权限切换到当前门店"
           this.$Modal.confirm({
             title:'系统提示',
             content:text,
             onOk:()=>{
               this.axios.request({
                 url: '/register/tenantregister/tenantAuthorization',
                 method: 'post',
                 data: {
                   access_token: this.$store.state.user.token
                 }
               }).then(res => {
                 if (res.success === true) {
                  let value = getIsAuthorize();
                  value = value == 0 ? 1 : 0;
                  this.value = value;
                  setIsAuthorize(this.value);
                 }
               })
             }
           });
         }
       },
      mounted(){
        let data = this.$store.state.user.accessMenu;
        /* 0 未授权 1 已授权 2 加强连锁
         * 为加强连锁 跳过权限 直接不显示
         */
        this.value = getIsAuthorize();
        if(this.value != 2){
          for(let i in data){
            if(data[i].funcId == 1010){
              this.show = true;
              break;
            }
          }
        }else{

        }
      }
    }
</script>
<style scoped lang="less">
  .picking-number{
    display: inline-block;
    height: 50px;
    line-height: 50px;
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

