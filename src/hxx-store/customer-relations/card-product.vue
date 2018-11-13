<template>
  <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage"
                :total="total" :show="showTable" @changeSelect="changeSelect" :clearSelect="cleartype"
                @onRowClick="onRowClick" :page="page" @onRowDblclick="dbclick">
    <div slot="search">
      <div class="search-block">
        <Input v-model="search.keyword" placeholder="充值卡名称..."></Input>
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
      <Button type="primary" v-if="accessBtn('add')" @click="add()">新增</Button>
      <Button type="info" v-if="accessBtn('edit')" :disabled="cando" @click="edit()">修改</Button>
      <Button type="error" v-if="accessBtn('ban')" :disabled="cando" @click="remove()">作废</Button>
    </div>
    <!-- 产品新增 -->
    <Modal
      class="table-modal-detail"
      :transition-names="['', '']"
      v-model="showModal"
      title="储值卡产品新增"
      width="90"
      :scrollable="true"
      :transfer="false"
      :footer-hide="false"
      @on-visible-change="visibleChange"
    >
      <!--       <div class="operate">
            <Button type="primary" @click="showModal = false">返回</Button>
            <Button type="primary" @click="save('formData')" style="margin-left:10px;">保存</Button>
          </div> -->
      <div style="height:10px;"></div>
      <Form ref="formData" :model="formData" :label-width="120" :rules="ruleValidate" class="common-form" inline>
        <FormItem label="充值卡产品名称" style="width:30%;" prop="CARD_NAME">
          <Input type="text" v-model="formData.CARD_NAME" style="min-width: 100%;"> </Input>
        </FormItem>
        <FormItem label="售价:" style="width:30%;" prop="SALES_MONEY">
          <InputNumber
            style="width:100%;height:33px;"
            :min="0"
            v-model="formData.SALES_MONEY"></InputNumber>
        </FormItem>
        <FormItem label="赠送价值:" style="width:30%;height:33px;" prop="DERATE_MONEY">
          <InputNumber
            style="width:100%;height:33px;"
            :min="0"
            v-model="formData.DERATE_MONEY"></InputNumber>
        </FormItem>
        <FormItem label="总价值:" style="width:30%;" prop="SUM_MONEY">
          <InputNumber
            style="width:100%;"
            :min="0"
            :disabled="true"
            v-model="formData.SUM_MONEY"></InputNumber>
        </FormItem>
        <FormItem label="有效期(开始):" style="width:30%;" prop="START_DATE">
          <Row>
            <Col span="11" style="width:100%;">
              <DatePicker type="date" v-model="formData.START_DATE" style="min-width: 100%;"></DatePicker>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="有效期(结束):" style="width:30%;" prop="END_DATE">
          <Row>
            <Col span="11" style="width:100%;">
              <DatePicker type="date" v-model="formData.END_DATE" style="min-width: 100%;"></DatePicker>
            </Col>
          </Row>
        </FormItem>
      </Form>
      <Form ref="formInline" :label-width="120">
        <FormItem label="备注:">
          <Input type="textarea" v-model="formData.REMARK" placeholder="请输入备注信息"> </Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="showModal = false">取消</Button>
        <Button type="primary" @click="save('formData')" style="margin-left:10px;">保存</Button>
      </div>
    </Modal>
    <!-- 产品新增 -->
  </common-table>
