<template>
    <Modal
        v-model="showOnoff"
        title="选择车辆"
        width="80"
        :scrollable="true"
        :transfer= "true"
        :footer-hide="false"
        :mask-closable="false"
        class="table-modal-detail"
        :transition-names="['', '']"
    >
    <common-table v-model="tableData" :columns="columns" :show="showoff" :total="total" @changePage="changePage"
        @changePageSize="changePageSize" @onRowClick="onRowClick" :showOperate=false :page="page">
        <div slot="search">
           <div class="search-block">
                <Input  placeholder="客户名称/车牌号码/联系电话..." v-model="search.input"></Input>
           </div>

                <Button type="primary" @click="page=1;getList()" >搜索</Button>


                <Button type="success" @click="showAddVehicle=Math.random()" style="margin-left: 20px;">新增客户车辆</Button>
        </div>
    </common-table>

    <select-addVehicle :showAddVehicle="showAddVehicle" @selectAddVehicleFun="selectAddVehicleFun"></select-addVehicle>
  </Modal>
</template>

<script>
import commonTable from '@/hxx-components/common-table.vue'
import selectAddVehicle from '@/hxx-components/select-addVehicle.vue'
import { getName, getDictGroup } from '@/libs/util.js'
	export default {
		name: "select-vehicle",
        props:['showoff',"showTransfer"],
        components: {commonTable,selectAddVehicle},
        data(){
            return{
                showAddVehicle:"",
                collapse: ['1','2'],
                tableHeight: 500,
                timer: null,
                showOnoff:false,
                tableData:[],
                columns: [
                    // {type: 'selection', width: 50, fixed: 'left'},
                    {title: '序号',  minWidth: 80,align:'center',
                        render: (h, params) => h('span', (this.page-1)*this.limit+params.index+1 )
                    },
                    {title: '车牌号', key: 'PLATE_NUM', sortable: true, minWidth: 120,
                        //render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.ORDER_TYPE))
                    },
                    {title: '车辆颜色', key: 'VEHICLE_COLOR', sortable: true, minWidth: 120,
                        render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.VEHICLE_COLOR))
                    },
                    {title: '客户名称', key: 'CUSTOMER_NAME', sortable: true, minWidth: 120},
                    {title: '联系电话', key: 'MOBILE_PHONE', sortable: true, minWidth: 135},
                    {title: '车架号', key: 'VIN_NO', sortable: true, minWidth: 200},
                    {title: '车型', key: 'VEHICLE_MODEL', sortable: true, minWidth: 200,
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
            },
            selectAddVehicleFun(){
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

</style>
