<!--预约单管理详情-->
<template>
  <Modal
    v-model="showModal"
    width="90"
    @on-visible-change="visibleChange"
    :mask-closable="false"
    :closable="false"
    :scrollable="true"
    :transfer= "false"
    :footer-hide="true"
  >
      <Tabs>
        <!-- 基本信息 -->
        <TabPane label="基本信息" icon="logo-apple">
    <Form ref="formData" :model="formData" :label-width="80" :rules="ruleValidate" inline>
          <FormItem style="margin-left:-80px;">
            <Button @click="showModal = false">返回</Button>
            <Button type="primary" style="margin-left: 8px" @click="hsubmit('formData')">保存</Button>
          </FormItem>
          <div></div>
          <FormItem label="客户名称" prop="name">
              <Input type="text" v-model="formData.name"  style="min-width: 250px;"> </Input>
          </FormItem>
          <FormItem label="移动电话:" prop="phone">
              <Input type="text" v-model="formData.phone" style="min-width: 250px;"> </Input>
          </FormItem>
          <FormItem label="联系地址:">
              <Input type="text" v-model="formData.address" style="min-width: 250px;"> </Input>
          </FormItem>
                  <FormItem label="固定电话:">
              <Input type="text" v-model="formData.tel"  style="min-width: 250px;"> </Input>
          </FormItem>
                  <FormItem label="身份证号:" prop="idcard">
              <Input type="text" v-model="formData.idcard"  style="min-width: 250px;"> </Input>
          </FormItem>
                  <FormItem label="生日:">
           <!--    <Input type="text" style="min-width: 250px;"> </Input> -->
                      <Col span="11">
                    <DatePicker type="date" placeholder="Select date" v-model="formData.birthday"  format="yyyy-MM-dd" style="min-width: 250px;"></DatePicker>
                </Col>
          </FormItem>
                   </FormItem>
                  <FormItem label="性别:">
               <Select v-model="formData.sex" placeholder="" style="min-width: 250px;">
                <Option v-for="(item, index) in sexGroup"
                  :key="index" :value="item.code">{{item.name}}</Option>
              </Select>
          </FormItem>
                   </FormItem>
                  <FormItem label="客户来源:">
                             <Select v-model="formData.resource" placeholder="" style="min-width: 250px;">
                <Option v-for="(item, index) in resourceGroup"
                  :key="index" :value="item.code">{{item.name}}</Option>
              </Select>
          </FormItem>
                   </FormItem>
                  <FormItem label="客户等级:">
              <Input type="text" v-model="formData.level"  style="min-width: 250px;"> </Input>
          </FormItem>
                   </FormItem>
                  <FormItem label="客户类型:">
              <Input type="text" v-model="formData.type"  style="min-width: 250px;"> </Input>
          </FormItem>
                   </FormItem>
                  <FormItem label="QQ:">
              <Input type="text" v-model="formData.qq"  style="min-width: 250px;"> </Input>
          </FormItem>
                   </FormItem>
                  <FormItem label="微信:">
              <Input type="text" v-model="formData.wx"  style="min-width: 250px;"> </Input>
          </FormItem>
                   </FormItem>
                  <FormItem label="客户专员:">
              <Input type="text" v-model="formData.attach"  style="min-width: 250px;"> </Input>
          </FormItem>
                   </FormItem>
                  <FormItem label="邮箱:">
              <Input type="text" v-model="formData.email"  style="min-width: 250px;"> </Input>
          </FormItem>
                   </FormItem>
                  <FormItem label="开票税号:">
              <Input type="text" v-model="formData.snumber"  style="min-width: 250px;"> </Input>
          </FormItem>
    </Form>
           <Form ref="formInline" :label-width="80">
          <FormItem label="备注:">
              <Input type="textarea" v-model="formData.remark"  placeholder="请输入备注信息"> </Input>
          </FormItem>
       </Form>
        </TabPane>
        <!-- 车辆档案 -->
        <TabPane label="车辆档案" :disabled="tabshow" icon="logo-windows">
          
        </TabPane>
        <!-- 会员卡信息 -->
        <TabPane label="会员卡信息" :disabled="tabshow" icon="logo-tux">
          
        </TabPane>
    </Tabs>
  </Modal>

</template>
<script>
    import { getName, getDictGroup } from '@/libs/util.js'
	export default {
		name: "customer-list-detail",
    data(){
      return {
        showModal:true,
        collapse:'1',
        tabshow:true,
        sexGroup:[],
        resourceGroup:[],
        formData:{
          name:'',
          phone:'18358330864',
          address:'联系地址',
          tel:'固定电话',
          idcard:'身份证号',
          birthday:'1994-01-13',
          sex:'',
          resource:'',
          level:'客户等级',
          type:'客户类型',
          qq:'qq',
          wx:'wx',
          attach:'专员',
          email:'邮箱',
          snumber:'税号',
          remark:'备注',
        },
        ruleValidate: {
          name:[{required: true, message: '客户名称必填', trigger: 'blur' }],
          phone:[{required: true, message: '移动电话必填', trigger: 'blur' },
          { type:'string',pattern:/^[1][3,4,5,7,8][0-9]{9}$/, message:'请输入有效手机号码', trigger:'blur'}
          ],
          idcard:[{ type:'string',pattern:/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message:'请输入正确的身份证号码', trigger:'blur'}]
        }
      }
    },
    mounted(){
      //性别组
      this.sexGroup = getDictGroup(this.$store.state.app.dict, '1003');
      //默认选中性别第一个
      this.formData.sex = this.sexGroup[0].code;
      //来源组
      var group = getDictGroup(this.$store.state.app.dict,'1005');
      this.resourceGroup.push({"code":0,
          "order":0,
          "group":"1005",
          "name":"请选择"});
      //使用0代表空
      this.formData.resource = 0;
    },
    methods:{
      visibleChange(){},
      hsubmit(name){
            this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$Message.success('Success!');
                    } else {
                        this.$Message.error("请校对红框信息");
                    }
                })
      }
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
    padding: 5px 10px;
    div{
      float:right;
    }
  }
</style>
<style lang="less">
.table-modal-detail .ivu-modal-wrap .ivu-modal .ivu-modal-content .ivu-modal-body{
  padding-top:10px;
}
</style>