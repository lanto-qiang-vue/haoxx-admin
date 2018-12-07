<template>
  <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage"
                :total="total" :show="showTable" :clearSelect="clearType" @onRowClick="onRowClick"
                @onRowDblclick="dbclick" :page="page">
    <div slot="search">
      <div class="search-block">
        <Input v-model="search.ROLE_CODE_lk" placeholder="角色编号..."></Input>
      </div>
      <div class="search-block">
        <Input v-model="search.ROLE_NAME_lk" placeholder="角色名称..."></Input>
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
    </div>
    <Modal
      v-model="showModal"
      class="table-modal-detail"
      title="后台角色信息"
      width="90"
      :mask-closable="false"
      @on-visible-change="visibleChange"
      :scrollable="true"
      :transfer="true"
      :footer-hide="false"
      :transition-names="['', '']">
      <Split v-model="split" :min="0.3" :max="0.7" class="split">
        <div slot="left" class="split-pane" style="overflow: auto;height:100%;">
          <Collapse v-model="value2">
            <Panel name="2">
              角色信息
              <Form slot="content" :model="formData" ref="list" :rules="rules" :label-width="100" class="common-form">
                <FormItem label="角色名称:" style="width:90%;" prop="ROLE_NAME">
                  <Input v-model="formData.ROLE_NAME" type="text"> </Input>
                </FormItem>
                <FormItem label="角色状态:" style="width:90%;" prop="STATUS">
                  <Select v-model="formData.STATUS">
                    <Option v-for="(item, index) in statusList2"
                            :key="index" :value="item.code">{{item.name}}
                    </Option>
                  </Select>
                </FormItem>
                <FormItem label="角色描述:" style="width:90%;">
                  <Input v-model="formData.ROLE_DESC" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                         placeholder="Enter something..."></Input>
                </FormItem>
              </Form>
            </Panel>
          </Collapse>
        </div>
        <div slot="right" class="split-pane">
          <Collapse v-model="value1">
            <Panel name="1">
              角色权限信息
              <div slot="content" style="width:100%;height:100%;">
                <Button @click="expandAll" style="margin-bottom:10px;">{{expandName}}</Button>
                <table id="table">
                  <tr>
                    <th style="width:30%;">功能名称</th>
                    <th style="width:40%;">功能权限</th>
                    <th style="width:30%;">操作</th>
                  </tr>
                </table>
                <xunit-tree :expand="item.expand" v-for="item  in treeData" :level="1" :indexId="0" :text="item.text"
                            @checkTrue="checkTrue" :funcId="item.funcId" @checkFalse="checkFalse" :data="item.children"
                            :checked="item.checked" @pushIds="pushIds" @spliceId="spliceId"
                            :funcButton="item.funcButton"
                            @pushButtonId="pushButtonId" @unfoldId="unfoldId"></xunit-tree>
              </div>
            </Panel>
          </Collapse>
        </div>
      </Split>
      <div style="height:60px;"></div>
      <div slot="footer">
        <Button @click="addCancel">取消</Button>
        <Button type="primary" @click="submit">保存</Button>
      </div>
    </Modal>
  </common-table>
