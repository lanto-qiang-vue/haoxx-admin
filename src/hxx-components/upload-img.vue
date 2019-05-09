<template>
  <div style="width:100px;">
    <Upload
      ref="upload"
      :on-success="uploadSuccess"
      :max-size="2048"
      :data="token"
      :name="uploadName"
      :on-format-error="handleFormatError"
      :on-exceeded-size="handleMaxSize"
      :format="['jpg','jpeg','png']"
      accept="image/png,image/jpeg"
      :action="actionUrl">
      {{buttonName}}
    </Upload>
  </div>
</template>
<script>
  export default {
    name: "upload-img",
    props: {
      uploadName: {
        default() {
          return 'file';
        }
      },
      max: {
        default() {
          return 2048;
        }
      },
      actionUrl: {
        default() {
          return ''
        }
      },
      buttonName: {
        default() {
          return '上传图片'
        }
      },
    },
    data() {
      return {
        token: {access_token: ''},
      }
    },
    mounted() {
      this.token.access_token = this.$store.state.user.token;
    },
    methods: {
      uploadSuccess(response) {
        this.$emit('uploadSuccess', response);
      },
      handleMaxSize() {
        this.$Notice.warning({
          title: '错误提示',
          desc: '图片超过2M'
        })
      },
      handleFormatError() {
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
