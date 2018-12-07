<template>
  <Modal
    :transition-names="['', '']"
    v-model="showOnoff"
    class="table-modal-detail"
    title="选择客户"
    width="80"
    :scrollable="true"
    :transfer="true"
    :footer-hide="true"
  >
    <common-table v-model="tableData" :columns="columns" :show="showoff" :total="total" @changePage="changePage"
                  @changePageSize="changePageSize" :showTable="showTable" @onRowClick="onRowClick" :showOperate="false">
      <div slot="search">
        <div class="search-block">
          <Input placeholder="客户编号/手机号/联系电话..." v-model="search.input"></Input>
        </div>
        <div class="search-block">
          <Input placeholder="车牌号码..." v-model="search.num"></Input>
        </div>
        <ButtonGroup>
          <Button type="primary" @click="searchVehicle">搜索</Button>
          <!--<Button type="primary" @click="resetVehicle" style="margin-right:20px; margin-left: 1px;"><Icon type="ios-undo" size="24"/></Button>-->
          <Button type="primary" @click="customeradd" style="margin-left:20px;">
            <Icon type="md-add" size="24"/>
            新增客户
          </Button>
        </ButtonGroup>
      </div>
      <!-- 客户新增 -->
      <Modal
        title="用户新增"
        :transition-names="['', '']"
        v-model="showModal"
        class="table-modal-detail"
        width="80"
        :mask-closable="false"
        :scrollable="false"
        :transfer="true"
      >
        <div>
          <Form ref="formData" :model="formData" :label-width="120" class="common-form" :rules="ruleValidate" inline>
            <FormItem style="margin-left:-80px;width:100%;">
            </FormItem>
            <div></div>
            <FormItem label="客户名称" style="width:30%;" prop="NAME">
              <Input type="text" v-model="formData.NAME" style="min-width: 100%;"> </Input>
            </FormItem>
            <FormItem label="移动电话:" style="width:30%;" prop="MOBILE_PHONE">
              <Input type="text" v-model="formData.MOBILE_PHONE" style="min-width: 100%;"> </Input>
            </FormItem>
            <FormItem label="联系地址:" style="width:30%;">
              <Input type="text" v-model="formData.ADDRESS" style="min-width: 100%;"> </Input>
            </FormItem>
            <div style="clear:both;"></div>
            <FormItem label="固定电话:" style="width:30%;">
              <Input type="text" v-model="formData.TELPHONE" style="min-width: 100%;"> </Input>
            </FormItem>
            <FormItem label="身份证号:" prop="idcard" style="width:30%;">
              <Input type="text" v-model="formData.LICENSE_NO" style="min-width: 100%;"> </Input>
            </FormItem>
            <FormItem label="生日:" style="width:30%;">
              <!--    <Input type="text" style="min-width: 100%;"> </Input> -->
              <Col span="11" style="width:100%;">
                <DatePicker type="date" placeholder="" v-model="formData.BIRTHDAY" format="yyyy-MM-dd"
                            style="min-width: 100%;"></DatePicker>
              </Col>
            </FormItem>
            <FormItem label="性别:" style="width:30%;">
              <Select v-model="formData.SEX" placeholder="" style="min-width: 100%;">
                <Option v-for="(item, index) in sexGroup"
                        :key="index" :value="item.code">{{item.name}}
                </Option>
              </Select>
            </FormItem>
            <FormItem label="客户来源:" style="width:30%;">
              <Select v-model="formData.CUSTOMER_SOURCE" placeholder="" style="min-width: 100%;">
                <Option v-for="(item, index) in resourceGroup"
                        :key="index" :value="item.code">{{item.name}}
                </Option>
              </Select>
            </FormItem>
            <FormItem label="客户等级:" style="width:30%;">
              <Select v-model="formData.CUSTOMER_LEVEL" placeholder="" style="min-width: 100%;">
                <Option v-for="(item, index) in levelGroup"
                        :key="index" :value="item.code">{{item.name}}
                </Option>
              </Select>
            </FormItem>
            <FormItem label="客户类型:" style="width:30%;">
              <Select v-model="formData.CUSTOMER_TYPE" placeholder="" style="min-width: 100%;">
                <Option v-for="(item, index) in typeGroup"
                        :key="index" :value="item.code">{{item.name}}
                </Option>
              </Select>
            </FormItem>
            <FormItem label="QQ:" style="width:30%;">
              <Input type="text" v-model="formData.QQ_NO" style="min-width: 100%;"> </Input>
            </FormItem>
            <FormItem label="微信:" style="width:30%;">
              <Input type="text" v-model="formData.WEIXIN_NO" style="min-width: 100%;"> </Input>
            </FormItem>
            <FormItem label="客户专员:" style="width:30%;">
              <Select v-model="formData.FOLLOW_PERSON" placeholder="" style="min-width: 100%;">
                <Option v-for="(item, index) in attachGroup"
                        :key="index" :value="item.USER_NAME">{{item.USER_NAME}}
                </Option>
              </Select>
            </FormItem>
            <FormItem label="邮箱:" style="width:30%;">
              <Input type="text" v-model="formData.EMAIL" style="min-width: 100%;"> </Input>
            </FormItem>
            <FormItem label="开票税号:" style="width:30%;">
              <Input type="text" v-model="formData.TAX_NO" style="min-width: 100%;"> </Input>
            </FormItem>
          </Form>
          <Form ref="formDatas" :label-width="120">
            <FormItem label="备注:">
              <Input type="textarea" v-model="formData.REMARK" placeholder="请输入备注信息"> </Input>
            </FormItem>
          </Form>
        </div>
        <div slot="footer">
          <Button @click="addcancle">取消</Button>
          <Button type="primary" @click="addpost('formData')">保存</Button>
        </div>
      </Modal>
    </common-table>
  </Modal>
  <!-- 客户新增结束 -->
