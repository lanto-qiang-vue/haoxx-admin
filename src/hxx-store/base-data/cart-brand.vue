<template>
<vehicle-model :show="show"></vehicle-model>
</template>
<script>
 import vehicleModel from '@/hxx-components/vehicle-model.vue'
	export default{
		name:'cart-brand',
		components:{vehicleModel},
		data(){
			return {
				show:false,
			}
		},
		mounted(){
			this.show = Math.random();
		}
	}
</script>