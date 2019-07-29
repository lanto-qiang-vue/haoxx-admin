<template>
  <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage" :total="total"  :show="showTable" :clearSelect="clearType" @onRowClick="onRowClick" @onRowDblclick="dbclick" :page="page">
    <div slot="search"  >
      <div class="search-block">
        <Input v-model="search.keyword"  placeholder="用户账号/用户名称/手机号码..."></Input>
      </div>
      <div class="search-block">
        <Select  placeholder="请选择...." v-model="search.status" style="min-width: 100%;">
          <Option v-for="(item, index) in statusList2"
                  :key="index" :value="item.code">{{item.name}}</Option>
        </Select>
      </div>
      <ButtonGroup size="small">
        <Button type="primary" @click="page=1;getList()"><Icon type="ios-search" size="24"/></Button>
        <Button type="primary" @click="clear()"><Icon type="ios-undo" size="24"/></Button>
      </ButtonGroup>
    </div>
    <div slot="operate">
      <Button type="success" @click="add()">新增</Button>
      <Button type="info" :disabled="cando" @click="edit">修改</Button>
      <Button type="error" :disabled="cando" @click="remove()">作废</Button>
      <Button type="success" :disabled="cando" @click="reset()">重置密码</Button>
    </div>
    <Modal
      v-model="setPasswordModal"
      :mask-closable="false"
      @on-visible-change="visibleChange"
      :transition-names="['', '']">
      <div slot="header" style="font-weight: bold;font-size: 18px;line-height:30px;">
        重置[<span style="color:blue;">{{title}}</span>]的登录密码
      </div>
      <Form :model="formData1"  ref="list1" :rules="rule1" :label-width="120" >
        <FormItem label="请输入新密码:" style="width:90%;" prop="PWD">
          <Input v-model="formData1.PWD" @on-keyup="kg" type="text"> </Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="resetcancle()">取消</Button>
        <Button type="primary" @click="resetpost('list1')">保存</Button>
      </div>
    </Modal>
    <Modal
      v-model="showModal"
      class="table-modal-detail"
      title="用户信息"
      width="80"
      :mask-closable="false"
      @on-visible-change="visibleChange"
      :scrollable="true"
      :transfer= "false"
      :footer-hide="false"
      :transition-names="['', '']">
      <Split v-model="split" :min="0.3" :max="0.7" class="split">
        <div slot="left" class="split-pane" style="overflow: auto;height:100%;">
          <Form slot="content" :model="formData"  ref="list" :rules="rules" :label-width="100" class="common-form">
            <FormItem label="用户账号:" style="width:90%;" prop="USER_CODE" >
              <Input v-model="formData.USER_CODE"  :disabled="isdisabled"  type="text"> </Input>
            </FormItem>
            <FormItem label="用户名称:" style="width:90%;" prop="USER_NAME" >
              <Input v-model="formData.USER_NAME" type="text"> </Input>
            </FormItem>
            <FormItem label="登录密码:" v-if="!isdisabled" style="width:90%;" prop="PWD">
              <Input v-model="formData.PWD" @on-keyup="kg" type="text"> </Input>
            </FormItem>
            <FormItem label="性别:" style="width:90%;" prop="SEX">
              <Select v-model="formData.SEX">
                <Option v-for="(item, index) in sexList"
                        :key="index" :value="item.code">{{item.name}}</Option>
              </Select>
            </FormItem>
            <FormItem label="电子邮箱:" style="width:90%;" prop="EMAIL" >
              <Input v-model="formData.EMAIL" type="text"> </Input>
            </FormItem>
            <FormItem label="手机号码:" style="width:90%;" prop="TEL_PHONE" >
              <Input v-model="formData.TEL_PHONE" type="text"> </Input>
            </FormItem>
            <FormItem label="用户状态:" style="width:90%;" prop="STATUS">
              <Select v-model="formData.STATUS">
                <Option v-for="(item, index) in statusList"
                        :key="index" :value="item.code">{{item.name}}</Option>
              </Select>
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
  import mixin from '@/hxx-components/mixin'
  export default{
    name:'user-management',
    components:{commonTable},
    mixins: [mixin],
    data(){
      const validatePWD = (rule, value, callback) => {
        if (value != '' && value.length >= 6 && value.length <= 18) {
          callback();
        }else{
          callback(new Error('密码长度应在6-18位之间'));
        }
      };
      const validateEMAIL = (rule, value, callback) => {
        var reg = /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g;
        if (value != '' && !reg.test(value)) {
          callback(new Error('邮箱格式不正确'));
        }else{
          callback();
        }
      };
      const validatePHONE = (rule, value, callback) => {
        var reg = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (value != '' && !reg.test(value)) {
          callback(new Error('手机格式不正确'));
        }else{
          callback();
        }
      };
      return {
        active:false,
        split:0.3,
        title:'标题',
        setPasswordModal:false,
        formData1:{
          PWD:'',
        },
        page:1,
        userId:'',
        limit:25,
        isdisabled:false,
        showModal:false,
        total:0,
        tableData:[],
        clearType:false,
        showTable:false,
        data:[],
        data1:[],
        titles:['未选角色','当前已选角色'],
        targetKeys:[],
        formData:{
          USER_ID: "",
          USER_CODE: "",
          USER_NAME: "",
          PWD: "",//密码
          SEX: "",//性别
          EMAIL: "",//邮箱
          TEL_PHONE: "",//电话
          STATUS: "",//是否有效
          ROLES: ""
        },
        list:'',
        rules:{
          USER_NAME:[{required:true,message:'账号必填'}],
          USER_CODE:[{required:true,message:'姓名必填'}],
          PROFESSION:[{required:true}],
          SEX:[{required:true}],
          STATUS:[{required:true}],
          PWD:[{required:true,message:'密码必填'},
            { validator: validatePWD, trigger: 'change' },
            { validator: validatePWD, trigger: 'blur' },
          ],
          EMAIL:[
            { validator: validateEMAIL, trigger: 'change' },
            { validator: validateEMAIL, trigger: 'blur' },
          ],
          TEL_PHONE:[
            { validator: validatePHONE, trigger: 'change' },
            { validator: validatePHONE, trigger: 'blur' },
          ]
        },
        rule1:{
          PWD:[{required:true,message:'密码必填'},
            { validator: validatePWD, trigger: 'change' },
            { validator: validatePWD, trigger: 'blur' },
          ],
        },
        columns:[
          {title: '序号',  minWidth: 70,
            render: (h, params) => h('span', (this.page-1)*this.limit+params.index+1 )
          },
          {title: '用户账号', key: 'USER_CODE', sortable: true, minWidth: 140},
          {title: '用户名称', key: 'USER_NAME', sortable: true, minWidth: 140},
          {title: '性别', key: 'SEX', sortable: true, minWidth: 90,
            render: (h,params)=> h('span',getName(this.sexList,params.row.SEX))
          },
          {title: '手机号', key: 'TEL_PHONE', sortable: true, minWidth: 140},
          {title: '员工账号状态', key: 'STATUS', sortable: true, minWidth: 140,
            render: (h,params)=> h('span',getName(this.statusList,params.row.STATUS))
          },
          {title: '添加时间', key: 'CREATE_TIME', sortable: true, minWidth: 140},
        ],
        search:{
          keyword:'',
          status:0,
        },
      }
    },
    methods:{
      closeModal(){
        this.setPasswordModal = this.showModal = false;
      },
      reset(){
        this.$refs['list1'].resetFields();
        console.log(JSON.stringify(this.list));
        this.userId = this.list.USER_ID;
        this.title = this.list.USER_NAME;
        this.setPasswordModal = true;
      },
      resetcancle(){
        this.setPasswordModal = false;
      },
      resetpost(name){
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$Modal.confirm({
              title:'系统提示',
              content:'确认保存吗?',
              onOk:this.resetsave,
            });
          } else {
            this.$Message.error("请校对红框信息");
          }
        })
      },
      resetsave(){
        this.axios.request({
          url: '/manage/sys/users/resetPass',
          method: 'post',
          data: {access_token: this.$store.state.user.token,
            newPass:this.formData1.PWD,
            userId:this.userId
          }
        }).then(res => {
          if (res.success === true) {
            this.setPasswordModal = false;
            this.$Message.info("密码重置成功");
            this.getList();
          }
        })
      },
      kg(e){
        var data = e.target.value;
        e.target.value = data.replace(/\s+/g,'');
      },
      handleChange1 (newTargetKeys, direction, moveKeys) {

        this.targetKeys = newTargetKeys;
      },
      add(){
        this.$refs['list'].resetFields();
        this.isdisabled = false;
        this.formData.SEX = this.sexList[0].code;
        this.formData.STATUS = this.statusList[0].code;
        this.formData.PWD = '';
        this.data = [];
        this.getRoll();
        this.targetKeys = [];
        this.showModal = true;
      },
      remove(){
        this.$Modal.confirm({title:'系统提示',content:'确认要作废吗?',onOk:this.del});
      },
      del(){
        this.axios.request({
          url: '/manage/sys/users/delete',
          method: 'post',
          data: {access_token: this.$store.state.user.token,
            ids:this.list.USER_ID
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
      addcancle(){
        this.showModal = false;
      },
      addpost(name){
        this.$refs[name].validate((valid) => {
          if (valid) {
            if(this.targetKeys.length == 0){
              this.$Message.error("请选取角色");
              return false;
            }
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
        this.formData.ROLES = this.targetKeys.join(',');
        console.log(JSON.stringify(this.formData));
        this.axios.request({
          url: '/manage/sys/users/save',
          method: 'post',
          data: {access_token: this.$store.state.user.token,
            data:JSON.stringify(this.formData),
            roles:this.formData.ROLES,
          }
        }).then(res => {
          if (res.success === true) {
            this.showModal = false;
            this.getList();
          }else{
            let self = this;
            setTimeout(function(){
              self.$Modal.error({title:'异常提示',content:res.Exception.message});
            },500)
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
        this.axios.request({
          url: '/manage/sys/users/list',
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
      getRoll(id = ''){
        ///tenant/sys/users/getAllRoles
        this.axios.request({
          url: '/manage/sys/users/getAllRoles',
          method: 'post',
          data: {access_token: this.$store.state.user.token,
            limit:25,
            page:1,
            USER_ID:id,
          }
        }).then(res => {
          if (res.success === true) {
            this.data1 = [];
            this.targetKeys = [];
            let data = res.data;
            for(let i in data){
              this.data1.push({ "key":data[i].ID, "label":data[i].NAME, "disabled": false });
              if(data[i].IS_CHECK == 1){
                this.targetKeys.push(this.data1[i].key);
              }
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
        this.targetKeys = [];
        this.isdisabled = true;
        this.getRoll(row.USER_ID);
        this.showModal = true;
      },
      clear(){
        this.search.keyword = '';
        this.search.status = 0;
        console.log(this.search.status);
      },
      clearsection(){
        this.list = '';
        this.clearType = Math.random();
      }
    },
    mounted(){
      if(this.$route.query.account && !this.active){
         this.search.keyword = this.$route.query.account;
      }else{

      }
      this.showTable = Math.random();
      this.getList();
    },
    activated() {
      if(this.active){
        if (this.$route.query.account) {
          this.closeModal();
          this.search.keyword = this.$route.query.account;
          this.getList();
        }
      }else{
        this.active = true;
      }
    },
    computed:{
      cando(){
        var flag = this.list == '' ? true : false;
        return flag;
      },
      statusList(){
        return getDictGroup(this.$store.state.app.dict,'1001');
      },
      statusList2(){
        let data = getDictGroup(this.$store.state.app.dict,'1001');
        data.unshift({name:'请选择...',code:0});
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
