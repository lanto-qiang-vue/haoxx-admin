<template>
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
    <Modal
      v-model="showModal"
      class="table-modal-detail full-height"
      width="100"
      heigh="100"
      :mask-closable="false"
      :scrollable="true"
      :transfer="false"
      :footer-hide="openName == 'list'"
      :transition-names="['', '']">
      <modal-title slot="header" :title="(openName == 'detail' ? '任务详情' : taskObject[type] +'提交记录')" :state="openName == 'list' ? storeName : ''" @clickBack="showModal=false"></modal-title>
      <common-table v-show="openName == 'list'" v-model="recordData" :columns="recordColumns"
                    @changePageSize="recordChangePageSize"
                    @changePage="recordChangePage"
                    :total="recordTotal" :show="showRecord" :page="recordPage">
        <div slot="search">
          <div class="search-block">
            <Input placeholder="会员账号/姓名" v-model="detailKeyword"></Input>
          </div>
          <ButtonGroup size="small">
            <Button type="primary" @click="recordPage=1;getRecord()">
              <Icon type="ios-search" size="24"/>
            </Button>
          </ButtonGroup>
        </div>
      </common-table>
      <!--门头照-->
      <Form :label-width="140" v-show="openName == 'detail'" class="form-3">
        <FormItem label="任务名称:" prop="PLATE_NUM">
          <Input :value="title" readonly>
          </Input>
        </FormItem>
        <FormItem label="门店:" prop="PLATE_NUM">
          <Input :value="detail.shopName" readonly>
          </Input>
        </FormItem>
        <FormItem label="审核状态:" v-show="stage == 1 || stage == 2 || stage == 3" prop="PLATE_NUM">
          <Input :value="statusObject[detail.status] || ''" readonly>
          </Input>
        </FormItem>
        <FormItem label="服务人员账号:" prop="PLATE_NUM">
          <Input :value="detail.createdAn" readonly>
          </Input>
        </FormItem>
        <FormItem label="服务人员姓名:" prop="PLATE_NUM">
          <Input :value="detail.createdBy" readonly>
          </Input>
        </FormItem>
        <FormItem label="任务完成时间:" v-show="stage == 4" prop="PLATE_NUM">
          <Input :value="detail.modifiedDate" readonly>
          </Input>
        </FormItem>
        <FormItem label="任务提交时间:" v-show="stage == 1 || stage == 2 || stage == 3" prop="PLATE_NUM">
          <Input :value="detail.createdDate" readonly>
          </Input>
        </FormItem>
        <FormItem label="营业时间:" v-show="stage == 4" prop="PLATE_NUM">
          <Input :value="businessTime" readonly>
          </Input>
        </FormItem>
        <FormItem label="工位总数:" v-show="stage == 4" prop="PLATE_NUM">
          <span>{{workDetail}}</span>
        </FormItem>
        <FormItem label="审核人员账号:" v-show="stage == 3" prop="PLATE_NUM">
          <Input :value="detail.modifiedAn" readonly>
          </Input>
        </FormItem>
        <FormItem label="审核人:" v-show="stage == 2 && detail.status == 'pass'" prop="PLATE_NUM">
          <Input :value="detail.modifiedAn" readonly>
          </Input>
        </FormItem>
        <FormItem label="审核时间:" v-show="(stage == 2 || stage == 3) && detail.status == 'pass'" prop="PLATE_NUM">
          <Input :value="detail.modifiedDate" readonly>
          </Input>
        </FormItem>
        <!--图片-->
        <FormItem label="标签:" v-show="stage == 3" style="width:100%;" class="tag">
          <Button type="default" v-for="item in detail.tagJson">{{item.tag}}</Button>
        </FormItem>
        <FormItem label="门店门头照:" v-show="stage == 1" prop="PLATE_NUM" style="width:33%">
          <img :src="detail.picUrl" style="max-width:100%;max-height:300px;">
          <!--<div style="width:45%;float:left;height:200px;background:pink;"></div>-->
          <!--<div style="width:45%;float:left;height:200px;background:blue;"></div>-->
        </FormItem>
        <FormItem label="门店工位照:" v-show="stage == 2" prop="PLATE_NUM" style="width:100%;">
          <img v-for="item in imgList" style="max-width:33%;margin-left:10px;max-height:400px;" :src="item">
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="checkModal=true" v-show="canShow">审核</Button>
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
      :title="stage == 3 ? '勾选要删除的标签' : '审核' "
    >
      <div v-show="stage != 3">
        <Form :label-width="100" :model="failData" ref="failData" :rules="failRule">
          <FormItem>
            <RadioGroup v-model="isOk">
              <Radio label="pass">
                <span>通过</span>
              </Radio>
              <Radio label="fail">
                <span>不通过</span>
              </Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="不通过原因:" v-show="isOk == 'fail'" prop="reason">
            <Input v-model="failData.reason" type="textarea">
            </Input>
          </FormItem>
        </Form>
      </div>
      <div class="tag" v-show="stage == 3">
        <Button v-for="item in tagList" :type="item.checked ? 'primary' : 'default'"
                @click="item.checked = !item.checked">{{item.tag}}
        </Button>
      </div>
      <div slot="footer">
        <Button @click="checkModal=false">取消</Button>
        <Button type="primary" @click="check">保存</Button>
      </div>
    </Modal>
  </common-table>
