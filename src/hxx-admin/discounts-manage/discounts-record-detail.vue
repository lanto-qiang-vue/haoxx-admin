<template>
  <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage"
                :total="total" :show="showTable" :clearSelect="clearType" :page="page" :loading="loading"
                @onRowClick="onRowClick" class="discounts-record-detail">
    <div slot="search">
      <div class="search-block">
        <Input placeholder="会员账号/门店名称/兑换码" v-model="query.keyWord" clearable></Input>
      </div>
      <div class="search-block">
        <DatePicker type="daterange" format="yyyy-MM-dd" placeholder="有效期" clearable
                    style="width:100%;" @on-change="onChange"></DatePicker>
      </div>
      <!--<div class="search-block">-->
      <!--<DatePicker type="daterange" :options="option" format="yyyy-MM-dd" placeholder=""-->
      <!--style="width:100%;"></DatePicker>-->
      <!--</div>-->
      <div class="search-block">
        <Select placeholder="券用途" v-model="query.type" clearable>
          <Option v-for="(item, index) in typeList"
                  :key="index" :value="item.id">{{item.name}}
          </Option>
        </Select>
      </div>
      <div class="search-block">
        <Select placeholder="券类型" v-model="query.useType" clearable>
          <Option v-for="(item, index) in useTypeList"
                  :key="index" :value="item.code">{{item.name}}
          </Option>
        </Select>
      </div>
      <div class="search-block">
        <Select placeholder="券状态" v-model="query.isuse" clearable>
          <Option v-for="(item, index) in isUseList"
                  :key="index" :value="item.code">{{item.name}}
          </Option>
        </Select>
      </div>
      <ButtonGroup size="small">
        <Button type="primary" @click="page=1;getList()">
          <Icon type="ios-search" size="24"/>
        </Button>
        <!--<Button type="primary" @click="page=1;getList()">查看全部</Button>-->
      </ButtonGroup>
    </div>
    <div slot="operate">
      <Button type="info" :disabled="!detail.id" @click="look()">查看</Button>
    </div>
    <Modal
      v-model="showModal"
      class="table-modal-detail full-height discounts-modal"
      width="100"
      heigh="100"
      :mask-closable="false"
      :scrollable="true"
      :transfer="false"
      :footer-hide="false"
      :transition-names="['', '']">
      <modal-title slot="header" title="优惠券详情" @clickBack="showModal=false"></modal-title>
      <ul class="detail-list">
        <li>名称：<span>{{detail.name}}</span></li>
        <li>用途：<span>{{findName(typeList,['id','name',detail.type])}}</span></li>
        <li>类型：<span>{{findName(useTypeList,['code','name',detail.useType])}}</span></li>
        <li>兑换码：<span>{{detail.code}}</span></li>
        <li>使用有效期：<span v-show="detail.beginTime">{{detail.beginTime + '～' + detail.endTime}}</span></li>
        <li>可领取日期：<span>{{detail.aa}}</span></li>
        <li>发券时间：<span>{{detail.createDate}}</span></li>
        <li>领取时间：<span>{{detail.recipientsTime}}</span></li>
        <li>适用门店：<a @click="$refs.store.open(true)">{{detail.tenantnsum? detail.tenantnsum+'家': ''}}</a></li>
        <li>会员账号/昵称：<a @click="goto(1,detail.username)">{{detail.username}}{{detail.nickname ? '/'+detail.nickname : ''}}</a></li>
        <li>限用车牌号：<span>{{detail.license}}</span></li>
        <li>是否保险公司导入名单：<span>{{detail.recommended == 1 ? '是' : '否'}}</span></li>
        <li>使用门店：<span>{{detail.tenantName}}</span></li>
        <li>使用时间：<span>{{detail.spendingTime}}</span></li>
        <li>发券人账号/名称：<a @click="goto(2,detail.userCode)">{{detail.userCode}}{{detail.operationName ? '/'+detail.operationName : detail.operationName}}</a></li>
      </ul>
      <div slot="footer">
        <Button @click="showModal=false">关闭</Button>
      </div>
    </Modal>
    <select-stroe ref="store" :code="detail.code" :batch="detail.batch"></select-stroe>
  </common-table>
</template>
<script>
  import commonTable from '@/hxx-components/common-table.vue'
  import selectStroe from '@/hxx-components/select-store.vue';
  import ModalTitle from '@/hxx-components/modal-title.vue'
  import {deepClone, getDictGroup, getName, find} from "@/libs/util";
