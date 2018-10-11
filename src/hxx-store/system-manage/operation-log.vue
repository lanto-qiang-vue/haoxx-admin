<template>
  <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage" :total="total"  :show="showTable" :page="page">
    <div slot="search"  >
      <div class="search-block">
        <Input v-model="search.keyword"  placeholder="业务名称/操作名称..."></Input>
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
import { formatDate } from '@/libs/tools.js'
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
				{title: '业务名称', key: 'LOG_TYPE', sortable: true, minWidth: 140},
				{title: '操作名称', key: 'LOG_OPE_TYPE', sortable: true, minWidth: 120},
				{title: '内容', key: 'LOG_CONTENT', sortable: true, minWidth: 300},
				{title: '操作人', key: 'CREATE', sortable: true, minWidth: 100,
				  render: (h,params)=> h('span',getCreate(this.$store.state.app.tenant,params.row.CREATE))
			    },
                {title: '操作时间', key: 'CREATE_TIME', sortable: true, minWidth: 120},
				],
				search:{
					keyword:'',
					start:'',
					end:'',
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
				var start = this.search.start ? formatDate(this.search.start) : '';
				var end = this.search.end ? formatDate(this.search.end) : '';
				this.axios.request({
				  url: '/tenant/sys/ttsyslog/list',
				  method: 'post',
				  data: {access_token: this.$store.state.user.token,
				         limit:25,
				         page:this.page,
				         KEYWORD:this.search.keyword,
				         CREATE_TIME_gte:start,
				         CREATE_TIME_lte:end,
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
				this.search.start = '';
				this.search.end = '';
			},
		},
		mounted(){
			this.showTable = Math.random();
			this.getList();
		}

	}
</script>
