<template>
  <common-table v-model="tableData" :columns="columns" :total="total" :show="showTable"
    @changePage="changePage" :clearSelect="cleartype" :page="page" ref="selection" @changePageSize="changePageSize" @onRowClick="onRowClick" @onRowDblclick="double">
    <div slot="search">
      <div class="search-block">
        <Input v-model="search.input" placeholder="客户编号/名称/手机号码..."></Input>
      </div>
      <div class="search-block">
        <Input v-model="search.number" placeholder="车牌号码..."></Input>
      </div>
      <ButtonGroup size="small">
        <Button type="primary" @click="page=1;getList()"><Icon type="ios-search" size="24"/></Button>
        <Button type="primary" @click="clear()"><Icon type="ios-undo" size="24"/></Button>
      </ButtonGroup>
    </div>
    <div slot="operate">
      <Button type="primary" @click="add()">新增</Button>
      <Button type="info" :disabled="cando" @click="edit()">编辑/查看</Button>
      <Button type="error" :disabled="cando" @click="remove()">作废</Button>
      <Button type="success" @click="lead()">导入</Button>
      <Button type="primary" @click="expor()">导出</Button>
    </div>
    <!-- 添加查询修改-->
    <!-- class="table-modal-detail" -->
    <customer-list-detail  :show="showDetail" @refresh="getList()" :detail="detail" class="table-modal-detail" @clearsection="clearsection"></customer-list-detail>
    <!-- Excel上传 -->
    <upload-excel  :type="etype" :success="'esuccess'" @esuccess="esuccess"></upload-excel>
  </common-table>
</template>
<script>
    import commonTable from '@/hxx-components/common-table.vue'
    import { getName, getDictGroup,getCreate } from '@/libs/util.js'
    import uploadExcel from '@/hxx-components/upload-excel.vue'
    import customerListDetail from '@/hxx-store/customer-relations/customer-list-detail.vue'
    import env from '_conf/url'
  export default {
    name: "customer-list",
    components: {commonTable,uploadExcel,customerListDetail},
    data(){
      return{
        columns: [
          {title: '序号',  minWidth: 80,
            render: (h, params) => h('span', (this.page-1)*this.limit+params.index+1)
          },
           {title: '客户编号', key: 'CODE', sortable: true, minWidth: 120},
          {title: '客户名称', key: 'NAME', sortable: true, minWidth: 120},
          {title: '移动电话', key: 'MOBILE_PHONE', sortable: true, minWidth: 130},
          {title: '客户类型', key: 'CUSTOMER_TYPE', sortable: true, minWidth: 120,
            render: (h, params) => h('span',getName(this.$store.state.app.dict, params.row.CUSTOMER_TYPE))
          },
          {title: '客户等级', key: 'CUSTOMER_LEVEL', sortable: true, minWidth: 120,
            render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.CUSTOMER_LEVEL))
          },
          {title: '客户专员', key: 'FOLLOW_PERSON', sortable: true, minWidth: 120},
          {title: '创建人', key: 'CREATER', sortable: true, minWidth: 100,
            render: (h, params) => h('span', getCreate(this.$store.state.app.tenant, params.row.CREATER))
          },
          {title: '创建时间', key: 'CREATE_TIME', sortable: true, minWidth: 120
          },
          {title: '备注', key: 'REMARK', sortable: true, minWidth: 150},
        ],
        tableData: [],
        searchSelectOption:[],
        search:{
          input: '',
          number: ''
        },
        cleartype:false,//清除选中效果
        page: 1,
        limit: 25,
        detail:{},
        total: 0,
        list:[],//复选框选中参数
        mshow:false,//modal6显示隐藏
        funName:'del',//modal6确认回调
        description:'',//modal6提示说明
        title:'',//modal6标题
        etype:false,//excel上传显示
        showDetail:true,//detail查询修改
        selection:'',//存储选择的对象
        showTable: false
      }
    },
    mounted () {
      this.getList()
      this.baseUrl=env
      // console.log(env)
      this.showTable= true
    },
    methods:{
      add(){
      this.showDetail=Math.random();
      var formData = {
          name:'',
          phone:'',
          address:'',
          tel:'',
          idcard:'',
          CUSTOMER_ID:'',
          birthday:'',
          sex:'',
          resource:'',
          level:'',
          type:'',
          qq:'',
          wx:'',
          attach:'',
          email:'',
          snumber:'',
          remark:'',
        }
      this.detail = formData;
      },
      clearsection(){
        this.selection = '';
        this.cleartype = Math.random();
      },
      getList:function(){
             this.axios.request({
          url: 'tenant/basedata/ttcustomerfile/list',
          method: 'post',
          data: {
            KEYWORD: this.search.input,
            PLATE_NUM:this.search.number,
            page: this.page,
            limit: this.limit,
            access_token: this.$store.state.user.token
          }
        }).then(res => {
          if (res.success === true) {
            this.list = [];
            this.tableData= res.data
            this.total= res.total
            this.clearsection();
          }
        })
      },
      clear:function(){
                for(let i in this.search){
          this.search[i]= ''
        }
        this.page=1;
        this.list = [];
        this.getList()
      },
      changePage(page){
        this.page= page
        this.getList()
      },
      changePageSize(size){
        this.limit= size
         this.list = [];
        this.getList()
      },
      changeSelect(selection){
        // this.selection = selection;
        // var that = this;
        // that.list = [];
        // selection.filter(function(item){
        //   that.list.push(item.CUSTOMER_ID);
        // });
      },
      remove(){
                    this.$Modal.confirm({
                      title:'系统提示!',
                      content:'客户档案作废后，该客户下属车辆也将作废，确认要作废吗？',
                      onOk:this.del,
                    });
      },
      del(){
        //调用接口删除list中数据
          this.axios.request({
          url: 'tenant/basedata/ttcustomerfile/cancel',
          method: 'post',
          data: {
            ids:this.selection.CUSTOMER_ID,
            access_token: this.$store.state.user.token
          }
        }).then(res => {
          if (res.success === true) {
            this.$Message.success('作废成功');
            this.getList();
          }
        })
      },
    lead(){
      //导入显示弹出上传
      this.etype = Math.random();
    },
    esuccess(res){
      //Excel成功上传回调
      var title = "导入错误信息";
      var content = "";
      if(res.data === true){
        title = "提示信息";
        content = "批量导入成功";
        this.getList();
                 this.$Modal.success({
                            title: title,
                            content: content
                        });
      return;
      }
      //有错误集合展示
      if(res.data.errorList.length > 0){
           res.data.errorList.filter(function(item){
            content += '<p>'+ '第' + item.rowNum + '行,'+ item.errorMsg + '</p>';
           });
           this.$Modal.error({
                            title: title,
                            content: content
                        });
      }
    },
    expor(){
      //导出Excel文件
      window.location.href = "http://hxx.test.hoxiuxiu.com/tenant/basedata/ttcustomerfile/doExport?KEYWORD="+this.search.input+"&PLATE_NUM="+this.search.number+"&access_token="+this.$store.state.user.token;
    },
    double(row,index){
     this.showDetail = Math.random();
     this.detail = row;
    },
    onRowClick(row){
    this.selection = row;
    },
    edit(){
     this.detail = this.selection;
     this.showDetail = Math.random();
    },
    },
computed:{
  cando(){
    var flag = this.selection == '' ? true : false;
    return flag;
  }
  }
}
</script>
<style lang="less" scoped>
.search-block{
  display: inline-block;
  width: 200px;
  margin-right: 10px;
}
.ftext{
  text-align:left;
}
</style>
