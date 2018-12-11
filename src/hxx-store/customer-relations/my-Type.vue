<template>
  <div style="width:250px;position:relative;">
  <Button type="blue">蓝白色</Button>
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
        name: "my-Type",
        data(){
          return {
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
      directives: {clickoutside},
      methods: {
        handleClose(e) {
         this.inputShow = false;
        },
        selectVehicle(){
          alert("可以");
        },
        onRowClick(row){

        },
        goToSelect(e){
         clearTimeout(this.timer);
         this.timer = setTimeout(()=>{
           this.getList(e.target.value);
           this.inputShow = true;
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
