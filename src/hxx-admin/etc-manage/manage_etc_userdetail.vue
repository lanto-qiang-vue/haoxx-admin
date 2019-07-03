
<template>
  <common-table v-model="tableData" :columns="columns" :total="total" :clearSelect="clearTableSelect"
                @changePage="changePage" @changePageSize="changePageSize"
                 :show="showTable" :page="page">
    <div slot="search">
    </div>
    <div slot="operate">
    </div>
  </common-table>
</template>
<script>
import commonTable from '@/hxx-components/common-table.vue'
import { formatDate } from '@/libs/tools.js'
export default {
	name: "manage_etc_userdetail",
    components: {commonTable},
    data(){
		return{
            columns: [
                {title: '日期', key: 'datetime', sortable: true, minWidth: 150,
                },
                {title: '新用户访问ETC页面(人)', key: 'newuserEtc', sortable: true, minWidth: 150,
                },
                {title: '注册车生活(人)', key: 'carRegister', sortable: true, minWidth: 150},
                {title: '填写了ETC申请(人)', key: 'etcApplication', sortable: true, minWidth: 120,
                },
            ],
            tableData: [],
            page: 1,
            limit: 25,
            total: 0,
            showTable:false,
            showDetail: false,
            detailData: null,
            clearTableSelect: null,
      }
    },
    mounted () {
      this.getList();
      this.showTable= Math.random();
    },
    methods:{
        //获取列表值-----
        getList(){
            this.axios.request({
                baseURL: '/poxy-shqx',
                url: '/manage/etc/queryEtcInfo',
                method: 'post',
                data: {
                    page: this.page,
                    limit: this.limit,
                    access_token: this.$store.state.user.token
                }
            }).then(res => {
                if (res.success === true) {
                    this.tableData= res.data
                    this.total= res.total
                }
            })
            this.detailData = null;
            
        },
        changePage(page){
            this.page= page
            this.getList()
        },
        changePageSize(size){
            this.limit= size
            this.getList()
        },
        closeDetail(){
            this.detailData= null;
            this.clearTableSelect= Math.random();
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
.button-distance{
  margin-left: 10px;
}
</style>
