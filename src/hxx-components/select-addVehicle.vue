<!--选择项目组件 2018-08-23 -->
<template>
  <Modal
    v-model="showOnoff"
    title="新增客户及车辆"
    width="80"
    @on-visible-change="visibleChange"
    :scrollable="true"
    :transfer="true"
    :footer-hide="false"
    :mask-closable="false"
    :transition-names="['', '']"

  >
    <Collapse v-model="collapse">
      <Panel name="1">车辆基本信息
        <Form ref="listSearch" :rules="ruleValidate" :model="listSearch" slot="content" :label-width="120" inline
              class="common-form">
          <FormItem label="车牌号:" prop="PLATE_NUM">
            <Input type="text" v-model="listSearch.PLATE_NUM" placeholder="">
            </Input>
          </FormItem>
          <FormItem label="车辆颜色:">
            <Select v-model="listSearch.VEHICLE_COLOR" placeholder="" placeholder="请选择">
              <Option v-for="(item, index) in initColorArr"
                      :key="index" :value="item.code">{{item.name}}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="发动机号:">
            <Input type="text" v-model="listSearch.ENGINE_NO" placeholder="">
            </Input>
          </FormItem>
          <FormItem label="车架号:" prop="VIN_NO">
            <Input type="text" v-model="listSearch.VIN_NO" placeholder="" @on-blur="changeVinFun">
            </Input>
          </FormItem>
          <FormItem label="出厂日期:">
            <DatePicker v-model="listSearch.LEAVE_FACTORY_DATE" type="date" placeholder=""></DatePicker>
          </FormItem>
          <FormItem label="车型:" style="width: 560px;">
            <!--<Input @on-focus="showVehicleModel=true;" type="text" v-model="listSearch.VEHICLE_MODEL" placeholder=""  search >
            </Input>-->
            <unit-search-input @showTableFun="showTableFun" :searchTableData="searchTableData" :showChange="showChange"
                               @closeSelect="closeSelect" @onRowSelect="onRowSelect"></unit-search-input>
          </FormItem>


        </Form>
      </Panel>
      <Panel name="2">客户基本信息
        <Form slot="content" :label-width="80" inline class="detail-form">

          <FormItem label="客户名称:">
            <Input type="text" v-model="listSearch.NAME" placeholder="">
            </Input>
          </FormItem>
          <FormItem label="移动电话:">
            <Input type="text" v-model="listSearch.MOBILE_PHONE" placeholder="">
            </Input>
          </FormItem>

          <FormItem label="联系地址:">
            <Input type="text" v-model="listSearch.ADDRESS" placeholder="">
            </Input>
          </FormItem>
          <FormItem label="QQ:">
            <Input type="text" v-model="listSearch.QQ_NO" placeholder="">
            </Input>
          </FormItem>
          <FormItem label="微信:">
            <Input type="text" v-model="listSearch.WEIXIN_NO" placeholder="">
            </Input>
          </FormItem>
          <FormItem label="生日:">
            <DatePicker v-model="listSearch.BIRTHDAY" type="date" placeholder=""></DatePicker>
          </FormItem>
        </Form>
      </Panel>

    </Collapse>
    <div slot="footer">
      <Button @click="showOnoff=false;" size="large" type="primary">取消</Button>
      <Button @click="handleSave('listSearch')" size="large" type="primary">保存</Button>
    </div>

    <Modal
      v-model="showVehicleModel"

      :transition-names="['', '']"
      :mask-closable="false"
      title="选择车型"
      width="80"
      :scrollable="true"
      class="table-modal-detail"
      :transfer="true"
      :footer-hide="true"

    >
      <vehicle-model @onRowClick="onRowClick" :show="showVehicleModel"></vehicle-model>
    </Modal>
  </Modal>
</template>

