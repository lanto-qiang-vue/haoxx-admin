
<!--选择项目组件 2018-08-23 -->
<template>
    <Modal
        v-model="showOnoff"
        title="新增客户及车辆"
        width="90"
        @on-visible-change="visibleChange"
        :scrollable="true"
        :transfer= "false"
        :footer-hide="false"
        :mask-closable="false"
        :transition-names="['', '']"
        
    >
    <Collapse v-model="collapse">
      <Panel name="1">车辆基本信息
       <Form ref="listSearch" :rules="ruleValidate"  :model="listSearch" slot="content" :label-width="100" inline class="detail-form">
          <FormItem label="车牌号:" prop="PLATE_NUM">
              <Input type="text" v-model="listSearch.PLATE_NUM" placeholder="" style="min-width: 250px;" >
              </Input>
          </FormItem>
          <FormItem label="车辆颜色:">
              <Select v-model="listSearch.VEHICLE_COLOR" placeholder="" style="min-width: 250px;" placeholder="请选择">
                <Option v-for="(item, index) in initColorArr"
                  :key="index" :value="item.code">{{item.name}}</Option>
              </Select>
          </FormItem>
          <FormItem label="发动机号:">
              <Input type="text" v-model="listSearch.ENGINE_NO" placeholder="" style="min-width: 250px;" >
              </Input>
          </FormItem>
          <FormItem label="车架号:" prop="VIN_NO">
               <Input type="text" v-model="listSearch.VIN_NO" placeholder="" style="min-width: 250px;">
              </Input>
          </FormItem>
          <FormItem label="车型:">
              <Input @on-focus="showVehicleModel=true;" type="text" v-model="listSearch.VEHICLE_MODEL" placeholder="" style="min-width: 250px;" search >
              </Input>
          </FormItem>
          <FormItem label="出厂日期:" >
              <DatePicker v-model="listSearch.LEAVE_FACTORY_DATE" type="date" placeholder=""></DatePicker>
          </FormItem>

       </Form>
      </Panel>
      <Panel name="2">客户基本信息
       <Form slot="content" :label-width="80" inline class="detail-form">

           <FormItem label="客户名称:" >
               <Input type="text" v-model="listSearch.NAME" placeholder="" style="min-width: 250px;" >
              </Input>
          </FormItem>
          <FormItem label="移动电话:">
               <Input type="text" v-model="listSearch.MOBILE_PHONE" placeholder="" style="min-width: 250px;" >
              </Input>
          </FormItem>

          <FormItem label="联系地址:">
               <Input type="text" v-model="listSearch.ADDRESS" placeholder="" style="min-width: 250px;" >
              </Input>
          </FormItem>
          <FormItem label="QQ:">
               <Input type="text" v-model="listSearch.QQ_NO" placeholder="" style="min-width: 250px;" >
              </Input>
          </FormItem>
          <FormItem label="微信:" >
               <Input type="text" v-model="listSearch.WEIXIN_NO" placeholder="" style="min-width: 250px;" >
              </Input>
          </FormItem>
          <FormItem label="生日:" >
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
            title="选择车型"
            width="90"
            :scrollable="false"
            :transfer= "false"
            :footer-hide="false"
            :mask-closable="false"
            :transition-names="['', '']"
            
        >
            <vehicle-model @onRowClick="onRowClick" :show="showVehicleModel"></vehicle-model>
        </Modal>
  </Modal>
</template>

