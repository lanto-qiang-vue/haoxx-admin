<template>
<div class="column-input" @click="click">
  <span v-show="show=='span'">{{val}}</span>
  <Input ref="input" v-model="val" v-show="show=='input'" :type="inputType"
         @on-blur="show='span'" @on-change="change"/>
  <InputNumber ref="number" :min="min" :max="max" v-model="val" v-show="show=='number'"
               @on-blur="show='span'" @on-change="change" ></InputNumber>
</div>
</template>

<script>
	export default {
		name: "column-input",
    props: ['params', 'type', 'max', 'min'],
    data(){
		  return{
		    val: null,
        show: 'span',
        timer:null
      }
    },
    computed:{
		  inputType(){
		    return this.type=='number'?'text': this.type
      }
    },
    mounted(){
		  // console.log(this.params)
      let val= this.params.row[this.params.column.key]
      this.val= this.type=='number'? parseInt((val||0)): val
    },
    methods:{
      click(){
          this.type=='number'? (this.show='number', this.$refs.number.focus()):
            (this.show='input', this.$refs.input.focus())
      },
      change(val){
        let self= this
        clearTimeout(this.timer);
        this.timer = setTimeout(function(){
          self.$emit('change', val)
        },1000)
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
