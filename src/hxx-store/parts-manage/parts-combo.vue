<template>
 <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage" :total="total"  :show="showTable" :clearSelect="cleartype" @onRowClick="rowclick"  @onRowDblclick="dbclick">
    <div slot="search"  >
      <div class="search-block">
        <Input v-model="search.keyword"  placeholder="配件套餐编号/名称..."></Input>
      </div>
      <div class="search-block">
                <Select v-model="search.status">
                <Option v-for="(item, index) in statusList"
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
      <Button type="info" :disabled="cando" @click="edit()">编辑/查看</Button>
      <Button type="error" :disabled="cando" @click="remove()">作废</Button>
    </div>
    <!-- 配件套餐新增 -->
            <Modal  
    v-model="showModal"
    class="table-modal-detail"
    title="维修项目套餐"
    width="90"
    :mask-closable="false"
    @on-visible-change="visibleChange"
    :scrollable="true"
    :transfer= "false"
    :footer-hide="false"
    :transition-names="['', '']">
        <Collapse v-model="value1">
        <Panel name="1">
                项目基本信息
                <Form slot="content" :model="formData"  ref="list" :rules="rules" :label-width="120" class="common-form">
                <FormItem label="套餐名称:" style="width:30%;" prop="GROUP_NAME" >
                <Input v-model="formData.GROUP_NAME" type="text"> </Input>
                </FormItem>
                <FormItem label="套餐销售价:" style="width:30%;" prop="SALES_PRICE">
                 <InputNumber
                 style="width:100%;height:33px;"
                 :min="0"
                 v-model="formData.SALES_PRICE"
                 :formatter="value => `${value}元`"
                 :parser="value => value.replace('元', '')"></InputNumber>
                </FormItem>
                <FormItem label="状态:" style="width:30%;" prop="STATUS">
                <Select v-model="formData.STATUS">
                <Option v-for="(item, index) in statusList"
                :key="index" :value="item.code">{{item.name}}</Option>
                </Select>
                </FormItem>
                </Form>
              </Panel>
              </Collapse>
              <Collapse v-model="value2">
              <Panel name="2">
              	套餐内维修项目信息
              	<div slot="content">
              	<div>
              	<Button type="primary" @click="changeadd()">添加</Button>
              	</div>
                    <Table
                    class="main-table"
                    ref="tablesMain"
                    :columns="columns1"
                    :data="selectData"
                    stripe
                    border></Table>
                </div>
              </Panel>
              </Collapse>
              <Collapse v-model="value3">
              <Panel name="3">
                备注描述:
                <div slot="content">
                <Form slot="content"  ref="lists" class="common-form">
                <Input type="textarea" v-model="formData.REMARK" placeholder="请输入备注信息..."> </Input>
                </Form>
                </div>
              </Panel>
              </Collapse>
              <div style="height:50px;"></div>
      <div slot="footer">
      <Button @click="addcancle()">取消</Button>
      <Button type="primary" @click="addpost('list')">保存</Button>
      </div>
    </Modal>
    <!--  -->
  </common-table>
</template>
<script>
	import commonTable from '@/hxx-components/common-table.vue'
	import { getName, getDictGroup, getCreate } from '@/libs/util.js'
	export default{
		'name':'parts-combo',
		components:{commonTable},
		 data(){
		 	return {
		 		list:'',
		 		page:1,
		 		limit:25,
		 		total:0,
		 		tableData:[],
		 		showModal:false,
		 		selectData:[],
		 		columns1:[],
		 		cleartype:false,
		 		showTable:false,
		 		rules:{},
		 		value1:'1',
		 		value2:'2',
		 		value3:'3',
		 		formData:{},
		  columns: [
          {title: '配件套餐编号', key: 'GROUP_NO', sortable: true, minWidth: 120},
          {title: '配件套餐名称', key: 'GROUP_NAME', sortable: true, minWidth: 120},
          {title: '套餐销售价元(元)', key: 'SALES_PRICE', sortable: true, minWidth: 170},
          {title: '状态', key: 'STATUS', sortable: true, minWidth: 150,
          render: (h,params) => h('span',getName(this.statusList,params.row.STATUS))
          },
          {title: '创建人', key: 'CREATER', sortable: true, minWidth: 100,
           render: (h, params) => h('span', getCreate(this.$store.state.app.tenant, params.row.CREATER))
          },
          {title: '创建时间', key: 'CREATE_TIME', sortable: true, minWidth: 120
          },
          ],
		 		search:{
		 			keyword:'',
		 			status:0,
		 		},
		 	}
		 },
		 methods:{
		 	add(){
		 		this.showModal = true;
		 	},
		 	remove(){},
		 	clear(){
		 	this.search.keyword = '';
		 	this.search.status = 0;
		 	},
		 	edit(){},
		 	changePage(page){
		 		this.page = page;
		 		this.getList();
		 	},
		 	changePageSize(size){
		 		this.limit = size;
		 		this.getList();
		 	},
		 	getList(){
		 		//获取数据.... /tenant/basedata/partgroup/list
		 		        this.axios.request({
          url: '/tenant/basedata/partgroup/list',
          method: 'post',
          data: {access_token: this.$store.state.user.token,
                 KEYWORD:this.search.keyword,
                 STATUS_eq:this.search.status == 0 ? '' : this.search.status,
                 limit:this.limit,
                 page:this.page,
                }
        }).then(res => {
          if (res.success === true) {
            this.tableData= res.data
            this.total= res.total
            this.clearsection();
          }
        })
		 	},
		 	visibleChange(){
		 	this.clearsection();
		 	},
		 	rowclick(row){
		 		this.list = row;
		 	},
		 	dbclick(row){
		 	   this.update(row);
		 	},
		 	update(row){

		 	},
		 	clearsection(){
		 		this.list = '';
		 		this.cleartype = Math.random();
		 	},
		 	addpost(){},
		 	addcancle(){},
		 	changeadd(){},
		 },
		 computed:{
		  cando(){
		  	var flag = this.list == '' ? true : false;
		  	return flag;
		  },
		  statusList(){
		  var group = getDictGroup(this.$store.state.app.dict,'1001');
		  var data = [];
		  data.push({name:'请选择状态',code:0});
		  for(var i in group){
		  	data.push(group[i]);
		  }
		  return data;
		  }
		 },
		 mounted(){
		 	this.getList();
		 	this.showTable = Math.random();
		 }
	}
</script>