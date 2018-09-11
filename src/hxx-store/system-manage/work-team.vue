<template>
    <Split v-model="split" :min="0.1" :max="0.5" class="split">
    <div slot="left" class="split-pane">
      <Button type="primary" style="margin-left:5px;">添加车间</Button>
      <Button type="primary" style="margin-left:5px;">添加班组</Button>
      <Button type="info" style="margin-left:5px;">修改</Button>
      <div style="width:100%;line-height:30px;border-top:1px solid black;border-bottom:1px solid black;text-align: center;">车间名称</div>
    <Tree :data="data2" @on-select-change="getnode"></Tree>
    </div>
    <div slot="right" style="height:100%;">
       <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" :showSearch="false" @changePage="changePage" :total="total"  :show="showTable" :page="page">
    <div slot="operate">
      <Button type="primary" @click="setMember">设置班组成员</Button>
    </div>
</common-table>
    </div>
</Split>
</template>
<script>
	import commonTable from '@/hxx-components/common-table.vue'
	export default{
		name:'work-team',
		components:{commonTable},
		data(){
		 return {
		  split:0.2,
		  data2:[],
		  showTable:false,
		  page:1,
		  total:0,
		  tableData:[],
		  limit:25,
		  columns:[
		  {title: '员工姓名', key: 'USER_NAME', sortable: true, minWidth: 140},
		  {title: '职务', key: 'GROUP_NO', sortable: true, minWidth: 140},
		  {title: '员工电话', key: 'TEL_PHONE', sortable: true, minWidth: 140},
		  ],
		 }
		},
		methods:{
			setMember(){},
			changePage(page){
				this.page = page;
				this.getList();
			},
			changePageSize(size){
				this.limit = size;
				this.getList();
			},
			getList(id){
			///tenant/basedata/ttworkshop/worker_list CLASS_ID_eq
		  this.axios.request({
          url: '/tenant/basedata/ttworkshop/worker_list',
          method: 'post',
          data: {access_token: this.$store.state.user.token,
                 CLASS_ID_eq:id,
                 limit:this.limit,
                 page:this.page,
                }
        }).then(res => {
          if (res.success === true) {
            this.tableData= res.data
            this.total= res.total
          }
        })
			},
			getnode(row){
			var nodeId = row[0].nodeId;
			var type = row[0].type ? row[0].type : 0;
			if(nodeId > 0 && type == 2){
			 this.getList(nodeId);
			}
			},
			machine(data){
           data['title'] = data.nodeName;
           var flag = data.children ? true : false;
           if(flag){
            for(var i=0;i<data.children.length;i++){
              this.machine(data.children[i]);
            }
           }else{

           }
           return data;
          },
			getwork(){
				///tenant/basedata/ttworkshop/get_work_shop_list
		  this.axios.request({
          url: '/tenant/basedata/ttworkshop/get_work_shop_list',
          method: 'post',
          data: {access_token: this.$store.state.user.token}
        }).then(res => {
          if (res.success === true) {
           this.data2 = [];
           var data = this.machine(res.data);
           data['expand'] = true;
           this.data2.push(data);
          }
        })

			},
		},
		mounted(){
			this.showTable = Math.random();
			this.getwork();
		}
	}
</script>