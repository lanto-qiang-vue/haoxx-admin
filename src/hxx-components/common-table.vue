<template>
<div class="common-table" ref="commonTable">
  <!--<Collapse v-model="collapse" v-show="showSearch"  class="table-search" @on-change="changeCollapse">-->
    <!--<Panel name="1">{{searchTitle}}-->
      <!--<div slot="content" >-->
  <div class="table-search">
    <slot name="search"></slot>
  </div>

      <!--</div>-->
    <!--</Panel>-->
  <!--</Collapse>-->
  <div class="operate" v-show="showOperate">
    <slot name="operate"></slot>
  </div>
  <div>
  </div>
  <Table
    @on-selection-change="changeSelect"
    class="main-table"
    ref="tablesMain"
    :data="data"
    :columns="tableColumns"
    stripe
    border
    :highlight-row="true"
    :show-header="showHeader"
    :width="width"
    :height="tableHeight"
    :loading="loading"
    :disabled-hover="disabledHover"
    :row-class-name="rowClassName"
    :size="size"
    :no-data-text="noDataText"
    :no-filtered-data-text="noFilteredDataText"
    @on-row-click="onRowClick"
    @on-row-dblclick="onRowDblclick"
    @on-current-change="onCurrentChange"
  >
  </Table>
  <div class="table-bottom" v-show="showPage">
    <div><slot name="footer"></slot></div>
    <Page :current="page" size="small" :page-size="25" show-sizer show-elevator show-total :page-size-opts="[25, 50, 100, 150]"
    placement="top" :total="total" @on-change="changePage" @on-page-size-change="changePageSize"/>
    <Button size="small" class="refresh" @click="changePage(page)"><Icon type="md-refresh" size="20"/></Button>
  </div>
  <slot></slot>
