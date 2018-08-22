<template>
	<div>
	  <Modal
    v-model="showModal"
    title="维修服务预约"
    width="90"
    @on-visible-change="visibleChange"
    :scrollable="true"
    :transfer= "false"
    :footer-hide="false"
  >
     <Collapse>
    <Panel name="1">查询
       <Form ref="formInline"  slot="content" :label-width="80" inline class="detail-form">
          <FormItem label="车牌号码:">
              <Input type="text" v-model="listSearch.PLATE_NUM" placeholder="请输入车牌号" style="min-width: 250px;"> </Input>
          </FormItem>
          <FormItem label="车型:">
              <Input type="text" v-model="listSearch.VEHICLE_MODEL" placeholder="请输入车型" style="min-width: 250px;"> </Input>
          </FormItem>
          <FormItem label="预约维修类型:" >
      <!--         <Select v-model="listSearch.REPAIR_TYPE" placeholder="" style="min-width: 250px;">
                <Option v-for="(item, index) in searchSelectOption"
                  :key="index" :value="item.code">{{item.name}}</Option>
            </Select> -->
          </FormItem>

          <FormItem label="预约日期:">
              <DatePicker format="yyyy-MM-dd" @on-change="getNewDate" type="date" placeholder="请选择..." style="min-width: 250px;"></DatePicker>
          </FormItem>
          <FormItem label="预约时间:">
              <TimePicker v-model="listSearch.ORDER_TIME" type="time" placeholder="请选择..." style="min-width: 250px;"></TimePicker>
          </FormItem>
          <FormItem label="预约类型:">
              <Select v-model="listSearch.ORDER_TYPE" placeholder="" style="min-width: 250px;">
        <!--         <Option v-for="(item, index) in searchSelectOption1"
                  :key="index" :value="item.code">{{item.name}}</Option> -->
                </Select>
          </FormItem>
          <FormItem label="预约人:">
              <Input type="text" v-model="listSearch.ORDER_PERSON" placeholder="" style="min-width: 250px;"> </Input>
          </FormItem>
          <FormItem label="联系电话:">
              <Input type="text"  @on-keyup="getOnlyNumber" v-model="listSearch.TELPHONE" onkeypress="return event.keyCode>=48&&event.keyCode<=57" style="min-width: 250px;"> </Input>
          </FormItem>
          <FormItem label="当前里程:">
              <InputNumber :min="1" v-model="listSearch.MILEAGE" style="min-width: 250px;" placeholder="最大不超过八位数"></InputNumber>
          </FormItem>
       </Form>
       <Form ref="formInline"  slot="content" :label-width="80">

          <FormItem label="故障描述:">
              <Input type="textarea" v-model="listSearch.FAULT_DESC" placeholder="请输入故障描述"> </Input>
          </FormItem>
          <FormItem label="客诉内容:">
              <Input type="textarea" v-model="listSearch.CUSTOMER_INFO" placeholder="请输入客诉内容"> </Input>
          </FormItem>
       </Form>
    </Panel>
  </Collapse>
    <div slot="footer" style="text-align: center; font-size: 18px;">
    </div>
  </Modal>
</div>
</template>
<script>
	export default {
		name:'customer-list-detail',
		data(){
			return {
			listSearch:{
			CUSTOMER_INFO:'',
			FAULT_DESC:'',
			MILEAGE:'',
			TELPHONE:'',
			ORDER_TYPE:'',
			ORDER_TIME:'',	
			},
			showModal:true,
			}
		},
		methods:{
			getNewDate(){

			},
			getOnlyNumber(){

			},
			      visibleChange(status){
        if(status === false){
          this.$emit('closeDetail')
        }
      },
		}
	}
</script>

<style scoped lang="less">
.search-block{
  display: inline-block;
  width: 200px;
  margin-right: 10px;
}
.r-list-search{
  width: 100%;
  padding: 20px 0;
  text-align: center;

}
.r-list-choose-parts{
  width: 100%;
  padding: 20px 0;
  text-align: center;
}
.r-list-money{
  width: 100%;
  font-size: 18px;
  text-align: center;

  span{
    color:red;

  }
  .r-list-money-reset{
    font-size: 22px;
  }
}
.r-list-chekbox{
  width: 100%;
  overflow: hidden;
  font-size: 18px;
  padding: 5px 10px;
  div{
    float:right;
  }
}
</style>
