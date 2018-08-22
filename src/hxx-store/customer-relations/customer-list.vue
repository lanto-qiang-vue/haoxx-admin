<template>
  <common-table v-model="tableData" :columns="columns" :total="total"
    @changePage="changePage" @changePageSize="changePageSize" @changeSelect="changeSelect">
    <div  slot="search"  >
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
      <Button type="primary" @click="showDetail=true">新增</Button>
      <Button type="info">编辑/查看</Button>
      <Button type="error" @click="remove">作废</Button>
      <Button type="success" @click="lead()">导入</Button>
      <!-- 上传文件 -->

      <!-- 这里结束 -->
      <!--多重提示开始-->

      <!--多重提示结束-->
    </div>
    </div>
    <!-- 警告提示 -->
    <common-modal6 slot="modal6" @changeModal6="changeModal6" :description="description" :title="title" :modal6="mshow" :fun="funName" @del="del"></common-modal6>
    <!-- 警告提示 -->
<!--     <reservation-list-detail slot="detail" :showDetail="showDetail"></reservation-list-detail> -->
  </common-table>
</template>
<script>
    import commonTable from '@/hxx-components/common-table.vue'
      import { getName, getDictGroup } from '@/libs/util.js'
      import commonModal6 from '@/hxx-components/common-modal6.vue'
      import env from '_conf/url'
  export default {
    name: "customer-list",
    components: {commonTable,commonModal6},
    data(){
      return{
        columns: [
          {type: 'selection', width: 50, fixed: 'left'},
          {title: '序号',  minWidth: 80,
            render: (h, params) => h('span', (this.page-1)*this.limit+params.index+1 )
          },
           {title: '客户编号', key: 'CODE', sortable: true, minWidth: 150},
          {title: '客户名称', key: 'NAME', sortable: true, minWidth: 150},
          {title: '移动电话', key: 'MOBILE_PHONE', sortable: true, minWidth: 150},
          {title: '客户类型', key: 'CUSTOMER_TYPE', sortable: true, minWidth: 150,
            render: (h, params) => h('span',getName(this.$store.state.app.dict, params.row.CUSTOMER_TYPE))
          },
          {title: '客户等级', key: 'CUSTOMER_LEVEL', sortable: true, minWidth: 150,
            render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.CUSTOMER_LEVEL))
          },
          {title: '客户专员', key: 'FOLLOW_PERSON', sortable: true, minWidth: 150},
          {title: '创建人', key: 'CREATER', sortable: true, minWidth: 150
            // render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.CREATER))
          },
          {title: '创建时间', key: 'CREATE_TIME', sortable: true, minWidth: 150
          },
          {title: '备注', key: 'REMARK', sortable: true, minWidth: 150},
        ],
        tableData: [],
        searchSelectOption:[],
        search:{
          input: '',
          number: ''
        },
        page: 1,
        limit: 25,
        total: 0,
        showDetail: false,
        list:[],
        mshow:false,
        funName:'del',
        description:'',
        title:'',
        modal2:false,
        modal3:true,
        modal_loading:false,
        loadingStatus: false,
        file:'',
        filename:'请选择文件excel',
        token:{access_token:''},
        filenames:'uploadFile',
        baseUrl: ''
      }
    },
    mounted () {
      this.token.access_token = this.$store.state.user.token;
      this.getList()
      this.baseUrl=env
      console.log(env)
    },
    methods:{
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
        var that = this;
        that.list = [];
        selection.filter(function(item){
          that.list.push(item.CUSTOMER_ID);
        });
      },
      remove(){
        if(this.list.length == 0){
          this.$Message.info("未选择到数据!");
        }else{
           this.title = '系统提示!';
           this.description = '客户档案作废后，该客户下属车辆也将作废，确认要作废吗？';
           this.mshow = true;
        }
      },
      del(){
          this.axios.request({
          url: 'tenant/basedata/ttcustomerfile/cancel',
          method: 'post',
          data: {
            ids:this.list.join(','),
            access_token: this.$store.state.user.token
          }
        }).then(res => {
          if (res.success === true) {
            this.$Message.success('作废成功');
            this.getList();
          } 
        })
      },
      changeModal6(type){
        this.mshow = type;
      },
      down(){
        window.location.href = "http://hxx.test.hoxiuxiu.com/resources/excel/customer.xls";
      },
      beforeUpload(files){
        this.filename = files.name;
        this.file = files;
        return false;
      },
      upload(){
      if(this.filename == '请选择文件excel'){
       this.$Message.error('请选择excel');
       return;
      }
      this.$refs.upload.post(this.file);
      },
    uploadClose(){
      this.modal2 = false;
    },
    lead(){
    this.modal2 = true;
    },
    uploadSuccess(res){
    alert(res);
    },
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