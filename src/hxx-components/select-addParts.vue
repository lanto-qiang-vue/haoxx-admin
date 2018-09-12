
<!--选择配件组件-新增配件档案 2018-08-23 -->
<template>
    <Modal
        v-model="showOnoff"
        title="新增配件档案"
        class="table-modal-detail"
        width="90"
        :scrollable="true"
        @on-visible-change="visibleChange"
        :transfer= "false"
        :footer-hide="false"
        :transition-names="['', '']"
    >
    <div style="height: 100%;overflow: auto;">
        <Collapse v-model="collapse">
      <Panel name="1">配件基本信息
       <Form ref="listSearch" :rules="ruleValidate"  :model="listSearch" slot="content" :label-width="110" inline class="common-form">
          <FormItem label="配件名称:" style="width:30%;" prop="NAME">
              <Input type="text" v-model="listSearch.NAME" placeholder="">
              </Input>
          </FormItem>
          <FormItem label="原厂编号:" style="width:30%;">
              <Input type="text" v-model="listSearch.FACTORY_NO" style="width:100%;" placeholder="" >
              </Input>
          </FormItem>
          <FormItem label="所属分类:" style="width:30%;" prop="TYPE_NAME">
              <!-- 特殊下拉 -->
    <Dropdown trigger="click" style="width: 100%" id="select-type" placement="bottom-start">
        <!-- <a href="javascript:void(0)"> -->
          <Input type="text" v-model="listSearch.TYPE_NAME" placeholder="选择分类"  search >
          </Input>
        <!-- </a> -->
        <DropdownMenu slot="list">
                    <Tree :data="data1" @on-select-change="selectChangeTree" 
                    style="width: 100%;max-height: 300px;overflow: auto;"></Tree>
        </DropdownMenu>
    </Dropdown>
    <!-- 特殊下拉结束 -->
          </FormItem>
          <FormItem style="width:30%;" label="采购指导价:">
              <InputNumber :min="0" style="width:100%;" v-model="listSearch.PURCHASE_PRICE" placeholder="">
                    
              </InputNumber>
          </FormItem>
          <FormItem label="销售建议价:" style="width:30%;" prop="SALES_PRICE">
              <InputNumber :min="0" style="width:100%;" v-model="listSearch.SALES_PRICE" placeholder="" @on-change="salesPriceFun"></InputNumber>
          </FormItem>
          <FormItem label="包装单位:" style="width:30%;" prop="UNIT">
              <Select v-model="listSearch.UNIT" placeholder="" style="width:100%;" placeholder="选择包装单位">
                <Option v-for="(item, index) in initUnitArr"
                  :key="index" :value="item.code">{{item.name}}</Option>
              </Select>
          </FormItem>
          <FormItem label="税率:" style="width:30%;" >
              <Select v-model="listSearch.RATE" placeholder="" style="width:100%;" placeholder="" @on-change="rateComputed">
                <Option v-for="(item, index) in initRateArr"
                  :key="index" :value="item.code">{{item.name}}</Option>
              </Select>
          </FormItem>
          <FormItem label="税额(元):" style="width:30%;">
              <Input type="text" v-model="listSearch.TAX" placeholder="" style="width:100%;" disabled>
              </Input>
          </FormItem>
         <FormItem label="未含税价(元):" style="width:30%;">
              <Input type="text" v-model="listSearch.NOT_CONTAINS_TAX_SALE_PRICE" placeholder="" style="width:100%;" disabled>
              </Input>
          </FormItem>
       </Form>
      </Panel>
      <Panel name="2">配件详细信息
       <Form  slot="content" :label-width="110" inline class="detail-form">

           <FormItem label="品牌:" style="width:30%;" >
              <Select v-model="listSearch.BRAND" placeholder="" style="width:100%;" placeholder="选择品牌...">
                <Option v-for="(item, index) in initBrandArr"
                  :key="index" :value="item.code">{{item.name}}</Option>
              </Select>
          </FormItem>
          <FormItem label="规格:" style="width:30%;">
              <Input type="text" v-model="listSearch.FORMAT" placeholder="" style="width:100%;" >
              </Input>
          </FormItem>
          
          <FormItem label="三包期:" style="width:30%;">
              <InputNumber :min="0" v-model="listSearch.THREE_EXPIRATION_DATE" style="width:100%;" placeholder=""></InputNumber>
          </FormItem>
          <FormItem label="保质期:" style="width:30%;">
              <InputNumber :min="0" v-model="listSearch.EXPIRATION_DATE" style="width:100%;" placeholder=""></InputNumber>
          </FormItem>
          <FormItem label="配件来源:" style="width:30%;">
              <Select v-model="listSearch.PART_SOURCE" placeholder="" style="width:100%;" placeholder="选择来源...">
                <Option v-for="(item, index) in initPartSource"
                  :key="index" :value="item.code">{{item.name}}</Option>
              </Select>
          </FormItem>
       </Form>
      </Panel>
      <Panel name="3">配件限价信息
       <Form  slot="content" :label-width="110" inline class="common-form">

          <FormItem label="采购最低价:" style="width:30%;">
              <InputNumber :min="0" v-model="listSearch.MIN_SHOP_PRICE" style="width:100%;" placeholder=""></InputNumber>
          </FormItem>
          <FormItem label="销售最低价:" style="width:30%;">
              <InputNumber :min="0" v-model="listSearch.MIN_SALES_PRICE" style="width:100%;" placeholder=""></InputNumber>
          </FormItem>
          <FormItem label="安全库存:" style="width:30%;">
              <InputNumber :min="0" v-model="listSearch.SAFE_STOCK_NUM" style="width:100%;" placeholder=""></InputNumber>
          </FormItem>
          <FormItem label="采购最高价:" style="width:30%;">
              <InputNumber :min="0" v-model="listSearch.MAX_SHOP_PRICE" style="width:100%;" placeholder=""></InputNumber>
          </FormItem>
          <FormItem label="销售最高价:" style="width:30%;">
              <InputNumber :min="0" v-model="listSearch.MAX_SALES_PRICE" style="width:100%;" placeholder=""></InputNumber>
          </FormItem>
          <FormItem label="最高库存:" style="width:30%;">
              <InputNumber :min="0" v-model="listSearch.MAX_STOCK_NUM" style="width:100%;" placeholder=""></InputNumber>
          </FormItem>
          
       </Form>
      </Panel>
    </Collapse>
