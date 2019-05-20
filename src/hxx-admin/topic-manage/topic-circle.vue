<template>
  <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage"
                :total="total" :show="showTable" :page="page" :loading="loading" @onRowClick="onRowClick" :clearSelect="clearType">
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
    <div slot="operate">
      <Button type="primary" @click="checkModal=true">新增</Button>
      <Button type="primary" :disabled="!list" @click="checkModal=true,detail = deepClone(list),list = '',clearType = Math.random()">修改</Button>
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
        <Form :model="detail" ref="detail" :rules="rules">
          <FormItem prop="content">
            <Input v-model="detail.content" placeholder="请输入圈子名称">
            </Input>
          </FormItem>
          <FormItem prop="colour">
            <Input v-model="detail.colour" placeholder="支持RGB和十六进制。RGB支持第四位透明度参数">
            </Input>
          </FormItem>
          <FormItem prop="icon">
            <img :src="detail.icon ? detail.icon : '/img/no_img.32c20fc5.png'" style="width:200px;display:block;margin:0 auto;"/>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <div style="float:left;padding-right:10px;">
          <upload-img  actionUrl="/manage/sys/picture/upload?thumbnail=true"
                      @uploadSuccess="uploadSuccess"></upload-img>
        </div>
        <Button type="primary"  @click="submit(0)">保存并停用</Button>
        <Button type="primary" @click="submit(1)">保存并启用</Button>
      </div>
    </Modal>
  </common-table>
</template>
<script>
  import commonTable from '@/hxx-components/common-table.vue'
  import uploadImg from '@/hxx-components/upload-img.vue'
  import {deepClone} from "../../libs/util";
  export default {
    name: "topic-circle",
    components: {commonTable, uploadImg},
    data() {
      return {
        detail: {
          id:'',
          icon:'',
          content: '',
          colour: '',
          state:'',
        },
        rules: {
          content: {required: true, message: '必填'},
          colour: { validator: (rule, value, callback) => {
                   let s = value.toLowerCase();
                  if(s == ""){
                    callback();
                  }else{
                    //处理16进制...
                    if(/^#{0,1}[A-F|\d+]{6}$/.test(s)){
                      if(s.indexOf("#") > -1){

                      }else{
                        this.detail.colour = "#"+s;
                      }
                      callback();
                    }else if(/^rgb[a]{0,1}\([\d+]{1,3},[\d+]{1,3},[\d+]{1,3}(,0\.\d{1,2}){0,1}\)$|^[\d+]{1,3},[\d+]{1,3},[\d+]{1,3}(,0\.\d{1,2}){0,1}$/.test(s)){
                      let a = value.replace(/rgb[a]{0,1}\((\S+)\)/,'$1');
                      let b = a.split(",");
                      for(let i = 0;i<3;i++){
                        if(parseInt(b[i])> 255){
                          callback(new Error('请输入正确的色号'));
                        }
                      }
                      this.detail.colour = 'rgb('+ b.join(",") + ")";
                      callback();
                    }else{
                      callback(new Error('请输入正确的色号'));
                    }
                  }
              }, trigger: 'change,blur', required: true },
          icon: {required: true, message: '图片必填'}
        },
        showModal: true,
        tableData: [],
        KEYWORD: '',
        showTable: false,
        checkModal: false,
        baseUrl: '/poxy-shqx/',
        columns: [
          {
            title: '序号', width: 100,
            render: (h, params) => h('span', (this.page - 1) * this.limit + params.index + 1)
          },
          {title: '话题圈', key: 'content', minWidth: 100},
          {title: '创建人', key: 'createName', minWidth: 100},
          {title: '创建人角色', key: 'role', minWidth: 100},
          {title: '创建时间', key: 'createDate', width: 180},
          {
            title: '状态', key: 'state', minWidth: 100,
            render: (h, params) => h('span', this.stateHandler(params.row.state))
          },
          {title: '已发布话题', key: 'number', minWidth: 100},
          {
            title: '操作', key: 'F', width: 150, align: 'center',
            render: (h, params) => h('Button', {
              props: {type: 'default'}, on: {
                click: () => {
                  this.$Modal.confirm({
                    title: '系统提示', content: "确认" + (params.row.state == 1 ? "停用" : "启用") + '吗？', onOk: () => {
                      this.axios.request({
                        baseURL: this.baseUrl,
                        url: '/manage/topicmanage/updateState',
                        method: 'post',
                        params: {
                          access_token: this.$store.state.user.token,
                          state: params.row.state == 1 ? 0 : 1,
                          id: params.row.id
                        },
                      }).then(res => {
                        if (res.success) {
                          this.$Message.success("话题已" + (params.row.state == 1 ? "停用" : "启用"));
                          this.checkModal = false;
                          this.getList();
                        }
                      })
                    }
                  });
                }
              }
            }, params.row.state == 1 ? "停用" : "启用")
          }
        ],
        total: 0,
        page: 1,
        limit: 25,
        loading: false,
        clearType:false,
        typeStatus: '请选择状态',
        typeList: [
          {id: "请选择状态", name: '请选择状态'},
          {id: 1, name: '启用'},
          {id: 0, name: '禁用'},
        ],
        list:'',
      }
    },
    mounted() {
      this.showTable = Math.random();
      this.getList();
    },
    watch: {
      checkModal(type) {
        if (type) {
          this.$refs.detail.resetFields();
        }
      }
    },
    methods: {
      deepClone(resource){
        return deepClone(resource);
      },
      onRowClick(res){
        this.list = res;
      },
      submit(state) {
        this.$refs.detail.validate((validate) => {
          if (validate) {
            this.$Modal.confirm({
              title: '系统提示!',
              content: '确认保存吗',
              onOk: () => {
                this.detail.state = state;
                this.axios.request({
                  baseURL: this.baseUrl,
                  url: '/manage/topicmanage/saveOrUpdateTopic',
                  method: 'post',
                  params: {
                    access_token: this.$store.state.user.token,
                    data:this.detail,
                  },
                }).then(res => {
                  this.getList();
                  this.checkModal = false;
                  this.$Message.success("保存成功");
                })
              }
            });
          } else {
            this.$Message.error("请校验必填字段");
          }
        });
      },
      stateHandler(state) {
        switch (state) {
          case 0:
            return "禁用";
            break;
          case 1:
            return "启用";
            break;
        }
      },
      uploadSuccess(response) {
        if(response.success){
          this.detail.icon = response.data.path;
        }
      },
      getList() {
        this.loading = true;
        this.list = "";
        this.axios.request({
          baseURL: this.baseUrl,
          url: 'manage/topicmanage/getTopicList',
          method: 'post',
          params: {
            access_token: this.$store.state.user.token,
            keyWord: this.KEYWORD,
            limit: this.limit,
            page: this.page,
            state: this.typeStatus == "请选择状态" ? "" : this.typeStatus
          },
        }).then(res => {
          if (res.success) {
            this.total = res.total;
            this.tableData = res.data;
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
