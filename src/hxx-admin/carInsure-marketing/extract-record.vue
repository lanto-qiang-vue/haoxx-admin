<template>
  <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage"
                :total="total" :show="showTable" :page="page" :loading="loading" @onRowClick="rowClick"
                :clearSelect="clearSelect">
    <div slot="search">
      <div class="search-block">
        <DatePicker format="yyyy/MM/dd" v-model="time" type="daterange" placeholder="提现日期"
                    style="width:250px"></DatePicker>
      </div>
      <div class="search-block">
        <Input placeholder="门店" v-model="KEYWORD"></Input>
      </div>
      <div class="search-block">
        <Select placeholder="请选择状态..." v-model="status">
          <Option v-for="(item, index) in statusList"
                  :key="index" :value="item.id">{{item.name}}
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
      <Button type="primary" @click="extractSuccess" :disabled="row.CASH_STATUS != 0">提现成功</Button>
      <Button type="primary" :disabled="row.CASH_STATUS != 1" @click="cancel('取消提现成功')">取消提现成功</Button>
      <Button type="primary" :disabled="row.CASH_STATUS != 0" @click="extractError">提现失败</Button>
      <Button type="primary" :disabled="row.CASH_STATUS != 2" @click="cancel('取消提现失败')">取消提现失败</Button>
      <Button type="primary" :disabled="row.CASH_STATUS != 1" @click="look">查看打款图</Button>
    </div>
    <Modal v-model="showModal" title="提现成功" :width="450" :mask-closable="false">
      <!--stage == 1 成功应该提交的-->
      <Form ref="formData" :rules="rule" :model="formData" :label-width="120" style="width:370px;" v-show="stage == 1">
        <FormItem label="付款银行" prop="PAY_BANK">
          <Input v-model="formData.PAY_BANK"></Input>
        </FormItem>
        <FormItem label="付款银行账户" prop="PAY_ACCOUNT">
          <Input v-model="formData.PAY_ACCOUNT"></Input>
        </FormItem>
        <FormItem label="付款银行账号" prop="PAY_CARD">
          <Input v-model="formData.PAY_CARD" @on-keyup="up"></Input>
        </FormItem>
        <FormItem label="操作时间" prop="HANDLE_DATE">
          <DatePicker v-model="formData.HANDLE_DATE" format="yyyy/MM/dd hh:mm:ss" type="datetime"
                      style="width:250px"></DatePicker>
        </FormItem>
        <FormItem label="操作人" prop="HANDLE_ID">
          <Select placeholder="请选择操作人" v-model="formData.HANDLE_ID">
            <Option v-for="(item, index) in personList"
                    :key="index" :value="item.USER_ID">{{item.USER_NAME}}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="打款截图" prop="CASH_IMAGE">
          <img64 @back="back"></img64>
        </FormItem>
      </Form>
      <!--stage == 2 提现失败原因-->
      <Form ref="errorData" :rules="rule1" :model="errorData" :label-width="120" style="width:370px;"
            v-show="stage == 2">
        <FormItem label="付款失败原因" prop="REMARK">
          <Input v-model="errorData.REMARK"></Input>
        </FormItem>
        <FormItem label="操作时间" prop="HANDLE_DATE">
          <DatePicker v-model="errorData.HANDLE_DATE" format="yyyy/MM/dd hh:mm:ss" type="datetime"
                      style="width:250px"></DatePicker>
        </FormItem>
        <FormItem label="操作人" prop="HANDLE_ID">
          <Select placeholder="请选择操作人" v-model="errorData.HANDLE_ID">
            <Option v-for="(item, index) in personList"
                    :key="index" :value="item.USER_ID">{{item.USER_NAME}}
            </Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="showModal=false">取消</Button>
        <Button type="primary" @click="save()">保存</Button>
      </div>
    </Modal>
  </common-table>
</template>

