<template>
  <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage"
                :total="total" :show="showTable" :clearSelect="clearType" :page="page" :loading="loading"
                @onRowClick="onRowClick">
    <div slot="search">
      <div class="search-block">
        <Input placeholder="会员账号/门店名称/兑换码" v-model="keyWord"></Input>
      </div>
      <div class="search-block">
        <DatePicker type="daterange" :options="option" :value="value" format="yyyy-MM-dd" placeholder="使用时间开始-使用时间结束"
                    style="width:100%;" @on-change="onChange"></DatePicker>
      </div>
      <!--<div class="search-block">-->
      <!--<DatePicker type="daterange" :options="option" format="yyyy-MM-dd" placeholder=""-->
      <!--style="width:100%;"></DatePicker>-->
      <!--</div>-->
      <div class="search-block">
        <Select placeholder="请选择卷用途" v-model="type">
          <Option v-for="(item, index) in typeList"
                  :key="index" :value="item.id">{{item.name}}
          </Option>
        </Select>
      </div>
      <div class="search-block">
        <Select placeholder="请选择卷类型" v-model="useType">
          <Option v-for="(item, index) in useTypeList"
                  :key="index" :value="item.code">{{item.name}}
          </Option>
        </Select>
      </div>
      <div class="search-block">
        <Select placeholder="请选择状态" v-model="isuse">
          <Option v-for="(item, index) in isUseList"
                  :key="index" :value="item.code">{{item.name}}
          </Option>
        </Select>
      </div>
      <ButtonGroup size="small">
        <Button type="primary" @click="page=1;getList()">
          <Icon type="ios-search" size="24"/>
        </Button>
      </ButtonGroup>
    </div>
    <div slot="operate">
      <Button type="info" :disabled="list== ''" @click="title='优惠券详情';look()">查看</Button>
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
      <modal-title slot="header" :title="title" @clickBack="showModal=false"></modal-title>
      <!--详情部分-->
      <Form :label-width="170" class="form-3">
        <FormItem label="优惠券名称:" style="width:30%">
          <Input :value="detail.name" readonly/>
        </FormItem>
        <FormItem label="优惠用途:" style="width:30%">
          <Input :value="findName(typeList,['id','name',detail.type])" readonly/>
        </FormItem>
        <FormItem label="优惠券类型:" style="width:30%">
          <Input :value="findName(useTypeList,['code','name',detail.useType])" readonly/>
        </FormItem>
        <!---->
        <FormItem label="优惠券兑换码:" style="width:30%">
          <Input :value="detail.code" readonly/>
        </FormItem>
        <FormItem label="使用有效期:" style="width:30%">
          <Input :value="detail.beginTime + '～' + detail.endTime" readonly/>
        </FormItem>
        <FormItem label="可领取日期:" style="width:30%">
          <Input value="去问写接口的人" readonly/>
        </FormItem>
        <!---->
        <FormItem label="适用门店:" style="width:30%">
          <a @click="showType=Math.random();" :disabled="detail.tenantnsum  < 1">{{detail.tenantnsum}}家</a>
        </FormItem>
        <FormItem label="领取时间:" style="width:30%">
          <Input :value="detail.recipientsTime" readonly/>
        </FormItem>
        <FormItem label="会员账号/昵称:" style="width:30%">
          <a @click="goto(1,detail.username)">{{detail.username}}{{detail.nickname ? '/'+detail.nickname : ''}}</a>
        </FormItem>
        <!---->
        <FormItem label="限用车牌号:" style="width:30%">
          <Input :value="detail.license" readonly/>
        </FormItem>
        <FormItem label="是否保险公司导入名单:" style="width:30%">
          <Input :value="detail.recommended == 1 ? '是' : '否'" readonly/>
        </FormItem>
        <FormItem label="使用门店:" style="width:30%">
          <Input :value="detail.tenantName" readonly/>
        </FormItem>
        <!---->
        <FormItem label="使用时间:" style="width:30%">
          <Input :value="detail.spendingTime" readonly/>
        </FormItem>
        <FormItem label="发卷时间:" style="width:30%">
          <Input :value="detail.createDate" readonly/>
        </FormItem>
        <FormItem>

        </FormItem>
        <!---->
        <FormItem label="发卷人账号/名称:" style="width:30%">
          <a @click="goto(2,detail.userCode)">{{detail.userCode}}{{detail.operationName ? '/'+detail.operationName : detail.operationName}}</a>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="showModal=false">取消</Button>
      </div>
    </Modal>
    <select-stroe :showType="showType" :code="detail.type"></select-stroe>
  </common-table>
