<template>
  <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage"
                :total="total" :show="showTable" :clearSelect="clearType" :loading="loading" @onRowClick="onRowClick" :page="page">
    <div slot="search">
      <div class="search-block">
        <Input v-model="search.keyword" placeholder="关键字搜索..."></Input>
      </div>
      <div class="search-block">
        <Select v-model="search.check_status" placeholder="请选择状态...">
          <Option v-for="(item, index) in checkList"
                  :key="index" :value="item.code">{{item.name}}
          </Option>
        </Select>
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
      <Button type="success" :disabled="cando" @click="add()">新增维修项目</Button>
      <Button type="error" :disabled="cando" @click="edit()">删除维修项目</Button>
    </div>
    <Modal
      v-model="showModal"
      class="table-modal-detail"
      title="维修项目导入"
      width="90"
      :mask-closable="false"
      @on-visible-change="visibleChange"
      :scrollable="true"
      :transfer="false"
      :footer-hide="false"
      :transition-names="['', '']">
      <Collapse v-model="value1">
        <Panel name="1">
          基本信息
          <div slot="content">
            <Button type="primary" @click="showAll">{{expandHint}}</Button>
            <Tree :data="treeData" show-checkbox ref="myTree"></Tree>
          </div>
        </Panel>
      </Collapse>
      <div style="height:60px;"></div>
      <div slot="footer">
        <Button @click="addcancle()">取消</Button>
        <Button type="primary" @click="xImport">{{buttonName}}</Button>
      </div>
    </Modal>
  </common-table>
</template>
<script>
  import commonTable from '@/hxx-components/common-table.vue'
  import {getName, getDictGroup, getCreate} from '@/libs/util.js'

  export default {
    name: 'three-maintain',
    components: {commonTable},
    data() {
      return {
        value1: '1',
        showType:true,
        page: 1,
        limit: 25,
        showModal: false,
        TENANT_ID:0,
        url:'',
        hintSuccess:'',
        hintError:'',
        expandHint:'',
        treeData:[],
        loading:false,
        total: 0,
        tableData: [],
        clearType: false,
        showTable: false,
        buttonName:'',
        list: '',
        columns: [
          {title: '序号',  minWidth: 70,
            render: (h, params) => h('span', (this.page-1)*this.limit+params.index+1 )
          },
          {title: '门店商户号', key: 'TENANT_NUM', sortable: true, minWidth: 130},
          {title: '门店名称', key: 'TENANT_NAME', sortable: true, minWidth: 160},
          {title: '门店地址', key: 'TENANT_ADD', sortable: true, minWidth: 160},
          {title: '联系人姓名', key: 'LINK_MAN', sortable: true, minWidth: 130},
          {title: '联系方式', key: 'LINK_TEL', sortable: true, minWidth: 120},
          {
            title: '营业状态', key: 'STATUS', sortable: true, minWidth: 120,
            render: (h, params) => h('span', getName(this.statusList, params.row.STATUS))
          },
          {
            title: '审核状态', key: 'CHECK_STATUS', sortable: true, minWidth: 120,
            render: (h, params) => h('span', getName(this.checkList, params.row.CHECK_STATUS))
          },
          {title: '注册时间', key: 'CREATE_TIME', sortable: true, minWidth: 140},
          {title: '审核时间', key: 'AUDIT_TIME', sortable: true, minWidth: 140},
        ],
        search: {
          keyword: '',
          status: 0,
          check_status:0,
        },
      }
    },
    methods: {
      showAll(){
        if(this.showType){
          this.expandHint = "收起全部";
         let data =  this.machine2(this.treeData[0]);
         this.treeData = [data];
         this.showType = !this.showType
        }else{
          this.expandHint = "展开全部";
          let data = this.machine(this.treeData[0]);
          this.treeData = [data];
          this.showType = !this.showType;
        }
      },
      add() {
        this.showModal = true;
        this.buttonName = "导入";
        this.expandHint = "展开全部";
        //获取树....
        this.TENANT_ID = this.list.TENANT_ID;
        this.url = "/manage/basis/three_mro/import";
        this.hintError = '未选择导入项目';
        this.hintSuccess = '导入成功';
        this.getTree(1);
      },
      getTree(flag){
        this.axios.request({
          url: '/manage/basis/three_mro/get_checkitem_tree',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            flag:flag,
            ROLE_ID:'',
            TENANT_ID:this.TENANT_ID,
          }
        }).then(res => {
          if (res.success === true) {
            this.treeData = [];
            this.treeData.push(this.machine(res.data));
          }
        })
      },
      edit() {
        this.TENANT_ID = this.list.TENANT_ID;
        this.buttonName = "删除";
        this.expandHint = "展开全部";
        this.url = "/manage/basis/three_mro/delete";
        this.hintError = "未选择维修项目";
        this.hintSuccess = "维修项目删除成功";
        this.showModal = true;
        this.getTree(2);
      },
      machine(data){
        data['title'] = data.nodeName;
        data['expand'] = false;
        let  flag = data.children ? true : false;
        if (flag) {
          for (let i = 0; i < data.children.length; i++) {
            this.machine(data.children[i]);
          }
        } else {

        }
        return data;
      },
      machine2(data){
        data['title'] = data.nodeName;
        data['expand'] = true;
        let  flag = data.children ? true : false;
        if (flag) {
          for (let i = 0; i < data.children.length; i++) {
            this.machine2(data.children[i]);
          }
        } else {

        }
        return data;
      },
      visibleChange() {
        this.clearsection();
      },
      addcancle() {
        this.showModal = false;
      },
      xImport(){
       let node =  this.$refs.myTree.getCheckedNodes();
       let ids = this.getSon(node,[]);
       if(ids.length > 0){
       //调导入接口..../manage/basis/three_mro/import
         let str = ids.join(",") + ",";
         this.doImport(str);
       }else{
         this.$Modal.info({title:'系统提示',content:this.hintError});
       }
      },
      doImport(str){
        this.axios.request({
          url: this.url,
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            ids:str,
            TENANT_ID:this.TENANT_ID,
          }
        }).then(res => {
          if (res.success === true && res.data == true) {
            this.$Modal.success({title:'系统提示',content: this.hintSuccess});
            this.showModal = false;
          }
        })
        this.clearsection();
      },
      getSon(data,store){
        for(let i in data){
          if(data[i].nodeId != "") store.push(data[i].nodeId);
          let flag = data[i].children ? true : false;
          if(flag) this.getSon(data[i].children,store);
        }
        return store;
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
        this.loading = true;
        this.axios.request({
          url: '/manage/basis/three_mro/get_list',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            limit: this.limit,
            page: this.page,
            KEYWORD:this.search.keyword,
            STATUS_eq:this.search.status == 0 ? '' : this.search.status,
            CHECK_STATUS_eq:this.search.check_status == 0 ? '' : this.search.check_status,
          }
        }).then(res => {
          if (res.success === true) {
            this.tableData = res.data;
            this.total = res.total;
          }
          this.loading = false;
        })
        this.clearsection();
      },
      onRowClick(row) {
        this.list = row;
      },
      update(row) {

      },
      clear() {
        this.search.keyword = '';
        this.search.status = 0;
        this.search.check_status = 0;
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
        let data =  getDictGroup(this.$store.state.app.dict, '1034');
        data.unshift({name:'营业状态...',code:0});
        return data;
      },
      checkList(){
        let data = getDictGroup(this.$store.state.app.dict,'1035');
        data.unshift({name:'审核状态...',code:0});
        return data;
      }
    }

  }
</script>
