<!--预约单管理详情-->
<template>
  <Modal
    v-model="showModal"
    title="维修服务预约"
    width="90"
    @on-ok="ok"
    @on-cancel="cancel"
    @on-visible-change="visibleChange"
    :scrollable="true"
    :transfer= "false"
    :footer-hide="false"
  >
    <Collapse v-model="collapse">
    <Panel name="1">查询
       <Form ref="formInline"  slot="content" :label-width="80" inline class="detail-form">
          <FormItem label="车牌号码:">
              <Input type="text" v-model="listSearch.PLATE_NUM" placeholder="请输入车牌号" style="min-width: 250px;"> </Input>
          </FormItem>
          <FormItem label="车型:">
              <Input type="text" v-model="listSearch.VEHICLE_MODEL" placeholder="请输入车型" style="min-width: 250px;"> </Input>
          </FormItem>
          <FormItem label="预约维修类型:" >
              <Select v-model="listSearch.REPAIR_TYPE" placeholder="" style="min-width: 250px;">
                <Option v-for="(item, index) in searchSelectOption"
                  :key="index" :value="item.code">{{item.name}}</Option>
            </Select>
          </FormItem>

          <FormItem label="预约日期:">
              <DatePicker format="yyyy-MM-dd" @on-change="getNewDate" type="date" placeholder="请选择..." style="min-width: 250px;"></DatePicker>
          </FormItem>
          <FormItem label="预约时间:">
              <TimePicker v-model="listSearch.ORDER_TIME" type="time" placeholder="请选择..." style="min-width: 250px;"></TimePicker>
          </FormItem>
          <FormItem label="预约类型:">
              <Select v-model="listSearch.ORDER_TYPE" placeholder="" style="min-width: 250px;">
                <Option v-for="(item, index) in searchSelectOption1"
                  :key="index" :value="item.code">{{item.name}}</Option>
                </Select>
          </FormItem>
          <FormItem label="预约人:">
              <Input type="text" v-model="listSearch.ORDER_PERSON" placeholder="" style="min-width: 250px;"> </Input>
          </FormItem>
          <FormItem label="联系电话:">
              <Input type="text" v-model="listSearch.TELPHONE" placeholder="" style="min-width: 250px;"> </Input>
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
    <div class="r-list-chekbox">
      <div>
          <Checkbox v-model="testSingle">是否启用维修套餐</Checkbox>
      </div>

    </div>
    <div class="r-list-header">
      <h1>维修项目</h1>
    </div>
    <Table
      class="main-table"
      ref="tablesMain"
      :columns="columns"
      stripe
      border
    ></Table>
    <div class="r-list-search">
          <Button @click="commitData" type="primary" shape="circle" style="margin-right: 10px;"><Icon type="md-checkmark" size="24"/>选择项目</Button>
          <Button type="primary" shape="circle"><Icon type="md-add" size="24"/>进入维修项目</Button>
    </div>
    <div v-if="testSingle">
        <div class="r-list-header">
          <h1>维修项目套餐</h1>
        </div>
        <Table
          class="main-table"
          ref="tablesMain"
          :columns="columns2"
          stripe
          border
        ></Table>
        <div class="r-list-search">
              <Button type="primary" shape="circle" style="margin-right: 10px;"><Icon type="md-checkmark" size="24"/>选择项目套餐</Button>
              <Button type="primary" shape="circle"><Icon type="md-add" size="24"/>进入项目套餐</Button>
        </div>
    </div>
    <div class="r-list-header">
      <h1>维修配件</h1>
    </div>
    <Table
      class="main-table"
      ref="tablesMain"
      :columns="columns1"
      stripe
      border
    ></Table>
    <div class="r-list-choose-parts">
          <Button type="primary" shape="circle" style="margin-right: 10px;"><Icon type="md-checkmark" size="24"/>从配件库存选择配件</Button>
          <Button type="primary" shape="circle" ><Icon type="md-add" size="24"/>从配件档案选择配件</Button>
    </div>

    <div class="r-list-money">
      <p>
        维修项目费用：<span>{{testMsg}}元</span> + 维修配件费用：<span>{{testMsg1}}元</span> + 维修项目优惠金额：<InputNumber :max="10" :min="1"></InputNumber> - 配件优惠金额：<InputNumber :max="10" :min="1"></InputNumber>= 合计应收金额：<span class="r-list-money-reset">{{testMsg2}}元</span>
      </p>
    </div>
  </Modal>
</template>

