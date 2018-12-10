<template>
<div class="column-input" @click="click">
  <InputNumber v-if="type=='number'" ref="number" :min="min" :max="max" v-model="val" v-show="show=='number'"
               @on-blur="blurFun"  @on-focus="focusFun" @on-change="change" :disabled='disabled' style="text-align: right;"></InputNumber>
</div>
</template>

<script>
	export default {
		name: "column-input",
    props: ['params', 'type', 'max', 'min', 'placeholder','contentData','contentData1','allType','disabled'],
    data(){
		  return{
		    val: null,
        show: 'number',
        timer:null,
        newVal:0,
        flags:true,
      }
    },
    computed:{
        inputType(){
            return this.type=='number'?'text': this.type
        }
    },
    mounted(){
		  console.log(this.params,this.params.column,this.params.column.key);
      let val= this.params.row[this.params.column.key]
      this.val= this.type=='number'? parseInt((val||0)): val
      this.newVal=this.type=='number'? parseInt((val||0)): val
    },
    methods:{
      click(){
          
      },
      focusFun(){
        this.flags=false;
        console.log(this.flags);
      },
      change(val){
        console.log('进行改变中',val);
        if(this.allType){
            this.newVal=val;
            console.log('dddddddd222',self.contentData,self.contentData1);
            if(this.flags){
                let self= this
                clearTimeout(this.timer);
                this.timer = setTimeout(function(){
                    console.log('dddddddd',self.contentData,self.contentData1);
                  if(self.newVal>self.contentData){
                          self.$Modal.confirm({
                              title:"系统提示!",
                              content:"配件单价不能高于最高销售价,系统已为您自动调整为最高价！",
                          })
                          self.newVal=self.params.row.MAX_SALES_PRICE;
                          self.val=self.params.row.MAX_SALES_PRICE;
                          val=self.params.row.MAX_SALES_PRICE;
                  }else if(self.newVal<self.contentData1){
                          self.$Modal.confirm({
                              title:"系统提示!",
                              content:"配件单价不能低于最低销售价,系统已为您自动调整为最低价！",
                          })
                          self.newVal=self.params.row.MIN_SALES_PRICE;
                          self.val=self.params.row.MIN_SALES_PRICE;
                          val=self.params.row.MIN_SALES_PRICE;
                  }
                  self.$emit('change', val)
                },1000)
                this.flags=true;
            }
        }else{
            this.newVal=val;
            if(this.flags){
                let self= this
                clearTimeout(this.timer);
                this.timer = setTimeout(function(){
                  if(self.newVal>self.contentData){
                          self.$Modal.confirm({
                              title:"系统提示!",
                              content:"优惠金额过大",
                          })
                          self.newVal=0;
                          self.val=0;
                          val=0;
                  }
                  self.$emit('change', val)
                },1000)
                this.flags=true;
            }
        }
        
        
      },
      blurFun(){
          this.val=parseFloat((this.val).toFixed(2));
          this.newVal=parseFloat((this.newVal).toFixed(2));
          if(this.allType){
                let self=this;
                setTimeout(function(){
                    clearTimeout(self.timer);
                    if(self.newVal>self.contentData){
                            self.$Modal.confirm({
                              title:"系统提示!",
                              content:"配件单价不能高于最高销售价,系统已为您自动调整为最高价！",
                          })
                          self.newVal=self.params.row.MAX_SALES_PRICE;
                          self.val=self.params.row.MAX_SALES_PRICE;
                    }else if(self.newVal<self.contentData1){
                          self.$Modal.confirm({
                              title:"系统提示!",
                              content:"配件单价不能低于最低销售价,系统已为您自动调整为最低价！",
                          })
                          self.newVal=self.params.row.MIN_SALES_PRICE;
                          self.val=self.params.row.MIN_SALES_PRICE;
                          
                    }
                    console.log('this.newVal',self.newVal,'this.val',self.val);
                    if(!self.newVal){
                      self.newVal=0;
                      self.val=0;
                    }
                    self.$emit('change', self.newVal);
                    self.flags=true;
                    console.log(222,self.val);
                },10)
          }else{
                let self=this;
                setTimeout(function(){
                    clearTimeout(self.timer);
                    if(self.newVal>self.contentData){
                            self.$Modal.confirm({
                                title:"系统提示!",
                                content:"优惠金额过大",
                                
                            })
                            self.newVal=0;
                            self.val=0;
                    }
                    console.log('this.newVal',self.newVal,'this.val',self.val);
                    if(!self.newVal){
                      self.newVal=0;
                      self.val=0;
                    }
                    self.$emit('change', self.newVal);
                    self.flags=true;
                    console.log(222,self.val);
                },10)
          }


        
        
      }
    }
	}
</script>

<style scoped>
.column-input{
  width: 100%;
  height: 100%;
  padding: 5px 0;
}
</style>
