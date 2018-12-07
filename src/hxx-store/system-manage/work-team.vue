<template>
  <Split v-model="split" :min="0.1" :max="0.5" class="split">
    <div slot="left" class="split-pane">
      <Button type="success" @click="workshop()" style="margin-left:5px;" v-if="accessBtn('add_shop')">新增车间</Button>
      <Button type="success" @click="addwork()" :disabled="canadd" style="margin-left:5px;" v-if="accessBtn('add_class')">新增班组</Button>
      <Button type="info" :disabled="cando" @click="edit()" style="margin-left:5px;" v-if="accessBtn('edit')">修改</Button>
      <div
        style="width:100%;line-height:30px;border-top:1px solid black;border-bottom:1px solid black;text-align: center;margin-top:10px;">
        车间名称
      </div>
      <Tree :data="data2" @on-select-change="getnode"></Tree>
    </div>
    <div slot="right" style="height:100%;">
      <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" :showSearch="false"
                    @changePage="changePage" :total="total" :showOperate="type == 2" :show="showTable" :page="page">
        <div slot="operate">
          <Button type="primary" @click="setMember" v-if="accessBtn('set_person')">设置班组成员</Button>
        </div>
        <Modal
          v-model="showModal"
          class="table-modal-detail"
          @on-visible-change="visibleChange"
          :title="title"
          width="90"
          :mask-closable="false"
          :scrollable="true"
          :transfer="false"
          :footer-hide="false"
          :transition-names="['', '']">
          <!--<div style="height: 100%;overflow-x:hidden; padding-bottom: 30px;padding-top:10px;">-->
          <Collapse v-model="value1">
            <Panel name="1">
              基本信息
              <Form slot="content" :model="formData" ref="list" :rules="rules" :label-width="100" class="common-form">
                <FormItem :label="labelname" style="width:100%;" prop="SHOP_NAME">
                  <Input v-model="formData.SHOP_NAME" type="text"> </Input>
                </FormItem>
                <FormItem label="其他状况描述" style="width:100%;">
                  <Input v-model="formData.REMARK" type="textarea" placeholder="请输入备注信息..."> </Input>
                </FormItem>
              </Form>
            </Panel>
          </Collapse>
          <!--<Collapse v-model="value3">-->
            <!--<Panel name="3">-->
              <!--其他状况描述:-->
              <!--<Form slot="content" ref="lists" class="common-form">-->
                <!--<Input type="textarea" v-model="formData.REMARK" placeholder="请输入备注信息..."> </Input>-->
              <!--</Form>-->
            <!--</Panel>-->
          <!--</Collapse>-->
          <!--</div>-->
          <div slot="footer">
            <Button @click="addcancle()">取消</Button>
            <Button type="primary" @click="addpost('list')">保存</Button>
          </div>
        </Modal>
        <Modal
          v-model="setModal"
          class="table-modal-detail"
          @on-visible-change="visibleChange"
          title="设置班组成员"
          width="90"
          :mask-closable="false"
          :scrollable="true"
          :transfer="false"
          :footer-hide="false"
          :transition-names="['', '']">
          <!--<div style="height: 100%;width:100%;overflow-x:hidden; padding-bottom: 30px;padding-top:10px;">-->
          <Transfer
            :data="data1"
            :target-keys="targetKeys"
            :titles="titles"
            @on-change="handleChange1"></Transfer>
          <!--</div>-->
          <div slot="footer">
            <Button @click="setcancle()">取消</Button>
            <Button type="primary" @click="setconfirm()">保存</Button>
          </div>
        </Modal>
      </common-table>
    </div>
  </Split>
