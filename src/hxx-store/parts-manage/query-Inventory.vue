<!--库存查询-->
<template>
  <common-table v-model="tableData" :columns="columns" :total="total" :clearSelect="clearTableSelect"
                @changePage="changePage" @changePageSize="changePageSize" @onRowClick="onRowClick"
                @onRowDblclick="onRowDblclick" :show="showTable" :page="page">
    <div slot="search">
      <div class="search-block">
        <Input v-model="search.input" placeholder="配件名称/原厂编号..."></Input>
      </div>
      <div class="search-block">
        <Select v-model="search.select1" placeholder="选择仓库...">
          <Option v-for="(item, index) in allStore"
                  :key="index" :value="item.id">{{item.code}}</Option>
        </Select>
      </div>
      
      <ButtonGroup size="small">
        <Button type="primary" @click="page=1;getList()"><Icon type="ios-search" size="24"/></Button>
        <Button type="primary" @click="clear()"><Icon type="ios-undo" size="24"/></Button>
      </ButtonGroup>
    </div>
    <div slot="operate">
      <Button type="primary" v-if="accessBtn('outdetail')" :disabled='!detailData' @click="selectPick">出入库明细</Button>
    </div>
    <!--维修领料详情-->
    <query-Inventory-detail class="table-modal-detail" :showDetail="showDetail" :detailData="detailData" @closeDetail="closeDetail"></query-Inventory-detail>

  </common-table>
</template>
<script>
  import commonTable from '@/hxx-components/common-table.vue'
  import { getName, getDictGroup } from '@/libs/util.js'
  import mixin from '@/hxx-components/mixin'
  import { formatDate } from '@/libs/tools.js'
  import queryInventoryDetail from './query-Inventory-detail.vue'
export default {
	name: "query-Inventory",
    components: {commonTable,queryInventoryDetail,},
    mixins: [mixin],
    data(){
		return{
            columns: [
                {title: '序号',  minWidth: 80,
                    render: (h, params) => h('span', (this.page-1)*this.limit+params.index+1 )
                },
                {title: '仓库', key: 'STORE_NAME', sortable: true, minWidth: 150,
                },
                {title: '配件名称', key: 'NAME', sortable: true, minWidth: 150,
                },
                {title: '原厂编号', key: 'FACTORY_NO', sortable: true, minWidth: 150},
                {title: '品牌', key: 'BRAND', sortable: true, minWidth: 100,
                    render: (h, params) => h('span', getName(this.getBrand, params.row.BRAND))
                },
                {title: '库存量', key: 'STOCK_NUM', sortable: true, minWidth: 200},
                {title: '单位成本', key: 'UNIT_COST', sortable: true, minWidth: 150,
                    
                },
                {title: '采购指导价', key: 'PURCHASE_PRICE', sortable: true, minWidth: 150,
                    
                },
                {title: '建议销售价', key: 'SALES_PRICE', sortable: true, minWidth: 150,
                    
                },
                {title: '单位', key: 'UNIT', sortable: true, minWidth: 150,
                    render: (h, params) => h('span', getName(this.getUnit, params.row.UNIT))
                },
                
            ],
            tableData: [],
            search:{
                input: '',
                select1:'',
            },
            page: 1,
            limit: 25,
            total: 0,
            showTable:false,
            showDetail: false,
            detailData: null,
            clearTableSelect: null,
            allStore:[],//获取所有仓库------
      }
    },
    computed:{
        //品牌取值----
        getBrand(){
            return getDictGroup(this.$store.state.app.dict, '1016');
        },
        //单位取值--------
        getUnit(){
            return getDictGroup(this.$store.state.app.dict, '1015');
        }
    },
    mounted () {

      this.getList();
      this.showTable= Math.random();
      this.getAllStore();
            
    },
    methods:{
        //获取所有仓库---
        getAllStore(){
            this.axios.request({
                url: '/tenant/basedata/ttstorehouse/get_all_list',
                method: 'post',
                data: {
                    page: 1,
                    start: 0,
                    limit: 25,
                    access_token: this.$store.state.user.token
                }
            }).then(res => {
                if (res.success === true) {
                    for(let i in res.data){
                        var obj={code:'',id:''};
                        obj.code=res.data[i].NAME;
                        obj.id=res.data[i].STORE_ID;
                        this.allStore.push(obj);
                        
                    }
                }
            })
        },
        //获取列表值-----
        getList(){
            this.axios.request({
                url: '/tenant/repair/ttpartstock/list',
                method: 'post',
                data: {
                    KEYWORD: this.search.input,
                    STORE_ID_eq: this.search.select1||'',
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
            this.detailData = null;
        },
        clear(){
                for(var i in this.search){
                    this.search[i]= ''
                }
                this.page=1;
                this.getList()
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
            console.log(row);
            this.detailData=row
        },
        onRowDblclick( row, index){
            this.detailData=row;
            this.showDetail=Math.random();
        },
        closeDetail(){
            this.detailData= null;
            this.clearTableSelect= Math.random();
            this.getList();
        },
        //维修领料
        selectPick(){
            if(this.detailData){
                this.showDetail=Math.random();
            }else{
                this.$Message.info('请选择一条数据')
            }
        }
      
    }
}
</script>

<style lang="less" scoped>
.search-block{
  display: inline-block;
  width: 200px;
  margin-right: 10px;
}
.button-distance{
  margin-left: 10px;
}
</style>
