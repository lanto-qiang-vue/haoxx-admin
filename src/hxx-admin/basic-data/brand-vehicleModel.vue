<!--车型-->
<template>
  <Split v-model="split" :min="0.1" :max="0.5" class="split">
    <div slot="left" class="split-pane">
      <Input v-model="treeKEYWORD" placeholder="品牌/厂商/车型名称..." icon="md-refresh"
             class="tree-input" @on-change="selectKeyword"></Input>
      <div v-show="isShow">
        <Tree :data="treeData" class="vehicle-tree" @on-select-change="select" @on-toggle-expand="qh1"></Tree>
      </div>
      <div v-show="!isShow">
        <Tree :data="nxzj" class="vehicle-tree" @on-select-change="select" @on-toggle-expand="qh2"></Tree>
      </div>
      <!--<div v-show="!isShow"><Tree :data="nxzj" class="vehicle-tree" @on-toggle-expand="sb"></Tree></div>-->
    </div>
    <div slot="right" class="split-pane">
      <common-table v-model="tableData" :columns="columns" :total="total" :show="showTable" :showSearch="false"
                    @changePage="changePage" @changePageSize="changePageSize" @onRowClick="onRowClick">
        <div slot="operate">
          <Input v-model="KEYWORD" placeholder="车型名称..." style="width: 300px"></Input>
          <Button type="primary" @click="page=1;getList()">
            <Icon type="ios-search" size="24"/>
          </Button>
        </div>
      </common-table>
    </div>
  </Split>
</template>

