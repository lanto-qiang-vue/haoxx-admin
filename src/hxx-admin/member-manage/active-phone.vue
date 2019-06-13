<template>
  <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage"
                :total="total" :show="showTable" :clearSelect="clearType" :page="page" @onRowClick="onRowClick">
    <div slot="search">
      <div class="search-block">
        <Input placeholder="按手机号搜索" v-model="KEYWORD"></Input>
      </div>
      <div class="search-block">
        <Select v-model="activityId" placeholder="请选择活动">
          <Option v-for="(item,key) in activeList" :key="key" :value="item.id">{{item.name}}</Option>
        </Select>
      </div>
      <ButtonGroup size="small">
        <Button type="primary" @click="page=1;getList()">
          <Icon type="ios-search" size="24"/>
        </Button>
      </ButtonGroup>
    </div>
    <div slot="operate">
      <Button type="primary" @click="checkModal=true;stage=1">新增</Button>
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
      title="活动信息">
      <div>
        <Form :model="detail" :label-width="80" ref="detail" :rules="rules">
          <FormItem prop="activityId" label="活动">
            <Select v-model="detail.activityId" placeholder="请选择活动" :disabled="stage== 2">
              <Option v-for="(item,key) in activeList" :key="key" :value="item.id">{{item.name}}</Option>
            </Select>
          </FormItem>
          <FormItem prop="mobileNo" label="手机号">
            <Input v-model="detail.mobileNo" placeholder="请输入手机号">
            </Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="checkModal=false;">取消</Button>
        <Button type="primary" @click="submit">提交</Button>
      </div>
    </Modal>
  </common-table>
</template>
<script>
  import expandRow from './expand.vue'
  import commonTable from '@/hxx-components/common-table.vue'
  import {deepClone, find,reg} from "../../libs/util";

  export default {
    name: "active-phone",
    components: {commonTable},
    data() {
      return {
        list: '',
        oldPhone:'',
        stage:1,
        rules:{
          mobileNo:{required:true,pattern:reg.mobile,message:'请输入正确的手机号'},
          activityId:[{validator: (rule, value, callback) => {
              if(value == '请选择活动'){
                callback(new Error("请选择活动"));
              }
              callback();
            },required:true,message:'活动必选'}],
        },
        detail:{
          mobileNo:'',
          activityId:'请选择活动',
        },
        tableData: [],
        columns: [
          {
            title: '序号', width: 100,
            render: (h, params) => h('span', (this.page - 1) * this.limit + params.index + 1)
          },
          {title: '活动名称', key: 'activityId', width: 400,
            render: (h, params) => h('span',find(this.activeList,['id','name',params.row.activityId]))
          },
          {title:'手机号码',key:'mobileNo',minWidth:300},
        ],
        activeList:[{id:'请选择活动',name:'请选择活动'}],
        KEYWORD: '',
        checkModal:false,
        activityId:'请选择活动',
        total: 0,
        showTable: false,
        clearType: false,
        page: 1,
        limit: 25,
      }
    },
    mounted() {
      this.showTable = Math.random();
      this.getActive();
      this.getList();
    },
    watch:{
      checkModal(type){
        if(type) this.$refs.detail.resetFields();
      }
    },
    methods: {
      del(){
        console.log('md');
        let store = this.list;
        this.list = '';
        this.$Modal.confirm({
          title:'系统提示!',
          content:'确认删除吗？',
          onOk:()=>{
            let data = {
              activityId:store.activityId,
              mobileNo:store.mobileNo,
            };
            // console.log(data);
            this.$fly.delete('/hxxdc/activity/user',{data}).then(res=>{
              if(res.code == 0){
                this.$Message.success('删除成功!');
               this.getList();
              }
            })
          }
        });
      },
      submit(){
        this.$refs.detail.validate(validator=>{
          if(validator){
            this.$Modal.confirm({
              title:'系统提示!',
              content:'确认保存吗?',
              onOk:()=>{
                if(this.stage == 1){
                  this.$fly.post('/hxxdc/activity/user/insert', {
                    activityId:this.detail.activityId,
                    mobileNo:this.detail.mobileNo,
                  }).then(res=>{
                    if(res.code == 0){
                      this.$Message.success("保存成功!");
                      this.checkModal = false;
                      this.getList();
                    }
                  })
                }else{
                  this.$fly.post('/hxxdc/activity/user/update', {
                    activityId:this.detail.activityId,
                    newMobileNo:this.detail.mobileNo,
                    mobileNo:this.oldPhone,
                  }).then(res=>{
                    if(res.code == 0){
                      this.checkModal = false;
                      this.$Message.success("修改成功!");
                      this.getList();
                    }
                  })
                }
              }
            });
          }else{
            this.$Message.error('请校对必填字段!');
          }
        });
      },
      getActive(){
        this.$fly.post('/hxxdc/activity/list', {
          name:"",
          pageNo:1,
          pageSize:100,
        }).then(res=>{
          let data = res.items;
          for(let i in data){
            this.activeList.push({id:data[i].id,name:data[i].name});
          }
        })
      },
      update(){
        this.stage = 2;
        this.oldPhone = this.list.mobileNo;
        this.checkModal = true;
        this.detail.activityId = this.list.activityId;
        this.list = '';
      },
      onRowClick(list) {
        this.list = list;
      },
      getList() {
        this.list = '';
        this.clearType = Math.random();
        this.$fly.post('/hxxdc/activity/user/list', {
          mobileNo:this.KEYWORD ? this.KEYWORD : null,
          activityId:this.activityId == '请选择活动' ? null : this.activityId,
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
