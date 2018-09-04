<!--人员招聘详情 2018-09-04-->
<template>
  <Modal
    v-model="showModal"
    title="人员招聘"
    width="90"
    @on-visible-change="visibleChange"
    :scrollable="true"
    :transfer= "false"
    :footer-hide="false"
    :transition-names="['', '']"
  >
    <Collapse v-model="collapse">
      <Panel name="1">人员招聘基本信息
       <Form ref="listSearch" :rules="ruleValidate"  :model="listSearch" slot="content" :label-width="85" inline class="detail-form">
          <FormItem label="岗位名称:" prop="name" style="width:45%;">
              <Input type="text" :disabled='saveFlag' v-model="listSearch.name" placeholder="">
              </Input>
          </FormItem>
          <FormItem label="人数:" style="width:45%;" prop="num">
              <InputNumber :min="1" v-model="listSearch.num" :disabled='saveFlag'></InputNumber>
          </FormItem>
          <FormItem label="岗位职责:" prop="PostName" style="width:100%;">
              <Input type="textarea" :disabled='saveFlag' v-model="listSearch.PostName" placeholder="请输入岗位职责..." style="min-width: 100%;"> </Input>
          </FormItem>
       </Form>
      </Panel>
    </Collapse>
    <div slot="footer">
        <Button type="primary" @click="handleSave('listSearch')" style="margin-right: 10px;" v-show="buttonFlag">保存</Button>
    </div>
    
  </Modal>

</template>

<script>
  import { getName, getDictGroup ,getUserInfo} from '@/libs/util.js'
  import { formatDate } from '@/libs/tools.js'

export default {
	name: "recruitment-list-detail",
    components: {},
    data(){
      return{
            showModal:false,
            collapse:'1',
            listSearch:{
                "name":"",
                "num":0,
                "PostName":""
            },
            ruleValidate: {
                name:[{required: true, message: ''}],
                PostName:[{required: true, message: ''}],
                num:[{required: true, message: ''}],
                
            },
            page: 1,
            limit: 25,
            total: 0,
            saveFlag:false,
            buttonFlag:true,
            
      }
    },
    props:['showDetail', 'detailData'],
    watch:{
      showDetail(){
          this.showModal=true;
          if(this.detailData){
              this.buttonFlag=false;
              this.saveFlag=true;
              this.listSearch['name']=this.detailData.name;
              this.listSearch['num']=parseInt(this.detailData.num);
              this.listSearch['PostName']=this.detailData.postName;
          }else{
              this.buttonFlag=true;
              this.saveFlag=false;
              for(let i in this.listSearch){
                  if(i=='num'){
                      this.listSearch[i]=0;
                  }else{
                      this.listSearch[i]='';
                  }
                  
              }

          }

          
      }
    },
    mounted () {
    },
    methods:{
        //保存操作---
        handleSave(name){
            this.$refs[name].validate((valid) => {
              if (valid) {
                this.$Modal.confirm({
                    title:"系统提示!",
                    content:"确定要保存吗？",
                    onOk:this.saveOrSubmit,
                })
              } else {
                  this.$Message.error('请填写必选项...');
              }
          });
        },
        //保存数据--------
        saveOrSubmit(){
            this.axios.request({
                url: '/tenant/support/tt_personrecruit/save',
                method: 'post',
                data: {
                    data: JSON.stringify(this.listSearch),
                    access_token: this.$store.state.user.token
                }
            }).then(res => {
                if (res.success === true) {
                    this.$Message.info('保存成功...');
                    this.showModal=false;
                }
            })
        },
        //弹出层状态变化--------
        visibleChange(status){
            if(status === false){
                this.$emit('closeDetail');
                this.handleReset("listSearch");
            }
        },
        //校验重置
        handleReset (name) {
            this.$refs[name].resetFields();
        },
        
    }
}
</script>

<style scoped lang="less">
  .search-block{
    display: inline-block;
    width: 200px;
    margin-right: 10px;
  }
  .r-list-search{
    width: 100%;
    padding: 20px 0;
    text-align: center;

  }
  .r-list-choose-parts{
    width: 100%;
    padding: 20px 0;
    text-align: center;
  }
  .r-list-money{
    width: 100%;
    font-size: 18px;
    text-align: center;

    span{
      color:red;

    }
    .r-list-money-reset{
      font-size: 22px;
    }
  }
  .r-list-chekbox{
    width: 100%;
    overflow: hidden;
    font-size: 18px;
    padding: 0px 10px;
    div{
      float:right;
    }
  }
</style>