</div>
</template>
<script>
  import {deepClone} from "@/libs/util";
	export default {
		name: "common-table",
    props: {
      value: {
        type: Array,
        default () {
          return []
        }
      },
      columns: {
        type: Array,
        default () {
          return []
        }
      },
      size: String,
      width: {
        type: [Number, String]
      },
      height: {
        type: [Number, String]
      },
      stripe: {
        type: Boolean,
        default: false
      },
      border: {
        type: Boolean,
        default: false
      },
      showHeader: {
        type: Boolean,
        default: true
      },
      showPage:{
        type:Boolean,
        default: true
      },
      highlightRow: {
        type: Boolean,
        default: false
      },
      rowClassName: {
        type: Function,
        default () {
          return ''
        }
      },
      searchTitle:{
        default(){
          return '查询';
        }
      },
      context: {
        type: Object
      },
      noDataText: {
        type: String
      },
      noFilteredDataText: {
        type: String
      },
      disabledHover: {
        type: Boolean
      },
      loading: {
        type: Boolean,
        default: false
      },
      total: {
        type: [Number, String],
        default: 0
      },
      /**
       * @description 全局设置是否可编辑
       */
      editable: {
        type: Boolean,
        default: false
      },
      /**
       * @description 是否可搜索
       */
      searchable: {
        type: Boolean,
        default: false
      },
      /**
       * @description 搜索控件所在位置，'top' / 'bottom'
       */
      searchPlace: {
        type: String,
        default: 'top'
      },
      clearSelect:{},
      show:{},
      showSearch:{
        type:Boolean,
        default:true
      },
      showOperate:{
        type:Boolean,
        default:true
      },
      page:{
        type: Number,
        default: 1
      }
    },
    data(){
		  return{
        // current: 1,
        tableColumns:[],
		    data:[],
        collapse: ['1','2'],
        tableHeight: 500,
        timer: null,
        windowInnerHeight: window.innerHeight
      }
    },
    watch:{
      columns(thisColumns){
        this.calcColumns(thisColumns)
      },
      clearSelect(val){
        this.$refs.tablesMain.clearCurrentRow()
      },
      show(){
        this.resize(500)
      },
      value(data){
        this.data= data
      },
    },
    mounted() {
		  let self= this
      // self.resize(1000)
      window.onresize = function(){
		    if(window.innerHeight!= self.windowInnerHeight)
          self.resize(200)
      }
      this.calcColumns(this.columns)
    },
    methods:{
		  calcColumns(thisColumns){
        console.log(thisColumns)
        let arr= deepClone(thisColumns)
        for (let i in arr){
          arr[i].ellipsis= true
          arr[i].tooltip= true
        }
        this.tableColumns= arr
      },
      resize(time){
        let self= this
        let commonTable=this.$refs.commonTable
        console.log("origin.common-table", commonTable.offsetHeight)
        if(commonTable.offsetHeight) {
          clearTimeout(this.timer);
          this.timer = setTimeout(function () {
            self.windowInnerHeight= window.innerHeight
            self.tableHeight = commonTable.offsetHeight -
              commonTable.querySelector(".table-search").offsetHeight -
              commonTable.querySelector(".operate").offsetHeight - 10 -
              commonTable.querySelector(".table-bottom").offsetHeight;
            commonTable.style.opacity = 1

            console.log(".common-table", commonTable.offsetHeight)
            console.log(".table-search", commonTable.querySelector(".table-search").offsetHeight)
            console.log(".operate", commonTable.querySelector(".operate").offsetHeight)
            console.log(".table-bottom", commonTable.querySelector(".table-bottom").offsetHeight)
            self.checkHeight();
          }, time);
        }
      },
      checkHeight(){
        let commonTable=this.$refs.commonTable;
        let tablesMain = this.$refs.tablesMain;
        // alert(commonTable.querySelector(".table-bottom").offsetTop);
        console.log("底部高度"+commonTable.querySelector(".table-bottom").offsetTop);
        console.log("table高度"+(tablesMain.$el.offsetTop+this.tableHeight));
        // alert(tablesMain.$el.offsetTop+this.tableHeight);
        if(commonTable.querySelector(".table-bottom").offsetTop < (tablesMain.$el.offsetTop+this.tableHeight)){
          console.log("重新执行了呢");
           this.resize(1000);
        }
      },
      changeCollapse(){
        this.resize(500)
      },
      changePage(page){
        this.$emit('changePage', page)
      },
      changePageSize(size){
        this.$emit('changePageSize', size)
      },
      changeSelect(selection){
       this.$emit('changeSelect',selection);
      },
      onRowClick( row, index){
        this.$emit('onRowClick',row, index);
      },
      onRowDblclick( row, index){
        this.$emit('onRowDblclick',row, index);
      },
      onCurrentChange(currentRow, oldCurrentRow){
        this.$emit('onCurrentChange',currentRow, oldCurrentRow);
      }
    },
    activated(){
      this.resize(500)
    }
	}
</script>

<style lang="less" scoped>
.common-table{
  padding: 10px;
  background-color: white;
  height: 100%;
  overflow: hidden;
  position: relative;
  opacity: 0;
  transition: opacity .2s;
  .table-search{
    /*margin-bottom: 10px;*/
  }
  .operate{
    /*margin-bottom: 5px;*/
    /*margin-bottom: 10px;*/
    /*padding: 15px 15px 10px 15px;*/
    /*border: 1px solid #dcdee2;*/
    /*border-radius: 3px;*/
  }
  .operate button{
    margin: 0 5px 5px 0;
  }
  .table-bottom{
    position: absolute;
    /*height: 52px;*/
    padding: 10px;
    width: 100%;
    left: 0;
    bottom: 0;
    background-color: white;
    z-index: 4;
  }
}
</style>
<style lang="less">
.common-table{
  .table-search{
    .ivu-collapse-content-box{
      padding-bottom: 0;
    }
  }
  .main-table{
    .ivu-table-cell{
      .ivu-table-sort{
        display: none;
      }
    }
    .ivu-table-cell:hover{
      .ivu-table-sort{
        display: inline-block;
      }
    }
    .ivu-table-row{
      cursor: default;
      .ivu-tooltip-rel{
        vertical-align: top;
      }
    }
  }
  .table-bottom{
    .ivu-page{
      display: inline-block;
      vertical-align: middle;
      .ivu-page-item-jump-prev, .ivu-page-item-jump-next{
        display: none;
      }
      .ivu-page-options{
        margin-left: 5px;
      }
    }
    .refresh{
      vertical-align: middle;
      margin-left: 10px;
    }
  }
}
</style>
