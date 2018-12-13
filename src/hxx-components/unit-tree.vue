<template>
  <div>
    <div ref="planA" @click="changeColor" style="background:none;cursor: pointer;line-height:25px;">
      <div style="width:50%;text-align:left;float:left;">
        <div ref="abc"  style="width:20px;height:20px;float:left;"></div>
        <div style="cursor:pointer;width:15px;height:15px;float:left;" @click.stop="expand">{{arrows}}</div>
        <!--<Checkbox @on-change="onchange" :value="ischeck">放电饭锅水电费</Checkbox>-->
        <div style="float:left;">{{name}}</div>
      </div>
      <div style="width:50%;float:left;text-align:center;">{{remark}}</div>
      <div style="clear:both;"></div>
    </div>
    <unit-tree v-if="indexId < 0" :indexId="indexId + 1"></unit-tree>

    <!--声明类型type范德萨人封禅大典selectAll-->

    <unit-tree  @cancelColor="cancelColor" v-for="item in data" :remark="item.remark" :fatherId="item.fatherId" :clearType="clearType" :changeAll="changeAll" v-show="myshow" :id="id" :data="item.children" :nodeId="item.nodeId" :level="level+1"
               :name="item.nodeName"
               :indexId="0"></unit-tree>
  </div>
</template>
<script>
  import unitTree from '@/hxx-components/unit-tree.vue'
  //fsas ffs;
  export default {
    name: "unit-tree",
    components: {unitTree},
    props: ['indexId', 'name', 'data', 'nodeId', 'level','id','changeAll','remark','clearType','fatherId'],
    data() {
      return {
        myshow: false,
        total: 0,
        selectAll: false,
        isSelect: false,
      }
    },
    watch: {
      id(id){
       if(this.nodeId == id){
         this.$refs.planA.style.background = '#FFEFBB';
       }else{
         this.$refs.planA.style.background = 'none';
       }
      },
      changeAll(data){
        this.myshow = data;
      },
      clearType(){
        this.$refs.planA.style.background = 'none';
      },
    },
    methods: {
      expand() {
        this.myshow = !this.myshow;
      },
      changeColor(){
        this.$emit('cancelColor',{nodeId:this.nodeId,indexName:this.name,level:this.level,fatherId:this.fatherId,name:this.name,remark:this.remark});
      },
      cancelColor(data){
        this.$emit('cancelColor',data);
      }
    },
    mounted() {
      if(this.level == 1){
        this.myshow = true;
      }
      this.$refs.abc.style.width = (this.level - 1) * 20 + "px";
      // console.log(this.$refs.abc.style.width);
    },
    computed: {
      arrows() {
        // let flag = this.data[0].children;
        if (this.data && this.data.length > 0) {
          if (this.myshow) {
            return '▼';
          } else {
            return '▶';
          }
        } else {
          return ''
        }
      }
    },
  }
</script>

<style scoped>

</style>
