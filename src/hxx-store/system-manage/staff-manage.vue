<template>
  <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage"
                :total="total" :show="showTable" :clearSelect="clearType" @onRowClick="onRowClick"
                @onRowDblclick="dbclick" :page="page">
    <div slot="search">
      <div class="search-block">
        <Input v-model="search.keyword" placeholder="员工账号/员工姓名/手机号码..."></Input>
      </div>
      <div class="search-block">
        <Select placeholder="" v-model="search.status" style="min-width: 100%;" clearable>
          <Option v-for="(item, index) in statusList"
                  :key="index" :value="item.code">{{item.name}}
          </Option>
        </Select>
      </div>
      <ButtonGroup>
        <Button type="primary" @click="page=1;getList()">
          搜索
        </Button>
        <!--<Button type="primary" @click="clear()">-->
        <!--<Icon type="ios-undo" size="24"/>-->
        <!--</Button>-->
      </ButtonGroup>
    </div>
    <div slot="operate">
      <Button type="success" @click="add()" v-if="accessBtn('add')">新增</Button>
      <Button type="info" :disabled="cando || this.list.STATUS != '10011001'" @click="edit()" v-if="accessBtn('edit')">修改</Button>
      <!--<Button type="error" :disabled="cando" @click="remove()" v-if="accessBtn('delete')">作废</Button>-->
      <Button type="error" :disabled="cando" v-if="accessBtn('relevanceStatus')" @click="changeType">{{buttonName}}</Button>
      <!--<Button type="success" :disabled="cando" @click="reset()" v-if="accessBtn('reset_pass')">重置密码</Button>-->
    </div>
    <Modal
      v-model="setPasswordModal"
      :mask-closable="false"
      @on-visible-change="visibleChange"
      :transition-names="['', '']">
      <div slot="header" style="font-weight: bold;font-size: 18px;height:35px;line-height:35px;color:white;">
        重置[<span style="color:blue;">{{title}}</span>]的登录密码
      </div>
      <Form :model="formData1" ref="list1" :rules="rule1" :label-width="120">
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
      class="table-modal-detail full-height"
      title="员工管理"
      width="100"
      :mask-closable="false"
      @on-visible-change="visibleChange"
      :scrollable="true"
      :transfer="false"
      :footer-hide="false"
      :transition-names="['', '']">
      <modal-title slot="header" title="员工管理" :state="''" @clickBack="showModal=false"></modal-title>
      <div style="height: 100%;width:100%;overflow-x:hidden; padding-bottom: 0px;">
        <Split v-model="split" min="400px" class="split">
          <div slot="left" class="split-pane" style="overflow: auto;height:100%;">
            <Form slot="content" :model="formData" ref="list" :rules="rules" :label-width="100" class="common-form">
              <FormItem label="员工账号:" style="width:90%;" prop="USER_CODE">
                <Input v-model="formData.USER_CODE" :disabled="isdisabled" type="text"
                       placeholder="请输入手机号"> </Input>
              </FormItem>
              <FormItem label="短信验证码" v-show="!isdisabled" style="width: calc(90% - 100px);" prop="telcode">
                <Input placeholder="短信验证码" v-model="formData.telcode" class="red">
                </Input>
              </FormItem>
              <FormItem :label-width="0" v-show="!isdisabled" style="width:100px;" prop="smsCode">
                <a href="javascript:void(0)" :class="time != 60 ? 'hqfalse' : 'hqtrue'" @click="getCode"
                   :disabled="time != 60">{{description}}</a>
              </FormItem>
              <FormItem label="员工姓名:" style="width:90%;">
                <Input v-model="formData.USER_NAME" type="text" placeholder="员工姓名(请避免重名),列如:张三"> </Input>
              </FormItem>
              <!--<FormItem label="登录密码:" v-if="!isdisabled" style="width:90%;" prop="PWD">-->
                <!--<Input v-model="formData.PWD" @on-keyup="kg" type="text" placeholder="密码应为6-18位字母数字及下划线"> </Input>-->
              <!--</FormItem>-->
              <FormItem label="职务:" style="width:90%;" prop="PROFESSION">
                <Select v-model="formData.PROFESSION">
                  <Option v-for="(item, index) in classList"
                          :key="index" :value="item.code">{{item.name}}
                  </Option>
                </Select>
              </FormItem>
              <FormItem label="性别:" style="width:90%;" prop="SEX">
                <Select v-model="formData.SEX">
                  <Option v-for="(item, index) in sexList"
                          :key="index" :value="item.code">{{item.name}}
                  </Option>
                </Select>
              </FormItem>
              <FormItem label="电子邮箱:" style="width:90%;" prop="EMAIL">
                <Input v-model="formData.EMAIL" type="text" placeholder="电子邮箱"> </Input>
              </FormItem>
              <FormItem label="联系电话:" style="width:90%;" prop="TEL_PHONE">
                <Input placeholder="联系电话" v-model="formData.TEL_PHONE" type="text"> </Input>
              </FormItem>
              <FormItem label="QQ号码:" style="width:90%;" prop="QQ_NUM">
                <Input v-model="formData.QQ_NUM" placeholder="QQ号码" type="text"> </Input>
              </FormItem>
              <FormItem label="微信号码:" style="width:90%;" prop="WEIXIN_NUM">
                <Input v-model="formData.WEIXIN_NUM" placeholder="微信号码" type="text"> </Input>
              </FormItem>
              <FormItem label="身份证号:" style="width:90%;" prop="CERT_NO">
                <Input v-model="formData.CERT_NO" type="text" placeholder="身份证号"> </Input>
              </FormItem>
              <FormItem label="入职日期:" style="width:90%;" prop="JOIN_DATE">
                <Col span="11" style="width:100%;">
                  <DatePicker type="date" v-model="formData.JOIN_DATE" placeholder="入职日期" format="yyyy-MM-dd"
                              style="min-width: 100%;"></DatePicker>
                </Col>
              </FormItem>
              <FormItem label="家庭地址:" style="width:90%;" prop="HOME_ADDRESS">
                <Input v-model="formData.HOME_ADDRESS" placeholder="家庭地址" type="text"> </Input>
              </FormItem>
              <FormItem label="所属部门:" style="width:90%;" prop="DEPT">
                <Input v-model="formData.DEPT" type="text" placeholder="所属部门"> </Input>
              </FormItem>
              <!--<FormItem label="关联状态:" v-show="false" style="width:90%;" prop="STATUS">-->
              <!--<Select v-model="formData.STATUS">-->
              <!--<Option v-for="(item, index) in statusList"-->
              <!--:key="index" :value="item.code">{{item.name}}-->
              <!--</Option>-->
              <!--</Select>-->
              <!--</FormItem>-->
            </Form>
          </div>
          <div slot="right" class="split-pane" style="height:100%;overflow: auto;">
            <Transfer
              :data="data1"
              :target-keys="targetKeys"
              class="staffManage"
              :titles="titles"
              @on-change="handleChange1"></Transfer>
            <div style="width:100%;height:20%;position:relative;">
              <div class="description"><Icon type="ios-alert-outline" :size="22"/>&nbsp;&nbsp;所填写的员工账号（手机号）若没有注册过好修修则会使用该手机号创建一个好修修基础账号</div>
              <!--display: table-cell;-->
              <!--vertical-align: middle;-->
            </div>
            <Spin fix v-show="formData.USER_TYPE == '10021001'">你不能修改当前用户权限</Spin>
          </div>
        </Split>
      </div>
      <div slot="footer">
        <Button @click="addcancle()">取消</Button>
        <Button type="primary" @click="addpost('list')">保存</Button>
      </div>
    </Modal>
  </common-table>
