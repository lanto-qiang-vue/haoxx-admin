<template>
  <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage"
                :total="total" :show="showTable" :clearSelect="clearType" @onRowClick="onRowClick"
                @onRowDblclick="dbclick" :page="page">
    <div slot="search">
      <div class="search-block">
        <Input v-model="search.keyword" placeholder="公司编号/公司名称..."></Input>
      </div>
      <div class="search-block">
        <Select v-model="search.status" placeholder="请选择状态...">
          <Option v-for="(item, index) in statusList"
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
      <Button type="success" @click="add()">新增</Button>
      <Button type="info" :disabled="cando" @click="edit()">修改</Button>
      <Button type="error" :disabled="cando" @click="remove()">作废</Button>
    </div>
    <Modal
      v-model="showModal"
      class="table-modal-detail"
      title="保险公司"
      width="80"
      :mask-closable="false"
      @on-visible-change="visibleChange"
      :scrollable="true"
      :transfer="false"
      :footer-hide="false"
      :transition-names="['', '']">
      <Collapse v-model="value1">
        <Panel name="1">
          基本信息
          <Form slot="content" :model="formData" ref="formData" :rules="rules" :label-width="120" class="common-form">
            <FormItem label="公司名称:" style="width:45%;" prop="CORP_NAME">
              <Input v-model="formData.CORP_NAME" type="text"> </Input>
            </FormItem>
            <FormItem label="电话号码:" style="width:45%;" prop="TELPHONE">
              <Input v-model="formData.TELPHONE" type="text"> </Input>
            </FormItem>
            <!---->
            <FormItem label="传真:" style="width:30%;">
              <Input v-model="formData.FAX" type="text"> </Input>
            </FormItem>
            <FormItem label="电子邮箱:" style="width:30%;" prop="EMAIL">
              <Input v-model="formData.EMAIL" type="text"> </Input>
            </FormItem>
            <FormItem label="状态:" style="width:30%;">
              <Select v-model="formData.STATUS">
                <Option v-for="(item, index) in statusList"
                        :key="index" :value="item.code">{{item.name}}
                </Option>
              </Select>
            </FormItem>
            <FormItem label="备注:" style="width:95%;">
              <Input v-model="formData.REMARK" type="textarea"></Input>
            </FormItem>
          </Form>
        </Panel>
      </Collapse>
      <div slot="footer">
        <Button @click="addcancle()">取消</Button>
        <Button type="primary" @click="addpost('formData')">保存</Button>
      </div>
    </Modal>
  </common-table>
</template>
<script>
  import commonTable from '@/hxx-components/common-table.vue'
  import env from '_conf/url'
  import {getName, getDictGroup, getCreate} from '@/libs/util.js'

  export default {
    name: 'insurance-companyManage',
    components: {commonTable},
    data() {
      const validatePHONE = (rule, value, callback) => {
        let reg = /^[1][3,4,5,7,8][0-9]{9}$/;
        let tel = /\d{3}-\d{8}/;
        if (value != '' && !reg.test(value) && !tel.test(value)) {
          callback(new Error('联系电话不正确'));
        } else {
          callback();
        }
      };
      const validateEMAIL = (rule, value, callback) => {
        let reg = /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g;
        if (value != '' && !reg.test(value)) {
          callback(new Error('邮箱格式不正确'));
        } else {
          callback();
        }
      };
      return {
        value1: '1',
        page: 1,
        limit: 25,
        showModal: false,
        total: 0,
        tableData: [],
        clearType: false,
        showTable: false,
        IS_DEFAULT: false,
        formData: {
          INSURER_ID:'',
          CORP_NAME: '',
          TELPHONE: '',
          FAX: '',
          EMAIL: '',
          STATUS: '',
          REMARK: '',
        },
        list: '',
        rules: {
          CORP_NAME: [{required: true, message: '名称必填'}],
          TELPHONE: [{validator: validatePHONE, trigger: 'change,blur'}],
          EMAIL: [{validator: validateEMAIL, trigger: 'change,blur'}],
        },
        columns: [
          {title: '序号',  minWidth: 70,
            render: (h, params) => h('span', (this.page-1)*this.limit+params.index+1 )
          },
          {title: '公司编号', key: 'CORP_NO', sortable: true, minWidth: 140},
          {title: '公司名称', key: 'CORP_NAME', sortable: true, minWidth: 140},
          {title: '联系电话', key: 'TELPHONE', sortable: true, minWidth: 140},
          {title: '传真', key: 'FAX', sortable: true, minWidth: 140},
          {title: '邮箱', key: 'EMAIL', sortable: true, minWidth: 140},
          {
            title: '状态', key: 'STATUS', sortable: true, minWidth: 140,
            render: (h, params) => h('span', getName(this.statusList, params.row.STATUS))
          },
        ],
        search: {
          keyword: '',
          status: '',
        },
      }
    },
    methods: {
      add() {
        this.reset();
        this.formData.STATUS = this.statusList[0].code;
        this.showModal = true;
      },
      reset(){
        for(let i in this.formData){
          this.formData[i] = "";
        }
        this.$refs['formData'].resetFields();
      },
      remove() {
        this.$Modal.confirm({title: '系统提示', content: '确认要作废吗?', onOk: this.del});
      },
      del() {
        this.axios.request({
          url: '/manage/basedata/tb_insurer/delete',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            ids: this.list.INSURER_ID,
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
        this.axios.request({
          url: '/manage/basedata/tb_insurer/save',
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
        this.axios.request({
          url: '/manage/basedata/tb_insurer/list',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            limit: this.limit,
            page: this.page,
            KEYWORD: this.search.keyword,
            STATUS_eq: this.search.status || '',
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
        this.showModal = true;
      },
      clear() {
        this.search.keyword = '';
        this.search.status = '';
      },
      clearsection() {
        this.list = '';
        this.clearType = Math.random();
      }
    },
    mounted() {
      this.showTable = Math.random();
      this.search.status = this.statusList[0].code;
      this.base
      this.getList();
    },
    computed: {
      cando() {
        var flag = this.list == '' ? true : false;
        return flag;
      },
      statusList() {
        return getDictGroup(this.$store.state.app.dict, '1001');
      }
    }

  }
</script>