<script>
  import { getName, getDictGroup } from '@/libs/util.js'
  import { formatDate } from '@/libs/tools.js'
	export default {
		name: "reservation-list-detail",
    data(){
      return{
        showModal: false,
        testSingle:false,
        testMsg:"2700.00",
        testMsg1:"100.00",
        testMsg2:"5000.00",
        columns: [
          // {type: 'selection', width: 50, fixed: 'left'},
          {title: '序号',  minWidth: 60,
            render: (h, params) => h('span', (this.page-1)*this.limit+params.index+1 )
          },
          {title: '维修项目名称', key: 'ORDER_TYPE', sortable: true, minWidth: 200,
            render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.ORDER_TYPE))
          },
          {title: '标准工时', key: 'ORDER_PERSON', sortable: true, minWidth: 150},
          {title: '标准金额', key: 'TELPHONE', sortable: true, minWidth: 150},
          {title: '油漆面数', key: 'PLATE_NUM', sortable: true, minWidth: 150},
          {title: '小计金额', key: 'VEHICLE_MODEL', sortable: true, minWidth: 150},
          {title: '优惠金额', key: 'ORDER_DATE', sortable: true, minWidth: 150,
            render: (h, params) => h('span', params.row.ORDER_DATE.substr(0, 10))
          },
          {title: '优惠后金额', key: 'ORDER_TIME', sortable: true, minWidth: 150},
          {title: '备注', key: 'REPAIR_TYPE', sortable: true, minWidth: 150,
            render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.REPAIR_TYPE))
          },
          {title: '操作', key: 'SUM_MONEY', sortable: true, minWidth: 150,
            render: (h, params) => h('span', params.row.SUM_MONEY|| '0.00')
          },
        ],
        columns1: [
          // {type: 'selection', width: 50, fixed: 'left'},
          {title: '序号',  minWidth: 60,
            render: (h, params) => h('span', (this.page-1)*this.limit+params.index+1 )
          },
          {title: '配件编号', key: 'ORDER_TYPE', sortable: true, minWidth: 200,
            render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.ORDER_TYPE))
          },
          {title: '配件名称', key: 'ORDER_PERSON', sortable: true, minWidth: 150},
          {title: '数量', key: 'TELPHONE', sortable: true, minWidth: 150},
          {title: '单位', key: 'PLATE_NUM', sortable: true, minWidth: 150},
          {title: '单价', key: 'VEHICLE_MODEL', sortable: true, minWidth: 150},
          {title: '小计金额', key: 'ORDER_DATE', sortable: true, minWidth: 150,
            render: (h, params) => h('span', params.row.ORDER_DATE.substr(0, 10))
          },
          {title: '优惠金额', key: 'ORDER_TIME', sortable: true, minWidth: 150},
          {title: '优惠后金额', key: 'REPAIR_TYPE', sortable: true, minWidth: 150,
            render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.REPAIR_TYPE))
          },
          {title: '备注', key: 'SUM_MONEY', sortable: true, minWidth: 150,
            render: (h, params) => h('span', params.row.SUM_MONEY|| '0.00')
          },
          {title: '操作', key: 'SUM_MONEY1', sortable: true, minWidth: 150,
            render: (h, params) => h('span', params.row.SUM_MONEY|| '0.00')
          },
        ],
        columns2: [
          // {type: 'selection', width: 50, fixed: 'left'},
          {title: '序号',  minWidth: 60,
            render: (h, params) => h('span', (this.page-1)*this.limit+params.index+1 )
          },
          {title: '项目套餐名称', key: 'ORDER_TYPE', sortable: true, minWidth: 200,
            render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.ORDER_TYPE))
          },
          {title: '套餐价格', key: 'ORDER_PERSON', sortable: true, minWidth: 150},
          {title: '优惠金额', key: 'TELPHONE', sortable: true, minWidth: 150},
          {title: '优惠后金额', key: 'REPAIR_TYPE', sortable: true, minWidth: 150,
            render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.REPAIR_TYPE))
          },
          {title: '备注', key: 'SUM_MONEY', sortable: true, minWidth: 150,
            render: (h, params) => h('span', params.row.SUM_MONEY|| '0.00')
          },
          {title: '操作', key: 'SUM_MONEY1', sortable: true, minWidth: 150,
            render: (h, params) => h('span', params.row.SUM_MONEY|| '0.00')
          },
        ],
        collapse: '1',
        search:{
          input: '',
          TELPHONE:"",
        },
        listSearch:{
          "ORDER_ID":"",
          "VEHICLE_ID":"",
          "VIN_NO":"",
          "CUSTOMER_NAME":"",
          "PLATE_NUM":"\u82cfE9927S",
          "VEHICLE_MODEL":"\u5965\u8feaA5 Cabriolet 2012\u6b3e 2.0TFSI CVT",
          "REPAIR_TYPE":"10191001",
          "ORDER_DATE":"",
          "ORDER_TIME":"",
          "ORDER_TYPE":"10411001",
          "ORDER_PERSON":"",
          "TELPHONE":"",
          "MILEAGE": 0,
          "FAULT_DESC":"",
          "CUSTOMER_INFO":"",
          "IS_ITEM_GROUP":"",
          "REPAIR_ITEM_DERATE_MONEY":"",
          "REPAIR_PART_DERATE_MONEY":"",
          "STATUS":"",
          "REPAIR_ITEM_MONEY":0,
          "REPAIR_PART_MONEY":0,
          "SUM_MONEY":0
        },
        searchSelectOption:[],
        searchSelectOption1:[],
      }
    },
    props:['showDetail', 'detailData'],
    watch:{
      showDetail(){
        this.showModal=true
        if(this.detailData){
          for(let key in this.listSearch){
            this.listSearch[key]= this.detailData[key]
          }
        }else{
          for(let key in this.listSearch){
            switch (key){
              case 'MILEAGE':
              case 'REPAIR_ITEM_MONEY':
              case 'REPAIR_PART_MONEY':
              case 'SUM_MONEY': this.listSearch[key]= 0; break
              default : this.listSearch[key]= ''
            }
          }
        }
      }
    },
    mounted () {
      this.searchSelectOption= getDictGroup(this.$store.state.app.dict, '1019');
      this.searchSelectOption1= getDictGroup(this.$store.state.app.dict, '1041');
      console.log(this.searchSelectOption);

    },
    methods:{
      ok(){

      },
      cancel(){

      },
      visibleChange(status){
        if(status === false){
          this.$emit('closeDetail')
        }
      },
      commitData(){

          this.axios.request({
            url: 'tenant/repair/ttrepairorder/saveOrSubmit',
            method: 'post',
            data: {
              data: JSON.stringify(this.listSearch),
              items:JSON.stringify([]),
              itemGroups: JSON.stringify([]),
              parts: JSON.stringify([]),
              access_token: this.$store.state.user.token
            }
          }).then(res => {
            console.log(11111)
            console.log(res)
            if (res.success === true) {
              console.log(res);
            }
          })
          console.log(this.listSearch);

      },
      getNewDate(val){
          console.log(val);
      }
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
