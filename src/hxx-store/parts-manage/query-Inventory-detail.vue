<!--预约单管理详情-->
<template>
  <Modal
    v-model="showModal"
    title="出入库明细"
    width="100"
    @on-visible-change="visibleChange"
    :scrollable="true"
    :transfer= "false"
    :footer-hide="true"
    :transition-names="['', '']"
    class="table-modal-detail full-height"
    :closable="false"
  >
    <modal-title slot="header" title="出入库明细"  @clickBack="showModal=false"></modal-title>
    <common-table v-model="tableData" :columns="columns" :total="total" :clearSelect="clearTableSelect"
                @changePage="changePage" @changePageSize="changePageSize" :show="showDetail" :page="page" :showOperate=false >
    <div slot="search">
        <Form :label-width="100"  inline class="common-form">
            <FormItem label="出入库:"  >
                <Select  placeholder="出库或者入库" v-model="search.select" style="min-width: 100%;" clearable >
                    <Option v-for="(item, index) in getStockType"
                    :key="index" :value="item.code">{{item.name}}</Option>
                </Select>
            </FormItem>
            <FormItem label="入库类型:"  >
                <Select  placeholder="入库类型..." v-model="search.select1" style="min-width: 100%;" clearable >
                    <Option v-for="(item, index) in boundType"
                    :key="index" :value="item.code">{{item.name}}</Option>
                </Select>
            </FormItem>
            <FormItem label="出库类型:"  >
                   <Select  placeholder="出库类型..." v-model="search.select2" style="min-width: 100%;" clearable >
                        <Option v-for="(item, index) in maintainType"
                        :key="index" :value="item.code">{{item.name}}</Option>
                    </Select> 
            </FormItem>
            <FormItem label="出入库日期:" style="width: 450px">
                    <DatePicker v-model="search.orderDateGte" format="yyyy-MM-dd" type="date" placeholder="开始时间" style="width: 120px;"></DatePicker>
                    <DatePicker v-model="search.orderDateIte" format="yyyy-MM-dd" type="date" placeholder="结束时间" style="width: 120px;margin-left: 5px;"></DatePicker>
                    <Button type="primary" @click="page=1;getList()">搜索</Button>
            </FormItem>

        </Form>
    </div>
  </common-table>
    
  </Modal>

</template>

<script>
  import { getName, getDictGroup ,getUserInfo} from '@/libs/util.js'
  import { formatDate } from '@/libs/tools.js'
  import commonTable from '@/hxx-components/common-table.vue'
  import ModalTitle from '@/hxx-components/modal-title.vue'