</template>
<script>
  import commonTable from '@/hxx-components/common-table.vue'
  import selectStroe from '@/hxx-components/select-store.vue';
  import ModalTitle from '@/hxx-components/modal-title.vue'
  import {deepClone, getDictGroup, getName, find} from "../../libs/util";

  let useList = [
    {name: '请选择'},
    {name: '洗车类'},
    {name: '保养类'},
    {name: '油漆类'}
  ]
  export default {
    name: "discounts-record-detail",
    components: {commonTable, ModalTitle, selectStroe},
    data() {
      return {
        loading: false,
        value: ["", ""],
        list: '',
        keyWord: '',
        type: '请选择卷用途',
        startTime_eq: '',
        endTime_eq: '',
        useType: '请选择卷类型',
        isuse: '请选择状态',
        title: '优惠券详情',
        detail: {},
        useTypeList: [
          {code: '请选择卷类型', name: '请选择卷类型'}
        ],
        typeList: [
          {id: '请选择卷用途', name: '请选择卷用途'}
        ],
        isUseList: [
          {code: '请选择状态', name: '请选择状态'},
          {code: 0, name: '未领用'},
          {code: 1, name: '领用中'},
          {code: 2, name: '已使用'},
          {code: 3, name: '已过期'},
        ],
        showType: false,
        showModal: false,
        tableData: [],
        stateList: [
          {id: 1, name: '这是？'},
        ],
        option: {
          disabledDate(date) {
            return date > new Date();
          }
        },
        columns: [
          {
            title: '序号', width: 70,
            render: (h, params) => h('span', (this.page - 1) * this.limit + params.index + 1)
          },
          {title: '会员账号', key: 'username', width: 120},
          {title: '优惠卷名称', key: 'name', width: 140},
          {
            title: '卷用途', key: 'coupname', width: 140,
            // render: (h, params) => h('span',find(this.typeList,['id','name',params.row.type]))
          },
          {
            title: '卷类型', key: 'useType', width: 140,
            render: (h, params) => h('span', getName(this.useTypeList, params.row.useType))
          },
          {title: '兑换码', key: 'code', width: 140},
          {
            title: '状态', key: 'isuse', width: 140,
            render: (h, params) => h('span', find(this.isUseList, ['code', 'name', params.row.isuse]))
          },
          {title: '领取时间', key: 'recipientsTime', width: 160},
          {
            title: '有效时间', key: 'price', width: 320,
            render: (h, params) => h('span', params.row.beginTime + ' ---- ' + params.row.endTime)
          },
          {title: '使用时间', key: 'spendingTime', width: 160},
          {title: '使用门店', key: 'tenantName', minWidth: 140},
        ],
        rules: {
          name: {required: true, message: '产品名称必填'},
        },
        total: 0,
        showTable: false,
        clearType: false,
        page: 1,
        limit: 25,
      }
    },
    mounted() {
      let data = getDictGroup(this.$store.state.app.dict, '1056');
      for (let i in data) {
        this.useTypeList.push(data[i]);
      }
      this.getType();
      this.showTable = Math.random();
      this.getList();
    },
    watch: {
      showModal(val) {
        if (val) {
          this.useList = deepClone(useList);
        }
      }
    },
    methods: {
      findName(a,b){
        return find(a,b);
      },
      clear(){
        this.list = '';
        this.clearType = Math.random();
      },
      look() {
        let code = this.list.code;
        this.clear();
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
            this.showModal = true;
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
        this.value = val;
        console.log(val);
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
      onRowClick(list) {
        this.list = list;
      },
      getList() {
        this.loading = true;
        this.axios.request({
          baseURL: '/poxy-shqx/',
          url: '/manage/cupon/queryCouponList',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            keyWord: this.keyWord,
            startTime_eq: this.value[0],
            endTime_eq: this.value[1],
            type: this.type == '请选择卷用途' ? '' : this.type,
            useType: this.useType == '请选择卷类型' ? '' : this.useType,
            isuse: this.isuse == '请选择状态' ? '' : this.isuse,
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
        console.log("changePage");
        this.page = page;
        this.getList();
      }
    },
  }
</script>
<style lang="less">
  .discounts-modal .ivu-modal-wrap .ivu-modal .ivu-modal-content .ivu-modal-body {
    height: ~'calc(100% - 45px)';
  }

  .discounts-modal .form-3 {
    padding-top: 20px;
  }

  .discounts-modal .form-3 .ivu-form-item {
    width: 30%;
    display: inline-block;
    margin-bottom: 15px;
  }
</style>
