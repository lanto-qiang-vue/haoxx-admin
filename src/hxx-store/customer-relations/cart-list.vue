<template>
  <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage" :total="total" :page="page"  :show="showTable" :clearSelect="cleartype" @onRowClick="rowclick" @changeSelect="changeSelect" @onRowDblclick="dbclick">
    <div slot="search">
      <div class="search-block">
        <Input v-model="search.keyword"  placeholder="客户名称/车牌号码/联系电话..."></Input>
      </div>
      <div class="search-block">
                <Select v-model="search.color" clearable>
                <Option v-for="(item, index) in color"
                  :key="index" :value="item.code">{{item.name}}</Option>
              </Select>
     </div>
      <ButtonGroup>
        <Button type="primary" @click="page=1;getList()">搜索</Button>
        <!--<Button type="primary" @click="clear()"><Icon type="ios-undo" size="24"/></Button>-->
      </ButtonGroup>
    </div>
    <div slot="operate">
      <Button type="success" @click="add()" v-if="accessBtn('add')">新增</Button>
      <Button type="info" :disabled="cando" @click="edit()" v-if="accessBtn('edit')">编辑/查看</Button>
      <!--<Button type="error" :disabled="cando" @click="remove()">作废</Button>-->
    </div>
  <cart-modal @clearsection="clearsection" :info="info" :hidetype="hidetype" @refresh="refresh" :show="show"></cart-modal>
  </common-table>