let queryInit= {
  keyWord: '',
  startTime_eq: '',
  endTime_eq: '',
  type: '',
  useType: '',
  isuse: '',
  userid: '',
}
  export default {
    name: "discounts-record-detail",
    components: {commonTable, ModalTitle, selectStroe},
    data() {
      return {
        query: deepClone(queryInit),
        loading: false,
        detail: {},
        useTypeList: [],
        typeList: [],
        isUseList: [
          {code: 0, name: '未领用'},
          {code: 1, name: '领用中'},
          {code: 2, name: '已使用'},
          {code: 3, name: '已过期'},
        ],
        showType: false,
        showModal: false,
        tableData: [],
        columns: [
          {
            title: '序号', width: 70,
            render: (h, params) => h('span', (this.page - 1) * this.limit + params.index + 1)
          },
          {title: '会员账号', key: 'username', width: 120},
          {title: '券名称', key: 'name', width: 140},
          {
            title: '用途', key: 'coupname', width: 80,
            // render: (h, params) => h('span',find(this.typeList,['id','name',params.row.type]))
          },
          {
            title: '类型', key: 'useType', width: 80,
            render: (h, params) => h('span', getName(this.useTypeList, params.row.useType))
          },
          {title: '兑换码', key: 'code', width: 100},
          {
            title: '状态', key: 'isuse', width: 80,
            render: (h, params) => h('span', find(this.isUseList, ['code', 'name', params.row.isuse]))
          },
          {title: '领取时间', key: 'recipientsTime', width: 160},
          {
            title: '有效时间', key: 'price', width: 320,
            render: (h, params) => h('span', params.row.beginTime + ' ~ ' + params.row.endTime)
          },
          {title: '使用时间', key: 'spendingTime', width: 160},
          {title: '使用门店', key: 'tenantName', minWidth: 200},
        ],
        total: 0,
        showTable: false,
        clearType: false,
        page: 1,
        limit: 25,
      }
    },
    computed:{

    },
    // watch: {
    //   '$route'(){
    //     this.getQuery()
    //     this.getList();
    //   }
    // },
    // activated(){
    //     this.getQuery()
    //     this.getList();
    // },
    mounted() {
      this.getQuery()
      let data = getDictGroup(this.$store.state.app.dict, '1056');
      for (let i in data) {
        this.useTypeList.push(data[i]);
      }
      this.getType();
      this.showTable = Math.random();
      this.getList();
    },
    methods: {
      getQuery(){
        let query= this.$route.query
        this.query= deepClone(queryInit)
        this.query.keyWord= query.name || ''
        this.query.type= query.type
        this.query.userid= query.userid || ''
        this.query.name= query.name || ''
        this.query.useType= (query.useType|| '').toString()
      },
      findName(a,b){
        return find(a,b);
      },
      clear(){
        this.detail = {};
        this.clearType = Math.random();
      },
      look() {
        let code = this.detail.code;
        this.clear();
        this.showModal = true;
        this.axios.request({
          baseURL: '/poxy-shqx/',
          url: '/manage/cupon/queryCouponDetail',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            code: code
          }
        }).then(res => {
          if (res.success == true) {
            this.detail = res.data;
          }
        })
      },
      getType() {
        this.axios.request({
          baseURL: '/poxy-shqx/',
          url: '/manage/cupon/typeList',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
          }
        }).then(res => {
          if (res.success == true) {
            let data = res.data;
            for (let i in data) {
              this.typeList.push(data[i]);
            }
          }
        })
      },
      onChange(val) {
        this.query.startTime_eq = val[0];
        this.query.endTime_eq = val[1];
      },
      goto(type, string) {
        switch (type) {
          case 1:
            this.$router.push({path:'/member-list',query:{phone:string}});
            break;
          case 2:
            this.$router.push({path:'/user-management',query:{account:string}});
            break;
        }
      },
      onRowClick(row) {
        this.detail = row;
      },
      getList() {
        this.loading = true;
        this.axios.request({
          baseURL: '/poxy-shqx/',
          url: '/manage/cupon/queryCouponList',
          method: 'post',
          data: {
            ...this.query,
            page: this.page,
            limit: this.limit,
          }
        }).then(res => {
          if (res.success == true) {
            this.total = res.total;
            this.tableData = res.data;
          }
          this.loading = false;
        })
      },
      changePageSize(size) {
        this.limit = size;
        if (this.page == 1) this.getList();
      },
      changePage(page) {
        // console.log("changePage");
        this.page = page;
        this.getList();
      }
    },
  }
</script>
<style lang="less" scoped>
.discounts-record-detail{
  .detail-list{
    padding: 10px 0 10px 10px;
    font-size: 14px;
    line-height: 40px;
    li{
      display: inline-block;
      width: auto;
      min-width: 33%;
      margin-bottom: 10px;
      padding-right: 10px;
      color: #666666;
      >span{
        color: #333333;
      }
      >*{
        font-size: 16px;
      }
    }
  }
}
</style>
