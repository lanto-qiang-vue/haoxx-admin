<template>
<div class="common-table">
  <Collapse v-model="collapse" class="table-search" @on-change="changeCollapse">
    <Panel name="1">查询
      <div slot="content">
        <slot name="search"></slot>
      </div>
    </Panel>
  </Collapse>
  <div class="operate">
    <slot name="operate"></slot>
  </div>
  <Table
    class="main-table"
    ref="tablesMain"
    :data="value"
    :columns="columns"
    :stripe="stripe"
    :border="border"
    :show-header="showHeader"
    :width="width"
    :height="tableHeight"
    :loading="loading"
    :disabled-hover="disabledHover"
    :highlight-row="highlightRow"
    :row-class-name="rowClassName"
    :size="size"
    :no-data-text="noDataText"
    :no-filtered-data-text="noFilteredDataText"
  ></Table>
  <div class="table-bottom">
    <Page :total="100" :page-size="25" show-sizer show-elevator :page-size-opts="[25, 50, 100, 150]" />
  </div>
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
      }
    },
    data(){
		  return{
        collapse: ['1','2'],
        tableHeight: 500,
        timer: null
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
        clearTimeout(this.timer);
        this.timer = setTimeout(function(){
          self.tableHeight= document.querySelector(".common-table").offsetHeight - 20 -
            document.querySelector(".table-search").offsetHeight -
            document.querySelector(".operate").offsetHeight -
            document.querySelector(".table-bottom").offsetHeight

          // console.log(".common-table", document.querySelector(".common-table").offsetHeight)
          console.log(".table-search", document.querySelector(".table-search").offsetHeight)
          // console.log(".operate", document.querySelector(".operate").offsetHeight)
          // console.log(".table-bottom", document.querySelector(".table-bottom").offsetHeight)
        }, time);
      },
      changeCollapse(){
        this.resize(500)
      }
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
    padding: 10px;
    width: 100%;
    left: 0;
    bottom: 0;
    background-color: white;
    z-index: 1;
  }
}
</style>
