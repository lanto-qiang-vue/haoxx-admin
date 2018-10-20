<!--车型-->
<template>
  <div style="width:100%;height:100%;">
    <Split v-model="split" :min="0.1" :max="0.5" class="split">
      <div slot="left" class="split-pane">
        <Tree :data="treeData" @on-select-change="select"></Tree>
        <Spin size="large" fix v-if="spinShow"></Spin>
      </div>
      <div slot="right" class="split-pane">
        <common-table v-model="tableData" :columns="columns" :total="total" :show="showTable"
                      @changePage="changePage" @changePageSize="changePageSize" :clearSelect="clearType"
                      @onRowClick="onRowClick">
          <div slot="search">
            <div class="search-block">
              <Input v-model="KEYWORD" placeholder="项目编号/名称..."></Input>
            </div>
            <div class="search-block">
              <Input v-model="currently" :disabled="true"></Input>
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
            <Button type="primary" @click="add">新增</Button>
            <Button type="info" :disabled="cando" @click="edit">修改</Button>
            <Button type="error" :disabled="cando" @click="del">删除</Button>
          </div>
        </common-table>
      </div>
    </Split>
    <Modal
      v-model="customModal"
      class="table-modal-detail"
      :title="'一二类维修项目'"
      width="90"
      @on-visible-change="visibleChange"
      :mask-closable="false"
      :scrollable="true"
      :transfer="false"
      :footer-hide="false"
      :transition-names="['', '']">
      <Collapse v-model="value1">
        <Panel name="1">
          项目基本信息
          <Form slot="content" :model="formData" ref="list" :label-width="150" :rules="ruleValidate"
                class="common-form">
            <FormItem label="项目名称:" style="width:30%;" prop="NAME">
              <Input type="text" v-model="formData.NAME"> </Input>
            </FormItem>
            <FormItem label="项目分类:" style="width:30%;" prop="TYPE_ID">
              <Select v-model="formData.TYPE_ID" style="min-width: 100%;">
                <Option v-for="(item, index) in caritems"
                        :key="index" :value="item.TYPE_ID">{{item.TYPE_NAME}}
                </Option>
              </Select>
            </FormItem>
            <FormItem label="状态:" style="width:30%;" prop="STATUS">
              <Select v-model="formData.STATUS" style="min-width: 100%;">
                <Option v-for="(item, index) in statusList2"
                        :key="index" :value="item.code">{{item.name}}
                </Option>
              </Select>
            </FormItem>
            <FormItem label="计费标准:" style="width:40%;">
              <RadioGroup v-model="formData.CHARGE_TYPE">
                <Radio v-for="(item,index) in group" :key="index" :label="item.code">{{item.name}}</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="快速开单" style="width:20%;">
              <i-switch v-model="formData.IS_QUICK_BALANCE" size="large">
                <span slot="open">On</span>
                <span slot="close">Off</span>
              </i-switch>
            </FormItem>
            <FormItem label="门店是否能修改名称" style="width:20%;">
              <i-switch v-model="formData.IS_PREINSTALL" size="large">
                <span slot="open">是</span>
                <span slot="close">否</span>
              </i-switch>
            </FormItem>
            <FormItem :label="description" style="width:30%;">
              <InputNumber
                style="width:100%;height:33px;"
                :min="0"
                v-model="number"
                :formatter="value => `${value}`+des"
                :parser="value => value.replace(des, '')"></InputNumber>
            </FormItem>
          </Form>
        </Panel>
      </Collapse>
      <Collapse v-model="value2">
        <Panel name="2">
          备注描述
          <Form slot="content" ref="lists" class="common-form">
            <Input type="textarea" v-model="formData.REMARK" placeholder="请输入故障描述"> </Input>
          </Form>
        </Panel>
      </Collapse>
      <div style="height:60px;"></div>
      <div slot="footer">
        <Button @click="addcancle()">取消</Button>
        <Button type="primary" @click="addpost('list')">保存</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import commonTable from '@/hxx-components/common-table.vue'
  import {getName, getDictGroup} from '@/libs/util.js'
  import env from '_conf/url'

  export default {
    name: "oneTwo-maintain",
    data() {
      const classifyRule = (rule, value, callback) => {
        if (this.formData.TYPE_ID != 0) {
          callback();
        } else {
          callback(new Error('请选择项目分类'));
        }
      }
      return {
        page: 1,
        value1: '1',
        value2: '2',
        des: '元',
        description: '标准金额',
        limit: 25,
        total: 0,
        split: 0.2,
        value1: '1',
        tableData: [],
        customModal: false,
        list: "",
        number: 0,
        showTable: false,
        treeData: [],
        treeKeyword: '',
        clearType: false,
        spinShow: false,
        currently: '全部',
        columns: [
          {
            title: '序号', minWidth: 70,
            render: (h, params) => h('span', (this.page - 1) * this.limit + params.index + 1)
          },
          {title: '维修项目编号', key: 'ITEM_NO', minWidth: 130},
          {title: '维修项目名称', key: 'NAME', minWidth: 130},
          {title: '项目分类', key: 'TNAME', minWidth: 130},
          {
            title: '计费标准', key: 'CHARGE_TYPE', minWidth: 130,
            render: (h, params) => h('span', getName(this.chargeList, params.row.CHARGE_TYPE))
          },
          {title: '标准金额(元)', key: 'REPAIR_MONEY', minWidth: 130},
          {title: '标准工时(小时)', key: 'REPAIR_TIME', minWidth: 140},
          {title: '油漆面数(面)', key: 'PAINT_NUM', minWidth: 120},
          {
            title: '门店能否修改', key: 'IS_PREINSTALL', minWidth: 140,
            render: (h, params) => h('span', getName(this.statusList, params.row.IS_PREINSTALL))
          }
        ],
        group: [],
        caritems: [],
        number: 0,
        ruleValidate: {
          NAME: [{required: true, message: '项目名称必填'}],
          TYPE_ID: [
            {required: true},
            {validator: classifyRule, trigger: 'blur'}
          ],
        },
        KEYWORD: '',
        TYPE_ID: '',
        formData: {
          "ITEM_ID": "",
          "NAME": "",
          "TYPE_ID": 0,
          "CHARGE_TYPE": "",
          "STATUS": "",
          "IS_QUICK_BALANCE": false,
          "IS_PREINSTALL": false,
          // "ALIAS1": "别名1",
          // "ALIAS2": "别名2",
          // "ALIAS3": "别名3",
          // "ALIAS4": "别名4",
          // "ALIAS5": "别名5",
          "REMARK": ""
        },
      }
    },
    watch: {
      'formData.CHARGE_TYPE'(val) {
        switch (val) {
          case '10141001':
            this.description = "标准金额:";
            this.des = "元";
            break;
          case '10141002':
            this.description = "标准工时:";
            this.des = "时";
            break;
          case '10141003':
            this.description = "油漆面数:";
            this.des = "面";
            break;
        }
      }
    },
    computed: {
      chargeList() {
        return getDictGroup(this.$store.state.app.dict, '1014');
      },
      statusList() {
        return getDictGroup(this.$store.state.app.dict, '1004');
      },
      statusList2() {
        return getDictGroup(this.$store.state.app.dict, '1001');
      },
      cando() {
        return this.list == "" ? true : false;
      },
    },
    mounted() {
      this.getTree();
      this.getList();
      this.showTable = Math.random();
      this.group = getDictGroup(this.$store.state.app.dict, '1014');
      this.CHARGE_TYPE = this.group[0].code;
    },
    methods: {
      addpost(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$Modal.confirm({
              title: '系统提示',
              content: '确认保存吗?',
              onOk: this.toSave,
            });
          } else {
            this.$Message.error("请校对红框信息");
          }
        })
      },
      toSave() {
        let obj = {};
        obj.ITEM_ID = this.formData.ITEM_ID;
        obj.NAME = this.formData.NAME;
        obj.TYPE_ID = this.formData.TYPE_ID;
        obj.STATUS = this.formData.STATUS;
        obj.CHARGE_TYPE = this.formData.CHARGE_TYPE;
        obj.IS_QUICK_BALANCE = this.formData.IS_QUICK_BALANCE ? this.statusList[0].code : this.statusList[1].code;
        obj.IS_PREINSTALL = this.formData.IS_PREINSTALL ? this.statusList[0].code : this.statusList[1].code;
        obj.REMARK = this.formData.REMARK;
        switch (this.formData.CHARGE_TYPE) {
          case '10141001':
            obj.REPAIR_MONEY = this.number;
            break;
          case '10141002':
            obj.REPAIR_TIME = this.number;
            break;
          case '10141003':
            obj.PAINT_NUM = this.number;
            break;
        }
        this.axios.request({
          url: '/manage/basedata/repairproject/save',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            data: JSON.stringify(obj),
          }
        }).then(res => {
          if (res.success === true) {
            this.customModal = false;
            this.getList();
          }
        })
      },
      addcancle() {
        this.customModal = false;
      },
      visibleChange() {
        this.clearSection();
      },
      clear() {
        this.KEYWORD = '';
        this.currently = "全部";
        this.TYPE_ID = '';
      },
      clearSection() {
        this.clearType = Math.random();
        this.list = "";
      },
      add() {
        this.$refs['list'].resetFields();
        let data = this.group;
        this.formData.CHARGE_TYPE = data[0].code;
        this.customModal = true;
        //新增默认选中有效....
        this.formData.STATUS = this.statusList2[0].code;
        //单选默认第一个
        this.formData.CHARGE_TYPE = this.chargeList[0].code;
        this.classify();
        //项目分类默认请选择....
        this.formData.TYPE_ID = 0;
        this.formData.number = 0;
        this.formData.REMARK = "";
        this.formData.ITEM_ID = "";
      },
      classify() {
        //获取项目分类
        this.axios.request({
          url: '/manage/basedata/repair_item/getTypeSelList',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            page: 1,
            limit: 25,
          }
        }).then(res => {
          if (res.success === true) {
            this.caritems = res.data;
            this.caritems.unshift({TYPE_NAME: '请选择....', TYPE_ID: 0})
          }
        })
      },
      edit() {
        this.$refs['list'].resetFields();
        this.update(this.list);
      },
      update(data) {
        this.classify();
        console.log(JSON.stringify(data));
        this.formData = data;
        this.formData.IS_PREINSTALL = (data.IS_PREINSTALL == this.statusList[0].code);
        this.formData.IS_QUICK_BALANCE = (data.IS_QUICK_BALANCE == this.statusList[0].code);
        this.formData.TYPE_ID = data.TYPE_ID;
        switch (this.formData.CHARGE_TYPE) {
          case '10141001':
            this.number = this.formData.REPAIR_MONEY;
            break;
          case '10141002':
            this.number = this.formData.REPAIR_TIME;
            break;
          case '10141003':
            this.number = this.formData.PAINT_NUM;
            break;
        }
        this.customModal = true;
      },
      del() {
        this.$Modal.confirm({title: '系统提示', content: '确认要删除吗?', onOk: this.doDel});
      },
      doDel() {
        this.axios.request({
          url: '/manage/basedata/repairproject/delete',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            ids: this.list.ITEM_ID,
          }
        }).then(res => {
          if (res.success === true && res.data == true) {
            this.getList();
          }
        })
      },
      getTree() {
        this.axios.request({
          url: '/manage/basedata/repairproject/get_repairitem_tree',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
          }
        }).then(res => {
          if (res.success === true) {
            let data = this.machine(res.data);
            this.treeData.push(data);
          }
        })
      },
      refresh() {
      },
      select(row) {
        // console.log(JSON.stringify(row));
        let flag = row[0] ? true : false;
        if (flag) {
          this.TYPE_ID = row[0].nodeId;
          this.currently = row[0].title == '全部车型' ? '全部' : row[0].title;
          this.page = 1;
          this.getList();
        }
      },
      getList() {
        this.axios.request({
          url: '/manage/basedata/repairproject/list',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            KEYWORD: this.KEYWORD,
            page: this.page,
            limit: this.limit,
            TYPE_ID: this.TYPE_ID,
          }
        }).then(res => {
          if (res.success === true) {
            this.tableData = res.data;
            this.total = res.total;
            this.clearSection();
          }
        })
      },
      machine(data) {
        data['title'] = data.nodeName;
        let flag = data.children ? true : false;
        if (flag) {
          for (let i = 0; i < data.children.length; i++) {
            this.machine(data.children[i]);
          }
        } else {

        }
        return data;
      },
      changePage(page) {
        this.page = page
        this.getList()
      },
      changePageSize(size) {
        this.limit = size
        this.getList()
      },
      onRowClick(row) {
        this.list = row;
      }
    },
    components: {commonTable},
  }
</script>

<style scoped lang="less">
  .split {
    border: 1px solid #dcdee2;
    background-color: white;
    .split-pane {
      padding: 10px;
      height: 100%;
      overflow: auto;
      position: relative;
      .tree-search {
        padding: 15px;
        border-radius: 3px;
      }
      .tree-input {
        z-index: 1;
      }
      .vehicle-tree {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        padding: 50px 0 10px 10px;
        overflow: hidden;
      }
    }
  }
</style>
<style lang="less">
  .vehicle-tree {
    > .ivu-tree-children {
      height: 100%;
      overflow: auto;
    }
    .highlight {
      color: red;
    }
  }

  .ivu-input-number-input {
    height: 30px;
  }

  .ivu-tree-title .highlight {
    color: red;
  }
</style>

