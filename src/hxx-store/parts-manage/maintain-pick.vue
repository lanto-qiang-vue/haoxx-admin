<!--维修领料 2018-09-12修改 -->
<template>
  <common-table v-model="tableData" :columns="columns" :total="total" :clearSelect="clearTableSelect"
                @changePage="changePage" @changePageSize="changePageSize" @onRowClick="onRowClick"
                @onRowDblclick="onRowDblclick" :show="showTable" :page="page" :loading="loading">
    <div slot="search">
      <div class="search-block">
        <Input v-model="search.input" placeholder="工单单号/送修人/联系电话..."></Input>
      </div>
      <div class="search-block">
        <Select v-model="search.select1" placeholder="选择状态..." clearable>
          <Option v-for="(item, index) in searchSelectState1"
                  :key="index" :value="item.code">{{item.name}}</Option>
        </Select>
      </div>
      
      <Button type="primary" @click="page=1;getList()">搜索</Button>
    </div>
    <div slot="operate">
      <Button type="primary" v-if="accessBtn('getpart')" :disabled='!detailData'  @click="selectPick">领料/退料</Button>
    </div>
    <!--维修领料详情-->
    <maintain-pick-detail class="table-modal-detail" :showDetail="showDetail" :detailData="detailData" @closeDetail="closeDetail"></maintain-pick-detail>

  </common-table>
</template>
<script>
  import commonTable from '@/hxx-components/common-table.vue'
  import { getName, getDictGroup } from '@/libs/util.js'
  import mixin from '@/hxx-components/mixin'
  import { formatDate } from '@/libs/tools.js'
  import maintainPickDetail from './maintain-pick-detail.vue'
export default {
	name: "maintain-pick",
    components: {commonTable,maintainPickDetail,},
    mixins: [mixin],
    data(){
		return{
            loading:false,
            columns: [
                {title: '序号',  width: 70,align:'center', sortable: true,type:'index'
                    // render: (h, params) => h('span', (this.page-1)*this.limit+params.index+1 )
                },
                {title: '领料状态', key: 'Status2', sortable: true, minWidth: 120,
                    render: (h, params) => {
                        var bgColor='#00bcd4';
                        if(params.row.Status2==10221002){
                            bgColor='#FF9800';
                        }else{
                            bgColor='#00bcd4';
                        }
                        return h('div', {
                                style: {
                                    width:'100%',
                                    height:'100%',
                                    textAlign: "center",
                                    background: bgColor,
                                    color:'#fff',
                                },
                            },getName(this.getStatus, params.row.Status2))
                        }
                },
                {title: '送修人', key: 'GIVE_REPAIR_PERSON', sortable: true, minWidth: 110,
                },
                {title: '车牌号', key: 'PLATE_NUM', sortable: true, minWidth: 120},
                {title: '车型', key: 'VEHICLE_MODEL', sortable: true, minWidth: 250},
                {title: '进厂日期', key: 'COME_DATE', sortable: true, minWidth: 120},
                {title: '维修类型', key: 'REPAIR_TYPE', sortable: true, minWidth: 120,
                    render: (h, params) => h('span', getName(this.getREPAIRTYPE, params.row.REPAIR_TYPE))
                },
                {title: '工单类型', key: 'GD_TYPE', sortable: true, minWidth: 120,
                    render: (h, params) => h('span', getName(this.getGD_TYPE, params.row.GD_TYPE))
                },
                {title: '主修人', key: 'REPAIR_PERSON', sortable: true, minWidth: 110,
                    // render: (h, params) => h('span', params.row.SUM_MONEY|| '0.00')
                },
                {title: '状态', key: 'STATUS', sortable: true, minWidth: 140,
                    render: (h, params) => h('span', getName(this.getSTATUS, params.row.STATUS))
                },
                {title: '服务顾问', key: 'FOLLOW_PERSON', sortable: true, minWidth: 120},

                {title: '客诉信息', key: 'CUSTOMER_INFO', sortable: true, minWidth: 150},
                
                {title: '维修建议', key: 'REPAIR_INFO', sortable: true, minWidth: 150,
                },
                {title: '工单单号', key: 'REPAIR_NO', sortable: true, minWidth: 160},
            ],
            tableData: [],
            searchSelectState:[],//搜索框选择状态
            searchSelectState1:[],//重新赋值--
            search:{
                input: '',
                select: '',
                select1:'',
                orderDateGte:'',    //开始-时间
                orderDateIte:'',    //结束时间
            },
            page: 1,
            limit: 25,
            total: 0,
            showTable:false,
            showDetail: false,
            detailData: null,
            clearTableSelect: null,

      }
    },
    computed:{
        //领料状态----
        getStatus(){
            return getDictGroup(this.$store.state.app.dict, '1022');
        },
        //维修类型--------
        getREPAIRTYPE(){
            return getDictGroup(this.$store.state.app.dict, '1019');
        },
        //工单类型--------
        getGD_TYPE(){
            return getDictGroup(this.$store.state.app.dict, '1018');
        },
        //工单类型--------
        getSTATUS(){
            return getDictGroup(this.$store.state.app.dict, '1020');
        },

    },
    mounted () {
      //重置搜索框数据
      this.searchSelectState= getDictGroup(this.$store.state.app.dict, '1020');
    //   this.searchSelectState1.push({
    //       "code":"",
    //       "order":0,
    //       "group":"1020",
    //       "name":"全部"
    //   });
      for(let i=0;i<this.searchSelectState.length;i++){
        this.searchSelectState1.push(this.searchSelectState[i]);
      }
      this.getList();
      this.showTable= Math.random();

            
    },
    methods:{
        getList(){
            this.loading=true;
            this.axios.request({
                url: '/tenant/repair/ttrepairgetpart/list',
                method: 'post',
                data: {
                    KEYWORD: this.search.input,
                    STATUS_eq: this.search.select1||'',
                    page: this.page,
                    limit: this.limit,
                    access_token: this.$store.state.user.token
                }
                }).then(res => {
                if (res.success === true) {
                    this.tableData= res.data
                    this.total= res.total
                    this.loading=false;
                }
            })
            this.detailData = null;
        },
        clear(){
                for(var i in this.search){
                    this.search[i]= ''
                }
                this.page=1;
                this.getList()
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
            this.detailData=row
        },
        onRowDblclick( row, index){
            this.detailData=row;
            this.showDetail=Math.random();
        },
        closeDetail(){
            this.detailData= null;
            this.clearTableSelect= Math.random();
            this.getList();
        },
        //维修领料
        selectPick(){
            if(this.detailData){
                this.showDetail=Math.random();
            }else{
                this.$Message.info('请选择一条数据')
            }
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
.button-distance{
  margin-left: 10px;
}
</style>