</template>
<script>
  import xunitTree from '@/hxx-components/xunit-tree.vue'
  import commonTable from '@/hxx-components/common-table.vue'
  import {getName, getDictGroup, getCreate} from '@/libs/util.js'

  export default {
    name: "index-roles",
    components: {xunitTree, commonTable},
    computed: {
      statusList() {
        let data = getDictGroup(this.$store.state.app.dict, '1001');
        data.unshift({name: '全部', code: 0});
        return data;
      },
      statusList2() {
        return getDictGroup(this.$store.state.app.dict, '1001');
      },
      cando() {
        return this.list == "";
      }
    },
    data() {
      return {
        treeData: [],
        value1: '1',
        value2: '2',
        expandType: true,
        expandName: '展开全部',
        clearType: false,
        tableData: [],
        showModal: false,
        split: 0.3,
        formData: {
          "ROLE_ID": "",
          "ROLE_CODE": "",
          "ROLE_NAME": "",
          "STATUS": "",
          "ROLE_DESC": "",
        },
        rules: {
          ROLE_NAME: [{required: true, message: '角色名称必填'}],
          STATUS: [{required: true}]
        },
        list: '',
        page: 1,
        showTable: false,
        limit: 25,
        total: 0,
        search: {
          status: 0,
          ROLE_CODE_lk: '',
          ROLE_NAME_lk: '',
        },
        columns: [
          {
            title: '序号', minWidth: 70,
            render: (h, params) => h('span', (this.page - 1) * this.limit + params.index + 1)
          },
          {title: '角色编号', key: 'ROLE_CODE', sortable: true, minWidth: 140},
          {title: '角色名称', key: 'ROLE_NAME', sortable: true, minWidth: 140},
          {title: '角色描述', key: 'ROLE_DESC', sortable: true, minWidth: 140},
          {
            title: '状态', key: 'STATUS', sortable: true, minWidth: 140,
            render: (h, params) => h('span', getName(this.statusList, params.row.STATUS))
          },
          {title: '创建时间', key: 'CREATE_TIME', sortable: true, minWidth: 140},
        ],
      }
    },
    methods: {
      clear(){
        this.search.status = 0;
        this.search.ROLE_CODE_lk = "";
        this.search.ROLE_NAME_lk = "";
      },
      edit(){
        this.update(this.list);
      },
      update(row){
        this.formData = row;
        this.showModal = true;
        this.getTree(row.ROLE_ID);
      },
      visibleChange() {
        this.clearsection();
      },
      addCancel(){
        this.showModal = false;
      },
      add() {
        this.$refs.list.resetFields();
        this.formData.ROLE_DESC = "";
        this.formData.ROLE_ID = "";
        this.formData.STATUS = this.statusList2[0].code;
        this.getTree();
        this.showModal = true;
      },
      dbclick() {

      },
      onRowClick(row) {
        this.list = row;
      },
      clearsection() {
        this.clearType = Math.random();
        this.list = "";
      },
      getList() {
        this.axios.request({
          url: '/manage/sys/roles/list',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            limit: this.limit,
            page: this.page,
            KEYWORD: this.search.keyword,
            ROLE_CODE_lk: this.search.ROLE_CODE_lk,
            ROLE_NAME_lk: this.search.ROLE_NAME_lk,
            STATUS_eq: this.search.status == 0 ? '' : this.search.status,
          }
        }).then(res => {
          if (res.success === true) {
            this.tableData = res.data;
            this.total = res.total;
          }
        })
        this.clearsection();
      },
      changePage(page) {
        this.page = page;
        this.getList();
      },
      changePageSize(size) {
        this.limit = size;
        this.getList();
      },
      expandAll() {
        let data = this.changAll(this.treeData, this.expandType);
        this.treeData = data;
        if (this.expandType) {
          this.expandType = !this.expandType;
          this.expandName = "收起全部";
        } else {
          this.expandType = !this.expandType;
          this.expandName = "展开全部";
        }
      },
      changAll(data, type) {
        for (let i in data) {
          data[i].expand = type;
          if (data[i].children) {
            this.changAll(data[i].children, type);
          }
        }
        return data;
      },
      unfoldId(id) {
        let data = this.getSon(this.treeData, id);
        this.treeData = data;
      },
      getSon(data, id) {
        for (let i in data) {
          if (data[i].funcId == id) {
            data[i].expand = !data[i].expand;
          } else {
            if (data[i].children) {
              this.getSon(data[i].children, id);
            }
          }
        }
        return data;
      },
      pushButtonId(row) {
        let pid = row.funcId;
        let BTN_ID = row.buttonId;
        let data = this.findParent(this.treeData, pid, BTN_ID);
        this.treeData = data;
      },
      setButton(data, BTN_ID) {
        for (let i in data) {
          if (data[i].BTN_ID == BTN_ID) {
            switch (data[i].IS_CHECK) {
              case 0:
                data[i].IS_CHECK = 1;
                break;
              case 1:
                data[i].IS_CHECK = 0;
                break;
            }
          }
        }
        return data;
      },
      findParent(data, pid, BTN_ID) {
        for (let i in data) {
          let flag = data[i].children ? true : false;
          if (data[i].funcId == pid) {
            this.setButton(data[i].funcButton, BTN_ID);
            return data;
            break;
          } else {
            if (flag) this.findParent(data[i].children, pid, BTN_ID);
          }
        }
        return data;
      },
      submit() {
        this.$refs.list.validate((valid) => {
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
      toSave(){
        let funcs = this.getFuncId(this.treeData, []);
        let btns = this.getButton(this.treeData, []);
        this.axios.request({
          url: '/manage/sys/roles/save',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            funcs:JSON.stringify(funcs),
            btns:JSON.stringify(btns),
            data:JSON.stringify(this.formData),
          }
        }).then(res => {
          if (res.success === true) {
            this.showModal = false;
            this.getList();
          }else{
            let self = this;
            setTimeout(function(){
              self.$Modal.error({title:'异常提示',content:res.Exception.message});
            },500);
          }
        })
      },
      getButton(data, bts) {
        for (let i in data) {
          if (data[i].funcButton) {
            let bt = data[i].funcButton;
            for (let a in bt) {
              if (bt[a].IS_CHECK == 1) {
                bts.push({BTN_ID: bt[a].BTN_ID, BTN_NAME: bt[a].BTN_NAME})
              }
            }
          }
          if (data[i].children) {
            this.getButton(data[i].children, bts)
          }
        }
        return bts;
      },
      getFuncId(data, ids) {
        for (let i in data) {
          if (data[i].checked) {
            ids.push({funcId: data[i].funcId});
          }
          let flag = data[i].children ? true : false;
          if (flag) {
            this.getFuncId(data[i].children, ids);
          }
        }
        return ids;
      },
      pushIds(data) {
        // console.log(data);
        let mydata = this.findId(this.treeData, data);
        this.treeData = mydata;
      },
      spliceId(data) {
        // let data = this.spliceId(data);
        let mydata = this.spliceFunction(this.treeData, data);
      },
      spliceFunction(data, ids) {
        for (let i in data) {
          let flag = data[i].children;
          if (data[i].funcId == ids[0]) {
            // alert(1);
            this.spliceCount(data[i]);
            ids.splice(0, 1);
            this.spliceFunction(this.treeData, ids);
            // }
          } else {
            // if(flag)
            this.spliceFunction(data[i].children, ids)
          }
        }
        return data;
      },
      spliceCount(data) {
        let flag = false;
        for (let i in data.children) {
          if (data.children[i].checked == true) {
            flag = true;
          }
        }
        if (!flag) data.checked = false;
      },
      findId(data, ids) {
        for (let i in data) {
          let flag = data[i].children ? true : false;
          if (data[i].funcId == ids[0]) {
            data[i].checked = true;
            ids.splice(0, 1);
            if (flag) this.findId(data[i].children, ids);
          } else {
            if (flag) this.findId(data[i].children, ids);
          }
        }
        return data;
      },
      changeData(data, type) {
        data.expand = type;
        let flag = data.children ? true : false;
        if (flag) {
          for (let i in data.children) {
            this.changeData(data.children[i], type);
          }
        }
        return data;
      },
      getTree(id='') {
        this.axios.request({
          url: '/manage/sys/roles/getCheckedMenus',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            ROLE_ID: id,
          }
        }).then(res => {
          if (res.success === true) {
            let data = this.changeData(res.data, false);
            data.expand = true;
            this.treeData = [data];
          }
        })
      },
      checkTrue(id) {
        let data = this.setTrue(this.treeData, id);
        this.treeData = data;
      },
      checkFalse(id) {
        let data = this.setFalse(this.treeData, id);
        this.treeData = data;
      },
      setFalse(data, id) {
        for (let i in data) {
          let flag = data[i].children ? true : false;
          if (data[i].funcId == id) {
            data[i].checked = false;
            if (flag) this.setAll(data[i].children, false)
          } else {
            if (flag) this.setFalse(data[i].children, id);
          }
        }
        return data;
      },
      setTrue(data, id) {
        for (let i in data) {
          let flag = data[i].children ? true : false;
          if (data[i].funcId == id) {
            data[i].checked = true;
            if (flag) this.setAll(data[i].children, true)
          } else {
            if (flag) this.setTrue(data[i].children, id);
          }
        }
        return data;
      }, setAll(data, type) {
        for (let i in data) {
          data[i].checked = type;
          let flag = data[i].children ? true : false;
          if (flag) this.setAll(data[i].children, type);
        }
      }
    },
    mounted() {
      this.showTable = Math.random();
      this.getList();
    }
  }
</script>
<style lang="less" scoped>
  #table {
    width: 100%;
    border: 1px solid;
    border-collapse: collapse;
    th {
      border: 1px solid;
      line-height: 30px;
    }
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
</style>

