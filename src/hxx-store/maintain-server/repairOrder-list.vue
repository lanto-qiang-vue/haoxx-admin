<!--预约单管理-->
<template>
  <common-table v-model="tableData" :columns="columns" :total="total" :clearSelect="clearTableSelect"
                @changePage="changePage" @changePageSize="changePageSize" @onRowClick="onRowClick"
                @onRowDblclick="onRowDblclick" :show="showTable" :page="page">
    <div  slot="search">
      <div class="search-block">
        <Input v-model="search.input" placeholder="工单单号/送修人/联系电话..."></Input>
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
      <Button type="primary" v-if="accessBtn('add')" :disabled="buttonStateArr.add" @click="detailData=null,showDetail=Math.random()">维修开单</Button>
      <Button type="primary" v-if="accessBtn('quickAdd')" @click="detailData=null,showQuickDetail=Math.random()" :disabled="buttonStateArr.quickAdd" class="button-distance">快速开单</Button>
      <Button type="info" v-if="accessBtn('edit')"  @click="showEditFun" :disabled="buttonStateArr.edit" class="button-distance">编辑/查看</Button>
      <Button type="warning" v-if="accessBtn('reFinish')" @click="reSubmitFun" :disabled="buttonStateArr.rePg" class="button-distance">反派工</Button>
      <Button type="warning"  v-if="accessBtn('reSubmit')"  @click="reFinishFun" :disabled="buttonStateArr.reFinish" class="button-distance">反完工</Button>
      <Button type="warning" v-if="accessBtn('reAccount')" @click="reAccountFun" :disabled="buttonStateArr.reAccount" class="button-distance">反结算</Button>
      <Button type="error" v-if="accessBtn('ban')"  @click="deleteDetailData" :disabled="buttonStateArr.ban" class="button-distance">作废</Button>
    </div>
    <repairOrder-list-detail class="table-modal-detail" :showDetail="showDetail"
                             :detailData="detailData" :detailQuery="detailQuery" @closeDetail="closeDetail" @closeGetList="closeGetList" 
      ></repairOrder-list-detail>

      <repairOrder-list-quickDetail class="table-modal-detail" :showQuickDetail="showQuickDetail"
                             :detailData="detailData" @closeDetail="closeDetail" @closeGetList="closeGetList"
      ></repairOrder-list-quickDetail>

  </common-table>
