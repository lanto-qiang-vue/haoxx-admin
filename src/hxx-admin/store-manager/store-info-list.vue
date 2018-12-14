<!--门店信息-->
<template>
  <common-table v-model="tableData" :columns="columns" :total="total" :show="showTable" :page="query.page"
                :loading="loading" class="store-info-list"
                @changePage="changePage" @changePageSize="changePageSize" @onRowClick="onRowClick"
                @onRowDblclick="onRowDblclick">
    <div slot="search">
      <div class="search-block">
        <Input v-model="query.KEYWORD" placeholder="关键字搜索..."></Input>
      </div>
      <div class="search-block">
        <Select v-model="query.CHECK_STATUS_eq" clearable placeholder="审核状态...">
          <Option v-for="(item, index) in CHECK_STATUS_group"
                  :key="index" :value="item.code">{{item.name}}
          </Option>
        </Select>
      </div>
      <div class="search-block">
        <Select v-model="query.STATUS_eq" clearable placeholder="营业状态...">
          <Option v-for="(item, index) in STATUS_group"
                  :key="index" :value="item.code">{{item.name}}
          </Option>
        </Select>
      </div>
      <ButtonGroup size="small">
        <Button type="primary" @click="query.page=1;getList()">
          <Icon type="ios-search" size="24"/>
        </Button>
        <Button type="primary" @click="clear()">
          <Icon type="ios-undo" size="24"/>
        </Button>
      </ButtonGroup>
    </div>
    <div slot="operate">
      <Button type="primary" :disabled="!detailData" @click="edit">查看/编辑</Button>
      <Button type="success" :disabled="!detailData || detailData.CHECK_STATUS != '10351002'" @click="showRecordInfo">
        新增电子健康档案账号
      </Button>
      <Button type="error" v-show="!detailData || detailData.CHECK_STATUS!='10351004'"
              :disabled="!detailData || detailData.CHECK_STATUS != '10351002'" @click="updateCheckStatus">门店停用
      </Button>
      <Button type="success" v-show="detailData && detailData.CHECK_STATUS=='10351004'" :disabled="!detailData"
              @click="updateCheckStatus">门店恢复
      </Button>
      <Button type="primary" :disabled="!detailData" @click="setStore">设置门店版本</Button>
      <Button type="primary" :disabled="canReset" @click="resetStore">重置健康档案账号</Button>
    </div>

    <Modal v-model="showAddModal" @on-visible-change="visibleChange" title="新增电子健康档案账号" :width="400">
      <Form ref="form" :rules="ruleValidate" :model="recordInfo" :label-width="80">
        <FormItem label="门店名称">
          <span>{{storeName}}</span>
        </FormItem>
        <FormItem prop="COMPANYCODE" label="企业编码">
          <Input v-model="recordInfo.COMPANYCODE"></Input>
        </FormItem>
        <FormItem prop="COMPANYPASSWORD" label="登录密码">
          <Input v-model="recordInfo.COMPANYPASSWORD"></Input>
        </FormItem>
      </Form>
    </Modal>
    <Modal v-model="setModal" @on-visible-change="visibleChange" title="选择门店版本" :width="400">
      <Form ref="setData" :rules="setRule" :model="setData" :label-width="120">
        <FormItem label="选择门店版本" prop="ROLE_ID">
          <Select v-model="setData.ROLE_ID">
            <Option v-for="(item, index) in versionList"
                    :key="index" :value="item.ROLE_ID">{{item.ROLE_NAME}}
            </Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="setModal=false">取消</Button>
        <Button type="primary" @click="saveVersion('setData')">保存</Button>
      </div>
    </Modal>
    <Modal v-model="resetModal" @on-visible-change="visibleChange" title="重置健康档案账号" :width="400">
      <Form ref="resetData" :rules="resetRule" :model="resetData" :label-width="120">
        <FormItem label="道路运输许可证号" prop="roadlicense">
          <Input v-model="resetData.roadlicense"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="resetModal=false">取消</Button>
        <Button type="primary" @click="saveReset('resetData')">重置</Button>
      </div>
    </Modal>
    <Modal v-model="showStoreModal" title="门店注册信息" :width="90" footer-hide :transfer="false"
           class="table-modal-detail store-modal" :transition-names="['', '']">
      <div style="height: 100%">
        <store-info-detail :data="detailData" :locale="'admin'" :show="showStoreModal"
                           @save="saveStoreInfo"></store-info-detail>
      </div>
    </Modal>
  </common-table>
</template>