<script>

  import { getName, getDictGroup } from '@/libs/util.js'
  import { formatDate } from '@/libs/tools.js'
  import vehicleModel from '@/hxx-components/vehicle-model.vue'
	export default {
		name: "select-addVehicle",
        props:['showAddVehicle'],
        components: {vehicleModel},
        data(){
            const validatePass = (rule, value, callback) => {
			     	var p1 = /\d?[A-Z]+\d?/
                if (!p1.test(value) || value.length !== 17) {
                    callback(new Error('大写字母和数字组成,长度不超过17位'));
                }else{
                        
                	  callback();
                }
            };
            const validatePass1 = (rule, value, callback) => {
			     	var p1 = /\d?[A-Z]+\d?/
                if (!p1.test(value) || value.length !== 17) {
                    callback(new Error('大写字母和数字组成,长度不超过17位1'));
                }else{
                      this.getVehicleModel();
                	  callback();
                }
            };
            return{
                showVehicleModel:false,
                showType:false,
                showOnoff:false,
                collapse:["1",'2'],
                initColorArr:[],
                listSearch:{
                    "VEHICLE_ID":"",
                    "TID":"",
                    "PLATE_NUM":"",
                    "VEHICLE_COLOR":"",
                    "ENGINE_NO":"",
                    "VIN_NO":"",
                    "VEHICLE_MODEL":"",
                    "LEAVE_FACTORY_DATE":"",
                    "CUSTOMER_ID":"",
                    "NAME":"",
                    "MOBILE_PHONE":"",
                    "ADDRESS":"",
                    "QQ_NO":"",
                    "WEIXIN_NO":"",
                    "BIRTHDAY":""
                },
                initList:{
                    "VEHICLE_ID":"",
                    "TID":"",
                    "PLATE_NUM":"",
                    "VEHICLE_COLOR":"",
                    "ENGINE_NO":"",
                    "VIN_NO":"",
                    "VEHICLE_MODEL":"",
                    "LEAVE_FACTORY_DATE":"",
                    "CUSTOMER_ID":"",
                    "NAME":"",
                    "MOBILE_PHONE":"",
                    "ADDRESS":"",
                    "QQ_NO":"",
                    "WEIXIN_NO":"",
                    "BIRTHDAY":""
                },
                ruleValidate:{
					 PLATE_NUM:[{required: true, message: '车牌号必填', trigger: 'blur' },
					 { type:'string',pattern:/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{2}$/, message:'请输入正确的车牌号码', trigger:'change'}
					 ],
					 VIN_NO:[{required: true, message: '车架号必填', trigger: 'blur' },
					 	{ validator: validatePass, trigger: 'change' },
					 	{ validator: validatePass1, trigger: 'blur' }
					 ],

				},
            }
        },
        watch:{
            showAddVehicle(){
                console.log("进入选择增加车辆");
                this.$refs['listSearch'].resetFields();
                this.showOnoff=true;
                for(let i in this.listSearch){
                    this.listSearch[i]=this.initList[i];
                }

            }
        },
        mounted() {
            this.initColorArr=getDictGroup(this.$store.state.app.dict, '1013');

        },
        methods:{
            //保存操作---------
            handleSave(name){
                console.log('11');
                this.$refs[name].validate((valid) => {
                    console.log('22')
                    if (valid) {
                        this.$Modal.confirm({
                            title:"系统提示!",
                            content:"确定要保存吗？",
                            onOk:this.saveData,
                            
                        })
                    } else {
                        this.$Message.error('请填写必选项...');
                    }
                });
 
            },
            saveData(){
                this.listSearch["LEAVE_FACTORY_DATE"]=formatDate(this.listSearch["LEAVE_FACTORY_DATE"]);
                this.listSearch["BIRTHDAY"]=formatDate(this.listSearch["BIRTHDAY"]);
                this.axios.request({
                    url: '/tenant/basedata/ttvehiclefile/save_vehicle_customer',
                    method: 'post',
                    data: {
                    data: JSON.stringify(this.listSearch),
                    access_token: this.$store.state.user.token
                    }
                }).then(res => {
                    if (res.success === true) {
                        this.$Message.info('successful')
                        this.showOnoff=false;
                        this.$emit('selectAddVehicleFun');
                        
                    }else{
                        this.$Message.info(res.title);
                    }
                })
            },
            //
            getVehicleModel(){
                this.axios.request({
                    url: '/tenant/basedata/ttvehiclefile/get_vehicle_model',
                    method: 'post',
                    data: {
                    vin: this.listSearch.VIN_NO,
                    access_token: this.$store.state.user.token
                    }
                }).then(res => {
                    if (res.success === true) {
                        this.listSearch.VEHICLE_MODEL= res.data.MODEL_NAME;
                        this.listSearch.TID= res.data.TID;
                    }
                })
            },
            onRowClick(val){
                this.showVehicleModel=false
                this.listSearch.VEHICLE_MODEL= val.MODEL_NAME
                this.listSearch.TID= val.TID
            },
            //弹出层状态变化--------
            visibleChange(status){
                if(status === false){
                    this.$emit('closeDetail');
                    this.handleReset("listSearch");
                }
            },
            //校验重置
            handleReset (name) {
                this.$refs[name].resetFields();
            },
        }
	}
</script>

<style lang="less" scoped>
    .search-block{
        display: inline-block;
        width: 200px;
        margin-right: 10px;
    }
    .common-table{
        padding: 10px;
        background-color: white;
        height: 100%;
        overflow: hidden;
        position: relative;
        .table-search{
        }
        .operate{
            margin-top: 10px;
            padding: 15px;
            border: 1px solid #dcdee2;
            border-radius: 3px;
        }
        .main-table{
            margin-top: 10px;
        }
        .table-bottom{
            position: absolute;
            height: 52px;
            padding: 10px;
            width: 100%;
            left: 0;
            bottom: 0;
            background-color: white;
            z-index: 4;
        }
    }
</style>
