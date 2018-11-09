<!--预约单管理详情-->
<template>
  <Modal
    title="客户档案详情"
    :transition-names="['', '']"
    v-model="showModal"
    width="90"
    @on-visible-change="visibleChange"
    :mask-closable="false"
    :scrollable="false"
    :transfer="false"
  >

    <Tabs @on-click="qh" v-model="indexName" class="modal-tabs">

      <!-- 基本信息 -->
      <TabPane label="基本信息" name="m1" icon="logo-apple">
        <Form ref="formData" :model="formData" :label-width="120" class="common-form" :rules="ruleValidate" inline>
          <FormItem style="margin-left:-80px;width:100%;">
            <!--<div class="operate">-->
            <!--<Button @click="showModal = false">返回</Button>-->
            <!--<Button type="primary" style="margin-left: 8px" @click="hsubmit('formData')">保存</Button>-->
            <!--</div>-->
          </FormItem>
          <div></div>
          <FormItem label="客户名称" style="width:30%;" prop="name">
            <Input type="text" v-model="formData.name" style="min-width: 100%;"> </Input>
          </FormItem>
          <FormItem label="移动电话:" style="width:30%;" prop="phone">
            <Input type="text" v-model="formData.phone" style="min-width: 100%;"> </Input>
          </FormItem>
          <FormItem label="联系地址:" style="width:30%;">
            <Input type="text" v-model="formData.address" style="min-width: 100%;"> </Input>
          </FormItem>
          <div style="clear:both;"></div>
          <FormItem label="固定电话:" style="width:30%;">
            <Input type="text" v-model="formData.tel" style="min-width: 100%;"> </Input>
          </FormItem>
          <FormItem label="身份证号:" prop="idcard" style="width:30%;">
            <Input type="text" v-model="formData.idcard" style="min-width: 100%;"> </Input>
          </FormItem>
          <FormItem label="生日:" style="width:30%;">
            <!--    <Input type="text" style="min-width: 100%;"> </Input> -->
            <Col span="11" style="width:100%;">
              <DatePicker type="date" placeholder="" v-model="formData.birthday" format="yyyy-MM-dd"
                          style="min-width: 100%;"></DatePicker>
            </Col>
          </FormItem>
          <FormItem label="性别:" style="width:30%;">
            <Select v-model="formData.sex" placeholder="" style="min-width: 100%;">
              <Option v-for="(item, index) in sexGroup"
                      :key="index" :value="item.code">{{item.name}}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="客户来源:" style="width:30%;">
            <Select v-model="formData.resource" placeholder="" style="min-width: 100%;">
              <Option v-for="(item, index) in resourceGroup"
                      :key="index" :value="item.code">{{item.name}}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="客户等级:" style="width:30%;">
            <Select v-model="formData.level" placeholder="" style="min-width: 100%;">
              <Option v-for="(item, index) in levelGroup"
                      :key="index" :value="item.code">{{item.name}}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="客户类型:" style="width:30%;">
            <Select v-model="formData.type" placeholder="" style="min-width: 100%;">
              <Option v-for="(item, index) in typeGroup"
                      :key="index" :value="item.code">{{item.name}}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="QQ:" style="width:30%;">
            <Input type="text" v-model="formData.qq" style="min-width: 100%;"> </Input>
          </FormItem>
          <FormItem label="微信:" style="width:30%;">
            <Input type="text" v-model="formData.wx" style="min-width: 100%;"> </Input>
          </FormItem>
          <FormItem label="客户专员:" style="width:30%;">
            <Select v-model="formData.attach" placeholder="" style="min-width: 100%;">
              <Option v-for="(item, index) in attachGroup"
                      :key="index" :value="item.USER_ID">{{item.USER_NAME}}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="邮箱:" style="width:30%;">
            <Input type="text" v-model="formData.email" style="min-width: 100%;"> </Input>
          </FormItem>
          <FormItem label="开票税号:" v-show="xhide" style="width:30%;">
            <Input type="text" v-model="formData.snumber" style="min-width: 100%;"> </Input>
          </FormItem>
        </Form>
        <Form ref="formDatas" :label-width="120">
          <FormItem label="备注:">
            <Input type="textarea" v-model="formData.remark" placeholder="请输入备注信息"> </Input>
          </FormItem>
        </Form>
      </TabPane>
      <!-- 车辆档案 -->
      <TabPane label="车辆档案" name="m2" :disabled="tabshow < 1" icon="logo-windows">
        <!-- 车辆档案列表 -->

        <common-table :columns="columns" @changePageSize="changePageSize" @changePage="changePage" :total="total"
                      :headerShow="false" :showSearch="false" :showOperate="false" @onRowClick="rowClick" :row="row"
                      :page="page" v-model="tableData" :clearSelect="cleartype" :show="show">
        </common-table>

      </TabPane>
      <!-- 车辆档案结束 -->
      <!-- 会员卡信息 -->

      <TabPane label="会员卡信息" name="m3" :disabled="tabshow < 1" icon="logo-tux">
        <common-table :columns="columns3" @changePageSize="changePageSize3" @changePage="changePage3" :total="total3"
                      :page="page3" v-model="tableData3" :show="showTable" :showOperate="false"
                      :searchTitle="'会员卡基本信息'">
          <Form slot="search" :label-width="120" :model="formData2" class="common-form">
            <FormItem label="会员卡号:" style="width:30%;">
              <Input type="text" v-model="formData2.MEMBER_CARD_NO"  :readonly="true">
              </Input>
            </FormItem>
            <FormItem label="剩余总额:" style="width:30%;">
            <Input type="text" v-model="formData2.SURPLUS_MONEY"  :readonly="true">
            </Input>
            </FormItem>
            <FormItem label="充值总额:" style="width:30%;">
            <Input type="text" v-model="formData2.RECHARGE_MONEY"  :readonly="true">
            </Input>
            </FormItem>
            <FormItem label="消费总额:" style="width:30%;">
            <Input type="text" v-model="formData2.USE_MONEY"  :readonly="true">
            </Input>
            </FormItem>
            <FormItem label="会员状态:" style="width:30%;">
            <Input type="text" v-model="formData2.MEMBER_CARD_STATUS"  :readonly="true">
            </Input>
            </FormItem>
            <FormItem label="停用原因:" style="width:30%;">
            <Input type="text" v-model="formData2.CARD_STOP_REASON"  :readonly="true">
            </Input>
            </FormItem>
          </Form>
        </common-table>
      </TabPane>
      <!-- 会员结束 -->
    </Tabs>
    <!-- 到时候改成vehicleShow -->
    <Modal
      v-model="cardModal"
      :mask-closable="false"
      title="会员卡编辑"
      width="400"
      :transfer= "true"
      :transition-names="['', '']">
      <Form :model="memberData" ref="memberData" :rules="memberData" :label-width="120" class="common-form">
        <FormItem label="会员卡编号:" style="width:100%;">
          <Input v-model="memberData.MEMBER_CARD_NO"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="cardPost">保存</Button>
        <Button type="error" @click="cardModal=false">关闭</Button>
      </div>
    </Modal>
    <cart-modal class="table-modal-detail" @clearsection="clearsection" :info="rows" :hidetype="hidetype"
                :show="showLook"></cart-modal>
    <vehicle-add @refresh="refresh()" @clearsection="clearsection" :CUSTOMER_ID="tabshow" :row="row"
                 :show="vehicleShow"></vehicle-add>
    <div slot="footer">
      <Button @click="showModal=false">取消</Button>
      <Button type="primary" v-show="indexName == 'm3'" @click="changeCard">发卡/换卡</Button>
      <Button type="error" v-show="indexName == 'm3'">停用</Button>
      <Button type="success" v-show="indexName == 'm3'">启用</Button>
      <Button type="primary" v-show="indexName=='m1'" @click="hsubmit('formData')">保存</Button>
      <Button type="success" v-show="indexName=='m2'" @click="vehicleAdd">新增</Button>
      <Button type="primary" :disabled="cando" v-show="indexName=='m2'" @click="vehicleEdit">修改</Button>
      <Button type="info" :disabled="cando" v-show="indexName=='m2'" @click="vehicleLook">查看</Button>
    </div>
  </Modal>
  <!-- 车辆档案新增组件 -->
  <!-- 车辆答案组件结束 -->

