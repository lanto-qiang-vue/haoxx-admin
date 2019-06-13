<template>
  <Modal
    v-model="showModal"
    class="table-modal-detail"
    title="适用门店"
    width="80"
    :mask-closable="false"
    @on-visible-change="visibleChange"
    :scrollable="true"
    :transfer="true"
    :footer-hide="false"
    :transition-names="['', '']">
    <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage"
                  :total="total" :show="showTable" :page="page" :clearSelect="clearType" @changeSelect="changeSelect"
                  :showOperate="false">
      <div slot="search">
        <div class="search-block">
          <Input v-model="search.keyword" placeholder="门店名称"></Input>
        </div>
        <div class="search-block">
          <Select placeholder="请选择区域">
            <Option v-for="(item, index) in stateList"
                    :key="index" :value="item.id">{{item.name}}
            </Option>
          </Select>
        </div>
        <div class="search-block">
          <Select placeholder="请选择类型">
            <Option v-for="(item, index) in stateList"
                    :key="index" :value="item.id">{{item.name}}
            </Option>
          </Select>
        </div>
        <ButtonGroup>
          <Button type="primary" @click="page=1;getList()">
            搜索
          </Button>
        </ButtonGroup>
      </div>
    </common-table>
  </Modal>
</template>
<script>
  import commonTable from '@/hxx-components/common-table.vue'
  export default {
    name: 'select-store',
    components: {commonTable},
    props: {
      showType:{
      default:false,
      },
      checkId:{
        default:function(){
          return [];
        }
      }
      },
    data() {
      return {
        stateList:[
          {id:1,name:'选择呀'}
        ],
        page: 1,
        limit: 25,
        checkObject:{},
        total: 0,
        tableData: [],
        showModal: false,
        clearType: false,
        showTable: false,
        keyIndex:{},
        columns: [
          {type: 'selection',align:'center',width:70},
          {
            title: '序号2', width: 70,align:'center',
            render: (h, params) => h('span', (this.page - 1) * this.limit + params.index + 1)
          },
          {title: '区域', key: 'A', sortable: true, minWidth: 140,align:'left'},
          {title: '类型', key: 'B', sortable: true, minWidth: 140,align:'left'},
          {title: '门店名称', key: 'C', sortable: true, minWidth: 140,align:'left'},
        ],
        search: {
          keyword: '',
        },
      }
    },
    methods: {
      changeSelect(row){
       let obj = {};
       for(let i in this.tableData){
         obj[this.tableData[i].id] = 0;
       }
       for(let i in row){
         obj[row[i].id] = 1;
       }
       for(let i in obj){
         this.checkObject[i] = obj[i];
       }
       console.log(JSON.stringify(this.checkObject));
      },
      visibleChange() {
        this.clearsection();
      },
      changePage(page) {
        this.page = page;
        this.getList();
      },
      changePageSize(size) {
        this.limit = size;
        this.getList();
      },
      getList() {
      let data = [
          {id:1,A:'A',B:'B',C:'C'},
          {id:2,A:'A',B:'B',C:'C'},
          {id:3,A:'A',B:'B',C:'C'},
          {id:4,A:'A',B:'B',C:'C'},
          {id:5,A:'A',B:'B',C:'C'},
          {id:6,A:'A',B:'B',C:'C'},
          {id:7,A:'A',B:'B',C:'C'},
          {id:8,A:'A',B:'B',C:'C'},
          {id:9,A:'A',B:'B',C:'C'},
          {id:10,A:'A',B:'B',C:'C'},
          {id:11,A:'A',B:'B',C:'C'},
          {id:12,A:'A',B:'B',C:'C'},
        ];
        for(let i in this.checkObject){
              if(this.checkObject[i] == 1){
                for(let a in data){
                  if(data[a].id == i){
                     data[a]['_checked'] = true;
                  }
                }
              }
        }
        this.tableData = data;
      },
      clear() {
        this.search.keyword = '';
      },
      clearsection() {
        this.list = '';
        this.clearType = Math.random();
      }
    },
    mounted() {

    },
    watch: {
      showType() {
        this.showModal = true;
        this.showTable = Math.random();
        for(let i in this.checkId){
          this.checkObject[this.checkId[i]] = 1;
        }
        this.columns = [
          {type: 'selection',align:'center',width:70},
          {
            title: '序号', width: 70,align:'center',
            render: (h, params) => h('span', (this.page - 1) * this.limit + params.index + 1)
          },
          {title: '区域', key: 'A', sortable: true, minWidth: 140,align:'left'},
          {title: '类型', key: 'B', sortable: true, minWidth: 140,align:'left'},
          {title: '门店名称', key: 'C', sortable: true, minWidth: 140,align:'left'},
        ]
        this.showTable = Math.random();
        this.getList();
      },
      refresh(){
        this.getList();
      }
    }
  }
  </script>
