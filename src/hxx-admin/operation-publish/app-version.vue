<template>
  <common-table v-model="tableData" :columns="columns"
                :total="total" :show="showTable" :page="page" @changePageSize="changePageSize" @changePage="changePage">
    <Modal v-model="showModal" title="版本发布" :width="400">
      <Form ref="formData" :rules="rule" :model="formData" :mask-closable="false" :closable="false" :label-width="100"
            style="width:350px;">
        <FormItem label="系统类型" prop="type">
          <RadioGroup v-model="formData.type" ref="formData">
            <Radio :label="1" :disabled="formData.type != 1">
              <Icon type="logo-apple"></Icon>
              <span>IOS</span>
            </Radio>
            <Radio :label="0" :disabled="formData.type != 0">
              <Icon type="logo-android"></Icon>
              <span>Android</span>
            </Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="版本号" prop="version">
          <Input v-model="formData.version"/>
        </FormItem>
        <FormItem label="下载地址" prop="url">
          <Input v-model="formData.url" type="textarea"/>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="showModal=false">取消</Button>
        <Button type="primary" @click="save('formData')">保存</Button>
      </div>
    </Modal>
  </common-table>
</template>

<script>
  import commonTable from '@/hxx-components/common-table.vue'
  import {deepClone} from "../../libs/util";

  export default {
    name: "app-version",
    components: {commonTable},
    data() {
      return {
        formData: {
          version:'',
          url:'',
          type:0,
        },
        showModal: false,
        rule: {
          type:{required:true,message:'必填'},
          version:{required:true,message:'必填'},
          url:{required:true,message:'必填'},
        },
        tableData: [],
        page: 1,
        limit: 25,
        columns: [
          {title: '版本号', key: 'version', sortable: true, minWidth: 140},
          {
            title: '下载地址', key: 'url', sortable: true, minWidth: 400,
            render: (h, params) => h('a', {attrs: {href: params.row.url}}, params.row.url)
          },
          {
            title: '系统类型', key: 'ROLE_DESC', sortable: true, minWidth: 140,
            render: (h, params) => h('span', params.row.type == 0 ? '安卓' : 'IOS')
          },
          {
            title: '操作', minWidth: 140, align: 'center',
            render: (h, params) => h('Button', {
              props: {type: 'primary'}, on: {
                click: (index) => {
                  this.update(params.row);
                }
              }
            }, '修改')
          }
        ],
        total: 0,
        showTable: false,
      }
    },
    mounted() {
      this.showTable = Math.random();
      this.getList();
    },
    methods: {
      update(row) {
        this.$refs.formData.resetFields();
        this.showModal = true;
        this.formData = deepClone(row);
        this.formData.access_token = this.$store.state.user.token;
      },
      save(name) {
        this.$refs[name].validate((valid)=>{
          if(valid){
            this.axios.request({
              url: '/manage/basedata/release/version',
              method: 'post',
              data:this.formData,
            }).then(res => {
              if (res.success === true) {
                this.$Message.success("版本已更新");
                this.showModal = false;
                this.getList();
              }
            })
          }
        })
      },
      changePage(page) {
        this.page = page;
        this.getList();
      },
      changePageSize(size) {
        this.limit = size;
        if (this.page == 1) this.getList();
      },
      getList() {
        this.axios.request({
          url: '/manage/basedata/release/applist?access_token=' + this.$store.state.user.token,
          method: 'get',
        }).then(res => {
          if (res.success === true) {
            this.total = res.data.length;
            this.tableData = res.data;
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
