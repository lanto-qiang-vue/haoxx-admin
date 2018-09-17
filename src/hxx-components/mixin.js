import { getBtns } from '@/libs/util.js'
export default {
  methods: {
    accessBtn(btnName){
      // let getBtns= (access, menu)=> {
      // console.log('accessBtn',getBtns(this.$route.meta.access, this.$store.state.user.accessMenu))
      return getBtns(this.$route.meta.access, this.$store.state.user.accessMenu).indexOf(btnName)>=0? true: false
    },
    
  }
}
