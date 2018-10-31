<template>
  <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage"
                :total="total" :show="showTable" :page="page">
    <div slot="search">
      <div class="search-block">
        <Input v-model="search.keyword" placeholder="供应商编号/名称/联系电话..."></Input>
      </div>
      <div class="search-block">
        <Select v-model="search.status">
          <Option v-for="(item, index) in defaultList"
                  :key="index" :value="item.code">{{item.name}}
          </Option>
        </Select>
      </div>
      <ButtonGroup size="small">
        <Button type="primary" @click="page=1;getList()">
          <Icon type="ios-search" size="24"/>
        </Button>
        <Button type="primary" @click="clear()">
          <Icon type="ios-undo" size="24"/>
        </Button>
      </ButtonGroup>
    </div>
    <div slot="operate">
      <Button type="primary" @click="add()">新增</Button>
      <Button type="info" :disabled="cando" @click="edit()">修改</Button>
      <Button type="error" :disabled="cando" @click="remove()">作废</Button>
    </div>
    <Modal
      v-model="showModal"
      class="table-modal-detail"
      title="仓库管理"
      width="90"
      :mask-closable="false"
      @on-visible-change="visibleChange"
      :scrollable="true"
      :transfer="false"
      :footer-hide="false"
      :transition-names="['', '']">
      <Collapse value="1">
        <Panel name="1">
          仓库基本信息
          <Form slot="content" :model="formData" ref="formData" :rules="rules" :label-width="120" class="common-form">
            <FormItem label="会员卡号:" style="width:30%;" prop="MEMBER_CARD_NO">
              <Input type="text" v-model="formData.MEMBER_CARD_NO"
                     style="min-width: 100%;"> </Input>
            </FormItem>
            <FormItem label="会员卡号:" style="width:60%;" prop="MEMBER_CARD_NO">
              <Input type="text" v-model="formData.MEMBER_CARD_NO"
                     style="min-width: 100%;"> </Input>
            </FormItem>
            <FormItem label="会员卡号:" style="width:30%;" prop="MEMBER_CARD_NO">
              <Input type="text" v-model="formData.MEMBER_CARD_NO"
                     style="min-width: 100%;"> </Input>
            </FormItem>
            <FormItem label="会员卡号:" style="width:30%;" prop="MEMBER_CARD_NO">
              <Input type="text" v-model="formData.MEMBER_CARD_NO"
                     style="min-width: 100%;"> </Input>
            </FormItem>
            <FormItem label="会员卡号:" style="width:30%;" prop="MEMBER_CARD_NO">
              <Input type="text" v-model="formData.MEMBER_CARD_NO"
                     style="min-width: 100%;"> </Input>
            </FormItem>
            <FormItem label="会员卡号:" style="width:30%;" prop="MEMBER_CARD_NO">
              <Input type="text" v-model="formData.MEMBER_CARD_NO"
                     style="min-width: 100%;"> </Input>
            </FormItem>
            <FormItem label="会员卡号:" style="width:30%;" prop="MEMBER_CARD_NO">
              <Input type="text" v-model="formData.MEMBER_CARD_NO"
                     style="min-width: 100%;"> </Input>
            </FormItem>
            <FormItem label="会员卡号:" style="width:30%;" prop="MEMBER_CARD_NO">
              <Input type="text" v-model="formData.MEMBER_CARD_NO"
                     style="min-width: 100%;"> </Input>
            </FormItem>
            <FormItem label="会员卡号:" style="width:30%;" prop="MEMBER_CARD_NO">
              <Input type="text" v-model="formData.MEMBER_CARD_NO"
                     style="min-width: 100%;"> </Input>
            </FormItem>
            <FormItem label="会员卡号:" style="width:30%;" prop="MEMBER_CARD_NO">
              <Input type="text" v-model="formData.MEMBER_CARD_NO"
                     style="min-width: 100%;"> </Input>
            </FormItem>
            <FormItem label="会员卡号:" style="width:30%;" prop="MEMBER_CARD_NO">
              <Input type="text" v-model="formData.MEMBER_CARD_NO"
                     style="min-width: 100%;"> </Input>
            </FormItem>
            <FormItem label="会员卡号:" style="width:30%;" prop="MEMBER_CARD_NO">
              <Input type="text" v-model="formData.MEMBER_CARD_NO"
                     style="min-width: 100%;"> </Input>
            </FormItem>
            <FormItem label="会员卡号:" style="width:30%;" prop="MEMBER_CARD_NO">
              <Input type="text" v-model="formData.MEMBER_CARD_NO"
                     style="min-width: 100%;"> </Input>
            </FormItem>
            <FormItem label="会员卡号:" style="width:30%;" prop="MEMBER_CARD_NO">
              <Input type="text" v-model="formData.MEMBER_CARD_NO"
                     style="min-width: 100%;"> </Input>
            </FormItem>
            <FormItem label="会员卡号:" style="width:30%;" prop="MEMBER_CARD_NO">
              <Input type="text" v-model="formData.MEMBER_CARD_NO"
                     style="min-width: 100%;"> </Input>
            </FormItem>
            <FormItem label="会员卡号:" style="width:30%;" prop="MEMBER_CARD_NO">
              <Input type="text" v-model="formData.MEMBER_CARD_NO"
                     style="min-width: 100%;"> </Input>
            </FormItem>
            <FormItem label="会员卡号:" style="width:30%;" prop="MEMBER_CARD_NO">
              <Input type="text" v-model="formData.MEMBER_CARD_NO"
                     style="min-width: 100%;"> </Input>
            </FormItem>
            <FormItem label="会员卡号:" style="width:30%;" prop="MEMBER_CARD_NO">
              <Input type="text" v-model="formData.MEMBER_CARD_NO"
                     style="min-width: 100%;"> </Input>
            </FormItem>
            <FormItem label="会员卡号:" style="width:30%;" prop="MEMBER_CARD_NO">
              <Input type="text" v-model="formData.MEMBER_CARD_NO"
                     style="min-width: 100%;"> </Input>
            </FormItem>
            <FormItem label="会员卡号:" style="width:30%;" prop="MEMBER_CARD_NO">
              <Input type="text" v-model="formData.MEMBER_CARD_NO"
                     style="min-width: 100%;"> </Input>
            </FormItem>
            <FormItem label="会员卡号:" style="width:80%;" prop="MEMBER_CARD_NO">
              <Input type="textarea" v-model="formData.MEMBER_CARD_NO"
                     style="min-width: 100%;"> </Input>
            </FormItem>
          </Form>
        </Panel>
      </Collapse>
      <div slot="footer">
        <Button @click="addcancle()">取消</Button>
        <Button type="primary" @click="addpost('list')">保存</Button>
      </div>
    </Modal>
  </common-table>
