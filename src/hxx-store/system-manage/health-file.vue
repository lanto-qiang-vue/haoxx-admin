<template>
    <div>
      <Button type="primary" @click="healthFile">上传电子健康档案</Button>
      <upload-excel :type="uploadShow" :downUrl="'/common/basedata/dzjkdamodel/downloadTemple'" :actionUrl="'/tenant/healthfile/dzjkdamodel/doImport'" :title="'电子档案批量导入(建议条数500以内)'" :description="description" :success="'success'" @success="uploadSuccess"></upload-excel>
    </div>
</template>

<script>
  import uploadExcel from '@/hxx-components/upload-excel.vue'
    export default {
        name: "health-file",
      components:{uploadExcel},
        data(){
          return{
            uploadShow:false,
            description:[{des:'1、点击当前区域，找到您所要导入的Excel文件,”'},{des:'2、选择好文件后, 点“确定”按钮完成导入。'}],
          }
        },
        methods:{
          healthFile(){
            this.uploadShow = Math.random();
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
                this.uploadShow = false;
              }
            }else{
              this.$Modal.error({title:'系统提示',content:res.Exception.message});
            }
          }
        },
    }
</script>

<style scoped>

</style>