</template>
<script>
  import commonTable from '@/hxx-components/common-table.vue'
  import {getName, getDictGroup, getCreate} from '@/libs/util.js'
  import mixin from '@/hxx-components/mixin'
  export default {
    name: 'work-team',
    components: {commonTable},
    mixins: [mixin],
    data() {
      return {
        titles: ['未选维修工', '当前已选维修工'],
        data1: [],
        targetKeys: ["1"],
        split: 0.2,
        value1: '1',
        value3: '3',
        addType:0,
        title: '',
        data2: [],
        showModal: false,
        setModal: false,
        storeId: 0,
        obj: '',
        formData: {
          SHOP_ID: '',
          SHOP_NAME: '',
          REMARK: '',
        },
        rules: {
          SHOP_NAME: [{required: true, message: '名称必填'}],
        },
        showTable: false,
        page: 1,
        labelname: '',
        type: 0,
        total: 0,
        classid: 0,
        tableData: [],
        limit: 25,
        columns: [
          {title: '员工姓名', key: 'USER_NAME', sortable: true, minWidth: 140},
          {
            title: '职务', key: 'GROUP_NO', sortable: true, minWidth: 140,
            render: (h, params) => h('span', getName(this.jobtitle, params.row.PROFESSION))
          },
          {title: '员工电话', key: 'TEL_PHONE', sortable: true, minWidth: 140},
        ],
      }
    },
    computed: {
      jobtitle() {
        return getDictGroup(this.$store.state.app.dict, '1012');
      },
      cando() {
        var flag = this.classid > 0 ? false : true;
        return flag;
      },
      canadd() {
        var flag = this.type == 1 ? false : true;
        return flag;
      }
    },
    methods: {
      setcancle() {
        this.setModal = false;
      },
      setconfirm() {
        this.$Modal.confirm({title: '系统提示', content: '确认要保存吗', onOk: this.setpost});
      },
      setpost() {
        ///tenant/basedata/ttworkshop/save_worker_list
        this.axios.request({
          url: '/tenant/basedata/ttworkshop/save_worker_list',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            CLASS_ID: this.classid,
            USER_ID: this.targetKeys.join(','),
          }
        }).then(res => {
          if (res.success === true) {
            this.$Message.success('修改成功');
            this.setModal = false;
            this.getList();
          }
        })
      },
      getAll() {
        ///tenant/basedata/ttworkshop/get_select_worker
        this.axios.request({
          url: '/tenant/basedata/ttworkshop/get_select_worker',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            CLASS_ID: this.classid,
          }
        }).then(res => {
          if (res.success === true) {
            var data = res.data;
            this.data1 = [];
            for (var i in data) {
              this.data1.push({"key": data[i].USER_ID, "label": data[i].USER_NAME});
            }
          }
        })
      },
      handleChange1(newTargetKeys, direction, moveKeys) {
        console.log(newTargetKeys);
        console.log(direction);
        console.log(moveKeys);
        this.targetKeys = newTargetKeys;
      },
      clearsection() {
        this.type = 0;
        this.classid = 0;
      },
      edit() {
        this.title = this.type == 1 ? '车间信息' : '班组信息';
        this.labelname = this.type == 1 ? '车间名称:' : '班组名称:';
        this.formData.SHOP_NAME = this.obj.nodeName;
        this.formData.REMARK = this.obj.remark ? this.obj.remark : '';
        this.storeId = this.obj.nodeId;
        this.addType = 3;
        this.showModal = true;
      },
      addwork() {
        //添加班组....
        this.$refs['list'].resetFields();
        this.formData.REMARK = "";
        if (this.type != 1) {
          this.$Modal.info({title: '提示', content: '请点击选择班组所属车间！'});
          return;
        }
        this.storeId = 0;
        this.labelname = "班组名称:";
        this.title = "班组信息";
        this.addType = 2;
        this.showModal = true;
      },
      visibleChange() {
        // for(var i in this.formData){
        // 	this.formData[i] = "";
        // }
      },
      workshop() {
        //添加车间
        this.$refs['list'].resetFields();
        this.formData.REMARK = '';
        this.storeId = 0;
        this.labelname = "车间名称:";
        this.title = "车间信息";
        this.addType = 1;
        this.showModal = true;
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
              onOk: this.workShopSave,
            });
          } else {
            this.$Message.error("请校对红框信息");
          }
        })
      },
      workShopSave() {
        // /tenant/basedata/ttworkshop/save_shop
        let data = {};
        let hint;
        let url;
        switch(this.addType){
          case 1:
            data = this.formData;
            hint = "车间新增成功";
            url = "/tenant/basedata/ttworkshop/save_shop";
            break;
          case 2:
            hint = "班组新增成功";
            data['SHOP_ID'] = this.classid;
            data['CLASS_ID'] = "";
            data['CLASS_NAME'] = this.formData.SHOP_NAME;
            data['REMARK'] = this.formData.REMARK;
            url = "/tenant/basedata/ttworkshop/save_class";
            break;
          case 3:
            if(this.type == 2){
              data['SHOP_ID'] = "";
              data['CLASS_ID'] = this.classid;
              hint = "班组修改成功";
              data['CLASS_NAME'] = this.formData.SHOP_NAME;
              data['REMARK'] = this.formData.REMARK;
              url = "/tenant/basedata/ttworkshop/save_class";
            }else{
              data = this.formData;
                data['SHOP_ID'] = this.storeId;
                hint = "车间修改成功";
              url = "/tenant/basedata/ttworkshop/save_shop";
            }
            break;
        }
        // if (this.type == 2 && this.storeId > 0) {
        //   data['SHOP_ID'] = "";
        //   data['CLASS_ID'] = this.classid;
        //   hint = "班组修改成功";
        //   data['CLASS_NAME'] = this.formData.SHOP_NAME;
        //   data['REMARK'] = this.formData.REMARK;
        //   url = "/tenant/basedata/ttworkshop/save_class";
        // } else {
        //   if (this.storeId < 1) {
        //     hint = "班组新增成功";
        //     data['SHOP_ID'] = this.classid;
        //     data['CLASS_ID'] = "";
        //     data['CLASS_NAME'] = this.formData.SHOP_NAME;
        //     data['REMARK'] = this.formData.REMARK;
        //     url = "/tenant/basedata/ttworkshop/save_class";
        //   } else {
        //     data = this.formData;
        //     hint = "车间新增成功";
        //     if (this.storeId > 0) {
        //       data['SHOP_ID'] = this.storeId;
        //       hint = "车间修改成功";
        //     }
        //     url = "/tenant/basedata/ttworkshop/save_shop";
        //   }
        // }
        this.axios.request({
          url: url,
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            data: JSON.stringify(data),
          }
        }).then(res => {
          if (res.success === true) {
            this.$Message.success(hint);
            this.showModal = false;
            this.getwork();
          }
        })
      },
      setMember() {
        this.getAll();
        this.targetKeys = [];
        for (var i in this.tableData) {
          this.targetKeys.push(this.tableData[i].PERSON_ID);
        }
        this.setModal = true;
      },
      changePage(page) {
        this.page = page;
        this.getList();
      },
      changePageSize(size) {
        this.limit = size;
        this.getList();
      },
      getList(id) {
        ///tenant/basedata/ttworkshop/worker_list CLASS_ID_eq
        var id = id ? id : this.classid;
        this.axios.request({
          url: '/tenant/basedata/ttworkshop/worker_list',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            CLASS_ID_eq: id,
            limit: this.limit,
            page: this.page,
          }
        }).then(res => {
          if (res.success === true) {
            this.tableData = res.data
            this.total = res.total
          }
        })
      },
      getnode(row) {
        var flag = row[0] ? false : true;
        if (flag) {
          this.classid = 0;
          this.type = 0;
          return;
        }
        this.obj = row[0];
        var nodeId = row[0].nodeId;
        var type = row[0].type ? row[0].type : 0;
        this.type = type;
        this.classid = nodeId;
        if (nodeId > 0 && type == 2) {
          this.getList(nodeId);
        } else {
          this.tableData = [];
          this.total = 0;
          this.page = 1;
        }
      },
      machine(data) {
        data['title'] = data.nodeName;
        var flag = data.children ? true : false;
        if (flag) {
          for (var i = 0; i < data.children.length; i++) {
            this.machine(data.children[i]);
          }
        } else {

        }
        return data;
      },
      getwork() {
        ///tenant/basedata/ttworkshop/get_work_shop_list
        this.axios.request({
          url: '/tenant/basedata/ttworkshop/get_work_shop_list',
          method: 'post',
          data: {access_token: this.$store.state.user.token}
        }).then(res => {
          if (res.success === true) {
            this.data2 = [];
            var data = this.machine(res.data);
            data['expand'] = true;
            this.data2.push(data);
            this.clearsection();
          }
        })

      },
    },
    mounted() {
      this.showTable = Math.random();
      this.getwork();
    }
  }
</script>
<style scoped lang="less">
  .split{
    border: 1px solid #dcdee2;
    background-color: white;
    .split-pane{
      padding: 10px;
      height: 100%;
      overflow: auto;
      position: relative;
      .tree-search{
        padding: 15px;
        border-radius: 3px;
      }
      .tree-input{
        z-index: 1;
      }
      .vehicle-tree{
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
  .vehicle-tree{
    >.ivu-tree-children{
      height: 100%;
      overflow: auto;
    }
    .highlight{
      color: red;
    }
  }
  .ivu-transfer{
    height:100%;
    min-width:800px;
  }
  .ivu-transfer-list{
    width:35%;
    min-width:300px;
    height:80%;
  }
</style>
