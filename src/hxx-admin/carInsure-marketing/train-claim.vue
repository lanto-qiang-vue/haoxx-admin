<template>
  <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage"
                :total="total" :show="showTable" :clearSelect="clearType" :page="page">
  </common-table>
</template>
<script>
  import commonTable from '@/hxx-components/common-table.vue'
  export default {
        name: "train-claim",
       components: {commonTable},
       data(){
          return{
            tableData:[],
            columns:[
              {title: '扫车牌时间', key: 'createDate', sortable: true, minWidth: 140,align:'center'},
              {title: '认领', key: 'claim', sortable: true, minWidth: 140,align:'center',
                render: (h, params) => {
                  return h('div', [
                    h('Button', {
                      props: {
                        type: 'primary',
                        size: 'small'
                      },
                      style: {
                        width:"80px",
                        textAlign: "center",
                      },
                      on: {
                        click: (index) => {
                           this.claim(params.row.id);
                        }
                      }
                    }, '认领'),
                  ]);
                }
              },
            ],
            total:0,
            showTable:false,
            clearType:false,
            page:1,
            size:25,
          }
       },
    mounted(){
          this.getList();
          this.showTable = Math.random();
    },
    methods:{
      claim(index){
        this.$Modal.confirm({
          title:'系统提示',
          content:'确认认领',
          onOk:()=>{
            this.axios.request({
              baseURL: '/poxy-next',
              url: '/manage/claim/claimStatus',
              method: 'post',
              data: {
                access_token: this.$store.state.user.token,
                id:index,
              },
            }).then(res => {
              if (res.success === true) {
                 this.$Message.success("认领成功");
                 this.getList();
              }
            })
          }
        });
      },
      getList(){
        this.axios.request({
          baseURL: '/poxy-next',
          url: '/manage/claim/list',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            page:this.page,
            limit:this.size,
          },
        }).then(res => {
          if (res.success === true) {
            this.total = res.total;
            this.tableData = res.data;
          }
        })
      },
      changePageSize(size){
        this.size = size;
        this.getList();
      },
      changePage(page){
        this.page = page;
        this.getList();
      }
    },
    }
</script>

<style scoped>

</style>
