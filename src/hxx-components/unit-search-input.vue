<template>
  <div style="width:450px;position:relative;">
    <Input v-model="inputData" type="text" @on-keyup="goToSelect" :readonly="disType">
      <Icon type="ios-search" slot="suffix" @click="selectVehicle" style="cursor:pointer;"/>
    </Input>
    <span style="position:absolute;right:32px;top:2px;cursor: pointer;z-index: 100;font-size: 16px;" v-show="selectType" @click="closeSelect"><Icon type="ios-close-circle" /></span>
    <div v-show="inputShow" v-clickoutside="handleClose" style="position:absolute;top:31px;z-index:99;">
      <Table
        :data="data"
        :columns="tableColumns"
        stripe
        border
        height="400"
        width="450"
        :highlight-row="true"
        :loading="loading"
        :row-class-name="rowClassName"
        @on-row-click="onRowClick"
      >
      </Table>
    </div>
  </div>
</template>
<script>
  const clickoutside = {
    bind(el, binding, node) {
      function documentHandler(e) {
        if (el.contains(e.target)) {
          return false;
        }
        if (binding.expression) {
          binding.value(e);
        }
      }
      el.__vueClickOutside__ = documentHandler;
      document.addEventListener('click', documentHandler);
    },
    update() {},
    unbind(el, binding) {
      document.removeEventListener('click', el.__vueClickOutside__);
      delete el.__vueClickOutside__;
    },
  };
  export default {
    name: "unit-search-input",
    props:['searchTableData',"showChange"],
    data(){
      return {
        inputData:'',
        inputShow:false,
        disType:false,
        selectType:false,
        timer:null,
        data:[],
        loading:false,
        tableColumns:[
          {title: '车型', key: 'MODEL_NAME', sortable: true, minWidth: 140},
          {title: '品牌', key: 'PP_NAME', sortable: true, minWidth: 140},
          {title: '国产/进口', key: 'JK_NAME', sortable: true, minWidth: 140},
          {title: '厂商', key: 'CS_NAME', sortable: true, minWidth: 140},
          {title: '车系名称', key: 'CX_NAME', sortable: true, minWidth: 140},
          {title: '市场指导价', key: 'SCZDJ', sortable: true, minWidth: 140,
            render: (h, params) => h('span', this.formatMoney(params.row.SCZDJ))
          },
          {title: '发动机', key: 'FDJ', sortable: true, minWidth: 140},
          {title: '变速器', key: 'BSQ', sortable: true, minWidth: 140},
          {title: '驱动形式', key: 'QDFS', sortable: true, minWidth: 140},
        ],
      }
    },
    watch:{
      showChange(){
        // alert('进来了');
        if(this.searchTableData){
          this.inputData=this.searchTableData;
          this.selectType=true;
          this.disType=true;
        }else{
          this.inputData='';
          this.selectType=false;
          this.disType=false;
        }
        
      }
    },
    directives: {clickoutside},
    methods: {
      handleClose(e) {
        
        
        if(this.inputShow){
          
          //  let row={};
          //   row['MODEL_NAME']=this.inputData;
          //   row['TID']='';
          //   this.$emit('onRowSelect',row);
        }
        this.inputShow = false;
       
      },
      //给父级弹出车型框--------
      selectVehicle(){
        this.$emit('showTableFun');
      },
      //清空搜索数据
      closeSelect(){
        // alert('不可以');
        this.inputData="";
        this.selectType=false;
        this.disType=false;
        this.$emit('closeSelect');
      },
      onRowClick( row, index){
          console.log('row：',row);
          this.inputShow = false;
          this.selectType=true;
          this.disType=true;
          this.inputData=row.MODEL_NAME;
          this.$emit('onRowSelect',row);
      },
      rowClassName(row, index){
        // console.log('row：',row);
      },
      goToSelect(e){
        clearTimeout(this.timer);
        this.timer = setTimeout(()=>{
          this.getList(e.target.value);
          this.inputShow = true;

          let row={};
            row['MODEL_NAME']=this.inputData;
            row['TID']='';
            this.$emit('onRowSelect',row);
        },500);
      },
      getList(value){
        this.loading = true;
        this.axios.request({
          url: '/tenant/basedata/vehiclemodel/list',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            limit:25,
            page:1,
            KEYWORD:value,
          }
        }).then(res => {
          if (res.success === true) {
            this.data = res.data;
            this.loading = false;
          }
        })
      },
    },
  }
</script>

<style scoped>

</style>
