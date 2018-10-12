<!--数据元管理 2018-10-09-->
<template>

        <Modal
            v-model="showModal"
            title=""
            width="90"
            @on-visible-change="visibleChange"
            :scrollable="true"
            :transfer= "true"
            :footer-hide="false"
            class="table-modal-detail"
            :mask-closable="false"
            :transition-names="['', '']">
            <Form :label-width="110">
            <FormItem label="故障描述:">
                <Input type="textarea" v-model="listSearch.input" placeholder="请输入故障描述"> </Input>
            </FormItem>
            <FormItem label="客诉内容:">
                <Input type="textarea" v-model="listSearch.input1" placeholder="请输入客诉内容"> </Input>
            </FormItem>
        </Form>
        </Modal>
</template>
<script>

    export default {
        name: "source-manage",
        components: { },
        data(){
            return{
                showModal:false,//新增按钮框的界面----
                listSearch:{
                    input:'',
                    input1:''
                },
                
            }
        },
        props:['showDetail'],
        watch:{
            showDetail(){
                this.showModal=true;
            }
            
        },
        mounted () {
           
        },
        computed:{
			
		},
        methods:{
            //缩放表格------
             visibleChange(){
                
            },
        },

    }
</script>

<style lang="less" scoped>

</style>
