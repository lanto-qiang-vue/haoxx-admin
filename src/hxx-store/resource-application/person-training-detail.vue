<!--人员培训详情 2018-09-04-->
<template>
  <Modal
    v-model="showModal"
    title="人员培训"
    width="90"
    @on-visible-change="visibleChange"
    :scrollable="true"
    :transfer= "false"
    :footer-hide="true"
    :transition-names="['', '']"
  >
    <Collapse v-model="collapse">
      <Panel name="1">人员培训基本信息
       <Form ref="listSearch" :rules="ruleValidate"  :model="listSearch" slot="content" :label-width="85" inline class="detail-form">
          <FormItem label="培训内容:" style="width:100%;">
              <Input type="textarea" :disabled='saveFlag' v-model="listSearch.trainingContent" placeholder="" style="min-width: 100%;"> </Input>
          </FormItem>
          <FormItem label="培训时间:" style="width:45%;">
              <Input type="text" :disabled='saveFlag' v-model="listSearch.time" placeholder="">
              </Input>
          </FormItem>
          <FormItem label="培训费用:" style="width:45%;">
              <Input type="text" :disabled='saveFlag' v-model="listSearch.cost" placeholder="">
              </Input>
          </FormItem>
          <FormItem label="培训地点:" style="width:100%;">
              <Input type="textarea" :disabled='saveFlag' v-model="listSearch.place" placeholder="" style="min-width: 100%;"> </Input>
          </FormItem>
       </Form>
      </Panel>
    </Collapse>
    
  </Modal>

</template>

<script>
  import { getName, getDictGroup ,getUserInfo} from '@/libs/util.js'
  import { formatDate } from '@/libs/tools.js'

export default {
	name: "person-training-detail",
    components: {},
    data(){
      return{
            showModal:false,
            collapse:'1',
            listSearch:{
                "trainingContent":"",
                "time":'',
                "cost":"",
                "place":"",
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
              this.listSearch['trainingContent']=this.detailData.trainingContent;
              this.listSearch['time']=this.detailData.time.substr(0, 16);
              this.listSearch['cost']=this.detailData.cost;
              this.listSearch['place']=this.detailData.place;
          }else{
              this.buttonFlag=true;
              this.saveFlag=false;
              for(let i in this.listSearch){
                      this.listSearch[i]='';
              }

          }
      }
    },
    mounted () {
    },
    methods:{
        //弹出层状态变化--------
        visibleChange(status){
            if(status === false){
                this.$emit('closeDetail');
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
