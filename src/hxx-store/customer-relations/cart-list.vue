<template>
  <common-table v-model="tableData"  :show="showTable">
    <div slot="search"  >
      <div class="search-block">
        <Input v-model="search.keyword"  placeholder="客户名称/车牌号码/联系电话..."></Input>
      </div>
      <div class="search-block">
                <Select v-model="search.color">
                <Option v-for="(item, index) in color"
                  :key="index" :value="item.code">{{item.name}}</Option>
              </Select>
     </div>
      <ButtonGroup size="small">
        <Button type="primary" @click="page=1;getList()"><Icon type="ios-search" size="24"/></Button>
        <Button type="primary" @click="clear()"><Icon type="ios-undo" size="24"/></Button>
      </ButtonGroup>
    </div>
    <div slot="operate">
      <Button type="primary" @click="showDetail=Math.random(),sign=1">新增</Button>
<!--       <Button type="info" @click="edit()">编辑/查看</Button>
      <Button type="error" @click="remove()">作废</Button>
      <Button type="success" @click="lead()">导入</Button>
      <Button type="primary" @click="expor()">导出</Button> -->
    </div>
  </common-table>
</template>
<script>
	  import commonTable from '@/hxx-components/common-table.vue'
        import { getName, getDictGroup, getCreate } from '@/libs/util.js'
	export default{
		name:'cart-list',
		components:{commonTable},
		data(){
			return {
        color:[],
        page:1,
        limit:25,
				tableData:[],
				showTable:false,
				search:{
          color:0,
          keyword:'',
				},
                       columns: [
          {title: '序号',  minWidth: 80,
            render: (h, params) => h('span', (this.page-1)*this.limit+params.index+1 )
          },
           {title: '车牌号', key: 'PLATE_NUM', sortable: true, minWidth: 150},
          {title: '车辆颜色', key: 'VEHICLE_COLOR', sortable: true, minWidth: 150,
           render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.VEHICLE_COLOR))
          },
          {title: '车型', key: 'VEHICLE_MODEL', sortable: true, minWidth: 150},
          {title: '车架号', key: 'VIN_NO', sortable: true, minWidth: 150
          },
          {title: '发动机型号', key: 'ENGINE_NO', sortable: true, minWidth: 150
          },
          {title: '最近来厂日期', key: 'COME_DATE', sortable: true, minWidth: 150},
          {title: '创建人', key: 'CREATER', sortable: true, minWidth: 150,
           render: (h, params) => h('span', getCreate(this.$store.state.app.tenant, params.row.CREATER))
          },
          {title: '创建时间', key: 'CREATE_TIME', sortable: true, minWidth: 150
          },
        ]
			}
		},
    methods:{
      getList(){
        // alert(this.page);
        this.axios.request({
          url: 'tenant/basedata/ttvehiclefile/list',
          method: 'post',
          data: {access_token: this.$store.state.user.token,
                 KEYWORD:this.search.keyword,
                 VEHICLE_COLOR_eq:this.search.color == 0 ? '' : this.search.color,
                 limit:this.limit,
                 page:this.page,
                }
        }).then(res => {
          if (res.success === true) {

          }
        })
      },
    },
    mounted(){
      this.showTable = Math.random();
      var group = getDictGroup(this.$store.state.app.dict,'1013');
      this.color.push({'code':0,'order':0,'group':'1013','name':'请选择'});
      for(var i in group){
      this.color.push(group[i]);
      }
      this.getList();
      //查询数据;tenant/basedata/ttvehiclefile/list
    }
	}
</script>
<style lang="less" scoped>
.search-block{
  display: inline-block;
  width: 200px;
  margin-right: 10px;
}
.ftext{
  text-align:left;
}
</style>