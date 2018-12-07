<!--数据元管理 2018-10-09-->
<template>
  <div style="width: 100%;height: 100%">
    <Split v-model="splitNum" class="split" :min="0.3" :max="0.7">
      <div slot="left" class="split-pane" ref="commonTable">
        <div class="operate">
          <Button type="primary" icon="md-add" @click="showModal=true;"></Button>
          <div class="search-block">
            <Input v-model="keyWords" placeholder="类型编号/名称/数据元名称..">
              <Icon type="ios-search" slot="suffix" @click="getList" style="cursor:pointer;"/>
            </Input>
          </div>
        </div>
        <Table :columns="columns" :data="tableData" border :highlight-row="true"
               :height="tableHeight" @on-row-click="rowClick" :row-class-name="rowClass"></Table>
      </div>
      <div slot="right" class="split-pane">
        <div class="operate">
          <Button type="success" :disabled="canAdd" @click="addCode">新增</Button>
          <Button type="error" :disabled="canDelete" @click="deleteConfirm">删除</Button>
          <Button type="info" :disabled="canAdd" @click="refresh">刷新</Button>
        </div>
        <Table :columns="columns1" @on-selection-change="select" :data="tableData1" border></Table>
      </div>
    </Split>
    <Modal
      v-model="showModal2"
      title="基本信息"
      :width="400"
      @on-visible-change="visibleChange"
      :scrollable="true"
      :transfer="true"
      :footer-hide="false"

      :mask-closable="false"
      :transition-names="['', '']">
      <Form :label-width="110" ref="formData" :rules="rules" :model="formData">
        <FormItem label="数据源名称:" prop="CODE_DESC">
          <Input type="text" :maxlength="50" v-model="formData.CODE_DESC"> </Input>
        </FormItem>
      </Form>
      <!--底部按钮组-->
      <div slot="footer">
        <Button @click="showModal2=false;">取消</Button>
        <Button type="primary" @click="submit('formData')">保存</Button>

      </div>
    </Modal>
    <Modal
      v-model="showModal"
      title="基本信息"
      :width="400"
      @on-visible-change="visibleChange"
      :scrollable="true"
      :transfer="true"
      :footer-hide="false"

      :mask-closable="false"
      :transition-names="['', '']">
      <Form :label-width="110" ref="listSearch" :rules="ruleValidate" :model="listSearch">
        <FormItem label="类型名称:" prop="typeName">
          <Input type="text" :maxlength="50" v-model="listSearch.typeName" placeholder=""> </Input>
        </FormItem>
        <FormItem label="数据元名称:" prop="codeName">
          <Input type="text" :maxlength="50" v-model="listSearch.codeName" placeholder=""> </Input>
        </FormItem>
      </Form>
      <!--底部按钮组-->
      <div slot="footer">
        <Button @click="showModal=false;">取消</Button>
        <Button type="primary" @click="handleSubmit('listSearch')">保存</Button>

      </div>
    </Modal>

  </div>


