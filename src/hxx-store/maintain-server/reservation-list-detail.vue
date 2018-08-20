<!--预约单管理详情-->
<template>
  <Modal
    v-model="showDetail"
    title="维修服务预约"
    width="90"
    @on-ok="ok"
    @on-cancel="cancel"
    scrollable>
    <Collapse v-model="collapse" class="table-search">
    <Panel name="1">查询
      <!--<div slot="content">
        <div class="search-block">
          <Input v-model="search.input" placeholder="预约单号/预约人/联系电话..."></Input>
        </div>
      </div>-->
       <Form ref="formInline"  slot="content" :label-width="100" inline>
          <FormItem label="车牌号码:">
              <Input type="text" v-model="search.input" placeholder="请输入车牌号" style="min-width: 250px;"> </Input>
          </FormItem>
          <FormItem label="车型:">
              <Input type="text" v-model="search.input" placeholder="请输入车型" style="min-width: 250px;"> </Input>
          </FormItem>
          <FormItem label="预约维修类型:" :label-width="100">
              <Select v-model="search.input" placeholder="" style="min-width: 250px;">
                <Option value="beijing">New York</Option>
                <Option value="shanghai">London</Option>
                <Option value="shenzhen">Sydney</Option>
            </Select>
          </FormItem>
          
          <FormItem label="预约日期:">
              <DatePicker type="date" placeholder="请选择..." style="min-width: 250px;"></DatePicker>
          </FormItem>
          <FormItem label="预约时间:">
              <TimePicker type="time" placeholder="请选择..." style="min-width: 250px;"></TimePicker>
          </FormItem>
          <FormItem label="预约类型:">
              <Select v-model="search.input" placeholder="" style="min-width: 250px;">
                <Option value="beijing">New York</Option>
                <Option value="shanghai">London</Option>
                <Option value="shenzhen">Sydney</Option>
                </Select>
          </FormItem>
          <FormItem label="预约人:">
              <Input type="text" v-model="search.input" placeholder="" style="min-width: 250px;"> </Input>
          </FormItem>
          <FormItem label="联系电话:">
              <Input type="text" v-model="search.input" placeholder="" style="min-width: 250px;"> </Input>
          </FormItem>
          <FormItem label="当前里程:">
              <InputNumber :min="1" v-model="search.input" style="min-width: 250px;" placeholder="最大不超过八位数"></InputNumber>
          </FormItem>
       </Form>
       <Form ref="formInline"  slot="content" :label-width="100">

          <FormItem label="故障描述:">
              <Input type="text" v-model="search.input" placeholder="请输入故障描述"> </Input>
          </FormItem>
          <FormItem label="客诉内容:">
              <Input type="text" v-model="search.input" placeholder="请输入客诉内容"> </Input>
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
      :data="value"
      :columns="columns"
      stripe
      border
      :show-header="showHeader"
      :width="width"
      :height="tableHeight"
      :loading="loading"
      :disabled-hover="disabledHover"
      :highlight-row="highlightRow"
      :row-class-name="rowClassName"
      :size="size"
      :no-data-text="noDataText"
      :no-filtered-data-text="noFilteredDataText"
    ></Table>
    <div class="r-list-search">
          <Button type="primary" shape="circle" style="margin-right: 10px;"><Icon type="md-checkmark" size="24"/>选择项目</Button>
          <Button type="primary" shape="circle"><Icon type="md-add" size="24"/>进入维修项目</Button>
    </div>
    <div v-if="testSingle">
        <div class="r-list-header">
          <h1>维修项目套餐</h1>
        </div>
        <Table
          class="main-table"
          ref="tablesMain"
          :data="value"
          :columns="columns2"
          stripe
          border
          :show-header="showHeader"
          :width="width"
          :height="tableHeight"
          :loading="loading"
          :disabled-hover="disabledHover"
          :highlight-row="highlightRow"
          :row-class-name="rowClassName"
          :size="size"
          :no-data-text="noDataText"
          :no-filtered-data-text="noFilteredDataText"
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
      :data="value"
      :columns="columns1"
      stripe
      border
      :show-header="showHeader"
      :width="width"
      :height="tableHeight"
      :loading="loading"
      :disabled-hover="disabledHover"
      :highlight-row="highlightRow"
      :row-class-name="rowClassName"
      :size="size"
      :no-data-text="noDataText"
      :no-filtered-data-text="noFilteredDataText"
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
	export default {
		name: "reservation-list-detail",
    data(){
      return{
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
        }
      }
    },
    props: {
      showDetail:{
        type: Boolean,
        default: false
      }
    },
    methods:{
      ok(){

      },
      cancel(){

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
