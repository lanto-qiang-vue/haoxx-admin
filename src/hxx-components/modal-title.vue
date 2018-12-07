<template>
<div class="modal-title">
<img @click="$emit('clickBack')" src="@/assets/images/icon-back.png"/>
  <h1>{{title}}</h1>
  <span v-if="state">({{state}})</span>
</div>
</template>

<script>
	export default {
		name: "modal-title",
    props:['title', 'state'],

	}
</script>

<style scoped lang="less">
.modal-title{
  /*width: 100%;*/
  margin: 0 15px;
  height: 44px;
  padding-top: 14px;
  border-bottom: 1px solid #E9E9E9;
  *{
    vertical-align: baseline;
    line-height: 20px;
    margin-right: 10px;
  }
  img{
    cursor: pointer;
    height: 20px;
    vertical-align: text-bottom;
  }
  h1{
    display: inline-block;
    font-size: 20px;
    font-weight: 400;
  }
  span{
    color: red;
    font-size: 14px;
  }
}
</style>