<script>

  import {getName, getDictGroup, getUserInfo, checkVin} from '@/libs/util.js'
  import {formatDate} from '@/libs/tools.js'
  import vehicleModel from '@/hxx-components/vehicle-model.vue'
  import unitSearchInput from '@/hxx-components/unit-search-input.vue'
  export default {
    name: "select-addVehicle",
    props: ['showAddVehicle'],
    components: {vehicleModel, unitSearchInput},
    data() {
      const validatePass = (rule, value, callback) => {
        if (checkVin(value)) {
          callback();
        } else {
          callback(new Error('输入正确的车架号'));
        }
      };
      const validatePass1 = (rule, value, callback) => {
        if (checkVin(value)) {
          callback();
        } else {
          callback(new Error('输入正确的车架号'));
        }
      };
      return {
        showVehicleModel: false,
        showType: false,
        showOnoff: false,
        collapse: ["1", '2'],
        initColorArr: [],
        listSearch: {
          "VEHICLE_ID": "",
          "TID": "",
          "PLATE_NUM": "沪A",
          "VEHICLE_COLOR": "",
          "ENGINE_NO": "",
          "VIN_NO": "",
          "VEHICLE_MODEL": "",
          "LEAVE_FACTORY_DATE": "",
          "CUSTOMER_ID": "",
          "NAME": "",
          "MOBILE_PHONE": "",
          "ADDRESS": "",
          "QQ_NO": "",
          "WEIXIN_NO": "",
          "BIRTHDAY": ""
        },
        initList: {
          "VEHICLE_ID": "",
          "TID": "",
          "PLATE_NUM": "沪A",
          "VEHICLE_COLOR": "",
          "ENGINE_NO": "",
          "VIN_NO": "",
          "VEHICLE_MODEL": "",
          "LEAVE_FACTORY_DATE": "",
          "CUSTOMER_ID": "",
          "NAME": "",
          "MOBILE_PHONE": "",
          "ADDRESS": "",
          "QQ_NO": "",
          "WEIXIN_NO": "",
          "BIRTHDAY": ""
        },
        ruleValidate: {
          PLATE_NUM: [{required: true, message: '车牌号必填', trigger: 'blur'},
            {
              type: 'string',
              // pattern:/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1,2}$/,
              pattern: /^[^(~)|(!)|(！)|(@)|(#)|($)|(￥)|(%)|(^)|(&)|(*)|(/)|(:)|(：)|(;)|(；)|(.)|(。)|(,)|(，)|(?)|(？)|(")|(')|(\\)|({)|(})|(\[)|(\])|(\-)|(_)|(\+)|(=)|(`)|(<)|(>)|(、)|(《)|(》)]+$/,
              message: '请输入正确的车牌号码', trigger: 'change'
            }
          ],
          VIN_NO: [{required: true, message: '车架号必填', trigger: 'blur'},
            {validator: validatePass, trigger: 'change'},
            {validator: validatePass1, trigger: 'blur'}
          ],

        },
        searchTableData: '',
        showChange: null,
      }
    },
    watch: {
      showAddVehicle() {
        console.log("进入选择增加车辆");
        this.$refs['listSearch'].resetFields();
        this.showOnoff = true;
        for (let i in this.listSearch) {
          if (i == 'PLATE_NUM') {
            this.listSearch[i] = getUserInfo(this.$store.state.user.userInfo.params, 'P1003');
          } else {
            this.listSearch[i] = this.initList[i];
          }

        }

      }
    },
    mounted() {
      this.initColorArr = getDictGroup(this.$store.state.app.dict, '1013');

    },
    methods: {
      //保存操作---------
      handleSave(name) {
        console.log('11');
        this.$refs[name].validate((valid) => {
          console.log('22')
          if (valid) {
            this.$Modal.confirm({
              title: "系统提示!",
              content: "确定要保存吗？",
              onOk: this.saveData,

            })
          } else {
            this.$Message.error('请填写必选项...');
          }
        });

      },
      saveData() {
        this.listSearch["LEAVE_FACTORY_DATE"] = formatDate(this.listSearch["LEAVE_FACTORY_DATE"]);
        this.listSearch["BIRTHDAY"] = formatDate(this.listSearch["BIRTHDAY"]);
        this.axios.request({
          url: '/tenant/basedata/ttvehiclefile/save_vehicle_customer',
          method: 'post',
          data: {
            data: JSON.stringify(this.listSearch),
            access_token: this.$store.state.user.token
          }
        }).then(res => {
          if (res.success === true) {
            // this.$Message.info('successful')
            this.showOnoff = false;
            this.$emit('selectAddVehicleFun');

          } else {
            this.$Message.info(res.title);
          }
        })
      },
      //
      getVehicleModel() {
        this.axios.request({
          url: '/tenant/basedata/ttvehiclefile/get_vehicle_model',
          method: 'post',
          data: {
            vin: this.listSearch.VIN_NO,
            access_token: this.$store.state.user.token
          }
        }).then(res => {
          if (res.success === true) {
            this.listSearch.VEHICLE_MODEL = res.data.MODEL_NAME;
            this.listSearch.TID = res.data.TID;
            this.searchTableData = res.data.MODEL_NAME;
            this.showChange = Math.random();
          }
        })
      },
      onRowClick(val) {
        this.showVehicleModel = false
        this.listSearch.VEHICLE_MODEL = val.MODEL_NAME
        this.listSearch.TID = val.TID
        this.searchTableData = val.MODEL_NAME;
        this.showChange = Math.random();
      },
      //弹出层状态变化--------
      visibleChange(status) {
        if (status === false) {
          this.$emit('closeDetail');
          this.handleReset("listSearch");
          this.searchTableData = null;
          this.showChange = Math.random();
        }
      },
      //校验重置
      handleReset(name) {
        this.$refs[name].resetFields();
      },
      showTableFun() {
        this.showVehicleModel = true;
      },
      closeSelect() {
        this.listSearch.VEHICLE_MODEL = ""
        this.listSearch.TID = ""
        this.searchTableData = "";
      },
      onRowSelect(val) {

        this.listSearch.VEHICLE_MODEL = val.MODEL_NAME
        this.listSearch.TID = val.TID

      },
      changeVinFun(event) {
        if (!checkVin(event.target.value)) {

        } else {
          this.getVehicleModel();
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .search-block {
    display: inline-block;
    width: 200px;
    margin-right: 10px;
  }

</style>
