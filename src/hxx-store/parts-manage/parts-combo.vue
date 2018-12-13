<template>
 <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage" :total="total"  :show="showTable" :clearSelect="cleartype" @onRowClick="rowclick"  @onRowDblclick="dbclick">
    <div slot="search"  >
      <div class="search-block">
        <Input v-model="search.keyword"  placeholder="配件套餐编号/名称..."></Input>
      </div>
      <div class="search-block">
                <Select v-model="search.status" clearable>
                <Option v-for="(item, index) in statusList"
                  :key="index" :value="item.code">{{item.name}}</Option>
              </Select>
     </div>
      <ButtonGroup>
        <Button type="primary" @click="page=1;getList()">搜索</Button>
        <!--<Button type="primary" @click="clear()"><Icon type="ios-undo" size="24"/></Button>-->
      </ButtonGroup>
    </div>
    <div slot="operate">
      <Button type="success" @click="add()" v-if="accessBtn('add')">新增</Button>
      <Button type="error" :disabled="cando" @click="confirm()" v-if="accessBtn('cancel')">作废</Button>
      <Button type="info" :disabled="cando" @click="edit()" v-if="accessBtn('edit')">编辑/查看</Button>
    </div>
    <!-- 配件套餐新增 -->
            <Modal
    v-model="showModal"
    class="table-modal-detail full-height"
    title="配件套餐"
    width="100"
    :mask-closable="false"
    @on-visible-change="visibleChange"
    :scrollable="true"
    :transfer= "false"
    :footer-hide="false"
    :transition-names="['', '']">
              <modal-title slot="header" title="配件套餐" :state="''" @clickBack="showModal=false"></modal-title>
              <!--<div style="height:100%;padding-top:10px;padding-bottom:30px;">-->
              <div>
        <Collapse v-model="value1">
        <Panel name="1">
                配件套餐基本信息
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
                  <FormItem label="备注描述:" style="width:100%;">
                    <Input type="textarea" v-model="formData.GROUP_INFO" :rows="1" placeholder="请输入备注信息..."> </Input>
                  </FormItem>
                </Form>
              </Panel>
              <Panel name="2">
              	套餐内配件信息
              	<div slot="content">
              	<div style="padding-bottom: 10px;">
              	<Button type="success" @click="changeadd()">新增</Button>
              	</div>
                    <Table
                    class="main-table"
                    ref="tablesMain"
                    :columns="columns1"
                    :data="initParts"
                    stripe
                    border></Table>
                </div>
              </Panel>
              <!--<Panel name="3">-->
                <!--备注描述:-->
                <!--<div slot="content">-->
                <!--<Form slot="content"  ref="lists" class="common-form">-->
                <!--<Input type="textarea" v-model="formData.GROUP_INFO" placeholder="请输入备注信息..."> </Input>-->
                <!--</Form>-->
                <!--</div>-->
              <!--</Panel>-->
              </Collapse>
              </div>
      <div slot="footer">
      <Button @click="addcancle()">取消</Button>
      <Button type="primary" @click="addpost('list')">保存</Button>
      </div>
    </Modal>
    <select-parts-group @selectPartsGroup="getParts" :initPartsGroup="initParts" :showSelectPartsGroup="selectShow"></select-parts-group>
  </common-table>
