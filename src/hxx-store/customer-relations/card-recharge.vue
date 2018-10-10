<template>
  <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage" :total="total"  :show="showTable" @changeSelect="changeSelect" @onRowClick="onRowClick" @onRowDblclick="dbclick">
    <div slot="search"  >
      <div class="search-block">
        <Input v-model="search.KEYWORD"  placeholder="会员卡号/客户名称/联系电话..."></Input>
      </div>
            <div class="search-block">
        <Input v-model="search.PLATE_NUM"  placeholder="车牌号码..."></Input>
      </div>
      <div class="search-block">
       <Select v-model="type">
       <Option v-for="(item, index) in typegroup"
       :key="index" :value="item.code">{{item.name}}</Option>
       </Select>
     </div>
      <ButtonGroup size="small">
        <Button type="primary" @click="page=1;getList()"><Icon type="ios-search" size="24"/></Button>
        <Button type="primary" @click="clear()"><Icon type="ios-undo" size="24"/></Button>
      </ButtonGroup>
    </div>
    <div slot="operate">
      <Button type="primary" @click="add()">新增</Button>
      <Button type="info" @click="edit()">编辑/查看</Button>
      <Button type="success" @click="check()">审核</Button>
      <Button type="warning" @click="rcheck()">反审核审核</Button>
      <Button type="success" @click="collection()">收款</Button>
      <Button type="warning" @click="rcollection()">反收款</Button>
      <Button type="error" @click="remove()">作废</Button>
      <Button type="primary">打印充值单</Button>
    </div>
        <Modal
    class="table-modal-detail"
    :transition-names="['', '']"
    v-model="showModal"
    :closable="false"
    width="90"
    :scrollable="true"
    :transfer= "false"
    :footer-hide="true"
  >
      <div class="operate">
      <Button type="primary" @click="showModal = false">返回</Button>
      <Button type="primary" @click="save('formData')" style="margin-left:10px;">保存</Button>
    </div>
    <div style="height:30px;"></div>
        <Form ref="formData" :model="formData" :label-width="120" :rules="ruleValidate"  inline>
        <FormItem label="客户名称:" style="width:45%;" prop="CUSTOMER_NAME" >
              <Input type="text" v-model="formData.CUSTOMER_NAME" :readonly="true" @on-click="selectCustomer" icon="ios-search" @on-focus="selectCustomer"  style="min-width: 100%;"> </Input>
          </FormItem>
          <FormItem label="会员卡号:" style="width:45%;" prop="MEMBER_CARD_NO">
              <Input type="text" v-model="formData.MEMBER_CARD_NO" :disabled="typeshow"  style="min-width: 100%;"> </Input>
          </FormItem>
            <FormItem label="储值卡产品:" style="width:45%;" prop="CARD_ID">
                <Select  placeholder="==请选择==" v-model="formData.CARD_ID" style="min-width: 100%;">
                <Option v-for="(item, index) in cardGroup"
                  :key="index" :value="item.CARD_ID">{{item.CARD_NAME}}</Option>
                </Select>
          </FormItem>
                <FormItem label="办理人:" style="width:45%;" prop="FOLLOW_PERSON">
                <Select  placeholder="==请选择==" v-model="formData.FOLLOW_PERSON" style="min-width: 100%;">
                <Option v-for="(item, index) in person"
                  :key="index" :value="item.USER_ID">{{item.USER_NAME}}</Option>
                </Select>
          </FormItem>
       </Form>
                  <Form ref="formInline" :label-width="120">
          <FormItem label="备注:">
              <Input type="textarea" v-model="formData.REMARK"  placeholder="请输入备注信息"> </Input>
          </FormItem>
       </Form>
  </Modal>
  <select-customer @select="select"  class="table-modal-detail" :showoff="showoff"></select-customer>
  </common-table>
