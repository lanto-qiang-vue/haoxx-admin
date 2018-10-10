<!--预约单管理 2018 09 05-->
<template>
  <common-table v-model="tableData" :columns="columns" :total="total" :clearSelect="clearTableSelect"
                @changePage="changePage" @changePageSize="changePageSize" @onRowClick="onRowClick"
                @onRowDblclick="onRowDblclick" :show="showTable" :page="page">
    <div  slot="search"  >
      <div class="search-block">
        <Input v-model="search.input" placeholder="用户账号/用户名称/手机号码..."></Input>
      </div>
      <div class="search-block">
        <Select v-model="search.select" placeholder="选择状态...">
          <Option v-for="(item, index) in statusList"
                  :key="index" :value="item.code">{{item.name}}</Option>
        </Select>
      </div>
      
      <ButtonGroup size="small">
        <Button type="primary" @click="page=1;getList()"><Icon type="ios-search" size="24"/></Button>
        <Button type="primary" @click="clear()"><Icon type="ios-undo" size="24"/></Button>
      </ButtonGroup>
    </div>
    <div slot="operate">
      <Button type="primary" v-if="" @click="detailData=null,showDetail=Math.random()">新增</Button>
      <Button type="info" v-if="" @click="showDetail=Math.random()" :disabled="!detailData">修改</Button>
      <Button type="error" v-if=""  @click="deleteDetailData" :disabled="isOrderSuccess">删除</Button>
      <Button type="info" v-if="" @click="showDetail=Math.random()" :disabled="!detailData">重置密码</Button>
      
    </div>
    <!--预约详情单-->
    <!--<reservation-list-detail class="table-modal-detail" :showDetail="showDetail"
                             :detailData="detailData" @closeDetail="closeDetail" @closeGetList="closeGetList"
      ></reservation-list-detail>-->
      
  </common-table>
</template>
<script>
  import commonTable from '@/hxx-components/common-table.vue'
//   import reservationListDetail from './reservation-list-detail.vue'
  import { getName, getDictGroup } from '@/libs/util.js'
  import { formatDate } from '@/libs/tools.js'
  import mixin from '@/hxx-components/mixin'
	export default {
		name: "user-management",
    components: {commonTable, },
    mixins: [mixin],
    data(){
	return{
        columns: [
          {title: '序号',  minWidth: 80,
            render: (h, params) => h('span', (this.page-1)*this.limit+params.index+1 )
          },
          {title: '用户账号', key: 'USER_CODE', sortable: true, minWidth: 120,
            
          },
          {title: '用户名称', key: 'USER_NAME', sortable: true, minWidth: 120},
          {title: '性别', key: 'SEX', sortable: true, minWidth: 135,
                render: (h, params) => h('span', getName(this.sexList, params.row.SEX))
            },
          {title: '手机号码', key: 'TEL_PHONE', sortable: true, minWidth: 120},
          {title: '状态', key: 'STATUS', sortable: true, minWidth: 200,
            render: (h, params) => h('span', getName(this.statusList, params.row.STATUS))
            
            },
          {title: '添加时间', key: 'CREATE_TIME', sortable: true, minWidth: 130,
            
          },
        ],
        tableData: [],
        
        search:{
          input: '',
          select: '',
        },
        page: 1,
        limit: 25,
        total: 0,
        showTable:false,
        showDetail: false,
        detailData: null,
        clearTableSelect: null,
        isOrderSuccess:true,//判断是不是预约成功
        
      }
    },
    mounted () {
        this.getList()
        this.showTable= Math.random()
    },
    computed:{
        cando(){
            var flag = this.list == '' ? true : false;
            return flag;
        },
        statusList(){
            return getDictGroup(this.$store.state.app.dict,'1001');
        },
        sexList(){
            return getDictGroup(this.$store.state.app.dict,'1003');
        },
        classList(){
            return getDictGroup(this.$store.state.app.dict,'1012');
        },
        defaultList(){
            return getDictGroup(this.$store.state.app.dict,'1004');
        }
    },
    methods:{
      //获取当前页面数据------
	getList(){
        
        this.axios.request({
          url: '/manage/sys/users/list',
          method: 'post',
          data: {
            KEYWORD: this.search.input,
            STATUS_eq: this.search.select||'',
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

        this.detailData= null
        this.isOrderSuccess=true;
      },
      //页面重置按钮-----
      clear(){
		    for(let i in this.search){
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
          console.log('row：',row);
          if(row.STATUS=="10421003"){
              this.isOrderSuccess=true;
          }else{
              this.isOrderSuccess=false;
          }
        this.detailData=row
      },
      onRowDblclick( row, index){
        this.detailData=row
        console.log('row：',row);
        this.showDetail=Math.random()
      },
      closeDetail(){
        this.detailData= null
        this.isOrderSuccess=true;
        this.clearTableSelect= Math.random()
      },
      //只有保存数据和提交数据的时候更新界面列表，
      closeGetList(){
        this.getList();
      },
      //作废按钮---------
      deleteDetailData(){
          if(this.detailData == null){
            this.$Message.info("未选择到数据!");
          }else{
              this.$Modal.confirm({
                  title:"系统提示!",
                  content:"确定要作废吗？",
                  onOk:this.del,
                  
              })
          }
      },
      del(){
          this.axios.request({
            url: '/tenant/repair/ttrepairorder/delete',
            method: 'post',
            data: {
              ids: this.detailData.ORDER_ID,
              access_token: this.$store.state.user.token
            }
          }).then(res => {
            if (res.success === true) {
              this.$Message.info("数据作废成功!");
              this.detailData=null;
              this.getList();
            }
          })
      },
      

    },
    
	}
</script>

<style lang="less" scoped>
.search-block{
  display: inline-block;
  width: 200px;
  margin-right: 10px;
}
</style>
