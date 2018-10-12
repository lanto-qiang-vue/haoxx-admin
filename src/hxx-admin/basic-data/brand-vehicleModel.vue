<!--车型-->
<template>
  <div style="width:100%;height:100%;">
    <Split v-model="split" :min="0.1" :max="0.5" class="split">
      <div slot="left" class="split-pane">
        <Input v-model="treeKEYWORD" placeholder="品牌/厂商/车型名称..." icon="md-refresh"
               class="tree-input" @on-click="refresh" @on-change="selectKeyword"></Input>
        <div v-show="isShow">
          <Tree :data="treeData1" v-show="selectShow" class="vehicle-tree" @on-select-change="select"
                @on-toggle-expand="qh1"></Tree>
          <Tree :data="treeData" v-show="!selectShow" class="vehicle-tree" @on-select-change="select"
                @on-toggle-expand="qh1"></Tree>
        </div>
        <div v-show="!isShow">
          <Tree :data="nxzj" class="vehicle-tree" @on-select-change="select" @on-toggle-expand="qh2"></Tree>
        </div>
        <Spin size="large" fix v-if="spinShow"></Spin>
      </div>
      <div slot="right" class="split-pane">
        <common-table v-model="tableData" :columns="columns" :total="total" :show="showTable" :showSearch="false"
                      @changePage="changePage" @changePageSize="changePageSize" @onRowClick="onRowClick">
          <div slot="operate">
            <Input v-model="KEYWORD" placeholder="车型名称..." style="width: 300px"></Input>
            <Button type="primary" @click="page=1;getList()">
              <Icon type="ios-search" size="24"/>
            </Button>
            <Button style="float:right;" type="info" @click="importBrand">导出</Button>
            <Button style="float:right;" type="success" @click="uploadBrand">导入</Button>
            <Button style="float:right;" :disabled="cando" type="primary" @click="add">新增</Button>
            <Button style="float:right;" type="primary" @click="addBrand">新增品牌车系</Button>
          </div>
        </common-table>
      </div>
    </Split>
    <Modal
      v-model="showModal"
      class="table-modal-detail"
      title="品牌车系"
      width="90"
      :mask-closable="false"
      @on-visible-change="visibleChange"
      :scrollable="true"
      :transfer="false"
      :footer-hide="false"
      :transition-names="['', '']">
      <Collapse v-model="value1">
        <Panel name="1">
          基本信息
          <Form slot="content" :model="formData" ref="formData" :rules="rules" :label-width="120" class="common-form">
            <FormItem label="品牌:" style="width:45%;" prop="MODEL_NAME">
              <Input v-model="formData.MODEL_NAME" type="text"> </Input>
            </FormItem>
            <FormItem label="国产/进口:" style="width:45%;" prop="JK_NAME">
              <Select v-model="formData.JK_NAME">
                <Option v-for="(item, index) in statusList"
                        :key="index" :value="item.name">{{item.name}}
                </Option>
              </Select>
            </FormItem>
            <FormItem label="车系名称:" style="width:95%;" prop="TTYPE_NAME">
              <Input v-model="formData.TTYPE_NAME"></Input>
            </FormItem>
          </Form>
        </Panel>
      </Collapse>
      <div style="height:60px;"></div>
      <div slot="footer">
        <Button @click="addcancle()">取消</Button>
        <Button type="primary" @click="addpost('formData')">保存</Button>
      </div>
    </Modal>
    <!--详情新增-->
    <Modal
      v-model="showModal2"
      class="table-modal-detail"
      title="品牌车型"
      width="90"
      :mask-closable="false"
      @on-visible-change="visibleChange"
      :scrollable="true"
      :transfer="false"
      :footer-hide="false"
      :transition-names="['', '']">
      <Collapse v-model="value1">
        <Panel name="1">
          添加车型基本信息
          <Form slot="content" :model="formData2" ref="formData2" :rules="rules2" :label-width="120"
                class="common-form">
            <FormItem label="车型:" style="width:90%;" prop="MODEL_NAME">
              <Input v-model="formData2.MODEL_NAME" type="text"> </Input>
            </FormItem>
            <FormItem label="国产/进口:" style="width:30%;" prop="JK_NAME">
              <Select v-model="formData2.JK_NAME">
                <Option v-for="(item, index) in statusList"
                        :key="index" :value="item.name">{{item.name}}
                </Option>
              </Select>
            </FormItem>
            <FormItem label="车系名称:" style="width:30%;" prop="TTYPE_NAME">
              <Input v-model="formData2.CX_NAME"></Input>
            </FormItem>
            <FormItem label="车系上市时间:" style="width:30%;" prop="TTYPE_NAME">
              <Input v-model="formData2.SXSJ"></Input>
            </FormItem>
            <FormItem label="车系停产时间:" style="width:30%;" prop="TTYPE_NAME">
              <Input v-model="formData2.TCSJ"></Input>
            </FormItem>
            <FormItem label="年款:" style="width:30%;" prop="TTYPE_NAME">
              <Input v-model="formData2.PRODUCE_YEAR"></Input>
            </FormItem>
            <FormItem label="市场指导价:" style="width:30%;" prop="TTYPE_NAME">
              <InputNumber
                style="width:100%;"
                :min="0"
                v-model="formData2.SCZDJ"
                :parser="value => value.replace('公里', '')"></InputNumber>
            </FormItem>
            <FormItem label="车款上市时间:" style="width:30%;" prop="TTYPE_NAME">
              <Input v-model="formData2.CKSSSJ"></Input>
            </FormItem>
            <FormItem label="车款停产时间:" style="width:30%;" prop="TTYPE_NAME">
              <Input v-model="formData2.CKTCSJ"></Input>
            </FormItem>
            <FormItem label="排量(L):" style="width:30%;" prop="TTYPE_NAME">
              <Input v-model="formData2.PLL"></Input>
            </FormItem>
            <FormItem label="排量(CC):" style="width:30%;" prop="TTYPE_NAME">
              <Input v-model="formData2.PLCC"></Input>
            </FormItem>
            <FormItem label="发动机:" style="width:30%;" prop="TTYPE_NAME">
              <Input v-model="formData2.FDJ"></Input>
            </FormItem>
            <FormItem label="变速器:" style="width:30%;" prop="TTYPE_NAME">
              <Input v-model="formData2.BSQ"></Input>
            </FormItem>
            <FormItem label="驱动方式:" style="width:30%;" prop="TTYPE_NAME">
              <Input v-model="formData2.QDFS"></Input>
            </FormItem>
            <FormItem label="燃油形式:" style="width:30%;" prop="TTYPE_NAME">
              <Input v-model="formData2.RYXS"></Input>
            </FormItem>
            <FormItem label="是否增压:" style="width:30%;" prop="TTYPE_NAME">
              <Input v-model="formData2.SFZY"></Input>
            </FormItem>
            <FormItem label="功率:" style="width:30%;" prop="TTYPE_NAME">
              <Input v-model="formData2.GL"></Input>
            </FormItem>
          </Form>
        </Panel>
      </Collapse>
      <div style="height:60px;"></div>
      <div slot="footer">
        <Button @click="addcancle2()">取消</Button>
        <Button type="primary" @click="addpost2('formData2')">保存</Button>
      </div>
    </Modal>
    <upload-excel :type="uploadShow" :downUrl="'/common/basedata/vehiclemodel/downloadTemple'" :actionUrl="'/manage/basedata/vehiclemodel/doImport'" :title="'品牌车型数据导入'" :description="description" :success="'success'" @success="uploadSuccess"></upload-excel>
  </div>
