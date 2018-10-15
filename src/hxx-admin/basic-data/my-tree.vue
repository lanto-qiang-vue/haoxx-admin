<template>
  <div>
    <Button type="primary">改变数据</Button>
    <div>
    <unit-tree v-for="item in treeData" :data="item.children" :type="true" @changeSelect="changeSelect" @onpush="onpush" :nodeId="item.id" :name="item.name" :indexId="0"></unit-tree>
    </div>
  </div>
</template>

<script>
  import unitTree from '@/hxx-components/unit-tree.vue'

  export default {
    name: "my-tree",
    components: {unitTree},
    data() {
      return {
        indexId: 0,
        treeData:[],
        checkbox:[],
        selectAll:false,
      }
    },
    mounted(){
      this.changeData();
    },
    watch:{
      checkbox(){
        console.log(JSON.stringify(this.checkbox));
      },
    },
    methods: {
      onpush(row){
        this.checkbox.push(row);
      },
      changeSelect(row){
        // this.isSelect = row;
      },
changeData(){
  this.treeData = [{
    name: '全部',id:0,
    children: [{name: '轿车',id:1, children: [{name: '轿车-轮胎',id:2}, {name: '轿车-发动机',id:3}]}, {
      name: '货车',id:4,
      children: [{name: '大货车',id:5}, {name: '小货车',id:6,children:[{name:'小小货车',id:7}]}]
    }, {name: '客车',id:8},

    ]
  }]
}
    }
  }
</script>

<style scoped>

</style>
