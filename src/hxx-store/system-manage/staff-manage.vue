<template>
  <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage" :total="total"  :show="showTable" :clearSelect="clearType" @onRowClick="onRowClick" @onRowDblclick="dbclick" :page="page">
    <div slot="search"  >
      <div class="search-block">
        <Input v-model="search.keyword"  placeholder="员工账号/员工姓名/手机号码..."></Input>
      </div>
      <div class="search-block">
      <Select  placeholder="" v-model="search.status" style="min-width: 100%;">
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
      <Button type="info" :disabled="cando" @click="edit()">修改</Button>
      <Button type="error" :disabled="cando" @click="remove()">作废</Button>
      <Button type="success" :disabled="cando" @click="reset()">重置密码</Button>
    </div>
            <Modal  
    v-model="showModal"
    class="table-modal-detail"
    title="用户信息"
    width="90"
    :mask-closable="false"
    @on-visible-change="visibleChange"
    :scrollable="true"
    :transfer= "false"
    :footer-hide="false"
    :transition-names="['', '']">
       <Split v-model="split" :min="0.3" :max="0.7" class="split">
    <div slot="left" class="split-pane" style="overflow: auto;height:100%;">
     <Form slot="content" :model="formData"  ref="list" :rules="rules" :label-width="80" class="common-form">
                <FormItem label="员工账号:" style="width:90%;" prop="USER_CODE" >
                <Input v-model="formData.USER_CODE" type="text"> </Input>
                </FormItem>
                <FormItem label="员工姓名:" style="width:90%;" prop="USER_NAME" >
                <Input v-model="formData.USER_NAME" type="text"> </Input>
                </FormItem>
                <FormItem label="登录密码:" style="width:90%;">
                <Input v-model="formData.PWD" type="text"> </Input>
                </FormItem>                
                <FormItem label="职务:" style="width:90%;" >
    <!--             <Select v-model="formData.PROFESSION" placeholder="选择状态...">
          		<Option v-for="(item, index) in searchSelectOption1"
                  :key="index" :value="item.code">{{item.name}}</Option>
        		</Select> -->
                </FormItem>
                <FormItem label="性别:" style="width:90%;" prop="GROUP_NAME" >
                <Input v-model="formData.GROUP_NAME" type="text"> </Input>
                </FormItem>
                <FormItem label="电子邮箱:" style="width:90%;" prop="GROUP_NAME" >
                <Input v-model="formData.GROUP_NAME" type="text"> </Input>
                </FormItem>
                <FormItem label="手机号码:" style="width:90%;" prop="GROUP_NAME" >
                <Input v-model="formData.GROUP_NAME" type="text"> </Input>
                </FormItem>                
                <FormItem label="QQ号码:" style="width:90%;" prop="GROUP_NAME" >
                <Input v-model="formData.GROUP_NAME" type="text"> </Input>
                </FormItem>
                <FormItem label="微信号码:" style="width:90%;" prop="GROUP_NAME" >
                <Input v-model="formData.GROUP_NAME" type="text"> </Input>
                </FormItem>
                <FormItem label="身份证号:" style="width:90%;" prop="GROUP_NAME" >
                <Input v-model="formData.GROUP_NAME" type="text"> </Input>
                </FormItem>
                <FormItem label="入职日期:" style="width:90%;" prop="GROUP_NAME" >
                <Input v-model="formData.GROUP_NAME" type="text"> </Input>
                </FormItem>                
                <FormItem label="家庭地址:" style="width:90%;" prop="GROUP_NAME" >
                <Input v-model="formData.GROUP_NAME" type="text"> </Input>
                </FormItem>
                <FormItem label="所属部门:" style="width:90%;" prop="GROUP_NAME" >
                <Input v-model="formData.GROUP_NAME" type="text"> </Input>
                </FormItem>                                        
     </Form>
    </div>
    <div slot="right" class="split-pane">
    	  <Transfer
        :data="data1"
        :target-keys="targetKeys"
        :titles="titles"
        @on-change="handleChange1"></Transfer>
    </div>
  </Split>
      <div slot="footer">
      <Button @click="addcancle()">取消</Button>
      <Button type="primary" @click="addpost('list')">保存</Button>
      </div>
    </Modal>
   </common-table>
