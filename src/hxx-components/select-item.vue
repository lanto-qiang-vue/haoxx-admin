<template>
    <Modal  
    v-model="changeModal"
    class="table-modal-detail"
    title="维修项目选择"
    width="80"
    :mask-closable="false"
    :scrollable="true"
    :transfer= "true"
    :footer-hide="false"
    :transition-names="['', '']">
     <common-table v-model="tableData" :columns="columns2" @changePageSize="changePageSize" @changePage="changePage" :total="total"  :show="showTable"  :page="page" :showOperate="false">
      <div slot="search"  >
      <div class="search-block">
        <Input v-model="keyword"  placeholder="项目编号/名称..."></Input>
      </div>
      <ButtonGroup>
        <Button type="primary" @click="page=1;getList()">
          搜索
        </Button>
        <!--<Button type="primary" @click="clear()"><Icon type="ios-undo" size="24"/></Button>-->
      </ButtonGroup>
    </div>
     </common-table>
      <div slot="footer">
        <Button @click="changeModal=false">取消</Button>
        <Button @click="changeModal=false" type="primary">确定</Button>
      </div>
    </Modal>
</template>
<script>
	    import commonTable from '@/hxx-components/common-table.vue'
	    import { getName, getDictGroup, getCreate } from '@/libs/util.js'
	export default{
		name:'select-item',
		components:{commonTable},
		data(){
		return{
			         columns2: [
          {title: '序号',  width: 70,align:'center',
            render: (h, params) => h('span', (this.page-1)*this.limit+params.index+1 )
          },
           {title: '项目套餐编号', key: 'ITEM_NO', sortable: true, minWidth: 150},
           {title: '项目套餐名称', key: 'NAME', sortable: true, minWidth: 150},
           {title: '项目分类', key: 'TYPE_NAME', sortable: true, minWidth: 150},
           {title: '计费标准', key: 'CHARGE_TYPE', sortable: true, minWidth: 150,
            render: (h,params) => h('span',getName(this.counttype,params.row.CHARGE_TYPE))
           },
           {title: '标准金额(元)', key: 'REPAIR_MONEY', sortable: true, minWidth: 150,align:'right',
             render: (h,params) => h('span',this.formatMoney(params.row.REPAIR_MONEY))
           },
           {title: '标准工时(小时)', key: 'REPAIR_TIME', sortable: true, minWidth: 150,align:'right'},
           {title: '油漆面数(面)', key: 'PAINT_NUM', sortable: true, minWidth: 150,align:'right'},
           {title: '是否预设项目', key: 'IS_PREINSTALL', sortable: true, minWidth: 150,
           render: (h,params) => h('span',getName(this.isorno,params.row.IS_PREINSTALL))},
           {title: '状态', key: 'STATUS', sortable: true, minWidth: 80,
           	render: (h,params) => h('span',getName(this.statuslist,params.row.STATUS))
           },
           {title: '操作', key: 'operation', sortable: true, width: 100,fixed: 'right',align:'center',
                        render: (h, params) => {
                            let buttonContent= '请选择';
                            let buttonStatus= 'warning';
                            let dtype = this.check(params.row.ITEM_ID);
                            if(dtype) buttonStatus = "blue";
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: buttonStatus,
                                        size: 'small',
                                        disabled:dtype
                                    },
                                    style: {
                                        width:"80px",
                                        textAlign: "center",
                                    },
                                    on: {
                                        click: (index) => {
                                        	this.addList(this.tableData[params.index]);
                                         // console.log(this.itemList);
                                        }
                                    }
                                }, buttonContent),
                            ]);
                        }
                    }
        ],
        changeModal:false,
        page:1,
        limit:25,
        total:0,
        tableData:[],
        showTable:false,
        keyword:'',
        itemList:[],
		}
		},
		computed:{
		    isorno(){
			return getDictGroup(this.$store.state.app.dict,'1004');
			},
			statuslist(){
			return getDictGroup(this.$store.state.app.dict,'1001');
			},
		},
		methods:{
		addList(row){
		this.itemList.push(row);
		this.$emit('addpush',row);
		},
		check(id){
			// alert(id);
			for(var i =0;i<this.itemList.length;i++){
 			if(this.itemList[i].ITEM_ID == id) return true;
			}
			return false;
		},
		changePage(page){this.page = page;this.getList();},
		changePageSize(size){this.limit = size;this.getList();},
		clear(){this.keyword = '';},
		getList(){
			  this.axios.request({
                    url: '/tenant/basedata/repairiteminfo/infolist',
                    method: 'post',
                    data: {
                        KEYWORD: this.keyword,
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
		}
		},
		props:['itemShow','delrow','initData'],
		watch:{
	       itemShow(){
	       this.changeModal = true;
	       this.showTable = Math.random();
	       this.getList();
	       },
         delrow(row){
          var data = [];
          this.itemList.filter(function(item){
            if(row.ITEM_ID != item.ITEM_ID){
              data.push(item);
            }
          });
         this.itemList = data;
         },
         initData(row){
          if(row !=''){this.itemList = row;}else{this.itemList = [];}
         }
		}
	}
</script>
