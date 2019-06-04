<template>
  <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage"
                :total="total" :show="showTable" :clearSelect="clearType" :page="page" @onRowClick="onRowClick">
    <div slot="search">
      <div class="search-block">
        <Input placeholder="按编号搜索" v-model="code"></Input>
      </div>
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
      <Button type="primary" @click="checkModal=true;detail.id = ''">新增</Button>
      <Button type="info" :disabled="list == ''" @click="update">修改</Button>
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
      title="产品信息"
    >
      <div>
        <Form :model="detail" ref="detail" :rules="rules">
          <FormItem prop="code">
          <Input v-model="detail.code" placeholder="请输入产品编号(非0启始数字)">
          </Input>
        </FormItem>
          <FormItem prop="name">
          <Input v-model="detail.name" placeholder="请输入产品名称">
          </Input>
        </FormItem>
          <FormItem prop="detailVersion" label="是否详细版本:">
            <RadioGroup v-model="detail.detailVersion">
              <Radio label="是">
                <span>是</span>
              </Radio>
              <Radio label="否">
                <span>否</span>
              </Radio>
            </RadioGroup>
          </FormItem>
          <FormItem prop="price" label="单价:">
            <InputNumber :min="0"  v-model="detail.price" @on-blur="change" placeholder="请输入产品单价" style="width:270px;">
            </InputNumber>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
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
        list:'',
        detail:{
          code:'',
          name:'',
          id:'',
          detailVersion:'是',
          price:0,
        },
        checkModal:false,
        tableData: [],
        columns: [
          {
            title: '序号', width: 70,
            render: (h, params) => h('span', (this.page - 1) * this.limit + params.index + 1)
          },
          {title: '编号', key: 'code', minWidth: 120},
          {title: '名称', key: 'name', minWidth: 120},
          {title: '是否详细版本', key: 'detailVersion', minWidth: 140,
            render: (h, params) => h('span',params.row.detailVersion ? "是" : '否')
          },
          {title: '单价', key: 'price', minWidth: 140},
        ],
        rules:{
          code:[{required:true,message:'产品编号必填'}, { validator: (rule, value, callback) => {
                  if(/^[1-9]{1}[\d+]{0,5}$/.test(value)){
                   callback();
                  }else{
                   callback(new Error("请输入非0启始的数字,1-6位数字"));
                  }
            }, trigger: 'change,blur', required: true }],
          name:{required:true,message:'产品名称必填'},
        },
        KEYWORD: '',
        code: '',
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
      checkModal(val){
        if(val) this.$refs.detail.resetFields();
      }
    },
    methods: {
      update(){
        let data = deepClone(this.list);
        this.list = '';
        data.detailVersion = data.detailVersion ? "是" : "否";
        data.price = parseFloat(data.price);
        this.detail = data;
        this.checkModal = true;
      },
      onRowClick(list){
        console.log(list);
      this.list = list;
      },
      submit(){
       this.$refs.detail.validate(validator=>{
          if(validator){
            this.$Modal.confirm({
              title:'系统提示!',
              content:'确认保存吗?',
              onOk:()=>{
                let data = deepClone(this.detail);
                data.detailVersion = data.detailVersion == "是" ? true : false;
                data.price = data.price.toFixed(2);
                let url;
                if(data.id){
                  url = "/hxxdc/product/edit"
                }else{
                  url = "/hxxdc/product/add";
                }
                this.$fly.post(url,data).then(res=>{
                  if(res.code == 0){
                    this.$Message.success("保存成功");
                    this.getList();
                    this.checkModal = false;
                  }
                });
              }
            });

          }else{
            this.$Message.error("请校对必填字段!");
          }
       })
      },
      change(){
        if(!this.detail.price){
          setTimeout(()=>{
            this.detail.price = 0;
          },300);
        }
      },
      getList() {
        this.$fly.post('/hxxdc/product/find', {
          code: this.code,
          name: this.KEYWORD,
          pageNo: this.page,
          pageSize: this.limit,
        }).then(res => {
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
