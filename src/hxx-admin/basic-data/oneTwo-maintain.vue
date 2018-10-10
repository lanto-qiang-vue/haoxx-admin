<!--车型-->
<template>
  <div style="width:100%;height:100%;">
    <Split v-model="split" :min="0.1" :max="0.5" class="split">
      <div slot="left" class="split-pane">
          <Tree :data="treeData" @on-select-change="select"></Tree>
        <Spin size="large" fix v-if="spinShow"></Spin>
      </div>
      <div slot="right" class="split-pane">
        <common-table v-model="tableData" :columns="columns" :total="total" :show="showTable"
                      @changePage="changePage" @changePageSize="changePageSize" @onRowClick="onRowClick">
          <div slot="operate">
            <Input v-model="KEYWORD" placeholder="车型名称..." style="width: 300px"></Input>
            <Button type="primary" @click="page=1;getList()">
              <Icon type="ios-search" size="24"/>
            </Button>
            <!--<Button style="float:right;" type="info" @click="importBrand">导出</Button>-->
            <!--<Button style="float:right;" type="success" @click="uploadBrand">导入</Button>-->
            <!--<Button style="float:right;" :disabled="cando" type="primary" @click="add">新增</Button>-->
            <!--<Button style="float:right;" type="primary" @click="addBrand">新增品牌车系</Button>-->
          </div>
        </common-table>
      </div>
    </Split>
  </div>
</template>

<script>
  import commonTable from '@/hxx-components/common-table.vue'
  import env from '_conf/url'

  export default {
    name: "oneTwo-maintain",
    data() {
      return {
        page:1,
        limit:25,
        total:0,
        split: 0.2,
        value1: '1',
        tableData: [],
        showTable:false,
        treeData:[],
        treeKeyword:'',
        spinShow:false,
        columns: [
          {title: '序号', minWidth: 70, type: 'index'},
          {title: '品牌', key: 'PP_NAME', minWidth: 120},
          {title: '国产/进口', key: 'JK_NAME', minWidth: 100},
          {title: '厂商', key: 'CS_NAME', minWidth: 150},
          {title: '车系名称', key: 'CX_NAME', minWidth: 150},
          {
            title: '市场指导价', key: 'SCZDJ', minWidth: 130,
            render: (h, params) => h('span', params.row.SCZDJ + '.00')
          },
          {title: '发动机', key: 'FDJ', minWidth: 100},
          {title: '变速器', key: 'BSQ', minWidth: 160},
          {title: '驱动方式', key: 'QDFS', minWidth: 120},
        ],
        KEYWORD:'',
      }
    },
    watch: {

    },
    computed: {

    },
    mounted() {

    },
    methods: {
      refresh(){},
      select(){},
      getList(){},
      machine(data) {
        data['title'] = data.nodeName;
        let flag = data.children ? true : false;
        if (flag) {
          for (let i = 0; i < data.children.length; i++) {
            this.machine(data.children[i]);
          }
        } else {

        }
        return data;
      },
      changePage(page) {
        this.page = page
        this.getList()
      },
      changePageSize(size) {
        this.limit = size
        this.getList()
      },
      onRowClick(row, index) {

      }
    },
    components: {commonTable},
  }
</script>

<style scoped lang="less">
  .split {
    border: 1px solid #dcdee2;
    background-color: white;
    .split-pane {
      padding: 10px;
      height: 100%;
      overflow: auto;
      position: relative;
      .tree-search {
        padding: 15px;
        border-radius: 3px;
      }
      .tree-input {
        z-index: 1;
      }
      .vehicle-tree {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        padding: 50px 0 10px 10px;
        overflow: hidden;
      }
    }
  }
</style>
<style lang="less">
  .vehicle-tree {
    > .ivu-tree-children {
      height: 100%;
      overflow: auto;
    }
    .highlight {
      color: red;
    }
  }

  .ivu-input-number-input {
    height: 30px;
  }

  .ivu-tree-title .highlight {
    color: red;
  }
</style>