</template>
<script>
	  import commonTable from '@/hxx-components/common-table.vue'
    import cartModal from '@/hxx-store/customer-relations/cart-modal.vue'
    import { getName, getDictGroup, getCreate } from '@/libs/util.js'
    import mixin from '@/hxx-components/mixin'
	export default{
		name:'cart-list',
		components:{commonTable,cartModal},
    mixins: [mixin],
    activated(){
      // let obj = this.$route.query.data;
      if(this.$route.query.data) {
        this.info = this.$route.query.data;
        this.hidetype = this.$route.query.hidetype;
        this.show = Math.random();
      }
    },
		data(){
			return {
			  cardModal:false,
        cleartype:false,
        color:[],
        hidetype:1,
        page:1,
        limit:25,
        total:0,
        show:false,
        sign:1,
				tableData:[],
        obj:'',//存储完整对象
				showTable:false,
        info:{},
				search:{
          color:'',
          keyword:'',
				},
          columns: [
          {title: '序号',  width: 70,align:'center',
            render: (h, params) => h('span', (this.page-1)*this.limit+params.index+1 )
          },
           {title: '车牌号', key: 'PLATE_NUM', sortable: true, minWidth: 120},
          {title: '车辆颜色', key: 'VEHICLE_COLOR', sortable: true, minWidth: 120,
           render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.VEHICLE_COLOR))
          },
          {title: '车型', key: 'VEHICLE_MODEL', sortable: true, minWidth: 170},
          {title: '车架号', key: 'VIN_NO', sortable: true, minWidth: 150
          },
          {title: '发动机型号', key: 'ENGINE_NO', sortable: true, minWidth: 130
          },
          {title: '最近来厂日期', key: 'COME_DATE', sortable: true, minWidth: 150},
          {title: '创建人', key: 'CREATER', sortable: true, minWidth: 100,
           render: (h, params) => h('span', getCreate(this.$store.state.app.tenant, params.row.CREATER))
          },
          {title: '创建时间', key: 'CREATE_TIME', sortable: true, minWidth: 120
          },
        ]
			}
		},
    methods:{
      // transmit(){
      //   this.cardModal = true;
      //   alert(1);
      // },
      rowclick(row){
      this.obj = row;
      },
      add(){
        this.show = Math.random();
        var data = {
        MUST_SAFE_CORP:0,
        BUSINESS_SAFE_CORP:0,
        VEHICLE_COLOR:0,
        COME_MILEAGE:0,
        REPAIR_MILEAGE:0,
        LAST_REPAIR_MILEAGE:0,
        NEXT_REPAIR_MILEAGE:0,
        VEHICLE_ID:0,
        REGULAR_REPAIR:0,
        PLATE_NUM:'',
        VIN_NO:'',
        VEHICLE_MODEL:'',
        BUY_DATE:'',
        ENGINE_NO:'',
        LEAVE_FACTORY_DATE:'',
        COME_DATE:'',
        LAST_REPAIR_DATE:'',
        NEXT_REPAIR_DATE:'',
        YEAR_CHECK_DATE:'',
        MUST_SAFE_VALIDITY:'',
        BUSINESS_SAFE_VALIDITY:'',
        REMARK:'',
        TID:'',
        CUSTOMER_ID:'',
        CUSTOMER_CODE:'',
        CUSTOMER_NAME:'',
        VEHICLE_ID:'',
        }
        this.info = data;
      },
      clearsection(){
        this.obj = '';
        this.cleartype = Math.random();
      },
      getList(){
        // alert(this.page);
        this.axios.request({
          url: 'tenant/basedata/ttvehiclefile/list',
          method: 'post',
          data: {access_token: this.$store.state.user.token,
                 KEYWORD:this.search.keyword,
                 VEHICLE_COLOR_eq:this.search.color || '',
                 limit:this.limit,
                 page:this.page,
                }
        }).then(res => {
          if (res.success === true) {
            this.tableData= res.data
            this.total= res.total
            this.clearsection();
          }
        })
      },changePageSize(size){this.limit = size;this.getList();},
      changePage(page){this.page = page;this.getList();},
      clear(){this.search.color = 0;this.search.keyword = '';},
      refresh(){this.getList();},
      changeSelect(selection){
        // this.selection = selection;
        // var that = this;
        // that.list = [];
        // that.obj = [];
        // selection.filter(function(item){
        //   that.list.push(item.VEHICLE_ID);
        //   that.obj.push(item);
        // });
      },
      remove(){
        // if(this.list.length < 1){
        //   this.$Message.info('未选取数据');
        // }else{
          this.$Modal.confirm({
            'title':'系统提示',
            'content':'确认要删除吗?',
            'onOk':this.del
          });
        // }
      },
      del(){
     // tenant/basedata/ttvehiclefile/delete
             this.axios.request({
          url: '/tenant/basedata/ttvehiclefile/delete',
          method: 'post',
          data: {
                 access_token: this.$store.state.user.token,
                 ids:this.obj.VEHICLE_ID
                }
        }).then(res => {
          if (res.success === true) {
            this.getList();
            this.$Message.info('删除成功');
          }
        })
    },
    edit(){
      // if(this.list.length < 1){
      //   this.$Message.info('未选取数据');
      //   return;
      // }
      // if(this.list.length > 1){
      //   this.$Message.info('只能选取一条数据');
      //   return;
      // }
      // this.info = this.obj[0];
      this.info = this.obj;
      this.show = Math.random();
    },
    dbclick(row){
      this.info = row;
      this.show = Math.random();
    },
    },
    mounted(){
      this.showTable = Math.random();
      var group = getDictGroup(this.$store.state.app.dict,'1013');
      // this.color.push({'code':0,'order':0,'group':'1013','name':'选择颜色...'});
      for(var i in group){
      this.color.push(group[i]);
      }
      this.getList();
      //查询数据;tenant/basedata/ttvehiclefile/list
    },
    computed:{
      cando(){
       var flag = this.obj == '' ? true : false;
       return flag;
      }
    }
	}
</script>
<!--<style lang="less" scoped>-->
<!--.search-block{-->
  <!--display: inline-block;-->
  <!--width: 200px;-->
  <!--margin-right: 10px;-->
<!--}-->
<!--.ftext{-->
  <!--text-align:left;-->
<!--}-->
<!--</style>-->
