<template>
  <Tooltip class="operation" content="操作指南" v-if="showThis">
    <div class="text" @click="goTo">
      <div class="icon">
        <Icon type="md-help" style="padding-top:1px;" :size="25"/>
      </div>
      <div class="description">操作指南</div>
    </div>
  </Tooltip>
</template>

<script>
  export default {
    name: "operation-description",
    data(){
      return {
        showRule:false,
      }
    },
    mounted(){
      let data = this.$store.state.user.accessMenu;
      let store = this.getFuncId(data,'100708',[]);
      if(store.length == 1){
        this.showRule = true;
      }else{
        this.showRule = false;
      }
    },
    methods: {
      getFuncId(data,id,store){
        for(let i in data){
          if(data[i].funcId == id){
            store.push(id);
            break;
          }else{
            if(data[i].children){
              this.getFuncId(data[i].children,id,store)
            }
          }
        }
        return store;
      },
      goTo() {
        this.$router.push("/operation-description");
      }
    },
    computed:{
      showThis(){
        return this.$store.getters.loginType=='1002'
      },
    }
  }
</script>
<style scoped lang="less">
  .operation {
    display: inline-block;
    height: 50px;
    border-left: 1px solid #F0F0F0;
    border-right: 1px solid #F0F0F0;
    font-size: 14px;
    cursor: pointer;
    .text {
      padding: 0 10px;
      width: 100%;
      height: 100%;
      .icon {
        height: 25px;
        line-height: 25px;
        width: 100%;
        text-align: center;
        width: 28px;
        height: 28px;
        border: 1px solid black;
        border-radius: 50%;
        margin: 0 auto;
        margin-top: 2px
      }
      .description{
        height:25px;line-height:25px;margin-top:-4px;
      }
    }
    .red {
      color: red;
    }
  }

  .picking-number:hover {
    background-color: #F0F0F0;
  }
</style>
