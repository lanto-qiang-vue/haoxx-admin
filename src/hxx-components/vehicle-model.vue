<!--车型-->
<template>
  <Split v-model="split" :min="0.1" :max="0.5" class="split" @on-move-end="moveEnd">
    <div slot="left" class="split-pane">
      <Input v-model="treeKEYWORD" placeholder="品牌/厂商/车型名称..." icon="md-refresh"
             class="tree-input" @on-click="getTree()"></Input>
      <Tree :data="treeData" ref="tree" class="vehicle-tree" @on-select-change="select"></Tree>
    </div>
    <div slot="right" class="split-pane">
      <common-table v-model="tableData" :columns="columns" :total="total" :show="showTable" :showSearch="false"
                    @changePage="changePage" @changePageSize="changePageSize" @onRowClick="onRowClick">
        <div slot="operate">
          <Input v-model="KEYWORD" placeholder="车型名称..." style="width: 300px"></Input>
          <Button type="primary" @click="page=1;getList()"><Icon type="ios-search" size="24"/></Button>
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
    data () {
      return {
        split: 0.2,
        tableData:[],
        columns:[
          {title: '序号',  minWidth: 70, type: 'index'},
          {title: '车型', key: 'MODEL_NAME', minWidth: 300},
          {title: '品牌', key: 'PP_NAME', minWidth: 120},
          {title: '国产/进口', key: 'JK_NAME', minWidth: 100},
          {title: '厂商', key: 'CS_NAME', minWidth: 150},
          {title: '车系名称', key: 'CX_NAME', minWidth: 150},
          {title: '市场指导价', key: 'SCZDJ', minWidth: 130,
            render: (h, params) => h('span', params.row.SCZDJ+'.00')
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
        showTable: false
      }
    },
    mounted(){
		  this.getTree()
		  this.getList()
		  this.showTable=true
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
              expand: false,
              // render:this.renderTree,
              children: this.sortTree(res.data, 10, 0)
            }]

            setTimeout(function () {
              self.treeDataTemp = deepClone(self.treeData)
            },2000)

          }
        })
      },
      sortTree(arr, type, id){
        let tree=[]
        for(let i in arr){
          if(parseInt(arr[i].type)== parseInt(type) && arr[i].parentId== id){
            let node= arr[i]
            node.title= arr[i].jkName? (arr[i].jkName+ '-'+ arr[i].text ):arr[i].text
            node.expand=false
            // node.render=this.renderTree
            if(parseInt(type)< 12) node.children= this.sortTree(arr, type+1, arr[i].id)
            tree.push(node)
          }
        }
        return tree
      },
      renderTree(h, { data }){
        return h('span', {
          style: {
            display: 'inline-block',
          }
        }, [
          h('span', [
            h('Icon', {
              props: {
                type: 'ios-folder-outline'
              },
              style: {
                marginRight: '8px'
              }
            }),
            h('span', data.title)
          ]),
          ])
      },
      moveEnd(){
        // this.showTable= Math.random()
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
        console.log(data)
        this.getList(data[0].type, data[0].id)
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
      /*margin-bottom: 10px;*/
      padding: 15px;
      /*border: 1px solid #dcdee2;*/
      border-radius: 3px;
    }
    .tree-input{
      /*margin: 10px;*/
      /*position: absolute;*/
      /*left: 0;*/
      /*top: 0;*/
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
  }
</style>
