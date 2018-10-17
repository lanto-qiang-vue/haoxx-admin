<template>
  <div>
    <xunit-tree :expand="true" v-for="item  in treeData" :level="1" :indexId="0" :text="item.text"
                @checkTrue="checkTrue" :funcId="item.funcId" @checkFalse="checkFalse" :data="item.children"
                :checked="item.checked" @pushIds="pushIds" @spliceId="spliceId"></xunit-tree>
  </div>
</template>
<script>
  import xunitTree from '@/hxx-components/xunit-tree.vue'

  export default {
    name: "index-roles",
    components: {xunitTree},
    methods: {
      pushIds(data){
        // console.log(data);
       let mydata =  this.findId(this.treeData,data);
       this.treeData = mydata;
      },
      spliceId(data){
        // let data = this.spliceId(data);
      },
      findId(data,ids){
        for(let i in data){
          let flag = data[i].children ? true : false;
          if(data[i].funcId == ids[0]){
            data[i].checked = true;
            ids.splice(0,1);
            if(flag) this.findId(data[i].children,ids);
          }else{
           if(flag) this.findId(data[i].children,ids);
          }
        }
        return data;
      },
      changeData(data) {
        data.expand = true;
        let flag = data.children ? true : false;
        if (flag) {
          for (let i in data.children) {
            this.changeData(data.children[i]);
          }
        }
        return data;
      },
      getTree() {
        this.axios.request({
          url: '/manage/sys/tenant_roles/getCheckedMenus',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            ROLE_ID: 36,
          }
        }).then(res => {
          if (res.success === true) {
            let data = this.changeData(res.data);
            this.treeData = [data];
          }
        })
      },
      checkTrue(id) {
        let data = this.setTrue(this.treeData, id);
        this.treeData = data;
      },
      checkFalse(id) {
        let data = this.setFalse(this.treeData, id);
        this.treeData = data;
      },
      setFalse(data, id) {
        for (let i in data) {
          let flag = data[i].children ? true : false;
          if (data[i].funcId == id) {
            data[i].checked = false;
            if (flag) this.setAll(data[i].children, false)
          } else {
            if (flag) this.setFalse(data[i].children, id);
          }
        }
        return data;
      },
      setTrue(data, id) {
        for (let i in data) {
          let flag = data[i].children ? true : false;
          if (data[i].funcId == id) {
            data[i].checked = true;
            if (flag) this.setAll(data[i].children, true)
          } else {
            if (flag) this.setTrue(data[i].children, id);
          }
        }
        return data;
      }, setAll(data, type) {
        for (let i in data) {
          data[i].checked = type;
          let flag = data[i].children ? true : false;
          if (flag) this.setAll(data[i].children, type);
        }
      }
    },
    data() {
      return {
        treeData: [],
      }
    },
    mounted() {
      this.getTree();
    }
  }
</script>
<style scoped>

</style>
