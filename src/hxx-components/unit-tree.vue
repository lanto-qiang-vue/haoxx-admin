<template>
  <div>
    <div>
      <div style="cursor:pointer;width:15px;height:15px;float:left;" @click="expand">{{arrows}}</div>
      <Checkbox @on-change="onchange" :value="isSelect"></Checkbox>
      {{name}}{{nodeId}}
    </div>
    <unit-tree v-if="indexId < 0" :indexId="indexId + 1"></unit-tree>
    <!--声明类型type控制selectAll-->
    <unit-tree style="margin-left:20px;" v-show="myshow" v-for="item in data" :type="mytype" @onpush="onpush" @changeSelect="changeSelect" :select="selectAll" :data="item.children" :nodeId="item.id" :name="item.name"
               :indexId="0"></unit-tree>
  </div>
</template>
<script>
  import unitTree from '@/hxx-components/unit-tree.vue'

  export default {
    name: "unit-tree",
    components: {unitTree},
    props: ['indexId', 'name', 'data', 'show','nodeId','select','type'],
    data() {
      return {
        myshow: false,
        total: 0,
        selectAll:false,
        isSelect:false,
        mytype:true,
      }
    },
    watch:{
      select(){
       this.selectAll = this.select;
       if(this.type) {
         this.isSelect = this.select;
       }
      },
      type(data){
        this.mytype = data;
      }
    },
    methods: {
      expand() {
        this.myshow = !this.myshow;
      },
      changeSelect(row){
        this.isSelect = row;
        this.mytype = false;
        console.log(this.name);
        this.selectAll = !this.selectAll;
        this.$emit('changeSelect',row);
      },
      onchange(row){
        console.log(row);
       if(row){
         this.$emit('onpush',this.nodeId);
         this.mytype = true;
       }else{
         //向上改变单选......
         this.$emit('changeSelect',false);
       }
        this.isSelect = row;
        this.selectAll = row;
      },
      onpush(row){
        //向父级传递
        this.$emit('onpush',row);
      },
    },
    computed:{
      arrows(){
        if(this.data){
          return '▶';
        }else{
          return ''
        }
      }
    },
  }
</script>

<style scoped>

</style>
