<template>
<Tooltip class="picking-number" content="维修领料" v-if="this.$store.getters.loginType=='1002'" >
<div class="text" @click="goTo">
  <span>维修领料(</span><span class="red">{{num}}</span><span>)</span>
</div>
</Tooltip>
</template>

<script>
  import { mapActions } from 'vuex'
	export default {
		name: "picking-number",
    computed:{
		  num(){
		    return this.$store.state.app.pickingNumber
      }
    },
    mounted(){
      this.getPickingNumber()
    },
    methods: {
      ...mapActions([
        'getPickingNumber'
      ]),
      goTo(){
        console.log('goTo-picking')
      }
    }
	}
</script>

<style scoped lang="less">
.picking-number{
  display: inline-block;
  height: 64px;
  line-height: 64px;
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
