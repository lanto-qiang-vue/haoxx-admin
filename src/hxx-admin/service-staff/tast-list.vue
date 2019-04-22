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
    <Modal
      v-model="showModal"
      class="table-modal-detail full-height"
      width="100"
      heigh="100"
      :mask-closable="false"
      :scrollable="true"
      :transfer="false"
      :footer-hide="false"
      :transition-names="['', '']">
      <modal-title slot="header" :title="title" :state="state" @clickBack="showModal=false"></modal-title>
      <common-table v-show="false" v-model="recordData" :columns="recordColumns" @changePageSize="recordChangePageSize"
                    @changePage="recordChangePage"
                    :total="recordTotal" :show="showRecord" :page="recordPage">
        <div slot="search">
          <div class="search-block">
            <Input placeholder="会员账号/姓名" v-model="KEYWORD"></Input>
          </div>
          <ButtonGroup size="small">
            <Button type="primary" @click="page=1;getRecord()">
              <Icon type="ios-search" size="24"/>
            </Button>
          </ButtonGroup>
        </div>
      </common-table>
      <!--门头照-->
      <Form :label-width="140" class="form-3">
        <FormItem label="任务名称:" prop="PLATE_NUM">
          <Input :value="detail.A">
          </Input>
        </FormItem>
        <FormItem label="门店:" prop="PLATE_NUM">
          <Input :value="detail.B">
          </Input>
        </FormItem>
        <FormItem label="审核状态:" v-show="stage == 1 || stage == 2 || stage == 3" prop="PLATE_NUM">
          <Input :value="detail.C">
          </Input>
        </FormItem>
        <FormItem label="服务人员账号:" prop="PLATE_NUM">
          <Input :value="detail.D">
          </Input>
        </FormItem>
        <FormItem label="服务人员姓名:" prop="PLATE_NUM">
          <Input :value="detail.E">
          </Input>
        </FormItem>
        <FormItem label="任务完成时间:" v-show="stage == 4" prop="PLATE_NUM">
          <Input :value="detail.F">
          </Input>
        </FormItem>
        <FormItem label="任务提交时间:" v-show="stage == 1 || stage == 2 || stage == 3" prop="PLATE_NUM">
          <Input :value="detail.F">
          </Input>
        </FormItem>
        <FormItem label="营业时间:" v-show="stage == 4" prop="PLATE_NUM">
          <Input :value="detail.F">
          </Input>
        </FormItem>
        <FormItem label="工位总数:" v-show="stage == 4" prop="PLATE_NUM">
          <Input :value="detail.F">
          </Input>
        </FormItem>
        <FormItem label="审核人员账号:" v-show="stage == 3" prop="PLATE_NUM">
          <Input :value="detail.G">
          </Input>
        </FormItem>
        <FormItem label="审核人:" v-show="stage == 2" prop="PLATE_NUM">
          <Input :value="detail.G">
          </Input>
        </FormItem>
        <FormItem label="审核时间:" v-show="stage == 2 || stage == 3" prop="PLATE_NUM">
          <Input :value="detail.H">
          </Input>
        </FormItem>
        <!--图片-->
        <FormItem label="标签" v-show="stage == 3" style="width:100%;" class="tag">
          <Button type="default">哈哈</Button>
          <Button type="default">上门服务</Button>
          <Button type="default">24小时服务</Button>
        </FormItem>
        <FormItem label="门店门头照:" v-show="stage == 1" prop="PLATE_NUM" style="width:100%;">
          <!--<img :src="detail.img">-->
          <!--<div style="width:45%;float:left;height:200px;background:pink;"></div>-->
          <!--<div style="width:45%;float:left;height:200px;background:blue;"></div>-->
        </FormItem>
        <FormItem label="门店工位照:" v-show="stage == 2" prop="PLATE_NUM" style="width:100%;">
          <!--<img :src="detail.img">-->
          <!--<div style="width:45%;float:left;height:200px;background:pink;"></div>-->
          <!--<div style="width:45%;float:left;height:200px;background:blue;"></div>-->
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary">审核</Button>
      </div>
    </Modal>
    <Modal
      v-model="checkModal"
      width="400px"
      heigh="100"
      :mask-closable="false"
      :scrollable="true"
      :transfer="false"
      :footer-hide="false"
      :transition-names="['', '']"
      title="勾选要删除的标签"
    >
      <div>
        <Form :label-width="90">
          <FormItem>
            <RadioGroup v-model="isOk">
              <Radio :label="true">
                <span>通过</span>
              </Radio>
              <Radio :label="false">
                <span>不通过</span>
              </Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="不通过原因:" v-show="!isOk">
            <Input :value="detail.A" type="textarea">
            </Input>
          </FormItem>
        </Form>
      </div>
      <div class="tag" v-show="false">
        <Button v-for="item in tagList" :type="item.checked ? 'primary' : 'default'"
                @click="item.checked = !item.checked">{{item.name}}
        </Button>
      </div>
    </Modal>
  </common-table>
