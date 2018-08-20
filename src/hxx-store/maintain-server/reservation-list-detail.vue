<!--预约单管理详情-->
<template>
  <Modal
    v-model="showDetail"
    title="维修服务预约"
    width="90"
    @on-ok="ok"
    @on-cancel="cancel">
    <p>Content of dialog</p>
    <p>Content of dialog</p>
    <p>Content of dialog</p>
  </Modal>
</template>

<script>
	export default {
		name: "reservation-list-detail",
    props: {
      showDetail:{
        type: Boolean,
        default: false
      }
    },
    methods:{
      ok(){

      },
      cancel(){

      }
    }
	}
</script>

<style scoped>

</style>
