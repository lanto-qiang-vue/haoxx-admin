<template>
  <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage"
                :total="total" :show="showTable" :clearSelect="clearType" :page="page" @onRowClick="onRowClick">
    <div slot="search">
      <div class="search-block">
        <Input placeholder="按名称搜索" v-model="KEYWORD"></Input>
      </div>
      <div class="search-block">
        <Select v-model="status" placeholder="请选择是否已上架">
          <Option v-for="(item, index) in statusList"
                  :key="index" :value="item.id">{{item.name}}
          </Option>
        </Select>
      </div>
      <div class="search-block">
        <Select v-model="bind" placeholder="是否为绑定车辆">
          <Option v-for="(item, index) in bindList"
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
    <div slot="operate">
      <Button type="primary" @click="checkModal=true;detail.id = ''">新增</Button>
      <Button type="info" :disabled="list == ''" @click="update">修改</Button>
    </div>
    <Modal
      v-model="checkModal"
      width="350px"
      heigh="100"
      :mask-closable="false"
      :scrollable="true"
      :transfer="false"
      :footer-hide="false"
      :transition-names="['', '']"
      title="产品信息"
    >
      <div>
        <Form :model="detail" ref="detail" :rules="rules">
          <FormItem prop="name">
            <Input v-model="detail.name" placeholder="请输入产品名称">
            </Input>
          </FormItem>
          <FormItem prop="detailVersion" label="是否详细版本:">
            <RadioGroup v-model="detail.detailVersion">
              <Radio label="是">
                <span>是</span>
              </Radio>
              <Radio label="否">
                <span>否</span>
              </Radio>
            </RadioGroup>
          </FormItem>
          <FormItem prop="bind" label="是否为绑定车辆:">
            <RadioGroup v-model="detail.bind">
              <Radio label="是">
                <span>是</span>
              </Radio>
              <Radio label="否">
                <span>否</span>
              </Radio>
            </RadioGroup>
          </FormItem>
          <FormItem prop="status" label="是否上架">
            <RadioGroup v-model="detail.status">
              <Radio label="是">
                <span>是</span>
              </Radio>
              <Radio label="否">
                <span>否</span>
              </Radio>
            </RadioGroup>
          </FormItem>
          <FormItem prop="price" label="单价:">
            <InputNumber :min="0" v-model="detail.price" @on-blur="change" placeholder="请输入产品单价" style="width:270px;">
            </InputNumber>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="checkModal=false">取消</Button>
        <Button type="primary" @click="submit">保存</Button>
      </div>
    </Modal>
  </common-table>
