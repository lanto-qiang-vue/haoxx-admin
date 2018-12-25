<template xmlns="http://www.w3.org/1999/html">
  <Modal
    :transition-names="['', '']"
    v-model="show"
    class="protocol"
    :mask-closable="false"
    :closable="false"
    width="800"
  >
    <div slot="header" style="line-height:54px;text-align:center;font-size:16px;"><strong>用户协议</strong></div>
<protocol-text style="height:532px;background:#ECECEC;"></protocol-text>
    <div slot="footer" style="text-align:center;">
      <Button type="primary" style="width:82px;" @click="Yargee">同意</Button>
      <Button style="width:82px;margin-left:30px;" @click="Nargee" v-if="type == 1">不同意</Button>
    </div>
  </Modal>
</template>
<script>
  import protocolText from '@/hxx-components/protocol-text.vue';
    export default {
      name: "protocol",
      props:{
        protocolShow:{
          default(){
            return false;
          },
        },
        type:{
          default(){
            return 1;
          }
        }
      },
      components:{protocolText},
      data(){
          return {
            show:false,
          }
      },
      methods:{
        Yargee(){
          if(this.type == 1){
            this.$emit('argee',true);
            this.show = false;
          }else{
            this.axios.request({
              baseURL: '/other',
              url: '/Query',
              method: 'post',
              data: {
                code:7022,
                userid:this.$store.state.user.userInfo.user.userId
              }
            }).then(res => {
              console.log(res);
               // if(res)
              if(res[0].error == 0){
                let data = this.$store.state.user.userInfo;
                data.user.isAgreement = 1;
                this.$store.commit('setUser',data);
                this.show = false;
              }else{

              }
            })
          }
        },
        Nargee(){
          this.$emit('argee',false);
          this.show = false;
        }
      },
      watch:{
        protocolShow(){
          this.show = true;
        }
      }
    }
</script>
