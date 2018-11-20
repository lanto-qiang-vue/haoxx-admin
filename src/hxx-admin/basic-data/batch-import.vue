<template>
  <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage"
                :total="total" :show="showTable" :clearSelect="clearType" @onRowClick="onRowClick"
                @onRowDblclick="dbclick" :page="page">
    <div slot="search">
      <div class="search-block">
        <Input v-model="search.keyword" placeholder="关键字搜索..."></Input>
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
      <Button type="primary" @click="port">导出配件类型清单</Button>
      <Button type="primary" :disabled="canDo" @click="upload">批量导入配件</Button>
    </div>
    <upload-excel :type="uploadShow" :downUrl="'/common/basedata/partImport/downloadPartTemple'" :TENANT_ID="list.TENANT_ID || ''" :actionUrl="'/manage/basedata/partimport/import_part'" :title="'配件批量导入'" :description="description" :success="'success'" @success="uploadSuccess"></upload-excel>
  </common-table>
</template>
<script>
  import commonTable from '@/hxx-components/common-table.vue'
  import env from '_conf/url'
  import uploadExcel from '@/hxx-components/upload-excel.vue'
  import {getName, getDictGroup, getCreate} from '@/libs/util.js'
  export default {
    name: 'batch-import',
    components: {commonTable,uploadExcel},
    data() {
      return {
        page: 1,
        limit: 25,
        total: 0,
        tableData: [],
        uploadShow:false,
        clearType: false,
        showTable: false,
        description:[{des:'1、点击“浏览”按钮，找到您所要导入的Excel文件,”;'},{des:'2、选择好文件后, 点“确定”按钮完成导入。'}],
        baseUrl:"",
        list: '',
        columns: [
          {
            title: '序号', minWidth: 70,
            render: (h, params) => h('span', (this.page - 1) * this.limit + params.index + 1)
          },
          {title: '企业登录账号', key: 'USER_CODE', sortable: true, minWidth: 140},
          {title: '门店商户号', key: 'TENANT_NUM', sortable: true, minWidth: 140},
          {title: '门店名称', key: 'TENANT_NAME', sortable: true, minWidth: 120},
          {title: '门店地址', key: 'TENANT_ADD', sortable: true, minWidth: 120},
          {title: '联系人姓名', key: 'LINK_MAN', sortable: true, minWidth: 140},
          {title: '联系方式', key: 'LINK_TEL', sortable: true, minWidth: 120},
          {title: '营业状态', key: 'STATUS', sortable: true, minWidth: 120,
            render: (h, params) => h('span',getName(this.list1034,params.row.STATUS))
          },
          {title: '注册时间', key: 'CREATE_TIME', sortable: true, minWidth: 120,
           render:(h,params)=>h('span',params.row.CREATE_TIME.substr(0,10))
          },
          {title: '审核时间', key: 'AUDIT_TIME', sortable: true, minWidth: 120,
            render:(h,params)=>h('span',params.row.AUDIT_TIME.substr(0,10))
          },
        ],
        search: {
          keyword: '',
        },
      }
    },
    methods: {
      upload(){
        this.uploadShow = Math.random();
      },
      uploadSuccess(res){
        if(res.success == true){
          let flag = res.data.errorList ? true : false;
          if(flag && res.data.errorList.length > 0){
            let content = "";
            let data = res.data.errorList;
            for(let i in data){
              content += "<div>第"+data[i].rowNum+ "行" + data[i].errorMsg +"</div> ";
            }
            this.$Modal.error({title:'导入错误提示',content:content,width:600});
          }else{
            this.$Message.success('批量导入成功');
            this.uploadShow = false;
            this.getList();
          }
        }else{
          this.$Modal.error({title:'系统提示',content:res.Exception.message});
        }
      },
      port(){
        window.location.href = this.baseUrl + "/manage/basedata/partimport/new_export_part?access_token=" + this.$store.state.user.token + "&KEYWORD=" + this.KEYWORD;
      },
      visibleChange() {
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
      getList() {
        this.axios.request({
          url: '/manage/basedata/partimport/list',
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
      clear() {
        this.search.keyword = '';
      },
      clearsection() {
        this.list = '';
        this.clearType = Math.random();
      }
    },
    mounted() {
      this.showTable = Math.random();
      this.baseUrl = env;
      this.getList();
    },
    computed: {
      canDo(){
        return this.list == "";
      },
      list1034(){
        return getDictGroup(this.$store.state.app.dict,'1034');
      }
    }

  }
</script>
