<template>
  <Tree :data="treeData" show-checkbox></Tree>
</template>

<script>
  export default {
    name: "my-tree",
    data() {
      return {
        treeData:[],
      }
    },
    mounted(){
      this.changeData();
    },
    watch:{
    },
    methods: {
changeData(){
  this.treeData = [{
    title: '全部',id:0,check:true,
    children: [{title: '轿车<div>222</div>',id:1,check:true,children: [{title: '轿车-轮胎',id:2}, {title: '轿车-发动机',id:3}]}, {
      title: '货车',id:4,
      children: [{title: '大货车',id:5}, {title: '小货车',id:6,children:[{title:'小小货车',id:7}]}]
    }, {title: '客车',id:8},

    ]
  }]
}
    }
  }
</script>

<style scoped>

</style>
