<template>
  <Modal
    :transition-names="['', '']"
    v-model="showModal"
    @on-visible-change="visibleChange"
    title="车辆档案详情"
    width="100"
    class="table-modal-detail full-height"
    :scrollable="true"
    :transfer="false"
    :mask-closable="false"
    :footer-hide="false"
  >
    <modal-title slot="header" title="车辆档案详情" :state="''" @clickBack="showModal=false"></modal-title>
    <!-- @on-click="qh" v-model="indexName" -->
    <Tabs @on-click="qh" v-model="indexName" class="modal-tabs" style="overflow: hidden">
      <!-- 基本信息 -->
      <TabPane label="基本信息" name="m1" icon="logo-apple">
        <Form :label-width="120" :model="formData" ref="formData" :rules="ruleValidate" class="common-form">
          <!-- 调整字段个数和位置 -->
          <div style="height:10px;"></div>
          <FormItem label="车牌号:"  prop="PLATE_NUM">
            <Input type="text" v-model="formData.PLATE_NUM" style="min-width: 100%;"> </Input>
          </FormItem>
          <FormItem label="客户编号:"  prop="CUSTOMER_CODE">
            <Input type="text" v-model="formData.CUSTOMER_CODE" :readonly="true" icon="ios-search"
                   @on-click="customerChange" style="min-width: 100%;"> </Input>
          </FormItem>
          <FormItem label="客户名称:"  prop="CUSTOMER_NAME">
            <Input type="text" v-model="formData.CUSTOMER_NAME" :disabled="true" style="min-width: 100%;"> </Input>
          </FormItem>
          <FormItem label="车架号:"  prop="VIN_NO">
            <Input type="text" v-model="formData.VIN_NO" style="min-width: 100%;"> </Input>
          </FormItem>
          <FormItem label="车型:" prop="VEHICLE_MODEL" style="width: 570px">
            <Input type="text" style="min-width: 100%;" v-model="formData.VEHICLE_MODEL" @on-focus="selectVehicle"
                   :readonly="true" @on-click="selectVehicle" icon="ios-search"> </Input>
          </FormItem>
          <!-- 调整字段个数和位置 -->
          <!-- 1 -->
          <FormItem label="车辆颜色:" >
            <Select placeholder="" v-model="formData.VEHICLE_COLOR" style="min-width: 100%;">
              <Option v-for="(item, index) in color"
                      :key="index" :value="item.code">{{item.name}}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="发动机号:" >
            <Input type="text" v-model="formData.ENGINE_NO" style="min-width: 100%;"> </Input>
          </FormItem>
          <FormItem label="出厂日期:" >
            <Col span="11" style="width:100%;">
              <DatePicker type="date" v-model="formData.LEAVE_FACTORY_DATE" placeholder="" format="yyyy-MM-dd"
                          style="min-width: 100%;"></DatePicker>
            </Col>
          </FormItem>
          <!-- 2 -->
          <FormItem label="购买日期" >
            <Col span="11" style="width:100%;">
              <DatePicker type="date" v-model="formData.BUY_DATE" placeholder="" format="yyyy-MM-dd"
                          style="min-width: 100%;"></DatePicker>
            </Col>
          </FormItem>
          <FormItem label="最近来厂日期:"  prop="phone">
            <Col span="11" style="width:100%;">
              <DatePicker type="date" v-model="formData.COME_DATE" placeholder="" format="yyyy-MM-dd"
                          style="min-width: 100%;"></DatePicker>
            </Col>
          </FormItem>
          <FormItem label="最近来厂里程:" >
            <InputNumber
              style="width:100%;"
              :min="0"
              v-model="formData.COME_MILEAGE"
              :formatter="value => `${value}公里`"
              :parser="value => value.replace('公里', '')"></InputNumber>
          </FormItem>
          <!--<div style="clear:both;"></div>-->
          <!-- 3 -->
          <FormItem label="定保里程:" >
            <InputNumber
              style="width:100%;line-height:34px;"
              :min="0"
              v-model="formData.REPAIR_MILEAGE"
              :formatter="value => `${value}公里`"
              :parser="value => value.replace('公里', '')"></InputNumber>
          </FormItem>
          <FormItem label="定保周期:"  prop="phone">
            <InputNumber
              style="width:100%;line-height:34px;"
              :min="0"
              v-model="formData.REGULAR_REPAIR"
              :formatter="value => `${value}月`"
              :parser="value => value.replace('月', '')"></InputNumber>
          </FormItem>
          <FormItem label="最近保养日期:" >
            <Col span="11" style="width:100%;">
              <DatePicker type="date" v-model="formData.LAST_REPAIR_DATE" placeholder="" format="yyyy-MM-dd"
                          style="min-width: 100%;"></DatePicker>
            </Col>
          </FormItem>
          <!-- 4 -->
          <FormItem label="最近保养里程:" >
            <InputNumber
              style="width:100%;"
              :min="0"
              v-model="formData.LAST_REPAIR_MILEAGE"
              :formatter="value => `${value}公里`"
              :parser="value => value.replace('公里', '')"></InputNumber>
          </FormItem>
          <FormItem label="下次保养日期:"  prop="phone">
            <Col span="11" style="width:100%;">
              <DatePicker type="date" v-model="formData.NEXT_REPAIR_DATE" placeholder="" format="yyyy-MM-dd"
                          style="min-width: 100%;"></DatePicker>
            </Col>
          </FormItem>
          <FormItem label="下次保养里程:" >
            <InputNumber
              style="width:100%;"
              :min="0"
              v-model="formData.NEXT_REPAIR_MILEAGE"
              :formatter="value => `${value}公里`"
              :parser="value => value.replace('公里', '')"></InputNumber>
          </FormItem>
          <!-- 5 -->
          <FormItem label="年检日期:" >
            <Col span="11" style="width:100%;">
              <DatePicker type="date" v-model="formData.YEAR_CHECK_DATE" placeholder="" format="yyyy-MM-dd"
                          style="min-width: 100%;"></DatePicker>
            </Col>
          </FormItem>
          <FormItem label="交强险到期日:" v-show="xhide"  prop="phone">
            <Col span="11" style="width:100%;">
              <DatePicker type="date" placeholder="" v-model="formData.MUST_SAFE_VALIDITY" format="yyyy-MM-dd"
                          style="min-width: 100%;"></DatePicker>
            </Col>
          </FormItem>
          <FormItem label="商业险到期日:" v-show="xhide"  >
            <Col span="11" style="width:100%;">
              <DatePicker type="date" v-model="formData.BUSINESS_SAFE_VALIDITY" placeholder="" format="yyyy-MM-dd"
                          style="min-width: 100%;"></DatePicker>
            </Col>
          </FormItem>
          <!-- 6 -->
          <FormItem label="交强险保险公司:" v-show="xhide"  >
            <Select placeholder="" v-model="formData.MUST_SAFE_CORP" style="min-width: 100%;">
              <Option v-for="(item, index) in must"
                      :key="index" :value="item.INSURER_ID">{{item.CORP_NAME}}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="商业险保险公司:" v-show="xhide"  >
            <Select placeholder="" v-model="formData.BUSINESS_SAFE_CORP" style="min-width: 100%;">
              <Option v-for="(item, index) in business"
                      :key="index" :value="item.INSURER_ID">{{item.CORP_NAME}}
              </Option>
            </Select>
          </FormItem>
        </Form>
        <Form ref="formInline" :label-width="120">
          <FormItem label="备注:">
            <Input type="textarea" v-model="formData.REMARK" placeholder="请输入备注信息"> </Input>
          </FormItem>
        </Form>
      </TabPane>
      <!-- 维修记录 -->
      <TabPane label="维修记录" name="m2" :disabled="formData.VEHICLE_ID < 1" icon="logo-windows">
        <common-table :columns="columns" @changePageSize="changePageSize" @changePage="changePage" :total="total"
                      :showOperate="false" @onRowClick="getobj" :showSearch="false" :clearSelect="cleartype"
                      @clearsection="clearsection" v-model="tableData" :page="page" :show="show">
        </common-table>
      </TabPane>
      <!-- 维修记录 -->
      <!-- 保养规则 -->

      <TabPane label="保养规则" name="m3" :disabled="formData.VEHICLE_ID < 1" icon="logo-tux">
      </TabPane>
      <!-- 保养规则 -->
    </Tabs>
    <div slot="footer">
      <Button @click="showModal = false">取消</Button>
      <Button v-if="hidetype === 1" v-show="indexName == 'm1'" type="primary" style="margin-left: 8px"
              @click="submit('formData')">保存
      </Button>
      <Button type="info" v-show="indexName == 'm2'" style="margin-left: 8px" :disabled="cando" @click="vehicleLook">
        查看
      </Button>
    </div>
    <select-customer @select="select" :showoff="showoff"></select-customer>
    <Modal
      :transition-names="['', '']"
      v-model="vehicleShow"
      width="90"
      :scrollable="true"
      :transfer="false"
      :footer-hide="true"
    >
      <vehicle-model :show="vehicleShow" @onRowClick="onRowClick"></vehicle-model>
      <service-record :showDetail="serviceShow" @clearsection="clearsection" :detailData="detailData"></service-record>
    </Modal>
  </Modal>