<script>
  import commonTable from '@/hxx-components/common-table.vue'
  import {deepClone} from '@/libs/util.js'

  export default {
    name: "brand-vehicleModel",
    props: ['show'],
    data() {
      return {
        split: 0.2,
        tableData: [],
        nxzj: [{title: '所有厂家/品牌/车系', id: 0, children: [{title: '快成一道闪电'}]}],
        isShow: true,
        columns: [
          {title: '序号', minWidth: 70, type: 'index'},
          {title: '车型', key: 'MODEL_NAME', minWidth: 300},
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
        treeData: [],
        treeDefault: [],
        treeDataTemp: [],
        page: 1,
        limit: 25,
        total: 0,
        KEYWORD: '',
        treeKEYWORD: '',
        showTable: false,
        timer: null,
        render: false
      }
    },
    watch: {
      show() {
        this.showTable = Math.random()
      }
    },
    mounted() {
      this.getTree()
      this.getList()
    },
    methods: {
      qh1(data) {
        if (data.nodeKey == 0) {
          this.treeData[0].expand = true;
          this.isShow = !this.isShow;
        }
      },
      qh2(data) {
        if (data.nodeKey == 0) {
          this.nxzj[0].expand = false;
          this.isShow = !this.isShow;
        }
      },
      getList(mdtype, mdid) {
        this.axios.request({
          url: '/tenant/basedata/vehiclemodel/list',
          method: 'post',
          data: {
            KEYWORD: this.KEYWORD,
            mdtype: mdtype || mdtype == 0 ? mdtype : '',
            mdid: mdid || mdid == 0 ? mdid : '',
            page: this.page,
            limit: this.limit,
            access_token: this.$store.state.user.token
          }
        }).then(res => {
          if (res.success === true) {
            this.tableData = res.data
            this.total = res.total
          }
        })
      },
      getTree() {
        this.axios.request({
          url: '/manage/basedata/vehiclemodel/tree',
          method: 'post',
          data: {
            node: 0,
            access_token: this.$store.state.user.token
          }
        }).then(res => {
          if (res.success === true) {
            this.treeDefault = res.data;
            this.filterCompnay();
          }
        })
      },
      selectKeyword(){
        // this.search();
        let self= this
        clearTimeout(this.timer);
        this.timer = setTimeout(function(){
          self.search();
        },500)
      },
      search() {
        this.filterCompnay();
      },
      filterCompnay() {
        console.log("====开始======");
        let data = {};
        let mydata = [];
        console.log(JSON.stringify(data));
        for (let i in this.treeDefault) {
          let parentId = this.treeDefault[i].parentId;
          let flag = data[parentId] ? true : false;
          if (!flag) {
            data[parentId] = [];
          }
          switch (this.treeDefault[i].type) {
            case 10:
              data[parentId].push({
                title: this.treeDefault[i].text,
                id: this.treeDefault[i].id,
                parentId: this.treeDefault[i].parentId
              });
              break;
            case 11:
              data[parentId].push({
                title: this.treeDefault[i].jkName + "-" + this.treeDefault[i].text,
                id: this.treeDefault[i].id,
                parentId: this.treeDefault[i].parentId
              });
              break;
            case 12:
              if (this.treeKEYWORD == "" || this.treeKEYWORD == " ") {
                data[parentId].push({
                  title: this.treeDefault[i].text,
                  id: this.treeDefault[i].id,
                  parentId: this.treeDefault[i].parentId
                });
              } else {
                if (this.treeDefault[i].text.indexOf(this.treeKEYWORD.toLocaleUpperCase()) > -1){
                  data[parentId].push({
                    title: this.highLight(this.treeDefault[i].text, this.treeKEYWORD.toLocaleUpperCase()),
                    id: this.treeDefault[i].id,
                    parentId: this.treeDefault[i].parentId,
                    render:this.renderTree
                  })
                }
              }
              break;
          }
        }
        let newData = data[0];
        //二次过滤...
        for (let i in newData) {
          //三次过滤...
          let store = data[newData[i].id];
          let st  = [];
          let stflag = false;
          for (let a in store) {
            if(data[store[a].id].length > 0){
              stflag = true;
              if(store[a].title.indexOf(this.treeKEYWORD.toLocaleUpperCase()) > - 1 && this.treeKEYWORD != "" && this.treeKEYWORD != " "){
                st.push({
                  title: this.highLight(store[a].title, this.treeKEYWORD.toLocaleUpperCase()),
                  id: store[a].id,
                  parentId: store[a].parentId,
                  render:this.renderTree,
                  children:data[store[a].id],
                })
              }
              else{
                st.push({title:store[a].title,children:data[store[a].id],id:store[a].id});
              }
            }else{
              if(store[a].title.indexOf(this.treeKEYWORD.toLocaleUpperCase()) > - 1 && this.treeKEYWORD != "" && this.treeKEYWORD != " "){
                st.push({
                  title: this.highLight(store[a].title, this.treeKEYWORD.toLocaleUpperCase()),
                  id: store[a].id,
                  parentId: store[a].parentId,
                  render:this.renderTree,
                  children:[],
                })
              }
            }
          }

          if(stflag){
            mydata.push({title:newData[i].title,id:newData[i].id,children:st})
          }else{

          }
        }
        console.log(JSON.stringify(mydata));
        console.log("====结束======");
        let tree = {title: '所有厂家/品牌/车系', id: 0, children: mydata, expand: true};
        // this.treeData = [];
        this.treeData = [tree];
        // console.log(JSON.stringify(data[124856]));
      },
      renderTree(h, {root, node, data}) {
        // console.log(data)
        return h('span', {
          class: {'ivu-tree-title': true},
          domProps: {
            innerHTML: data.title
          },
          on: {
            click: () => {
              this.select(data, root, node)
            }
          },
        })
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
        console.log('row：', row);
        this.$emit('onRowClick', row, index);
      },
      select(data) {
        let type = data instanceof Array ? data[0].type : data.type
        let id = data instanceof Array ? data[0].id : data.id
        console.log(data instanceof Array, type, id, data)
        this.getList(type, id)
      },
      highLight(text, words, tag) {
        tag = tag || 'span';
        let re = new RegExp(words, 'gi');
        if (re.test(text)) {
          text = text.replace(re, '<' + tag + ' class="highlight">$&</' + tag + '>');
        }
        return text;
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
</style>
