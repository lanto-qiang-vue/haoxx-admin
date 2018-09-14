<template>
  <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage" :total="total"  :show="showTable" :page="page">
    <div slot="search"  >
      <div class="search-block">
        <Input v-model="search.keyword"  placeholder="仓库编号/名称..."></Input>
      </div>
      <div class="search-block"style="width:250px;">
        <DatePicker v-model="search.start" format="yyyy-MM-dd" type="date" placeholder="开始时间" style="width: 120px;"></DatePicker>
        <DatePicker v-model="search.end" format="yyyy-MM-dd" type="date" placeholder="结束时间" style="width: 120px;margin-left: 5px;"></DatePicker>
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
		name:'operation-log',
		components:{commonTable},
		data(){
			return {
				page:1,
				limit:25,
				total:0,
				showTable:false,
				tableData:[],
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
		consputed:{
			defaultList(){
				return []
			}
		},
		methods:{
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
			},
			clear(){
				this.search.keyword = '';
			},
		},
		mounted(){
			this.showTable = Math.random();
			this.getList();
		}

	}
</script>