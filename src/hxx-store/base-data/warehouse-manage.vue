<template>
  <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage"
                :total="total" :show="showTable" :clearSelect="clearType" @onRowClick="onRowClick"
                @onRowDblclick="dbclick" :page="page">
    <div slot="search">
      <div class="search-block">
        <Input v-model="search.keyword" placeholder="仓库编号/名称..."></Input>
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
      <Button type="primary" @click="add()" v-if="accessBtn('add')">新增</Button>
      <Button type="info" :disabled="cando" @click="edit()" v-if="accessBtn('edit')">修改</Button>
      <Button type="error" :disabled="cando" @click="remove()" v-if="accessBtn('cancel')">作废</Button>
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
      <Collapse v-model="value1">
        <Panel name="1">
          仓库基本信息
          <Form slot="content" :model="formData" ref="list" :rules="rules" :label-width="120" class="common-form">
            <FormItem label="仓库名称:" style="width:30%;" prop="NAME">
              <Input v-model="formData.NAME" type="text"> </Input>
            </FormItem>
            <FormItem label="仓库地址:" style="width:30%;">
              <Input v-model="formData.ADDRESS" type="text"> </Input>
            </FormItem>
            <FormItem label="默认仓库:">
              <i-switch v-model="IS_DEFAULT" size="large">
                <span slot="open">是</span>
                <span slot="close">否</span>
              </i-switch>
            </FormItem>
          </Form>
        </Panel>
        <Panel name="3">
          其他状况描述:
          <div slot="content">
            <Form slot="content" ref="lists" class="common-form">
              <Input type="textarea" v-model="formData.REMARK" placeholder="请输入备注信息..."> </Input>
            </Form>
          </div>
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
  import mixin from '@/hxx-components/mixin'
  import {deepClone} from "../../libs/util";

  export default {
    name: 'warehouse-manage',
    components: {commonTable},
    mixins: [mixin],
    data() {
      return {
        value1: [1,3],
        page: 1,
        limit: 25,
        showModal: false,
        total: 0,
        tableData: [],
        clearType: false,
        showTable: false,
        IS_DEFAULT: false,
        storeData: {
          NAME: '',
          ADDRESS: '',
          IS_DEFAULT: '',
          REMARK: '',
        },
        formData: {},
        list: '',
        rules: {
          NAME: [{required: true, message: '名称必填'}]
        },
        columns: [
          {title: '仓库编号', key: 'STORE_NO', sortable: true, minWidth: 140},
          {title: '仓库名称', key: 'NAME', sortable: true, minWidth: 140},
          {title: '所在地', key: 'ADDRESS', sortable: true, minWidth: 140},
          {
            title: '是否默认仓库', key: 'IS_DEFAULT', sortable: true, minWidth: 140,
            render: (h, params) => h('span', getName(this.defaultList, params.row.IS_DEFAULT))
          },
        ],
        search: {
          keyword: '',
        },
      }
    },
    methods: {
      add() {
        this.formData = deepClone(this.storeData);
        this.$refs['list'].resetFields();
        this.IS_DEFAULT = false;
        this.showModal = true;
      },
      remove() {
        this.$Modal.confirm({title: '系统提示', content: '确认要作废吗?', onOk: this.del});
      },
      del() {
        // /tenant/basedata/ttstorehouse/cancel
        this.axios.request({
          url: '/tenant/basedata/ttstorehouse/cancel',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            ids: this.list.STORE_ID,
          }
        }).then(res => {
          if (res.success === true) {
            this.getList();
          }
        })
      },
      edit() {
        this.update(this.list);
      },
      visibleChange() {
        this.clearsection();
      },
      addcancle() {
        this.showModal = false;
      },
      addpost(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$Modal.confirm({
              title: '系统提示',
              content: '确认保存吗?',
              onOk: this.tosave,
            });
          } else {
            this.$Message.error("请校对红框信息");
          }
        })
      },
      tosave() {
        ///tenant/basedata/ttstorehouse/save
        this.formData.IS_DEFAULT = this.IS_DEFAULT === true ? this.defaultList[0].code : this.defaultList[1].code;
        this.axios.request({
          url: '/tenant/basedata/ttstorehouse/save',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            data: JSON.stringify(this.formData),
          }
        }).then(res => {
          if (res.success === true) {
            this.showModal = false;
            this.getList();
          }
        })
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
        ///tenant/basedata/ttstorehouse/list
        this.axios.request({
          url: '/tenant/basedata/ttstorehouse/list',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            limit: 25,
            page: 1,
            KEYWORD: this.search.keyword,
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
        this.list = row;
      },
      dbclick(row) {
        this.update(row);
      },
      update(row) {
        this.formData = row;
        this.IS_DEFAULT = row.IS_DEFAULT == this.defaultList[0].code ? true : false;
        this.showModal = true;
      },
      clear() {
        this.search.keyword = '';
      },
      clearsection() {
        this.list = '';
        this.clearType = Math.random();
      }
    },
    mounted() {
      this.showTable = Math.random();
      this.getList();
    },
    computed: {
      cando() {
        var flag = this.list == '' ? true : false;
        return flag;
      },
      defaultList() {
        return getDictGroup(this.$store.state.app.dict, '1004');
      }
    }

  }
</script>
