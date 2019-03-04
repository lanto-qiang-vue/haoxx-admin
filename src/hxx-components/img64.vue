<template>
  <div>
  <div style="width:250px;height:250px;">
    <div style="width:250px;height:200px;background:#F6F6F6;float:left;">
      <img v-if="resource == null" src="../assets/images/no_img.png" style="width:250px;height:200px;"/>
      <img v-else :src="resource" @click="showImg(resource)" style="width:250px;height:200px;">
    </div>
    <div style="clear:both;"></div>
    <div style="width:250px;height:50px;background:#ECECEC;text-align:center;line-height:50px;">
      <Button type="primary" style="margin-right:30px;" @click="upload">上传</Button>
      <input type="file" style="display:none;" ref="inputClick" accept="image/jpg,image/jpeg,image/png,image/bmp" @change="getImg('TENANT_FILE_PATH', $event)"/>
      <Button type="error" @click="remove">移除</Button>
    </div>
  </div>
  </div>
</template>

<script>
  import {imgToBase64 } from '@/libs/util.js'
    export default {
        name: "img64",
      props:{
          callback:{
            type:String,
            default:'back',
          },
      },
      data(){
          return {
            resource:null,
          }
      },
      methods:{
          showImg(img){
            this.$Modal.info({
              width: 50,
              title: '查看',
              closable: true,
              content: '<img src="'+img+'" style="width: 100%;"/>'
            })
          },
        remove(){
          this.resource = null;
          this.$emit(this.callback,null);
        },
        upload(){
          this.$refs.inputClick.click();
        },
        getImg( name, e){
          imgToBase64(e.target.files[0], (base64, fileName)=> {
           this.resource = base64;
            this.$emit(this.callback,this.resource);
          })
        },
      },
    }
</script>

<style scoped>

</style>
