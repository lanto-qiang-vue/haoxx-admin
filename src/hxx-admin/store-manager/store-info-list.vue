<!--门店信息-->
<template>
<common-table v-model="tableData" :columns="columns" :total="total" :show="showTable" :page="query.page"
              :loading="loading"
              @changePage="changePage" @changePageSize="changePageSize" @onRowClick="onRowClick"
              @onRowDblclick="onRowDblclick" >
  <div slot="search">
    <div class="search-block">
      <Input v-model="query.KEYWORD" placeholder="关键字搜索..."></Input>
    </div>
    <div class="search-block">
      <Select v-model="query.CHECK_STATUS_eq" clearable placeholder="审核状态...">
        <Option v-for="(item, index) in CHECK_STATUS_group"
                :key="index" :value="item.code">{{item.name}}</Option>
      </Select>
    </div>
    <div class="search-block">
      <Select v-model="query.STATUS_eq" clearable placeholder="营业状态...">
        <Option v-for="(item, index) in STATUS_group"
                :key="index" :value="item.code">{{item.name}}</Option>
      </Select>
    </div>
    <ButtonGroup size="small">
      <Button type="primary" @click="query.page=1;getList()"><Icon type="ios-search" size="24"/></Button>
      <Button type="primary" @click="clear()"><Icon type="ios-undo" size="24"/></Button>
    </ButtonGroup>
  </div>
  <div slot="operate">
    <Button type="primary" :disabled="!detailData" @click="">查看/编辑</Button>
    <Button type="success" :disabled="!detailData" @click="">添加电子健康档案账号</Button>
    <Button type="error" v-show="!detailData || detailData.CHECK_STATUS!='10351004'" :disabled="!detailData" @click="updateCheckStatus">门店停用</Button>
    <Button type="success" v-show="detailData && detailData.CHECK_STATUS=='10351004'" :disabled="!detailData" @click="updateCheckStatus">门店恢复</Button>
  </div>

  <!--<Modal v-model="showModal" title="添加电子健康档案账号" :width="400">-->
    <!--<Form ref="form" :model="form" :rules="rule" :label-width="80" class="change-password-form">-->
      <!--<FormItem prop="oldPassword" label="旧密码">-->
        <!--<Input type="password" v-model="form.oldPassword" @on-change="validateField(['rePassword','newPassword'])">-->
        <!--<Icon type="ios-lock-outline" slot="prepend"></Icon>-->
        <!--</Input>-->
      <!--</FormItem>-->
      <!--<FormItem prop="newPassword" label="新密码">-->
        <!--<Input type="password" v-model="form.newPassword" @on-change="validateField(['rePassword'])">-->
        <!--<Icon type="ios-lock-outline" slot="prepend"></Icon>-->
        <!--</Input>-->
      <!--</FormItem>-->
      <!--<FormItem prop="rePassword" label="确认密码">-->
        <!--<Input type="password" v-model="form.rePassword" @on-change="validateField(['newPassword'])">-->
        <!--<Icon type="ios-lock-outline" slot="prepend"></Icon>-->
        <!--</Input>-->
      <!--</FormItem>-->
    <!--</Form>-->
    <!--<div slot="footer">-->
      <!--<button type="button" class="ivu-btn ivu-btn-text ivu-btn-large" @click="showModal=false">取消</button>-->
      <!--<button type="button" class="ivu-btn ivu-btn-primary ivu-btn-large" @click="ok()">确定</button>-->
    <!--</div>-->
  <!--</Modal>-->
</common-table>
</template>

<script>
  import CommonTable from '@/hxx-components/common-table.vue'
  import { getName, getDictGroup } from '@/libs/util.js'
	export default {
    components: {CommonTable},
    name: "store-info-list",
    data(){
      return{
        query:{
          KEYWORD: '',
          CHECK_STATUS_eq: '',
          STATUS_eq: '',
          page: 1,
          start: 0,
          limit: 25,
          access_token: this.$store.state.user.token
        },
        showTable:false,
        total: 0,
        loading: true,

        tableData: [],
        columns: [
          {title: '序号',  minWidth: 70,
            render: (h, params) => h('span', (this.query.page-1)*this.query.limit+params.index+1 )
          },
          {title: '门店商户号', key: 'TENANT_NUM', sortable: true, minWidth: 130},
          {title: '门店名称', key: 'TENANT_NAME', sortable: true, minWidth: 200},
          {title: '门店地址', key: 'TENANT_ADD', sortable: true, minWidth: 150},
          {title: '联系人姓名', key: 'LINK_MAN', sortable: true, minWidth: 130},
          {title: '联系方式', key: 'LINK_TEL', sortable: true, minWidth: 120},
          {title: '营业状态', key: 'STATUS', sortable: true, minWidth: 120,
            render: (h, params) => h('span', getName(this.STATUS_group, params.row.STATUS))
          },
          {title: '审核状态', key: 'CHECK_STATUS', sortable: true, minWidth: 120,
            render: (h, params) => h('span', getName(this.CHECK_STATUS_group, params.row.CHECK_STATUS))
          },
          {title: '注册时间', key: 'CREATE_TIME', sortable: true, minWidth: 120,
            render: (h, params) => h('span', params.row.CREATE_TIME.substr(0, 10))
          },
          {title: '审核时间', key: 'AUDIT_TIME', sortable: true, minWidth: 120,
            render: (h, params) => h('span', params.row.AUDIT_TIME? params.row.AUDIT_TIME.substr(0, 10): '')
          },
        ],
        detailData: null,

        recordInfo:{

        }
      }
    },
    computed:{
      CHECK_STATUS_group(){
        return getDictGroup(this.$store.state.app.dict, '1035');
      },
      STATUS_group(){
        return getDictGroup(this.$store.state.app.dict, '1034');
      },
    },
    mounted(){
      this.getList()
    },
    methods:{
      getList(){
        this.detailData= null
        this.loading= true
        for(let key in this.query){
          (this.query[key]=== undefined || this.query[key]=== null) ? this.query[key]='': ''
        }
        this.axios.request({
          url: '/manage/info/tenantinfo/list',
          method: 'post',
          data: this.query
        }).then(res => {
          if (res.success === true) {
            this.tableData= res.data
            this.total= res.total
            this.showTable= true
          }
          this.loading= false
        })
      },
      updateCheckStatus(){
        console.log(this.detailData)
        let showText= this.detailData.CHECK_STATUS== '10351004'? '恢复': '停用'
        this.$Modal.confirm({
          title: '确定要'+ showText+ '该门店吗？',
          onOk: ()=> {
            this.axios.request({
              url: '/manage/info/tenantinfo/updateCheckStatus',
              method: 'post',
              data: {
                tenantId: this.detailData.TENANT_ID,
                checkStatus: this.detailData.CHECK_STATUS,
                access_token: this.query.access_token
              }
            }).then(res => {
              if (res.success === true) {
                this.$Message.success('门店'+showText+'成功')
                this.getList()
              }
            })
          }
        })
      },
      clear(){
        this.query.KEYWORD=''
        this.query.CHECK_STATUS_eq=''
        this.query.STATUS_eq=''
        this.query.page=1
        this.getList()
      },
      changePage(page){
        this.query.page= page
        this.getList()
      },
      changePageSize(size){
        this.query.limit= size
        this.getList()
      },

      onRowClick( row, index){
        this.detailData=row
      },
      onRowDblclick( row, index){
        this.detailData=row
        this.showDetail=Math.random()
      },
    }
	}
</script>

<style scoped>

</style>
