<template>
  <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage"
                :total="total" :show="showTable" :page="page" :loading="loading">
    <div slot="search">
      <div class="search-block">
        <Input placeholder="会员账号/话题" v-model="KEYWORD"></Input>
      </div>
      <div class="search-block">
        <DatePicker type="daterange" :value="value" :options="option" format="yyyy-MM-dd" placeholder="请选择时间"
                    style="width:100%;"
                    @on-change="onChange"></DatePicker>
      </div>
      <div class="search-block">
        <Select v-model="topicId" placeholder="请选择话题圈">
          <Option v-for="(item, index) in topicList"
                  :key="index" :value="item.id">{{item.name}}
          </Option>
        </Select>
      </div>
      <div class="search-block">
        <Select v-model="typeId" placeholder="请选择状态">
          <Option v-for="(item, index) in typeList"
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
    name: "topic-list",
    components: {commonTable},
    data() {
      return {
        topicId: '请选择话题圈',
        typeId: '请选择状态',
        typeList: [
          {id: '请选择状态', name: '请选择状态'},
          {id: '1', name: '话题圈1'},
          {id: '2', name: '话题圈2'},
        ],
        topicList: [
          {id: '请选择话题圈', name: '请选择话题圈'},
          {id: '1', name: '话题圈1'},
          {id: '2', name: '话题圈2'},
        ],
        value: [],
        tableData: [],
        columns: [
          {
          title: '序号', width: 100,
          render: (h, params) => h('span', (this.page - 1) * this.limit + params.index + 1)
        },
          {title: '发布人', key: 'A', minWidth: 100},
          {title: '话题', key: 'B', minWidth: 100},
          {title: '话题圈', key: 'C', minWidth: 100},
          {title: '发布时间', key: 'D', minWidth: 100},
          {title: '评论数', key: 'E', minWidth: 100},
          {title: '状态', key: 'E', minWidth: 100},
          {title: '操作', key: 'E', minWidth: 100,
          render:(h,params) => {
            let button = [];
            button.push(h('Button',{type:'primary'},'关闭/恢复'));
            button.push(h('Button',{type:'primary',style:{marginLeft:'10px'}},'查看详情'));
            return h('div',button);
          }
          },
        ],
        total: 0,
        showTable: false,
        page: 1,
        limit: 25,
        loading: false,
        KEYWORD: '',
        option: {
          disabledDate(date) {
            return date > new Date();
          }
        },
      }
    },
    mounted() {
      this.showTable = Math.random();
      this.getList();
    },
    methods: {
      getList(){
        this.tableData = [{A:'A'},{B:'B'}];
      },
      onChange(val) {
        this.value = val;
        console.log(this.value);
      },
      changePageSize(size) {
        this.limit = size;
        if (this.page == 1) this.getList();
      },
      changePage(page) {
        this.page = page;
        this.getList();
      },
    }
  }
</script>

<style scoped>

</style>