</template>

<script>
  import commonTable from '@/hxx-components/common-table.vue'
  import ModalTitle from '@/hxx-components/modal-title.vue'

  export default {
    name: "tast-list",
    components: {commonTable, ModalTitle},
    data() {
      return {
        recordData: [],
        detail: {
          A: '上传门头照',
          B: '门店A',
          C: '待审核',
          D: '18358330864',
          E: '张三',
          F: '2019-04-13',
        },
        recordColumns: [
          {
            title: '序号', width: 100,
            render: (h, params) => h('span', (this.recordPage - 1) * this.recordLimit + params.index + 1)
          },
          {title: '审核状态', key: 'A', minWidth: 100},
          {title: '审核说明', key: 'B', minWidth: 100},
          {title: '审核人员', key: 'C', minWidth: 100},
          {title: '审核时间', key: 'D', minWidth: 100},
          {title: '服务人员账号', key: 'E', minWidth: 100},
          {title: '服务人员姓名', key: 'E', minWidth: 100},
          {title: '提交时间', key: 'F', minWidth: 100},
        ],
        recordTotal: 0,
        showRecord: false,
        recordPage: 1,
        recordLimit: 25,
        showModal: true,
        title: '上传门店头像',
        state: '门店:A',
        stage: 4,
        tableData: [],
        KEYWORD: '',
        ORDER_STATE: "请选择接单状态",
        tastStatus: "请选择任务",
        order_state_list: ["不可接单", "可接单", "已接单"],
        is_online_list: ["离线", "在线"],
        columns: [
          {
            title: '序号', width: 100,
            render: (h, params) => h('span', (this.page - 1) * this.limit + params.index + 1)
          },
          {title: '审核状态', key: 'A', width: 100},
          {title: '任务', key: 'B', width: 100},
          {title: '门店名称', key: 'C', minWidth: 100},
          {
            title: '操作', key: 'F', minWidth: 300, align: 'center',
            render: (h, params) => {
              let btn = [h('Button', {
                props: {type: 'primary', size: 'small'}, style: {marginLeft: "10px"}
              }, '查看提交记录')];
              if (true) btn.unshift(h('Button', {props: {type: 'primary', size: 'small'}}, '查看详情'));
              if (true) return h('div', btn)
            }
          },
        ],
        total: 0,
        page: 1,
        limit: 25,
        loading: false,
        showTable: false,
        checkModal: true,
        isOk: true,
        statusList: [
          {id: "请选择接单状态", name: '请选择接单状态'},
          {id: 0, name: '审核通过'},
          {id: 1, name: '审核不通过'},
          {id: 2, name: '待审核'},
          {id: 3, name: '无需审核'}
        ],
        tastList: [
          {id: "请选择任务", name: "请选择任务"},
          {id: 0, name: '请选择任务'},
          {id: 1, name: '上传门头照'},
          {id: 1, name: '上传工位照'},
          {id: 1, name: '门店标签'},
          {id: 1, name: '营业时间及工位数'},
          {id: 1, name: '好羞羞车生活推广'},
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
      this.showRecord = Math.random();
    },
    methods: {
      getList() {
        this.tableData = [
          {A: 1, B: 2, C: "门店A"},
          {A: 1, B: 2, C: "门店B"},
          {A: 1, B: 2, C: "门店C"},
          {A: 1, B: 2, C: "门店D"},
          {A: 1, B: 2, C: "门店E"},
        ];
      },
      getRecord() {
        this.recordData.push({
          A: '审核通过',
          B: '照片模糊',
          C: '17321492645',
          D: '2019-04-13 10:20:00',
          E: '18358330864',
          F: "陈狗",
          G: '2019-04-11'
        });
      },
      changePageSize(size) {
        this.limit = size;
        if (this.page == 1) this.getList();
      },
      changePage(page) {
        this.page = page;
        this.getList();
      },
      recordChangePageSize(size) {
        this.recordLimit = size;
        if (this.recordPage == 1) this.getRecord();
      },
      recordChangePage(page) {
        this.recordPage = page;
        this.getRecord();
      }
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
