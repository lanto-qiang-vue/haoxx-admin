<template>
    <div style="width:100%;height:100%;overflow: hidden">
      <iframe :src="myurl" style="height:100%;width:100%;"></iframe>
    </div>
</template>

<script>
    export default {
        name: "iframe",
        data(){
          return {
            myurl:'http://localhost:4040/dq/login/hxx_login?token='+ this.$store.state.user.token + "&mobile=17321492645",
          }
        }
    }
</script>

<style scoped>

</style>