</template>
<script>
  import commonTable from '@/hxx-components/common-table.vue'
  import {getName, getDictGroup, getCreate} from '@/libs/util.js'

  export default {
    name: 'supplier-profile',
    components: {commonTable},
    data() {
      return {
        page: 1,
        limit: 25,
        total: 0,
        tableData: [],
        showModal: false,
        clearType: false,
        showTable: false,
        formData: {},
        list: '',
        rules: {},
        columns: [
          {
            title: '序号', minWidth: 80,
            render: (h, params) => h('span', (this.page - 1) * this.limit + params.index + 1)
          },
          {title: '供应商名称', key: 'NAME', sortable: true, minWidth: 140},
          {
            title: '供应商类型', key: 'TYPE', sortable: true, minWidth: 140,
            render: (h, params) => h('span', getName(this.list1008, params.row.TYPE))
          },
          {title: '联系人', key: 'LINKMAN', sortable: true, minWidth: 140},
          {title: '联系电话', key: 'TELPHONE', sortable: true, minWidth: 140},
          {title: '单位地址', key: 'ADDRESS', sortable: true, minWidth: 140},
          {
            title: '结算方式', key: 'BALANCE_TYPE', sortable: true, minWidth: 140,
            render: (h, params) => h('span', getName(this.list1010, params.row.BALANCE_TYPE))
          },
          {title: '税号', key: 'TAX_NO', sortable: true, minWidth: 140},
          {
            title: '发票类型', key: 'INVOICE_TYPE', sortable: true, minWidth: 140,
            render: (h, params) => h('span', getName(this.list1009, params.row.INVOICE_TYPE))
          },
          {
            title: '创建人', key: 'CREATER', sortable: true, minWidth: 140,
          },
          {
            title: '创建时间', key: 'CREATE_TIME', sortable: true, minWidth: 140,
            render: (h, params) => h('span', params.row.CREATE_TIME.substr(0, 10))
          }
        ],
        search: {
          keyword: '',
          status: '',
        },
      }
    },
    methods: {
      visibleChange() {
      },
      add() {
        this.showModal = true;
      },
      edit() {
      },
      remove() {
      },
      changePage(page) {
        this.page = page;
        this.getList();
      },
      changePageSize(size) {
        this.limit = size;
        this.getList();
      },
      getList() {
        this.axios.request({
          url: '/tenant/basedata/ttsupplier/list',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            limit: this.limit,
            page: this.page,
            KEYWORD: this.search.keyword,
            STATUS_eq: this.search.status == 0 ? '' : this.search.status
          }
        }).then(res => {
          if (res.success === true) {
            this.tableData = res.data;
            this.total = res.total;
          }
        })
        this.clearsection();
      },
      onRowClick(row) {

      },
      dbclick(row) {
      },
      clear() {
        this.search.keyword = '';
        this.search.status = '0';
      },
      clearsection() {
        this.list = '';
        this.clearType = Math.random();
      }
    },
    mounted() {
      this.showTable = Math.random();
      this.search.status = this.defaultList[0].code;
      this.getList();
    },
    computed: {
      cando() {
        var flag = this.list == '' ? true : false;
        return flag;
      },
      list1008() {
        return getDictGroup(this.$store.state.app.dict, '1008');
      },
      list1009() {
        return getDictGroup(this.$store.state.app.dict, '1009');
      },
      list1010() {
        return getDictGroup(this.$store.state.app.dict, '1010');
      },
      defaultList() {
        let data = getDictGroup(this.$store.state.app.dict, '1001');
        data.unshift({code: '0', name: '请选择状态...'})
        return data;
      }
    }

  }
</script>

