<template>
  <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage"
                :total="total" :show="showTable" :clearSelect="clearType" @onRowClick="onRowClick"
                @onRowDblclick="dbclick" :page="page">
    <div slot="search">
      <div class="search-block">
        <Input v-model="search.keyword" placeholder="分类编号/名称..."></Input>
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
      <Button type="primary" @click="add()">新增</Button>
      <Button type="info" :disabled="cando" @click="edit()">修改</Button>
      <Button type="error" :disabled="cando" @click="remove()">作废</Button>
    </div>
    <Modal
      v-model="showModal"
      title="维修项目分类编辑"
      :width="400"
      :mask-closable="false"
      @on-visible-change="visibleChange"
      :scrollable="true"
      :transfer="true"
      :footer-hide="false"
      :transition-names="['', '']">
      <Form :model="formData" ref="formData" :rules="rules" :label-width="100">
        <FormItem label="类型名称:" style="width:90%;" prop="TYPE_NAME">
          <Input v-model="formData.TYPE_NAME" type="text"> </Input>
        </FormItem>
        <FormItem label="备注:" style="width:90%;">
          <Input v-model="formData.REMARK" type="textarea" placeholder="请输入描述信息..."></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="addcancle()">取消</Button>
        <Button type="primary" @click="addpost('formData')">保存</Button>
      </div>
    </Modal>
  </common-table>
</template>
<script>
  import commonTable from '@/hxx-components/common-table.vue'
  import env from '_conf/url'
  import {getName, getDictGroup, getCreate} from '@/libs/util.js'

  export default {
    name: 'maintenance-classify',
    components: {commonTable},
    data() {
      return {
        page: 1,
        limit: 25,
        showModal: false,
        total: 0,
        tableData: [],
        clearType: false,
        showTable: false,
        formData: {
          TYPE_ID:'',
          TYPE_NAME: '',
          REMARK:'',
        },
        list: '',
        rules: {
          TYPE_NAME: [{required: true, message: '类型名称必填'}],
        },
        columns: [
          {title: '项目分类编号', key: 'TYPE_CODE', sortable: true, minWidth: 140},
          {title: '项目分类名称', key: 'TYPE_NAME', sortable: true, minWidth: 140},
          {title: '备注', key: 'REMARK', sortable: true, minWidth: 140}
        ],
        search: {
          keyword: '',
        },
      }
    },
    methods: {
      add() {
        this.reset();
        this.formData.STATUS = this.statusList[0].code;
        this.showModal = true;
      },
      reset() {
        for (let i in this.formData) {
          this.formData[i] = "";
        }
        this.$refs['formData'].resetFields();
      },
      remove() {
        this.$Modal.confirm({title: '系统提示', content: '确认要作废吗?', onOk: this.del});
      },
      del() {
        this.axios.request({
          url: '/manage/basedata/tbrepairitemtype/delete',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            ids:this.list.TYPE_ID,
          }
        }).then(res => {
          if (res.success === true) {
            this.getList();
          }
        })
      },
      edit() {
        this.update(this.list);
      },
      visibleChange() {
        this.clearsection();
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
              onOk: this.tosave,
            });
          } else {
            this.$Message.error("请校对红框信息");
          }
        })
      },
      tosave() {
        this.axios.request({
          url: '/manage/basedata/tbrepairitemtype/save',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            data: JSON.stringify(this.formData),
          }
        }).then(res => {
          if (res.success === true) {
            if(this.formData.TYPE_ID){
              for(let i in this.tableData){
                if(this.tableData[i].TYPE_ID == this.formData.TYPE_ID){
                  let data = [];
                  for(let i in this.tableData){
                    if(this.tableData[i].TYPE_ID == this.formData.TYPE_ID){
                      data.push(res.data);
                    }else{
                      data.push(this.tableData[i]);
                    }
                  }
                  this.tableData = data;
                }
              }
            }else{
              this.tableData.unshift(res.data);
            }
            this.showModal = false;
          }
        })
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
          url: '/manage/basedata/tbrepairitemtype/list',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            limit: this.limit,
            page: this.page,
            KEYWORD: this.search.keyword,
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
      update(row) {
        this.formData = row;
        this.showModal = true;
      },
      clear() {
        this.search.keyword = '';
        this.search.status = '';
      },
      clearsection() {
        this.list = '';
        this.clearType = Math.random();
      }
    },
    mounted() {
      this.showTable = Math.random();
      this.search.status = this.statusList[0].code;
      this.base
      this.getList();
    },
    computed: {
      cando() {
        var flag = this.list == '' ? true : false;
        return flag;
      },
      statusList() {
        return getDictGroup(this.$store.state.app.dict, '1001');
      }
    }

  }
</script>