<script>
  import CommonTable from '@/hxx-components/common-table.vue'
  import StoreInfoDetail from '@/hxx-components/store-info-detail.vue'
  import {getName, getDictGroup} from '@/libs/util.js'

  export default {
    components: {CommonTable, StoreInfoDetail},
    name: "store-info-list",
    data() {
      const versionRule = (rule, value, callback) => {
        if (value == '0') {
          callback(new Error('请选择版本'));
        } else {
          callback();
        }
      }
      return {
        versionList:[
          {code:0,name:'基础版本'},
          {code:1,name:'专业版本'},
          {code:2,name:'上传电子健康档案'},
        ],
        storeName:'',
        setModal: false,//控制设置门店版本
        resetModal: false,//重置健康档案
        resetData: {
          roadlicense: '',
        },
        resetRule: {
          roadlicense: [{
            required: true,
            message: '道路许可证必填',
          }]
        },
        setData: {
          tenantId: '',
          ROLE_ID: '',
        },//门店设置信息存储
        setRule: {
          ROLE_ID: [
            {required: true, message: '请选择门店版本'},
            {validator: versionRule, trigger: 'change,blur'}
          ],
        },
        query: {
          KEYWORD: '',
          CHECK_STATUS_eq: '',
          STATUS_eq: '',
          page: 1,
          start: 0,
          limit: 25,
          access_token: this.$store.state.user.token
        },
        showTable: false,
        total: 0,
        loading: true,

        tableData: [],
        columns: [
          {
            title: '序号', minWidth: 70,
            render: (h, params) => h('span', (this.query.page - 1) * this.query.limit + params.index + 1)
          },
          {title: '企业登录账号', key: 'USER_CODE', sortable: true, minWidth: 150},
          {title: '门店商户号', key: 'TENANT_NUM', sortable: true, minWidth: 130},
          {title: '门店名称', key: 'TENANT_NAME', sortable: true, minWidth: 200},
          {title: '门店版本', key: 'ROLE_TYPE', sortable: true, minWidth: 150,
            render: (h, params) => h('span', getName(this.versionList, params.row.ROLE_TYPE))
          },
          {title: '门店地址', key: 'TENANT_ADD', sortable: true, minWidth: 150},
          {title: '联系人姓名', key: 'LINK_MAN', sortable: true, minWidth: 130},
          {title: '联系方式', key: 'LINK_TEL', sortable: true, minWidth: 120},
          {
            title: '营业状态', key: 'STATUS', sortable: true, minWidth: 120,
            render: (h, params) => h('span', getName(this.STATUS_group, params.row.STATUS))
          },
          {
            title: '审核状态', key: 'CHECK_STATUS', sortable: true, minWidth: 120,
            render: (h, params) => h('span', getName(this.CHECK_STATUS_group, params.row.CHECK_STATUS))
          },
          {
            title: '注册时间', key: 'CREATE_TIME', sortable: true, minWidth: 120,
            render: (h, params) => h('span', params.row.CREATE_TIME.substr(0, 10))
          },
          {
            title: '审核时间', key: 'AUDIT_TIME', sortable: true, minWidth: 120,
            render: (h, params) => h('span', params.row.AUDIT_TIME ? params.row.AUDIT_TIME.substr(0, 10) : '')
          },
        ],
        detailData: null,

        showAddModal: false,
        showStoreModal: false,
        recordInfo: {
          COMPANYCODE: '',
          COMPANYPASSWORD: '',
          TENANT_ID: ''
        },
        ruleValidate: {
          COMPANYCODE: [{required: true, message: '必填项不能为空'}],
          COMPANYPASSWORD: [{required: true, message: '必填项不能为空'}],
        }
      }
    },
    computed: {
      CHECK_STATUS_group() {
        return getDictGroup(this.$store.state.app.dict, '1035');
      },
      STATUS_group() {
        return getDictGroup(this.$store.state.app.dict, '1034');
      },
      canReset(){
        let flag = false;
        if(!this.detailData) flag = true;
        if(!flag){
          if(this.detailData.AREA_ID != 1) flag = true;
        }
        return flag;
      }
    },
    mounted() {
      // console.log('mounted')
      this.showTable = true
      this.getList()
    },
    methods: {
      edit(){
        this.getImg(this.detailData.TENANT_ID);
      },
      getImg(id){
        //通过门店id获取对应上传图片 /manage/info/tenantinfo/getTenantPic
        this.axios.request({
          url: '/manage/info/tenantinfo/getTenantPic',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            TENANT_ID:id,
          }
        }).then(res => {
          if (res.success === true) {
            this.detailData["ROAD_FILE_PATH"] = res.data[0].ROAD_FILE_PATH;
            this.detailData["BUS_FILE_PATH"] = res.data[0].BUS_FILE_PATH;
            this.detailData["TENANT_FILE_PATH"] = res.data[0].TENANT_FILE_PATH;
            // console.log(JSON.stringify(this.detailData));
            this.showStoreModal= true;
          }
        })
      },
      visibleChange(){
        this.detailData = null;
      },
      saveReset(name) {
        this.$refs[name].validate((valid) => {
          this.$Modal.confirm({
            title:'系统提示',
            content:'确认重置密码吗?',
            onOk:()=>{
              if (valid) {
                this.axios.request({
                  url: '/manage/info/tenantinfo/editRoadLicense',
                  method: 'post',
                  data: {
                    access_token: this.$store.state.user.token,
                    roadlicense: this.resetData.roadlicense,
                  }
                }).then(res => {
                  if (res.success === true) {
                    if(res.data == false){
                      this.resetModal = false;
                      let self = this;
                      setTimeout(()=>{
                        self.$Modal.error({
                          title: '系统提示',
                          content: '未找到改道路许可证号【' + this.resetData.roadlicense + '】的企业！',
                        });
                      },200)
                    }else{
                      this.$Message.success("重置成功");
                      this.resetModal = false;
                      this.getList();
                    }
                  }
                })
              } else {
                this.$Message.error("请填写道路许可证号");
              }
            }
          });
        })
      },
      resetStore() {
        //重置健康健康档案账号...
        this.resetData.roadlicense = this.detailData.ROAD_LICENSE;
        this.resetModal = true;
      },
      saveVersion(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.axios.request({
              url: '/manage/info/tenantinfo/setTenantType',
              method: 'post',
              data: {
                access_token: this.$store.state.user.token,
                ROLE_ID: this.setData.ROLE_ID,
                tenantId: this.setData.tenantId,
              }
            }).then(res => {
              if (res.success === true) {
                this.$Message.success("版本设置成功");
                this.setModal = false;
                this.getList();
              }
            })
          } else {
            this.$Message.error("请选择版本号");
          }
        });
      },
      getVersion() {
        //获取版本 /manage/info/tenantinfo/getTypeList
        this.axios.request({
          url: '/manage/info/tenantinfo/getTypeList',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            page: 1,
            limit: 25,
          }
        }).then(res => {
          if (res.success == true) {
            this.versionList = res.data;
            this.versionList.unshift({ROLE_ID: 0, ROLE_NAME: '请选择'});
          }
        })
      },
      setStore() {
        this.setData.tenantId = this.detailData.TENANT_ID;
        this.setData.ROLE_ID = 0;
        this.getVersion();
        this.setModal = true;
      },
      getList() {
        this.detailData = null
        this.loading = true
        for (let key in this.query) {
          (this.query[key] === undefined || this.query[key] === null) ? this.query[key] = '' : ''
        }
        this.axios.request({
          url: '/manage/info/tenantinfo/list',
          method: 'post',
          data: this.query
        }).then(res => {
          if (res.success === true) {
            this.tableData = res.data
            this.total = res.total
          }
          this.loading = false
        })
      },
      updateCheckStatus() {
        console.log(this.detailData)
        let showText = this.detailData.CHECK_STATUS == '10351004' ? '恢复' : '停用'
        this.$Modal.confirm({
          title: '确定要' + showText + '该门店吗？',
          onOk: () => {
            this.axios.request({
              url: '/manage/info/tenantinfo/updateCheckStatus',
              method: 'post',
              data: {
                tenantId: this.detailData.TENANT_ID,
                checkStatus: this.detailData.CHECK_STATUS,
                access_token: this.query.access_token
              }
            }).then(res => {
              if (res.success === true) {
                this.$Message.success('门店' + showText + '成功')
                this.getList()
              }
            })
          }
        })
      },
      clear() {
        this.query.KEYWORD = ''
        this.query.CHECK_STATUS_eq = ''
        this.query.STATUS_eq = ''
        this.query.page = 1
        this.getList()
      },
      changePage(page) {
        this.query.page = page
        this.getList()
      },
      changePageSize(size) {
        this.query.limit = size
        this.getList()
      },

      onRowClick(row, index) {
        this.detailData = row
      },
      onRowDblclick(row, index) {
        this.detailData = row
        this.showDetail = Math.random()
      },
      showRecordInfo() {
        this.storeName = this.detailData.TENANT_NAME;
        this.recordInfo.COMPANYCODE = this.detailData.COMPANYCODE
        this.recordInfo.COMPANYPASSWORD = this.detailData.COMPANYPASSWORD
        this.recordInfo.TENANT_ID = this.detailData.TENANT_ID
        this.showAddModal = true
      },
      saveRecord() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.$Modal.confirm({
              title: '确定保存吗？',
              onOk: () => {
                this.axios.request({
                  url: '/manage/info/tenantinfo/saveAccount',
                  method: 'post',
                  data: {
                    data: JSON.stringify(this.recordInfo),
                    access_token: this.query.access_token
                  }
                }).then(res => {
                  if (res.success === true) {
                    this.showAddModal = false;
                    this.getList();
                    this.$Message.success('保存成功');
                  }
                })
              }
            })
          } else {
            // this.$Message.error('Fail!');
          }
        })
      },
      saveStoreInfo(data) {
        this.axios.request({
          url: '/manage/info/tenantinfo/save',
          method: 'post',
          data: {
            data: JSON.stringify(data),
            access_token: this.query.access_token
          }
        }).then(res => {
          if (res.success === true) {
            this.showStoreModal = false
            this.getList()
            this.$Message.success('保存成功');
          }
        })
      }
    }
  }
</script>

<style lang="less">
  .store-info-list {
    .store-modal {
      .ivu-modal-body {
        padding-bottom: 0 !important;
        #store-info-detail .footer {
          border: 0;
          border-top: 1px solid #e8eaec;;
        }
      }
    }
  }
</style>
