<template>
  <Modal
    v-model="show"
    :title="title">
    <div class="ivu-upload ivu-upload-drag">
      <i class="ivu-icon ivu-icon-ios-cloud-upload"></i>
      <p>1、点击当前区域，找到您所要导入的Excel文件，请确保文件按照模板中的格式填写。</p>
      <p>2、选择好文件后，点“确定”按钮完成导入</p>
      <input ref="file"  @change="change" type="file" :accept="accept">
    </div>
    <a v-show="file.name">{{file.name}}</a>
    <div slot="footer">
      <Button type="success" @click="click('template')" style="float: left">下载模板</Button>
      <Button type="error" @click="show= false;click('close')">关闭</Button>
      <Button type="primary" @click="click('ok')">确定</Button>

    </div>
  </Modal>
</template>

<script>
export default {
  name: "upload-modal",
  props: {
    title: {
      default: ''
    },
    accept:{
      default: ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
    }
  },
  data(){
    return{
      show: true,
      file: {}
    }
  },
  methods:{
    open(){
      this.file= {}
      this.show= true
    },
    close(){
      this.show= false
    },
    change(){
      let file= this.$refs.file.files[0]
      this.file= file
      // console.log('file', file)
      this.$emit('change', file)
      this.$refs.file.value=null;
    },
    click(name){
      this.$emit(name)
    },
  }
}
</script>

<style scoped lang="less">
.ivu-upload{
  padding: 20px;
  i{
    font-size: 50px;
    color: #3399ff;
  }
  p{
    text-align: left;
  }
  input{
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    opacity: 0;
    display: block;
    cursor: pointer;
  }
}
</style>
