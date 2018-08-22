<template>
    <div>
    <Modal
        v-model="show"
        :title="title"
        :loading="loading"
        :mask-closable="false"
        @on-ok="asyncOK"
        @on-cancel="asyncNo"
        >
        <p>{{description}}</p>
    </Modal>
</div>
</template>
<script>
    export default {
        name:'common-modal6',
        data () {
            return {
                loading: true,
                show:false
            }
        },
        props:{
            title:{type:String,default(){return '传递组件title'}},
            description:{type:String,default(){return '传递组件说明'}},
            modal6:{},
            fun:{type:String,default(){return '父级接收函数'}}
        },
        // props:['title','description','modal6','fun '],
        watch:{
            modal6(){
            this.show=true
            }
        },
        methods: {
            asyncOK () {
                this.$emit(this.fun);
                this.show = false;
            },
            asyncNo(){
             // this.$emit('changeModal6',false);
            }
        }
    }  
</script>

