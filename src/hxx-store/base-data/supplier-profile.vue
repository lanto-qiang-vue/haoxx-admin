<template>
  <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage"
                :total="total" :show="showTable" :page="page" @onRowClick="onRowClick" :clearSelect="clearType" @onRowDblclick="dbclick">
    <div slot="search">
      <div class="search-block">
        <Input v-model="search.keyword" placeholder="供应商编号/名称/联系电话..."></Input>
      </div>
      <div class="search-block">
        <Select v-model="search.status" clearable>
          <Option v-for="(item, index) in defaultList"
                  :key="index" :value="item.code">{{item.name}}
          </Option>
        </Select>
      </div>
      <ButtonGroup>
        <Button type="primary" @click="page=1;getList()">
          搜索
        </Button>
        <!--<Button type="primary" @click="clear()">-->
          <!--<Icon type="ios-undo" size="24"/>-->
        <!--</Button>-->
      </ButtonGroup>
    </div>
    <div slot="operate">
      <Button type="primary" @click="add()">新增</Button>
      <Button type="info" :disabled="cando" @click="edit()">修改</Button>
      <Button type="error" :disabled="cando" @click="remove()">作废</Button>
    </div>
    <Modal
      v-model="showModal"
      class="table-modal-detail full-height"
      title="供应商管理"
      width="100"
      :mask-closable="false"
      @on-visible-change="visibleChange"
      :scrollable="true"
      :transfer="false"
      :footer-hide="false"
      :transition-names="['', '']">
      <modal-title slot="header" title="供应商管理" :state="''" @clickBack="showModal=false"></modal-title>
      <div style="height: 100%;overflow-x:hidden; padding-bottom: 30px;padding-top:10px;">
      <Collapse value="1">
        <Panel name="1">
          供应商基本信息
          <Form slot="content" :model="formData" ref="formData" :rules="rules" :label-width="120" class="common-form">
            <FormItem label="供应商名称:" style="width:30%;" prop="NAME">
              <Input type="text" v-model="formData.NAME"
                     style="min-width: 100%;"> </Input>
            </FormItem>
            <FormItem label="单位地址:" style="width:60%;">
              <Input type="text" v-model="formData.ADDRESS"
                     style="min-width: 100%;"> </Input>
            </FormItem>
            <FormItem label="供应商类型:" style="width:30%;" prop="TYPE">
              <Select v-model="formData.TYPE">
                <Option v-for="(item, index) in list1008"
                        :key="index" :value="item.code">{{item.name}}
                </Option>
              </Select>
            </FormItem>
            <FormItem label="联系人:" style="width:30%;">
              <Input type="text" v-model="formData.LINKMAN"
                     style="min-width: 100%;"> </Input>
            </FormItem>
            <FormItem label="联系电话:" style="width:30%;" prop="TELPHONE">
              <Input type="text" v-model="formData.TELPHONE"
                     style="min-width: 100%;"> </Input>
            </FormItem>
            <FormItem label="单位传真:" style="width:30%;">
              <Input type="text" v-model="formData.FAX"
                     style="min-width: 100%;"> </Input>
            </FormItem>
            <FormItem label="单位邮箱:" style="width:30%;" prop="EMAIL">
              <Input type="text" v-model="formData.EMAIL"
                     style="min-width: 100%;"> </Input>
            </FormItem>
            <FormItem label="发票类型:" style="width:30%;">
              <Select v-model="formData.INVOICE_TYPE">
                <Option v-for="(item, index) in list1009"
                        :key="index" :value="item.code">{{item.name}}
                </Option>
              </Select>
            </FormItem>
            <FormItem label="税号:" style="width:30%;">
              <Input type="text" v-model="formData.TAX_NO"
                     style="min-width: 100%;"> </Input>
            </FormItem>
            <FormItem label="结算方式:" style="width:30%;" prop="BALANCE_TYPE">
              <Select v-model="formData.BALANCE_TYPE">
                <Option v-for="(item, index) in list1010"
                        :key="index" :value="item.code">{{item.name}}
                </Option>
              </Select>
            </FormItem>
            <FormItem label="状态:" style="width:30%;" prop="STATUS">
              <Select v-model="formData.STATUS">
                <Option v-for="(item, index) in defaultList"
                        :key="index" :value="item.code">{{item.name}}
                </Option>
              </Select>
            </FormItem>
            <FormItem label="备注:" style="width:90%;">
              <Input type="textarea" v-model="formData.REMARK"
                     style="min-width: 100%;" placeholder="请输入描述信息..."> </Input>
            </FormItem>
          </Form>
        </Panel>
      </Collapse>
      </div>
      <div slot="footer">
        <Button type="primary" @click="addPost('formData')">保存</Button>
        <Button @click="showModal=false">取消</Button>
      </div>
    </Modal>
  </common-table>