</template>
<script>
import commonTable from '@/hxx-components/common-table.vue'
import { getName, getDictGroup, getCreate } from '@/libs/util.js'
	export default{
		name:'staff-manage',
		components:{commonTable},
		data(){
			return {
            split:0.3,
			page:1,
			limit:25,
			showModal:false,
			total:0,
			tableData:[],
			clearType:false,
			showTable:false,
			data1:[],
			titles:['未选角色','当前已选角色'],
			targetKeys:[],
			formData:{
			NAME:'',
			ADDRESS:'',
			REMARK:'',
			},
			list:'',
			rules:{
				NAME:[{required:true,message:'名称必填'}]
			},
			columns:[
			{title: '员工账号', key: 'USER_CODE', sortable: true, minWidth: 140},
			{title: '员工姓名', key: 'USER_NAME', sortable: true, minWidth: 140},
			{title: '员工角色', key: 'ROLE_NAME', sortable: true, minWidth: 140},
			{title: '性别', key: 'SEX', sortable: true, minWidth: 90,
			  render: (h,params)=> h('span',getName(this.sexList,params.row.SEX))
		    },
		    {title: '手机号', key: 'TEL_PHONE', sortable: true, minWidth: 140},
		    {title: '职务', key: 'PROFESSION', sortable: true, minWidth: 90,
			render: (h,params)=> h('span',getName(this.classList,params.row.PROFESSION))
		    },
		    {title: '身份证号', key: 'CERT_NO', sortable: true, minWidth: 140},
		    {title: '员工账号状态', key: 'STATUS', sortable: true, minWidth: 140,
		    render: (h,params)=> h('span',getName(this.statusList,params.row.STATUS))
		    },


			],
			search:{
				keyword:'',
				status:0,
			},
		    }
		},
		methods:{
			handleChange1 (newTargetKeys, direction, moveKeys) {

                this.targetKeys = newTargetKeys;
            },
		 add(){
		 	for(var i in this.formData){
		 		this.formData[i] = '';
		 	}
		 	this.getRoll();
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
          url: '/tenant/sys/users/list',
          method: 'post',
          data: {access_token: this.$store.state.user.token,
                 limit:25,
                 page:1,
                 KEYWORD:this.search.keyword,
                 STATUS_eq:this.search.status == 0 ? '' : this.search.status,
                }
        }).then(res => {
          if (res.success === true) {
          	this.tableData = res.data;
          	this.total = res.total;
          }
        })
		 	this.clearsection();
		 },
		 getRoll(){
		 	///tenant/sys/users/getAllRoles
		  this.axios.request({
          url: '/tenant/sys/users/getAllRoles',
          method: 'post',
          data: {access_token: this.$store.state.user.token,
                 limit:25,
                 page:1,
                }
        }).then(res => {
          if (res.success === true) {
            this.data1 = [];
            var data = res.data;
            for(var i in data){
            this.data1.push({ "key":data[i].ID, "label":data[i].NAME, "disabled": false });
            }
          }
         })
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
		 	this.search.status = 0;
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
			statusList(){
				var grop = getDictGroup(this.$store.state.app.dict,'1001');
				var data = [];
				data.push({name:'请选择...',code:0});
				for(var i in grop){
					data.push(grop[i]);
				}
				return data;
			},
			sexList(){
				return getDictGroup(this.$store.state.app.dict,'1003');
			},
			classList(){
				return getDictGroup(this.$store.state.app.dict,'1012');
			},
			defaultList(){
				return getDictGroup(this.$store.state.app.dict,'1004');
			}
		}

	}
</script>
<style lang="less">
	.ivu-transfer-list{
		width:45%;
		height:400px;
	}
</style>