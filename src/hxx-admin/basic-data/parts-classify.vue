<template>
  <div style="height:100%;width:100%">
    <Collapse v-model="value1">
      <Panel name="1">
        <div slot="content">
          <Button @click="expandAll">{{expandName}}</Button>
          <Button @click="changeData" style="margin-left:10px;">刷新</Button>
          <Button type="primary" @click="addNode" :disabled="cando" style="margin-left:10px;">添加</Button>
          <Button type="info" @click="editNode" :disabled="cando" style="margin-left:10px;">修改</Button>
          <Button type="error" @click="deleteNode" :disabled="cando" style="margin-left:10px;">删除</Button>
          <div style="height:10px;"></div>
          <table id="table">
            <tr>
              <th>分类名称</th>
              <th>分类说明</th>
            </tr>
          </table>
          <unit-tree v-for="item in treeData" :clearType="clearType" :changeAll="changeAll" @cancelColor="cancelColor" :id="id"
                     :data="item.children" :fatherId="item.fatherId" :nodeId="item.nodeId" :remark="item.remark" :level="1" :name="item.nodeName"
                     :indexId="0"></unit-tree>
          <Spin v-if="spinShow" size="large" style="width:100%;height:100%;"></Spin>
        </div>
      </Panel>
    </Collapse>
    <Modal
      v-model="showModal"
      title="配件分类编辑"
      :width="400"
      :mask-closable="false"
      :scrollable="true"
      :transfer="true"
      :footer-hide="false"
      :transition-names="['', '']">
      <Form :model="formData" ref="formData" :rules="rules" :label-width="100">
        <FormItem label="类型名称:" style="width:90%;" prop="TYPE_NAME">
          <Input v-model="formData.TYPE_NAME" :maxlength="40" type="text"> </Input>
        </FormItem>
        <FormItem label="上一级分类:" style="width:90%;" prop="FATHER_NAME">
          <Input v-model="formData.FATHER_NAME"  :disabled="true"  type="text"> </Input>
        </FormItem>
        <FormItem label="备注:" style="width:90%;">
          <Input v-model="formData.REMARK" type="textarea" :maxlength="40" placeholder="请输入描述信息..."></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="addCancel">取消</Button>
        <Button type="primary" @click="addPost('formData');">保存</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import unitTree from '@/hxx-components/unit-tree.vue'

  export default {
    name: "parts-classify",
    components: {unitTree},
    data() {
      return {
        indexId: 0,
        expandName:'全部展开',
        value1: '1',
        treeData: [],
        spinShow: false,
        showModal:false,
        FATHER_ID:'',
        PARENT_ID:'',
        FATHER_NAME:'',
        TYPE_LEVEL:'',
        name:'',
        remark:'',
        indexName:'当前级的名字',
        id: '',
        changeAll: false,
        clearType:false,
        formData:{
          "TYPE_ID": "",
          "FATHER_ID": "",
          "TYPE_LEVEL": "",
          "TYPE_NAME": "",
          "FATHER_NAME": "",
          "REMARK": ""
        },
        rules:{
          TYPE_NAME:{required:true,message:'类型名称必填'}
        },
      }
    },
    mounted() {
      this.changeData();
    },
    watch: {},
    methods: {
      editNode(){
        this.formData.TYPE_ID = this.FATHER_ID;
        this.formData.FATHER_ID = this.PARENT_ID;
        this.formData.TYPE_LEVEL = this.TYPE_LEVEL - 1;
        this.findName(this.treeData,this.PARENT_ID);
        this.formData.REMARK = this.remark;
        this.formData.TYPE_NAME = this.name;
        if(this.formData.TYPE_LEVEL > 0){
          this.showModal = true;
        }
      },
      findName(data,id){
        for(let i in data){
          if(data[i].nodeId == id){
            this.formData.FATHER_NAME =  data[i].nodeName;
            break;
          }else{
            if(data[i].children){
              this.findName(data[i].children,id);
            }
          }
        }
      },
      addCancel(){
        this.showModal = false;
      },
      addPost(name){
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$Modal.confirm({
              title: '系统提示',
              content: '确认保存吗?',
              onOk: this.toSave,
            });
          } else {
            this.$Message.error("请校对红框信息");
          }
        })
      },
      toSave(){
        this.axios.request({
          url: '/manage/basedata/part_type/save',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            data:JSON.stringify(this.formData)
          }
        }).then(res => {
          if (res.success === true) {
            if(this.formData.TYPE_ID == ""){
              // let data = res.data;
              // let obj = {nodeId:data.TYPE_ID,nodeName:data.TYPE_NAME,remark:data.REMARK,fatherId:data.FATHER_ID};
              // let mydata =  this.treeSet(this.treeData,obj);
              // this.treeData = mydata;
            }else{
              // let data = res.data;
              // let obj = {nodeId:data.TYPE_ID,nodeName:data.TYPE_NAME,remark:data.REMARK,fatherId:data.FATHER_ID};
              // let mydata =  this.treeSet(this.treeData,obj);
              // this.treeData = [];
              // let self = this;
              // setTimeout(function(){self.treeData = [mydata]},'100');
            }
            this.showModal = false;
          }
        })
      },
      treeSet(data,obj){
        // console.log(JSON.stringify(data));
       for(let i in data){
         let flag = data[i].children ? true : false;
         if(data[i].nodeId == this.FATHER_ID){
            if(flag){
              data[i].children.push(obj);
              // alert(1);
            }else{
              data[i].children = [];
              data[i].children.push(obj);
              // alert(2);
            }
         }else{
           if(flag){
             this.treeSet(data[i].children,obj);
           }
         }
       }
       return data;
      },
      deleteNode(){
        this.$Modal.confirm({title:'系统提示',content:'确认删除',onOk:this.del});
      },
      del(){
        this.axios.request({
          url: '/manage/basedata/part_type/delete',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            id:this.FATHER_ID
          }
        }).then(res => {
          if (res.success === true && res.data == true) {
           let mydata = this.setDel(this.treeData);
           this.FATHER_ID = "";
           this.treeData = mydata;
          }
        })
      },
      setDel(data){
        // console.log(JSON.stringify(data));
        for(let i = 0; i< data.length;i++){
          if(data[i].nodeId == this.FATHER_ID){
            data.splice(i,1);
            this.clearType = Math.random();
          }else{
            let flag = data[i].children ? true : false;
            if(flag) this.setDel(data[i].children);
          }
        }
        return data;
      },
      addNode() {
        if(this.TYPE_LEVEL < 4){
          this.showModal = true;
          this.$refs['formData'].resetFields();
          this.formData.TYPE_LEVEL = this.TYPE_LEVEL;
          this.formData.FATHER_NAME = this.FATHER_NAME;
          this.formData.FATHER_ID = this.FATHER_ID;
          this.formData.TYPE_ID = "";
          this.formData.REMARK = "";
        }else{
          this.$Modal.info({title:'系统提示',content:'不能再添加下一级分类了'});
        }
      },
      expandAll() {
        if(this.changeAll){
          this.expandName = "全部展开";
        }else{
          this.expandName = "全部收起";
        }
        this.changeAll = !this.changeAll;

      },
      changeData() {
        this.treeData = [];
        this.FATHER_ID = '';
        this.clearType = Math.random();
        this.spinShow = true;
        this.axios.request({
          url: '/manage/basedata/part_type/part_type_tree',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
          }
        }).then(res => {
          if (res.success === true) {
            this.treeData = [res.data];
          }
          this.spinShow = false;
        })
      },
      cancelColor(data) {
        this.FATHER_ID = data.nodeId;
        this.TYPE_LEVEL = data.level;
        this.FATHER_NAME = data.indexName;
        this.id = data.nodeId;
        this.indexName = data.indexName;
        this.PARENT_ID = data.fatherId;
        this.name = data.name;
        this.remark = data.remark;
        // console.log(JSON.stringify(data));
      }
    },
    computed:{
      cando(){
        return this.FATHER_ID < 0 || this.FATHER_ID == "";
      }
    }
  }
</script>

<style lang="less" scoped>
  #table {
    width: 100%;
    border: 1px solid;
    border-collapse: collapse;
    th {
      border: 1px solid;
      line-height: 30px;
    }
  }
</style>
