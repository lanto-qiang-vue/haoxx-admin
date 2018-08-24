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
      <Tabs >
                <!-- 车辆档案 -->
        <TabPane label="车辆档案" :disabled="tabshow > 1" icon="logo-windows">
          <!-- <Form> -->
          <!-- <FormItem> -->
<!--             <Button @click="showModal = false">返回</Button>
            <Button type="primary" style="margin-left: 8px">新增</Button>
            <Button type="primary" style="margin-left: 8px">修改</Button>
            <Button type="primary" style="margin-left: 8px">查看</Button>
            <div style="clear:both;"></div> -->
<!--           </FormItem>
        </Form> -->
        <!-- 车辆档案列表 -->
        
        <common-table :columns="columns"  v-model="tableData" :show="show"></common-table>
    
        </TabPane>
        <!-- 车辆档案结束 -->
        <!-- 基本信息 -->
        <TabPane label="基本信息" icon="logo-apple">
    <Form ref="formData" :model="formData" :label-width="80" :rules="ruleValidate" inline>
          <FormItem style="margin-left:-80px;">
            <Button @click="showModal = false">返回</Button>
            <Button type="primary" style="margin-left: 8px" @click="hsubmit('formData')">保存</Button>
          </FormItem>
          <div></div>
          <FormItem label="客户名称" prop="name">
              <Input type="text" v-model="formData.name"  style="min-width: 200px;"> </Input>
          </FormItem>
          <FormItem label="移动电话:" prop="phone">
              <Input type="text" v-model="formData.phone" style="min-width: 200px;"> </Input>
          </FormItem>
          <FormItem label="联系地址:">
              <Input type="text" v-model="formData.address" style="min-width: 200px;"> </Input>
          </FormItem>
                  <FormItem label="固定电话:">
              <Input type="text" v-model="formData.tel"  style="min-width: 200px;"> </Input>
          </FormItem>
                  <FormItem label="身份证号:" prop="idcard">
              <Input type="text" v-model="formData.idcard"  style="min-width: 200px;"> </Input>
          </FormItem>
                  <FormItem label="生日:">
           <!--    <Input type="text" style="min-width: 250px;"> </Input> -->
                      <Col span="11">
                    <DatePicker type="date" placeholder="" v-model="formData.birthday"  format="yyyy-MM-dd" style="min-width: 200px;"></DatePicker>
                </Col>
          </FormItem>
                   </FormItem>
                  <FormItem label="性别:">
               <Select v-model="formData.sex" placeholder="" style="min-width: 200px;">
                <Option v-for="(item, index) in sexGroup"
                  :key="index" :value="item.code">{{item.name}}</Option>
              </Select>
          </FormItem>
                   </FormItem>
                  <FormItem label="客户来源:">
                             <Select v-model="formData.resource" placeholder="" style="min-width: 200px;">
                <Option v-for="(item, index) in resourceGroup"
                  :key="index" :value="item.code">{{item.name}}</Option>
              </Select>
          </FormItem>
                   </FormItem>
                  <FormItem label="客户等级:">
                            <Select v-model="formData.level" placeholder="" style="min-width: 200px;">
                <Option v-for="(item, index) in levelGroup"
                  :key="index" :value="item.code">{{item.name}}</Option>
              </Select>
          </FormItem>
                   </FormItem>
                  <FormItem label="客户类型:">
                                    <Select v-model="formData.type" placeholder="" style="min-width: 200px;">
                <Option v-for="(item, index) in typeGroup"
                  :key="index" :value="item.code">{{item.name}}</Option>
              </Select>
          </FormItem>
                   </FormItem>
                  <FormItem label="QQ:">
              <Input type="text" v-model="formData.qq"  style="min-width: 200px;"> </Input>
          </FormItem>
                   </FormItem>
                  <FormItem label="微信:">
              <Input type="text" v-model="formData.wx"  style="min-width: 200px;"> </Input>
          </FormItem>
                   </FormItem>
                  <FormItem label="客户专员:">
                <Select v-model="formData.attach" placeholder="" style="min-width: 200px;">
                <Option v-for="(item, index) in attachGroup"
                  :key="index" :value="item.USER_ID">{{item.USER_NAME}}</Option>
                </Select>
          </FormItem>
                   </FormItem>
                  <FormItem label="邮箱:">
              <Input type="text" v-model="formData.email"  style="min-width: 200px;"> </Input>
          </FormItem>
                   </FormItem>
                  <FormItem label="开票税号:">
              <Input type="text" v-model="formData.snumber"  style="min-width: 200px;"> </Input>
          </FormItem>
    </Form>
           <Form ref="formInline" :label-width="80">
          <FormItem label="备注:">
              <Input type="textarea" v-model="formData.remark"  placeholder="请输入备注信息"> </Input>
          </FormItem>
       </Form>
        </TabPane>

        <!-- 会员卡信息 -->
        <TabPane label="会员卡信息" :disabled="tabshow < 1" icon="logo-tux">
          
        </TabPane>
    </Tabs>
        <common-modal6 @dpost="dpost"  :description="obj.description" :title="obj.title" :modal6="obj.show" :fun="obj.funName"></common-modal6>
  </Modal>