</template>
<script>
  import {getName, getDictGroup, getCreate,getUserInfo} from '@/libs/util.js'
  import selectCustomer from '@/hxx-components/select-customer.vue'
  import commonTable from '@/hxx-components/common-table.vue'
  import vehicleModel from '@/hxx-components/vehicle-model.vue'
  import serviceRecord from '@/hxx-components/service-record.vue'
  import ModalTitle from '@/hxx-components/modal-title.vue'
  export default {
    name: 'cart-modal',
    components: {selectCustomer, commonTable, vehicleModel, serviceRecord,ModalTitle},
    computed: {
      cando() {
        var flag = this.obj == '' ? true : false;
        return flag;
      }
    },
    data() {
      const validatePass = (rule, value, callback) => {
        var p1 = /\d?[A-Z]+\d?/
        if (!p1.test(value) || value.length !== 17) {
          callback(new Error('输入正确的车架号'));
        } else {
          callback();
        }
      };
      const servicePass = (rule, value, callback) => {
        var p1 = /\d?[A-Z]+\d?/
        if (p1.test(value) && value.length == 17) {
          this.checkCart(value);
          callback();
        } else {
          callback(new Error('请输入正确的车架号'));
        }
      }
      return {
        cleartype: false,
        obj: '',//单选内容存储
        serviceShow: false,
        detailData: [],
        xhide:false,
        store: [],
        tableData: [],
        vehicleShow: false,//选车型
        indexName: 'm1',
        total: 0,
        limit: 25,
        page: 1,
        showModal: false,
        showoff: false,
        formData: {
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
          VEHICLE_ID: '',
        },
        ruleValidate: {
          PLATE_NUM: [{required: true, message: '车牌号必填', trigger: 'blur'},
            {
              type: 'string',
              pattern: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1,2}$/,
              message: '请输入正确的车牌号码',
              trigger: 'change,blur'
            }
          ],
          VIN_NO: [{required: true, message: '车架号必填', trigger: 'blur,change'},
            {validator: validatePass, trigger: 'change'},
            {validator: servicePass, trigger: 'blur'}
          ],
          VEHICLE_MODEL: [{required: true, message: '请点击选取车型', trigger: 'blur'}],
          CUSTOMER_CODE: [{required: true, message: '请点击搜索图标选取客户', trigger: 'blur'}],
          CUSTOMER_NAME: [{required: true, message: '客户名称必选', trigger: 'blur'}],
        },
        must: [],
        business: [],
        store: [],
        color: [],
        columns: [
          // {type: 'selection', width: 50, fixed: 'left'},
          {
            title: '序号', width: 70,align:'center',
            render: (h, params) => h('span', (this.page - 1) * this.limit + params.index + 1)
          },
          {title: '进厂日期', key: 'COME_DATE', sortable: true, minWidth: 120},
          {
            title: '维修类型', key: 'REPAIR_TYPE', sortable: true, minWidth: 120,align:'center',
            render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.REPAIR_TYPE))
          },
          {title: '故障描述', key: 'FAULT_DESC', sortable: true, minWidth: 120},
          {
            title: '应收金额', key: 'SUM_MONEY', sortable: true, minWidth: 120,align:'right',
            render: (h, params) => h('span', this.formatMoney(params.row.SUM_MONEY))
          },
          {
            title: '主修人', key: 'REPAIR_PERSON', sortable: true, minWidth: 100
          },
          {
            title: '状态', key: 'STATUS', sortable: true, minWidth: 100,align:'center',
            render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.STATUS))
          },
          {
            title: '服务顾问', key: 'FOLLOW_PERSON', sortable: true, minWidth: 120
          },
        ],
      }
    },
    props: ['show', 'row', 'info', 'hidetype'],
    watch: {
      show() {
        // console.log(JSON.stringify(this.$store.state.user.userInfo.params));
        this.$refs['formData'].resetFields();
        this.showModal = true;
        //切换到第一个标签
        this.indexName = 'm1';
        //清空选择
        this.obj = [];
        //不重复调用接口
        if (this.must.length === 0) this.getInsure();
      }, store() {
        //保险组增加个请选择。用0代表空
        this.must.push({'INSURER_ID': 0, 'CORP_NAME': '请选择'});
        for (var i in this.store) {
          this.must.push(this.store[i]);
        }
        this.business = this.must;
      },
      info() {
        //修改初始赋值
        var obj = this.info;
        this.formData = obj;
        let params = getUserInfo(this.$store.state.user.userInfo.params,"P1003");
        this.formData.PLATE_NUM = this.formData.PLATE_NUM || params;
        this.formData.VEHICLE_COLOR = parseInt(obj.VEHICLE_COLOR) == 0 ? 0 : obj.VEHICLE_COLOR;
        this.formData.COME_MILEAGE = obj.COME_MILEAGE ? parseFloat(obj.COME_MILEAGE) : 0;
        this.formData.REPAIR_MILEAGE = obj.REPAIR_MILEAGE ? parseFloat(obj.REPAIR_MILEAGE) : 0;
        this.formData.LAST_REPAIR_MILEAGE = obj.LAST_REPAIR_MILEAGE ? parseFloat(obj.LAST_REPAIR_MILEAGE) : 0;
        this.formData.NEXT_REPAIR_MILEAGE = obj.NEXT_REPAIR_MILEAGE ? parseFloat(obj.NEXT_REPAIR_MILEAGE) : 0;
        this.formData.REGULAR_REPAIR = obj.REGULAR_REPAIR ? parseFloat(obj.REGULAR_REPAIR) : 0;
      },
    },
    methods: {
      checkCart(val) {
        //能否根据车架号获取到车型...
        if(this.formData.VEHICLE_MODEL != ""){
          return false;
        }
        this.axios.request({
          url: '/tenant/basedata/ttvehiclefile/get_vehicle_model',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            vin: val,
          }
        }).then(res => {
          if (res.success === true) {
          this.formData.VEHICLE_MODEL = res.data.MODEL_NAME;
          this.formData.TID = res.data.TID;
          // console.log("车型:"+this.formData.VEHICLE_MODEL + "车型ID:" + this.formData.TID);
          } else {
            this.$Modal.info({title: '系统提示', content: res.title + "<span style='color:red;'>请手动选取车型</span>"});
          }
        })
      },
      visibleChange() {
        this.$emit('clearsection');
      },
      clearsection() {
        this.obj = '';
        this.cleartype = Math.random();
      },
      getInsure() {
        //获取保险下拉列表。交强商业居然是一样的
        this.axios.request({
          url: 'tenant/repair/tt_guarantee_slip/get_insurer_list',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            limit: 25,
            page: 1
          }
        }).then(res => {
          if (res.success === true) {
            this.store = res.data;
          }
        })
      },
      submit(name) {
        //数据提交提示
        this.$refs[name].validate((valid) => {
          if (valid) {
            console.log(this.formData);
            this.$Modal.confirm({
              title: '系统提示',
              content: '确认保存吗?',
              onOk: this.vehicleAdd,
            });
          } else {
            this.$Message.error("请校对红框信息");
          }
        })
      },
      qh(name) {
        switch (name) {
          case 'm2':
            //查询维修记录
            this.getList();
            break;
          case 'm3':
            break;
        }
      },
      vehicleAdd() {
        //开始提交数据
        // alert(this.formData.REGULAR_REPAIR);
        this.axios.request({
          url: 'tenant/basedata/ttvehiclefile/save',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            data: JSON.stringify(this.formData)
          }
        }).then(res => {
          if (res.success === true) {
            if (this.formData.VEHICLE_ID < 1) {
              this.$Message.success('新增成功');
              this.formData.VEHICLE_ID = res.data.VEHICLE_ID;
            } else {
              this.$Message.success('修改成功');
            }
            this.$emit('refresh');
          }
        })
      },
      onRowClick(row) {
        //车型名字...
        this.formData.VEHICLE_MODEL = row.MODEL_NAME;
        //车型id...
        this.formData.TID = row.TID;
        this.vehicleShow = false;
      },
      vehicleLook() {
        //查看数据使用
        // if(this.obj.length === 0){
        //  this.$Message.info('请选取数据');
        //  return;
        // }
        // console.log(this.obj[0]);
        //    this.detailData = this.obj[0];
        this.detailData = this.obj;
        this.serviceShow = Math.random();
      },
      getobj(row) {
        //存单选数据
        // this.obj = [];
        // this.obj.push(row);
        this.obj = row;
      },
      getList() {
        this.axios.request({
          url: 'tenant/repair/ttrepairworkorder/list',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            page: this.page,
            limit: this.limit,
            VEHICLE_ID_eq: this.formData.VEHICLE_ID
          }
        }).then(res => {
          if (res.success === true) {
            this.total = res.total;
            this.tableData = res.data;
          }
        })
      }, changePageSize(size) {
        this.limit = size;
        this.getList();
      },
      changePage(page) {
        this.page = page;
        this.getList();
      },
      customerChange() {
        //控制选择客户界面显示
        this.showoff = Math.random();
      }, select(row) {
        //将选择数据赋值到...
        this.formData.CUSTOMER_ID = row.CUSTOMER_ID;
        this.formData.CUSTOMER_CODE = row.CODE;
        this.formData.CUSTOMER_NAME = row.NAME;
      },
      selectVehicle() {
        this.vehicleShow = true;
      }
      ,
      resotre() {
        //数据重置
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
          VEHICLE_ID: '',
        };
        this.formData = data;
      },
    },
    mounted() {
      //颜色下拉处理
      var color = getDictGroup(this.$store.state.app.dict, '1013');
      this.color.push({
        "code": 0,
        "order": 0,
        "group": "1013",
        "name": "请选择"
      });
      for (var i in color) {
        this.color.push(color[i]);
      }
    }
  }
</script>
