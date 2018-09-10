<template>
    <Split v-model="split" :min="0.1" :max="0.5" class="split">
    <div slot="left" class="split-pane">
      <Button type="primary" style="margin-left:5px;">添加车间</Button>
      <Button type="primary" style="margin-left:5px;">添加班组</Button>
      <Button type="info" style="margin-left:5px;">修改</Button>
      <div style="width:100%;line-height:30px;border-top:1px solid black;border-bottom:1px solid black;text-align: center;">车间名称</div>
    <Tree :data="data2" @on-select-change="getnode"></Tree>
    </div>
    <div slot="right">
    	我是右边
    </div>
</Split>
</template>
<script>
	export default{
		name:'work-team',
		data(){
		 return {
		  split:0.2,
		  data2:[],
		 }
		},
		methods:{
			getnode(){},
			machine(data){
           data['title'] = data.nodeName;
           var flag = data.children ? true : false;
           if(flag){
            for(var i=0;i<data.children.length;i++){
              this.machine(data.children[i]);
            }
           }else{

           }
           return data;
          },
			getwork(){
				///tenant/basedata/ttworkshop/get_work_shop_list
		  this.axios.request({
          url: '/tenant/basedata/ttworkshop/get_work_shop_list',
          method: 'post',
          data: {access_token: this.$store.state.user.token}
        }).then(res => {
          if (res.success === true) {
           this.data2 = [];
           var data = this.machine(res.data);
           data['expand'] = true;
           this.data2.push(data);
          }
        })

			},
		},
		mounted(){
			this.getwork();
		}
	}
</script>