<template>
  <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage"
                :total="total" :show="showTable" :page="page" :loading="loading">
    <div slot="search">
      <div class="search-block">
        <Input placeholder="圈子名称" v-model="KEYWORD"></Input>
      </div>
      <div class="search-block">
        <Select v-model="typeStatus" placeholder="请选择状态">
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
    <Modal
      v-model="checkModal"
      width="400px"
      heigh="100"
      :mask-closable="false"
      :scrollable="true"
      :transfer="false"
      :footer-hide="false"
      :transition-names="['', '']"
      title="新增话题圈"
    >
      <div>
        <Form >
          <FormItem>
            <Input :value="detail.A" placeholder="请输入圈子名称">
            </Input>
          </FormItem>
          <FormItem>
            <img src="/img/no_img.32c20fc5.png" style="width:100%;"/>
          </FormItem>
        </Form>
      </div>
      <div class="tag" v-show="false" style="text-align:center;">
        <Button v-for="item in tagList" :type="item.checked ? 'primary' : 'default'"
                @click="item.checked = !item.checked">{{item.name}}
        </Button>
      </div>
      <div slot="footer">
        <upload-img style="float:left;" actionUrl="/proxy/upload" @uploadSuccess="uploadSuccess"></upload-img>
        <Button type="primary">保存并停用</Button>
        <Button type="primary">保存并启用</Button>
      </div>
    </Modal>
  </common-table>
</template>
<script>
  import commonTable from '@/hxx-components/common-table.vue'
  import uploadImg from '@/hxx-components/upload-img.vue'

  export default {
    name: "topic-circle",
    components: {commonTable, uploadImg},
    data() {
      return {
        showModal: true,
        tableData: [],
        KEYWORD: '',
        showTable:false,
        checkModal:false,
        detail:{},
        columns: [
          {
            title: '序号', width: 100,
            render: (h, params) => h('span', (this.page - 1) * this.limit + params.index + 1)
          },
          {title: '话题圈', key: 'A', minWidth: 100},
          {title: '创建人', key: 'B', minWidth: 100},
          {title: '创建人角色', key: 'C', minWidth: 100},
          {title: '创建时间', key: 'D', minWidth: 100},
          {title: '状态', key: 'E', minWidth: 100},
          {title: '已发布话题', key: 'E', minWidth: 100},
          {
            title: '操作', key: 'F', minWidth: 300, align: 'center',
            render: (h, params) => h('Button',{props:{type:'default'}},"启用/停用")
          }
        ],
        total: 0,
        page: 1,
        limit: 25,
        loading: false,
        typeStatus:'请选择状态',
        typeList: [
          {id: "请选择状态", name: '请选择状态'},
          {id: 0, name: '启用'},
          {id: 1, name: '禁用'},
          {id: 2, name: '待用'},
        ],
        tagList: [
          {name: '保你满意', checked: false},
          {name: '标签二', checked: false},
          {name: '一年365天营业,24小时', checked: false},
          {name: '标签四', checked: false},
          {name: '标签五', checked: false},
        ],
      }
    },
    mounted() {
      this.showTable = Math.random();
      this.getList();
    },
    methods: {
      uploadSuccess(response){

      },
      getList() {
        this.axios.request({
          url: '/manage/topicmanage/insertTopic',
          method: 'post',
          params: {
            access_token: this.$store.state.user.token,
            keyWord:this.keyWord,
            limit: this.limit,
            page: this.page,
          },
        }).then(res => {
          if (res.success) {
            this.tableData = res.data;
            this.total = res.total;
            this.loading = false;
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
      },
    }
  }
</script>
<style lang="less">
  .table-modal-detail .ivu-modal-wrap .ivu-modal .ivu-modal-content .ivu-modal-body {
    height: calc(100% - 45px);
  }

  .form-3 {
    padding-top: 20px;
  }

  .form-3 .ivu-form-item {
    width: 33%;
    display: inline-block;
    margin-bottom: 15px;
  }

  .form-3 .ivu-btn {
    margin-right: 10px;
  }

  .tag .ivu-btn {
    margin-bottom: 10px;
    margin-right: 10px;
  }
</style>
