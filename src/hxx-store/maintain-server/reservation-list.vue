<!--预约单管理-->
<template>
  <common-table v-model="tableData" :columns="columns" :total="total" :clearSelect="clearTableSelect"
                @changePage="changePage" @changePageSize="changePageSize" @onRowClick="onRowClick"
                @onRowDblclick="onRowDblclick" :show="showTable" :page="page">
    <div  slot="search"  >
      <div class="search-block">
        <Input v-model="search.input" placeholder="预约单号/预约人/联系电话..."></Input>
      </div>
      <div class="search-block">
        <Select v-model="search.select" placeholder="选择状态...">
          <Option v-for="(item, index) in searchSelectOption1"
                  :key="index" :value="item.code">{{item.name}}</Option>
        </Select>
      </div>
      <div class="search-block"style="width:250px;">
        <DatePicker @on-change="getOrderDateGte" format="yyyy-MM-dd" type="date" placeholder="开始时间" style="width: 120px;"></DatePicker>
        <DatePicker @on-change="getOrderDateIte" format="yyyy-MM-dd" type="date" placeholder="结束时间" style="width: 120px;margin-left: 5px;"></DatePicker>
      </div>

      <ButtonGroup size="small">
        <Button type="primary" @click="page=1;getList()"><Icon type="ios-search" size="24"/></Button>
        <Button type="primary" @click="clear()"><Icon type="ios-undo" size="24"/></Button>
      </ButtonGroup>
    </div>
    <div slot="operate">
      <Button type="primary" v-if="accessBtn('add')" @click="detailData=null,showDetail=Math.random()">新增</Button>
      <Button type="info" v-if="accessBtn('edit')" @click="showDetail=Math.random()" :disabled="!detailData">编辑/查看</Button>
      <Button type="error" v-if="accessBtn('ban')"  @click="deleteDetailData" :disabled="isOrderSuccess">作废</Button>
    </div>
    <!--预约详情单-->
    <reservation-list-detail class="table-modal-detail" :showDetail="showDetail"
                             :detailData="detailData" @closeDetail="closeDetail"
      ></reservation-list-detail>
      
  </common-table>
</template>
<script>
  import commonTable from '@/hxx-components/common-table.vue'
  import reservationListDetail from './reservation-list-detail.vue'
  import { getName, getDictGroup } from '@/libs/util.js'
  import mixin from '@/hxx-components/mixin'
	export default {
		name: "reservation-list",
    components: {commonTable, reservationListDetail,},
    mixins: [mixin],
    data(){
		  return{
        tooltipObj:{
            mshow:null,
            funName:'del',
            description:'',
            title:'',
        },
        columns: [
          // {type: 'selection', width: 50, fixed: 'left'},
          {title: '序号',  minWidth: 60,
            render: (h, params) => h('span', (this.page-1)*this.limit+params.index+1 )
          },
          {title: '预约类别', key: 'ORDER_TYPE', sortable: true, minWidth: 150,
            render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.ORDER_TYPE))
          },
          {title: '预约人', key: 'ORDER_PERSON', sortable: true, minWidth: 150},
          {title: '联系电话', key: 'TELPHONE', sortable: true, minWidth: 150},
          {title: '车牌号', key: 'PLATE_NUM', sortable: true, minWidth: 100},
          {title: '车型', key: 'VEHICLE_MODEL', sortable: true, minWidth: 200},
          {title: '预约日期', key: 'ORDER_DATE', sortable: true, minWidth: 150,
            render: (h, params) => h('span', params.row.ORDER_DATE.substr(0, 10))
          },
          {title: '预约时间', key: 'ORDER_TIME', sortable: true, minWidth: 100},
          {title: '维修类型', key: 'REPAIR_TYPE', sortable: true, minWidth: 150,
            render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.REPAIR_TYPE))
          },
          {title: '应收金额', key: 'SUM_MONEY', sortable: true, minWidth: 150,
            render: (h, params) => h('span', params.row.SUM_MONEY|| '0.00')
          },
          {title: '状态', key: 'STATUS', sortable: true, minWidth: 150,
            render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.STATUS))
          },
          {title: '预约单号', key: 'ORDER_NO', sortable: true, minWidth: 150},
        ],
        tableData: [],
        searchSelectOption:[],
        searchSelectOption1:[],//重新赋值--
        search:{
          input: '',
          select: '',
          orderDateGte:'',    //开始-时间
          orderDateIte:'',    //结束时间
        },
        page: 1,
        limit: 25,
        total: 0,
        showTable:false,
        showDetail: false,
        detailData: null,
        clearTableSelect: null,
        isOrderSuccess:false,//判断是不是预约成功
        
      }
    },
    mounted () {
      this.searchSelectOption= getDictGroup(this.$store.state.app.dict, '1042');
      this.searchSelectOption1.push({
          "code":"",
          "order":0,
          "group":"1042",
          "name":"全部"
      });
      for(let i=0;i<this.searchSelectOption.length;i++){
        this.searchSelectOption1.push(this.searchSelectOption[i]);
      }
      this.getList()
      this.showTable= Math.random()
    },
    methods:{
		  getList(){
        
        this.axios.request({
          url: '/tenant/repair/ttrepairorder/list',
          method: 'post',
          data: {
            KEYWORD: this.search.input,
            STATUS_eq: this.search.select,
            ORDER_DATE_gte:this.search.orderDateGte,
            ORDER_DATE_lte: this.search.orderDateIte,
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
		    for(let i in this.search){
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
          console.log('row：',row);
          if(row.STATUS=="10421003"){
              this.isOrderSuccess=true;
          }else{
              this.isOrderSuccess=false;
          }

        this.detailData=row
      },
      onRowDblclick( row, index){
        this.detailData=row
        console.log('row：',row);
        this.showDetail=Math.random()
      },
      closeDetail(){
        this.detailData= null
        this.clearTableSelect= Math.random()
        this.getList()
      },
      //作废按钮---------
      deleteDetailData(){
          if(this.detailData == null){
            this.$Message.info("未选择到数据!");
          }else{
              this.$Modal.confirm({
                  title:"系统提示!",
                  content:"确定要作废吗？",
                  onOk:this.del,
                  
              })
          }
      },
      del(){
          this.axios.request({
            url: '/tenant/repair/ttrepairorder/delete',
            method: 'post',
            data: {
              ids: this.detailData.ORDER_ID,
              access_token: this.$store.state.user.token
            }
          }).then(res => {
            if (res.success === true) {
              this.$Message.info("数据作废成功!");
              this.detailData=null;
              this.getList();
            }
          })
      },
      //获取搜索框开始时间
      getOrderDateGte(val){
        this.search.orderDateGte=val;
      },
      //获取搜索框结束时间
      getOrderDateIte(val){
        this.search.orderDateIte=val;
      },

    }
	}
</script>

<style lang="less" scoped>
.search-block{
  display: inline-block;
  width: 200px;
  margin-right: 10px;
}
</style>
