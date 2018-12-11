<!--车型-->
<template>
  <Split v-model="split" :min="0.1" :max="0.5" class="split" @on-move-end="moveEnd">
    <div slot="left" class="split-pane">
      <Input v-model="treeKEYWORD" placeholder="品牌/厂商/车型名称..." icon="md-refresh"
             class="tree-input" @on-click="render=false;getTree()" @on-change="queryTree" clearable></Input>
      <Tree :data="treeData" ref="tree" class="vehicle-tree" @on-select-change="select" ></Tree>
    </div>
    <div slot="right" class="split-pane">
      <common-table v-model="tableData" :columns="columns" :total="total" :show="showTable" :showSearch="false"
                    @changePage="changePage" @changePageSize="changePageSize" @onRowClick="onRowClick">
        <div slot="operate">
          <Input v-model="KEYWORD" placeholder="车型名称..." style="width: 300px"></Input>
          <Button type="primary"  style="margin-left:10px;margin-top:2px;" @click="page=1;getList()">搜索</Button>
        </div>
      </common-table>
    </div>
  </Split>
</template>

<script>
  import commonTable from '@/hxx-components/common-table.vue'
  import { deepClone } from '@/libs/util.js'
	export default {
		name: "vehicle-model",
    props:['show'],
    data () {
      return {
        split: 0.2,
        tableData:[],
        columns:[
          {
            title: '序号', width: 70,align:'center',
            render: (h, params) => h('span', (this.page - 1) * this.limit + params.index + 1)
          },
          {title: '车型', key: 'MODEL_NAME', minWidth: 300},
          {title: '品牌', key: 'PP_NAME', minWidth: 120},
          {title: '国产/进口', key: 'JK_NAME', minWidth: 100},
          {title: '厂商', key: 'CS_NAME', minWidth: 150},
          {title: '车系名称', key: 'CX_NAME', minWidth: 150},
          {title: '市场指导价', key: 'SCZDJ', minWidth: 130,align:'right',
            render: (h, params) => h('span', this.formatMoney(params.row.SCZDJ))
          },
          {title: '发动机', key: 'FDJ', minWidth: 100},
          {title: '变速器', key: 'BSQ', minWidth: 160},
          {title: '驱动方式', key: 'QDFS', minWidth: 120},
        ],
        treeData:[],
        treeDataTemp: [],
        page: 1,
        limit: 25,
        total: 0,
        KEYWORD:'',
        treeKEYWORD:'',
        showTable: false,
        timer: null,
        render: false
      }
    },
    watch:{
      show(){
        this.showTable= Math.random()
      }
    },
    mounted(){
		  this.getTree()
		  this.getList()
    },
    methods:{
      getList(mdtype, mdid){
        this.axios.request({
          url: '/tenant/basedata/vehiclemodel/list',
          method: 'post',
          data: {
            KEYWORD: this.KEYWORD,
            mdtype: mdtype||mdtype==0? mdtype: '',
            mdid: mdid||mdid==0? mdid: '',
            page: this.page,
            limit: this.limit,
            access_token: this.$store.state.user.token
          }
        }).then(res => {
          if (res.success === true) {
            this.tableData= res.data
            this.total= res.total
          }
        })
      },
      getTree(){
        let self= this
        this.axios.request({
          url: '/tenant/basedata/vehiclemodel/tree',
          method: 'post',
          data: {
            node: 0,
            access_token: this.$store.state.user.token
          }
        }).then(res => {
          if (res.success === true) {
            this.treeData=[{
              title: '所有厂家/品牌/车系',
              id: 0,
              expand: true,
              // render:this.renderTree,
              children: this.sortTree(res.data, 10, 0)
            }]
            self.treeDataTemp =res.data
          }
        })
      },
      sortTree(arr, type, id, match){
        let tree=[]
        for(let i in arr){
          if(parseInt(arr[i].type)== parseInt(type) && arr[i].parentId== id){
            let node= deepClone(arr[i])
            node.title= arr[i].jkName? (arr[i].jkName+ '-'+ arr[i].text ):arr[i].text
            node.expand=false
            if(match){
              node.title= this.highLight(node.title, this.treeKEYWORD)
              node.render= this.renderTree
            }
            if(parseInt(type)< 12) node.children= this.sortTree(arr, type+1, arr[i].id, match)
            if(!node.hide || (node.children&& node.children.length)) tree.push(node)
          }
        }
        return tree
      },
      queryTree(){
        let self= this
        clearTimeout(this.timer);
        this.timer = setTimeout(function(){
          self.matchTree(self.treeKEYWORD)
        },500)
      },
      matchTree(text){
        let arr= this.treeDataTemp
        for (let i in arr){
          let title= arr[i].jkName? (arr[i].jkName+ '-'+ arr[i].text ):arr[i].text
          if(title.toLowerCase().indexOf(text.toLowerCase())>=0) arr[i].hide=false
          else arr[i].hide= true
        }
        this.treeData=[{
          title: '所有厂家/品牌/车系',
          id: 0,
          expand: true,
          children: this.sortTree(arr, 10, 0, (text? true: false))
        }]
      },
      renderTree(h, { root, node, data }){
        // console.log(data)
        return h('span', {
          class: {'ivu-tree-title': true},
          domProps: {
            innerHTML: data.title
          },
          on: {
            click: () => {this.select(data,root, node)}
          },
        })
      },
      moveEnd(){

      },
      changePage(page){
        this.page= page
        this.getList()
      },
      changePageSize(size){
        this.limit= size
        this.getList()
      },
      onRowClick( row, index){
        console.log('row：', row);
        this.$emit('onRowClick', row, index);
      },
      select(data){
        let type=  data instanceof Array? data[0].type: data.type
        let id= data instanceof Array? data[0].id: data.id
        console.log(data instanceof Array, type, id, data)
        this.getList(type, id)
      },
      highLight(text, words, tag) {
        tag = tag || 'span';
        let re = new RegExp(words, 'gi');
        if (re.test(text)) {
          text = text.replace(re, '<'+ tag +' class="highlight">$&</'+ tag +'>');
        }
        return text;
      }
    },
    components: {commonTable},
	}
</script>

<style scoped lang="less">
.split{
  border: 1px solid #dcdee2;
  background-color: white;
  
  .split-pane{
    padding: 10px;
    height: 100%;
    overflow: auto;
    position: relative;
    .tree-search{
      padding: 15px;
      border-radius: 3px;
    }
    .tree-input{
      z-index: 1;
    }
    .vehicle-tree{
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
  .vehicle-tree{
    >.ivu-tree-children{
      height: 100%;
      overflow: auto;
    }
    .highlight{
      color: red;
    }
  }
</style>
