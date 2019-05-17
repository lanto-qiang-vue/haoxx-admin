<template>
  <div class="tast-list" style="width:100%;height:100%;">
  <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage"
                :total="total" :show="showTable" :page="page" :loading="loading">
    <div slot="search">
      <div class="search-block">
        <Input placeholder="门店名称" v-model="KEYWORD"></Input>
      </div>
      <div class="search-block">
        <Select v-model="ORDER_STATE" placeholder="请选择审核状态">
          <Option v-for="(item, index) in statusList"
                  :key="index" :value="item.id">{{item.name}}
          </Option>
        </Select>
      </div>
      <div class="search-block">
        <Select v-model="tastStatus" placeholder="请选择任务">
          <Option v-for="(item, index) in tastList"
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
  </div>
</template>
<script>
  import commonTable from '@/hxx-components/common-table.vue'
  import ModalTitle from '@/hxx-components/modal-title.vue'

  export default {
    name: "tast-test",
    components: {commonTable, ModalTitle},
    data() {
      return {
        recordData: [],
        id: 310000009775,
        type: '',
        detail: {
          A: '上传门头照',
          B: '门店A',
          C: '待审核',
          D: '18358330864',
          E: '张三',
          F: '2019-04-13',
        },
        storeName:'',
        recordColumns: [
          {
            title: '序号', width: 100,
            render: (h, params) => h('span', (this.recordPage - 1) * this.recordLimit + params.index + 1)
          },
          {
            title: '审核状态', key: 'status', minWidth: 100,
            render: (h, params) => h('span', this.statusObject[params.row.status])
          },
          {title: '审核说明', key: 'description', minWidth: 100},
          {title: '审核人员', key: 'reviewBy', minWidth: 100},
          {title: '审核时间', key: 'reviewDate', minWidth: 100},
          {title: '服务人员账号', key: 'applyAn', minWidth: 100},
          {title: '服务人员姓名', key: 'applyBy', minWidth: 100},
          {title: '提交时间', key: 'applyDate', minWidth: 100},
        ],
        statusObject: {
          no_need: '无需审核',
          apply: '待审核',
          pass: '已通过',
          fail: '未通过'
        },
        strToInt: {
          headpic: 1,
          stationpic: 2,
          servetag: 3,
          otherattr: 4,
        },
        taskObject: {
          headpic: '上传门头照',
          stationpic: '上传工位照',
          servetag: '门店标签',
          otherattr: '营业时间及工位数',
          promowxpa: '好修修车生活推广',
        },
        recordTotal: 0,
        showRecord: false,
        recordPage: 1,
        recordLimit: 25,
        showModal: false,
        title: '',
        stage: 0,
        openName: 'list',
        tableData: [],
        KEYWORD: '',
        detailKeyword: '',
        ORDER_STATE: "请选择审核状态",
        businessTime: '',//营业时间
        workDetail: '',//工位详情(工位总数)
        tastStatus: "请选择任务",
        order_state_list: ["不可接单", "可接单", "已接单"],
        is_online_list: ["离线", "在线"],
        columns: [
          {
            title: '序号', width: 100,
            render: (h, params) => h('span', (this.page - 1) * this.limit + params.index + 1)
          },
          {
            title: '审核状态', key: 'status', width: 100,
            render: (h, params) => h('span', this.statusObject[params.row.status])
          },
          {
            title: '任务', key: 'daqType', width: 160,
            render: (h, params) => h('span', this.taskObject[params.row.daqType])
          },
          {title: '门店名称', key: 'shopName', minWidth: 100},
          {
            title: '操作', key: 'F', width: 300, align: 'center',
            render: (h, params) => {
              let btn = [h('Button', {
                props: {type: 'primary', size: 'small'}, style: {marginLeft: "10px"}, on: {
                  click: () => {
                    this.openName = 'list';
                    this.showModal = true;
                    this.detailKeyword = "";
                    this.id = params.row.shopNo;
                    this.storeName = params.row.shopName;
                    this.showRecord = Math.random();
                    this.type = params.row.daqType;
                    this.getRecord();
                  }
                }
              }, '查看提交记录')];
              if (params.row.daqType != 'promowxpa') btn.unshift(h('Button', {
                props: {type: 'primary', size: 'small'}, on: {
                  click: () => {
                    this.id = params.row.shopNo;
                    this.stage = this.strToInt[params.row.daqType];
                    this.getDetail(this.strToInt[params.row.daqType]);
                    this.openName = 'detail';
                    this.showModal = true;
                  }
                }
              }, '查看详情'));
              return h('div', btn)
            }
          },
        ],
        total: 0,
        page: 1,
        limit: 25,
        loading: false,
        showTable: false,
        checkModal: false,
        imgList: [],
        failData: {
          reason: "",
        },
        isOk: 'pass',
        failRule: {
          reason: {required: true, message: '不通过需要填写理由'}
        },
        statusList: [
          {id: "请选择审核状态", name: '请选择审核状态'},
          {id: 'no_need', name: '无需审核'},
          {id: 'apply', name: '待审核'},
          {id: 'pass', name: '已通过'},
          {id: 'fail', name: '未通过'}
        ],
        tastList: [
          {id: "请选择任务", name: "请选择任务"},
          {id: 'headpic', name: '上传门头照'},
          {id: 'stationpic', name: '上传工位照'},
          {id: 'servetag', name: '门店标签'},
          {id: 'otherattr', name: '营业时间及工位数'},
          {id: 'promowxpa', name: '好修修车生活推广'},
        ],
        tagList: [],
      }
    },
    mounted() {
      console.log("mounted-start");
      this.getList();
      console.log("mounted-end");
      // this.showRecord = Math.random();
    },
    methods: {
      getList() {
        this.$fly.get('/shop/dap-review/hxx_mgt/task/query', {
          params: {
            shopName: this.KEYWORD,
            status: this.ORDER_STATE == '请选择审核状态' ? '' : this.ORDER_STATE,
            type: this.tastStatus == '请选择任务' ? '' : this.tastStatus,
            page: this.page - 1,
            size: this.limit,
          },
        }).then(res => {
          console.log("获取返回值", res);
          if (res.content) {
            this.tableData = res.content;
            this.total = res.totalElements;
            this.showTable = Math.random();
          }
          console.log("tableData", this.tableData);
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
    height: ~'calc(100% - 45px)';
  }

  .form-3 {
    padding-top: 20px;
    height: 100%;
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
