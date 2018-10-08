<!--后台管理  人员招聘详情 2018-10-08-->
<template>
  <Modal
    v-model="showModal"
    title="招聘信息"
    width="90"
    @on-visible-change="visibleChange"
    :scrollable="true"
    :transfer= "false"
    :footer-hide="false"
    :transition-names="['', '']"
  >
    <div style="height: 100%;overflow: auto;">
        <Form :label-width="100" inline class="detail-form">
            <FormItem label="申请门店:"  style="width:45%;">
                <Input type="text" disabled v-model="listSearch.tENANT_NAME" placeholder="">
                </Input>
            </FormItem>
            <FormItem label="申请时间:"  style="width:45%;">
                <Input type="text" disabled v-model="listSearch.cREATE_TIME" placeholder="">
                </Input>
            </FormItem>
            <FormItem label="岗位名称:"  style="width:45%;">
                <Input type="text" disabled v-model="listSearch.name" placeholder="">
                </Input>
            </FormItem>
            <FormItem label="人数:" style="width:45%;" >
                
                <Input type="text" disabled v-model="listSearch.num" placeholder="">
                </Input>
            </FormItem>
            <FormItem label="岗位职责:"  style="width:91%;">
                <Input type="textarea" :rows="5" disabled v-model="listSearch.postName" placeholder="">
                </Input>
            </FormItem>
        </Form>
    </div>
       

    <div slot="footer">
        <Button type="primary" @click="handleSave" style="margin-right: 10px;">返回</Button>
    </div>
    
  </Modal>

</template>

<script>
  

export default {
	name: "person-recruit-detail",
    components: {},
    data(){
      return{
            showModal:false,
            listSearch:{
                tENANT_NAME:"",
                cREATE_TIME:"",
                "name":"",
                "num":"",
                "PostName":""
            },
            
        
      }
    },
    props:['showDetail', 'detailData'],
    watch:{
      showDetail(){
        this.showModal=true;
        for(let i in this.detailData){
            this.listSearch[i]=this.detailData[i];
        }
        this.listSearch["cREATE_TIME"]=this.listSearch["cREATE_TIME"].substr(0, 19);
          

          
      }
    },
    mounted () {
    },
    methods:{
        //保存操作---
        handleSave(){
            this.showModal=false;
        },
        //弹出层状态变化--------
        visibleChange(status){
            if(status === false){
                this.$emit('closeDetail');
            }
        },
    }
}
</script>

<style scoped lang="less">
</style>