</template>
<script>
	import commonTable from '@/hxx-components/common-table.vue'
	import { getName, getDictGroup, getCreate } from '@/libs/util.js'
  import selectPartsGroup from '@/hxx-components/select-partsGroup.vue'
  import ModalTitle from '@/hxx-components/modal-title.vue'
  import mixin from '@/hxx-components/mixin'
  import {deepClone} from "../../libs/util";
	export default{
		'name':'parts-combo',
		components:{commonTable,selectPartsGroup,ModalTitle},
    mixins: [mixin],
		 data(){
		 	return {
		 		list:'',
		 		page:1,
        initParts:[],
		 		limit:25,
		 		total:0,
		 		tableData:[],
		 		showModal:false,
		 		selectData:[],
        selectShow:false,
		 		cleartype:false,
		 		showTable:false,
		 		rules:{
          GROUP_NAME:[{required:true,message:'名称必填'}],
          SALES_PRICE:[{required:true}],
        },
		 		value1:[1,2,3],
		 		value2:'2',
		 		value3:'3',
        formData:{},
		 		storeData:{
          GROUP_NAME:'',
          SALES_PRICE:0,
          STATUS:'',
          GROUP_INFO:'',
        },
		  columns: [
          {title: '配件套餐编号', key: 'GROUP_NO', sortable: true, minWidth: 120},
          {title: '配件套餐名称', key: 'GROUP_NAME', sortable: true, minWidth: 120},
          {title: '套餐销售价元(元)', key: 'SALES_PRICE', sortable: true, minWidth: 170,align:'right',
            render: (h, params) => h('span', this.formatMoney(params.row.SALES_PRICE))
          },
          {title: '状态', key: 'STATUS', sortable: true, minWidth: 150,align:'center',
          render: (h,params) => h('span',getName(this.statusList,params.row.STATUS))
          },
          {title: '创建人', key: 'CREATER', sortable: true, minWidth: 100,
           render: (h, params) => h('span', getCreate(this.$store.state.app.tenant, params.row.CREATER))
          },
          {title: '创建时间', key: 'CREATE_TIME', sortable: true, minWidth: 120
          },
          ],
          columns1: [
          {title: '配件编号', key: 'PART_NO', sortable: true, minWidth: 120},
          {title: '配件名称', key: 'NAME', sortable: true, minWidth: 120},
          {title: '配件数量', key: 'PART_NUM', sortable: true, minWidth: 120,align:'right',
                   render: (h, params) => {
                    return h('div', [
                            h('InputNumber', {
                                props: {
                                    value:params.row.PART_NUM,
                                    min:1,
                                },
                                on: {
                                    "on-change":(e)=>{
                                     this.initParts[params.index]['PART_NUM'] = e;
                                    },

                                }
                            },
                            )
                        ]);

                    }
          },
          {title: '配件分类', key: 'TYPE_NAME', sortable: true, minWidth: 120},
          {title: '品牌', key: 'BRAND', sortable: true, minWidth: 120,
            render:(h,params) => h('span',getName(this.brandList,params.row.BRAND))
          },
          {title: '规格', key: 'FORMAT', sortable: true, minWidth: 120},
          {title: '包装', key: 'UNIT', sortable: true, minWidth: 120,
            render: (h,params) => h('span',getName(this.unitList,params.row.UNIT))
          },
          {title: '销售价(元)', key: 'SALES_PRICE', sortable: true, minWidth: 140,align:'right',
            render: (h,params) => h('span',this.formatMoney(params.row.SALES_PRICE))
          },
          {title: '原厂编号', key: 'FACTORY_NO', sortable: true, minWidth: 120},
          {title: '操作', sortable: true, minWidth: 120,fixed: 'right',align:'center',
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
                                        this.removeParts(params.index);
                                        }
                                    }
                                }, buttonContent),
                            ]);
                        }
                    }
          ],
		 		search:{
		 			keyword:'',
		 			status:0,
		 		},
		 	}
		 },
		 methods:{
      confirm(){
        this.$Modal.confirm({
          title:'系统提示',
          content:'确认要删除吗?',
          onOk:this.del,
        });
      },
      del(){
        // /tenant/basedata/partgroup/delete
        this.axios.request({
          url: '/tenant/basedata/partgroup/delete',
          method: 'post',
          data: {access_token: this.$store.state.user.token,
                 ids:this.list.GROUP_ID
                }
        }).then(res => {
          if (res.success === true) {
            this.getList();
          }
        })
      },
      getParts(row){
       this.initParts = row;
      },
		 	add(){
        this.formData = deepClone(this.storeData);
        this.$refs['list'].resetFields();
        this.formData.STATUS = this.statusList[0].code;
        this.initParts = [];
		 		this.showModal = true;
		 	},
		 	clear(){
		 	this.search.keyword = '';
		 	this.search.status = 0;
		 	},
		 	edit(){
       this.update(this.list);
      },
		 	changePage(page){
		 		this.page = page;
		 		this.getList();
		 	},
		 	changePageSize(size){
		 		this.limit = size;
		 		this.getList();
		 	},
      removeParts(index){
        console.log(this.initParts);
        this.initParts.splice(index,1);
      },
		 	getList(){
		 		//获取数据.... /tenant/basedata/partgroup/list
		 		        this.axios.request({
          url: '/tenant/basedata/partgroup/list',
          method: 'post',
          data: {access_token: this.$store.state.user.token,
                 KEYWORD:this.search.keyword,
                 STATUS_eq:this.search.status || '',
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
      this.$refs['list'].resetFields();
      this.formData = row;
      // /tenant/basedata/partgroup/detailList
      //groupId
        this.axios.request({
          url: '/tenant/basedata/partgroup/detailList',
          method: 'post',
          data: {access_token: this.$store.state.user.token,
                 limit:this.limit,
                 page:this.page,
                 groupId:row.GROUP_ID,
                }
        }).then(res => {
          if (res.success === true) {
            this.initParts = res.data;
          }
        })
      this.showModal = true;
		 	},
		 	clearsection(){
		 		this.list = '';
		 		this.cleartype = Math.random();
		 	},
		 	addpost(name){
        if(this.initParts.length == 0){
          this.$Modal.info({
            title:'系统提示',
            content:'请选择至少一条配件信息',
          });
          return;
        }
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
        ///tenant/basedata/partgroup/save
        var items = [];
      for(var i in this.initParts){
        items.push({PART_ID:this.initParts[i].PART_ID,PART_NUM:this.initParts[i].PART_NUM || 1});
      }
    this.axios.request({
          url: '/tenant/basedata/partgroup/save',
          method: 'post',
          data: {access_token: this.$store.state.user.token,
                 data:JSON.stringify(this.formData),
                 items:JSON.stringify(items),
                }
        }).then(res => {
          if (res.success === true) {
            this.showModal = false;
            this.getList();
          }
        })
      },
		 	addcancle(){
        this.showModal = false;
      },
		 	changeadd(){
        this.selectShow = Math.random();
      },
		 },
		 computed:{
		  cando(){
		  	var flag = this.list == '' ? true : false;
		  	return flag;
		  },
		  statusList(){
		  return getDictGroup(this.$store.state.app.dict,'1001');
		  },
       unitList(){
		    return getDictGroup(this.$store.state.app.dict,'1015');
       },
       brandList(){
		    return getDictGroup(this.$store.state.app.dict,'1016');
       }
		 },
		 mounted(){
		 	this.getList();
		 	this.showTable = Math.random();
		 }
	}
</script>
