<template>
	<div>
		<Modal v-model="modal2" :mask-closable="false" width="360" @on-cancel="uploadClose">
        <p slot="header" style="color:#f60;text-align:left;">
            <span>客户档案导入</span>
        </p>
        <div style="text-align:left;">
    <Upload
        ref="upload"
        :before-upload = "beforeUpload"
        :name="filenames"
        :show-upload-list="false"
        :on-success="uploadSuccess"
        :data="token"
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        type="drag"
        :action= "baseUrl +'/tenant/basedata/ttcustomerfile/doImport'">
        <div style="padding: 20px 0">
            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
            <p class="ftext">1、点击当前区域，找到您所要导入的Excel文件,请确保文件按照模板中导入说明的要求填写。</p>
            <p class="ftext">2、选择好文件后, 点“确定”按钮完成导入</p>
        </div>
    </Upload>
        <div>{{filename}}</div>
        </div>
     <div slot="footer">
            <Button type="success" @click="down" style="float:left;">下载模板</Button>
            <Button type="primary" @click="upload" :loading="loadingStatus">确定</Button>
            <Button type="error" @click="uploadClose">关闭</Button>
        </div>
    </Modal>
	</div>
</template>
<script>
	export default {
		name:'common-upload-excel'
	}
</script>