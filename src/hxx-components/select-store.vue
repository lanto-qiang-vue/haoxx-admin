<template>
  <Modal
    v-model="showModal"
    class="table-modal-detail"
    title="适用门店"
    width="80"
    :mask-closable="false"
    @on-visible-change="visibleChange"
    :scrollable="true"
    :transfer="true"
    :footer-hide="false"
    :transition-names="['', '']">
    <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage"
                  :total="total" :show="showTable" :loading="loading" :page="page" :clearSelect="clearType"
                  @changeSelect="changeSelect"
                  :showOperate="false">
      <div slot="search">
        <div class="search-block">
          <Input v-model="keyword" placeholder="门店名称"></Input>
        </div>
        <div class="search-block">
          <Select placeholder="请选择区域" v-model="areaKey">
            <Option v-for="(item, index) in areaList"
                    :key="index" :value="item.code">{{item.name}}
            </Option>
          </Select>
        </div>
        <div class="search-block">
          <Select placeholder="请选择类型" v-model="category">
            <Option v-for="(item, index) in categoryList"
                    :key="index" :value="item.id">{{item.name}}
            </Option>
          </Select>
        </div>
        <ButtonGroup>
          <Button type="primary" @click="page=1;getList()">
            搜索
          </Button>
        </ButtonGroup>
      </div>
    </common-table>
    <div slot="footer">
      <Button @click="showModal=false">取消</Button>
      <Button type="primary" v-show="openSelect">确定</Button>
    </div>
  </Modal>
</template>
<script>
  import commonTable from '@/hxx-components/common-table.vue'

  export default {
    name: 'select-store',
    components: {commonTable},
    props: {
      showType: {
        default: false,
      },
      code: {
        default: false,
      },
      openSelect: {
        default: false,
      },
      checkId: {
        default: function () {
          return [];
        }
      }
    },
    data() {
      return {
        categoryList: [{id:'请选择类型',name:'请选择类型'}],
        areaList:[
          {code:'请选择区域', name: '请选择区域'}
        ],
        keyword: '',
        category:'请选择类型',
        areaKey:'请选择区域',
        page: 1,
        limit: 25,
        loading: false,
        checkObject: {},
        total: 0,
        tableData: [],
        showModal: false,
        clearType: false,
        showTable: false,
        keyIndex: {},
        columns: [
          {type: 'selection', align: 'center', width: 70},
          {
            title: '序号2', width: 70, align: 'center',
            render: (h, params) => h('span', (this.page - 1) * this.limit + params.index + 1)
          },
          {title: '区域', key: 'A', sortable: true, minWidth: 140, align: 'left'},
          {title: '类型', key: 'B', sortable: true, minWidth: 140, align: 'left'},
          {title: '门店名称', key: 'C', sortable: true, minWidth: 140, align: 'left'},
        ],
      }
    },
    methods: {
      getCategory(){
        this.axios.request({
          baseURL: '/poxy-shqx/',
          url: '/manage/cupon/queryCategoryinfo',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            code: this.code,
          }
        }).then(res => {
          if (res.success == true) {
           let data = res.data;
           for(let i in data){
             this.categoryList.push(data[i]);
           }
          }
        })
      },
      getArea() {
        this.axios.request({
          baseURL: '/poxy-shqx/',
          url: '/manage/cupon/queryAreainfo',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            code: this.code,
          }
        }).then(res => {
          if (res.success == true) {
            let data = res.data;
            for(let i in data){
              this.areaList.push(data[i]);
            }
          }
        })
      },
      changeSelect(row) {
        let obj = {};
        for (let i in this.tableData) {
          obj[this.tableData[i].id] = 0;
        }
        for (let i in row) {
          obj[row[i].id] = 1;
        }
        for (let i in obj) {
          this.checkObject[i] = obj[i];
        }
        console.log(JSON.stringify(this.checkObject));
      },
      visibleChange() {
        this.clearsection();
      },
      changePage(page) {
        this.page = page;
        this.getList();
      },
      changePageSize(size) {
        this.limit = size;
        this.getList();
      },
      getList() {
        this.loading = true;
        this.axios.request({
          baseURL: '/poxy-shqx/',
          url: '/manage/cupon/queryTotalTenant',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            type: this.code,
            corpName: this.keyword,
            category:this.category == '请选择类型' ? '' : this.category,
            areaKey: this.areaKey == '请选择区域' ? '' : this.areaKey,
            page: this.page,
            limit: this.limit,
          }
        }).then(res => {
          this.loading = false;
          if (res.success == true) {
            let data = res.data;
            for (let i in this.checkObject) {
              if (this.checkObject[i] == 1) {
                for (let a in data) {
                  if (data[a].id == i) {
                    data[a]['_checked'] = true;
                  }
                }
              }
            }
            this.tableData = data;
          }
        })
      },
      clear() {
        this.search.keyword = '';
      },
      clearsection() {
        this.list = '';
        this.clearType = Math.random();
      }
    },
    mounted() {
    },
    watch: {
      showType() {
        this.showModal = true;
        this.showTable = Math.random();
        this.getCategory();
        this.getArea();
        this.columns = [
          {
            title: '区域', key: 'area', sortable: true, minWidth: 100, align: 'center',
            render: (h, params) => h('span', params.row.area.name)
          },
          {
            title: '类型', key: 'B', sortable: true, minWidth: 140, align: 'left',
            render: (h, params) => h('span', params.row.category.name)
          },
          {title: '门店名称', key: 'corpName', sortable: true, minWidth: 240, align: 'left'},
        ]
        if (this.openSelect) {
          for (let i in this.checkId) {
            this.checkObject[this.checkId[i]] = 1;
          }
          this.unshift({type: 'selection', align: 'center', width: 70});
        }
        this.showTable = Math.random();
        this.getList();
      },
      refresh() {
        this.getList();
      }
    }
  }
</script>
