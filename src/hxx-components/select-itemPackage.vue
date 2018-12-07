
<!--选择维修项目套餐组件 2018-08-23 -->
<template>
    <Modal
        v-model="showOnoff"
        title="选择维修项目套餐"
        width="90"
        :scrollable="true"
        :transfer= "showTransfer"
        :mask-closable="false"
        :transition-names="['', '']"
        :footer-hide="false"
        class="table-modal-detail"
    >
    <common-table v-model="tableData" :columns="columns" :show="showSelectItemGroup" :total="total" @changePage="changePage"
        @changePageSize="changePageSize" @onRowClick="onRowClick" :showOperate=false>
        <div slot="search">
            <Form class="common-form">
                <FormItem>
                    <Input  placeholder="项目套餐编号/名称..." v-model="test1"></Input>
                </FormItem>


                    <ButtonGroup size="small">
                        <Button type="primary" title="查询" @click="searchVehicle">搜索</Button>
                        <!--<Button type="primary" title="重置" @click="resetVehicle"><Icon type="ios-undo" size="28"/></Button>-->
                    </ButtonGroup>

           </Form>

        </div>
    </common-table>
    <div slot="footer">
        <Button type="primary" @click="showOnoff=false;" style="margin-right: 10px;">确定</Button>

    </div>
  </Modal>
</template>

<script>
import commonTable from '@/hxx-components/common-table.vue'
  import { getName, getDictGroup } from '@/libs/util.js'
	export default {
		name: "select-itemPackage",
        props:['showSelectItemGroup','initItemGroup',"showTransfer"],
        components: {commonTable},
        data(){
            return{
                test1:'',
                collapse: ['1','2'],
                tableHeight: 500,
                timer: null,
                showOnoff:false,
                tableData:[],
                selectData:[],
                //表格内容数据----

                columns: [
                    // {type: 'selection', width: 50, fixed: 'left'},
                    {title: '序号',  width: 70,align:'center',
                        render: (h, params) => h('span', (this.page-1)*this.limit+params.index+1 )
                    },
                    {title: '项目套餐编号', key: 'GROUP_NO', sortable: true, minWidth: 160,
                        //render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.ORDER_TYPE))
                    },
                    {title: '项目套餐名称', key: 'GROUP_NAME', sortable: true, minWidth: 160,
                        // render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.VEHICLE_COLOR))
                    },
                    {title: '套餐销售价格(元)', key: 'SALES_PRICE', sortable: true, minWidth: 160,align:'right',
                        render: (h, params) => h('span', this.formatMoney(params.row.SALES_PRICE))
                    },
                    {title: '状态', key: 'STATUS', sortable: true, minWidth: 80,
                        render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.STATUS))
                    },
                    {title: '操作', key: 'operation', sortable: true, minWidth: 80,fixed: 'right',align:'center',
                        render: (h, params) => {
                            let buttonContent= this.state(params.row)? '取消选择':'选择';
                            let buttonStatus= this.state(params.row)? 'default':'warning';
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: buttonStatus,
                                        size: 'small'
                                    },
                                    style: {
                                        width:"80px",
                                        textAlign: "center",


                                    },
                                    on: {
                                        click: (index) => {
                                            this.select(params.row)
                                        }
                                    }
                                }, buttonContent),
                            ]);
                        }
                    },
                ],
                total: 0,
                page: 1,
                limit: 25,
            }
        },
        watch:{
            showSelectItemGroup(){
                console.log("点击选择项目套餐了",this.initItemGroup);
                this.showOnoff=true;
                this.getList();
                this.resetVehicle();
                this.selectData=this.initItemGroup;
            }
        },
        mounted() {

        },
        methods:{
            state(item){
                for(let i in this.selectData){
                    if(this.selectData[i].GROUP_ID== item.GROUP_ID){
                        return true
                    }
                }
                return false
            },
            select(item){
                let flag=true
                for(let i in this.selectData){
                    if(this.selectData[i].GROUP_ID== item.GROUP_ID){
                        this.selectData.splice(i,1)
                        flag= false
                        break;
                    }
                }
                if(flag) this.selectData.push(item);
                this.$emit('selectItemGroup', this.selectData);
                // console.log('this.selectData',this.selectData)
            },
            //获取表格数据
            getList(){
                this.axios.request({
                    url: '/tenant/basedata/repairitemgroup/list',
                    method: 'post',
                    data: {
                        KEYWORD: this.test1,
                        page: this.page,
                        limit: this.limit,
                        access_token: this.$store.state.user.token
                    }
                }).then(res => {
                    if (res.success === true) {
                        console.log("得到列表数据",res);
                        this.tableData= res.data.filter((value)=>{
                            return value.STATUS=="10011001";
                        });

                        this.total= this.tableData.length;

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

            },
            searchVehicle(){
                this.page=1;
                this.getList();
            },
            resetVehicle(){
                this.test1="";
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

</style>
