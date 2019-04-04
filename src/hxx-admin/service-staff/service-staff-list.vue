<template>
  <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage"
                :total="total" :show="showTable" :page="page" :loading="loading">
    <div slot="search">
      <div class="search-block">
        <Input placeholder="会员账号/姓名" v-model="KEYWORD"></Input>
      </div>
      <div class="search-block">
        <Select v-model="ORDER_STATE" placeholder="请选择接单状态">
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
  </common-table>
</template>

<script>
  import commonTable from '@/hxx-components/common-table.vue'

  export default {
    name: "service-staff-list",
    components: {commonTable},
    data() {
      return {
        tableData: [],
        KEYWORD:'',
        ORDER_STATE:"请选择接单状态",
        order_state_list:["不可接单","可接单","已接单"],
        is_online_list:["离线","在线"],
        columns: [
          {
            title: '序号', width: 100,
            render: (h, params) => h('span', (this.page - 1) * this.limit + params.index + 1)
          },
          {title: '会员账号', key: 'username', width: 200,
          render:(h,params) => h('a',{
            on:{
              click:()=>{
                this.$router.push({path:'/daily-count'})
              }
            }
          },params.row.username)
          },
          {
            title: '照片', key: 'B', width: 100,
            render: (h, params) => h('div',{style:{width:"100px",height:"100px",marginLeft:"-10px",cursor:"pointer"},on:{
              click:()=>{
                alert(1);
              }
              }},"")
          },
          {title: '姓名', key: 'nickname', width: 180},
          {title: '在线状态', key: 'is_online', width: 140,align:"center",
          render:(h,params)=>h('b',{style:{
            color:params.row.is_online == 0 ? "red" : "green"
            }},this.is_online_list[params.row.is_online])
          },
          {title: '目前接单状态', key: 'order_state', width: 140,align:"center",
          render:(h,params)=>h('b',{
            style:{
              color:this.color(params.row.order_state),
            }
          },this.order_state_list[params.row.order_state])
          },
          {
            title: '操作', key: 'F', minWidth: 300, align: 'center',
            render: (h, params) => h('div', [
              h('Button', {props: {type:params.row.order_state > 0 ? "default" : "primary"},on:{
                click:()=>{
                  let content = params.row.order_state > 0 ?  "确认切换到不可接单状态码?" : "确认切换到可接单状态吗?";
                  this.$Modal.confirm({
                    title:'系统提示',
                    content:content,
                    onOk:()=>{
                      this.axios.request({
                        url: '/manage/person/switchstatus',
                        method: 'get',
                        params: {
                          access_token: this.$store.state.user.token,
                          id:params.row.id,
                          status:params.row.order_state > 0 ? 0 : 1,
                        },
                      }).then(res => {
                        if (res.success === true) {
                          this.getList();
                        }
                      })
                    }
                  });

                }
                }}, params.row.order_state > 0 ? "切换到不可接单" : "切换到可接单"),
              h('Button', {props:{type:params.row.state > 0 ? "default" : "primary"},style: {marginLeft: "10px"},on:{
                click:()=>{
                  let content = params.row.order_state > 0 ?  "确认解除角色吗?" : "确认绑定角色吗?";
                  this.$Modal.confirm(
                    {
                      title:'系统提示',
                      content:content,
                      onOk:()=>{
                        this.axios.request({
                          url: '/manage/person/relieverole',
                          method: 'get',
                          params: {
                            access_token: this.$store.state.user.token,
                            id:params.row.id,
                            state:params.row.state > 0 ? 0 : 1,
                          },
                        }).then(res => {
                          if (res.success === true) {
                            this.getList();
                          }
                        })
                      }
                    }
                  );
                }
                }},params.row.state > 0 ? "解除角色" : "绑定角色")
            ])
          },
        ],
        total: 0,
        page: 1,
        limit: 25,
        loading: false,
        showTable: false,
        statusList: [
          {id: "请选择接单状态", name: '请选择接单状态'},
          {id: 0, name: '不可接单'},
          {id: 1, name: '可接单'},
          {id: 2, name: '已接单'},
        ],
      }
    },
    mounted() {
      this.showTable = Math.random();
      this.getList();
    },
    methods: {
      color(code){
        switch(code){
          case 0:
            return "red";
            break;
          case 1:
            return "green";
            break;
          case 2:
            return "orange";
                break;
        }
      },
      getList() {
        this.axios.request({
          url: 'manage/person/list',
          method: 'get',
          params: {
            access_token: this.$store.state.user.token,
            limit:this.limit,
            page:this.page,
            KEYWORD:this.KEYWORD,
            ORDER_STATE:this.ORDER_STATE == "请选择接单状态" ? "" : this.ORDER_STATE,
          },
        }).then(res => {
          if (res.success === true) {
            this.showModal = false;
            this.total = res.total;
            this.tableData = res.data;
          }
        })
      },
      changePageSize(size) {
        this.limit = size;
        if (this.page == 1) this.getList();
      },
      changePage(page) {
        this.page = page;
        this.getList();
      }
    }
  }
</script>

<style scoped>

</style>