</template>
<script>
  import commonTable from '@/hxx-components/common-table.vue'
  import ModalTitle from '@/hxx-components/modal-title.vue'
  import {getName, getDictGroup, getCreate, reg} from '@/libs/util.js'
  import mixin from '@/hxx-components/mixin'
  import {getBtns} from '@/libs/util.js'
  import {deepClone} from "../../libs/util";

  export default {
    name: 'staff-manage',
    components: {commonTable, ModalTitle},
    mixins: [mixin],
    data() {
      const validatePWD = (rule, value, callback) => {
        let reg = /^[a-zA-Z0-9_]{6,18}$/;
        if (value != '' && reg.test(value)) {
          callback();
        } else {
          callback(new Error('密码应为6-18位字母数字及下滑线'));
        }
      };
      const validateEMAIL = (rule, value, callback) => {
        var reg = /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g;
        if (value != '' && !reg.test(value)) {
          callback(new Error('邮箱格式不正确'));
        } else {
          callback();
        }
      };
      const validatePHONE = (rule, value, callback) => {
        var reg = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (value != '' && !reg.test(value)) {
          callback(new Error('联系电话格式不正确'));
        } else {
          callback();
        }
      };
      return {
        split: 0.3,
        title: '标题',
        time: 60,
        description: '获取',
        timing: null,
        setPasswordModal: false,
        formData1: {
          PWD: '',
        },
        page: 1,
        userId: '',
        limit: 25,
        isdisabled: false,
        showModal: false,
        total: 0,
        tableData: [],
        clearType: false,
        showTable: false,
        data: [],
        data1: [],
        titles: ['未选角色', '当前已选角色'],
        targetKeys: [],
        formData: {},
        storeData: {
          USER_ID: "",
          USER_TYPE: "",
          telSession: "",
          USER_CODE: "",
          telcode: "",
          USER_NAME: "",
          // PWD: "",//密码
          PROFESSION: "",//职务
          SEX: "",//性别
          EMAIL: "",//邮箱
          TEL_PHONE: "",//电话
          QQ_NUM: "",//qq号码
          WEIXIN_NUM: "",
          CERT_NO: "",
          JOIN_DATE: "",//入职时间
          HOME_ADDRESS: "",
          DEPT: "",//所属部门
          // STATUS: "",//是否有效
          ROLES: ""
        },
        list: '',
        rules: {
          // USER_NAME: [{required: true, message: '账号必填'}],
          USER_CODE: [{required: true, message: '账号必填'}, {
            validator: (rule, value, callback) => {
              if (!reg.mobile.test(value)) callback("请输入正确的手机号");
              callback();
            }
          }],
          // PROFESSION: [{required: true}],
          // SEX: [{required: true}],
          // STATUS: [{required: true}],
          // PWD: [{required: true, message: '密码必填'},
          //   {validator: validatePWD, trigger: 'change'},
          //   {validator: validatePWD, trigger: 'blur'},
          // ],
          telcode: {
            required: true, message: '验证码必填',
          },
          EMAIL: [
            {validator: validateEMAIL, trigger: 'change'},
            {validator: validateEMAIL, trigger: 'blur'},
          ],
          TEL_PHONE: [
            {validator: validatePHONE, trigger: 'change'},
            {validator: validatePHONE, trigger: 'blur'},
          ]
        },
        rule1: {
          PWD: [{required: true, message: '密码必填'},
            {validator: validatePWD, trigger: 'change'},
            {validator: validatePWD, trigger: 'blur'},
          ],
        },
        columns: [
          {
            title: '序号', width: 80, align: 'center',
            render: (h, params) => h('span', (this.page - 1) * this.limit + params.index + 1)
          },
          {title: '员工账号', key: 'USER_CODE', sortable: true, minWidth: 140},
          {title: '员工姓名', key: 'USER_NAME', sortable: true, minWidth: 140},
          {title: '员工角色', key: 'ROLE_NAME', sortable: true, minWidth: 140},
          {
            title: '性别', key: 'SEX', sortable: true, minWidth: 90,
            render: (h, params) => h('span', getName(this.sexList, params.row.SEX))
          },
          {title: '联系电话', key: 'TEL_PHONE', sortable: true, minWidth: 140},
          {
            title: '职务', key: 'PROFESSION', sortable: true, minWidth: 90,
            render: (h, params) => h('span', getName(this.classList, params.row.PROFESSION))
          },
          {title: '身份证号', key: 'CERT_NO', sortable: true, minWidth: 140},
          {
            title: '员工账号状态', key: 'STATUS', sortable: true, minWidth: 140,
            render: (h, params) => h('span', getName(this.statusList, params.row.STATUS))
          },


        ],
        search: {
          keyword: '',
          status: 0,
        },
      }
    },
    methods: {
      decrTime() {
        if (this.time > 0) {
          this.description = this.time - 1 + "s";
          this.time--;
        } else {
          clearInterval(this.timing);
          this.description = "获取验证码";
          this.time = 60;
        }
      },
      getCode() {
        this.$refs.list.validateField('USER_CODE', (error) => {
          if (!error) {
            //开始调取接口获取验证码
            this.axios.request({
              url: 'tenant/sys/users/messageCode',
              method: 'post',
              data: {
                access_token: this.$store.state.user.token,
                userCode: this.formData.USER_CODE,
              }
            }).then(res => {
              let title;
              if (res.success == true) {
                title = "短信已发送,请及时查收";
                this.timing = setInterval(this.decrTime, 1000);
                this.formData.telSession = res.data.telSession;
                this.$Modal.info({title: '系统提示!', content: title});
              }
            })
          } else {
            this.$Message.error("请填写正确的员工账号来获取验证码!");
            return false;
          }
        });
      },
      accessBtn(btnName) {
        return getBtns(this.$route.meta.access, this.$store.state.user.accessMenu).indexOf(btnName) >= 0 ? true : false
      },
      reset() {
        this.$refs['list1'].resetFields();
        this.userId = this.list.USER_ID;
        this.title = this.list.USER_NAME;
        this.setPasswordModal = true;
      },
      resetcancle() {
        this.setPasswordModal = false;
      },
      resetpost(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$Modal.confirm({
              title: '系统提示',
              content: '确认保存吗?',
              onOk: this.resetsave,
            });
          } else {
            this.$Message.error("请校对红框信息");
          }
        })
      },
      resetsave() {
        this.axios.request({
          url: '/tenant/sys/users/resetPass',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            newPass: this.formData1.PWD,
            userId: this.userId
          }
        }).then(res => {
          if (res.success === true) {
            this.setPasswordModal = false;
            this.getList();
          }
        })
      },
      kg(e) {
        var data = e.target.value;
        e.target.value = data.replace(/\s+/g, '');
      },
      handleChange1(newTargetKeys, direction, moveKeys) {

        this.targetKeys = newTargetKeys;
      },
      add() {
        this.formData = deepClone(this.storeData);
        this.$refs['list'].resetFields();
        this.isdisabled = false;
        this.formData.PROFESSION = this.classList[0].code;
        this.formData.SEX = this.sexList[0].code;
        this.formData.STATUS = this.statusList[0].code;
        this.formData.PWD = '';
        this.data = [];
        this.getRoll();
        this.targetKeys = [];
        this.showModal = true;
      },
      remove() {
        this.$Modal.confirm({title: '系统提示', content: '确认要作废吗?', onOk: this.del});
      },
      del() {
        // /tenant/basedata/ttstorehouse/cancel
        this.axios.request({
          url: '/tenant/sys/users/delete',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            ids: this.list.USER_ID
          }
        }).then(res => {
          if (res.success === true) {
            this.getList();
          }
        })
      },
      changeType() {
        // if(this.list.USER_TYPE == '10021001'){
        //   this.$Modal.info({
        //     title:'系统提示',
        //     content:'此账号无法取消关联',
        //   });
        //   return false;
        // }
        let id = this.list.USER_ID;
        let status = this.list.STATUS;
        let content;
        let hint;
        this.list = "";
        if (status == '10011001') {
          content = '确认解除关联关系吗';
          hint = '解除关联成功';
        } else {
          content = '确认关联该员工吗';
          hint = '关联成功';
        }
        this.$Modal.confirm({
          title: "系统提示!",
          content: content,
          onOk: () => {
            this.axios.request({
              url: '/tenant/sys/users/updateStatus',
              method: 'post',
              data: {
                access_token: this.$store.state.user.token,
                userId: id,
                status: status == '10011001' ? '10011002' : '10011001',
              }
            }).then(res => {
              if (res.success === true) {
                this.$Message.success(hint);
                this.getList();
              }
            })
          }
        });
      },
      edit() {
        this.update(this.list);
      },
      visibleChange() {
        this.clearsection();
      },
      addcancle() {
        this.showModal = false;
      },
      addpost(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            if (this.targetKeys.length == 0) {
              this.$Message.info("请选取员工角色");
              return false;
            }
            this.$Modal.confirm({
              title: '系统提示',
              content: '确认保存吗?',
              onOk: this.tosave,
            });
          } else {
            this.$Message.error("请校对红框信息");
          }
        })
      },
      tosave() {
        this.formData.ROLES = this.targetKeys.join(',');
        this.axios.request({
          url: '/tenant/sys/users/save',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            data: JSON.stringify(this.formData),
            roles: this.formData.ROLES,
            telSession: this.formData.telSession || '',
            telcode: this.formData.telcode,
          }
        }).then(res => {
          if (res.success === true) {
            this.showModal = false;
            this.getList();
          }
        })
      },
      changePage(page) {
        this.page = page;
        this.getList();
      },
      changePageSize(size) {
        this.limit = size;
        this.getList();
      },
      getList() {
        ///tenant/basedata/ttstorehouse/list
        this.axios.request({
          url: '/tenant/sys/users/list',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            limit: this.limit,
            page: this.page,
            KEYWORD: this.search.keyword,
            STATUS_eq: this.search.status || '',
          }
        }).then(res => {
          if (res.success === true) {
            this.tableData = res.data;
            this.total = res.total;
          }
        })
        this.clearsection();
      },
      getRoll() {
        ///tenant/sys/users/getAllRoles
        this.axios.request({
          url: '/tenant/sys/users/getAllRoles',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            limit: 25,
            page: 1,
          }
        }).then(res => {
          if (res.success === true) {
            this.data1 = [];
            var data = res.data;
            for (var i in data) {
              this.data1.push({"key": data[i].ID, "label": data[i].NAME, "disabled": false});
            }
            for (var i in this.data) {
              for (var a in this.data1) {
                if (this.data1[a].label.indexOf(this.data[i]) > -1) {
                  this.targetKeys.push(this.data1[a].key);
                  break;
                }
              }
            }
          }
        })
      },
      onRowClick(row) {
        this.list = row;
      },
      dbclick(row) {
        this.update(row);
      },
      update(row) {
        if (!this.accessBtn('edit')) {
          this.$Message.info('抱歉,你无权限这样做');
          return false;
        }
        let data;
        row.ROLE_NAME = row.ROLE_NAME ? row.ROLE_NAME : '';
        this.formData = row;
        this.formData.telcode = "999999";
        if (row.ROLE_NAME == "") {
          data = [];
        } else {
          data = row.ROLE_NAME.split(',');
        }

        this.data = data;
        // console.log(JSON.stringify(this.data));
        this.targetKeys = [];
        this.isdisabled = true;
        this.getRoll();
        this.showModal = true;
      },
      clear() {
        this.search.keyword = '';
        this.search.status = 0;
      },
      clearsection() {
        this.list = '';
        this.clearType = Math.random();
      }
    },
    mounted() {
      this.showTable = Math.random();
      this.getList();
    },
    computed: {
      buttonName() {
        switch (this.list.STATUS) {
          case '10011001':
            return '解除关联';
            break;
          case '10011002':
            return '关联员工';
            break;
          default:
            return '更改关联';
        }
      },
      cando() {
        var flag = this.list == '' ? true : false;
        return flag;
      },
      statusList() {
        return getDictGroup(this.$store.state.app.dict, '1001');
      },
      sexList() {
        return getDictGroup(this.$store.state.app.dict, '1003');
      },
      classList() {
        return getDictGroup(this.$store.state.app.dict, '1012');
      },
      defaultList() {
        return getDictGroup(this.$store.state.app.dict, '1004');
      }
    }

  }
</script>
<style scoped lang="less">
  .hqtrue {
    background: #ECF5FF;
    color: #1890FF;
    display: block;
    font-size: 14px;
    height: 32px;
    width: 90px;
    text-align: center;
    margin-top: 2px;
    border: 1px solid #B3D8FF;
    border-radius: 2px;
  }

  .hqfalse {
    background: #E9E9E9;
    color: #999999;
    display: block;
    font-size: 14px;
    height: 32px;
    width: 90px;
    text-align: center;
    margin-top: 2px;
    border: 1px solid #E9E9E9;
    border-radius: 2px;
  }
</style>
<style scoped lang="less">
  .description{
    font-size:18px;
    width:100%;
    padding-left:5px;
    text-align:center;
    position: absolute;
    top:50%;
    transform: translateY(-50%);
    color:blue;
  }
</style>
<style lang="less">
  .vehicle-tree {
    > .ivu-tree-children {
      height: 100%;
      overflow: auto;
    }
    .highlight {
      color: red;
    }
  }

  .staffManage {
    /*min-width: 800px;*/
    height: 80%;
    .ivu-transfer-list {
      width: calc(~"50% - 41px");
      height: 100%;
      /*min-width: 300px;*/
    }
  }
</style>