</template>

<script>
  import commonTable from '@/hxx-components/common-table.vue'
  import uploadExcel from '@/hxx-components/upload-excel.vue'
  import {deepClone} from '@/libs/util.js'
  import env from '_conf/url'

  export default {
    name: "brand-vehicleModel",
    props: ['show'],
    data() {
      return {
        split: 0.2,
        value1: '1',
        uploadShow:false,
        tableData: [],
        treeData1: [],
        spinShow: false,
        selectShow: false,
        showModal2: false,
        selectType: 0,
        selectId: 0,
        description:[{des:'1、点击“浏览”按钮，找到您所要导入的Excel文件,”;'},{des:'2、选择好文件后, 点“确定”按钮完成导入。'}],
        baseUrl: '',
        formData: {
          MODEL_NAME: '',
          JK_NAME: '进口',
          TTYPE_NAME: '',
        },
        formData2: {
          "MODEL_NAME": "",
          "JK_NAME": "",
          "CX_NAME": "",
          "SXSJ": "",
          "TCSJ": "",
          "PRODUCE_YEAR": "",
          "SCZDJ":0,
          "CKSSSJ": "",
          "CKTCSJ": "",
          "PLL": "",
          "PLCC": "",
          "FDJ": "",
          "BSQ": "",
          "QDFS": "",
          "RYXS": "",
          "SFZY": "",
          "GL": ""
        },
        rules: {
          MODEL_NAME: [{required: true, message: '品牌必填', blur: 'change.blur'}],
          JK_NAME: [{required: true}],
          TTYPE_NAME: [{required: true, message: '车系名称必填'}]
        },
        rules2: {
          MODEL_NAME: [{required: true, message: '品牌车型必填', blur: 'change.blur'}],
          JK_NAME: [{required: true}],
        },
        showModal: false,
        nxzj: [{title: '所有厂家/品牌/车系', id: 0, children: [{title: '快成一道闪电'}]}],
        isShow: true,
        columns: [
          {title: '序号', minWidth: 70,
            render: (h, params) => h('span', (this.page-1)*this.limit+params.index+1 )
          },
          {
            title: '车型', key: 'MODEL_NAME', minWidth: 300,
            render: (h, params) => {
              return h('span', {
                class: {'ivu-tree-title': true},
                domProps: {
                  innerHTML: this.highLight(params.row.MODEL_NAME, this.KEYWORD)
                }
              })
            }
          },
          {title: '品牌', key: 'PP_NAME', minWidth: 120},
          {title: '国产/进口', key: 'JK_NAME', minWidth: 100},
          {title: '厂商', key: 'CS_NAME', minWidth: 150},
          {title: '车系名称', key: 'CX_NAME', minWidth: 150},
          {
            title: '市场指导价', key: 'SCZDJ', minWidth: 130,
            render: (h, params) => h('span', params.row.SCZDJ + '.00')
          },
          {title: '发动机', key: 'FDJ', minWidth: 100},
          {title: '变速器', key: 'BSQ', minWidth: 160},
          {title: '驱动方式', key: 'QDFS', minWidth: 120},
        ],
        treeData: [],
        treeDefault: [],
        page: 1,
        limit: 25,
        total: 0,
        KEYWORD: '',
        treeKEYWORD: '',
        showTable: false,
        timer: null,
        render: false
      }
    },
    watch: {
      show() {
        // this.showTable = Math.random()
      }
    },
    computed: {
      statusList() {
        return [{name: '进口'}, {name: '国产'}]
      },
      cando() {
        return this.selectType != 12 || this.selectId < 1;
      }
    },
    mounted() {
      this.showTable = Math.random();
      this.baseUrl = env;
      this.getTree()
      this.getList()
    },
    methods: {
      uploadSuccess(res){
        if(res.success == true){
          let flag = res.data.errorList ? true : false;
          if(flag && res.data.errorList.length > 0){
            let content = "";
            let data = res.data.errorList;
            for(let i in data){
              content += "<div>第"+data[i].rowNum+ "行" + data[i].errorMsg +"</div> ";
            }
            this.$Modal.error({title:'导入错误提示',content:content,width:600});
          }else{
            this.$Message.success('批量导入成功');
            this.uploadShow = false;
            this.getTree();
            this.getList();
          }
        }else{
          this.$Modal.error({title:'系统提示',content:res.Exception.message});
        }
      },
      addcancle2() {
        this.showModal2 = false;
      },
      addpost2(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$Modal.confirm({
              title: '系统提示',
              content: '确认保存吗?',
              onOk: this.save2,
            });
          } else {
            this.$Message.error("请校对红框信息");
          }
        })
      },
      save2(){
        this.axios.request({
          url: '/manage/basedata/vehiclemodel/save',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            data: JSON.stringify(this.formData2),
            model_id:this.selectId
          }
        }).then(res => {
          if (res.success === true) {
            this.$Message.success("新增成功");
            this.showModal2 = false;
            this.getList();
          }
        })
      },
      refresh() {
        this.getTree();
      },
      addcancle() {
        this.showModal = false;
      },
      addpost(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$Modal.confirm({
              title: '系统提示',
              content: '确认保存吗?',
              onOk: this.save,
            });
          } else {
            this.$Message.error("请校对红框信息");
          }
        })
      },
      save() {
        this.axios.request({
          url: '/manage/basedata/vehiclemodel/ppsave',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            data: JSON.stringify(this.formData),
          }
        }).then(res => {
          if (res.success === true) {
            this.$Message.success("新增成功");
            this.showModal = false;
            this.refresh();
          }
        })
      },
      visibleChange() {
      },
      add() {
        this.showModal2 = true;
        for (let i in this.formData2) {
          this.formData2[i] = "";
        }
        this.formData2.SCZDJ = 0;
        this.formData2.JK_NAME = "进口";
      },
      addBrand() {
        this.$refs['formData'].resetFields();
        this.showModal = true;
      },
      uploadBrand() {
        this.uploadShow = Math.random();
      },
      importBrand() {
        window.location.href = this.baseUrl + "/manage/basedata/vehiclemodel/doExport?access_token=" + this.$store.state.user.token + "&KEYWORD=" + this.KEYWORD;
      },
      qh1(data) {
        if (data.nodeKey == 0) {
          this.treeData[0].expand = true;
          if (this.treeData1[0]) {
            this.treeData1[0].expand = true;
          }
          this.isShow = false;
        }
      },
      qh2(data) {
        if (data.nodeKey == 0) {
          this.nxzj[0].expand = false;
          this.isShow = true;
        }
      },
      getList() {
        this.axios.request({
          url: '/manage/basedata/vehiclemodel/list',
          method: 'post',
          data: {
            KEYWORD: this.KEYWORD,
            mdtype: this.selectType,
            mdid: this.selectId,
            page: this.page,
            limit: this.limit,
            access_token: this.$store.state.user.token
          }
        }).then(res => {
          if (res.success === true) {
            this.tableData = res.data
            this.total = res.total
          }
        })
      },
      getTree() {
        this.spinShow = true;
        this.axios.request({
          url: '/manage/basedata/vehiclemodel/tree',
          method: 'post',
          data: {
            node: 0,
            access_token: this.$store.state.user.token
          }
        }).then(res => {
          if (res.success === true) {
            this.treeDefault = res.data;
            this.filterCompnay();
            this.spinShow = false;
          }
        })
      },
      selectKeyword() {
        this.search();
      },
      search() {
        this.filterCompnay();
      },
      filterCompnay() {
        let data = {};
        let mydata = [];
        console.log(JSON.stringify(data));
        for (let i in this.treeDefault) {
          let parentId = this.treeDefault[i].parentId;
          let flag = data[parentId] ? true : false;
          if (!flag) {
            data[parentId] = [];
          }
          switch (this.treeDefault[i].type) {
            case 10:
              data[parentId].push({
                title: this.treeDefault[i].text,
                id: this.treeDefault[i].id,
                parentId: this.treeDefault[i].parentId,
                type: this.treeDefault[i].type,
              });
              break;
            case 11:
              data[parentId].push({
                title: this.treeDefault[i].jkName + "-" + this.treeDefault[i].text,
                id: this.treeDefault[i].id,
                parentId: this.treeDefault[i].parentId,
                type: this.treeDefault[i].type,
              });
              break;
            case 12:
              if (this.treeKEYWORD == "" || this.treeKEYWORD == " ") {
                data[parentId].push({
                  title: this.treeDefault[i].text,
                  id: this.treeDefault[i].id,
                  parentId: this.treeDefault[i].parentId,
                  type: this.treeDefault[i].type,
                });
              } else {
                if (this.treeDefault[i].text.indexOf(this.treeKEYWORD.toLocaleUpperCase()) > -1) {
                  data[parentId].push({
                    title: this.highLight(this.treeDefault[i].text, this.treeKEYWORD.toLocaleUpperCase()),
                    id: this.treeDefault[i].id,
                    parentId: this.treeDefault[i].parentId,
                    render: this.renderTree,
                    type: this.treeDefault[i].type,
                  })
                }
              }
              break;
          }
        }
        let newData = data[0];
        //二次过滤...
        for (let i in newData) {
          //三次过滤...
          let store = data[newData[i].id];
          let st = [];
          for (let a in store) {
            if (data[store[a].id].length > 0) {
              if (store[a].title.indexOf(this.treeKEYWORD.toLocaleUpperCase()) > -1 && this.treeKEYWORD != "" && this.treeKEYWORD != " ") {
                st.push({
                  title: this.highLight(store[a].title, this.treeKEYWORD.toLocaleUpperCase()),
                  id: store[a].id,
                  parentId: store[a].parentId,
                  render: this.renderTree,
                  children: data[store[a].id],
                  type: store[a].type,
                })
              }
              else {
                st.push({title: store[a].title, children: data[store[a].id], id: store[a].id, type: store[a].type,});
              }
            } else {
              if (store[a].title.indexOf(this.treeKEYWORD.toLocaleUpperCase()) > -1 && this.treeKEYWORD != "" && this.treeKEYWORD != " ") {
                st.push({
                  title: this.highLight(store[a].title, this.treeKEYWORD.toLocaleUpperCase()),
                  id: store[a].id,
                  parentId: store[a].parentId,
                  render: this.renderTree,
                  children: [],
                  type: store[a].type,
                })
              }
            }
          }
          if (st.length > 0) {
            if (newData[i].title.indexOf(this.treeKEYWORD.toLocaleUpperCase()) > -1 && this.treeKEYWORD != "" && this.treeKEYWORD != " ") {
              mydata.push({
                title: this.highLight(newData[i].title, this.treeKEYWORD.toLocaleUpperCase()),
                id: newData[i].id,
                children: st,
                render: this.renderTree,
                type: newData[i].type,
              })
            } else {
              mydata.push({title: newData[i].title, id: newData[i].id, children: st, type: newData[i].type,})
            }
          } else {
            if (newData[i].title.indexOf(this.treeKEYWORD.toLocaleUpperCase()) > -1 && this.treeKEYWORD != "" && this.treeKEYWORD != " ") {
              mydata.push({
                title: this.highLight(newData[i].title, this.treeKEYWORD.toLocaleUpperCase()),
                id: newData[i].id,
                children: [],
                render: this.renderTree,
                type: newData[i].type
              })
            }
          }
        }
        let tree = {title: '所有厂家/品牌/车系', id: 0, children: mydata, expand: true, type: 0};
        if (this.treeKEYWORD == "" || this.treeKEYWORD == " ") {
          this.treeData = [tree];
          this.selectShow = false;
        } else {
          this.treeData1 = [tree];
          this.selectShow = true;
        }
      },
      renderTree(h, {root, node, data}) {
        // console.log(data)
        return h('span', {
          class: {'ivu-tree-title': true},
          domProps: {
            innerHTML: data.title
          },
          on: {
            click: () => {
              this.select(data, root, node)
            }
          },
        })
      },
      changePage(page) {
        this.page = page
        this.getList()
      },
      changePageSize(size) {
        this.limit = size
        this.getList()
      },
      onRowClick(row, index) {
        console.log('row：', row);
        this.$emit('onRowClick', row, index);
      },
      select(data) {
        let flag = (data.id && data.type) ? true : false;
        if (data.length > 0) {
          this.selectType = data[0].type;
          this.selectId = data[0].id;
        }
        if(flag){
          this.selectType = data.type;
          this.selectId = data.id;
        }
        this.getList();
      },
      highLight(text, words, tag) {
        tag = tag || 'span';
        let re = new RegExp(words, 'gi');
        if (re.test(text)) {
          text = text.replace(re, '<' + tag + ' class="highlight">$&</' + tag + '>');
        }
        return text;
      }
    },
    components: {commonTable,uploadExcel},
  }
</script>

<style scoped lang="less">
  .split {
    border: 1px solid #dcdee2;
    background-color: white;
    .split-pane {
      padding: 10px;
      height: 100%;
      overflow: auto;
      position: relative;
      .tree-search {
        padding: 15px;
        border-radius: 3px;
      }
      .tree-input {
        z-index: 1;
      }
      .vehicle-tree {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        padding: 50px 0 10px 10px;
        overflow: hidden;
      }
    }
  }
</style>
<style lang="less">
  .vehicle-tree {
    > .ivu-tree-children {
      height: 100%;
      overflow: auto;
    }
    .highlight {
      color: red;
    }
  }

  .ivu-input-number-input {
    height: 30px;
  }

  .ivu-tree-title .highlight {
    color: red;
  }
</style>

