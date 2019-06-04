<template>
  <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage"
                :total="total" :show="showTable" :clearSelect="clearType" :page="page">
    <div slot="search">
      <div class="search-block">
        <Input placeholder="用户账户名称" v-model="userCode"></Input>
      </div>
      <div class="search-block">
        <Input placeholder="车架号" v-model="vin"></Input>
      </div>
      <div class="search-block">
        <Input placeholder="订单编号" v-model="no"></Input>
      </div>
      <div class="search-block">
        <Select v-model="type" placeholder="请选择产品编码">
          <Option v-for="(item, index) in productList"
                  :key="index" :value="item.id">{{item.name}}
          </Option>
        </Select>
      </div>
      <div class="search-block">
        <Select v-model="state" placeholder="请选是否无效状态">
          <Option v-for="(item, index) in stateList"
                  :key="index" :value="item.id">{{item.name}}
          </Option>
        </Select>
      </div>
      <div class="search-block">
        <Select v-model="status" placeholder="请选择订单支付状态">
          <Option v-for="(item, index) in statusList"
                  :key="index" :value="item.id">{{item.name}}
          </Option>
        </Select>
      </div>
      <div class="search-block">
        <DatePicker type="daterange" :value="value" :options="option" format="yyyy-MM-dd" placeholder="请选择订单时间区间"
                    style="width:100%;"
                    @on-change="onChange"></DatePicker>
      </div>
      <ButtonGroup size="small">
        <Button type="primary" @click="page=1;getList()">
          <Icon type="ios-search" size="24"/>
        </Button>
      </ButtonGroup>
    </div>
  </common-table>
</template>
<script>
  import expandRow from './expand.vue'
  import commonTable from '@/hxx-components/common-table.vue'
  import {deepClone} from "../../libs/util";

  export default {
    name: "order-list",
    components: {commonTable},
    data() {
      return {
        type: '请选择产品编码',
        state: '请选是否无效状态',
        status: '请选择订单支付状态',
        userCode:'',
        vin:'',
        no:'',
        value:["",""],
        productList: [],
        statusList: [],
        stateList: [
          {id: '请选是否无效状态', name: '请选是否无效状态'},
          {id: 1, name: '订单无效'},
          {id: 2, name: '订单有效'}
        ],
        tableData: [],
        option: {
          disabledDate(date) {
            return date > new Date();
          }
        },
        columns: [
          {
            title: '订单编号', width: 250,key:'no',sortable:true,
          },
          {title: '车架号', key: 'vin', width: 180,sortable:true},
          {title: '产品编码', key: 'type', width: 120,sortable:true},
          {title: '价格', key: 'amount', width: 100,sortable:true},
          {title: '支付状态', key: 'payType', width: 120,sortable:true,
            render: (h, params) => h('span',params.row.status.name)
          },
          {title: '账户名', key: 'accountName', minWidth: 120,sortable:true,
            // render: (h, params) => h('span',params.row.user.name)
          },
          {title:'是否详细版本',key:'detailVersion',width:120,sortable:true,
            render: (h, params) => h('span',params.row.detailVersion ? '是' : '否')
          },
          {title: '订单是否无效状态', key: 'state', width: 140,sortable:true,
            render: (h, params) => h('span',params.row.state ? '订单无效' : '订单有效')
          },
          {title: '订单时间', key: 'createTime', width: 180,sortable:true,
          },
        ],
        total: 0,
        showTable: false,
        clearType: false,
        page: 1,
        limit: 25,
      }
    },
    mounted() {
      this.showTable = Math.random();
      this.getProduct();
      this.getStatus();
      this.getList();
    },
    methods: {
      onChange(time){
        this.value = time;
      },
      getStatus() {
        this.$fly.get('/hxxdc/order/status', {
          params: {
            pageNo: 1,
            pageSize: 100,
          }
        }).then(res => {
               let data = res.items;
               this.statusList.push({id:'请选择订单支付状态',name:'请选择订单支付状态'});
               for(let i in data){
                 this.statusList.push({id:data[i].code,name:data[i].name});
               }
        });
      },
      getProduct() {
        this.$fly.post('/hxxdc/product/find', {
          code: "",
          name: "",
          pageNo: 1,
          pageSize: 100,
        }).then(res => {
          this.productList.push({id: '请选择产品编码', name: '请选择产品编码'});
          let data = res.items;
          for (let i in data) {
            this.productList.push({id: data[i].code, name: data[i].name});
          }
        })
      },
      getList() {
        this.$fly.post('/hxxdc/order/find', {
          no:this.no,
          vin:this.vin,
          userCode:this.userCode,
          startDate:this.value[0],
          endDate:this.value[1],
          state:this.state == '请选是否无效状态' ? null : (this.state == 1 ? true : false),
          type:this.type == '请选择产品编码' ? "" : this.type,
          status:this.status == '请选择订单支付状态' ? null : this.status,
          pageNo: this.page,
          pageSize: this.limit,
        }).then(res => {
          let data = res.items;
          for(let i in data){
            data[i]['accountName'] = data[i].user.name;
          }
          this.total = res.total;
          this.tableData = data;
        })
      },
      changePageSize(size) {
        this.limit = size;
        if (this.page == 1) this.getList();
      },
      changePage(page) {
        this.page = page;
        this.getList();
      }
    },
  }
</script>
<style scoped>

</style>