</template>

<script>
  import commonTable from '@/hxx-components/common-table.vue'
  import {getName, getDictGroup} from '@/libs/util.js'

  export default {
    name: "select-customer",
    props: ['showoff'],
    components: {commonTable},
    data() {
      return {
        showModal: false,
        // collapse: ['1','2'],
        sexGroup: [],
        showTable: false,
        xhide: false,
        resourceGroup: [],
        levelGroup: [],
        typeGroup: [],
        attachGroup: [],
        tableHeight: 500,
        timer: null,
        showOnoff: false,
        tableData: [],
        formData: {
          CUSTOMER_ID: '',
          NAME: '',
          MOBILE_PHONE: '',
          ADDRESS: '',
          TELPHONE: '',
          LICENSE_NO: '',
          BIRTHDAY: '',
          SEX: '',
          CUSTOMER_SOURCE: 0,
          CUSTOMER_LEVEL: 0,
          CUSTOMER_TYPE: 0,
          QQ_NO: '',
          WEIXIN_NO: '',
          FOLLOW_PERSON: '==请选择==',
          EMAIL: '',
          TAX_NO: '',
          REMARK: '',
        },
        columns: [
          {
            title: '序号', width: 70,
            render: (h, params) => h('span', (this.page - 1) * this.limit + params.index + 1)
          },
          {title: '客户名称', key: 'NAME', sortable: true, minWidth: 100},
          {title: '联系电话', key: 'MOBILE_PHONE', sortable: true, minWidth: 150},
          {
            title: '客户类型', key: 'CUSTOMER_TYPE', sortable: true, minWidth: 150,
            render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.CUSTOMER_TYPE))
          },
          {
            title: '客户等级', key: 'CUSTOMER_LEVEL', sortable: true, minWidth: 150,
            render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.CUSTOMER_LEVEL))
          },
          {title: '客户专员', key: 'FOLLOW_PERSON', sortable: true, minWidth: 150},
        ],
        total: 0,
        search: {
          input: '',
          num: '',
        },
        page: 1,
        limit: 25,
        ruleValidate: {
          NAME: [{required: true, message: '客户名称必填', trigger: 'blur'}],
          MOBILE_PHONE: [{required: true, message: '移动电话必填', trigger: 'blur'},
            {type: 'string', pattern: /^[1][3,4,5,7,8][0-9]{9}$/, message: '请输入正确的手机号', trigger: 'change,blur'}
          ],
          idcard: [{
            type: 'string',
            pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
            message: '请输入正确的身份证号码',
            trigger: 'blur'
          }]
        },
      }
    },
    watch: {
      showoff() {
        this.showTable = Math.random();
        this.showOnoff = true;
        this.getList();
      }
    },
    mounted() {
      this.sexGroup = getDictGroup(this.$store.state.app.dict, '1003');
      //默认选中性别第一个
      this.formData.sex = this.sexGroup[0].code;
      //来源组
      this.resourceGroup.push({
        "code": 0,
        "order": 0,
        "group": "1005",
        "name": "请选择"
      });
      var group = getDictGroup(this.$store.state.app.dict, '1005');
      for (var i = 0; i < group.length; i++) {
        this.resourceGroup.push(group[i]);
      }
      //使用0代表空
      this.formData.resource = 0;
      //客户等级
      var group = getDictGroup(this.$store.state.app.dict, '1006');
      this.levelGroup.push({
        "code": 0,
        "order": 0,
        "group": "1006",
        "name": "请选择"
      });
      for (var i = 0; i < group.length; i++) {
        this.levelGroup.push(group[i]);
      }
      this.formData.level = 0;
      //客户类型
      var group = getDictGroup(this.$store.state.app.dict, '1007');
      this.typeGroup.push({
        "code": 0,
        "order": 0,
        "group": "1007",
        "name": "请选择"
      });
      for (var i = 0; i < group.length; i++) {
        this.typeGroup.push(group[i]);
      }
      this.formData.type = 0;
      // console.log(this.$store.state.app.tenant);
      //专员组
      var group = this.$store.state.app.tenant;
      this.attachGroup.push({"USER_ID": 0, "USER_CODE": "", "USER_NAME": "==请选择=="});
      for (var i = 0; i < group.length; i++) {
        this.attachGroup.push(group[i]);
      }
      this.formData.attach = 0;
    },
    methods: {
      customeradd() {
        this.$refs['formData'].resetFields();
        this.showModal = true;
      },
      addcancle() {
        this.showModal = false;
      },
      addpost(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            // alert(1);
            // this.obj = {title:'系统提示!',description:'确认保存吗?',show:Math.random(),funName:'dpost'};
            this.$Modal.confirm({
              title: '系统提示!',
              content: '<div style="color:red;">确认保存吗？</div>',
              onOk: this.addsave,
            });
          } else {
            this.$Message.error("请校对红框信息");
          }
        })
      },
      addsave() {
        this.formData.CUSTOMER_SOURCE = this.formData.CUSTOMER_SOURCE == 0 ? '' : this.formData.CUSTOMER_SOURCE;
        this.formData.CUSTOMER_LEVEL = this.formData.CUSTOMER_LEVEL == 0 ? '' : this.formData.CUSTOMER_LEVEL;
        // alert(this.formData.CUSTOMER_TYPE);
        this.formData.CUSTOMER_TYPE = this.formData.CUSTOMER_TYPE == 0 ? '' : this.formData.CUSTOMER_TYPE;
        // alert(this.formData.CUSTOMER_TYPE);
        this.axios.request({
          url: 'tenant/basedata/ttcustomerfile/save',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            data: JSON.stringify(this.formData)
          }
        }).then(res => {
          if (res.success === true) {
            this.$Message.success('新增成功');
            this.showModal = false;
            this.getList();
          }
        })
      },
      getList() {
        this.axios.request({
          url: '/tenant/basedata/ttcustomerfile/list',
          method: 'post',
          data: {
            KEYWORD: this.search.input,
            page: this.page,
            limit: this.limit,
            PLATE_NUM: this.search.num,
            access_token: this.$store.state.user.token
          }
        }).then(res => {
          if (res.success === true) {
            this.tableData = res.data
            this.total = res.total
          }
        })
      },
      changePage(page) {
        this.page = page
        this.getList()
      },
      changePageSize(size) {
        this.limit = size
        this.getList()
      },
      onRowClick(row, index) {
        this.showOnoff = false;
        this.$emit('select', row);
      },
      searchVehicle() {
        this.page = 1;
        this.getList();
      },
      resetVehicle() {
        for (let i in this.search) {
          this.search[i] = ''
        }
        this.page = 1;
        this.getList();
      }

    }
  }
</script>

<style lang="less" scoped>
  .search-block {
    display: inline-block;
    width: 200px;
    margin-right: 10px;
  }


</style>