</template>
<script>
  import commonTable from '@/hxx-components/common-table.vue'
  import repairOrderListDetail from './repairOrder-list-detail.vue'
  import repairOrderListQuickDetail from './repairOrder-list-quickDetail.vue'
  import { getName, getDictGroup } from '@/libs/util.js'
  import mixin from '@/hxx-components/mixin'
  import { formatDate } from '@/libs/tools.js'
	export default {
	name: "repairOrder-list",
    components: {commonTable, repairOrderListDetail,repairOrderListQuickDetail},
    mixins: [mixin],
    data(){
		  return{
        showQuickDetail:null,//快速开单框
        columns: [
          // {type: 'selection', width: 50, fixed: 'left'},
          {title: '序号',  minWidth: 80,
            render: (h, params) => h('span', (this.page-1)*this.limit+params.index+1 )
          },
          {title: '送修人', key: 'GIVE_REPAIR_PERSON', sortable: true, minWidth: 120,
            // render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.ORDER_TYPE))
          },
          {title: '联系电话', key: 'TELPHONE', sortable: true, minWidth: 130},
          {title: '车牌号', key: 'PLATE_NUM', sortable: true, minWidth: 130},
          {title: '车型', key: 'VEHICLE_MODEL', sortable: true, minWidth: 250},
          {title: '进厂日期', key: 'COME_DATE', sortable: true, minWidth: 180},
          {title: '维修类型', key: 'REPAIR_TYPE', sortable: true, minWidth: 120,
            render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.REPAIR_TYPE))
          },
          {title: '工单类型', key: 'GD_TYPE', sortable: true, minWidth: 120,
            render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.GD_TYPE))
          },
          {title: '应收金额', key: 'SUM_MONEY', sortable: true, minWidth: 120,
            // render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.REPAIR_TYPE))
          },
          {title: '主修人', key: 'REPAIR_PERSON', sortable: true, minWidth: 110,
            // render: (h, params) => h('span', params.row.SUM_MONEY|| '0.00')
          },
          {title: '状态', key: 'STATUS', sortable: true, minWidth: 130,
            render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.STATUS))
          },
          {title: '服务顾问', key: 'FOLLOW_PERSON', sortable: true, minWidth: 120},
          {title: '工单单号', key: 'REPAIR_NO', sortable: true, minWidth: 170},
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
        showTable:Math.random(),
        showDetail: false,
        detailData: null,
        detailQuery:null,
        clearTableSelect: null,
        isOrderSuccess:false,//判断是不是预约成功
        buttonStateArr:{
          add:false,//维修开单
          quickAdd:false,//快速开单
          edit:false,//编辑
          rePg:false,//反派工
          reFinish:false,//反完工
          reAccount:false,//反结算
          ban:false,//作废
        },//按钮状态组数据


        

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
    activated(){
      this.getRouterData();
    },
    methods:{
      //获取列表数据-----
		  getList(){
        this.search.orderDateGte=formatDate(this.search.orderDateGte);
        this.search.orderDateIte=formatDate(this.search.orderDateIte);
        this.axios.request({
            url: '/tenant/repair/ttrepairworkorder/list',
            method: 'post',
            data: {
                KEYWORD: this.search.input,
                GD_TYPE_eq: this.search.select||'',
                STATUS: this.search.select1||'',
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
          //重置按钮状态------------
          for(let i in this.buttonStateArr){
              switch(i){
                case 'add':
                case 'quickAdd': this.buttonStateArr[i]= false; break
                default : this.buttonStateArr[i]= true;
              }
          }
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
          if(row.GD_TYPE=="10181002"){
            this.detailData=row
          }else{
            this.detailData=row
          }

          if(row.STATUS=="10201001"){
              for(let i in this.buttonStateArr){
                switch(i){
                  case 'rePg':
                  case 'reFinish':
                  case 'reAccount': this.buttonStateArr[i]= true; break
                  default : this.buttonStateArr[i]= false;
                }
              }
          }else if(row.STATUS=="10201002"){
              for(let i in this.buttonStateArr){
                switch(i){
                  case 'ban':
                  case 'reFinish':
                  case 'reAccount': this.buttonStateArr[i]= true; break
                  default : this.buttonStateArr[i]= false;
                }
              }
          }else if(row.STATUS=="10201003"){
              for(let i in this.buttonStateArr){
                switch(i){
                  case 'ban':
                  case 'rePg':
                  case 'reAccount': this.buttonStateArr[i]= true; break
                  default : this.buttonStateArr[i]= false;
                }
              }
          }else if(row.STATUS=="10201004"){
              for(let i in this.buttonStateArr){
                switch(i){
                  case 'ban':
                  case 'rePg':
                  case 'reFinish': this.buttonStateArr[i]= true; break
                  default : this.buttonStateArr[i]= false;
                }
              }
          }else if(row.STATUS=="10201005"){
              for(let i in this.buttonStateArr){
                switch(i){
                  case 'ban':
                  case 'rePg':
                  case 'reFinish': this.buttonStateArr[i]= true; break
                  default : this.buttonStateArr[i]= false;
                }
              }
          }else if(row.STATUS=="10201006"){
              for(let i in this.buttonStateArr){
                switch(i){
                  case 'ban':
                  case 'rePg':
                  case 'reFinish': this.buttonStateArr[i]= true; break
                  default : this.buttonStateArr[i]= false;
                }
              }
          }else{
              for(let i in this.buttonStateArr){
                  this.buttonStateArr[i]= false;
              }
          }
          
      },
      onRowDblclick( row, index){
          if(row.GD_TYPE=="10181002"){
            this.detailData=row;
            this.showQuickDetail=Math.random();
          }else{
            this.detailData=row;
            this.showDetail=Math.random();
          }
          
      },
      closeDetail(){
          this.detailData= null;
          this.clearTableSelect= Math.random();
          this.detailQuery=null;
          //重置按钮状态
          for(let i in this.buttonStateArr){
              switch(i){
                case 'add':
                case 'quickAdd': this.buttonStateArr[i]= false; break
                default : this.buttonStateArr[i]= true;
              }
          }
      },
      closeGetList(){
        this.getList();
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
              url: '/tenant/repair/ttrepairworkorder/delete',
              method: 'post',
              data: {
              ids: this.detailData.REPAIR_ID,
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
      //编辑按钮数据-----------
      showEditFun(){
          if(this.detailData.GD_TYPE=="10181002"){
            this.showQuickDetail=Math.random();
          }else{
            this.showDetail=Math.random();
          }
      },
      //反结算------
      reAccountFun(){
        this.$Modal.confirm({
            title:"系统提示!",
            content:"确定要反结算吗？",
            onOk:this.reAccountFunOk,
            
        })
         
      },
      reAccountFunOk(){
         this.axios.request({
              url: '/tenant/repair/ttrepairworkorder/reAccount',
              method: 'post',
              data: {
              repairId: this.detailData.REPAIR_ID,
              access_token: this.$store.state.user.token
              }
          }).then(res => {
              if (res.success === true) {
                this.getList();
              }
          })
      },
      //反完工------
      reFinishFun(){
        this.$Modal.confirm({
            title:"系统提示!",
            content:"确定要反完工吗？",
            onOk:this.reFinishFunOk,
            
        })
         
      },
      reFinishFunOk(){
         this.axios.request({
              url: '/tenant/repair/ttrepairworkorder/reFinish',
              method: 'post',
              data: {
              repairId: this.detailData.REPAIR_ID,
              access_token: this.$store.state.user.token
              }
          }).then(res => {
              if (res.success === true) {
                this.getList();
              }
          })
      },
      //反派工----
      reSubmitFun(){
        this.$Modal.confirm({
            title:"系统提示!",
            content:"确定要反派工吗？",
            onOk:this.reSubmitFunOk,
            
        })
         
      },
      reSubmitFunOk(){
         this.axios.request({
              url: '/tenant/repair/ttrepairworkorder/reSubmit',
              method: 'post',
              data: {
              repairId: this.detailData.REPAIR_ID,
              access_token: this.$store.state.user.token
              }
          }).then(res => {
              if (res.success === true) {
                this.getList();
              }else{
                this.$Modal.confirm({
                    title:"系统提示!",
                    content:res.Exception.message,
                })
              }
          })
      },
      //监听传过来的数据值-----------，
      getRouterData(){
        var queryData=this.$route.query;
        if(queryData.flag){
            this.detailQuery=queryData;
            this.showDetail=Math.random();
            console.log("有值",queryData);
        }else{
            console.log("没有值");
        }
        
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
.button-distance{
  margin-left: 10px;
}
</style>
