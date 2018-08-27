<template>
	  <Modal
    :transition-names="['', '']"
    v-model="showModal"
    width="90"
    :scrollable="true"
    :transfer= "false"
    :footer-hide="true"
  >
	<!-- @on-click="qh" v-model="indexName" -->
	    <Tabs style="height:auto;">

        <!-- 基本信息 -->
        <TabPane label="基本信息" name="m1" icon="logo-apple">
  		    <Form :label-width="120" :model="formData" ref="formData" :rules="ruleValidate" inline>
      <!-- 调整字段个数和位置 -->
             <FormItem style="margin-left:-80px;width:100%;">
              <div class="operate">
                            <Button @click="showModal = false">返回</Button>
            <Button type="primary" style="margin-left: 8px" @click="submit('formData')">保存</Button>
               </div>
          </FormItem>
    	    <FormItem label="车牌号:" style="width:30%;"  prop="PLATE_NUM">
              <Input type="text" v-model="formData.PLATE_NUM"  style="min-width: 100%;"> </Input>
          </FormItem>
          <FormItem label="客户编号:" style="width:30%;"  prop="CUSTOMER_CODE">
              <Input type="text" v-model="formData.CUSTOMER_CODE" :readonly="true" icon="ios-search" @on-click="customerChange"  style="min-width: 100%;"> </Input>
          </FormItem>
           <FormItem label="客户名称:" style="width:30%;"  prop="CUSTOMER_NAME">
              <Input type="text" v-model="formData.CUSTOMER_NAME" :disabled="true"  style="min-width: 100%;"> </Input>
          </FormItem>
         <FormItem label="车架号:" style="width:30%;" prop="VIN_NO" >
              <Input type="text" v-model="formData.VIN_NO" style="min-width: 100%;"> </Input>
          </FormItem>
            <FormItem label="车型:" style="width:60%;" prop="VEHICLE_MODEL">
              <Input type="text"  style="min-width: 100%;" v-model="formData.VEHICLE_MODEL" :disabled="true" @on-click="vehicleChange" icon="ios-search"> </Input>
          </FormItem>
      <!-- 调整字段个数和位置 -->
          <!-- 1 -->
              <FormItem label="车辆颜色:" style="width:30%;" >
                  <Select  placeholder="" v-model="formData.VEHICLE_COLOR" style="min-width: 100%;">
                <Option v-for="(item, index) in color"
                  :key="index" :value="item.code">{{item.name}}</Option>
                </Select>
          </FormItem>
          <FormItem label="发动机号:" style="width:30%;">
              <Input type="text" v-model="formData.ENGINE_NO"  style="min-width: 100%;"> </Input>
          </FormItem>
          <FormItem label="出厂日期:" style="width:30%;">
               <Col span="11" style="width:100%;">
               <DatePicker type="date" v-model="formData.LEAVE_FACTORY_DATE" placeholder=""  format="yyyy-MM-dd" style="min-width: 100%;"></DatePicker>
               </Col>
          </FormItem>
          <!-- 2 -->
                        <FormItem label="购买日期" style="width:30%;" >
                            <Col span="11" style="width:100%;">
               <DatePicker type="date" v-model="formData.BUY_DATE" placeholder=""  format="yyyy-MM-dd" style="min-width: 100%;"></DatePicker>
               </Col>
          </FormItem>
          <FormItem label="最近来厂日期:" style="width:30%;" prop="phone">
                             <Col span="11" style="width:100%;">
               <DatePicker type="date" v-model="formData.COME_DATE" placeholder=""  format="yyyy-MM-dd" style="min-width: 100%;"></DatePicker>
               </Col>
          </FormItem>
          <FormItem label="最近来厂里程:" style="width:30%;">
            <InputNumber
            style="width:100%;"
            :min="0"
            v-model="formData.COME_MILEAGE"
            :formatter="value => `${value}公里`"
            :parser="value => value.replace('公里', '')"></InputNumber>
          </FormItem>
          <div style="clear:both;"></div>
          <!-- 3 -->
                        <FormItem label="定保里程:" style="width:30%;" >
                    <InputNumber
            style="width:100%;line-height:34px;"
            :min="0"
            v-model="formData.REPAIR_MILEAGE"
            :formatter="value => `${value}公里`"
            :parser="value => value.replace('公里', '')"></InputNumber>
          </FormItem>
          <FormItem label="定保周期:" style="width:30%;" prop="phone">
                    <InputNumber
            style="width:100%;line-height:34px;"
            :min="0"
            v-model="formData.REGULAR_REPAIR"
            :formatter="value => `${value}月`"
            :parser="value => value.replace('月', '')"></InputNumber>
          </FormItem>
          <FormItem label="最近保养日期:" style="width:30%;">
                             <Col span="11" style="width:100%;">
               <DatePicker type="date" v-model="formData.LAST_REPAIR_DATE" placeholder=""  format="yyyy-MM-dd" style="min-width: 100%;"></DatePicker>
               </Col>
          </FormItem>
          <!-- 4 -->
                        <FormItem label="最近保养里程:" style="width:30%;" >
                            <InputNumber
            style="width:100%;"
            :min="0"
            v-model="formData.LAST_REPAIR_MILEAGE"
            :formatter="value => `${value}公里`"
            :parser="value => value.replace('公里', '')"></InputNumber>
          </FormItem>
          <FormItem label="下次保养日期:" style="width:30%;" prop="phone">
                             <Col span="11" style="width:100%;">
               <DatePicker type="date" v-model="formData.NEXT_REPAIR_DATE" placeholder=""  format="yyyy-MM-dd" style="min-width: 100%;"></DatePicker>
               </Col>
          </FormItem>
          <FormItem label="下次保养里程:" style="width:30%;">
                                         <InputNumber
            style="width:100%;"
            :min="0"
            v-model="formData.NEXT_REPAIR_MILEAGE"
            :formatter="value => `${value}公里`"
            :parser="value => value.replace('公里', '')"></InputNumber>
          </FormItem>
          <!-- 5 -->
                        <FormItem label="年检日期:" style="width:30%;" >
                            <Col span="11" style="width:100%;">
               <DatePicker type="date" v-model="formData.YEAR_CHECK_DATE" placeholder=""  format="yyyy-MM-dd" style="min-width: 100%;"></DatePicker>
               </Col>
          </FormItem>
          <FormItem label="交强险到期日:" style="width:30%;" prop="phone">
                             <Col span="11" style="width:100%;">
               <DatePicker type="date" placeholder="" v-model="formData.MUST_SAFE_VALIDITY"  format="yyyy-MM-dd" style="min-width: 100%;"></DatePicker>
               </Col>
          </FormItem>
          <FormItem label="商业险到期日:" style="width:30%;">
                             <Col span="11" style="width:100%;">
               <DatePicker type="date" v-model="formData.BUSINESS_SAFE_VALIDITY" placeholder=""  format="yyyy-MM-dd" style="min-width: 100%;"></DatePicker>
               </Col>
          </FormItem>
          <!-- 6 -->
                        <FormItem label="交强险保险公司:" style="width:30%;" >
                 <Select  placeholder="" v-model="formData.MUST_SAFE_CORP" style="min-width: 100%;">
                <Option v-for="(item, index) in must"
                  :key="index" :value="item.INSURER_ID">{{item.CORP_NAME}}</Option>
                </Select>
          </FormItem>
          <FormItem label="商业险保险公司:" style="width:30%;">
                 <Select  placeholder="" v-model="formData.BUSINESS_SAFE_CORP" style="min-width: 100%;">
                <Option v-for="(item, index) in business"
                  :key="index" :value="item.INSURER_ID">{{item.CORP_NAME}}</Option>
                </Select>
          </FormItem>
    </Form>
    	          <Form ref="formInline" :label-width="120">
          <FormItem label="备注:">
              <Input type="textarea" v-model="formData.REMARK"  placeholder="请输入备注信息"> </Input>
          </FormItem>
       </Form>
       <div style="height:50px;"></div>
        </TabPane>
                <!-- 车辆档案 -->
        <TabPane label="维修记录" name="m2"  :disabled="formData.VEHICLE_ID < 1"  icon="logo-windows">
        车辆档案列表

        </TabPane>
        <!-- 车辆档案结束 -->
        <!-- 会员卡信息 -->

        <TabPane label="保养规则" name="m3" :disabled="formData.VEHICLE_ID < 1"   icon="logo-tux">

        </TabPane>
        <!-- 会员结束 -->
    </Tabs>
