<template>
    <Upload
      ref="upload"
      :on-success="uploadSuccess"
      :max-size="2048"
      :data="token"
      :name="uploadName"
      :on-format-error="handleFormatError"
      :on-exceeded-size="handleMaxSize"
      :show-upload-list="false"
      :format="['jpg','jpeg','png']"
      accept="image/png,image/jpeg"
      :action="baseUrl+actionUrl">
      <Button>{{buttonName}}</Button>
    </Upload>
</template>
<script>
  import env from '_conf/url'
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
        baseUrl:'',
      }
    },
    mounted() {
      this.baseUrl = env;
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
