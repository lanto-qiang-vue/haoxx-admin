<template>
    <div style="padding-top:20px;">
      <Button type="primary" style="margin-left:20px;" @click="infoUpload">批量上传门店信息</Button>
      <Button type="primary" style="margin-left:20px;" @click="errorImport">错误门店导出</Button>
      <Button type="primary" style="margin-left:20px;" @click="infoImportBefore">门店信息导出</Button>
      <Button type="primary" style="margin-left:20px;" @click="fileUpload">批量导入子门店</Button>
      <Modal :transition-names="['', '']" v-model="importShow" :mask-closable="false" width="400" title="门店信息导出">
        <Form :label-width="100" :model="form" ref="form" :rules="rule1" style="width:350px;">
            <FormItem  label="选择区域:" prop="AREA_ID">
              <Select v-model="form.AREA_ID" >
                <Option v-for="(item, index) in areaList"
                        :key="index" :value="item.AREA_ID">{{item.AREA_NAME}}
                </Option>
              </Select>
            </FormItem>
        </Form>
        <div slot="footer">
          <Button @click="importShow=false">取消</Button>
          <Button type="primary" @click="infoImport">导出</Button>
        </div>
      </Modal>
      <Modal :transition-names="['', '']" v-model="show" :mask-closable="false" width="400">
        <p slot="header" style="color:white;text-align:left;height:30px;line-height:30px;">
          <span>{{title}}</span>
        </p>
        <div style="text-align:left;">
          <Upload
            ref="upload"
            :before-upload="beforeUpload"
            name="uploadFile"
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
          <div>
            <Form slot="content" :model="formData" ref="formData" :rules="rules" :label-width="120" class="common-form">
              <FormItem label="选择区域:" prop="AREA_ID">
                <Select v-model="formData.AREA_ID" >
                  <Option v-for="(item, index) in areaList"
                          :key="index" :value="item.AREA_ID">{{item.AREA_NAME}}
                  </Option>
                </Select>
              </FormItem>
            </Form>
            <div>{{filename}}</div>
          </div>
        </div>
        <div slot="footer">
          <Button type="success" @click="down" style="float:left;">下载模板</Button>
          <Button type="primary" @click="upload">确定</Button>
          <Button type="error" @click="uploadClose">关闭</Button>
        </div>
      </Modal>
      <upload-excel :type="fileShow" :title="'批量导入子门店'" :downUrl="'common/dowmloadChilrenTenantTemple'" :actionUrl="'manage/info/tenantimport/importChilrenTenant'" :success="'success'" :uploadName="'file'" @success="uploadSuccess"></upload-excel>
    </div>
</template>
<script>
  import env from '_conf/url'
  import uploadExcel from '@/hxx-components/upload-excel.vue';
    export default {
        name: "import-store",
        data(){
          return{
            areaList:[],
            importShow:false,
            token: {access_token: '',AREA_ID:''},
            formData:{
              AREA_ID:'',
            },
            form:{
              AREA_ID:'',
            },
            token: {access_token: ''},
            rules:{
              AREA_ID:[{required:true,message:'请选择区域'}],
            },
            rule1:{
              AREA_ID:[{required:true,message:'请选择区域'}],
            },
            filename:'请选择文件',
            baseUrl:'',
            description:[{des:'1、点击当前区域，找到您所要导入的Excel文件,请确保文件按照模板中导入说明的要求填写。'},{des:'2、选择好文件后, 点“确定”按钮完成导入'}],
            show:false,
            fileShow:false,
            title:'门店信息批量导入',
            downUrl:'common/basedata/tenantImport/downloadTemple',
            actionUrl:'manage/info/tenantimport/doImport',
          }
        },
      components:{uploadExcel},
      watch:{
        'formData.AREA_ID'(val){
          this.token.AREA_ID = val;
        }
      },
      methods:{
        infoImportBefore(){
          this.getArea();
        this.importShow = true;
        },
          fileUpload(){
this.fileShow = Math.random();
          },
          getArea(){
            this.axios.request({
              url: '/manage/info/tenantimport/getArea',
              method: 'post',
              data: {
                access_token: this.$store.state.user.token,
                limit: this.limit,
                page: this.page,
              }
            }).then(res => {
              if (res.success === true) {
               this.areaList = res.data;
              }
            })
          },
        upload() {
          if (this.filename == '请选择文件') {
            this.$Message.error('请选择文件');
            return;
          }
          this.$refs.formData.validate((valid) => {
            if(valid){
              this.$Spin.show();
              this.$refs.upload.post(this.file);
            }else{
              this.$Message.error('请选择区域');
            }
          })
        },
        uploadClose(){
          this.show = false;
        },
        beforeUpload(files) {
          this.filename = files.name;
          this.file = files;
          return false;
        },
        down() {
          window.location.href = this.baseUrl + this.downUrl;
        },
          infoUpload(){
            this.filename = "请选择文件";
            this.$refs.formData.resetFields();
            this.getArea();
            this.show = true;
          },
        errorImport(){
          window.location.href = this.baseUrl+"/manage/info/tenantimport/doExport?access_token="+this.$store.state.user.token;
        },
        infoImport(){
          this.$refs.form.validate((valid) => {
            if(valid){
              window.location.href = this.baseUrl+"/manage/info/tenantimport/doExportTenant?access_token="+this.$store.state.user.token + "&AREA_ID="+this.form.AREA_ID;
            }else{
              this.$Message.error('请选择区域导出');
            }
          });
        },
        uploadSuccess(res){
          this.$Spin.hide();
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
                  this.show = false;
                  this.fileShow = false;
              }
            }else{
              this.$Modal.error({title:'系统提示',content:res.Exception.message});
            }
        }
      },
      mounted(){
          this.baseUrl = env;
        this.token.access_token = this.$store.state.user.token;
      },
    }
</script>

