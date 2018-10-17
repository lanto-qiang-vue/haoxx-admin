<template>
    <div>
      <xunit-tree v-for="item  in treeData" :level="1" :indexId="0" :text="item.text" :funcId="item.funcId" :data="item.children" :checked="item.checked"></xunit-tree>
    </div>
</template>
<script>
  import xunitTree from '@/hxx-components/xunit-tree.vue'
    export default {
        name: "index-roles",
        components:{xunitTree},
        methods:{
          getTree(){
            this.axios.request({
              url: '/manage/sys/tenant_roles/getCheckedMenus',
              method: 'post',
              data: {
                access_token: this.$store.state.user.token,
                ROLE_ID:37,
              }
            }).then(res => {
              if (res.success === true) {
                  this.treeData = [res.data];
              }
            })
          }
        },
        data(){
          return {
            treeData:[],
          }
        },
      mounted(){
          this.getTree();
      }
    }
</script>
<style scoped>

</style>