</template>
<script>
  import commonTable from '@/hxx-components/common-table.vue'
  import {getName, getDictGroup, getCreate} from '@/libs/util.js'
  import {formatDate} from '@/libs/tools.js'
  import vehicleAdd from '@/hxx-components/vehicle-add.vue'
  import cartModal from '@/hxx-store/customer-relations/cart-modal.vue'

  export default {
    name: "customer-list-detail",
    components: {commonTable, vehicleAdd, cartModal},
    data() {
      return {
        cardModal:false,
        memberData:{
          MEMBER_CARD_NO:'',
          CUSTOMER_ID:'',
        },
        valueList: [1],
        tableData3: [],
        formData2: {
          SURPLUS_MONEY:'',
          SURPLUS_MONEY:'',
          RECHARGE_MONEY:'',
          USE_MONEY:'',
          CARD_STOP_REASON:'',
        },
        showTable: false,
        columns3: [
          {
            title: '序号', minWidth: 80,
            render: (h, params) => h('span', (this.page3 - 1) * this.limit3 + params.index + 1)
          },
          {title: '储值卡产品', key: 'CARD_NAME', sortable: true, minWidth: 120},
          {title: '售价', key: 'SALES_MONEY', sortable: true, minWidth: 120},
          {title: '赠送价值', key: 'DERATE_MONEY', sortable: true, minWidth: 120},
          {title: '总价值', key: 'SUM_MONEY', sortable: true, minWidth: 120},
          {
            title: '充值时间', key: 'RECHARGE_TIME', sortable: true, minWidth: 120,
            render: (h, params) => h('span', params.row.RECHARGE_TIME.substr(0, 10))
          },
          {title: '办理人', key: 'FOLLOW_PERSON', sortable: true, minWidth: 120},
        ],
        page3: 1,
        limit3: 25,
        total3: 0,
        cleartype: false,
        hidetype: 1,
        showModal: false,
        xhide: false,
        showLook: false,
        indexName: 'm1',
        collapse: '1',
        tabshow: 0,
        sexGroup: [],
        resourceGroup: [],
        levelGroup: [],
        typeGroup: [],
        attachGroup: [],
        store: {},//存储使用
        tableData: [],
        total: 0,
        page: 1,
        limit: 25,
        vehicleShow: false,//车辆档案新增
        row: '',//存储车辆档案单选数据
        rows: '',
        objlist: '',
        formData: {
          name: '',
          phone: '',
          address: '',
          tel: '',
          idcard: '',
          birthday: '',
          sex: '',
          resource: '',
          level: '',
          type: '',
          qq: '',
          wx: '',
          attach: '',
          email: '',
          snumber: '',
          remark: '',
        },
        obj: {
          description: '',
          title: '',
          show: false,
          funname: '',
        },
        ruleValidate: {
          name: [{required: true, message: '客户名称必填', trigger: 'change'}],
          phone: [{required: true, pattern: /^[1][3,4,5,7,8][0-9]{9}$/, message: '请输入有效手机号码', trigger: 'change,blur'},
          ],
          idcard: [{
            type: 'string',
            pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
            message: '请输入正确的身份证号码',
            trigger: 'blur'
          }]
        },
        columns: [
          {
            title: '序号', minWidth: 80,
            render: (h, params) => h('span', (this.page - 1) * this.limit + params.index + 1)
          },
          {title: '车牌号', key: 'PLATE_NUM', sortable: true, minWidth: 120},
          {
            title: '车辆颜色', key: 'VEHICLE_COLOR', sortable: true, minWidth: 120,
            render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.VEHICLE_COLOR))
          },
          {title: '车型', key: 'VEHICLE_MODEL', sortable: true, minWidth: 150},
          {
            title: '车架号', key: 'VIN_NO', sortable: true, minWidth: 120
          },
          {
            title: '发动机型号', key: 'ENGINE_NO', sortable: true, minWidth: 150
          },
          {title: '最近来厂日期', key: 'COME_DATE', sortable: true, minWidth: 150},
          {
            title: '创建人', key: 'CREATER', sortable: true, minWidth: 90,
            render: (h, params) => h('span', getCreate(this.$store.state.app.tenant, params.row.CREATER))
          },
          {
            title: '创建时间', key: 'CREATE_TIME', sortable: true, minWidth: 120
          },
        ]
      }

    },
    props: ['show', 'detail'],
    computed: {
      cando() {
        var flag = this.objlist == '' ? true : false;
        return flag;
      }
    },
    watch: {
      show() {
        this.$refs['formData'].resetFields();
        this.objlist = '';
        this.showModal = true;
        this.indexName = "m1";
      },
      detail(row) {
        // console.log(row.NAME);
        var name = row.FOLLOW_PERSON;
        var attach = 0;
        for (var i = 0; i < this.attachGroup.length; i++) {
          if (this.attachGroup[i].USER_NAME == name) {
            attach = this.attachGroup[i].USER_ID;
            break;
          }
        }
        this.tabshow = row.CUSTOMER_ID;
        var that = this.formData;
        //会员展示部分......
        this.formData2.SURPLUS_MONEY = row.SURPLUS_MONEY || 0;
        this.formData2.RECHARGE_MONEY = row.RECHARGE_MONEY || 0;
        this.formData2.USE_MONEY = row.USE_MONEY || 0;
        this.formData2.CARD_STOP_REASON = row.CARD_STOP_REASON || "";
        if(row.MEMBER_CARD_STATUS == '10491001' ){
          //会员卡启用不展示停用原因
          this.formData2.CARD_STOP_REASON = "";
        }
        this.memberData.MEMBER_CARD_NO = row.MEMBER_CARD_NO || "";
        this.memberData.CUSTOMER_ID = row.CUSTOMER_ID;
        this.formData2.MEMBER_CARD_NO = row.MEMBER_CARD_NO || "";
        this.formData2.MEMBER_CARD_STATUS = getName(getDictGroup(this.$store.state.app.dict,'1049'),row.MEMBER_CARD_STATUS);
        that.name = row.NAME;
        that.email = row.EMAIL;
        that.phone = row.MOBILE_PHONE;
        that.qq = row.QQ_NO;
        that.wx = row.WEIXIN_NO;
        that.address = row.ADDRESS;
        that.tel = row.TELPHONE;
        that.idcard = row.LICENSE_NO;
        that.birthday = row.BIRTHDAY;
        that.sex = row.SEX;
        that.resource = row.CUSTOMER_SOURCE;
        that.level = row.CUSTOMER_LEVEL;
        that.type = row.CUSTOMER_TYPE;
        that.remark = row.REMARK;
        that.snumber = row.TAX_NO;
        that.attach = attach;
        this.store = that;
      },
    },
    mounted() {
      // 下拉数据处理开始
      //性别组
      this.getList();
      this.sexGroup = getDictGroup(this.$store.state.app.dict, '1003');
      //默认选中性别第一个
      this.formData.sex = this.sexGroup[0].code;
      //来源组
      this.resourceGroup.push({
        "code": 0,
        "order": 0,
        "group": "1005",
        "name": "请选择"
      });
      var group = getDictGroup(this.$store.state.app.dict, '1005');
      for (var i = 0; i < group.length; i++) {
        this.resourceGroup.push(group[i]);
      }
      //使用0代表空
      this.formData.resource = 0;
      //客户等级
      var group = getDictGroup(this.$store.state.app.dict, '1006');
      this.levelGroup.push({
        "code": 0,
        "order": 0,
        "group": "1006",
        "name": "请选择"
      });
      for (var i = 0; i < group.length; i++) {
        this.levelGroup.push(group[i]);
      }
      this.formData.level = 0;
      //客户类型
      var group = getDictGroup(this.$store.state.app.dict, '1007');
      this.typeGroup.push({
        "code": 0,
        "order": 0,
        "group": "1007",
        "name": "请选择"
      });
      for (var i = 0; i < group.length; i++) {
        this.typeGroup.push(group[i]);
      }
      this.formData.type = 0;
      // console.log(this.$store.state.app.tenant);
      //专员组
      var group = this.$store.state.app.tenant;
      this.attachGroup.push({"USER_ID": 0, "USER_CODE": "", "USER_NAME": "==请选择=="});
      for (var i = 0; i < group.length; i++) {
        this.attachGroup.push(group[i]);
      }
      this.formData.attach = 0;
      // console.log(this.formData);
      //下拉数据处理结束

    },
    methods: {
      cardPost(name){
       this.$Modal.confirm({
         title:'系统提示',
         content:'确认保存吗?',
         onOk:()=>{
           this.axios.request({
             url: '/tenant/basedata/ttcustomerfile/update_member_card',
             method: 'post',
             data: {
               access_token: this.$store.state.user.token,
               data:JSON.stringify(this.memberData)
             }
           }).then(res => {
             if (res.success === true) {
               // this.tableData3 = res.data;
               let row = res.data;
               this.formData2.SURPLUS_MONEY = row.SURPLUS_MONEY || 0;
               this.formData2.RECHARGE_MONEY = row.RECHARGE_MONEY || 0;
               this.formData2.USE_MONEY = row.USE_MONEY || 0;
               this.formData2.CARD_STOP_REASON = row.CARD_STOP_REASON || "";
               if(row.MEMBER_CARD_STATUS == '10491001' ){
                 //会员卡启用不展示停用原因
                 this.formData2.CARD_STOP_REASON = "";
               }
               this.memberData.MEMBER_CARD_NO = row.MEMBER_CARD_NO || "";
               this.memberData.CUSTOMER_ID = row.CUSTOMER_ID;
               this.formData2.MEMBER_CARD_NO = row.MEMBER_CARD_NO || "";
               this.formData2.MEMBER_CARD_STATUS = getName(getDictGroup(this.$store.state.app.dict,'1049'),row.MEMBER_CARD_STATUS);
               this.cardModal = false;
               this.$emit('transmit');
             }
           })
         }
       });
      },
      changeCard(){
        //发卡换卡....
        // alert(2);
        this.cardModal = true;
        // this.$emit('transmit');
      },
      getCardRecord() {
        //会员卡记录...
        this.axios.request({
          url: '/tenant/customer/tt_member_recharge_record/list_by_customer',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            CUSTOMER_ID_eq: this.tabshow,
          }
        }).then(res => {
          if (res.success === true) {
            this.tableData3 = res.data;
          }
        })
      },
      changePage3(page) {
        this.page3 = page;
        this.getCardRecord();
      },
      changePageSize3(size) {
        this.limit3 = size;
        this.getCardRecord();
      },
      visibleChange() {
        this.$emit('clearsection');
      },
      clearsection() {
        this.objlist = '';
        this.cleartype = Math.random();
      },
      hsubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$Modal.confirm({
              title: '系统提示!',
              content: '<div style="color:red;">确认保存吗？</div>',
              onOk: this.dpost,
            });
          } else {
            this.$Message.error("请校对红框信息");
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
      vehicleEdit() {
        this.row = this.objlist;
        this.vehicleShow = Math.random();
      },
      vehicleLook() {
        this.rows = this.objlist;
        this.hidetype = 2;
        this.showLook = Math.random();
      },
      dpost() {
        var person;
        var that = this;
        this.attachGroup.filter(function (item) {
          if (that.formData.attach == item.USER_ID) {
            person = item.USER_NAME;
          }
        });
        var postData = {
          CUSTOMER_ID: '',
          NAME: this.formData.name,
          MOBILE_PHONE: this.formData.phone,
          ADDRESS: this.formData.address,
          TELPHONE: this.formData.tel,
          LICENSE_NO: this.formData.idcard,
          BIRTHDAY: this.formData.birthday,
          SEX: this.formData.sex,
          CUSTOMER_SOURCE: this.formData.resource == 0 ? '' : this.formData.resource,
          CUSTOMER_LEVEL: this.formData.level == 0 ? '' : this.formData.level,
          CUSTOMER_TYPE: this.formData.type == 0 ? '' : this.formData.type,
          QQ_NO: this.formData.qq,
          WEIXIN_NO: this.formData.wx,
          FOLLOW_PERSON: person,
          EMAIL: this.formData.email,
          TAX_NO: this.formData.snumber,
          REMARK: this.formData.remark,
        }
        if (this.tabshow > 1) {
          postData.CUSTOMER_ID = this.tabshow;
        }
        this.formData.birthday = formatDate(this.formData.birthday);
        this.axios.request({
          url: 'tenant/basedata/ttcustomerfile/save',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            data: JSON.stringify(postData)
          }
        }).then(res => {
          if (res.success === true) {
            if (this.tabshow < 1) {
              this.$Message.success('新增成功');
              this.tabshow = res.data.CUSTOMER_ID;
            } else {
              this.$Message.success('修改成功');
            }
            this.$emit('refresh');
          }
        })
      },
      clear() {
        this.tabshow = 0;
        this.formData = {
          name: '',
          phone: '',
          address: '',
          tel: '',
          idcard: '',
          birthday: '',
          sex: '',
          resource: '',
          level: '',
          type: '',
          qq: '',
          wx: '',
          attach: '',
          email: '',
          snumber: '',
          remark: '',
        }
      },
      vehicleAdd() {
        this.vehicleShow = Math.random();
        var data = {
          MUST_SAFE_CORP: 0,
          BUSINESS_SAFE_CORP: 0,
          VEHICLE_COLOR: 0,
          COME_MILEAGE: 0,
          REPAIR_MILEAGE: 0,
          LAST_REPAIR_MILEAGE: 0,
          NEXT_REPAIR_MILEAGE: 0,
          VEHICLE_ID: 0,
          REGULAR_REPAIR: 0,
          PLATE_NUM: '',
          VIN_NO: '',
          VEHICLE_MODEL: '',
          BUY_DATE: '',
          ENGINE_NO: '',
          LEAVE_FACTORY_DATE: '',
          COME_DATE: '',
          LAST_REPAIR_DATE: '',
          NEXT_REPAIR_DATE: '',
          YEAR_CHECK_DATE: '',
          MUST_SAFE_VALIDITY: '',
          BUSINESS_SAFE_VALIDITY: '',
          REMARK: '',
          TID: '',
          CUSTOMER_ID: '',
          CUSTOMER_CODE: '',
          CUSTOMER_NAME: '',
        }
        this.row = data;
      },
      getList() {
        this.axios.request({
          url: 'tenant/basedata/ttvehiclefile/list',
          method: 'post',
          data: {
            page: this.page,
            limit: this.limit,
            CUSTOMER_ID_eq: this.tabshow,
            access_token: this.$store.state.user.token
          }
        }).then(res => {
          if (res.success === true) {
            this.list = [];
            this.tableData = res.data
            this.total = res.total
            this.clearsection();
          }
        })
      },
      rowClick(row) {
        this.objlist = row;
      },
      refresh() {
        this.getList();
      },
      qh(name) {
        switch (name) {
          case 'm2':
            this.getList();
            break;
          case 'm3':
            this.showTable = Math.random();
            this.getCardRecord();
            break;
        }
      },
    }
  }
</script>

<style scoped lang="less">
  .operate {
    margin-top: 10px;
    padding: 15px;
    border: 1px solid #dcdee2;
    border-radius: 3px;
    width: 100%;
  }

  .search-block {
    display: inline-block;
    width: 200px;
    margin-right: 10px;
  }

  .r-list-search {
    width: 100%;
    padding: 20px 0;
    text-align: center;

  }

  .r-list-choose-parts {
    width: 100%;
    padding: 20px 0;
    text-align: center;
  }

  .r-list-money {
    width: 100%;
    font-size: 18px;
    text-align: center;

    span {
      color: red;

    }
    .r-list-money-reset {
      font-size: 22px;
    }
  }

  .r-list-chekbox {
    width: 100%;
    overflow: hidden;
    font-size: 18px;
    padding: 5px 10px;
    div {
      float: right;
    }
  }

  .table-bottom {
    position: relative;
    height: 52px;
    padding: 100px;
    width: 100%;
    left: 0;
    bottom: 0;
    background-color: white;
    z-index: 4;
  }
  .myModal .ivu-modal-bod{
    height:300px;
  }
</style>