</template>
<script>
  import commonTable from '@/hxx-components/common-table.vue'
  import ModalTitle from '@/hxx-components/modal-title.vue'
  import {deepClone} from "../../libs/util";

  export default {
    name: "tast-list",
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
              if (true) return h('div', btn)
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

      this.getList();
      // this.showRecord = Math.random();
    },
    watch: {
      checkModal(val) {
        if (val && this.stage == 3) {
          this.tagList = [];
          let data = this.detail.tagJson;
          for (let i in data) {
            if (!data[i].status) this.tagList.push({tag: data[i].tag, status: data[i].status, checked: false});
          }
        }
        this.$refs.failData.resetFields();
      }
    },
    computed: {
      canShow() {
        switch (this.stage) {
          case 1:
          case 2:
            console.log(this.detail.status);
            if (this.detail.status != 'pass' && this.detail.status != 'no_need') {
              return true;
            } else {
              return false;
            }
            break;
          case 3:
            for (let i in this.detail.tagJson) {
              if (!this.detail.tagJson[i].status) return true;
            }
            return false;
            break;
          case 4:
            return false;
            break;
        }
      }
    },
    methods: {
      getDetail(val){
          switch (val) {
            case 1:
              this.title = "上传门头照";
              this.$fly.get('shop/daq/hxx_mgt/headpic/' + this.id).then(res => {
                this.detail = res;
              })
              break;
            case 2:
              this.title = "上传工位照";
              this.$fly.get('/shop/daq/hxx_mgt/stationpic/' + this.id).then(res => {
                if (res.picUrl) this.imgList = res.picUrl.split(",");
                this.detail = res;
              })
              break;
            case 3:
              this.$fly.get('/shop/daq/hxx_mgt/servetag/' + this.id).then(res => {
                this.title = "门店特色与优势";
                res.tagJson = JSON.parse(res.tagJson);
                this.detail = res;
              });
              break;
            case 4:
              this.title = "营业时间及工位数";
              this.$fly.get('/shop/daq/hxx_mgt/otherattr/' + this.id).then(res => {
                if (res.attrJson) {
                  let data = JSON.parse(res.attrJson);
                  console.log(JSON.stringify(data));
                  this.businessTime = data.openHours.start + "～" + data.openHours.end;
                  let a = parseInt(data.stationNum.washing);
                  let b = parseInt(data.stationNum.lifting);
                  let c = parseInt(data.stationNum.varnishing);
                  let d = a + b + c;
                  this.workDetail = '工位总数' + d + "(" + "洗车工位数:" + a + ",举升机工位数:" + b + ",烤漆房数:" + c + ")";
                }
                this.detail = res;
              });
              break;
          }
      },
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
          console.log("获取返回值",res);
          if (res.content) {
            this.tableData = res.content;
            this.total = res.totalElements;
            this.showTable = Math.random();
          }
          console.log("tableData",this.tableData);
        })
      },
      getRecord() {
        this.$fly.get('/shop/dap-review/hxx_mgt/log/query', {
          params: {
            shopNo: this.id,
            size: this.recordLimit,
            page: this.recordPage - 1,
            accInfo: this.detailKeyword,
            type: this.type,
          }
        }).then(res => {
          this.recordData = res.content;
          this.recordTotal = res.totalElements;
        });
      },
      check() {
        if (this.isOk != 'pass' && this.stage != 3) {
          this.$refs.failData.validate(validate => {
            if (validate) {
              this.checkPatch();
            } else {
              this.$Message.error('请校验必填字段');
            }
          });
        } else {
          this.checkPatch();
        }
      },
      checkPatch() {
        //算了共用吧
        let url;
        let params = {
          "shopNo": this.detail.shopNo,
          "status": this.isOk,
          "description": '',
        };
        switch (this.stage) {
          case 1:
            url = '/shop/dap-review/hxx_mgt/headpic/' + this.id + '/status';
            break;
          case 2:
            url = "/shop/dap-review/hxx_mgt/stationpic/" + this.id + "/status";
            break;
          case 3:
            url = "/shop/dap-review/hxx_mgt/servetag/" + this.id + "/status";
            let tag = [];
            for (let i in this.tagList) {
              if (!this.tagList[i].checked) {
                tag.push({tag: this.tagList[i].tag, status: this.tagList[i].status});
              }
            }
            for (let i in this.detail.tagJson) {
              if (this.detail.tagJson[i].status) tag.push(this.detail.tagJson[i]);
            }
            params.tagJson = JSON.stringify(tag)
            break;
        }
        if (this.isOk != 'pass') {
          params.description = this.failData.reason;
        }
        this.$Modal.confirm({
          title: '系统提示',
          content: '确认提交吗?',
          onOk: () => {
            //patch ->put
            this.$fly.put(url, params).then(res => {
              if(res && !res.code){
                this.showModal = false;
                this.checkModal = false;
                this.getList();
              }
              //坐等同一处理....
            })
          }
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
