<template>
	    <Modal 
    v-model="showModal"
    title="维修项目套餐详情"
    width="80"
    :scrollable="true"
    :mask-closable="false"
    :transfer= "false"
    :footer-hide="true"
    :transition-names="['', '']"
    >
            <Table
          class="main-table"
          ref="tablesMain"
          :columns="columns10"
          :data="tcinfo"
          stripe
          border
        ></Table>
    </Modal>
</template>
<script>
	export default{
		name:'combo-detail',
		data(){
			return{
				showModal:false,
                tcinfo:[],
                showModal:false,
                // tshow:false,
                // tcid:'',
                columns10: [
                {title: '序号',  minWidth: 80,type:'index'},
                {title: '维修项目编号', key: 'ITEM_NO', sortable: true, minWidth: 150},
                {title: '维修项目名称', key: 'NAME', sortable: true, minWidth: 150},
                {title: '项目分类', key: 'TYPE_NAME', sortable: true, minWidth: 150},
                {title: '计费标准', key: 'CODE_DESC', sortable: true, minWidth: 150},
                {title: '标准金额(元)', key: 'REPAIR_MONEY', sortable: true, minWidth: 150},
                {title: '标准工时(小时)', key: 'REPAIR_TIME', sortable: true, minWidth: 150},
                {title: '油漆面数(面)', key: 'PAINT_NUM', sortable: true, minWidth: 150},
         ],
			}
		},
    props:['tshow','tid'],
		watch:{
			tshow(){
        this.getList(this.tid);
				this.showModal = true;
			}
		},
		methods:{
			getList(id){
        this.axios.request({
          url: '/tenant/repair/ttrepairworkorder/getGroupItem',
          method: 'post',
          data: {access_token: this.$store.state.user.token,
                 GROUP_ID:id,
                 page:1,
                 limit:25,
                }
        }).then(res => {
          if (res.success === true) {
          this.tcinfo = res.data;
          }});
			}
		},
	}
</script>