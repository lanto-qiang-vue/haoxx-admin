<template>
    <div>
      <Button type="primary" style="margin-left:20px;" @click="infoUpload">批量上传门店信息</Button>
      <Button type="primary" style="margin-left:20px;" @click="errorImport">错误门店导出</Button>
      <Button type="primary" style="margin-left:20px;" @click="infoImport">门店信息导出</Button>
      <upload-excel :type="show" :title="title" :actionUrl="actionUrl" :success="'success'" @success="uploadSuccess" :downUrl="downUrl"></upload-excel>
    </div>
</template>
<script>
  import env from '_conf/url'
  import uploadExcel from '@/hxx-components/upload-excel.vue';
    export default {
        name: "import-store",
        data(){
          return{
            baseUrl:'',
            show:false,
            title:'门店信息批量导入',
            downUrl:'common/basedata/tenantImport/downloadTemple',
            actionUrl:'manage/info/tenantimport/doImport',
          }
        },
      components:{uploadExcel},
      methods:{
          infoUpload(){
            this.show = Math.random();
          },
        errorImport(){
          window.location.href = this.baseUrl+"/manage/info/tenantimport/doExport?access_token="+this.$store.state.user.token;
        },
        infoImport(){
          window.location.href = this.baseUrl+"/manage/info/tenantimport/doExportTenant?access_token="+this.$store.state.user.token;
        },
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
                  this.show = Math.random();
              }
            }else{
              this.$Modal.error({title:'系统提示',content:res.Exception.message});
            }
        }
      },
      mounted(){
          this.baseUrl = env;
      },
    }
</script>