export default {
	name: "query-Inventory-detail",
    components: {commonTable,ModalTitle},
    data(){
      return{
            showModal:false,
            columns: [
                {title: '序号',  width: 70,align:'center',type:'index'
                    // render: (h, params) => h('span', (this.page-1)*this.limit+params.index+1 )
                },
                {title: '类型', key: 'TYPE', sortable: true, minWidth: 100,
                    render: (h, params) => {
                        var bgColor='green';
                        if(params.row.TYPE==10501002){
                            bgColor='red';
                        }else{
                            bgColor='green';
                        }
                        return h('div', {
                                style: {
                                    textAlign: "center",
                                    background: bgColor,
                                    color:'#fff',
                                },
                            },getName(this.getStockType, params.row.TYPE))
                        }
                },
                {title: '配件名称', key: 'NAME', sortable: true, minWidth: 150,
                },
                {title: '原厂编号', key: 'FACTORY_NO', sortable: true, minWidth: 150},
                {title: '品牌', key: 'BRAND', sortable: true, minWidth: 100,
                    render: (h, params) => h('span', getName(this.getBrand, params.row.BRAND))
                },
                {title: '出入库日期', key: 'STOCK_DATE', sortable: true, minWidth: 200},
                {title: '出入库类型', key: 'STOCK_TYPE', sortable: true, minWidth: 150,
                    render: (h, params) => h('span', getName(this.maintainType, params.row.STOCK_TYPE)||getName(this.boundType, params.row.STOCK_TYPE))
                },
                {title: '数量', key: 'NUMS', sortable: true, minWidth: 100,
                    render: (h, params) => {
                        var bgColor='green';
                        var bgNum='+'
                        if(params.row.TYPE==10501002){
                            bgColor='red';
                            bgNum='-'+params.row.NUMS
                        }else{
                            bgColor='green';
                            bgNum='+'+params.row.NUMS
                        }
                        return h('div', {
                                style: {
                                    textAlign: "right",
                                    color:bgColor,
                                },
                            },bgNum)
                        }
                },
                
                {title: '单位', key: 'UNIT', sortable: true, minWidth: 100,
                    render: (h, params) => h('span', getName(this.getUnit, params.row.UNIT))
                },
                {title: '出入库金额', key: 'MONEY', sortable: true, minWidth: 150,
                    render: (h, params) => {
                        var bgColor='green';
                        var bgNum='+'
                        if(params.row.TYPE==10501002){
                            bgColor='red';
                            bgNum='-'+this.formatMoney(params.row.MONEY)
                        }else{
                            bgColor='green';
                            bgNum='+'+this.formatMoney(params.row.MONEY)
                        }
                        return h('div', {
                                style: {
                                    textAlign: "right",
                                    color:bgColor,
                                },
                            },bgNum)
                        }
                },
                {title: '业务单号', key: 'OLD_DOC_NO', sortable: true, minWidth: 150,
                    // render: (h, params) => h('span', params.row.SUM_MONEY|| '0.00')
                },
                
            ],
            tableData: [],
            search:{
                select: '',
                select1:'',
                select2:'',
                orderDateGte:'',    //开始-时间
                orderDateIte:'',    //结束时间
            },
            page: 1,
            limit: 25,
            total: 0,
            showTable:false,
            clearTableSelect: null,
            allStore:[],//获取所有仓库------
            outInBoundData:[],//出或者入库
            boundType:[],//入库类型
            maintainType:[],//维修类型
            goOnDetailData:null,
            brandArr:[],//品牌数据------
      }
    },
    props:['showDetail', 'detailData'],
    watch:{
      showDetail(){
          this.showModal=true;
          this.goOnDetailData=this.detailData;
          this.getList();
      }
    },
    computed:{
        getBrand(){
            return getDictGroup(this.$store.state.app.dict, '1016');
        },
        getStockType(){
            return getDictGroup(this.$store.state.app.dict, '1050');
        },
        getUnit(){
            return getDictGroup(this.$store.state.app.dict, '1015');
        }
    },
    mounted () {
      this.boundType=getDictGroup(this.$store.state.app.dict, '1026');
      this.maintainType=getDictGroup(this.$store.state.app.dict, '1025');

    },
    methods:{
        getList(){
            this.search.orderDateGte=formatDate(this.search.orderDateGte);
            this.search.orderDateIte=formatDate(this.search.orderDateIte);
            this.axios.request({
                url: '/tenant/repair/ttpartstock/all_list',
                method: 'post',
                data: {
                    TYPE_eq: this.search.select||'',
                    STOCK_IN_TYPE: this.search.select1||'',
                    STOCK_OUT_TYPE: this.search.select2||'',
                    STOCK_DATE_gte: this.search.orderDateGte,
                    STOCK_DATE_lte: this.search.orderDateIte,
                    PART_ID_eq: this.goOnDetailData.PART_ID,
                    STORE_ID_eq: this.goOnDetailData.STORE_ID,
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

        visibleChange(status){
            if(status === false){
                this.$emit('closeDetail');
                // this.handleReset("listSearch");
            }
        },
    }
}
</script>

<style scoped lang="less">
  .search-block{
    display: inline-block;
    width: 200px;
    margin-right: 10px;
  }
  .r-list-search{
    width: 100%;
    padding: 20px 0;
    text-align: center;

  }
  .r-list-choose-parts{
    width: 100%;
    padding: 20px 0;
    text-align: center;
  }
  .r-list-money{
    width: 100%;
    font-size: 18px;
    text-align: center;

    span{
      color:red;

    }
    .r-list-money-reset{
      font-size: 22px;
    }
  }
  .r-list-chekbox{
    width: 100%;
    overflow: hidden;
    font-size: 18px;
    padding: 0px 10px;
    div{
      float:right;
    }
  }
</style>
