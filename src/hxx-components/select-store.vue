<template>
  <Modal
    v-model="showModal"
    class="table-modal-detail select-store"
    title="适用门店"
    width="80"
    :mask-closable="false"
    @on-visible-change="visibleChange"
    :scrollable="true"
    :transfer="true"
    :footer-hide="false"
    :transition-names="['', '']">
    <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage"
                  :total="total" :show="showTable" :loading="loading" :page="page"
                  ref="table" @on-select="select" @on-select-cancel="selectCancel"
                  :showOperate="false">
      <div slot="search">
        <div class="search-block">
          <Input v-model="query.corpName" placeholder="门店名称" clearable></Input>
        </div>
        <div class="search-block">
          <Select placeholder="请选择区域" v-model="query.areaKey" clearable>
            <Option v-for="(item, index) in areaList"
                    :key="index" :value="item.code">{{item.name}}
            </Option>
          </Select>
        </div>
        <div class="search-block">
          <Select placeholder="请选择类型" v-model="query.category" clearable>
            <Option v-for="(item, index) in categoryList"
                    :key="index" :value="item.id">{{item.name}}
            </Option>
          </Select>
        </div>
        <ButtonGroup>
          <Button type="primary" @click="page=1;getList()">搜索</Button>
        </ButtonGroup>
      </div>
    </common-table>
    <div slot="footer">
      <Button @click="showModal=false">取消</Button>
      <Button type="primary" v-show="selection" @click="ok">确定</Button>
    </div>
  </Modal>
</template>
<script>
  import commonTable from '@/hxx-components/common-table.vue'

  export default {
    name: 'select-store',
    components: {commonTable},
    props: {
      code: {
        default: null,
      },
      selection: {
        default: false,
      },
      value: {
        default: ()=> []
      },
      primaryKey: {
        default: 'id',
      },
    },
    data() {
      return {
        categoryList: [],
        areaList:[],
        checked: [],
        query:{
          // type: false,
          corpName: '',
          category: '',
          areaKey: '',
        },
        page: 1,
        limit: 25,
        loading: false,
        total: 0,
        tableData: [],
        showModal: false,
        showTable: false,
      }
    },
    computed:{
      columns(){
        let columns= [
          {
            title: '区域', key: 'area', sortable: true, minWidth: 100, align: 'left',
            render: (h, params) => h('span', params.row.area.name),
          },
          {
            title: '类型', key: 'B', sortable: true, minWidth: 140, align: 'left',
            render: (h, params) => h('span', params.row.category.name)
          },
          {title: '门店名称', key: 'corpName', sortable: true, minWidth: 240, align: 'left'},
        ]
        if (this.selection) {
          columns.unshift({type: 'selection', align: 'center', width: 70});
        }
        return columns
      }
    },
    watch: {
      value:{
        handler(arr){
          this.checked= arr
          this.showChecked()
        },
        deep: true
      }
    },
    mounted() {
      this.getCategory();
      this.getArea();
      this.getList()
    },
    methods: {
      open(){
        this.showModal= true
        this.$refs.table.open()
      },
      sc(v1, v2){
        console.log('v1, v2', v1, v2)
      },
      getCategory(){
        this.axios.request({
          baseURL: '/poxy-shqx/',
          url: '/manage/cupon/queryCategoryinfo',
          method: 'post',
          data: {
            code: this.code,
          }
        }).then(res => {
          if (res.success == true) {
            this.categoryList = res.data;
          }
        })
      },
      getArea() {
        this.axios.request({
          baseURL: '/poxy-shqx/',
          url: '/manage/cupon/queryAreainfo',
          method: 'post',
          data: {
            code: this.code,
          }
        }).then(res => {
          if (res.success == true) {
            this.areaList = res.data;
          }
        })
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
            ...this.query,
            code: this.code,
            page: this.page,
            limit: this.limit,
          }
        }).then(res => {
          this.loading = false;
          if (res.success == true) {
            let data = res.data;
            this.tableData = data;
            this.total = res.total;
            this.showChecked()
          }
        })
      },
      showChecked(){
        let arr1= this.checked, arr2= this.tableData
        for(let i in arr1){
          for(let j in arr2){
            if(arr1[i][this.primaryKey]== arr2[j][this.primaryKey]){
              arr2[j]['_checked']= true
            }
          }
        }
      },
      select(selection, row){
        this.checked.push(row)
        // this.$emit('input', this.checked)
      },
      selectCancel(selection, row){
        let arr= this.checked, index= null
        for(let i in arr){
          if(arr[i][this.primaryKey]== row[this.primaryKey]){
            index= i
          }
        }
        arr.splice(i, 1)
        // this.$emit('input', arr)
      },
      clearsection() {
        this.list = '';
        this.$refs.table.clearCurrentRow()
      },
      ok(){
        this.$emit('input', this.checked)
        this.$emit('ok', this.checked)
        this.showModal= false
      }
    },
  }
</script>

<style lang="less">
  .select-store{
    .ivu-table-header{
      .ivu-table-cell-with-selection{
        &:before{
          content: '请选择';
        }
        .ivu-checkbox-wrapper{
          display: none;
        }

      }
    }
  }
</style>