</template>
<script>
  import expandRow from './expand.vue'
  import commonTable from '@/hxx-components/common-table.vue'
  import {deepClone} from "../../libs/util";

  export default {
    name: "member-list",
    components: {commonTable},
    data() {
      return {
        list: '',
        status: '请选择是否已上架',
        bind: '是否为绑定车辆',
        statusList: [
          {id: '请选择是否已上架', name: '请选择是否已上架'},
          {id: 1, name: '是'},
          {id: 2, name: '否'}
        ],
        bindList: [
          {id: '是否为绑定车辆', name: '是否为绑定车辆'},
          {id: 1, name: '是'},
          {id: 2, name: '否'}
        ],
        detail: {
          bind: '是',
          status: '是',
          // code:'',
          name: '',
          id: '',
          detailVersion: '是',
          price: 0,
        },
        checkModal: false,
        tableData: [],
        columns: [
          {
            title: '序号', width: 70,
            render: (h, params) => h('span', (this.page - 1) * this.limit + params.index + 1)
          },
          {
            title: '名称', key: 'name', minWidth: 320,
            render: (h, params) => h('div', {
              on: {
                mouseenter: (event) => {
                  console.log(event);
                  // let a = event.target.firstChild.firstChild || 0;
                  // let b = 0;
                  // if(a) b = event.target.firstChild.firstChild.children[0].offsetWidth;
                  // if(event.target.offsetWidth > b)
                  // event.target.innerHTML = "22";
                    event.target.innerHTML = '<div class="ivu-tooltip" style="width: 100%;"><div class="ivu-tooltip-rel"><div style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis; max-width: 100%; display: inline-block; padding-top: 5px;">极简版</div></div> <!----></div>';
                }
              }
            }, [h('Tooltip', {
              class:'cnm',
              props: {content: params.row.name,transfer:true,"maxWidth":200},
              style: {width: "100%"}
            }, [h('div', {
              style: {
                overflow: 'hidden',
                whiteSpace: "nowrap",
                textOverflow: 'ellipsis',
                maxWidth: "100%",
                display: 'inline-block',
                paddingTop:"5px",
              },
            }, params.row.name)])])
          },
          {
            title: '是否上架', key: 'status', minWidth: 120,
            render: (h, params) => h('span', params.row.status ? '是' : '否')
          },
          {
            title: '是否为绑定车辆', key: 'bind', minWidth: 120,
            render: (h, params) => h('span', params.row.bind ? '是' : '否')
          },
          {
            title: '是否详细版本', key: 'detailVersion', minWidth: 140,
            render: (h, params) => h('span', params.row.detailVersion ? "是" : '否')
          },
          {title: '单价', key: 'price', minWidth: 140},
        ],
        rules: {
          name: {required: true, message: '产品名称必填'},
        },
        KEYWORD: '',
        code: '',
        total: 0,
        showTable: false,
        clearType: false,
        page: 1,
        limit: 25,
      }
    },
    mounted() {
      this.showTable = Math.random();
      this.getList();
    },
    watch: {
      checkModal(val) {
        if (val) this.$refs.detail.resetFields();
      }
    },
    methods: {
      update() {
        this.clearType = Math.random();
        let data = deepClone(this.list);
        this.list = '';
        data.detailVersion = data.detailVersion ? "是" : "否";
        data.bind = data.bind ? "是" : "否";
        data.status = data.status ? "是" : "否";
        data.price = parseFloat(data.price);
        this.detail = data;
        this.checkModal = true;
      },
      onRowClick(list) {
        this.list = list;
      },
      submit() {
        this.$refs.detail.validate(validator => {
          if (validator) {
            this.$Modal.confirm({
              title: '系统提示!',
              content: '确认保存吗?',
              onOk: () => {
                let data = deepClone(this.detail);
                data.detailVersion = data.detailVersion == "是" ? true : false;
                data.bind = data.bind == "是" ? true : false;
                data.status = data.status == "是" ? true : false;
                data.price = data.price.toFixed(2);
                let url;
                if (data.id) {
                  url = "/hxxdc/product/edit"
                } else {
                  url = "/hxxdc/product/add";
                }
                this.$fly.post(url, data).then(res => {
                  if (res.code == 0) {
                    this.$Message.success("保存成功");
                    this.getList();
                    this.checkModal = false;
                  }
                });
              }
            });

          } else {
            this.$Message.error("请校对必填字段!");
          }
        })
      },
      change() {
        if (!this.detail.price) {
          setTimeout(() => {
            this.detail.price = 0;
          }, 300);
        }
      },
      getList() {
        this.clearType = Math.random();
        this.$fly.post('/hxxdc/product/find', {
          status: this.status == '请选择是否已上架' ? null : (this.status == 1 ? true : false),
          bind: this.bind == '是否为绑定车辆' ? null : (this.bind == 1 ? true : false),
          name: this.KEYWORD,
          pageNo: this.page,
          pageSize: this.limit,
        }).then(res => {
          this.total = res.total;
          this.tableData = res.items;
        })
      },
      changePageSize(size) {
        this.limit = size;
        if (this.page == 1) this.getList();
      },
      changePage(page) {
        console.log("changePage");
        this.page = page;
        this.getList();
      }
    },
  }
</script>
<style>
  .common-table .ivu-table-cell-with-expand {
    height: 38px;
    line-height: 38px;
  }
</style>
<style scoped>

</style>
