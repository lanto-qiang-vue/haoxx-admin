<template>
  <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage"
                :total="total" :show="showTable" :clearSelect="clearType" :page="page" :loading="loading">
    <div slot="search">
      <div class="search-block">
        <Select v-model="search.status" placeholder="请选择状态...">
          <Option v-for="(item, index) in statusList"
                  :key="index" :value="item.id">{{item.name}}
          </Option>
        </Select>
      </div>
      <ButtonGroup size="small">
        <Button type="primary" @click="page=1;getList()">
          <Icon type="ios-search" size="24"/>
        </Button>
      </ButtonGroup>
    </div>
    <Modal v-model="showModal" title="培训结果" :width="400">
      <Form ref="formData" :rules="rule" :model="formData" :mask-closable="false" :closable="false" :label-width="60" style="width:350px;">
        <FormItem label="">
          <Select v-model="formData.claminResult">
            <Option v-for="(item, index) in resultList"
                    :key="index" :value="item.id">{{item.name}}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="备注:">
          <Input v-model="formData.result" type="textarea"/>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="showModal=false">取消</Button>
        <Button type="primary" @click="save('formData')">保存</Button>
      </div>
    </Modal>
  </common-table>
</template>
<script>
  import commonTable from '@/hxx-components/common-table.vue'
  export default {
    name: "marketing-info",
    components: {commonTable},
    data(){
      return{
        tableData:[],
        formData:{
          id:'',
          claminResult:'',
          tenantId:'',
          claminId:'',
          result:'',
          trainNum:'',
        },
        loading:false,
        rule:{},
        showModal:false,
        search:{
          status:0,
        },
        statusList:[
          {id:0,name:'请选择结果'},
        ],
        resultList:[

        ],
        columns:[
          {title: '序号',  width: 70,align:'center',
            render: (h, params) => h('span', (this.page-1)*this.size+params.index+1 )
          },
          {title: '操作', key: 'operate', sortable: true, minWidth: 280,align:'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    width:"80px",
                    textAlign: "center",
                  },
                  on: {
                    click: (index) => {
                      this.showModal = true;
                      this.formData.claminId = params.row.claimId;
                      this.formData.id = params.row.id;
                      this.formData.tenantId = params.row.tenantId;
                      this.formData.trainNum = params.row.trainNum || 0;
                      this.formData.result = params.row.RESULT;
                      this.formData.claminResult = this.resultList[0].id;
                    }
                  }
                }, '培训结果'),
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    width:"80px",
                    textAlign: "center",
                    marginLeft:"20px",
                  },
                  on: {
                    click: (index) => {
                      this.callPhone(params.row.id,params.row.telPhone,params.row.tenantId);
                    }
                  }
                }, '拨打电话')
              ]);
            }
          },
          {title: '培训结果', key: 'claimResult', minWidth: 140,
            render: (h, params) => h('span',this.toString(params.row.claimResult))
          },
          {title:'是否精准报价',key:'offerResult',minWidth:140,align:'center',
            render: (h, params) => h('span',params.row.offerResult >= 2 ? "是" : "否")
          },
          {title:'操作人角色',key:'userName',minWidth:140},
          {title:'车牌号',key:'licenseNo',minWidth:140},
          {title:'商业险到期时间',key:'insuranceDays',minWidth:140},
          // {title:'交强险到期时间',key:'insuranceDays',minWidth:140},
          {title:'扫车牌时间',key:'createDate',minWidth:140,
            render: (h, params) => h('span',params.row.createDate.substr(0,16))
          },
          {title:'培训成功次数',key:'trainNum',minWidth:140,align:'right'},
          {title:'拨打次数',key:'callNum',minWidth:140,align:'right'},
          {title:'扫车牌数',key:'licenseNum',minWidth:140,align:'right'},
          {title:'备注',key:'RESULT',minWidth:140,align:'right'}
        ],
        total:0,
        showTable:false,
        clearType:false,
        page:1,
        size:25,
      }
    },
    mounted(){
      this.getList();
      this.showTable = Math.random();
      this.getSelect();
    },
    methods:{
      toString(id){
        let result = "";
        let data = this.resultList;
        for(let i in data){
          if(data[i].id == id){
            result += data[i].name;
            break;
          }
        }
        return result;
      },
      callPhone(detailId,telphone,tenantId){
        this.$Modal.confirm({
          title:'系统提示',
          content:'确认呼叫电话?',
          onOk:()=>{
            this.axios.request({
              baseURL: '/poxy-next',
              url: '/manage/internet/callPhone',
              method: 'post',
              data: {
                access_token: this.$store.state.user.token,
                telphone:telphone,
                detailId:detailId,
                tenantId:tenantId,
              },
            }).then(res => {
              if (res.success === true) {
                this.$Message.success({content:'电话已呼叫,请注意接听',duration:3});
              }
            })
          }
        });
      },
      getSelect(){
        this.axios.request({
          baseURL: '/poxy-next',
          url: '/manage/train/query',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
          },
        }).then(res => {
          if (res.success === true) {
             let data = res.data;
             for(let i in data){
               this.resultList.push(data[i]);
               if(data[i].name == "未联系" || data[i].name == "电话不通" || data[i].name == "下次联系") this.statusList.push(data[i]);
             }
          }
        })
      },
      save(){
        this.$Modal.confirm({
          title:'系统提示',
          content:'确认保存吗?',
          onOk:()=>{
            this.axios.request({
              baseURL: '/poxy-next',
              url: '/manage/train/update',
              method: 'post',
              data: {
                access_token: this.$store.state.user.token,
                id:this.formData.id,
                result:this.formData.result,
                claminResult:this.formData.claminResult,
                claminId:this.formData.claminId,
                tenantId:this.formData.tenantId,
                trainNum: (this.toString(this.formData.claminResult)) == "已完成" ? this.formData.trainNum + 1 : this.formData.trainNum,
              },
            }).then(res => {
              if (res.success === true) {
                this.showModal = false;
                this.getList();
              }
            })
          }
        });
      console.log(JSON.stringify(this.formData));
      },
      getList(){
        this.loading = true;
        this.axios.request({
          baseURL: '/poxy-next',
          url: '/manage/train/list',
          method: 'post',
          data: {
            // access_token: this.$store.state.user.token,
            access_token:this.$store.state.user.token,
            page:this.page,
            limit:this.size,
            keyWord:this.search.status == 0 ? '' : this.search.status,
          },
        }).then(res => {
          if (res.success === true) {
            this.loading = false;
            this.total = res.total;
            this.tableData = res.data;
          }
        })
      },
      changePageSize(size){
        this.size = size;
        this.getList();
      },
      changePage(page){
        this.page = page;
        this.getList();
      }
    },
  }
</script>

<style scoped>

</style>
