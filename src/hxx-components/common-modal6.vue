<template>
    <div>
    <Modal
        v-model="modal6"
        :title="title"
        :loading="loading"
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
            }
        },
        props:{
            title:{type:String,default(){return '传递组件title'}},
            description:{type:String,default(){return '传递组件说明'}},
            modal6:{type:Boolean,default(){ return false}},
            fun:{type:String,default(){return '父级接收函数'}}
        },
        methods: {
            asyncOK () {
                this.$emit(this.fun);
                setTimeout(() => {
                this.$emit('changeModal6',false);
                }, 0);
            },
            asyncNo(){
                this.$emit('changeModal6',false);
            }
        }
    }  
</script>

