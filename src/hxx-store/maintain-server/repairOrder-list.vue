<!--预约单管理-->
<template>
  <common-table v-model="tableData" :columns="columns" :total="total" :clearSelect="clearTableSelect"
                @changePage="changePage" @changePageSize="changePageSize" @onRowClick="onRowClick"
                @onRowDblclick="onRowDblclick" :show="showTable">
    <div  slot="search"  >
      <div class="search-block">
        <Input v-model="search.input" placeholder="预约单号/预约人/联系电话..."></Input>
      </div>
      <div class="search-block">
        <Select v-model="search.select" placeholder="选择工单类型...">
          <Option v-for="(item, index) in searchSelectOption1"
                  :key="index" :value="item.code">{{item.name}}</Option>
        </Select>
      </div>
      <div class="search-block">
        <Select v-model="search.select1" placeholder="选择状态...">
          <Option v-for="(item, index) in searchSelectState1"
                  :key="index" :value="item.code">{{item.name}}</Option>
        </Select>
      </div>
      <div class="search-block"style="width:250px;">
        <DatePicker v-model="search.orderDateGte" type="date" placeholder="开始时间" style="width: 120px;"></DatePicker>
        <DatePicker v-model="search.orderDateIte" type="date" placeholder="结束时间" style="width: 120px;margin-left: 5px;"></DatePicker>
      </div>

      <ButtonGroup size="small">
        <Button type="primary" @click="page=1;getList()"><Icon type="ios-search" size="24"/></Button>
        <Button type="primary" @click="clear()"><Icon type="ios-undo" size="24"/></Button>
      </ButtonGroup>
    </div>
    <div slot="operate">
      <Button type="primary" v-if="accessBtn('add')" @click="detailData=null,showDetail=Math.random()">维修开单</Button>
      <Button type="info"  @click="showDetail=Math.random()" :disabled="!detailData">快速开单</Button>
      <Button type="error" v-if="accessBtn('edit')"  @click="deleteDetailData" :disabled="isOrderSuccess">编辑/查看</Button>
      <Button type="primary"  @click="detailData=null,showDetail=Math.random()">反派工</Button>
      <Button type="info"    @click="showDetail=Math.random()" :disabled="!detailData">反完工</Button>
      <Button type="error"  @click="deleteDetailData" :disabled="isOrderSuccess">反结算</Button>
      <Button type="error" v-if="accessBtn('ban')"  @click="deleteDetailData" :disabled="isOrderSuccess">作废</Button>
    </div>

    <repairOrder-list-detail class="table-modal-detail" :showDetail="showDetail"
                             :detailData="detailData" @closeDetail="closeDetail"
      ></repairOrder-list-detail>
      <!--弹出层组建-->
      <common-modal6 :description="tooltipObj.description"
      :title="tooltipObj.title" :modal6="tooltipObj.mshow" :fun="tooltipObj.funName" @del="del"></common-modal6>
  </common-table>
</template>
<script>
  import commonTable from '@/hxx-components/common-table.vue'
  import repairOrderListDetail from './repairOrder-list-detail.vue'
  import { getName, getDictGroup } from '@/libs/util.js'
  import commonModal6 from '@/hxx-components/common-modal6.vue'
  import mixin from '@/hxx-components/mixin'
  import { formatDate } from '@/libs/tools.js'
	export default {
	name: "repairOrder-list",
    components: {commonTable, repairOrderListDetail,commonModal6},
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
          {title: '送修人', key: 'GIVE_REPAIR_PERSON', sortable: true, minWidth: 150,
            // render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.ORDER_TYPE))
          },
          {title: '联系电话', key: 'TELPHONE', sortable: true, minWidth: 150},
          {title: '车牌号', key: 'PLATE_NUM', sortable: true, minWidth: 150},
          {title: '车型', key: 'VEHICLE_MODEL', sortable: true, minWidth: 100},
          {title: '进厂日期', key: 'COME_DATE', sortable: true, minWidth: 200},
          {title: '维修类型', key: 'REPAIR_TYPE', sortable: true, minWidth: 150,
            render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.REPAIR_TYPE))
          },
          {title: '工单类型', key: 'GD_TYPE', sortable: true, minWidth: 100,
            render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.GD_TYPE))
          },
          {title: '应收金额', key: 'SUM_MONEY', sortable: true, minWidth: 150,
            // render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.REPAIR_TYPE))
          },
          {title: '主修人', key: 'REPAIR_PERSON', sortable: true, minWidth: 150,
            // render: (h, params) => h('span', params.row.SUM_MONEY|| '0.00')
          },
          {title: '状态', key: 'STATUS', sortable: true, minWidth: 150,
            render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.STATUS))
          },
          {title: '服务顾问', key: 'FOLLOW_PERSON', sortable: true, minWidth: 150},
          {title: '工单单号', key: 'REPAIR_NO', sortable: true, minWidth: 150},
        ],
        tableData: [],
        searchSelectOption:[],//搜索框选择工单类型
        searchSelectOption1:[],//重新赋值--
        searchSelectState:[],//搜索框选择状态
        searchSelectState1:[],//重新赋值--

        search:{
          input: '',
          select: '',
          select1:'',
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
      //重置搜索框数据
      this.searchSelectOption= getDictGroup(this.$store.state.app.dict, '1018');
      this.searchSelectOption1.push({
          "code":"",
          "order":0,
          "group":"1018",
          "name":"全部"
      });
      for(let i=0;i<this.searchSelectOption.length;i++){
        this.searchSelectOption1.push(this.searchSelectOption[i]);
      }
      this.searchSelectState= getDictGroup(this.$store.state.app.dict, '1020');
      this.searchSelectState1.push({
          "code":"",
          "order":0,
          "group":"1020",
          "name":"全部"
      });
      for(let i=0;i<this.searchSelectState.length;i++){
        this.searchSelectState1.push(this.searchSelectState[i]);
      }


      this.getList()
      this.showTable= Math.random()

            
    },
    methods:{
            

		  getList(){
            if(this.search.orderDateGte){
                this.search.orderDateGte=formatDate(this.search.orderDateGte);
            }

            if(this.search.orderDateIte){
                this.search.orderDateIte=formatDate(this.search.orderDateIte);
            }
            console.log(this.search);
            this.axios.request({
                url: '/tenant/repair/ttrepairworkorder/list',
                method: 'post',
                data: {
                    KEYWORD: this.search.input,
                    GD_TYPE_eq: this.search.select,
                    STATUS: this.search.select1,
                    ACCOUNT_TIME_gte: this.search.orderDateGte,
                    ACCOUNT_TIME_lte: this.search.orderDateIte,
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
                console.log("进入作废系统");
                this.tooltipObj.title = '系统提示!';
                this.tooltipObj.description = '确定要作废吗？';
                this.tooltipObj.mshow = Math.random();
                console.log(this.tooltipObj);
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
        // changeModal6(type){
        //   this.tooltipObj.mshow = type;
        // },
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
