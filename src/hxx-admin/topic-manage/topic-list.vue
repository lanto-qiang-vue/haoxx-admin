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
    <Modal
      v-model="showModal"
      class="table-modal-detail full-height"
      width="100"
      heigh="100"
      :mask-closable="false"
      :scrollable="true"
      :transfer="false"
      :footer-hide="true"
      :transition-names="['', '']">
      <modal-title slot="header" :title="title" @clickBack="showModal=false"></modal-title>
      <Form :label-width="140" class="form-3">
        <FormItem label="话题发布人:" prop="PLATE_NUM">
          <Input>
          </Input>
        </FormItem>
        <FormItem label="话题发布时间:" prop="PLATE_NUM">
          <Input>
          </Input>
        </FormItem>
        <div style="clear:both;"></div>
        <FormItem label="状态:" prop="PLATE_NUM">
          <Input>
          </Input>
        </FormItem>
        <FormItem label="话题评论数:" prop="PLATE_NUM">
          <Input>
          </Input>
        </FormItem>
        <div style="clear:both;"></div>
        <FormItem label="话题:" prop="PLATE_NUM" style="width:67%;">
          <div><b>汽车多久需要保养?</b></div>
          <div>
            汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车,多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养
            汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养
          </div>
        </FormItem>
      </Form>
      <!--底部评论搜索-->
      <div>
        <div class="search-block">
          <Input placeholder="账号/昵称" v-model="KEYWORD"></Input>
        </div>
        <div class="search-block">
          <DatePicker type="daterange" :value="value" :options="option" format="yyyy-MM-dd" placeholder="请选择时间"
                      style="width:100%;"
                      @on-change="onChange"></DatePicker>
        </div>
        <ButtonGroup size="small">
          <Button type="primary" @click="page=1;getList()">
            <Icon type="ios-search" size="24"/>
          </Button>
        </ButtonGroup>
      </div>
      <!--底部评论列表-->
      <div class="comment">
        <div class="title">
          <div class="f200">评论人:18799887656</div>
          <div class="f250">评论时间:2019-04-19 10:04:20</div>
          <div class="f250">点赞数:999</div>
          <div style="clear:both;"></div>
          <div>评论内容: 汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车,多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养
            汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养汽
          </div>
          <Button class="button">删除</Button>
        </div>
        <div class="content">
          <div style="width:100%;">
            <div style="float:left;width:300px;">13918765667->18799887656</div>
            <div style="float:left;">2019-04-19 10:05:10</div>
          </div>
          <div style="clear:both;"></div>
          <div>
            回复内容:XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
          </div>
          <Button class="button">删除</Button>
        </div>
        <div style="border-bottom:1px solid black;"></div>
      </div>
      <div class="comment">
        <div class="title">
          <div class="f200">评论人:18799887656</div>
          <div class="f250">评论时间:2019-04-19 10:04:20</div>
          <div class="f250">点赞数:999</div>
          <div style="clear:both;"></div>
          <div>评论内容: 汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车,多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养
            汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养汽
          </div>
          <Button class="button">删除</Button>
        </div>
        <div class="content">
          <div style="width:100%;">
            <div style="float:left;width:300px;">13918765667->18799887656</div>
            <div style="float:left;">2019-04-19 10:05:10</div>
          </div>
          <div style="clear:both;"></div>
          <div>
            回复内容:XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
          </div>
          <Button class="button">删除</Button>
        </div>
        <div style="border-bottom:1px solid black;"></div>
      </div>
      <div class="comment">
        <div class="title">
          <div class="f200">评论人:18799887656</div>
          <div class="f250">评论时间:2019-04-19 10:04:20</div>
          <div class="f250">点赞数:999</div>
          <div style="clear:both;"></div>
          <div>评论内容: 汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车,多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养
            汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养汽
          </div>
          <Button class="button">删除</Button>
        </div>
        <div class="content">
          <div style="width:100%;">
            <div style="float:left;width:300px;">13918765667->18799887656</div>
            <div style="float:left;">2019-04-19 10:05:10</div>
          </div>
          <div style="clear:both;"></div>
          <div>
            回复内容:XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
          </div>
          <Button class="button">删除</Button>
        </div>
        <div style="border-bottom:1px solid black;"></div>
      </div>
      <div class="comment">
        <div class="title">
          <div class="f200">评论人:18799887656</div>
          <div class="f250">评论时间:2019-04-19 10:04:20</div>
          <div class="f250">点赞数:999</div>
          <div style="clear:both;"></div>
          <div>评论内容: 汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车,多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养
            汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养汽车多久需要保养汽
          </div>
          <Button class="button">删除</Button>
        </div>
        <div class="content">
          <div style="width:100%;">
            <div style="float:left;width:300px;">13918765667->18799887656</div>
            <div style="float:left;">2019-04-19 10:05:10</div>
          </div>
          <div style="clear:both;"></div>
          <div>
            回复内容:XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
          </div>
          <Button class="button">删除</Button>
        </div>
        <div style="border-bottom:1px solid black;"></div>
      </div>
      <div class="table-bottom" style="line-height:40px;">
        <Page :current="page" size="small" :page-size="25" show-sizer show-elevator show-total :page-size-opts="[25, 50, 100, 150]"
              placement="top" :total="total" @on-change="changePage" @on-page-size-change="changePageSize"/>
        <Button size="small" class="refresh" @click="changePage(page)"><Icon type="md-refresh" size="20"/></Button>
      </div>
    </Modal>
  </common-table>
</template>
<script>
  import commonTable from '@/hxx-components/common-table.vue'
  import ModalTitle from '@/hxx-components/modal-title.vue'

  export default {
    name: "topic-list",
    components: {commonTable, ModalTitle},
    data() {
      return {
        title: '话题详情',
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
          {
            title: '操作', key: 'E', minWidth: 100,
            render: (h, params) => {
              let button = [];
              button.push(h('Button', {type: 'primary'}, '关闭/恢复'));
              button.push(h('Button', {type: 'primary', style: {marginLeft: '10px'}}, '查看详情'));
              return h('div', button);
            }
          },
        ],
        showTable: false,
        loading: false,
        showModal: true,
        total: 0,
        page: 1,
        limit: 25,
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
      getList() {
        this.tableData = [{A: 'A'}, {B: 'B'}];
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
<style lang="less">
  .f200{
    float:left;
    width:200px;
  }
  .f250{
    float:left;
    width:250px;
  }
  .comment {
    font-size: 14px;
    line-height: 30px;
    .title {
      width: 100%;
      padding-right: 200px;
      position: relative;
    }
    .button {
      position: absolute;
      top: 50%;
      right: 100px;
      transform: translateY(-50%)
    }
    .content {
      width: 100%;
      padding-right: 200px;
      padding-left: 60px;
      position: relative;
      .button {
        position: absolute;
        top: 50%;
        right: 100px;
        transform: translateY(-50%)
      }
    }
  }

  .table-modal-detail .ivu-modal-wrap .ivu-modal .ivu-modal-content .ivu-modal-body {
    height: ~"calc(100% - 45px)";
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
