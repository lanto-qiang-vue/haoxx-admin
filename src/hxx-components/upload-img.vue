<template>
    <div style="width:100px;">
      <Upload
        ref="upload"
        :on-success="uploadSuccess"
        :data="$store.state.user.token"
        max-size="2048"
        :on-format-error="handleFormatError"
        :on-exceeded-size="handleMaxSize"
        :format="['jpg','jpeg','png']"
        accept="image/png,image/jpeg"
        :action="actionUrl">
       <Button type="primary">上传图片</Button>
      </Upload>
    </div>
</template>
<script>
    export default {
        name: "upload-img",
      props:{
        actionUrl:{
          default(){
            return ''
          }
        },
        buttonName:{
          default(){
            return '上传图片'
          }
        },
      },
       data(){
          return {
            token:'',
          }
       },
      methods:{
        uploadSuccess(response){
          this.$emit('uploadSuccess',response);
        },
        handleMaxSize(){
          this.$Notice.warning({
            title: '错误提示',
            desc: '图片超过2M'
          })
        },
        handleFormatError(){
          this.$Notice.warning({
            title: '错误提示',
            desc: '只允许上传jpg,png图片'
          })
        }
      }
    }
</script>

<style scoped>

</style>