</template>
<script>
    import commonTable from '@/hxx-components/common-table.vue'
    import { getName, getDictGroup } from '@/libs/util.js'
     import { formatDate } from '@/libs/tools.js'
       import commonModal6 from '@/hxx-components/common-modal6.vue'
	export default {
		name: "customer-list-detail",
    components: {commonModal6,commonTable},
    data(){
      return {
        showModal:true,
        collapse:'1',
        tabshow:0,
        sexGroup:[],
        resourceGroup:[],
        levelGroup:[],
        typeGroup:[],
        attachGroup:[],
        store:{},//存储使用
        tableData:[],
        formData:{
          name:'',
          phone:'',
          address:'',
          tel:'',
          idcard:'',
          birthday:'',
          sex:'',
          resource:'',
          level:'',
          type:'',
          qq:'',
          wx:'',
          attach:'',
          email:'',
          snumber:'',
          remark:'',
        },
        obj:{
          description:'',
          title:'',
          show:false,
          funname:'',
        },
        ruleValidate: {
          name:[{required: true, message: '客户名称必填', trigger: 'blur' }],
          phone:[{required: true, message: '移动电话必填', trigger: 'blur' },
          { type:'string',pattern:/^[1][3,4,5,7,8][0-9]{9}$/, message:'请输入有效手机号码', trigger:'blur'}
          ],
          idcard:[{ type:'string',pattern:/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message:'请输入正确的身份证号码', trigger:'blur'}]
        },
                columns: [
          {title: '序号',  minWidth: 80,
            render: (h, params) => h('span', (this.page-1)*this.limit+params.index+1 )
          },
           {title: '车牌号', key: 'CODE', sortable: true, minWidth: 300},
          {title: '车辆颜色', key: 'NAME', sortable: true, minWidth: 300},
          {title: '车型', key: 'MOBILE_PHONE', sortable: true, minWidth: 300},
          {title: '车架号', key: 'CUSTOMER_TYPE', sortable: true, minWidth: 300,
            render: (h, params) => h('span',getName(this.$store.state.app.dict, params.row.CUSTOMER_TYPE))
          },
          {title: '发动机型号', key: 'CUSTOMER_LEVEL', sortable: true, minWidth: 300,
            render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.CUSTOMER_LEVEL))
          },
          {title: '最近来厂日期', key: 'FOLLOW_PERSON', sortable: true, minWidth: 150},
          {title: '创建人', key: 'CREATER', sortable: true, minWidth: 150
            // render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.CREATER))
          },
          {title: '创建时间', key: 'CREATE_TIME', sortable: true, minWidth: 150
          },
        ]
      }

    },
    props:['show','detail','sign'],
    watch:{
      show(){
        this.showModal = true;
      },
      detail(row){
       // console.log(row);
       var name = row.FOLLOW_PERSON;
       var attach = 0;
       for(var i=0;i<this.attachGroup.length;i++){
         if(this.attachGroup[i].USER_NAME == name){
          attach = this.attachGroup[i].USER_ID;
          break;
         }
       }
       this.tabshow = row.CUSTOMER_ID;
       var that = this.formData;
       that.name = row.NAME;
       that.email = row.EMAIL;
       that.phone = row.MOBILE_PHONE;
       that.qq = row.QQ_NO;
       that.wx = row.WEIXIN_NO;
       that.address = row.ADDRESS;
       that.tel = row.TELPHONE;
       that.idcard = row.LICENSE_NO;
       that.birthday = row.BIRTHDAY;
       that.sex = row.SEX;
       that.resource = row.CUSTOMER_SOURCE;
       that.level = row.CUSTOMER_LEVEL;
       that.type = row.CUSTOMER_TYPE;
       that.remark = row.REMARK;
       that.snumber = row.TAX_NO;
       that.attach = attach;
       this.store = that;
       // console.log(row.FOLLOW_PERSON);
      },
      sign(type){
      //1新增 2 双击新增 3 单选新增
      if(type === 1) this.clear();
      if(type === 3) this.formData = this.store;
      }
    },
    mounted(){
      // 下拉数据处理开始
      //性别组
      this.getList();
      this.sexGroup = getDictGroup(this.$store.state.app.dict, '1003');
      //默认选中性别第一个
      this.formData.sex = this.sexGroup[0].code;
      //来源组
      this.resourceGroup.push({"code":0,
          "order":0,
          "group":"1005",
          "name":"请选择"});
      var group = getDictGroup(this.$store.state.app.dict,'1005');
      for(var i =0;i<group.length;i++){
      this.resourceGroup.push(group[i]);
      }
      //使用0代表空
      this.formData.resource = 0;
      //客户等级
      var group = getDictGroup(this.$store.state.app.dict,'1006');
         this.levelGroup.push({"code":0,
          "order":0,
          "group":"1006",
          "name":"请选择"});
      for(var i=0;i<group.length;i++){
      this.levelGroup.push(group[i]);
      }
      this.formData.level = 0;
      //客户类型
            var group = getDictGroup(this.$store.state.app.dict,'1007');
         this.typeGroup.push({"code":0,
          "order":0,
          "group":"1007",
          "name":"请选择"});
      for(var i=0;i<group.length;i++){
      this.typeGroup.push(group[i]);
      }
      this.formData.type = 0;
      // console.log(this.$store.state.app.tenant);
      //专员组
      var group = this.$store.state.app.tenant;
               this.attachGroup.push({"USER_ID":0,"USER_CODE":"","USER_NAME":"==请选择=="});
      for(var i=0;i<group.length;i++){
      this.attachGroup.push(group[i]);
      }
      this.formData.attach = 0;
      // console.log(this.formData);
      //下拉数据处理结束
      
    },
    methods:{
      visibleChange(){},
      hsubmit(name){
            this.$refs[name].validate((valid) => {
                    if (valid) {
                      alert(1);
                     this.obj = {title:'系统提示!',description:'确认保存吗?',show:Math.random(),funName:'dpost'};
                    } else {
                        this.$Message.error("请校对红框信息");
                    }
                })
      },
      dpost(){
                  var person;
                var that = this;
            this.attachGroup.filter(function(item){
              if(that.formData.attach == item.USER_ID){
               person = item.USER_NAME;
              }
            });
            var postData = {
                CUSTOMER_ID:'',
                NAME:this.formData.name,
                MOBILE_PHONE:this.formData.phone,
                ADDRESS:this.formData.address,
                TELPHONE:this.formData.tel,
                LICENSE_NO:this.formData.idcard,
                BIRTHDAY:this.formData.birthday,
                SEX:this.formData.sex,
                CUSTOMER_SOURCE:this.formData.resource == 0 ? '' : this.formData.resource,
                CUSTOMER_LEVEL:this.formData.level == 0 ? '' : this.formData.level,
                CUSTOMER_TYPE:this.formData.type == 0 ? '' : this.formData.type,
                QQ_NO:this.formData.qq,
                WEIXIN_NO:this.formData.wx,
                FOLLOW_PERSON:person,
                EMAIL:this.formData.email,
                TAX_NO:this.formData.snumber,
                REMARK:this.formData.remark,
                }
                if(this.tabshow > 1){postData.CUSTOMER_ID = this.tabshow;}
            this.formData.birthday = formatDate(this.formData.birthday);
                              this.axios.request({
          url: 'tenant/basedata/ttcustomerfile/save',
          method: 'post',
          data: {access_token: this.$store.state.user.token,
                 data:JSON.stringify(postData)
                }
        }).then(res => {
          if (res.success === true) {
             if(this.tabshow < 1){
              this.$Message.success('新增成功');
              this.tabshow = res.data.CUSTOMER_ID;
             }else{
              this.$Message.success('修改成功');
             }
          } 
        })
      },
      clear(){
        this.tabshow = 0;
        this.formData = {
          name:'',
          phone:'',
          address:'',
          tel:'',
          idcard:'',
          birthday:'',
          sex:'',
          resource:'',
          level:'',
          type:'',
          qq:'',
          wx:'',
          attach:'',
          email:'',
          snumber:'',
          remark:'',
        }
      },
      getList(){
                     this.axios.request({
          url: 'tenant/basedata/ttcustomerfile/list',
          method: 'post',
          data: {
            KEYWORD:"",
            PLATE_NUM:"",
            page: 1,
            limit: 25,
            access_token: this.$store.state.user.token
          }
        }).then(res => {
          if (res.success === true) {
            this.list = [];
            this.tableData= res.data
            this.total= res.total
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
      .table-bottom{
            position:relative;
            height: 52px;
            padding: 100px;
            width: 100%;
            left: 0;
            bottom: 0;
            background-color: white;
            z-index: 4;
        }
</style>
<style lang="less">
.table-modal-detail .ivu-modal-wrap .ivu-modal .ivu-modal-content .ivu-modal-body{
  padding-top:10px;
}
</style>