</template>
<script>
  import {getName, getDictGroup} from '@/libs/util.js'

  export default {
    name: "source-manage",
    data() {
      return {
        splitNum: 0.3,
        keyWords: '',
        typeId: '',
        typeName: '',
        obj: [],
        tableData: [],
        formData: {
          CODE_DESC: '',
        },
        showModal2: false,
        columns: [
          {title: '类型编码', key: 'TYPE', width: 95},
          {
            title: '类型名称', key: 'TYPE_NAME', minWidth: 130,
            render: (h, params) => {
              let store = params.row.TYPE_NAME;
              let type = params.row.TYPE;
              let self = this;
              return h('div', [
                h('Input', {
                    props: {
                      value: params.row.TYPE_NAME,
                      maxlength:50,
                    },
                    on: {
                      "on-blur": (e) => {
                        let val = e.target.value;
                        if (val == '') {
                          self.$Message.error('类型名称不能为空');
                          e.target.value = store;
                        } else {
                          if (e.target.value != store) {
                            self.updateType(type, val);
                          }
                        }
                      },

                    }
                  },
                )
              ]);
            }
          },
        ],
        columns1: [
          {
            type: 'selection',
            width: 60,

          },
          {
            title: '序号', minWidth: 70, type: 'index',
          },
          {
            title: '数据元', key: 'CODE_ID', minWidth: 110,
            render: (h, params) => {
              let store = params.row.CODE_ID;
              let self = this;
              return h('div', [
                h('Input', {
                    props: {
                      value: params.row.CODE_ID,
                      maxlength:50,
                    },
                    on: {
                      "on-blur": (e) => {
                        let val = e.target.value;
                        if (val == '') {
                          self.$Message.error('数据元不能为空');
                          e.target.value = store;
                        } else {
                          if (e.target.value != store) {
                            self.updateCode(params.row, 4, val);
                          }
                        }
                      },

                    }
                  },
                )
              ]);
            }
          },
          {
            title: '数据元名称', key: 'CODE_DESC', minWidth: 120,
            render: (h, params) => {
              let store = params.row.CODE_DESC;
              let self = this;
              return h('div', [
                h('Input', {
                    props: {
                      value: params.row.CODE_DESC,
                      maxlength:50,
                    },
                    on: {
                      "on-blur": (e) => {
                        let val = e.target.value;
                        if (val == '') {
                          self.$Message.error('数据源名称不能为空');
                          e.target.value = store;
                        } else {
                          if (e.target.value != store) {
                          self.updateCode(params.row, 1, val);
                          }
                        }
                      },

                    }
                  },
                )
              ]);
            }
          },
          {
            title: '排序值', key: 'NUM', minWidth: 100,
            render: (h, params) => {
              let self = this;
              let store = params.row.NUM;
              let reg = /^[0-9]*$/;
              return h('div', [
                h('Input', {
                    props: {
                      value: params.row.NUM,
                      maxlength:7,
                    },
                    on: {
                      "on-blur":(e) => {
                        let val = e.target.value;
                        if(val == "" || !reg.test(val)){
                          e.target.value = store;
                        }else{
                          if(val != store){
                            self.updateCode(params.row, 3, val);
                          }
                        }
                      }

                    }
                  },
                )
              ]);
            }
          },
          {
            title: '状态', key: 'STATUS', minWidth: 120,
            // render: (h, params) => h('span', getName(this.statusList, params.row.STATUS))
            render: (h, params) => {
              return h('Select', {
                  props: {
                    value: params.row.STATUS,
                  },
                  on: {
                    'on-change': (value) => {
                      this.tableData1[params.index].STATUS = value;
                      this.updateCode(params.row, 2, value);
                    }
                  },
                },
                this.statusList.map(function (type) {
                  return h('Option', {
                    props: {
                      value: type.code,
                    }
                  }, type.name);
                })
              );
            }
          },
          {title: '创建人', key: 'CREATE_BY', minWidth: 120},
          {
            title: '创建时间', key: 'CREATE_TIME', minWidth: 130,
            render: (h, params) => h('span', params.row.CREATE_TIME.substr(0, 10))
          },
        ],
        tableData1: [],
        page: 1,
        limit: 25,
        showTable: false,
        showDetail: false,
        windowInnerHeight: window.innerHeight,
        tableHeight: 500,
        timer: null,//定时开关
        showModal: false,//新增按钮框的界面----
        listSearch: {
          typeName: '',
          codeName: ''
        },
        ruleValidate: {
          typeName: [
            {required: true, message: '请填写数据源类型', trigger: 'change'}
          ],
          codeName: [
            {required: true, message: '请填写数据源名称', trigger: 'change'}
          ],
        },
        rules: {
          CODE_DESC: [
            {required: true, message: '请填数据源名称', trigger: 'change'}
          ],
        }
      }
    },
    mounted() {
      this.getList();
      let self = this
      this.resize(500)
      window.onresize = function () {
        if (window.innerHeight != self.windowInnerHeight)
          self.resize(200)
      }
    },
    computed: {
      statusList() {
        return getDictGroup(this.$store.state.app.dict, '1001');
      },
      canAdd() {
        return this.typeId == "";
      },
      canDelete() {
        return this.obj.length == 0;
      },
    },
    methods: {
      updateCode(data, code, val) {
        let codeBak;
        switch (code) {
          case 1:
            data.CODE_DESC = val;
            codeBak = data.CODE_ID;
            break;
          case 2:
            data.STATUS = val;
            codeBak = data.CODE_ID;
            break;
          case 3:
            data.NUM = val;
            codeBak = data.CODE_ID;
            break;
          case 4:
            codeBak = data.CODE_ID;
            data.CODE_ID_BAK = codeBak;
            data.CODE_ID = val;
            break;
        }
        this.axios.request({
          url: '/manage/basedata/dbcode/updateCode',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            type: data.TYPE,
            codeBak: codeBak,
            data: JSON.stringify(data)
          }
        }).then(res => {
          if (res.success === true) {
            if(code == 4) this.getCodeList();
          }else{
            let self = this;
            setTimeout(function(){
              self.$Modal.error({title:'错误提示',content:res.Exception.message});
            },500);
            if(code == 4) this.getCodeList();
            return false;
          }
        })

      },
      updateType(type, name) {
        this.axios.request({
          url: '/manage/basedata/dbcode/updateType',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            name: name,
            type: type,
          }
        }).then(res => {
          if (res.success === true) {
            this.typeId = type;
            this.typeName = name;
          }
        })
      },
      rowClass(row, index) {
        if (row.TYPE == this.typeId) {
          return "ivu-table-stripe-even";
        }
      },
      deleteConfirm() {
        if (this.canDelete) {
          this.$Message.info('请选择要删除的数据');
        } else {
          this.$Modal.confirm({title: '系统提示', content: '确认要删除吗?', onOk: this.deleteCode});
        }
      },
      deleteCode() {
        let ids = [];
        for (let i in this.obj) {
          ids.push(this.obj[i].CODE_ID);
        }
        let id = ids.join(',');
        this.axios.request({
          url: '/manage/basedata/dbcode/deleteCode',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            ids: id,
          }
        }).then(res => {
          if (res.success === true) {
            let data = this.tableData1;
            for (let i in ids) {
              let did = ids[i];
              console.log(did);
              for (let a in data) {
                if (data[a].CODE_ID == did) {
                  data.splice(a, 1);
                }
              }
            }
            //为空代表已删空...
            if (data.length == 0) {
              let tableData = this.tableData;
              for (let i in tableData) {
                if (tableData[i].TYPE == this.typeId) {
                  tableData.splice(i, 1);
                }
              }
              this.tableData = tableData;
              this.typeId = "";
              this.obj = [];
            }
            this.tableData1 = data;
          }
        })
      },
      addCode() {
        this.showModal2 = true;
      },
      refresh() {
        this.getCodeList(this.typeId);
      },
      onCurrentChange() {

      },
      select(row) {
        this.obj = row;
      },
      rowClick(row) {
        this.typeId = row.TYPE;
        this.typeName = row.TYPE_NAME;
        this.getCodeList(row.TYPE);
      },
      search() {

      },
      resize(time) {
        let self = this
        let commonTable = this.$refs.commonTable
        if (commonTable.offsetHeight) {
          clearTimeout(this.timer);
          this.timer = setTimeout(function () {
            self.windowInnerHeight = window.innerHeight
            self.tableHeight = commonTable.offsetHeight - 20 -
              commonTable.querySelector(".operate").offsetHeight - 10;
          }, time);
        }
      },
      //获取小分类数据
      getCodeList() {
        this.obj = [];
        this.axios.request({
          url: '/manage/basedata/dbcode/codeList',
          method: 'post',
          data: {
            type: this.typeId,
            page: 1,
            start: 0,
            access_token: this.$store.state.user.token
          }
        }).then(res => {
          if (res.success === true) {
            this.tableData1 = res.data;
          }
        })
      },
      //获取大分类数据
      getList() {
        this.axios.request({
          url: '/manage/basedata/dbcode/typeList',
          method: 'post',
          data: {
            keyWord: this.keyWords,
            page: 1,
            start: 0,
            limit: 25,
            access_token: this.$store.state.user.token
          }
        }).then(res => {
          if (res.success === true) {
            this.typeId = res.data[0].TYPE;
            this.typeName = res.data[0].TYPE_NAME;
            this.tableData = res.data;
            this.getCodeList();
          }
        })
      },
      //新增第一步
      F1() {
        this.axios.request({
          url: '/manage/basedata/dbcode/addNewType',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token
          }
        }).then(res => {
          if (res.success === true) {
            let type = res.data.TYPE;
            this.F2(type);
          }
        })
      },
      F2(type) {
        this.axios.request({
          url: '/manage/basedata/dbcode/codeList',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            limit: 25,
            page: 1,
            type: type,
          }
        }).then(res => {
          if (res.success === true) {
            let data = res.data[0];
            data.CODE_DESC = this.listSearch.codeName;
            this.F3(data);
            this.F4(data.TYPE, this.listSearch.typeName);
          }
        })
      },
      F3(data, flag = false) {
        this.axios.request({
          url: '/manage/basedata/dbcode/updateCode',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            type: data.TYPE,
            codeBak: data.CODE_ID,
            data: JSON.stringify(data)
          }
        }).then(res => {
          if (res.success === true) {
            this.showModal = false;
            this.showModal2 = false;
            if (flag) this.getCodeList();
          }
        })
      },
      F4(type, name) {
        this.axios.request({
          url: '/manage/basedata/dbcode/updateType',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            name: name,
            type: type,
          }
        }).then(res => {
          if (res.success === true) {
            this.tableData.unshift({TYPE: type, TYPE_NAME: name});
            this.typeId = type;
            this.typeName = name;
            this.getCodeList();
          }
        })
      },
      F5(type, name) {
        this.axios.request({
          url: '/manage/basedata/dbcode/addNewCode',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            type: type,
            typeName: name,
          }
        }).then(res => {
          if (res.success === true) {
            let data = res.data;
            data.CODE_DESC = this.formData.CODE_DESC;
            this.F3(data, true);
          }
        })
      },
      setCode(row, flag = true) {
        this.axios.request({
          url: '/manage/basedata/dbcode/updateCode',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            type: row.TYPE,
            codeBak: row.CODE_ID,
            data: JSON.stringify(row)
          }
        }).then(res => {
          if (res.success === true) {
            this.showModal = false;
            this.showModal2 = false;
            this.getList();
          }
        })
      },
      //保存按钮-----------
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.F1();
          } else {
            this.$Message.error("请校对红框字段");
          }
        });
      },
      submit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.F5(this.typeId, this.typeName);
          } else {
            this.$Message.error("请校对红框字段");
          }
        });
      },
      //弹出层状态变化--------
      visibleChange() {

      },
    },

  }
</script>
<style lang="less">
  .ivu-table-stripe-even td {
    background-color: #BFE9FF;
  }
</style>
<style lang="less" scoped>
  .search-block {
    display: inline-block;
    width: 70%;
    /*margin-left: 10px;*/
    overflow: hidden;
  }

  .ivu-table-stripe-even {
    background-color: red;
  }

  .demo-split {
    border: 1px solid #dcdee2;
  }

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

  .operate {
    margin-bottom: 10px;
    padding: 15px 15px 10px 15px;
    border: 1px solid #dcdee2;
    border-radius: 3px;
  }

  .operate button {
    margin: 0 5px 5px 0;
  }
</style>
