<template>
    <Modal
        v-model="showOnoff"
        title="选择车辆"
        width="90"
        :scrollable="true"
        :transfer= "false"
        :footer-hide="false"
    >
    <common-table v-model="tableData" :columns="columns" :show="showoff" :total="total" @changePage="changePage" 
        @changePageSize="changePageSize" @onRowClick="onRowClick">
        <div slot="search">
           <div class="search-block">
                <Input  placeholder="预约单号/预约人/联系电话..." v-model="search.input"></Input>
            </div>
            <ButtonGroup size="small">
                <Button type="primary" @click="searchVehicle"><Icon type="ios-search" size="24"/></Button>
                <Button type="primary" @click="resetVehicle" style="margin-right:20px; margin-left: 1px;"><Icon type="ios-undo" size="24"/></Button>
                <Button type="primary" ><Icon type="md-add" size="24"/>添加客户车辆</Button>
            </ButtonGroup>
        </div>
    </common-table>
  </Modal>
</template>

<script>
import commonTable from '@/hxx-components/common-table.vue'
  import { getName, getDictGroup } from '@/libs/util.js'
	export default {
		name: "common-select-vehicle",
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
                    // {type: 'selection', width: 50, fixed: 'left'},
                    {title: '序号',  minWidth: 60,
                        render: (h, params) => h('span', (this.page-1)*this.limit+params.index+1 )
                    },
                    {title: '车牌号', key: 'PLATE_NUM', sortable: true, minWidth: 100,
                        //render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.ORDER_TYPE))
                    },
                    {title: '车辆颜色', key: 'VEHICLE_COLOR', sortable: true, minWidth: 100,
                        render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.VEHICLE_COLOR))
                    },
                    {title: '客户名称', key: 'CUSTOMER_NAME', sortable: true, minWidth: 100},
                    {title: '联系电话', key: 'MOBILE_PHONE', sortable: true, minWidth: 150},
                    {title: '车架号', key: 'VIN_NO', sortable: true, minWidth: 200},
                    {title: '发动机号', key: 'ENGINE_NO', sortable: true, minWidth: 200,
                        // render: (h, params) => h('span', params.row.ORDER_DATE.substr(0, 10))
                    },
                    {title: '最近来厂日期', key: 'COME_DATE', sortable: true, minWidth: 200},
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
                    url: '/tenant/basedata/ttvehiclefile/list',
                    method: 'post',
                    data: {
                        KEYWORD: this.search.input,
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
                console.log(row);
                this.showOnoff=false;
                this.$emit('selectCar', row);
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
