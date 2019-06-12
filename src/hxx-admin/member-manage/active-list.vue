<template>
  <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage"
                :total="total" :show="showTable" :clearSelect="clearType" :page="page" @onRowClick="onRowClick">
    <div slot="search">
      <div class="search-block">
        <Input placeholder="按名称搜索" v-model="KEYWORD"></Input>
      </div>
      <ButtonGroup size="small">
        <Button type="primary" @click="page=1;getList()">
          <Icon type="ios-search" size="24"/>
        </Button>
      </ButtonGroup>
    </div>
    <div slot="operate">
      <Button type="primary" @click="checkModal=true;detail.id = '';resource=[{url:''}]">新增</Button>
      <Button type="info" :disabled="list == ''" @click="update">修改</Button>
      <Button type="error" :disabled="list == ''" @click="del">删除</Button>
    </div>
    <Modal
      v-model="checkModal"
      width="350px"
      heigh="100"
      :mask-closable="false"
      :scrollable="true"
      :transfer="false"
      :footer-hide="false"
      :transition-names="['', '']"
      title="活动信息"
    >
      <div>
        <Form :model="detail" ref="detail" :rules="rules">
          <FormItem prop="name">
            <Input v-model="detail.name" placeholder="请输入活动名称">
            </Input>
          </FormItem>
          <FormItem label="活动状态">
            <RadioGroup v-model="detail.open">
              <Radio label="开启">
                <span>开启</span>
              </Radio>
              <Radio label="关闭">
                <span>关闭</span>
              </Radio>
            </RadioGroup>
          </FormItem>
          <FormItem v-for="(item,index) in resource">
            <Input v-model="item.url" :placeholder="'请输入活动地址'+(index+1)" style="width:250px;">
            </Input>
            <a @click="unset(index)" v-show="resource.length > 1">&nbsp;&nbsp;&nbsp;&nbsp;删除</a>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="addInput">添加活动地址</Button>
        <Button @click="checkModal=false">取消</Button>
        <Button type="primary" @click="submit">保存</Button>
      </div>
    </Modal>
  </common-table>
</template>
<script>
  import expandRow from './expand.vue'
  import commonTable from '@/hxx-components/common-table.vue'
  import {deepClone} from "../../libs/util";

  export default {
    name: "member-list",
    components: {commonTable},
    data() {
      return {
        resource:[
          {url:''},
        ],
        list: '',
        tableData: [],
        columns: [
          {
            title: '序号', width: 100,
            render: (h, params) => h('span', (this.page - 1) * this.limit + params.index + 1)
          },
          {title: '活动名称', key: 'name', width: 200},
          {title:'活动地址',key:'uri',minWidth:300},
          {title: '活动状态', key: 'type', width: 150,
            render: (h, params) => h('span',params.row.open ? '已开启' : '已关闭')
          },
        ],
        rules: {
          name: {required: true, message: '活动名称必填'},
        },
        detail:{
          id:'',
          name:'',
          open:'开启',
        },
        checkModal:false,
        KEYWORD: '',
        total: 0,
        showTable: false,
        clearType: false,
        page: 1,
        limit: 25,
      }
    },
    mounted() {
      this.showTable = Math.random();
      this.getList();
    },
    watch:{
      checkModal(type){
        if(type) this.$refs.detail.resetFields();
      }
    },
    methods: {
      unset(index){
         this.resource.splice(index,1);
      },
      addInput(){
        this.resource.push({url:''});
      },
      del(){
        let id = this.list.id;
        this.list = '';
        this.$Modal.confirm({
          title:'系统提示',
          content:'确认删除吗',
          onOk:()=>{
            this.$fly.post('/hxxdc/activity/delete/'+id).then(res=>{
              if(res.code == 0){
                this.getList();
                this.$Message.success("删除成功!");
              }
            });
          }
        });
      },
      update(){
        this.clearType = Math.random();
        let data = deepClone(this.list);
        this.list = '';
        data.open = data.open == true ? '开启' : '关闭';
        let a = data.uri.split(",");
        let store = [];
        for(let i in a){
          store.push({url:a[i],});
        }
        this.resource = store;
        this.detail = data;
        this.checkModal = true;
      },
      submit(){
        this.$refs.detail.validate(validator=>{
          if(validator){
            let store = [];
            for(let i in this.resource){
              if(this.resource[i].url){
                store.push(this.resource[i].url)
              }else{
                this.$Message.error('请填写活动地址'+(parseInt(i)+1));
                return false;
              }
            }
            this.$Modal.confirm({
              title:'系统提示!',
              content:'确认保存吗?',
              onOk:()=>{
                let url;
                let data = deepClone(this.detail);
                data.uris = store;
                if(data.id > 0){
                  url = '/hxxdc/activity/update';
                }else{
                  url = '/hxxdc/activity/add';
                }
                data.open = data.open == '开启' ? true : false;
                this.$fly.post(url,data).then(res=>{
                  if(res.code == 0){
                    this.getList();
                    this.checkModal = false;
                  }
                })
              }
            })
          }else{
            this.$Message.error('请校对必填字段!');
          }
        });
      },
      onRowClick(list) {
        console.log(list);
        this.list = list;
      },
      getList() {
        this.list = '';
        this.clearType = Math.random();
        this.$fly.post('/hxxdc/activity/list', {
          name: this.KEYWORD,
          pageNo: this.page,
          pageSize: this.limit,
        }).then(res=>{
          this.total = res.total;
          this.tableData = res.items;
        })
      },
      changePageSize(size) {
        this.limit = size;
        if (this.page == 1) this.getList();
      },
      changePage(page) {
        console.log("changePage");
        this.page = page;
        this.getList();
      }
    },
  }
</script>
<style>
  .common-table .ivu-table-cell-with-expand {
    height: 38px;
    line-height: 38px;
  }
</style>
<style scoped>

</style>
