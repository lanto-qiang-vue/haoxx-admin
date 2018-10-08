<template>
  <Split v-model="split" :min="0.1" :max="0.5" class="split">
    <div slot="left" class="split-pane">
      <Tree :data="data2" @on-select-change="getnode"></Tree>
    </div>
    <div slot="right" class="split-pane">
      <common-table :columns="columns" :total="total" :page="page" v-model="tableData" :show="show"
                    @changePageSize="changePageSize" @changePage="changePage" :clearSelect="clearType"
                    @onRowClick="onRowClick">
        <div slot="search">
          <Input placeholder="项目编号/名称..." v-model="KEYWORD" style="width: 300px"></Input>
          <label>&nbsp;&nbsp;&nbsp;项目类别:&nbsp;&nbsp;&nbsp;</label>
          <Input :disabled="true" v-model="TYPE" style="width:250px;"></Input>
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
          <Button type="primary" @click="impor()" v-if="accessBtn('export')">导入标准库</Button>
          <Button type="primary" :disabled="isdisabled" @click="add()">新增</Button>
          <Button type="info" :disabled="cando" @click="edit()" v-if="accessBtn('edit')">修改</Button>
        </div>
      </common-table>
      <!-- 导入标准库使用 -->
      <Modal
        v-model="showModal"
        class="table-modal-detail"
        title="未导入的维修项目"
        width="90"
        :mask-closable="false"
        :scrollable="true"
        :transfer="true"
        :footer-hide="false"
        :transition-names="['', '']">
        <Split v-model="split" :min="0.1" :max="0.5" class="split" style="height:100%;">
          <div slot="left" class="split-pane">
            <Tree :data="changeTree" @on-select-change="getdata"></Tree>
            <Spin size="large" fix v-if="spinShow"></Spin>
          </div>
          <div slot="right" style="height:100%;">
            <common-table :columns="columns1" :showSearch="false" :showOperate="false" :showPage="false"
                          v-model="initParts" :show="ishow">
            </common-table>
          </div>
        </Split>
        <div slot="footer">
          <Button @click="cancle()">取消</Button>
          <Button type="info" @click="toimport()">导入</Button>
        </div>
      </Modal>
      <!-- 导入标准库使用结束 -->
      <!-- 自定义配件新增开始 -->
      <Modal
        v-model="customModal"
        class="table-modal-detail"
        :title="title"
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
            <Form slot="content" :model="formData" ref="list" :label-width="120" :rules="ruleValidate"
                  class="common-form">
              <FormItem label="项目名称:" style="width:30%;" prop="NAME">
                <Input type="text" v-model="formData.NAME"> </Input>
              </FormItem>
              <FormItem label="项目分类:" style="width:30%;" prop="TYPE_ID">
                <Select placeholder="" :disabled="true" v-model="formData.TYPE_ID" style="min-width: 100%;">
                  <Option v-for="(item, index) in caritems"
                          :key="index" :value="item.TYPE_ID">{{item.TYPE_NAME}}
                  </Option>
                </Select>
              </FormItem>
              <FormItem label="项目编号:" v-if="editType" style="width:30%;" prop="ITEM_NO">
                <Input type="text" :disabled="true" v-model="formData.ITEM_NO"> </Input>
              </FormItem>
              <!-- 手动 -->
              <!-- <div style="height:20px;"></div> -->
              <!-- 手动 -->
              <FormItem label="发动机类型:" v-if="isShow" style="width:45%;" prop="ENGINE_TYPE">
                <Select v-model="formData.ENGINE_TYPE" style="min-width: 100%;">
                  <Option v-for="(item, index) in engine"
                          :key="index" :value="item.ENGINE_TYPE">{{item.ENGINE_TYPE_NAME}}
                  </Option>
                </Select>
              </FormItem>
              <FormItem label="汽车参数:" v-if="isShow" style="width:45%;" prop="CLASS_TYPE">
                <Select v-model="formData.CLASS_TYPE" style="min-width: 100%;">
                  <Option v-for="(item, index) in parameter"
                          :key="index" :value="item.CLASS_TYPE">{{item.CLASS_NAME}}
                  </Option>
                </Select>
              </FormItem>
              <FormItem label="计费标准:" style="width:100%;">
                <RadioGroup v-model="formData.CHARGE_TYPE">
                  <Radio v-for="(item,index) in group" :key="index" :label="item.code">{{item.name}}</Radio>
                </RadioGroup>
              </FormItem>
              <FormItem :label="description" style="width:30%;">
                <InputNumber
                  style="width:100%;height:33px;"
                  :min="0"
                  v-model="number"
                  :formatter="value => `${value}`+des"
                  :parser="value => value.replace(des, '')"></InputNumber>
              </FormItem>
              <FormItem label="别名1:" v-if="isShow" style="width:30%;">
                <Input type="text" :disabled="editType" v-model="formData.ALIAS1"> </Input>
              </FormItem>
              <FormItem label="别名2:" v-if="isShow" style="width:30%;">
                <Input type="text" :disabled="editType" v-model="formData.ALIAS2"> </Input>
              </FormItem>

              <FormItem label="别名3:" v-if="isShow" style="width:30%;">
                <Input type="text" :disabled="editType" v-model="formData.ALIAS3"> </Input>
              </FormItem>
              <FormItem label="别名4:" v-if="isShow" style="width:30%;">
                <Input type="text" :disabled="editType" v-model="formData.ALIAS4"> </Input>
              </FormItem>
              <FormItem label="别名5:" v-if="isShow" style="width:30%;">
                <Input type="text" :disabled="editType" v-model="formData.ALIAS5"> </Input>
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
      <!-- 自定义配件新增结束 -->
    </div>
  </Split>
