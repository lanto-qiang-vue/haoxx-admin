<template>
  <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage" :total="total"  :show="showTable" clearSelect="clearType" @onRowClick="onRowClick" @onRowDblclick="dbclick" :page="page">
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
      <Button type="primary" @click="add()"  v-if="accessBtn('add')">新增</Button>
      <Button type="info" :disabled="cando" v-if="accessBtn('edit')" @click="edit()">修改</Button>
    </div>
        <Modal  
    v-model="showModal"
    class="table-modal-detail"
    title="维修项目套餐"
    width="98"
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
                <Option v-for="(item, index) in statuslist"
                :key="index" :value="item.code">{{item.name}}</Option>
                </Select>
                </FormItem>
                <FormItem label="是否预设项目:">
                <i-switch v-model="IS_PREINSTALL" size="large">
                <span slot="open">是</span>
                <span slot="close">否</span>
                </i-switch>
                </FormItem>
                </Form>
              </Panel>
              <Panel name="2">
              	套餐内维修项目信息
              	<div slot="content">
              	<div style="padding-bottom:10px;">
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
    <select-item :itemShow="changeModal" :initData="initData" :delrow="delrow" @addpush="addpush"></select-item>
  </common-table>
</template>
<script>
    import commonTable from '@/hxx-components/common-table.vue'
    import selectItem from '@/hxx-components/select-item.vue'
    import { getName, getDictGroup, getCreate } from '@/libs/util.js'
    import mixin from '@/hxx-components/mixin'
	  export default{
		name:'service-combo',
		components:{commonTable,selectItem},
    mixins: [mixin],
		data(){
		return{
		value1:[1,2,3],
    initData:'',
    IS_PREINSTALL:false,
    list:'',
		showModal:false,
    clearType:false,
		formData:{
    GROUP_ID:'',
    GROUP_NAME:'',
    SALES_PRICE:0,
    STATUS:'',
    IS_PREINSTALL:'',
    REMARK:'',
    },
    selectData:[],
    delrow:{},
		tableData:[],
    rules:{
      GROUP_NAME:[{required: true,message:'套餐名称必填'}],
      SALES_PRICE:[{required: true}],
    },
		changeModal:false,
           columns: [
          {title: '序号',  minWidth: 80,
            render: (h, params) => h('span', (this.page-1)*this.limit+params.index+1)
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
          {title: '创建人', key: 'CREATER', sortable: true, minWidth: 100,
          render: (h, params) => h('span',getCreate(this.$store.state.app.tenant,params.row.CREATER))
          },
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
          {title: '状态', key: 'STATUS', sortable: true, minWidth: 100,
          render: (h,params)=>h('span',getName(this.statuslist,params.row.STATUS))
          },{title: '操作', key: 'operation', sortable: true, minWidth: 120,fixed: 'right',
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
      visibleChange(){
        this.clearsection();
      },
      clearsection(){
        this.list = '';
        this.clearType = Math.random();
      },
      dbclick(row){
        this.update(row);
      },
      update(row){
       this.formData = row;
       this.IS_PREINSTALL = this.formData.IS_PREINSTALL == this.isorno[0].code ? true : false;
       this.showModal = true;
       //获取单挑项目 /tenant/basedata/repairitemgroup/detailList
       this.axios.request({
          url: '/tenant/basedata/repairitemgroup/detailList',
          method: 'post',
          data: {access_token: this.$store.state.user.token,
                 limit:25,
                 page:1,
                 groupId:this.formData.GROUP_ID,
                }
        }).then(res => {
          if (res.success === true) {
            this.selectData = res.data;
            this.initData = res.data;
          }
        })
      },
      onRowClick(row){
        this.list = row;
      },
      addpost(name){
      this.$refs[name].validate((valid) => {
      if(this.selectData.length < 1){this.$Message.info("请添加维修项目");return;};
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
        var items = [];
        for(var i in this.selectData){
          items.push({ITEM_ID:this.selectData[i].ITEM_ID});
        }
        if(this.IS_PREINSTALL){this.formData.IS_PREINSTALL = this.isorno[0].code;}else{this.formData.IS_PREINSTALL = this.isorno[1].code;}
       this.axios.request({
          url: '/tenant/basedata/repairitemgroup/save',
          method: 'post',
          data: {access_token: this.$store.state.user.token,
                 data:JSON.stringify(this.formData),
                 items:JSON.stringify(items),
                }
        }).then(res => {
          if (res.success === true) {
            if(this.formData.GROUP_ID == ''){
             this.$Message.success('新增成功');
            }else{
             this.$Message.success('修改成功');
            }
             this.getList();
             this.showModal = false;
          }
        })
      },
      addcancle(){
        this.showModal = false;
      },
      changeadd(){
        this.changeModal = Math.random();
      },
			changedel(){},
			add(){
        this.$refs['list'].resetFields();
        for(var i in this.formData){
          this.formData[i] = '';
        }
        this.selectData = [];
        this.IS_PREINSTALL = false;
        this.formData.SALES_PRICE = 0;
				this.showModal = true;
        this.initData = '';
        //默认有效
        this.formData.STATUS = this.statuslist[0].code;
			},
			edit(){
        this.update(this.list);
      },
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
            this.clearsection();
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
