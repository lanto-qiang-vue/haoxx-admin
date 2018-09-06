<!--选择储值卡 2018-09-06-->
<template>
    <Modal
        v-model="showOnoff"
        title="选择储值卡"
        width="90"
        :scrollable="true"
        :transfer= "showTransfer"
        :footer-hide="false"
        :mask-closable="false"
        class="table-modal-detail"
        :transition-names="['', '']"
    >
    <common-table v-model="tableData" :columns="columns" :show="showoff" :total="total" @changePage="changePage"
        @changePageSize="changePageSize" @onRowClick="onRowClick" :showOperate=false>
        <div slot="search">
           <div class="search-block">
                <Input  placeholder="客户编号/名称号码/联系电话..." v-model="search.input"></Input>
           </div>
            
                <Button type="primary" @click="searchVehicle" size="small"><Icon type="ios-search" size="24"/></Button>
                <Button type="primary" @click="resetVehicle" size="small"><Icon type="ios-undo" size="24"/></Button>
        </div>
    </common-table>

    
  </Modal>
</template>

<script>
import commonTable from '@/hxx-components/common-table.vue'
import { getName, getDictGroup } from '@/libs/util.js'
	export default {
		name: "select-valueCard",
        props:['showoff',"showTransfer","showCardData"],
        components: {commonTable},
        data(){
            return{
                tableHeight: 500,
                timer: null,
                showOnoff:false,
                tableData:[],
                columns: [
                    // {type: 'selection', width: 50, fixed: 'left'},
                    {title: '序号',  minWidth: 80,
                        render: (h, params) => h('span', (this.page-1)*this.limit+params.index+1 )
                    },
                    {title: '客户名称', key: 'NAME', sortable: true, minWidth: 150,
                        //render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.ORDER_TYPE))
                    },
                    {title: '移动电话', key: 'MOBILE_PHONE', sortable: true, minWidth: 150,
                        
                    },
                    {title: '储值卡余额', key: 'SURPLUS_MONEY', sortable: true, minWidth: 150,
                        render: (h, params) => h('span', params.row.SURPLUS_MONEY||0)
                    },
                    
                ],
                total: 0,
                search:{
                    input:''
                },
                page: 1,
                limit: 25,

            }
        },
        watch:{
            showoff(){
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
                        MEMBER_TYPE_eq: this.showCardData.MEMBER_TYPE||'',
                        MEMBER_CARD_STATUS_eq: this.showCardData.MEMBER_CARD_STATUS||'',
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
                this.$emit('selectCard', row);
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
