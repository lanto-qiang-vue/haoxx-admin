export default {
  methods: {
    accessBtn(btnName){
      let getBtns= (access, menu)=> {
        let btnAction = ''
        for (let i in menu) {
          if (menu[i].id == access) {
            btnAction = menu[i].btnAction
            break
          } else if (menu[i].children) {
            btnAction = getBtns(access, menu[i].children)
            if (btnAction) break
          }
        }
        return btnAction
      }
      // console.log('accessBtn',getBtns(this.$route.meta.access, this.$store.state.user.accessMenu))
      return getBtns(this.$route.meta.access, this.$store.state.user.accessMenu).indexOf(btnName)>=0? true: false
    }
  }
}