</template>
<script>
    import commonTable from '@/hxx-components/common-table.vue'
    import { getName, getDictGroup, getCreate } from '@/libs/util.js'
    import selectCustomer from '@/hxx-components/select-customer.vue'
	export default{
	name:'card-recharge',
	components:{commonTable,selectCustomer},
	data(){
    return {
    	showModal:false,
      showoff:false,
    	tableData:[],
      list:[],//存选取对象
      ids:[],//存选取对象id
    	type:0,
      person:[],
      cardGroup:[],
      MEMBER_CARD_NO:'',
    	formData:{
        RECHARGE_ID:'',
    		CUSTOMER_NAME:'',
        CUSTOMER_ID:'',
    		REMARK:'',
        CARD_ID:'',
        MEMBER_CARD_NO:'',
        FOLLOW_PERSON:'',
    	},
    	typegroup:[],
      ruleValidate:{
           CUSTOMER_NAME:[{required: true, message: '请点击选取客户'}],
           MEMBER_CARD_NO:[{required: true, message: '请填写会员卡号'}],
           CARD_ID:[{required: true, message: '请选择储值卡产品'}],
           FOLLOW_PERSON:[{required: true, message: '请选取办理人'}]
        },
    	columns: [
          // {type: 'selection', width: 50, fixed: 'left'},
          {title: '序号',  minWidth: 80,
            render: (h, params) => h('span', (this.page-1)*this.limit+params.index+1 )
          },
           {title: '客户名称', key: 'CUSTOMER_NAME', sortable: true, minWidth: 150},
          {title: '会员卡号', key: 'MEMBER_CARD_NO', sortable: true, minWidth: 150},
          {title: '联系电话', key: 'MOBILE_PHONE', sortable: true, minWidth: 150},
          {title: '充值时间', key: 'RECHARGE_TIME', sortable: true, minWidth: 150,
           render: (h, params) => h('span', params.row.RECHARGE_TIME.substr(0, 10))
          },
          {title: '充值卡产品', key: 'CARD_NAME', sortable: true, minWidth: 150},
          {title: '售价', key: 'SALES_MONEY', sortable: true, minWidth: 150},
          {title: '赠送价值', key: 'DERATE_MONEY', sortable: true, minWidth: 150},
          {title: '总价值', key: 'SUM_MONEY', sortable: true, minWidth: 150},
          {title: '状态', key: 'STATUS', sortable: true, minWidth: 150,
           render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.STATUS))
          }
        ],
        page:1,
    	limit:25,
    	total:0,
    	showTable:false,
    	search:{
    		KEYWORD:'',
    		PLATE_NUM:'',
    	}
    }
	},
	methods:{
    select(row){
    this.MEMBER_CARD_NO = row.MEMBER_CARD_NO ? row.MEMBER_CARD_NO : '';
    // alert(this.MEMBER_CARD_NO);
    this.formData.MEMBER_CARD_NO = row.MEMBER_CARD_NO;
    this.formData.CUSTOMER_NAME = row.NAME;
    this.formData.CUSTOMER_ID = row.CUSTOMER_ID;
    },
    onSelect(){
      // alert(1);
    },
    save(name){
              this.$refs[name].validate((valid) => {
                    if (valid) {
                    this.$Modal.confirm({
                      title:'系统提示',
                      content:'确认保存吗?',
                      onOk:this.rechangePost,
                    });
                    } else {
                        this.$Message.error("请校对红框信息");
                    }
                })
    },
    rechangePost(){
      //充值卡数据提交tenant/customer/tt_member_recharge_record/save
      if(this.formData.CARD_ID == ''){
              this.axios.request({
          url: 'tenant/customer/tt_member_recharge_record/save',
          method: 'post',
          data: {access_token: this.$store.state.user.token,
                 data:JSON.stringify(this.formData),
                 member_CARD_NO
                }
        }).then(res => {
          if (res.success === true) {
             this.$Message.info('充值成功');
             this.getList();
             this.showModal = false;
          }
        })
      return;
      }
      this.axios.request({
          url: 'tenant/customer/tt_member_recharge_record/save',
          method: 'post',
          data: {access_token: this.$store.state.user.token,
                 data:JSON.stringify(this.formData)
                }
        }).then(res => {
          if (res.success === true) {
             this.$Message.info('充值成功');
             this.getList();
             this.showModal = false;
          }
        })
    },
    onRowClick(row){
    this.list = row;
    this.ids = [];
    this.ids.push(row.RECHARGE_ID);
    },
		changeSelect(row){
     // this.list = row;
     // this.ids = [];
     // for(var i in row){
     //  this.ids.push(row[i].RECHARGE_ID);
     // }
    },
		changePage(){},
		changePageSize(){},
		dbclick(){},
    selectCustomer(){
    this.showoff = Math.random();
    },
		add(){
      this.$refs['formData'].resetFields();
      this.cardGroup.push({CARD_NAME:'==请选择==',CARD_ID:0});
        this.axios.request({
          url: 'tenant/basedata/tt_member_card/get_all_list',
          method: 'post',
          data: {access_token: this.$store.state.user.token,
                 page:1,
                 limit:25
                }
        }).then(res => {
          if (res.success === true) {
           var data = res.data;
           for(var i in data){
            this.cardGroup.push(data[i]);
           }
          }
        })
    if(this.person.length === 0){
    var group = this.$store.state.app.tenant;
    this.person.push({USER_NAME:'请选择',USER_ID:0});
    for(var i in group){
      this.person.push(group[i]);
    }
    }
		this.showModal = true;
		},
		edit(){},
		remove(){
    if(this.ids.length === 0){
      this.$Message.info('未选取数据');
      return;
    }
    this.$Modal.confirm({
      title:'系统提示',
      content:'确认要作废吗?',
      onOk:this.del,
    });
    },
    del(){
    //删除数据tenant/customer/tt_member_recharge_record/cancel
    this.axios.request({
          url: 'tenant/customer/tt_member_recharge_record/cancel',
          method: 'post',
          data: {access_token: this.$store.state.user.token,
                 ids:this.ids.join(',')
                }
        }).then(res => {
          if (res.success === true) {
            this.ids = [];
            this.getList();
            this.$Message.success('作废成功');
          }
        })
    },
		clear(){
		this.search.PLATE_NUM = '';
		this.search.KEYWORD = '';
		this.type = 0;
		this.page = 1;
		},
		getList(){
		  this.axios.request({
          url: 'tenant/customer/tt_member_recharge_record/list',
          method: 'post',
          data: {access_token: this.$store.state.user.token,
                 KEYWORD:this.search.KEYWORD,
                 PLATE_NUM:this.search.PLATE_NUM,
                 page:this.page,
                 limit:this.limit,
                 STATUS_eq:this.type == 0 ? '' : this.type
                }
        }).then(res => {
          if (res.success === true){
          this.tableData = res.data;
          this.total = res.total;
          }
        })
		},
		check(){},
		rcheck(){},
		collection(){},
		rcollection(){},
	},
  computed:{
    typeshow(){
      if(this.formData.CUSTOMER_NAME == '' || this.MEMBER_CARD_NO != '') return true;
      if(this.MEMBER_CARD_NO == '') return false;
    }
  },
	mounted(){
	   this.showTable = Math.random();
	   var group = getDictGroup(this.$store.state.app.dict,'1047');
	   this.typegroup.push({name:'请选择...',code:0,order:0,group:'1047'});
	   for(var i in group){
	   	this.typegroup.push(group[i]);
	   }
	   this.getList();
	},
	}
</script>
<style lang="less" scoped>
  .operate{
    margin-top: 10px;
    padding: 15px;
    border: 1px solid #dcdee2;
    border-radius: 3px;
    width:100%;
  }
.search-block{
  display: inline-block;
  width: 200px;
  margin-right: 10px;
}
.ftext{
  text-align:left;
}
</style>