</template>
<script>
  import commonTable from '@/hxx-components/common-table.vue'
  import {getName, getDictGroup, getCreate} from '@/libs/util.js'
  import {deepClone} from "../../libs/util";
  import ModalTitle from '@/hxx-components/modal-title.vue'

  export default {
    name: 'supplier-profile',
    components: {commonTable,ModalTitle},
    activated(){
      this.getRouterData();
    },
    data() {
      const typeRule = (rule, value, callback) => {
        if (this.formData.TYPE == '0') {
          callback(new Error('请选择供应商类型'));
        } else {
          callback();
        }
      }
      const balanceRule = (rule, value, callback) => {
        if (this.formData.BALANCE_TYPE == '0') {
          callback(new Error('请选择结算方式'));
        } else {
          callback();
        }
      }
      const statusRule = (rule, value, callback) => {
        if (this.formData.STATUS == '0') {
          callback(new Error('请选择状态'));
        } else {
          callback();
        }
      }
      const emailRule = (rule, value, callback) => {
        let reg = /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g;
        if (value != '' && !reg.test(value)) {
          callback(new Error('邮箱格式不正确'));
        } else {
          callback();
        }
      }
      return {
        page: 1,
        limit: 25,
        total: 0,
        tableData: [],
        switchType:0,
        showModal: false,
        clearType: false,
        showTable: false,
        routerType:false,
        formData:{},
        storeData: {
          SUPPLIER_ID: "",
          NAME: "",
          ADDRESS: "",
          TYPE: "0",
          LINKMAN: "",
          TELPHONE: "",
          FAX: "",
          EMAIL: "",
          INVOICE_TYPE: "0",
          TAX_NO: "",
          BALANCE_TYPE: "0",
          STATUS: "0",
          REMARK: ""
        },
        list: '',
        rules: {
          NAME: [{required: true, message: '请填写供应商名称'}],
          TYPE: [{required: true, message: '请选择供应商类型'}, {validator: typeRule, trigger: 'change,blur'}],
          BALANCE_TYPE: [{required: true, message: '请选择结算方式'}, {validator: balanceRule, trigger: 'change,blur'}],
          STATUS: [{required: true, message: '请选择状态'}, {validator: statusRule, trigger: 'change,blur'}],
          EMAIL: [{validator: emailRule, trigger: 'change,blur'}],
        },
        columns: [
          {
            title: '序号', minWidth: 80,align:'center',
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
            render: (h, params) => h('span', getCreate(this.$store.state.app.tenant, params.row.CREATER))
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
      getRouterData(){
        let queryData=this.$route.query;
        this.routerType = queryData.type;
        if(this.routerType){
          this.add();
          this.switchType = queryData.switchType;
        }
      },
      addPost(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$Modal.confirm({
              title: '系统提示',
              content: '确认保存吗?',
              onOk: () => {
                ///tenant/basedata/ttsupplier/save
                this.formData.INVOICE_TYPE = this.formData.INVOICE_TYPE == 0 ? '' : this.formData.INVOICE_TYPE;
                this.axios.request({
                  url: '/tenant/basedata/ttsupplier/save',
                  method: 'post',
                  data: {
                    access_token: this.$store.state.user.token,
                    data:JSON.stringify(this.formData)
                  }
                }).then(res => {
                  if (res.success === true) {
                    this.showModal = false;
                    this.getList();
                    let self = this;
                    setTimeout(function(){
                      if(self.routerType && self.switchType == 1){
                        self.routerType = false;
                        self.switchType = 0;
                        self.$router.push({path:'/parts-purchase',query:{type:true}});
                      }
                      if(self.routerType && self.switchType == 2){
                        self.routerType = false;
                        self.switchType = 0;
                        self.$router.push({path:'/parts-back',query:{type:true}});
                      }
                    },200);
                  }
                })
              },
            });
          } else {
            this.$Message.error("请校对红框信息");
          }
        })
      },
      visibleChange() {
        this.clearsection();
      },
      add() {
        this.formData = deepClone(this.storeData);
        this.$refs.formData.resetFields();
        this.showModal = true;
      },
      edit() {
        this.update(this.list);
      },
      update(row){
        this.formData = row;
        //空转0....
        this.formData.INVOICE_TYPE = this.formData.INVOICE_TYPE == '' ? '0' : this.formData.INVOICE_TYPE;
        this.showModal = true;
      },
      remove() {
        this.$Modal.confirm({
          title:'系统提示',
          content:'确认要删除吗?',
          onOk:()=>{
            // /tenant/basedata/ttsupplier/delete
            this.axios.request({
              url: '/tenant/basedata/ttsupplier/delete',
              method: 'post',
              data: {
                access_token: this.$store.state.user.token,
                ids:this.list.SUPPLIER_ID
              }
            }).then(res => {
              if (res.success === true) {
                this.$Message.success("删除成功");
                this.getList();
              }
            })
          }
        });
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
        let data = getDictGroup(this.$store.state.app.dict, '1008');
        data.unshift({code: '0', name: '请选择'});
        return data;
      },
      list1009() {
        let data = getDictGroup(this.$store.state.app.dict, '1009');
        data.unshift({code: '0', name: '请选择'});
        return data;
      },
      list1010() {
        let data = getDictGroup(this.$store.state.app.dict, '1010');
        data.unshift({code: '0', name: '请选择'});
        return data;
      },
      defaultList() {
        let data = getDictGroup(this.$store.state.app.dict, '1001');
        // data.unshift({code: '0', name: '请选择状态...'})
        return data;
      }
    }

  }
</script>

