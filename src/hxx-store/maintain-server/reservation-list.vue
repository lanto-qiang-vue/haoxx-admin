<!--预约单管理 2018 09 05-->
<template>
  <common-table v-model="tableData" :columns="columns" :total="total" :clearSelect="clearTableSelect"
                @changePage="changePage" @changePageSize="changePageSize" @onRowClick="onRowClick"
                @onRowDblclick="onRowDblclick" :show="showTable" :page="page" :loading="loading">
    <div  slot="search"  >
      <div class="search-block">
        <Input v-model="search.input" placeholder="预约单号/预约人/联系电话..."></Input>
      </div>
      <div class="search-block">
        <Select v-model="search.select" placeholder="选择状态..." clearable>
          <Option v-for="(item, index) in searchSelectOption1"
                  :key="index" :value="item.code">{{item.name}}</Option>
        </Select>
      </div>
      <div class="search-block"style="width:250px;">
        <DatePicker v-model="search.orderDateGte" format="yyyy-MM-dd" type="date" placeholder="开始时间" style="width: 115px;"></DatePicker> -
        <DatePicker v-model="search.orderDateIte" format="yyyy-MM-dd" type="date" placeholder="结束时间" style="width: 115px;"></DatePicker>
      </div>

      <div class="search-block"style="width:auto">
        <Button type="primary" @click="page=1;getList()">搜索</Button>
      </div>


    </div>
    <div slot="operate">
      <Button type="success" v-if="accessBtn('add')" @click="detailData=null,showDetail=Math.random()">新增</Button>

      <Button type="error" v-if="accessBtn('ban')"  @click="deleteDetailData" :disabled="disableBan">取消</Button>
      <Button type="info" v-if="accessBtn('edit')" @click="showDetail=Math.random()" :disabled="!detailData">编辑/查看</Button>
      <Button type="info" v-if="true" @click="toReceive"
              :disabled="receiveDesabled">车生活接单</Button>
    </div>
    <!--预约详情单-->
    <reservation-list-detail class="table-modal-detail" :showDetail="showDetail"
                             :detailData="detailData" @closeDetail="closeDetail" @closeGetList="closeGetList">
      <Button type="success" v-show="detailData&& detailData.REPAIR_TYPE=='10191012'" @click="goToCheck" slot="foot">车辆检查</Button>
    </reservation-list-detail>

  </common-table>
</template>
<script>
  import commonTable from '@/hxx-components/common-table.vue'
  import reservationListDetail from './reservation-list-detail.vue'
  import { getName, getDictGroup } from '@/libs/util.js'
  import { formatDate } from '@/libs/tools.js'
  import mixin from '@/hxx-components/mixin'
	export default {
		name: "reservation-list",
    components: {commonTable, reservationListDetail,},
    mixins: [mixin],
    data(){
		  return{
        loading:false,
        columns: [
          {title: '序号',  width: 70,align:'center', sortable: true,type:'index'
            // render: (h, params) => h('span', (this.page-1)*this.limit+params.index+1 )
          },
          {title: '预约类别', key: 'ORDER_TYPE', sortable: true, minWidth: 120,
            render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.ORDER_TYPE))
          },
          {title: '预约人', key: 'ORDER_PERSON', sortable: true, minWidth: 120},
          {title: '联系电话', key: 'TELPHONE', sortable: true, minWidth: 135},
          {title: '车牌号', key: 'PLATE_NUM', sortable: true, minWidth: 120},
          {title: '车型', key: 'VEHICLE_MODEL', sortable: true, minWidth: 200},
          {title: '预约日期', key: 'ORDER_DATE', sortable: true, minWidth: 130,
            render: (h, params) => h('span', params.row.ORDER_DATE.substr(0, 10))
          },
          {title: '预约时间', key: 'ORDER_TIME', sortable: true, minWidth: 120},
          {title: '维修类型', key: 'REPAIR_TYPE', sortable: true, minWidth: 120,
            render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.REPAIR_TYPE))
          },
          {title: '应收金额', key: 'SUM_MONEY', sortable: true, minWidth: 120,align:'right',

            render: (h, params) => h('span', this.formatMoney(params.row.SUM_MONEY))

          },
          {title: '状态', key: 'STATUS', sortable: true, minWidth: 110,
            render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.STATUS))
          },
          {title: '预约单号', key: 'ORDER_NO', sortable: true, minWidth: 170},
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
        isOrderSuccess:true,//判断是不是预约成功

      }
    },
    computed:{
      receiveDesabled(){
        return !this.detailData|| this.detailData.ORDER_TYPE!='10411003' || this.detailData.STATUS!='10421002'
      },
      disableBan(){
        let disable= true
        if(this.detailData && this.detailData.STATUS)
        switch (this.detailData.STATUS){
          case '10421001':
          case '10421002':{
            disable= false
            break
          }
        }
        return disable
      }
    },
    activated(){
      this.getList()
    },
    mounted () {
      this.searchSelectOption= getDictGroup(this.$store.state.app.dict, '1042');
      for(let i=0;i<this.searchSelectOption.length;i++){

        if(this.searchSelectOption[i].code==="10421004"){

        }else{
          this.searchSelectOption1.push(this.searchSelectOption[i]);
        }
      }
      this.getList()
      this.showTable= Math.random()
    },
    methods:{
      //获取当前页面数据------
		  getList(){
        this.search.orderDateGte=formatDate(this.search.orderDateGte);
        this.search.orderDateIte=formatDate(this.search.orderDateIte);
        this.loading=true;
        this.axios.request({
          url: '/tenant/repair/ttrepairorder/list',
          method: 'post',
          data: {
            KEYWORD: this.search.input,
            STATUS_eq: this.search.select||'',
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
            this.loading=false;
          }
        })

        this.detailData= null
        this.isOrderSuccess=true;
      },
      toReceive(){
        let receive=(stu)=> {
          this.axios.post('/tenant/repair/ttrepairorder/noAccept',{
            orderId: this.detailData.ORDER_ID,
            status: stu
          }).then(res => {
            if (res.success) {
              this.getList()
            }
          })
        }
        this.$Modal.confirm({title:'车生活预约', content: '是否接受预约？', okText: '接受', cancelText: '拒绝', closable: true,
          onOk(){
            receive('10421005')
          },
          onCancel(){
            receive('10421004')
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
          // console.log('row：',row);
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
        this.isOrderSuccess=true;
        this.clearTableSelect= Math.random()
      },
      //只有保存数据和提交数据的时候更新界面列表，
      closeGetList(){
        this.getList();
      },
      //取消按钮---------
      deleteDetailData(){
          if(this.detailData == null){
            this.$Message.info("未选择到数据!");
          }else{
              this.$Modal.confirm({
                  title:"系统提示!",
                  content:"确定要取消吗？",
                  okText: '确定', cancelText: '取消',
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
              this.$Message.info("数据取消成功!");
              this.detailData=null;
              this.getList();
            }
          })
      },
      goToCheck(){
		    this.$router.push('/car-inspection-list?PLATE_NUM='+ this.detailData.PLATE_NUM)

      }

    },

	}
</script>

<style lang="less" scoped>
.search-block{
  display: inline-block;
  width: 200px;
  margin-right: 10px;
}
</style>
