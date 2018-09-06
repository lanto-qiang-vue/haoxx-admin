<template>
  <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage" :total="total"  :show="showTable" @onRowDblclick="dbclick" :page="page">
    <div slot="search"  >
      <div class="search-block">
        <Input v-model="search.keyword"  placeholder="客户名称/车牌号码/联系电话..."></Input>
      </div>
      <div class="search-block">
                <Select v-model="search.status">
                <Option v-for="(item, index) in statusarrList"
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
      <Button type="info" @click="edit()">修改</Button>
      <Button type="error" @click="remove()">作废</Button>
    </div>
        <Modal  
    v-model="showModal"
    class="table-modal-detail"
    title="维修项目套餐"
    width="90"
    :mask-closable="false"
    :scrollable="true"
    :transfer= "false"
    :footer-hide="false"
    :transition-names="['', '']">
        <Collapse v-model="value1">
        <Panel name="1">
                项目基本信息
                <Form slot="content" :model="formData"  ref="list" :label-width="120" class="common-form">
                <FormItem label="项目名称:" style="width:30%;" prop="NAME" >
                <Input type="text"> </Input>
                </FormItem>
                <FormItem label="项目编号:" style="width:30%;" prop="ITEM_NO">
                <Input type="text"> </Input>
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
                <Button type="error" @click="changedel()">删除</Button>
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
<!--       <div slot="footer">
      <Button @click="addcancle()">取消</Button>
      <Button type="primary" @click="addpost('list')">保存</Button>
      </div> -->
    </Modal>
    <select-item :itemShow="changeModal" :delrow="delrow" @addpush="addpush"></select-item>
  </common-table>
</template>
<script>
    import commonTable from '@/hxx-components/common-table.vue'
    import selectItem from '@/hxx-components/select-item.vue'
    import { getName, getDictGroup, getCreate } from '@/libs/util.js'
	export default{
		name:'service-combo',
		components:{commonTable,selectItem},
		data(){
		return{
		value1:'1',
		value2:'2',
		showModal:false,
		formData:{},
    selectData:[],
    delrow:{},
		tableData:[],
		changeModal:false,
           columns: [
          {title: '序号',  minWidth: 80,
            render: (h, params) => h('span', (this.page-1)*this.limit+params.index+1 )
          },
           {title: '项目套餐编号', key: 'GROUP_NO', sortable: true, minWidth: 140},
           {title: '项目套餐名称', key: 'GROUP_NAME', sortable: true, minWidth: 140},
           {title: '套餐销售价(元)', key: 'SALES_PRICE', sortable: true, minWidth: 150},
          {title: '是否预设项目', key: 'IS_PREINSTALL', sortable: true, minWidth: 140,
          render: (h, params) => h('span', getName(this.isorno, params.row.IS_PREINSTALL))
          },
          {title: '状态', key: 'STATUS', sortable: true, minWidth: 100,
          render: (h, params) => h('span', getName(this.statuslist, params.row.STATUS))
          },
          {title: '创建人', key: 'CREATER', sortable: true, minWidth: 100},
          {title: '创建时间', key: 'CREATE_TIME', sortable: true, minWidth: 100
          },
        ],
          columns1: [
          {title: '序号',  minWidth: 80,
            render: (h, params) => h('span', (this.page-1)*this.limit+params.index+1 )
          },
          {title: '项目套餐编号', key: 'ITEM_NO', sortable: true, minWidth: 150},
          {title: '项目套餐名称', key: 'NAME', sortable: true, minWidth: 150},
          {title: '项目分类', key: 'TYPE_NAME', sortable: true, minWidth: 150},
          {title: '计费标准', key: 'CHARGE_TYPE', sortable: true, minWidth: 150,
           render: (h,params)=> h('span',getName(this.counttype,params.row.CHARGE_TYPE))
          },
          {title: '标准金额(元)', key: 'REPAIR_MONEY', sortable: true, minWidth: 150},
          {title: '标准工时(小时)', key: 'REPAIR_TIME', sortable: true, minWidth: 150},
          {title: '油漆面数(面)', key: 'PAINT_NUM', sortable: true, minWidth: 150},
          {title: '是否预设项目', key: 'IS_PREINSTALL', sortable: true, minWidth: 150,
          render: (h,params)=>h('span',getName(this.isorno,params.row.IS_PREINSTALL))
          },
          {title: '状态', key: 'STATUS', sortable: true, minWidth: 150,
          render: (h,params)=>h('span',getName(this.statuslist,params.row.STATUS))
          },{title: '操作', key: 'operation', sortable: true, minWidth: 80,fixed: 'right',
                        render: (h, params) => {
                            let buttonContent= '删除';
                            let buttonStatus = 'error';
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: buttonStatus,
                                        size: 'small',
                                    },
                                    style: {
                                        width:"60px",
                                        textAlign: "center",
                                        marginRight: '10px',
                                    },
                                    on: {
                                        click: (index) => {
                                          // this.(this.tableData[params.index]);
                                          this.delrow = this.selectData[params.index];
                                         // console.log(this.itemList);
                                        }
                                    }
                                }, buttonContent),
                            ]);
                        }
                    }
        ],
			showTable:false,
			total:0,
			page:1,
			limit:25,
			search:{
				keyword:'',
				status:0,
			},
		}
		},
    watch:{
    delrow(row){
          var data = [];
          this.selectData.filter(function(item){
            if(row.ITEM_ID != item.ITEM_ID){
              data.push(item);
            }
          });
          this.selectData = data;
    }
    },
		methods:{
      changeadd(){
        this.changeModal = Math.random();
      },
			changedel(){},
			add(){
				this.showModal = true;
			},
			edit(){},
			remove(){},
			getList(){
	      this.axios.request({
          url: '/tenant/basedata/repairitemgroup/list',
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
          }
        })
			},
			clear(){
				this.search.keyword = '';
				this.search.status = 0;
			},
      addpush(row){
        this.selectData.push(row);
      },
			changePageSize(size){this.limit = size;},
			changePage(page){this.page = page;},
			dbclick(){},
		},
		mounted(){
			this.showTable = Math.random();
			this.getList();
		},
		computed:{
			counttype(){
			return getDictGroup(this.$store.state.app.dict,'1014');
			},
			isorno(){
			return getDictGroup(this.$store.state.app.dict,'1004');
			},
			statuslist(){
			return getDictGroup(this.$store.state.app.dict,'1001');
			},
			statusarrList(){
		    var arr = this.statuslist;
			var group = [];
			group.push({"name":'请选择...',"code":0});
			for(var i =0;i<arr.length;i++){
			group.push(arr[i]);
			}
			return group;
			}
		}

	}
</script>