<select-customer @select="select" :showoff="showoff"></select-customer>
</Modal>
</template>
<script>
    import { getName, getDictGroup, getCreate } from '@/libs/util.js'
    import selectCustomer from '@/hxx-components/select-customer.vue'
	export default{
		name:'cart-modal',
		components:{selectCustomer},
		data(){
			     const validatePass = (rule, value, callback) => {
			     	var p1 = /\d?[A-Z]+\d?/
                if (!p1.test(value) || value.length !== 17) {
                    callback(new Error('输入正确的车架号'));
                }else{
                	  callback();
                }
            };
			return{
				store:[],
				showModal:false,
				showoff:false,
				formData:{
				MUST_SAFE_CORP:0,
				BUSINESS_SAFE_CORP:0,
				VEHICLE_COLOR:0,
				COME_MILEAGE:0,
				REPAIR_MILEAGE:0,
				LAST_REPAIR_MILEAGE:0,
				NEXT_REPAIR_MILEAGE:0,
				VEHICLE_ID:0,
				REGULAR_REPAIR:0,
				PLATE_NUM:'',
				VIN_NO:'',
				VEHICLE_MODEL:'法拉利360 Spider 敞篷版 2004款 3.6L Spider AMT',
				BUY_DATE:'',
				ENGINE_NO:'',
				LEAVE_FACTORY_DATE:'',
				COME_DATE:'',
				LAST_REPAIR_DATE:'',
				NEXT_REPAIR_DATE:'',
				YEAR_CHECK_DATE:'',
				MUST_SAFE_VALIDITY:'',
				BUSINESS_SAFE_VALIDITY:'',
				REMARK:'',
				TID:24715,
				CUSTOMER_ID:'',
                CUSTOMER_CODE:'',
                CUSTOMER_NAME:'',
                VEHICLE_ID:'',
				},
				ruleValidate:{
					 PLATE_NUM:[{required: true, message: '车牌号必填', trigger: 'blur' },
					 { type:'string',pattern:/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/, message:'请输入正确的车牌号码', trigger:'change'}
					 ],
					 VIN_NO:[{required: true, message: '车架号必填', trigger: 'blur' },
					 	{ validator: validatePass, trigger: 'change' },
					 	{ validator: validatePass, trigger: 'blur' }
					 ],
					 VEHICLE_MODEL:[{required: true, message: '请点击搜索图标选取车型', trigger: 'blur'}],
           CUSTOMER_CODE:[{required: true, message: '请点击搜索图标选取客户', trigger: 'blur'}],
           CUSTOMER_NAME:[{required: true, message: '客户名称必选', trigger: 'blur'}],
				},
				must:[],
				business:[],
				store:[],
				color:[],
			}
		},
		props:['show','CUSTOMER_ID','row','sign'],
		watch:{
           show(){
           	this.showModal=true;
           	// alert(1);
           	//重置数据。
           	this.resotre();
           	if(this.must.length === 0) this.getInsure();
           },store(){
           	 this.must.push({'INSURER_ID':0,'CORP_NAME':'请选择'});
           	 for(var i in this.store){
           	 	this.must.push(this.store[i]);
           	 }
           	 this.business = this.must;
           },
           CUSTOMER_ID(name){
           	this.formData.CUSTOMER_ID = name;
           },
           row(obj){
           	this.formData.REMARK = obj.REMARK;
            this.formData.MUST_SAFE_CORP = obj.MUST_SAFE_CORP;
			this.formData.BUSINESS_SAFE_CORP = obj.BUSINESS_SAFE_CORP;
		    this.formData.VEHICLE_COLOR = obj.VEHICLE_COLOR;
			this.formData.COME_MILEAGE = parseFloat(obj.COME_MILEAGE);
		    this.formData.REPAIR_MILEAGE = parseFloat(obj.REPAIR_MILEAGE);
			this.formData.LAST_REPAIR_MILEAGE = parseFloat(obj.LAST_REPAIR_MILEAGE);
			this.formData.NEXT_REPAIR_MILEAGE = parseFloat(obj.NEXT_REPAIR_MILEAGE);
			this.formData.VEHICLE_ID= obj.VEHICLE_ID;
			this.formData.REGULAR_REPAIR = parseFloat(obj.REGULAR_REPAIR);
			this.formData.PLATE_NUM = obj.PLATE_NUM;
			this.formData.VIN_NO = obj.VIN_NO;
			this.formData.VEHICLE_MODEL = obj.VEHICLE_MODEL;
			this.formData.BUY_DATE = obj.BUY_DATE;
			this.formData.ENGINE_NO = obj.ENGINE_NO;
			this.formData.LEAVE_FACTORY_DATE = obj.LEAVE_FACTORY_DATE;
			this.formData.COME_DATE = obj.COME_DATE;
			this.formData.LAST_REPAIR_DATE = obj.LAST_REPAIR_DATE;
			this.formData.NEXT_REPAIR_DATE = obj.NEXT_REPAIR_DATE;
			this.formData.YEAR_CHECK_DATE = obj.YEAR_CHECK_DATE;
			this.formData.MUST_SAFE_VALIDITY = obj.MUST_SAFE_VALIDITY;
			this.formData.REMARK = obj.REMARK;
			this.formData.TID = obj.TID;
			this.formData.CUSTOMER_ID = obj.CUSTOMER_ID;
			this.formData.BUSINESS_SAFE_VALIDITY = obj.BUSINESS_SAFE_VALIDITY;
           }
		},
		methods:{
			vehicleChange(){alert(1)},
			getInsure(){
		  this.axios.request({
          url: 'tenant/repair/tt_guarantee_slip/get_insurer_list',
          method: 'post',
          data: {access_token: this.$store.state.user.token,
                 limit:25,
                 page:1
                }
        }).then(res => {
          if (res.success === true) {
          	this.store = res.data;
          }
        })
			},
			submit(name){
		    this.$refs[name].validate((valid) => {
                    if (valid) {
                     console.log(this.formData);
                    this.$Modal.confirm({
                    	title:'系统提示',
                    	content:'确认保存吗?',
                    	onOk:this.vehicleAdd,
                    });
                    } else {
                        this.$Message.error("请校对红框信息");
                    }
                })
			},
			vehicleAdd(){
		  this.axios.request({
          url: 'tenant/basedata/ttvehiclefile/save',
          method: 'post',
          data: {access_token: this.$store.state.user.token,
                 data:JSON.stringify(this.formData)
                }
        }).then(res => {
          if (res.success === true) {
             if(this.formData.VEHICLE_ID < 1){
              this.$Message.success('新增成功');
             this.formData.VEHICLE_ID = res.data.VEHICLE_ID;
             }else{
              this.$Message.success('修改成功');
             }
              this.$emit('refresh');
          }
        })
			},
      customerChange(){
        this.showoff = Math.random();
      },select(row){
      	this.formData.CUSTOMER_ID = row.CUSTOMER_ID;
        this.formData.CUSTOMER_CODE = row.CODE;
        this.formData.CUSTOMER_NAME = row.NAME;
      },resotre(){
      	var data = {
				MUST_SAFE_CORP:0,
				BUSINESS_SAFE_CORP:0,
				VEHICLE_COLOR:0,
				COME_MILEAGE:0,
				REPAIR_MILEAGE:0,
				LAST_REPAIR_MILEAGE:0,
				NEXT_REPAIR_MILEAGE:0,
				VEHICLE_ID:0,
				REGULAR_REPAIR:0,
				PLATE_NUM:'',
				VIN_NO:'',
				VEHICLE_MODEL:'法拉利360 Spider 敞篷版 2004款 3.6L Spider AMT',
				BUY_DATE:'',
				ENGINE_NO:'',
				LEAVE_FACTORY_DATE:'',
				COME_DATE:'',
				LAST_REPAIR_DATE:'',
				NEXT_REPAIR_DATE:'',
				YEAR_CHECK_DATE:'',
				MUST_SAFE_VALIDITY:'',
				BUSINESS_SAFE_VALIDITY:'',
				REMARK:'',
				TID:24715,
				CUSTOMER_ID:'',
                CUSTOMER_CODE:'',
                CUSTOMER_NAME:'',
                VEHICLE_ID:'',
				};
				this.formData = data;
      },
		},
		mounted(){
        var color = getDictGroup(this.$store.state.app.dict,'1013');
        this.color.push({
                "code": 0,
                "order": 0,
                "group": "1013",
                "name": "请选择"
            });
        for(var i in color){
        	this.color.push(color[i]);
        }
		}
	}
</script>
<style scoped lang="less">
	  .operate{
    margin-top: 10px;
    padding: 15px;
    border: 1px solid #dcdee2;
    border-radius: 3px;
    width:100%;
  }
</style>
<style lang="less">
.table-modal-detail .ivu-modal-wrap .ivu-modal .ivu-modal-content .ivu-modal-body{
  padding-top:10px;
}
</style>