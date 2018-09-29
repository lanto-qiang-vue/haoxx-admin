<template>			
<div>
	   <div>
          <Input  placeholder="参数名称..." v-model="keyword" style="width: 300px"></Input>
      <ButtonGroup size="small">
        <Button type="primary" @click="getList()"><Icon type="ios-search" size="24"/></Button>
        <Button type="primary" @click="clear()"><Icon type="ios-undo" size="24"/></Button>
      </ButtonGroup>
          </div>
	 <Collapse v-if="item.data.length > 0" v-model="collapse" v-for="(item, key, index) in handle" :key="key">
	      <Panel :name="String(index)">
	          {{item.name+'(共'+item.data.length+'条)'}}
	          <Table slot="content" :columns="columns" :data="item.data"></Table>
	      </Panel>
	  </Collapse>
</div>
</template>
<script>
	import { getName, getDictGroup, getCreate } from '@/libs/util.js'
	export default{
		name:'system-parameter',
		data(){
		    return {
		     collapse:[],
		     keyword:'',
		     page:1,
		     limit:25,
		     timer:'',
		     columns:[
		     {title: '序号',  minWidth: 80,align:'center',
             render: (h, params) => h('span', (this.page-1)*this.limit+params.index+1)
             },
		     {title: '参数名称',key:'PARAM_NAME',minWidth: 200,align: 'center'},
		     {title: '参数值',key:'PARAM_VALUE',minWidth: 200,align: 'center',
		     render: (h, params) => {
		     	        let store = params.row.PARAM_VALUE;
		     	        let stype = params.row.INPUT_TYPE
		     	        if(stype != 3){
		     	        	return h('div', [
                            h('Input', {
                                props: {
                                    value: params.row.PARAM_VALUE,
                                },
                                on: {
                                    "on-blur":(e)=>{
                                    	let self=this;
                                        if(stype == 2){
                                        	let reg = /^[0-9]*$/;
                                         if(!reg.test(e.target.value)){
                                          e.target.value = store;
                                         }else{
                                          if(e.target.value != store) self.update(params.row,e.target.value); 
                                          store = e.target.value;
                                         }
                                        }else{
                                         if(e.target.value == ''){
                                         	e.target.value = store;
                                         }else{
                                          if(e.target.value != store) self.update(params.row,e.target.value);
                                         	store = e.target.value;
                                         }
                                        }
                                    },
                                    
                                }
                            },
                            )
                        ]);
		     	        }else{
		     	     let list  = params.row.SEL_TEXTS.split(',');
		     	     let arr = [];
		     	     for(var i in list){
		     	     	// alert(i+1);
		     	     	var sk = parseInt(i)+1;
		     	     	var sks = sk+"";
		     	     	arr.push({key:sks,name:list[i]});
		     	     }
		     	    return h('RadioGroup', {
                    props:{
                        value:params.row.PARAM_VALUE,
                    },
                    on: {
                        'on-change':(e) => {
                        	this.update(params.row,e);
                        }
                    },
                },
                arr.map(function(type){
                    return h('Radio', {
                        props: {
                            label: type.key,
                        }
                    }, type.name);
                })
              );
		     	        }
     
                    }
		     },
		     {title: '设置说明',key:'NOTICE',minWidth: 200,align: 'center'}
		     ],
		     tableData:[],
		     datas: {}
		    }
		},
		methods:{
			clear(){
				this.keyword = "";
			},
			update(row,up){
			row.PARAM_VALUE = up;
				///tenant/sys/params/save
				this.axios.request({
				url: '/tenant/sys/params/save',
				method: 'post',
				data: {access_token: this.$store.state.user.token,
						data:JSON.stringify(row)
						}
				}).then(res => {
				if (res.success === true) {
						this.axios.request({
							url: '/tenant/common/getLoginUser',
							method: 'post',
							data: {
							access_token: this.$store.state.user.token
							}
						}).then(res => {
							if (res.success === true) {
								
								this.$store.commit('setUser', res.data)
							
							}
						})


				}
				})
			},
			getList(){
		  this.axios.request({
          url: '/tenant/sys/params/list',
          method: 'post',
          data: {access_token: this.$store.state.user.token,
                 limit:25,
                 page:1,
                }
        }).then(res => {
          if (res.success === true) {
          	this.tableData = res.data;
          	// this.handle;
          }
        })
			},
		},
		computed:{
			typeList(){
			return getDictGroup(this.$store.state.app.dict,'1029');
			},
		    handle(){
				var typeList={}
				let index=0
				for(var i in this.tableData){
					typeList[this.tableData[i].TYPE]= {
						name: getName(this.typeList, this.tableData[i].TYPE)|| this.tableData[i].TYPE,
						data: []
					}
				}
				var indexList = [];
				for (let key in typeList){
					for(let i in this.tableData){
						if(this.tableData[i].TYPE== key && this.tableData[i].PARAM_NAME.indexOf(this.keyword) > -1){
							typeList[key].data.push(this.tableData[i])
						}
					}
					indexList.push(String(index))
					index++
				}
				if(this.collapse.length == 0) this.collapse = indexList;
				return typeList;
			},
		},
		mounted(){
			this.getList();
		}
	}
</script>
