<!--仓库盘点-->
<template>
  <common-table v-model="tableData" :columns="columns" :total="total" :clearSelect="clearTableSelect"
                @changePage="changePage" @changePageSize="changePageSize" @onRowClick="onRowClick"
                @onRowDblclick="onRowDblclick" :show="showTable" :page="page" :loading="loading">
    <div slot="search">
      <div class="search-block">
        <Input v-model="search.input" placeholder="盘点人/盘点单号..."></Input>
      </div>
      <div class="search-block">
        <Select v-model="search.select1" placeholder="选择状态..." clearable>
          <Option v-for="(item, index) in allCheckStatus"
                  :key="item.code" :value="item.code">{{item.name}}</Option>
        </Select>
      </div>
      
      <Button type="primary" @click="page=1;getList()">搜索</Button>
    </div>
    <div slot="operate">
      <Button type="primary" v-if="accessBtn('add')" :disabled="buttonStateArr.add"  @click="selectPick">新增</Button>
      <Button type="info" v-if="accessBtn('edit')" :disabled="buttonStateArr.edit" @click="editButton">修改/查看</Button>
      <Button type="error" v-if="accessBtn('ban')" :disabled="buttonStateArr.ban" @click="doBantitle">作废</Button>
    </div>
    <!--维修领料详情-->
    <warehouse-check-detail class="table-modal-detail" :showDetail="showDetail" :detailData="detailData" @closeDetail="closeDetail"></warehouse-check-detail>

  </common-table>
</template>
<script>
  import commonTable from '@/hxx-components/common-table.vue'
  import { getName, getDictGroup ,getCreate} from '@/libs/util.js'
  import mixin from '@/hxx-components/mixin'
  import { formatDate } from '@/libs/tools.js'
  import warehouseCheckDetail from './warehouse-check-detail.vue'
export default {
	name: "warehouse-check",
    components: {commonTable,warehouseCheckDetail,},
    mixins: [mixin],
    data(){
		return{
            columns: [
                {title: '序号',  minWidth: 90,align:'center', sortable: true,type:'index'
                    // render: (h, params) => h('span', (this.page-1)*this.limit+params.index+1 )
                },
                {title: '仓库名称', key: 'STORE_NAME', sortable: true, minWidth: 150,
                },
                {title: '盘点类型', key: 'CHECK_TYPE', sortable: true, minWidth: 150,
                    render: (h, params) => h('span', getName(this.getCheckType, params.row.CHECK_TYPE))
                },
                {title: '盘点日期', key: 'CHECK_DATE', sortable: true, minWidth: 150,
                    render: (h, params) => h('span', params.row.CHECK_DATE.substr(0, 10))
                
                },
                {title: '盘点人', key: 'CHECK_PERSON', sortable: true, minWidth: 100,
                    
                },
                {title: '状态', key: 'STATUS', sortable: true, minWidth: 150,
                    render: (h, params) => h('span', getName(this.allCheckStatus, params.row.STATUS))
                },
                {title: '创建人', key: 'CREATER', sortable: true, minWidth: 100,
                    render: (h, params) => h('span', getCreate(this.$store.state.app.tenant, params.row.CREATER))
                },
                {title: '备注', key: 'REMARK', sortable: true, minWidth: 100,
                    
                },
                {title: '盘点单号', key: 'CHECK_NO', sortable: true, minWidth: 150,
                    
                },
            ],
            tableData: [],
            search:{
                input: '',
                select1:'',
            },
            page: 1,
            limit: 25,
            total: 0,
            showTable:false,
            showDetail: false,
            detailData: null,
            clearTableSelect: null,
            isOrderSuccess:false,//判断是不是预约成功
            buttonStateArr:{
                add:false,//维修开单
                edit:true,//编辑
                ban:true,//作废
            },//按钮状态组数据
            allCheckStatus:[],//选择状态数据
            loading:false,
      }
    },
    computed:{
        //得到所有盘点类型----
        getCheckType(){
            return getDictGroup(this.$store.state.app.dict, '1043');
        },
        
    },
    mounted () {
      this.getList();
      this.showTable= Math.random();
      this.allCheckStatus=getDictGroup(this.$store.state.app.dict, '1044');
    },
    methods:{
        //获取列表值-----
        getList(){
            this.loading=true;
            this.axios.request({
                url: '/tenant/part/ttpartcheck/list',
                method: 'post',
                data: {
                    KEYWORD: this.search.input,
                    STATUS_eq: this.search.select1 || '',
                    page: this.page,
                    limit: this.limit,
                    access_token: this.$store.state.user.token
                }
                }).then(res => {
                if (res.success === true) {
                    this.tableData= res.data
                    this.total= res.total
                }
                this.loading=false;
            })
            this.detailData = null;
            for(let i in this.buttonStateArr){
                switch(i){
                    case 'edit':
                    case 'ban': this.buttonStateArr[i]= true; break
                    default : this.buttonStateArr[i]= false;
                }
            }
        },
        clear(){
                for(var i in this.search){
                    this.search[i]= ''
                }
                console.log(this.search);
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

        onRowClick(row, index){
            console.log(row);
            if(row.STATUS=='10441003'||row.STATUS=='10441004'){
                for(let i in this.buttonStateArr){
                    switch(i){
                        case 'ban': this.buttonStateArr[i]= true; break
                        default : this.buttonStateArr[i]= false;
                    }
                }
            }else{
                for(let i in this.buttonStateArr){
                    
                    this.buttonStateArr[i]= false;
                    
                }
            }
            this.buttonStateArr.edit=false;
            this.detailData=row
        },
        onRowDblclick( row, index){
            this.detailData=row;
            this.showDetail=Math.random();
        },
        closeDetail(){
            this.detailData= null;
            this.clearTableSelect= Math.random();
            this.reset();
        },
        //新增按钮
        selectPick(){
            this.detailData=null;
            this.showDetail=Math.random();
        },
        //编辑按钮
        editButton(){
            if(this.detailData){
                this.showDetail=Math.random();
            }else{
                this.$Message.info('请选择一条数据');
            }
        },
        //作废按钮
        doBantitle(){
            this.$Modal.confirm({
                title:"系统提示!",
                content:"确定要作废吗？",
                onOk:this.doBan,
                
            })
        },
        doBan(){
            this.axios.request({
                url: '/tenant/part/ttpartcheck/doBan',
                method: 'post',
                data: {
                    ids: this.detailData.CHECK_ID,
                    access_token: this.$store.state.user.token
                }
                }).then(res => {
                    if (res.success === true) {
                        this.$Message.info('数据作废成功');
                        this.reset();
                    }
                });
        },
        //重置数据-----
        reset(){
            this.getList();
            for(let i in this.buttonStateArr){
                switch(i){
                    case 'edit':
                    case 'ban': this.buttonStateArr[i]= true; break
                    default : this.buttonStateArr[i]= false;
                }
            }
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
