<template>
<div class="common-table" ref="commonTable">
  <Collapse v-model="collapse" class="table-search" @on-change="changeCollapse">
    <Panel v-show="headerShow" name="1">查询
      <div slot="content">
        <slot name="search"></slot>
      </div>
    </Panel>
  </Collapse>
  <div v-show="headerShow" class="operate">
    <slot name="operate"></slot>
  </div>
  <div>
  </div>
  <Table
    @on-selection-change="changeSelect"
    class="main-table"
    ref="tablesMain"
    :data="value"
    :columns="columns"
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
  ></Table>
  <div class="table-bottom">
    <Page :page-size="25" show-sizer show-elevator show-total :page-size-opts="[25, 50, 100, 150]"
    placement="top"
      :total="total" @on-change="changePage" @on-page-size-change="changePageSize"/>
  </div>
  <slot></slot>
</div>
</template>

<script>
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
      headerShow:{
        type:Boolean,
        default:true
      } 
    },
    data(){
		  return{
        collapse: ['1','2'],
        tableHeight: 500,
        timer: null
      }
    },
    watch:{
      clearSelect(val){
        this.$refs.tablesMain.clearCurrentRow()
      },
      show(){
        this.resize(200)
      }
    },
    mounted() {
		  let self= this
      self.resize(1000)
      window.onresize = function(){
        self.resize(200)
      }
    },
    methods:{
      resize(time){
        let self= this
        let commonTable=this.$refs.commonTable
        clearTimeout(this.timer);
        this.timer = setTimeout(function(){
          self.tableHeight= commonTable.offsetHeight - 20 -
            commonTable.querySelector(".table-search").offsetHeight -
            commonTable.querySelector(".operate").offsetHeight - 10 -
            commonTable.querySelector(".table-bottom").offsetHeight

          console.log(".common-table", commonTable.offsetHeight)
          console.log(".table-search", commonTable.querySelector(".table-search").offsetHeight)
          console.log(".operate", commonTable.querySelector(".operate").offsetHeight)
          console.log(".table-bottom", commonTable.querySelector(".table-bottom").offsetHeight)
        }, time);
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
  .table-search{
  }
  .operate{
    margin-top: 10px;
    padding: 15px;
    border: 1px solid #dcdee2;
    border-radius: 3px;
  }
  .main-table{
    margin-top: 10px;
  }
  .table-bottom{
    position: absolute;
    height: 52px;
    padding: 10px;
    width: 100%;
    left: 0;
    bottom: 0;
    background-color: white;
    z-index: 4;
  }
}
</style>
