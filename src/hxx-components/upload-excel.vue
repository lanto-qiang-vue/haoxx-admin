<template>
  <div>
    <Modal :transition-names="['', '']" v-model="show" :mask-closable="false" width="400" @on-cancel="uploadClose">
      <p slot="header" style="color:white;text-align:left;height:30px;line-height:30px;">
        <span>{{title}}</span>
      </p>
      <div style="text-align:left;">
        <Upload
          ref="upload"
          :before-upload="beforeUpload"
          :name="uploadName"
          :show-upload-list="false"
          :on-success="uploadSuccess"
          :data="token"
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          type="drag"
          :action="baseUrl + actionUrl">
          <div style="padding: 20px 0">
            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
            <div style="clear:both;"></div>
            <p v-for="item in description">{{item.des}}</p>
          </div>
        </Upload>
        <div>{{filename}}</div>
      </div>
      <div slot="footer">
        <Button type="success" @click="down" style="float:left;">下载模板</Button>
        <Button type="primary" @click="upload">确定</Button>
        <Button type="error" @click="uploadClose">关闭</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import env from '_conf/url'

  export default {
    name: 'upload-excel',
    data() {
      return {
        filename: '请选择文件',
        token: {access_token: ''},
        baseUrl: '',
        show: false,
      }
    },
    mounted() {
      this.token.access_token = this.$store.state.user.token
      this.baseUrl = env;
    },
    props: {
      type: {},//默认隐藏
      success: {
        type: String, default() {
          return ''
        }
      },//成功上传传递函数
      uploadName: {
        type: String, default() {
          return 'uploadFile'
        }
      },
      actionUrl: {
        type: String, default() {
          return '/tenant/basedata/ttcustomerfile/doImport'
        }
      },
      downUrl: {
        type: String, default() {
          return "/resources/excel/customer.xls"
        }
      },
      TENANT_ID:{
        default(){
          return '';
        }
      },
      title: {
        type: String, default() {
          return '客户档案导入'
        }
      },
      description:{
        type:Array,
        default(){
          return [{des:'1、点击当前区域，找到您所要导入的Excel文件,请确保文件按照模板中导入说明的要求填写。'},{des:'2、选择好文件后, 点“确定”按钮完成导入'}];
        }
      }
    },
    watch: {
      type() {
        if(this.type != false) {
          this.filename = "请选择文件";
          this.show = true;
          if(this.TENANT_ID) this.token['TENANT_ID'] = this.TENANT_ID;
        }else{
          this.show = false;
        }
      }
    },
    methods: {
      beforeUpload(files) {
        this.filename = files.name;
        this.file = files;
        return false;
      },
      upload() {
        if (this.filename == '请选择文件') {
          this.$Message.error('请选择文件');
          return;
        }
        this.$Spin.show();
        this.$refs.upload.post(this.file);
      },
      uploadClose() {
        this.show = false
      },
      uploadSuccess(res) {
        this.$Spin.hide();
        this.$emit(this.success, res);
      },
      down() {
        if(this.downUrl == '/resources/excel/customer.xls'){
          window.location.href = "/customer.xls";
        }else{
        window.location.href = this.baseUrl + this.downUrl;
        }
      },
    }
  }
</script>
