<template>
	<div class="home">
		<div class="home-container">
			<div class="home-header">
				<b>欢迎进入好修修智慧门店系统 - 后台管理</b>
			</div>
			<div class="home-bg">
				<img src="../assets/images/hxx-admin/banner-jkrzbg.png" alt="icon">
			</div>
			
		</div>
	</div>
</template>

<script>
	export default {
		name: "admin-home"
	}
</script>

<style lang="less" scoped>
	.home{
		width: 100%;
		height: 100%;
		.home-container{
			width: 100%;
			height: 100%;
			text-align:center;
			background: rgb(187, 222, 251);
			overflow:hidden;
			.home-header{
				text-align: center;
				margin-top:160px;
				b{
					line-height: 50px;
					font-size: 40px;
					text-align: center;
					color: rgb(3, 169, 244);
					text-shadow: rgb(255, 255, 255) 0px 0px 0px, rgb(64, 64, 64) 4px 3px 0px;
					height: 50px;
					top:100px;
				}
			}
			.home-bg{
				width: 400px;
				height: 500px;
				margin: 0px auto;
				img{
					width:100%;
				}
			}
			
		}
	}

</style>
