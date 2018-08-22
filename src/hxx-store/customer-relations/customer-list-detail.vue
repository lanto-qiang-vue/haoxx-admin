<!--预约单管理详情-->
<template>
  <Modal
    v-model="showModal"
    width="90"
    @on-visible-change="visibleChange"
    :closable="false"
    :scrollable="true"
    :transfer= "false"
    :footer-hide="false"
  >
          <p slot="header" style="color:#f60;text-align:center">
<!--             <Icon type="ios-information-circle"></Icon>
            <span>Delete confirmation</span> -->
        </p>
    <Collapse v-model="collapse">
      <Panel name="1">查询
       <Form  slot="content" :label-width="80" inline class="detail-form">
          <FormItem label="车牌号码:">
              <Input type="text"  placeholder="请输入车牌号" style="min-width: 250px;"> </Input>
          </FormItem>
          <FormItem label="车型:">
              <Input type="text" placeholder="请输入车型" style="min-width: 250px;"> </Input>
          </FormItem>
          <FormItem label="预约维修类型:" >
              <!-- <Select v-model="listSearch.REPAIR_TYPE" placeholder="" style="min-width: 250px;"> -->

            </Select>
          </FormItem>
<!--@on-change="getNewDate"-->
          <FormItem label="预约日期:" prop="ORDER_DATE">
            <!--   <DatePicker format="yyyy-MM-dd" v-model="listSearch.ORDER_DATE" type="date" placeholder="请选择..." style="min-width: 250px;"></DatePicker> -->
          </FormItem>
          <FormItem label="预约时间:" prop="ORDER_TIME">
              <!-- <TimePicker v-model="listSearch.ORDER_TIME" type="time" placeholder="请选择..." style="min-width: 250px;"></TimePicker> -->
          </FormItem>
          <FormItem label="预约类型:">
        <!--       <Select v-model="listSearch.ORDER_TYPE" placeholder="" style="min-width: 250px;">
                <Option v-for="(item, index) in searchSelectOption1"
                  :key="index" :value="item.code">{{item.name}}</Option>
                </Select> -->
          </FormItem>
          <FormItem label="预约人:">
              <!-- <Input type="text" v-model="listSearch.ORDER_PERSON" placeholder="" style="min-width: 250px;"> </Input> -->
          </FormItem>
          <FormItem label="联系电话:">
    <!--           <Input type="text"  @on-keyup="getOnlyNumber" v-model="listSearch.TELPHONE" onkeypress="return event.keyCode>=48&&event.keyCode<=57" style="min-width: 250px;"> </Input> -->
          </FormItem>
          <FormItem label="当前里程:">
              <InputNumber :min="1" style="min-width: 250px;" placeholder="最大不超过八位数"></InputNumber>
          </FormItem>
       </Form>
    </Panel>
  </Collapse>
  </Modal>

</template>

<script>
	export default {
		name: "customer-list-detail",
    data(){
      return {
        showModal:true,
        collapse:'1',
      }
    },
    methods:{
      visibleChange(){},
      // collapse(){},
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