<script>
  import commonTable from '@/hxx-components/common-table.vue'
  import img64 from '@/hxx-components/img64.vue'
  import {deepClone} from "../../libs/util";

  export default {
    name: "extract-record",
    components: {commonTable, img64},
    data() {
      return {
        tableData: [],
        clearSelect: false,
        loading: false,
        showModal: false,
        time: [],
        stage: 2,
        oldValue:'',
        formData: {
          id: '',
          access_token: this.$store.state.user.token,
          PAY_BANK: '',
          PAY_ACCOUNT: '',
          PAY_CARD: '',
          HANDLE_DATE: '',
          HANDLE_ID: '',
          CASH_IMAGE: '',
        },
        errorData: {
          id: '',
          access_token: this.$store.state.user.token,
          REMARK: '',
          HANDLE_DATE: '',
          HANDLE_ID: '',
        },
        rule: {
          PAY_BANK: {required: true, message: '必填'},
          PAY_ACCOUNT: {required: true, message: '必填'},
          PAY_CARD: {required: true, message: '必填'},
          HANDLE_DATE: {required: true, message: '必填'},
          HANDLE_ID: {required: true, message: '必填'},
          CASH_IMAGE: {required: true, message: '图片必填'},
        },
        rule1: {
          REMARK: {required: true, message: '必填'},
          HANDLE_DATE: {required: true, message: '必填'},
          HANDLE_ID: {required: true, message: '必填'},
        },
        columns: [
          {
            title: '序号', width: 70, align: 'center',
            render: (h, params) => h('span', (this.page - 1) * this.limit + params.index + 1)
          },
          {title: '提现时间', width: 160, key: 'CREATE_DATE'},
          {title: '门店', width: 200, key: 'TENANT_NAME'},
          {title: '提现人', width: 100, key: 'USER_NAME'},
          {title: '金额', width: 100, key: 'CASH_AMOUNT'},
          {title: '银行', width: 200, key: 'BANK_NAME'},
          {title: '账户名称', width: 100, key: 'BANK_USER'},
          {title: '账号', width: 200, key: 'BANK_CARD'},
          {
            title: '状态', width: 140, key: 'CASH_STATUS',
            render: (h, params) => h('span', this.statusToString(params.row.CASH_STATUS))
          },
          {title: '付款银行', width: 150, key: 'PAY_BANK'},
          {title: '付款银行账户', width: 160, key: 'PAY_ACCOUNT'},
          {title: '付款银行账号', width: 200, key: 'PAY_CARD'},
          {title: '操作时间', width: 160, key: 'HANDLE_DATE'},
          {title: '操作人', width: 100, key: 'HANDLE_NAME'},
          {title: '备注', width: 140, key: 'REMARK'},
        ],
        total: 0,
        page: 1,
        limit: 25,
        status: -1,
        KEYWORD: '',
        showTable: true,
        row: '',
        statusList: [
          {id: -1, name: '请选择状态'},
          {id: 0, name: '申请中'},
          {id: 1, name: '已打款'},
          {id: 2, name: '提现失败'}
        ],
        personList: [],
      }
    },
    mounted() {
      this.showTable = Math.random();
      this.getList();
    },
    methods: {
      up(event) {
        //银行格式...
        let text = event.target.value.split(' ');
        text = text.join('');
        let reg = /^\d+$/;
        if(reg.test(text)){
          this.oldValue = text;
        }else{
          if(text == ''){
            text = '';
          }else{
            text = this.oldValue;
          }
        }
        let str = "";
          for(let i = 0;i<text.length;i++){
            str += text[i];
            if((i+1)%4 == 0){
              str += " ";
            }
        }
         str = str.trim();
         event.target.value = str;
      },
      look() {
        let id = this.row.id;
        this.clear();
        this.axios.request({
          url: '/manage/hxxpay/cashFlow/checkCashImage',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            id: id,
          },
        }).then(res => {
          if (res.success === true) {
            let query = {img: res.data};
            this.$router.push({path: '/store-img', query: query});
          }
        })
      },
      extractError() {
        this.getPerson();
        this.showModal = Math.random();
        this.stage = 2;
        this.$refs.errorData.resetFields();
        this.errorData.HANDLE_DATE = new Date();
        this.errorData.HANDLE_ID = this.$store.state.user.userInfo.user.userId;
        this.errorData.id = this.row.id;
        this.errorData.REMARK = "";
        this.clear();
      },
      cancel(message) {
        let id = this.row.id;
        this.clear();
        this.$Modal.confirm({
          title: '系统提示',
          content: '是否' + message,
          onOk: () => {
            this.axios.request({
              url: '/manage/hxxpay/cashFlow/cancelCash',
              method: 'post',
              data: {
                access_token: this.$store.state.user.token,
                id: id,
              },
            }).then(res => {
              if (res.success === true) {
                this.getList();
              }
            })
          }
        });
      },
      clear() {
        this.clearSelect = Math.random();
        this.row = "";
      },
      statusToString(id) {
        for (let i in this.statusList) {
          if (this.statusList[i].id == id) return this.statusList[i].name;
        }
        return '';
      },
      save() {
        if (this.stage == 1) {
          this.$refs.formData.validate((valid) => {
            if (valid) {
              let data = deepClone(this.formData);
              let time = data.HANDLE_DATE;
              data.HANDLE_DATE = time.getFullYear() + '-' + this.fillZero(time.getMonth() + 1) + '-' + this.fillZero(time.getDate()) + " " + this.fillZero(time.getHours()) + ":" + this.fillZero(time.getMinutes()) + ":" + this.fillZero(time.getSeconds());
              this.$Modal.confirm({
                title: '系统提示',
                content: '确认提现成功吗?',
                onOk: () => {
                  this.axios.request({
                    url: '/manage/hxxpay/cashFlow/saveSuccess',
                    method: 'post',
                    data: data,
                  }).then(res => {
                    if (res.success === true) {
                      this.getList();
                      this.showModal = false;
                    }
                  })
                }
              });
              // console.log(JSON.stringify(this.formData));
            } else {
              this.$Message.error("请校对红框信息");
            }
          });
        } else {
          this.$refs.errorData.validate((valid) => {
            if (valid) {
              let data = deepClone(this.errorData);
              let time = data.HANDLE_DATE;
              data.HANDLE_DATE = time.getFullYear() + '-' + this.fillZero(time.getMonth() + 1) + '-' + this.fillZero(time.getDate()) + " " + this.fillZero(time.getHours()) + ":" + this.fillZero(time.getMinutes()) + ":" + this.fillZero(time.getSeconds());
              this.$Modal.confirm({
                title: '系统提示',
                content: '确认提现失败吗?',
                onOk: () => {
                  this.axios.request({
                    url: '/manage/hxxpay/cashFlow/saveFail',
                    method: 'post',
                    data: data,
                  }).then(res => {
                    if (res.success === true) {
                      this.getList();
                      this.showModal = false;
                    }
                  })
                }
              });
            } else {
              this.$Message.error("请校对红框信息");
            }
          })
        }
      },
      extractSuccess() {
        this.showModal = true;
        this.stage = 1;
        this.$refs.formData.resetFields();
        this.formData.HANDLE_DATE = new Date();
        this.getPerson();
        this.formData.HANDLE_ID = this.$store.state.user.userInfo.user.userId;
        this.formData.id = this.row.id;
        this.oldValue = "";
        this.clear();
      },
      getPerson() {
        this.axios.request({
          url: '/manage/hxxpay/cashFlow/sysUserList',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
          },
        }).then(res => {
          if (res.success === true) {
            this.personList = res.data;
          }
        })
      },
      back(resource) {
        if (resource != null) this.formData.CASH_IMAGE = resource;
        else this.formData.CASH_IMAGE = "";
        this.$refs.formData.validate('CASH_IMAGE');
      },
      changePageSize(size) {
        this.limit = size;
        this.getList();
      },
      changePage(page) {
        this.page = page;
        this.getList();
      },
      rowClick(row) {
        this.row = row;
      },
      startTime(time) {
        if (time == '') return '';
        return time.getFullYear() + "-" + this.fillZero(time.getMonth() + 1) + "-" + this.fillZero(time.getDate()) + " 00:00:00";
      },
      endTime(time) {
        if (time == '') return '';
        return time.getFullYear() + "-" + this.fillZero(time.getMonth() + 1) + "-" + this.fillZero(time.getDate()) + " 23:59:59";
      },
      fillZero(val) {
        return val >= 10 ? val : '0' + val;
      },
      getList() {
        this.loading = true;
        this.row = '';
        this.axios.request({
          url: '/manage/hxxpay/cashFlow/list',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            KEYWORD: this.KEYWORD,
            START_DATE: this.startTime(this.time[0] || ''),
            END_DATE: this.endTime(this.time[1] || ''),
            STATUS: this.status == -1 ? '' : this.status,
            limit: this.limit,
            page: this.page,
          },
        }).then(res => {
          if (res.success === true) {
            this.total = res.total;
            this.tableData = res.data;
            this.loading = false;
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
