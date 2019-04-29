<template>
  <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage"
                :total="total" :show="showTable" :clearSelect="clearType" @onRowClick="onRowClick" :page="page" :loading="loading">
    <div slot="operate">
      <Button type="primary"><upload-img actionUrl='/proxy//manage/sys/picture/upload' @uploadSuccess="uploadSuccess"></upload-img></Button>
      <Button type="primary" @click="getList()">刷新</Button>
    </div>
  </common-table>
</template>

<script>
  import commonTable from '@/hxx-components/common-table.vue'
  import uploadImg from '@/hxx-components/upload-img.vue'
  export default {
    name: "upload-img-manage",
    components: {commonTable,uploadImg},
    data() {
      return {
        total: 0,
        page: 1,
        limit: 25,
        showTable: false,
        clearType: false,
        tableData: [],
        loading:false,
        columns: [
          {
            title: '序号', width: 120,
            render: (h, params) => h('span', (this.page - 1) * this.limit + params.index + 1)
          },
          {
            title: '图片', key: 'url', width: 100,
            render: (h, params) => h('img',{attrs:{src:params.row.url},style:{width:"100px",height:"100px",marginLeft:"-10px",display:'block'},on:{
                click:()=>{
                  // alert(1);
                }
              }},"")
          },
          {
            title:'url',key:'url',minWidth:300,
          },
          {
            title: '上传时间', key: 'upload_date', width: 160,
          },
          {
            title:'操作',width:100,align:'center',
            render: (h, params) => h('Button',{props:{type:'error'},on:{
                click:()=>{
                   this.$Modal.confirm({
                     title:'系统提示!',
                     content:'确认删除吗?',
                     onOk:()=>{
                       this.axios.request({
                         url: '/manage/sys/picture/delete',
                         method: 'post',
                         params: {
                           access_token: this.$store.state.user.token,
                           path:params.row.url,
                           id:params.row.id
                         },
                       }).then(res => {
                         if (res.success) {
                         this.$Message.success("删除成功");
                         this.getList();
                         }
                       })
                     }
                   })
                }
              }},"删除")
          },
        ],
        list: '',
      }
    },
    mounted() {
      this.getList();
      this.showTable = Math.random();
    },
    methods: {
      uploadSuccess(response){
       if(response.success){
         this.$Message.success("上传成功");
         this.getList();
       }
      },
      getList() {
        this.loading = true;
        this.axios.request({
          url: '/manage/sys/picture/list',
          method: 'post',
          params: {
            access_token: this.$store.state.user.token,
            limit: this.limit,
            page: this.page,
          },
        }).then(res => {
          if (res.success) {
            this.tableData = res.data;
            this.total = res.total;
            this.loading = false;
          }
        })
      },
      onRowClick(res) {
        this.list = res;
      },
      changePageSize(size) {
        this.limit = size;
        if (this.page == 1) this.getList();
      },
      changePage(page) {
        this.page = page;
        this.getList();
      }
    }
  }
</script>

<style scoped>

</style>
