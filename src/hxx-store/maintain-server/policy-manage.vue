<!--保单管理 2018-09-10 -->
<template>
  <common-table v-model="tableData" :columns="columns" :total="total" :clearSelect="clearTableSelect"
                @changePage="changePage" @changePageSize="changePageSize" @onRowClick="onRowClick"
                @onRowDblclick="onRowDblclick" :show="showTable" :page="page">
    <div  slot="search"  >
      <div class="search-block">
        <Input v-model="search.input" placeholder="车牌号码/客户名称..."></Input>
      </div>
      <div class="search-block">
        <Select v-model="search.select" placeholder="选择状态..." clearable>
          <Option v-for="(item, index) in searchSelectOption"
                  :key="index" :value="item.code">{{item.name}}</Option>
        </Select>
      </div>
      <Button type="primary" @click="page=1;getList()">搜索</Button>
    </div>
    <div slot="operate">
      <Button type="success" v-if="accessBtn('add')" @click="detailData=null,showDetail=Math.random()">新增</Button>

      <Button type="info" v-if="" @click="auditButton" :disabled="buttonStateArr.audit">审核</Button>
      <Button type="info" v-if="" @click="reAuditButton" :disabled="buttonStateArr.reAudit">反审核</Button>
      <Button type="error" v-if="accessBtn('del')"  @click="deleteDetailData" :disabled="buttonStateArr.ban">作废</Button>
      <Button type="info" v-if="accessBtn('edit')" @click="showDetail=Math.random()" :disabled="buttonStateArr.edit">修改/查看</Button>
    </div>
    <!--预约详情单-->
    <policy-manage-detail class="table-modal-detail" :showDetail="showDetail"
                             :detailData="detailData" @closeDetail="closeDetail" @closeGetList="closeGetList"
      ></policy-manage-detail>

  </common-table>
</template>
<script>
  import commonTable from '@/hxx-components/common-table.vue'
  import policyManageDetail from './policy-manage-detail.vue'
  import { getName, getDictGroup } from '@/libs/util.js'
  import mixin from '@/hxx-components/mixin'
  export default {
	name: "policy-manage",
    components: {commonTable, policyManageDetail,},
    mixins: [mixin],
    data(){
		  return{
            columns: [
                {title: '车牌', key: 'PLATE_NUM', sortable: true, minWidth: 120,
                    // render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.ORDER_TYPE))
                },
                {title: '客户', key: 'CUSTOMER_NAME', sortable: true, minWidth: 130},
                {title: '联系电话', key: 'MOBILE_PHONE', sortable: true, minWidth: 140},
                {title: '车船税', key: 'VEHICLE_TAX', sortable: true, minWidth: 120,align:'right',},
                {title: '总金额', key: 'SUM_MONEY', sortable: true, minWidth: 130,align:'right',
                    render: (h, params) => h('span', this.formatMoney(params.row.SUM_MONEY))
                },
                {title: '提成', key: 'DEDUCT_MONEY', sortable: true, minWidth: 130,align:'right',
                    // render: (h, params) => h('span', params.row.ORDER_DATE.substr(0, 10))
                },
                {title: '投保人', key: 'APPLICANT_PERSON', sortable: true, minWidth: 120},
                {title: '投保人电话', key: 'APPLICANT_TELPHONE', sortable: true, minWidth: 140,
                    // render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.REPAIR_TYPE))
                },
                {title: '状态', key: 'STATUS', sortable: true, minWidth: 110,
                    render: (h, params) => h('span', getName(this.searchSelectOption, params.row.STATUS))
                },

            ],
            tableData: [],
            searchSelectOption:[],
            searchSelectOption1:[],//重新赋值--
            search:{
                input: '',
                select: '',
            },
            page: 1,
            limit: 25,
            total: 0,
            showTable:false,
            showDetail: false,
            detailData: null,
            clearTableSelect: null,

            buttonStateArr:{
                edit:true,//编辑
                audit:true,//审核
                reAudit:true,//反审核
                ban:true,//作废
            },//按钮状态组数据
        }
    },
    mounted () {
      this.searchSelectOption= getDictGroup(this.$store.state.app.dict, '1046');
      this.getList()
      this.showTable= Math.random()
    },
    methods:{
        //获取列表值-------
	    getList(){
            this.axios.request({
            url: '/tenant/repair/tt_guarantee_slip/list',
            method: 'post',
            data: {
                KEYWORD: this.search.input,
                STATUS_eq: this.search.select||'',
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

            this.detailData= null

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
            if(row.STATUS=="10461002"){
                for(let key in this.buttonStateArr){
                    switch(key){
                        case 'ban':
                        case 'audit': this.buttonStateArr[key]= true; break
                        default : this.buttonStateArr[key]= false;
                    }
                }
            }else if(row.STATUS=="10461001"){
                for(let key in this.buttonStateArr){
                    switch(key){
                        case 'reAudit': this.buttonStateArr[key]= true; break
                        default : this.buttonStateArr[key]= false;
                    }
                }
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
            for(let key in this.buttonStateArr){
                this.buttonStateArr[key]= true;
            }
        },
        closeGetList(){
            this.getList();
        },
        //审核按钮---------
        auditButton(){
            this.$Modal.confirm({
                title:"系统提示!",
                content:"确定要审核吗？",
                onOk:this.auditFun,

            })
        },
        auditFun(){
            this.axios.request({
                url: '/tenant/repair/tt_guarantee_slip/check',
                method: 'post',
                data: {
                id: this.detailData.GUAR_ID,
                access_token: this.$store.state.user.token
                }
            }).then(res => {
                if (res.success === true) {
                    this.closeDetail();
                    this.closeGetList();
                }
            })
        },
        //作废按钮---------
        deleteDetailData(){
            this.$Modal.confirm({
                title:"系统提示!",
                content:"确定要作废吗？",
                onOk:this.del,

            })
        },
        del(){
            this.axios.request({
                url: '/tenant/repair/tt_guarantee_slip/cancel',
                method: 'post',
                data: {
                ids: this.detailData.GUAR_ID,
                access_token: this.$store.state.user.token
                }
            }).then(res => {
                if (res.success === true) {
                    this.closeDetail();
                    this.closeGetList();
                }
            })
        },
        //反审核------
        reAuditButton(){
            this.$Modal.confirm({
                    title:"系统提示!",
                    content:"确定要反审核吗？",
                    onOk:this.reAuditFun,
                })
        },
        reAuditFun(){
            this.axios.request({
                url: '/tenant/repair/tt_guarantee_slip/update_status',
                method: 'post',
                data: {
                id: this.detailData.GUAR_ID,
                status: 10461001,
                access_token: this.$store.state.user.token
                }
            }).then(res => {
                if (res.success === true) {
                    this.closeDetail();
                    this.closeGetList();
                }
            })
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