<!--         <Modal
        v-model="showType"
        title="配件分类列表"
        width="90"
        :scrollable="true"
        :transfer= "false"
        :footer-hide="false"
        :transition-names="['', '']"
    >
        <div>
            <Card :bordered="false">
                <p slot="title" style="text-align: center;">分类名称</p>
                <div>
                    <Tree :data="data1" @on-select-change="selectChangeTree"></Tree>
                </div>
            </Card>
        </div>
    </Modal> -->
    </div>
    
    <div slot="footer">
        <Button @click="saveData('listSearch');" size="large" type="primary"  style="margin-right: 10px;">保存</Button>
        

    </div>
    

    
  </Modal>
</template>

<script>

  import { getName, getDictGroup } from '@/libs/util.js'
	export default {
		name: "select-addParts",
        props:['showSelectAddParts','initPartsGroup','editdata'],
        components: {},
        data(){
            return{
                showType:false,
                showOnoff:false,
                collapse:["1","2","3"],
                initUnitArr:[],
                initRateArr:[
                    {code:0,name:"0%"},
                    {code:0.03,name:"3%"},
                    {code:0.06,name:"6%"},
                    {code:0.13,name:"13%"},
                ],
                initBrandArr:[],
                initPartSource:[],
                listSearch:{
                    "PART_ID":"",
                    "TYPE_ID":"",
                    "NAME":"",
                    "FACTORY_NO":"",
                    "TYPE_NAME":"",
                    "PURCHASE_PRICE":0,
                    "SALES_PRICE":0,
                    "UNIT":"",
                    "RATE":0,
                    "TAX":"",
                    "NOT_CONTAINS_TAX_SALE_PRICE":"",
                    "BRAND":"",
                    "FORMAT":"",
                    "THREE_EXPIRATION_DATE":0,
                    "EXPIRATION_DATE":0,
                    "PART_SOURCE":"",
                    "MIN_SHOP_PRICE":0,
                    "MIN_SALES_PRICE":0,
                    "SAFE_STOCK_NUM":0,
                    "MAX_SHOP_PRICE":0,
                    "MAX_SALES_PRICE":0,
                    "MAX_STOCK_NUM":0,
                    "TYPE_ID":'',
                },
                initList:{
                    "PART_ID":"",
                    "TYPE_ID":"",
                    "NAME":"",
                    "FACTORY_NO":"",
                    "TYPE_NAME":"",
                    "PURCHASE_PRICE":0,
                    "SALES_PRICE":0,
                    "UNIT":"",
                    "RATE":0,
                    "TAX":"",
                    "NOT_CONTAINS_TAX_SALE_PRICE":"",
                    "BRAND":"",
                    "FORMAT":"",
                    "THREE_EXPIRATION_DATE":0,
                    "EXPIRATION_DATE":0,
                    "PART_SOURCE":"",
                    "MIN_SHOP_PRICE":0,
                    "MIN_SALES_PRICE":0,
                    "SAFE_STOCK_NUM":0,
                    "MAX_SHOP_PRICE":0,
                    "MAX_SALES_PRICE":0,
                    "MAX_STOCK_NUM":0,
                    "TYPE_ID":'',
                },
                ruleValidate: {
                    NAME:[{required: true, message: '配件名称必填'}],
                    TYPE_NAME:[{required: true, message: '配件分类必填'}],
                    SALES_PRICE:[{required: true, message: '价格必填'}],
                    UNIT:[{required: true, message: '单位必填'}],
                },
                treeData:[],
                data1:[],
            }
        },
        watch:{
            showSelectAddParts(){
                this.showOnoff=true;

                if(this.editdata){
                    console.log('谢瑞翔个猪')
                    this.listSearch = this.editdata;
                }else{
                    
                    this.listSearch={
                        "PART_ID":"",
                        "TYPE_ID":"",
                        "NAME":"",
                        "FACTORY_NO":"",
                        "TYPE_NAME":"",
                        "PURCHASE_PRICE":0,
                        "SALES_PRICE":0,
                        "UNIT":"",
                        "RATE":0,
                        "TAX":"",
                        "NOT_CONTAINS_TAX_SALE_PRICE":"",
                        "BRAND":"",
                        "FORMAT":"",
                        "THREE_EXPIRATION_DATE":0,
                        "EXPIRATION_DATE":0,
                        "PART_SOURCE":"",
                        "MIN_SHOP_PRICE":0,
                        "MIN_SALES_PRICE":0,
                        "SAFE_STOCK_NUM":0,
                        "MAX_SHOP_PRICE":0,
                        "MAX_SALES_PRICE":0,
                        "MAX_STOCK_NUM":0,
                        "TYPE_ID":'',
                    };
                   
                }
                this.selectPartsType();
            },
            // editdata(row){
            // if(row != '') this.listSearch = row;
            // },
        },
        mounted() {
            this.initUnitArr=getDictGroup(this.$store.state.app.dict, '1015');
            this.initBrandArr=getDictGroup(this.$store.state.app.dict, '1016');
            this.initPartSource=getDictGroup(this.$store.state.app.dict, '1017');
        },
        methods:{
            saveData(name){

                this.$refs[name].validate((valid) => {
                    if (valid) {
                      var flag = "";
                      if(this.listSearch.SALES_PRICE > this.listSearch.MAX_SALES_PRICE){flag = "销售建议价应小于等于销售最高价!"};
                      if(this.listSearch.SALES_PRICE < this.listSearch.MIN_SALES_PRICE){flag = "销售建议价应大于等于销售最低价!"};
                      if(this.listSearch.MIN_SALES_PRICE < this.listSearch.MAX_SHOP_PRICE){flag = "销售最低价应大于等于采购最高价!"};
                      if(this.listSearch.MAX_SHOP_PRICE < this.listSearch.MIN_SHOP_PRICE){flag = "采购最高价应大于等于采购最低价!"};
                      if(this.listSearch.MAX_SALES_PRICE < this.listSearch.MIN_SALES_PRICE){flag = "销售最高价应大于等于销售最低价!"};
                      //采购指导价PURCHASE_PRICE
                      if(this.listSearch.PURCHASE_PRICE < this.listSearch.MIN_SHOP_PRICE){flag = "采购最低价应小于等于采购指导价!"};
                      if(this.listSearch.PURCHASE_PRICE > this.listSearch.MAX_SHOP_PRICE){flag = "采购最高价应大于等于采购指导价!";
                      }
                      if(flag != ""){
                      this.$Modal.error({title:'系统提示',content:flag});
                      return false;
                      }
                      if(this.listSearch)
                                this.$Modal.confirm({
                                    title:"系统提示!",
                                    content:"确定要保存吗？",
                                    onOk:this.del,
                                    
                                })
                    } else {
                        this.$Message.error('请填写必选项...');
                    }
                });

            },
            salesPriceFun(val){
                this.listSearch.SALES_PRICE=val;
                
                this.listSearch.NOT_CONTAINS_TAX_SALE_PRICE=(val/(this.listSearch.RATE+1)).toFixed(2);
                this.listSearch.TAX=(this.listSearch.NOT_CONTAINS_TAX_SALE_PRICE*this.listSearch.RATE).toFixed(2);
            },
            rateComputed(val){
                this.listSearch.NOT_CONTAINS_TAX_SALE_PRICE=(this.listSearch.SALES_PRICE/(this.listSearch.RATE+1)).toFixed(2);
                this.listSearch.TAX=(this.listSearch.NOT_CONTAINS_TAX_SALE_PRICE*this.listSearch.RATE).toFixed(2);

                
                
            },
            del(){
              //这里是添加操作 就服你名字都不换....社会我鑫哥....人狠话不多....
                this.axios.request({
                    url: '/tenant/basedata/partinfo/save',
                    method: 'post',
                    data: {
                    data: JSON.stringify(this.listSearch),
                    access_token: this.$store.state.user.token
                    }
                }).then(res => {
                    if (res.success === true) {
                        this.$Message.info('successful')
                        this.$emit('refresh');
                        this.showOnoff=false;
                    }
                })
            },
            selectPartsType(){
                this.axios.request({
                    url: '/tenant/basedata/partinfo/part_type_tree',
                    method: 'post',
                    data: {
                        access_token: this.$store.state.user.token
                    }
                }).then(res => {
                    if (res.success === true) {
                        var data = [];
                        data.push(res.data)
                        this.getNameFun(data)
                    }
                })
            },
            getNameFun(data){
                for (let i in data) {
                    if (data[i].nodeName) {
                        data[i]["title"]=data[i].nodeName;
                        this.getNameFun(data[i].children);
                    } else {
                        
                    }
                }
                this.data1=data;
            },
            selectChangeTree(val){
                this.showType=false;
                this.listSearch["TYPE_NAME"]=val[0].title;
                this.listSearch.TYPE_ID = val[0].title == '配件分类' ? '' :val[0].nodeId;
            },
            //弹出层状态变化--------
        visibleChange(status){
            if(status === false){
                this.$emit('closeDetail');
                this.handleReset("listSearch");
                this.$emit('clearsection');
            }
        },
        //校验重置
        handleReset (name) {
            this.$refs[name].resetFields();
        },

        }
	}
</script>
<style lang="less">
   #select-type{
      .ivu-select-dropdown{
        width: 250px
      }
    }
</style>