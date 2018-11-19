<template>
<Tooltip class="picking-number" v-show="showRule" content="维修领料" v-if="showThis" >
<div class="text" @click="goTo">
  <span>维修领料(</span><span class="red">{{num}}</span><span>)</span>
</div>
</Tooltip>
</template>

<script>
  import { mapActions } from 'vuex'
	export default {
		name: "picking-number",
    data(){
		  return {
		    showRule:false,
      }
    },
    computed:{
		  num(){
        return this.$store.state.app.pickingNumber || 0;
      },
      showThis(){
        return this.$store.getters.loginType=='1002'
      }
    },
    mounted(){
      if(this.showThis) this.getPickingNumber();
      let data = this.$store.state.user.accessMenu;
      let store = this.getFuncId(data,'100201',[]);
      if(store.length == 1){
        this.showRule = true;
      }else{
        this.showRule = false;
      }
    },
    methods: {
      ...mapActions([
        'getPickingNumber'
      ]),
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
      goTo(){
        this.$router.push('/maintain-pick')
      }
    }
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
