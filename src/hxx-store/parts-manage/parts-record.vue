<template>
    <Split v-model="split" :min="0.1" :max="0.5" class="split">
    <div slot="left" class="split-pane">
    <Tree :data="data2" @on-select-change="getnode"></Tree>
    <Spin size="large" fix v-if="spinShow" ></Spin>
    </div>
    <div slot="right" class="split-pane">
    <common-table :columns="columns" :total="total" :page="page" v-model="tableData" :show="show" @changePageSize="changePageSize" @changePage="changePage" :clearSelect="cleartype" @onRowClick="onRowClick">
          <div slot="search">
            <Form class="common-form">
              <FormItem>
                <Input  placeholder="配件名称/原厂编号..." v-model="KEYWORD"></Input>
              </FormItem>
              <FormItem label="配件类别" :label-width="80">
                <Input :disabled="true" v-model="TYPE"></Input>
              </FormItem>
              <ButtonGroup size="small">
                <Button type="primary" @click="page=1;getList()"><Icon type="ios-search" size="24"/></Button>
                <Button type="primary" @click="clear()"><Icon type="ios-undo" size="24"/></Button>
              </ButtonGroup>
            </Form>
          </div>
              <div slot="operate">
      <Button type="primary" @click="add()" v-if="accessBtn('add')">新增</Button>
      <Button type="info" :disabled="cando"   @click="edit()" v-if="accessBtn('edit')">修改</Button>
      <Button type="error" :disabled="cando" @click="remove()" v-if="accessBtn('cancel')">废除</Button>
    </div>
      <select-add-parts @refresh="refresh" @clearsection="clearsection" :editdata="list" :showSelectAddParts="addshow"></select-add-parts>
    </common-table>
    </div>
  </Split>
</template>
<script>
import { getName, getDictGroup, getCreate } from '@/libs/util.js'
import commonTable from '@/hxx-components/common-table.vue'
import selectAddParts from '@/hxx-components/select-addParts.vue'
import mixin from '@/hxx-components/mixin'
	export default{
		name:'parts-record',
		components:{commonTable,selectAddParts},
    mixins: [mixin],
		data(){
			return{
			  split:0.2,
		      list:'',
		      data2:[],
          cleartype:false,
			  columns:[
              {title: '配件编号', key: 'PART_NO', sortable: true, minWidth: 120},
              {title: '配件名称', key: 'NAME', sortable: true, minWidth: 140},
              {title: '原厂编号', key: 'FACTORY_NO', sortable: true, minWidth: 120},
              {title: '配件分类', key: 'TYPE_NAME', sortable: true, minWidth: 140},
              {title: '品牌', key: 'BRAND', sortable: true, minWidth: 140,
              render: (h, params) => h('span', getName(this.brandtype, params.row.BRAND))
              },
              {title: '规格', key: 'FORMAT', sortable: true, minWidth: 150},
              {title: '包装单位', key: 'UNIT', sortable: true, minWidth: 140,
              render: (h, params) => h('span', getName(this.unittype, params.row.UNIT))
              },
              {title: '含税销售价', key: 'SAFE_STOCK_NUM', sortable: true, minWidth: 140},
              {title: '销售税率', key: 'RATE', sortable: true, minWidth: 140},
              {title: '销售税额', key: 'TAX', sortable: true, minWidth: 140},
              {title: '未含税销售价', key: 'NOT_CONTAINS_TAX_SALE_PRICE', sortable: true, minWidth: 140},
              {title: '来源', key: 'PART_SOURCE', sortable: true, minWidth: 140,
              render: (h, params) => h('span', getName(this.sourcetype, params.row.PART_SOURCE))
              },
              ],
				page:1,
				limit:25,
				addshow:false,
				total:0,
				tableData:[],
				show:false,
				KEYWORD:'',
				TYPE:'请选择...',
				TYPE_ID:'',
				spinShow:false,
			}
		},
		computed:{
		cando(){
		var flag = this.list == '' ? true : false;
		return flag;
		},
		brandtype(){
		return getDictGroup(this.$store.state.app.dict,'1016');
		},
		unittype(){
		return getDictGroup(this.$store.state.app.dict,'1015');
		},
		sourcetype(){
		return getDictGroup(this.$store.state.app.dict,'1017');
		},
		},
		methods:{
    refresh(){
      this.getList();
    },
    clearsection(){
      this.list = "";
      this.cleartype = Math.random();
    },
    onRowClick(row){
      this.list = row;
    },
			getnode(row){
				console.log(row);
			if(row.length > 0){
			var title = row[0].nodeName == '配件分类' ? '请选择...' : row[0].nodeName;
			var type = title == '请选择...' ? '' : row[0].nodeId;
			this.TYPE = title;
			this.TYPE_ID = type;
			this.getList();
			}
			},
			clear(){
			this.KEYWORD = '';
			this.TYPE = '请选择';
			this.TYPE_ID = '';
			},
			add(){
      this.list = '';
			this.addshow = Math.random();
			},
			edit(){
      this.addshow = Math.random();   
      },
			remove(){
        this.$Modal.confirm({'title':'系统提示','content':'确认要作废吗','onOk':this.del});
      },
      del(){
          this.axios.request({
          url: '/tenant/basedata/partinfo/cancel',
          method: 'post',
          data: {access_token: this.$store.state.user.token,
                 ids:this.list.PART_ID,
          }
        }).then(res => {
          if (res.success === true) {
            this.$Message.success('作废成功');
            this.getList();
          }
        })
      },
			changePage(page){this.page = page;this.getList();},
			changePageSize(size){this.limit = size;this.getList();},
			getList(){
				//获取配件列表.../tenant/basedata/partinfo/infolist
		this.axios.request({
          url: '/tenant/basedata/partinfo/infolist',
          method: 'post',
          data: {access_token: this.$store.state.user.token,
          	KEYWORD:this.KEYWORD,
          	TYPE_ID:this.TYPE_ID,
          	limit:this.limit,
          	start:0,
          	page:this.page
          }
        }).then(res => {
          if (res.success === true) {
          	this.tableData = res.data;
          	this.total = res.total;
            this.clearsection();
          }
        })

			},
			machine(data){
           data['title'] = data.nodeName;
           var flag = data.children ? true : false;
           if(flag){
           for(var i = 0;i<data.children.length;i++){
            this.machine(data.children[i]);
           }
           }else{

           }
           return data; 
          },
          getTree(){
          this.spinShow = true;
          this.axios.request({
          url: '/tenant/basedata/partinfo/part_type_tree',
          method: 'post',
          data: {access_token: this.$store.state.user.token}
        }).then(res => {
          if (res.success === true) {
          	var init = this.machine(res.data)
 			init['expand'] = true;
           this.data2.push(init);
           this.spinShow = false;
          }
        })
          },
		},
		mounted(){
			this.getTree();
			this.getList();
			this.show = Math.random();
		},
	}

</script>
<style scoped lang="less">
.split{
  border: 1px solid #dcdee2;
  background-color: white;
  .split-pane{
    padding: 10px;
    height: 100%;
    overflow: auto;
    position: relative;
    .tree-search{
      padding: 15px;
      border-radius: 3px;
    }
    .tree-input{
      z-index: 1;
    }
    .vehicle-tree{
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      padding: 50px 0 10px 10px;
      overflow: hidden;
    }
  }
}
</style>
