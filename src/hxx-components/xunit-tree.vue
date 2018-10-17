<template>
  <div>
    <div style="background:none;cursor: pointer;line-height:25px;">
      <div style="width:30%;text-align:left;float:left;">
        <div ref="abc" style="width:20px;height:20px;float:left;"></div>
        <div style="cursor:pointer;width:15px;height:15px;float:left;">{{arrows}}</div>
        <div style="float:left">
          <Checkbox @on-change="onChange" :value="checked"></Checkbox>
        </div>
        <div style="float:left;">{{text}}</div>
      </div>
      <div style="width:40%;float:left;text-align:center;">功能权限</div>
      <div style="width:30%;float:left;text-align:center;">
        选择权限
      </div>
      <div style="clear:both;"></div>
    </div>
    <unit-tree v-if="indexId < 0"></unit-tree>
    <xunit-tree v-for="item in data" :expand="item.expand" :indexId="0" :text="item.text" :funcId="item.funcId" v-show="item.expand"
                :level="level+1" :data="item.children" @spliceId="spliceId" :checked="item.checked" @checkTrue="checkTrue" @pushIds="pushIds" @checkFalse="checkFalse"></xunit-tree>
  </div>
</template>
<script>
  import xunitTree from '@/hxx-components/xunit-tree.vue'

  export default {
    name: "xunit-tree",
    components: {xunitTree},
    props: ['indexId', 'text', 'funcId', 'data', 'checked', 'level','expand'],
    data() {
      return {
        // arrows: '▶',
      }
    },
    mounted() {
      this.$refs.abc.style.width = (this.level - 1) * 20 + "px";
    },
    methods:{
      onChange(type){
        if(type){
          this.$emit('checkTrue',this.funcId);
          this.$emit('pushIds',[this.funcId]);
        }else{
          this.$emit('checkFalse',this.funcId);
          this.$emit('spliceId',[this.funcId]);
        }
      },
      checkTrue(row){
        this.$emit('checkTrue',row);
      },
      checkFalse(row){
        this.$emit('checkFalse',row);
      },
      spliceId(ids){
        ids.push(this.funcId);
        this.$emit('spliceId',ids);
      },
      pushIds(ids){
        ids.unshift(this.funcId);
        this.$emit('pushIds',ids);
      },
    },
    computed:{
     arrows(){
       // console.log(JSON.stringify(this.data[0].children));
       if(this.data){
         if(this.expand){
           return '▼';
         }else{
           return '▶';
         }
       }else{
         return '';
       }
      }
    },
  }
</script>

<style scoped>

</style>
