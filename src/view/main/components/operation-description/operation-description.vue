<template>
  <Tooltip v-show="show" class="picking-number"  content="操作指南">
    操作指南
  </Tooltip>
</template>
<script>
    export default {
        name: "operation-description"
    }
</script>

<style scoped>
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
</style>
