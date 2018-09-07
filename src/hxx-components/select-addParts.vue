
<!--选择配件组件-新增配件档案 2018-08-23 -->
<template>
    <Modal
        v-model="showOnoff"
        title="新增配件档案"
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
       <Form ref="listSearch" :rules="ruleValidate"  :model="listSearch" slot="content" :label-width="110" inline class="detail-form">
          <FormItem label="配件名称:" prop="NAME">
              <Input type="text" v-model="listSearch.NAME" placeholder="" style="min-width: 250px;" >
              
              </Input>
          </FormItem>
          <FormItem label="原厂编号:">
              <Input type="text" v-model="listSearch.FACTORY_NO" placeholder="" style="min-width: 250px;" >
              
              </Input>
          </FormItem>
          <FormItem label="所属分类:" prop="TYPE_NAME">
              <Input @on-focus="showType=true;" type="text" v-model="listSearch.TYPE_NAME" placeholder="选择分类" style="min-width: 250px;" search >
              </Input>
          </FormItem>
          <FormItem label="采购指导价:">
              <InputNumber :min="0" v-model="listSearch.PURCHASE_PRICE" style="min-width: 250px;" placeholder="">
                    
              </InputNumber>
          </FormItem>
          <FormItem label="销售建议价:" prop="SALES_PRICE">
              <InputNumber :min="0" v-model="listSearch.SALES_PRICE" style="min-width: 250px;" placeholder="" @on-change="salesPriceFun"></InputNumber>
          </FormItem>
          <FormItem label="包装单位:" prop="UNIT">
              <Select v-model="listSearch.UNIT" placeholder="" style="min-width: 250px;" placeholder="选择包装单位">
                <Option v-for="(item, index) in initUnitArr"
                  :key="index" :value="item.code">{{item.name}}</Option>
              </Select>
          </FormItem>
          <FormItem label="税率:" >
              <Select v-model="listSearch.RATE" placeholder="" style="min-width: 250px;" placeholder="" @on-change="rateComputed">
                <Option v-for="(item, index) in initRateArr"
                  :key="index" :value="item.code">{{item.name}}</Option>
              </Select>
          </FormItem>
          <FormItem label="税额(元):">
              <Input type="text" v-model="listSearch.TAX" placeholder="" style="min-width: 250px;" disabled>
              </Input>
          </FormItem>
         <FormItem label="未含税价(元):">
              <Input type="text" v-model="listSearch.NOT_CONTAINS_TAX_SALE_PRICE" placeholder="" style="min-width: 250px;" disabled>
              </Input>
          </FormItem>
       </Form>
      </Panel>
      <Panel name="2">配件详细信息
       <Form  slot="content" :label-width="110" inline class="detail-form">

           <FormItem label="品牌:" >
              <Select v-model="listSearch.BRAND" placeholder="" style="min-width: 250px;" placeholder="选择品牌...">
                <Option v-for="(item, index) in initBrandArr"
                  :key="index" :value="item.code">{{item.name}}</Option>
              </Select>
          </FormItem>
          <FormItem label="规格:">
              <Input type="text" v-model="listSearch.FORMAT" placeholder="" style="min-width: 250px;" >
              </Input>
          </FormItem>
          
          <FormItem label="三包期:">
              <InputNumber :min="0" v-model="listSearch.THREE_EXPIRATION_DATE" style="min-width: 250px;" placeholder=""></InputNumber>
          </FormItem>
          <FormItem label="保质期:">
              <InputNumber :min="0" v-model="listSearch.EXPIRATION_DATE" style="min-width: 250px;" placeholder=""></InputNumber>
          </FormItem>
          <FormItem label="配件来源:" >
              <Select v-model="listSearch.PART_SOURCE" placeholder="" style="min-width: 250px;" placeholder="选择来源...">
                <Option v-for="(item, index) in initPartSource"
                  :key="index" :value="item.code">{{item.name}}</Option>
              </Select>
          </FormItem>
       </Form>
      </Panel>
      <Panel name="3">配件限价信息
       <Form  slot="content" :label-width="110" inline class="detail-form">

          <FormItem label="采购最低价:">
              <InputNumber :min="0" v-model="listSearch.MIN_SHOP_PRICE" style="min-width: 250px;" placeholder=""></InputNumber>
          </FormItem>
          <FormItem label="销售最低价:">
              <InputNumber :min="0" v-model="listSearch.MIN_SALES_PRICE" style="min-width: 250px;" placeholder=""></InputNumber>
          </FormItem>
          <FormItem label="安全库存:">
              <InputNumber :min="0" v-model="listSearch.SAFE_STOCK_NUM" style="min-width: 250px;" placeholder=""></InputNumber>
          </FormItem>
          <FormItem label="采购最高价:">
              <InputNumber :min="0" v-model="listSearch.MAX_SHOP_PRICE" style="min-width: 250px;" placeholder=""></InputNumber>
          </FormItem>
          <FormItem label="销售最高价:">
              <InputNumber :min="0" v-model="listSearch.MAX_SALES_PRICE" style="min-width: 250px;" placeholder=""></InputNumber>
          </FormItem>
          <FormItem label="最高库存:">
              <InputNumber :min="0" v-model="listSearch.MAX_STOCK_NUM" style="min-width: 250px;" placeholder=""></InputNumber>
          </FormItem>
          
       </Form>
      </Panel>
    </Collapse>
        <Modal
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
    </Modal>
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
        props:['showSelectAddParts','initPartsGroup'],
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
                    "MAX_STOCK_NUM":0
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
                    "MAX_STOCK_NUM":0
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
                for(let i in this.listSearch){
                    this.listSearch[i]=this.initList[i];
                }
                this.selectPartsType();
            }
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
                    console.log('i',i);
                    console.log('datai',data.children);
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
                console.log(val);
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

<style lang="less" scoped>
    .search-block{
        display: inline-block;
        width: 200px;
        margin-right: 10px;
    }
    .common-table{
        padding: 10px;
        background-color: white;
        height: 100%;
        overflow: hidden;
        position: relative;
        .table-search{
        }
        .operate{
            margin-top: 10px;
            padding: 15px;
            border: 1px solid #dcdee2;
            border-radius: 3px;
        }
        .main-table{
            margin-top: 10px;
        }
        .table-bottom{
            position: absolute;
            height: 52px;
            padding: 10px;
            width: 100%;
            left: 0;
            bottom: 0;
            background-color: white;
            z-index: 4;
        }
    }
</style>
