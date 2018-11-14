<template>
  <div>
    <Dropdown style="width:200px;" trigger="custom" :visible="visible" :disabled="disabled" @on-clickoutside="Close">
      <a href="javascript:void(0)" @click="handleOpen">
        {{name}}
        <Icon type="ios-arrow-down"></Icon>
      </a>
      <DropdownMenu slot="list">
        <div style="background-color:blue;color:white;line-height:35px;width:100%;height:35px;">
          <div style="float:left;">&nbsp;&nbsp;选择维修班组</div>
          <a href="javascript:void(0)" style="float:left;color:white;" @click="refresh">&nbsp;&nbsp;刷新</a>
          <a href="javascript:void(0)" style="float:left;color:white;" @click="goTo">&nbsp;&nbsp;新增</a>
        </div>
        <div style="width:100%;height:250px;overflow:auto;">
          <div v-for="item in data" style="line-height:25px;width:100%;cursor: pointer;" @click="select(item)">&nbsp;&nbsp;{{item.code}}</div>
        </div>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
  export default {
    name: "unit-select",
    props:['data','value','disabled'],
    mounted(){
      for(let i in this.data){
        if(this.data[i].itemId == this.value){
          this.name = this.data[i].code;
          break;
        }
      }
    },
    data() {
      return {
        name: '请选择',
        visible: false,
      }
    },
    methods: {
      refresh(){
        this.$emit('refresh');
      },
      select(row) {
        this.name = row.code;
        this.$emit('change',row.itemId);
        this.handleClose();
      },
      handleOpen(){
        this.visible = true;
      },
      handleClose(){
        this.visible = false;
      },
      Close(){
        this.handleClose();
      },
      goTo(){
        this.$router.push({path:'/work-team'});
      }
    }
  }
</script>

<style scoped>

</style>
