<template>
    <Modal
      :transition-names="['', '']"
        v-model="showOnoff"
        title="选择客户"
        width="90"
        :scrollable="true"
        :transfer= "false"
        :footer-hide="true"
    >
    <common-table v-model="tableData" :columns="columns" :show="showoff" :total="total" @changePage="changePage" 
        @changePageSize="changePageSize" @onRowClick="onRowClick">
        <div slot="search">
           <div class="search-block">
                <Input  placeholder="客户编号/手机号/联系电话..." v-model="search.input"></Input>
            </div>
            <div class="search-block">
                <Input placeholder="车牌号码..." v-model="search.num"></Input>
            </div>
            <ButtonGroup size="small">
                <Button type="primary" @click="searchVehicle"><Icon type="ios-search" size="24"/></Button>
                <Button type="primary" @click="resetVehicle" style="margin-right:20px; margin-left: 1px;"><Icon type="ios-undo" size="24"/></Button>
                <Button type="primary" ><Icon type="md-add" size="24"/>新增客户</Button>
            </ButtonGroup>
        </div>
    </common-table>
  </Modal>
</template>

<script>
import commonTable from '@/hxx-components/common-table.vue'
  import { getName, getDictGroup } from '@/libs/util.js'
	export default {
		name: "select-customer",
        props:['showoff'],
        components: {commonTable},
        data(){
            return{
                collapse: ['1','2'],
                tableHeight: 500,
                timer: null,
                showOnoff:false,
                tableData:[],
                columns: [
                    {title: '序号',  minWidth: 60,
                        render: (h, params) => h('span', (this.page-1)*this.limit+params.index+1 )
                    },
                    {title: '客户名称', key: 'NAME', sortable: true, minWidth: 100},
                    {title: '联系电话', key: 'MOBILE_PHONE', sortable: true, minWidth: 150},
                     {title: '客户类型', key: 'CUSTOMER_TYPE', sortable: true, minWidth: 150,
            render: (h, params) => h('span',getName(this.$store.state.app.dict, params.row.CUSTOMER_TYPE))
          },
          {title: '客户等级', key: 'CUSTOMER_LEVEL', sortable: true, minWidth: 150,
            render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.CUSTOMER_LEVEL))
          },
          {title: '客户专员', key: 'FOLLOW_PERSON', sortable: true, minWidth: 150},
                ],
                total: 0,
                search:{
                    input:'',
                    num:'',
                },
                page: 1,
                limit: 25,

            }
        },
        watch:{
            showoff(){
                console.log("点击我了");
                this.showOnoff=true;
                this.getList();
            }
        },
        mounted() {
            
        },
        methods:{
            getList(){
                this.axios.request({
                    url: '/tenant/basedata/ttcustomerfile/list',
                    method: 'post',
                    data: {
                        KEYWORD: this.search.input,
                        page: this.page,
                        limit: this.limit,
                        PLATE_NUM:this.search.num,
                        access_token: this.$store.state.user.token
                    }
                }).then(res => {
                    if (res.success === true) {
                        this.tableData= res.data
                        this.total= res.total
                    }
              })
            },
            changePage(page){
                this.page= page
                this.getList()
            },
            changePageSize(size){
                this.limit= size
                this.getList()
            },
            onRowClick( row, index){
                this.showOnoff=false;
                this.$emit('select', row);
            },
            searchVehicle(){
                this.page=1;
                this.getList();
            },
            resetVehicle(){
                for(let i in this.search){
                    this.search[i]= ''
                }
                this.page=1;
                this.getList();
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
    .common-table{
        padding: 10px;
        background-color: white;
        height: 100%;
        overflow: hidden;
        position: relative;
        .table-search{
        }
        .operate{
            margin-top: 10px;
            padding: 15px;
            border: 1px solid #dcdee2;
            border-radius: 3px;
        }
        .main-table{
            margin-top: 10px;
        }
        .table-bottom{
            position: absolute;
            height: 52px;
            padding: 10px;
            width: 100%;
            left: 0;
            bottom: 0;
            background-color: white;
            z-index: 4;
        }
    }
</style>