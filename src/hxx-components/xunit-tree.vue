<template>
  <div>
    <div style="background:none;cursor: pointer;line-height:25px;">
      <div style="width:30%;text-align:left;float:left;">
        <div ref="abc"  style="width:20px;height:20px;float:left;"></div>
        <div style="cursor:pointer;width:15px;height:15px;float:left;" >▼</div>
        <div style="float:left"><Checkbox :value="checked"></Checkbox></div>
        <div style="float:left;">{{text}}</div>
      </div>
      <div style="width:40%;float:left;text-align:center;">功能权限</div>
      <div style="width:30%;float:left;text-align:center;">
        选择权限
      </div>
      <div style="clear:both;"></div>
    </div>
    <unit-tree v-if="indexId < 0"></unit-tree>
    <xunit-tree v-for="item in data" :indexId="0" :text="item.text" :funcId="item.funcId" :level="level+1" :data="item.children" :checked="item.checked"></xunit-tree>
  </div>
</template>
<script>
  import xunitTree from '@/hxx-components/xunit-tree.vue'

  export default {
    name: "xunit-tree",
    components: {xunitTree},
    props: ['indexId','text','funcId','data','checked','level'],
    data() {
      return {}
    },
    mounted(){
      console.log(this.level);
      this.$refs.abc.style.width = (this.level - 1) * 20 + "px";
    },
  }
</script>

<style scoped>

</style>
