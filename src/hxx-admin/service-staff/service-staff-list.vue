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
      <ButtonGroup size="small">
        <Button type="primary" @click="page=1;getList()">
          <Icon type="ios-search" size="24"/>
        </Button>
      </ButtonGroup>
    </div>
    <div slot="operate">
      <Button type="primary" @click="add">新增</Button>
      <!--<input type="file" @change="getImg('TENANT_FILE_PATH', $event)">-->
    </div>
    <Modal v-model="showModal" title="新增" :width="680" :mask-closable="false">
      <!--stage == 1 成功应该提交的-->
      <Form ref="formData" :rules="rule" :model="formData" :label-width="80" class="common-form">
        <FormItem label="姓名" prop="nickname">
          <Input v-model="formData.nickname"></Input>
        </FormItem>
        <FormItem label="手机号" prop="username">
          <Input v-model="formData.username"></Input>
        </FormItem>
        <FormItem label="工号" prop="work_number">
          <Input v-model="formData.work_number"></Input>
        </FormItem>
        <FormItem label="职位" prop="title">
          <Input v-model="formData.title"></Input>
        </FormItem>
        <FormItem label="证件照" prop="img64" style="width:300px;">
          <div
            style="width:200px;height:200px;background:pink;background:url('/img/no_img.32c20fc5.png');background-size:100%;">
            <img v-show="formData.img64" :src="formData.img64" style="width:200px;height:200px;">
          </div>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary">
          <Upload
            ref="upload"
            :before-upload="beforeUpload"
            :on-success="uploadSuccess"
            :show-upload-list="false"
            :data="token"
            :max-size="2048"
            name="file"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            :format="['jpg','jpeg','png']"
            accept="image/png,image/jpeg"
            :action="baseUrl+actionUrl">
            选择证件照
          </Upload>
        </Button>
        <Button @click="showModal=false">取消</Button>
        <Button type="primary" @click="submit">保存</Button>
      </div>
    </Modal>
    <!--修改特例-->
    <Modal v-model="updateModal" title="新增" :width="680" :mask-closable="false">
      <!--stage == 1 成功应该提交的-->
      <Form ref="updateData" :rules="updateRule" :model="updateData" :label-width="80" class="common-form">
        <FormItem label="姓名" prop="name">
          <Input v-model="updateData.name"></Input>
        </FormItem>
        <FormItem label="分组" prop="group">
          <Select v-model="updateData.group" placeholder="请选择分组">
            <Option v-for="(item, index) in groupList"
                    :key="index" :value="item.code">{{item.name}}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="证件照" prop="img64" style="width:300px;">
          <div
            style="width:200px;height:200px;background:pink;background:url('/img/no_img.32c20fc5.png');background-size:100%;">
            <img v-show="updateData.img64" :src="updateData.img64" style="width:200px;height:200px;">
          </div>
        </FormItem>
      </Form>
      <div slot="footer">
        <input v-show="false" ref="changImg" type="file" @change="getImg($event)">
        <Button type="primary" @click="$refs.changImg.click();">选择证件照</Button>
        <Button @click="updateModal=false">取消</Button>
        <Button type="primary" @click="updateSubmit">保存</Button>
      </div>
    </Modal>
  </common-table>
</template>

