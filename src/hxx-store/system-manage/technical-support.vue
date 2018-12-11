<!--技术支持 2018-09-04 -->
<template>
  <common-table v-model="tableData" :columns="columns" :total="total" :clearSelect="clearTableSelect"
                @changePage="changePage" @changePageSize="changePageSize" @onRowClick="onRowClick"
                @onRowDblclick="onRowDblclick" :show="showTable" :page="page" :loading="loading">
    <div slot="search">
      <Form ref="search" :rules="ruleValidate"  :model="search" :label-width="85" inline>
          <FormItem label="创建时间:">
              <DatePicker v-model="search.ACCOUNT_TIME_gte" format="yyyy-MM-dd" type="date" placeholder="开始日期" style="width: 120px;"></DatePicker>
              <DatePicker v-model="search.ACCOUNT_TIME_lte" format="yyyy-MM-dd" type="date" placeholder="结束日期" style="width: 120px;margin-left: 5px;"></DatePicker>
              <Button type="primary" @click="page=1;getList()" style="margin-left: 5px;">搜索</Button>
          </FormItem>
       </Form>
    </div>
    <div slot="operate" style="margin-top:-10px;">
      <Button type="success" v-if="" @click="selectPick">新增</Button>
      <Button type="info" v-if="" @click="editButton">查看详情</Button>
    </div>
    <!--详情-->
    <technical-support-detail class="table-modal-detail" :showDetail="showDetail" :detailData="detailData" @closeDetail="closeDetail"></technical-support-detail>

  </common-table>
</template>
<script>
  import commonTable from '@/hxx-components/common-table.vue'
  import { getName, getDictGroup ,getCreate} from '@/libs/util.js'
//   import mixin from '@/hxx-components/mixin'
  import { formatDate } from '@/libs/tools.js'
  import technicalSupportDetail from './technical-support-detail.vue'
export default {
	name: "technical-support",
    components: {commonTable,technicalSupportDetail},
    // mixins: [mixin],
    data(){
		return{
            columns: [
                {title: '序号',  width: 70,align:'center', sortable: true,type:'index'
                    // render: (h, params) => h('span', (this.page-1)*this.limit+params.index+1 )
                },
                {title: '车型信息', key: 'mODEL_NAME', sortable: true, minWidth: 150,
                },
                {title: '申请人', key: 'aPPLY_PERSON', sortable: true, minWidth: 150,

                },
                {title: '故障呈现', key: 'fAULT_INFO', sortable: true, minWidth: 150},
                {title: '故障类型', key: 'fAULT_TYPE', sortable: true, minWidth: 120,

                },
                {title: '备注', key: 'rEMARK', sortable: true, minWidth: 120,tooltip:true

                },
                {title: '技术答复', key: 'fAULT_ANSWER', sortable: true, minWidth: 120,tooltip:true,
                },
                {title: '答复时间', key: 'aNSWER_TIME', sortable: true, minWidth: 120,

                },
                {title: '状态', key: 'sTATE', sortable: true, minWidth: 100,
                    render: (h, params) => {
                        var STATE='';
                        if (params.row.sTATE == "1") {
                            STATE= "申请中";
                        } else if (params.row.sTATE == "2") {
                            STATE= "处理中";
                        }else if (params.row.sTATE == "3") {
                            STATE= "已回复";
                        } else {
                            STATE= "";
                        }
                        return h('div',STATE)
                        }
                },
            ],
            tableData: [],
            search:{
                ACCOUNT_TIME_gte: '',
                ACCOUNT_TIME_lte:'',
            },
            ruleValidate:{},
            page: 1,
            limit: 25,
            total: 0,
            showTable:false,
            showDetail: false,
            detailData: null,
            clearTableSelect: null,
            loading:false,
      }
    },
    computed:{

    },
    mounted () {
      this.getList();
      this.showTable= Math.random();

    },
    methods:{
        //获取列表值-----
        getList(){
            this.search.ACCOUNT_TIME_gte=formatDate(this.search.ACCOUNT_TIME_gte);
            this.search.ACCOUNT_TIME_lte=formatDate(this.search.ACCOUNT_TIME_lte);
            this.loading=true;
            this.axios.request({
                url: '/tenant/support/tt_technical_support/list',
                method: 'post',
                data: {
                    ACCOUNT_TIME_gte: this.search.ACCOUNT_TIME_gte,
                    ACCOUNT_TIME_lte: this.search.ACCOUNT_TIME_lte,
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
        },
        clear(){
            for(var i in this.search){
                this.search[i]= ''
            }

            this.page=1;
            this.getList();
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
        //重置数据-----
        reset(){
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
.button-distance{
  margin-left: 10px;
}
</style>