</template>
<script>
  import {getName, getDictGroup, getCreate} from '@/libs/util.js'
  import commonTable from '@/hxx-components/common-table.vue'
  import mixin from '@/hxx-components/mixin'
  export default {
    name: 'repair-items',
    components: {commonTable},
    mixins: [mixin],
    data() {
      return {
        title: '',
        clearType: false,
        value1: '1',
        des: '元',
        value2: '2',
        description: '标准金额',
        number: 0,
        ishow: false,
        customModal: false,
        checkid: [],
        editType: false,
        data2: [],
        spinShow: false,
        changeTree: [],
        init1: [],
        isShow: false,
        init2: [],
        list: '',
        split: 0.2,
        caritems: [],//项目分类
        engine: [],
        parameter: [],
        group: [],
        formData: {
          ITEM_ID: '',
          TYPE_ID: '',
          ENGINE_TYPE: '',//发动机类型
          CLASS_TYPE: '',
          CHARGE_TYPE: '',
          ITEM_NO: '',
          NAME: '',
          ALIAS1: '',
          ALIAS2: '',
          ALIAS3: '',
          ALIAS4: '',
          ALIAS5: '',
          REMARK: '',
        },
        columns: [
          {
            title: '序号', minWidth: 80,
            render: (h, params) => h('span', (this.page - 1) * this.limit + params.index + 1)
          },
          {title: '项目编号', key: 'ITEM_NO', sortable: true, minWidth: 120},
          {title: '维修项目名称', key: 'NAME', sortable: true, minWidth: 140},
          {title: '项目分类', key: 'TYPE_NAME', sortable: true, minWidth: 120},
          {
            title: '计费标准', key: 'CHARGE_TYPE', sortable: true, minWidth: 140,
            render: (h, params) => h('span', getName(this.chargetype, params.row.CHARGE_TYPE))
          },
          {title: '标准金额(元)', key: 'REPAIR_MONEY', sortable: true, minWidth: 140},
          {title: '标准工时(小时)', key: 'REPAIR_TIME', sortable: true, minWidth: 150},
          {title: '油漆面数(面)', key: 'PAINT_NUM', sortable: true, minWidth: 140},
        ],
        columns1: [
          {type: 'selection', width: 60, align: 'center'},
          {title: '项目名称', key: 'nodeName', sortable: true, minWidth: 120},
          {title: '项目编号', key: 'itemNo', sortable: true, minWidth: 120},
          {
            title: '计费标准', key: 'chargeType', sortable: true, minWidth: 140,
            render: (h, params) => h('span', getName(this.chargetype, params.row.chargeType))
          },
          {title: '标准金额(元)', key: 'repairMoney', sortable: true, minWidth: 140},
          {title: '标准工时(小时)', key: 'repairTime', sortable: true, minWidth: 150},
          {title: '油漆面数(面)', key: 'paintNum', sortable: true, minWidth: 140},
          {title: '类型1', key: 'engine_type_name', sortable: true, minWidth: 120},
          {title: '类型2', key: 'class_name', sortable: true, minWidth: 120},
        ],
        initParts: [],
        page: 1,
        limit: 25,
        total: 0,
        KEYWORD: '',
        TYPE: '全部',
        show: false,
        tableData: [],
        TYPE_ID: '',
        showModal: false,
        ruleValidate: {
          TYPE_ID: [{required: true}],
          ENGINE_TYPE: [{required: true}],//发动机类型
          CLASS_TYPE: [{required: true}],
          ITEM_NO: [{required: true, message: '项目编号必填', trigger: 'blur'}],
          NAME: [{required: true, message: '项目名称必填', trigger: 'blur'}],
        },
      }
    },
    mounted() {
      //获取树
      this.show = Math.random();
      this.getTree();
      this.getList();
    },
    computed: {
      chargetype() {
        return getDictGroup(this.$store.state.app.dict, '1014');
      },
      isdisabled() {
        // return false;
        if (this.TYPE == '自定义') {
          return false;
        } else {
          return true;
        }
      },
      cando() {
        if (this.TYPE == '自定义' && this.list != '') {
          return false;
        } else {
          return true;
        }
      },
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
    methods: {
      getdata(row) {
        if (!row[0]) {
          return;
        }
        var store = row[0].store;
        // var data = this.getchildren(store,[]);
        this.initParts = store;
      },
      // getchildren(data,da){
      //   for(var a = 0;a<data.store.length;a++){
      //     this.getchildren(data.store[i],da)
      //   }
      // },
      visibleChange() {
        this.clearsection();
      },
      clearsection() {
        this.clearType = Math.random();
        this.list = '';
      },
      cancle() {
        this.showModal = false;
      },
      getTree() {
        this.axios.request({
          url: '/tenant/basedata/repairproject/get_infoitem_tree',
          method: 'post',
          data: {access_token: this.$store.state.user.token},
        }).then(res => {
          if (res.success === true) {
            var data = this.machine1(res.data);
            data['expand'] = true;
            this.data2.push(data);
          }
        })
      },
      onRowClick(row) {
        this.list = row;
      },
      addcancle() {
        this.customModal = false;
      },
      onCheck(row) {
        console.log(row);
      },
      tosave() {
        var obj = {};
        var url;
        obj.ITEM_ID = this.formData.ITEM_ID;
        if (obj.ITEM_ID != '') {
          obj.DETAIL_ID = this.formData.DETAIL_ID;
          url = "/tenant/basedata/repairiteminfo/save";
        } else {
          obj.ENGINE_TYPE = this.formData.ENGINE_TYPE;//发动机类型
          obj.CLASS_TYPE = this.formData.CLASS_TYPE;
          url = "/tenant/basedata/repairiteminfo/saveitem";
        }
        obj.TYPE_ID = this.formData.TYPE_ID;
        obj.CHARGE_TYPE = this.formData.CHARGE_TYPE;
        obj.ITEM_NO = this.formData.ITEM_NO;
        obj.NAME = this.formData.NAME;
        obj.ALIAS1 = this.formData.ALIAS1;
        obj.ALIAS2 = this.formData.ALIAS2;
        obj.ALIAS3 = this.formData.ALIAS3;
        obj.ALIAS4 = this.formData.ALIAS4;
        obj.ALIAS5 = this.formData.ALIAS5;
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
        //开始保存数据...
        this.axios.request({
          url: url,
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            data: JSON.stringify(obj)
          },
        }).then(res => {
          if (res.success === true) {
            if (obj.ITEM_ID == '') {
              this.$Message.success('新增成功');
            } else {
              this.$Message.success('修改成功');
            }
            this.getList();
            this.customModal = false;
          }
        })
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
      getnode(num) {
        if (num.length > 0) {
          this.TYPE = num[0].title == '全部车型' ? '全部' : num[0].title;
          var type_id = num[0].nodeId ? num[0].nodeId : num[0].title;
          this.TYPE_ID = type_id == '全部车型' ? '' : type_id;
          this.page = 1;
          this.getList();
        }
      },
      machine1(data) {
        data['title'] = data.nodeName;
        var flag = data.children ? true : false;
        if (flag) {
          for (var i = 0; i < data.children.length; i++) {
            this.machine1(data.children[i]);
          }
        } else {

        }
        return data;
      },
      machine2(data, da, level = 1) {
        da['title'] = data.nodeName;
        da['nodeId'] = data.nodeId ? data.nodeId : 0;
        da['expand'] = false;
        da['level'] = level;
        var flag = data.children ? true : false;
        if (flag) {
          da['store'] = data.children;
        }
        if (level < 3) {
          da['children'] = [];
          var flag = data.children ? true : false;
          if (flag) {
            for (var i = 0; i < data.children.length; i++) {
              da['children'][i] = {};
              this.machine2(data.children[i], da['children'][i], level + 1);
            }
          }
          return da;
        }
      },
      getList() {
        this.axios.request({
          url: '/tenant/basedata/repairproject/get_list',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            limit: this.limit,
            page: this.page,
            KEYWORD: this.KEYWORD,
            TYPE_ID: this.TYPE_ID
          },
        }).then(res => {
          if (res.success === true) {
            this.tableData = res.data;
            this.total = res.total;
            this.clearsection();
          }
        })
      },
      impor() {
        ///tenant/basedata/repairproject/get_checkitem_tree
        this.ishow = Math.random();
        this.spinShow = true;
        this.axios.request({
          url: '/tenant/basedata/repairproject/get_checkitem_tree',
          method: 'post',
          data: {access_token: this.$store.state.user.token}
        }).then(res => {
          this.changeTree = [];
          if (res.success === true) {
            var data = this.machine2(res.data, {});
            this.changeTree.push(data);
            this.spinShow = false;
          }
        })
        this.showModal = true;
      },
      add() {
        this.title = "自定义新增";
        this.editType = false;
        this.number = 0;
        this.$refs['list'].resetFields();
        this.formData.REMARK = '';
        this.customModal = true;
        this.getbase(true);
      },
      getbase(flag) {
        //获取汽车项目
        this.axios.request({
          url: '/tenant/basedata/repairiteminfo/getTypeSelList1',
          method: 'post',
          data: {access_token: this.$store.state.user.token, page: 1, limit: 25}
        }).then(res => {
          this.caritems = res.data;
          if (flag) {
            for (var i = 0; i < this.caritems.length; i++) {
              if (this.caritems[i].TYPE_NAME == '自定义') {
                this.formData.TYPE_ID = this.caritems[i].TYPE_ID;
              }
            }
          }
        })
        //获取发动机类型
        this.axios.request({
          url: '/tenant/basedata/repairiteminfo/getBanJinList',
          method: 'post',
          data: {access_token: this.$store.state.user.token, page: 1, limit: 25}
        }).then(res => {
          this.engine = res.data;
          if (flag) this.formData.ENGINE_TYPE = this.engine[0].ENGINE_TYPE;
        })
        //获取汽车参数
        this.axios.request({
          url: '/tenant/basedata/repairiteminfo/getCarList',
          method: 'post',
          data: {access_token: this.$store.state.user.token, page: 1, limit: 25}
        }).then(res => {
          this.parameter = res.data;
          if (flag) this.formData.CLASS_TYPE = this.parameter[0].CLASS_TYPE;
        })
        //获取单选框分钟
        this.group = getDictGroup(this.$store.state.app.dict, '1014');
        this.formData.CHARGE_TYPE = this.group[0]['code'];
      },
      edit() {
        this.title = "自定义修改";
        this.editType = true;
        this.getbase(false);
        this.formData = this.list;
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
      clear() {
        this.KEYWORD = '';
        this.TYPE = "全部";
        this.TYPE_ID = '';
      },
      changePage(page) {
        this.page = page;
      },
      changePageSize(size) {
        this.limit = size;
      },
    },
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