<script>
  import commonTable from '@/hxx-components/common-table.vue'
  import {getDictGroup, imgToBase64, reg} from "../../libs/util";
  import env from '_conf/url'

  export default {
    name: "service-staff-list",
    components: {commonTable},
    data() {
      return {
        updateModal: false,
        updateRule: {
          name: {required: true, message: '姓名必填'},
          img64: {required: true, message: '证件照必填'},
        },
        updateData: {
          name: '修改姓名',
          group: '',
          userid: '',
          img64: '',
        },
        groupList: [],
        updateFile: '',
        file: '',
        token: {
          access_token: '',
        },
        baseUrl: '',
        actionUrl: '/manage/person/insertOperate',
        formData: {
          img64: '',
          nickname: '',
          work_number: '',
          username: '',
          title: '',
        },
        showModal: false,
        tableData: [],
        rule: {
          nickname: {required: true, message: '必填'},
          username: {required: true, message: '必填', pattern: reg.mobile},
          work_number: {required: true, message: '必填'},
          title: {required: true, message: '必填'},
          img64: {required: true, message: '必填'}
        },
        KEYWORD: '',
        ORDER_STATE: "请选择接单状态",
        order_state_list: ["不可接单", "可接单", "已接单"],
        is_online_list: ["离线", "在线"],
        columns: [
          {
            title: '序号', width: 100,
            render: (h, params) => h('span', (this.page - 1) * this.limit + params.index + 1)
          },
          {title:'工号',width:150,key:'work_number'},
          {
            title: '会员账号', key: 'username', width: 200,
            render: (h, params) => h('a', {
              on: {
                click: () => {
                  this.$router.push({path: '/daily-count', query: {id: params.row.username}})
                }
              }
            }, params.row.username)
          },
          {
            title: '照片', key: 'pic', width: 100,
            render: (h, params) => h('img', {
              attrs: {src: params.row.pic},
              style: {width: "100px", height: "100px", marginLeft: "-10px", display: 'block'},
              on: {
                click: () => {
                  // alert(1);
                }
              }
            }, "")
          },
          {title: '姓名', key: 'nickname', width: 180},
          {title: '职位', key: 'title', width: 120},
          {title: '组名', key: 'grouopname', width: 120},
          {
            title: '在线状态', key: 'is_online', width: 140, align: "center",
            render: (h, params) => h('b', {
              style: {
                color: params.row.is_online == 0 ? "red" : "green"
              }
            }, this.is_online_list[params.row.is_online])
          },
          {
            title: '目前接单状态', key: 'order_state', width: 140, align: "center",
            render: (h, params) => h('b', {
              style: {
                color: this.color(params.row.order_state),
              }
            }, this.order_state_list[params.row.order_state])
          },
          {
            title: '操作', key: 'F', minWidth: 350, align: 'center',
            render: (h, params) => h('div', [
              h('Button', {
                props: {type: params.row.order_state > 0 ? "default" : "primary"}, on: {
                  click: () => {
                    let content = params.row.order_state > 0 ? "确认切换到不可接单状态码?" : "确认切换到可接单状态吗?";
                    this.$Modal.confirm({
                      title: '系统提示',
                      content: content,
                      onOk: () => {
                        this.axios.request({
                          url: '/manage/person/switchstatus',
                          method: 'get',
                          params: {
                            access_token: this.$store.state.user.token,
                            id: params.row.id,
                            status: params.row.order_state > 0 ? 0 : 1,
                          },
                        }).then(res => {
                          if (res.success === true) {
                            this.getList();
                          }
                        })
                      }
                    });

                  }
                }
              }, params.row.order_state > 0 ? "切换到不可接单" : "切换到可接单"),
              h('Button', {
                props: {type: params.row.state > 0 ? "default" : "primary"}, style: {marginLeft: "10px"}, on: {
                  click: () => {
                    let content = params.row.order_state > 0 ? "确认解除角色吗?" : "确认绑定角色吗?";
                    this.$Modal.confirm(
                      {
                        title: '系统提示',
                        content: content,
                        onOk: () => {
                          this.axios.request({
                            url: '/manage/person/relieverole',
                            method: 'get',
                            params: {
                              access_token: this.$store.state.user.token,
                              id: params.row.id,
                              type: params.row.state > 0 ? 0 : 1,
                            },
                          }).then(res => {
                            if (res.success === true) {
                              this.getList();
                            }
                          })
                        }
                      }
                    );
                  }
                }
              }, params.row.state > 0 ? "解除角色" : "绑定角色"),
              h('Button', {
                style: {marginLeft: '10px'}, on: {
                  click: () => {
                    this.updateData.userid = params.row.id;
                    this.updateData.group = params.row.groupcode.toString();
                    this.updateData.name = params.row.nickname;
                    this.updateData.img64 = params.row.pic;
                    this.updateFile = "";
                    this.updateModal = true;
                  }
                }
              }, '编辑')
            ])
          },
        ],
        total: 0,
        page: 1,
        limit: 25,
        loading: false,
        showTable: false,
        statusList: [
          {id: "请选择接单状态", name: '请选择接单状态'},
          {id: 0, name: '不可接单'},
          {id: 1, name: '可接单'},
          {id: 2, name: '已接单'},
        ],
      }
    },
    mounted() {
      this.showTable = Math.random();
      this.baseUrl = env;
      this.groupList = getDictGroup(this.$store.state.app.dict, '1055');
      this.getList();
    },
    methods: {
      getImg(e) {
        this.updateFile = e.target.files[0];
        imgToBase64(this.updateFile, (base64, fileName) => {
          this.updateData.img64 = base64;
        })
      },
      updateSubmit() {
        this.$refs.updateData.validate(validator => {
          if (validator) {
            this.$Modal.confirm({
              title: '系统提示!',
              content: '确认提交吗?',
              onOk: () => {
                let formdata = new FormData();
                formdata.append('access_token', this.$store.state.user.token);
                formdata.append('name', this.updateData.name);
                formdata.append('userid',this.updateData.userid);
                formdata.append('group', this.updateData.group);
                formdata.append('file', this.updateFile);
                   this.$fxios({
                     headers: {'Content-Type': 'application/octet-stream'},
                     url: '/manage/person/edit',
                     method: 'post',
                     data:formdata,
                   }).then(res => {
                     if(res.data){
                       this.updateModal = false;
                       this.getList();
                     }
                   })
              }
            });
          } else {
            this.$Message.error("请校对必填信息!");
          }
        });
      },
      upload() {
        this.$refs.upload.post(this.file);
      },
      beforeUpload(files) {
        this.file = files;
        imgToBase64(files, (base64, fileName) => {
          this.formData.img64 = base64;
        })
        return false;
      },
      uploadSuccess(response) {
        console.log(response);
        if (response.success) {
          this.getList();
        } else {
          if (response.hasOwnProperty('Exception')) {
            this.$Message.error(response.Exception.message);
          } else {
            this.$Message.error(response.title);
          }
        }
      },
      handleMaxSize() {
        this.$Notice.warning({
          title: '错误提示',
          desc: '图片超过2M'
        })
      },
      handleFormatError() {
        this.$Notice.warning({
          title: '错误提示',
          desc: '只允许上传jpg,png图片'
        })
      },
      submit() {
        this.$refs.formData.validate((type) => {
          if (type) {
            let data = {
              nickname: this.formData.nickname,
              work_number: this.formData.work_number,
              title: this.formData.title,
              username: this.formData.username,
            }
            this.token.access_token = this.$store.state.user.token;
            this.token.data = JSON.stringify(data);
            this.upload();
          } else {
            this.$Message.error("请校验必填内容");
          }
        });
        // this.$refs.up.upload();
        // console.log(this.$refs.up);
        // console.log(this.$refs.up._data);
      },
      add() {
        this.$refs.formData.resetFields();
        this.img64 = "";
        this.showModal = true;
      },
      color(code) {
        switch (code) {
          case 0:
            return "red";
            break;
          case 1:
            return "green";
            break;
          case 2:
            return "orange";
            break;
        }
      },
      getList() {
        this.axios.request({
          url: 'manage/person/list',
          method: 'get',
          params: {
            access_token: this.$store.state.user.token,
            limit: this.limit,
            page: this.page,
            KEYWORD: this.KEYWORD,
            ORDER_STATE: this.ORDER_STATE == "请选择接单状态" ? "" : this.ORDER_STATE,
          },
        }).then(res => {
          if (res.success === true) {
            this.showModal = false;
            this.total = res.total;
            this.tableData = res.data;
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
      }
    },
  }
</script>

<style scoped>

</style>
