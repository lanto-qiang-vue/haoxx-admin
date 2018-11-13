<template>
  <div>
    <InputNumber v-model="xValue" @on-change="change"></InputNumber>
  </div>
</template>

<script>
  export default {
    name: "unit-input",
    props:['params','min','type','data','switchType','time'],
    data() {
      return {
        xValue:1,
        timer:null,
      }
    },
    mounted(){
      this.xValue = this.params;
    },
    watch:{
    },
    methods:{
      change(e){
        let self = this;
        let value = 0;
        if(this.type == 'int'){
           value = e > this.min ? parseInt(e) : parseInt(this.min);
        }else{
          value = e > this.min ? e : this.min;
        }
         clearTimeout(this.timer);
         this.timer = setTimeout(function(){
           switch(self.switchType){
             case 0:
               break;
             case 1:
               // console.log(JSON.stringify(self.data));
               if(value <self.data.MIN_SHOP_PRICE){
                 self.$Modal.info({title:'系统提示',content:'采购单价不能低于最低采购价,系统已为您自动调整为最低采购价！'});
                 value = self.data.MIN_SHOP_PRICE;
               }
               if(value > self.data.MAX_SHOP_PRICE){
                 self.$Modal.info({title:'系统提示',content:'采购单价不能高于最高采购价,系统已为您自动调整为最高采购价！'});
                 value = self.data.MAX_SHOP_PRICE;
               }
               break;
             case 4:
               if(value > self.data.SUM_MONEY){
                 value = self.data.SUM_MONEY;
               }
               break;
           }
           self.$emit('change',value);
           self.xValue = value;
        },self.time);
      }
    }
  }
</script>

<style scoped>

</style>
