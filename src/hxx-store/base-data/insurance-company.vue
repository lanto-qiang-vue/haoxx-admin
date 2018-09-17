<template>
  <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage" :total="total"  :show="showTable" :page="page">
    <div slot="search"  >
      <div class="search-block">
        <Input v-model="search.keyword"  placeholder="公司编号/公司名称..."></Input>
      </div>
      <ButtonGroup size="small">
        <Button type="primary" @click="page=1;getList()"><Icon type="ios-search" size="24"/></Button>
        <Button type="primary" @click="clear()"><Icon type="ios-undo" size="24"/></Button>
      </ButtonGroup>
    </div>
   </common-table>
</template>
<script>
import commonTable from '@/hxx-components/common-table.vue'
import { getName, getDictGroup, getCreate } from '@/libs/util.js'
	export default{
		name:'insurance-comp',
		components:{commonTable},
		data(){
			return {
		    value1:'1',
		    value3:'3',
			page:1,
			limit:25,
			showModal:false,
			total:0,
			tableData:[],
			clearType:false,
			showTable:false,
			formData:{
			NAME:'',
			ADDRESS:'',
			IS_DEFAULT:false,
			REMARK:'',
			},
			list:'',
			rules:{
				NAME:[{required:true,message:'名称必填'}]
			},
			columns:[
			{title: '仓库编号', key: 'STORE_NO', sortable: true, minWidth: 140},
			{title: '仓库名称', key: 'NAME', sortable: true, minWidth: 140},
			{title: '所在地', key: 'ADDRESS', sortable: true, minWidth: 140},
			{title: '是否默认仓库', key: 'IS_DEFAULT', sortable: true, minWidth: 140,
			  render: (h,params)=> h('span',getName(this.defaultList,params.row.IS_DEFAULT))
		    },
			],
			search:{
				keyword:'',
			},
		    }
		},
		methods:{
		 add(){
		 	for(var i in this.formData){
		 		this.formData[i] = '';
		 	}
		 	this.$refs['list'].resetFields();
		 	this.IS_DEFAULT = false;
		 	this.showModal = true;
		 },
		 remove(){
		 	this.$Modal.confirm({title:'系统提示',content:'确认要作废吗?',onOk:this.del});
		 },
		 del(){
		 	// /tenant/basedata/ttstorehouse/cancel
		 			this.axios.request({
          url: '/tenant/basedata/ttstorehouse/cancel',
          method: 'post',
          data: {access_token: this.$store.state.user.token,
          		 ids:this.list.STORE_ID,
                }
        }).then(res => {
          if (res.success === true) {
          	this.getList();
          }
        })
		 },
		 edit(){
		 	this.update(this.list);
		 },
	     visibleChange(){
	     	this.clearsection();
	     },
		 addcancle(){},
		 addpost(name){
		this.$refs[name].validate((valid) => {
                    if (valid) {
                    this.$Modal.confirm({
                      title:'系统提示',
                      content:'确认保存吗?',
                       onOk:this.tosave,
                    });
                    } else {
                        this.$Message.error("请校对红框信息");
                    }
                })
		 },
		 tosave(){
		 	///tenant/basedata/ttstorehouse/save
		this.formData.IS_DEFAULT = this.IS_DEFAULT === true ? this.defaultList[0].code : this.defaultList[1].code; 
        this.axios.request({
          url: '/tenant/basedata/ttstorehouse/save',
          method: 'post',
          data: {access_token: this.$store.state.user.token,
                 data:JSON.stringify(this.formData),
                }
        }).then(res => {
          if (res.success === true) {
          	this.showModal = false;
          	this.getList();
          }
        })
		 },
		 changePage(page){
		 	this.page = page;
		 	this.getList();
		 },
		 changePageSize(size){
		 	this.limit = size;
		 	this.getList();
		 },
		 getList(){
		 	///tenant/basedata/ttstorehouse/list
		this.axios.request({
          url: '/tenant/basedata/ttstorehouse/list',
          method: 'post',
          data: {access_token: this.$store.state.user.token,
                 limit:25,
                 page:1,
                 KEYWORD:this.search.keyword,
                }
        }).then(res => {
          if (res.success === true) {
          	this.tableData = res.data;
          	this.total = res.total;
          }
        })
		 	this.clearsection();
		 },
		 onRowClick(row){
		 	this.list = row;
		 },
		 dbclick(row){
		 	this.update(row);
		 },
		 update(row){
		 this.formData = row;
		 this.IS_DEFAULT = row.IS_DEFAULT == this.defaultList[0].code ? true : false;
		 this.showModal = true;
		 },
		 clear(){
		 	this.search.keyword = '';
		 },
		 clearsection(){
		 	this.list = '';
		 	this.clearType = Math.random();
		 }
		},
		mounted(){
			this.showTable = Math.random();
			this.getList();
		},
		computed:{
			cando(){
				var flag = this.list == '' ? true : false;
				return flag;
			},
			defaultList(){
				return getDictGroup(this.$store.state.app.dict,'1004');
			}
		}

	}
</script>