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
                      @changePage="changePage" @changePageSize="changePageSize" :clearSelect="clearType" @onRowClick="onRowClick">
          <div slot="search">
            <Input v-model="KEYWORD" placeholder="项目编号/名称..." style="width: 300px"></Input>
            <Button type="primary" @click="page=1;getList()">
              <Icon type="ios-search" size="24"/>
            </Button>
          </div>
          <div slot="operate">
            <Button type="primary" @click="add">新增</Button>
            <Button type="info" :disabled="cando" @click="edit">修改</Button>
            <Button type="error" :disabled="cando" @click="del">删除</Button>
          </div>
        </common-table>
      </div>
    </Split>
  </div>
</template>

<script>
  import commonTable from '@/hxx-components/common-table.vue'
  import {getName, getDictGroup} from '@/libs/util.js'
  import env from '_conf/url'

  export default {
    name: "oneTwo-maintain",
    data() {
      return {
        page: 1,
        limit: 25,
        total: 0,
        split: 0.2,
        value1: '1',
        tableData: [],
        list:"",
        showTable: false,
        treeData: [],
        treeKeyword: '',
        clearType:false,
        spinShow: false,
        columns: [
          {
            title: '序号', minWidth: 70,
            render: (h, params) => h('span', (this.page - 1) * this.limit + params.index + 1)
          },
          {title: '维修项目编号', key: 'ITEM_NO', minWidth: 130},
          {title: '维修项目名称', key: 'NAME', minWidth: 130},
          {title: '项目分类', key: 'TNAME', minWidth: 130},
          {title: '计费标准', key: 'CHARGE_TYPE', minWidth: 130,
          render: (h,params) => h('span',getName(this.chargeList,params.row.CHARGE_TYPE))
          },
          {title: '标准金额(元)', key: 'REPAIR_MONEY', minWidth: 130},
          {title: '标准工时(小时)', key: 'REPAIR_TIME', minWidth: 140},
          {title: '油漆面数(面)', key: 'PAINT_NUM', minWidth: 120},
          {title: '门店能否修改', key: 'IS_PREINSTALL', minWidth: 140,
          render: (h,params) => h('span',getName(this.statusList,params.row.IS_PREINSTALL))
          }
        ],
        KEYWORD: '',
        TYPE_ID: '',
      }
    },
    watch: {},
    computed: {
      chargeList(){
        return getDictGroup(this.$store.state.app.dict,'1014');
      },
      statusList(){
        return getDictGroup(this.$store.state.app.dict,'1004');
      },
      cando(){
        return this.list == "" ? true : false;
      },
    },
    mounted() {
      this.getTree();
      this.getList();
      this.showTable = Math.random();
    },
    methods: {
      clearSection(){
        this.clearType = Math.random();
        this.list = "";
      },
      add() {
      },
      edit() {
      },
      del() {
      },
      getTree() {
        this.axios.request({
          url: '/manage/basedata/repairproject/get_repairitem_tree',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
          }
        }).then(res => {
          if (res.success === true) {
            let data = this.machine(res.data);
            this.treeData.push(data);
          }
        })
      },
      refresh() {
      },
      select(row) {
      // console.log(JSON.stringify(row));
        let flag = row[0] ? true : false;
        if(flag){
        this.TYPE_ID = row[0].nodeId;
        this.page = 1;
        this.getList();
        }
      },
      getList() {
        this.axios.request({
          url: '/manage/basedata/repairproject/list',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            KEYWORD: this.KEYWORD,
            page: this.page,
            limit: this.limit,
            TYPE_ID: this.TYPE_ID,
          }
        }).then(res => {
          if (res.success === true) {
            this.tableData = res.data;
            this.total = res.total;
            this.clearSection();
          }
        })
      },
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
      onRowClick(row) {
      this.list = row;
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