</template>
<script>
  import commonTable from '@/hxx-components/common-table.vue'
  import {formatDate} from '@/libs/tools.js'
  import mixin from '@/hxx-components/mixin'
  export default {
    name: 'card-product',
    components: {commonTable},
    mixins: [mixin],
    computed: {
      cando() {
        var flag = this.list == '' ? true : false;
        return flag;
      }
    },
    data() {
      return {
        showTable: false,
        showModal: false,
        cleartype: false,
        page: 1,
        limit: 25,
        total: 0,
        tableData: [],
        list: '',//存选择对象
        ids: [],//存选中卡id
        formData: {
          name: '充值了'
        },
        search: {
          keyword: ''
        },
        formData: {
          CARD_ID: '',
          CARD_NAME: '',
          SALES_MONEY: 0,
          DERATE_MONEY: 0,
          SUM_MONEY: 0,
          START_DATE: '',
          END_DATE: '',
          REMARK: ''
        },
        columns: [
          {
            title: '序号', minWidth: 80,
            render: (h, params) => h('span', (this.page - 1) * this.limit + params.index + 1)
          },
          {title: '储值卡名称', key: 'CARD_NAME', sortable: true, minWidth: 150},
          {title: '售价', key: 'SALES_MONEY', sortable: true, minWidth: 100},
          {title: '赠送价值', key: 'DERATE_MONEY', sortable: true, minWidth: 120},
          {
            title: '总价值', key: 'SUM_MONEY', sortable: true, minWidth: 100
          },
          {
            title: '有效期开始', key: 'START_DATE', sortable: true, minWidth: 150,
            render: (h, params) => h('span',params.row.START_DATE.substr(0,10))
          },
          {title: '有效期结束', key: 'END_DATE', sortable: true, minWidth: 150,
            render: (h, params) => h('span',params.row.END_DATE.substr(0,10))
          },
        ],
        ruleValidate: {
          CARD_NAME: [{required: true, message: '储值卡名称必填', trigger: 'blur'}],
          SALES_MONEY: [{required: true, message: '售价必填'}],
          DERATE_MONEY: [{required: true, message: '赠送价值必填'}],
          SUM_MONEY: [{required: true, message: '总价值必填'}],
          START_DATE: [{required: true, message: '有效期开始必填'}],
          END_DATE: [{required: true, message: '有效期结束必填'}],
        }
      }
    },
    methods: {
      visibleChange() {
        this.clearsection();
      },
      clearsection() {
        this.list = '';
        this.cleartype = Math.random();
      },
      onRowClick(row) {
        this.list = row;

      },
      add() {
        this.$refs['formData'].resetFields();
        this.rest();
        this.showModal = true;
      },
      edit() {
        this.$refs['formData'].resetFields();
        // if(this.list.length < 1){
        //   this.$Message.info('未选取数据');
        //   return;
        // }
        // if(this.list.length > 1){
        //   this.$Message.info('只能选择一条数据');
        //   return;
        // }
        this.formData = this.list;
        this.showModal = true;
      },
      remove() {
        this.$Modal.confirm({
          'title': '系统提示',
          'content': '确认要作废吗',
          'onOk': this.del
        });
      },
      del() {
        this.axios.request({
          url: 'tenant/basedata/tt_member_card/cancel',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            ids: this.list.CARD_ID
          }
        }).then(res => {
          if (res.success === true) {
            this.getList();
            this.$Message.info('成功作废');
            this.list = [];
          }
        })
      },
      clear() {
      },
      changePage(page) {
        this.page = page;
        this.getList();
      },
      changePageSize(size) {
        this.limit = size;
        this.page = 1;
        this.getList();
      },
      dbclick(row) {
        this.formData = row;
        this.showModal = true;
        console.log(row);
      },
      getList() {
        this.axios.request({
          url: 'tenant/basedata/tt_member_card/list',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            page: this.page,
            limit: this.limit,
            KEYWORD: this.search.keyword
          }
        }).then(res => {
          if (res.success === true) {
            this.tableData = res.data;
            this.total = res.total;
            this.clearsection();
          }
        })
      },
      changeSelect(row) {
        // this.list = [];
        // this.ids = [];
        // for(var i in row){
        // this.list.push(row[i]);
        // this.ids.push(row[i].CARD_ID);
        // }
      },
      clear() {
        this.search.keyword = '';
      },
      save(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$Modal.confirm({
              title: '系统提示',
              content: '确认保存吗?',
              onOk: this.productAdd,
            });
          } else {
            this.$Message.error("请校对红框信息");
          }
        })
      },
      productAdd() {
        this.formData.START_DATE = formatDate(this.formData.START_DATE);
        this.formData.END_DATE = formatDate(this.formData.END_DATE);
        this.axios.request({
          url: 'tenant/basedata/tt_member_card/save',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            data: JSON.stringify(this.formData)
          }
        }).then(res => {
          if (res.success === true) {
            if (this.formData.CARD_ID > 0) {
              this.$Message.info('修改成功');
            } else {
              this.$Message.info('新增成功');
            }
            this.showModal = false;
            this.getList();
          }
        })
      },
      rest() {
        var data = {
          CARD_ID: '',
          CARD_NAME: '',
          SALES_MONEY: 0,
          DERATE_MONEY: 0,
          SUM_MONEY: 0,
          START_DATE: '',
          END_DATE: '',
          REMARK: ''
        };
        this.formData = data;
      },
    },
    watch: {
      'formData.DERATE_MONEY'(val) {
        var num1 = val ? parseFloat(val) : 0;
        var num2 = this.formData.SALES_MONEY ? parseFloat(this.formData.SALES_MONEY) : 0;
        this.formData.SUM_MONEY = num1 + num2;
      },
      'formData.SALES_MONEY'(val) {
        var num1 = val ? parseFloat(val) : 0;
        var num2 = this.formData.DERATE_MONEY ? parseFloat(this.formData.DERATE_MONEY) : 0;
        this.formData.SUM_MONEY = num1 + num2;
      },
      'formData.END_DATE'(val) {
        if (val != "") {
          let end = new Date(val); //时间对象
          let timeEnd = end.getTime(); //转换成时间戳
          timeEnd = timeEnd / 1000;
          console.log(timeEnd);
          if (this.formData.START_DATE != "") {
            let start = new Date(this.formData.START_DATE);
            let timeStart = start.getTime();
            timeStart = timeStart / 1000;
            console.log(timeStart);
            if(timeStart >= timeEnd){
              this.$Modal.info({
                title:'系统提示',
                content:'结束时间应大于开始时间',
              });
              let self = this;
              setTimeout(function(){
                self.formData.END_DATE = "";
              },500)
            }
          }
        }
      },
      'formData.START_DATE'(val){
        if (val != "") {
          let start = new Date(val); //时间对象
          let timeStart = start.getTime(); //转换成时间戳
          timeStart = timeStart / 1000;;
          if (this.formData.END_DATE != "") {
            let end = new Date(this.formData.END_DATE);
            let timeEnd = end.getTime();
            timeEnd = timeEnd / 1000;
            if(timeStart >= timeEnd){
              this.$Modal.info({
                title:'系统提示',
                content:'开始时间应小于结束时间',
              });
              let self = this;
              setTimeout(function(){
                self.formData.START_DATE = "";
              },500)
            }
          }
        }
      }
    },
    mounted() {
      this.showTable = true;
      this.getList();
    }
  }
</script>
<style lang="less" scoped>
  .operate {
    margin-top: 10px;
    padding: 15px;
    border: 1px solid #dcdee2;
    border-radius: 3px;
    width: 100%;
  }

  .search-block {
    display: inline-block;
    width: 200px;
    margin-right: 10px;
  }

  .ftext {
    text-align: left;
  }
</style>
