<template>
    <Modal
        v-model="showOnoff"
        title="选择车辆"
        width="90"
        :scrollable="true"
        :transfer= "false"
        :footer-hide="false"
        class="table-modal-detail"
        :transition-names="['', '']"
    >
    
        <div style="padding:20px;" class="print_style">
            <table border=0 width="100%" cellspacing="0" cellpadding="0" bordercolor="#000000">
            <thead>
                <tr class="noBorder">
                    <td colspan="10" style="text-align:center;"><b style="line-height:30px;font-size:18px;">机动车维修费用结算清单</b></td>
                </tr>
                <tr class="noBorder">
                    <td colspan="3"></td>
                    <td colspan="7" style="text-align:right;">结算清单编号：{{showAccountData.COLLECT_NO}}</td>
                </tr>
            </thead>
            <tbody>
                <tr class="text-center">
                    <td colspan="2" class="w100">机动车所有人</td>
                    <td colspan="2" >{{showAccountData.CUSTOMER_NAME}}</td>
                    <td>送修人</td>
                    <td colspan="2" >{{showAccountData.GIVE_REPAIR_PERSON}}</td>
                    <td colspan="2">联系电话</td>
                    <td>{{showAccountData.TELPHONE}}</td>
                </tr>
                <tr class="text-center">
                    <td colspan="2" >品牌型号</td>
                    <td colspan="2" >{{showAccountData.VEHICLE_MODEL}}</td>
                    <td>车牌号码</td>
                    <td colspan="2" >{{showAccountData.PLATE_NUM}}</td>
                    <td colspan="2">发动机号</td>
                    <td>{{showAccountData.ENGINE_NO}}</td>
                </tr>
                <tr class="text-center">
                    <td colspan="3" >车辆识别代码(VIN)</td>
                    <td colspan="4" >{{showAccountData.VIN_NO}}</td>
                    <td colspan="2">车辆类型</td>
                    <td>{{showAccountData.VEHICLE_TYPE}}</td>
                </tr>
                <tr class="text-center">
                    <td colspan="3" >工时定额执行标准</td>
                    <td colspan="4" >
                        <div style="display:inline-block;width:12px;height:12px;border:#000000 1px solid;"></div> 行业
                        &nbsp;&nbsp;&nbsp;&nbsp;<div style="display:inline-block;width:12px;height:12px;border:#000000 1px solid;"></div> 制造企业
                    </td>
                    <td colspan="2">车辆分类代号</td>
                    <td>{{showAccountData.VEHICLE_TYPE_CODE}}</td>
                </tr>
                <tr class="text-center">
                    <td colspan="2" >维修企业名称</td>
                    <td colspan="5" >{{showAccountData.tenantName}}</td>
                    <td colspan="2">维修企业联系人</td>
                    <td>{{showAccountData.linkMan}}</td>
                </tr>
                <tr class="text-center">
                    <td colspan="2" >维修企业地址</td>
                    <td colspan="5" >{{showAccountData.tenantAdd}}</td>
                    <td colspan="2">维修企业联系电话</td>
                    <td>{{showAccountData.linkTel}}</td>
                </tr>
                <tr class="text-center">
                    <td colspan="5" >维修企业统一社会信用代码或组织机构代码</td>
                    <td colspan="5" >{{showAccountData.orgNumber}}</td>
                </tr>
                <tr class="text-center">
                    <td colspan="2" >送修日期</td>
                    <td colspan="2" >{{showAccountData.COME_DATE}}</td>
                    <td>出厂日期</td>
                    <td colspan="2" >{{showAccountData.OUT_DATE}}</td>
                    <td colspan="2">维修类别</td>
                    <td>{{showAccountData.REPAIR_TYPE}}</td>
                </tr>
                <tr class="text-center">
                    <td colspan="2" >送修里程</td>
                    <td colspan="3" >{{showAccountData.MILEAGE}}</td>
                    <td colspan="2">出厂里程</td>
                    <td colspan="3">{{showAccountData.OUT_MILEAGE}}</td>
                </tr>
                <tr class="text-center">
                    <td colspan="2" style="border-bottom:2px #000 solid;">故障描述</td>
                    <td colspan="8" style="border-bottom:2px #000 solid;">{{showAccountData.FAULT_DESC}}</td>
                </tr>
                <tr class="text-center">
                    <td rowspan="">工时<br/>费用</td>
                    <td class="w30">序号</td>
                    <td colspan="2">维修项目</td>
                    <td colspan="2">结算工时</td>
                    <td colspan="2">工时单价<br/>(元/工时)</td>
                    <td colspan="2">工时费用(元)</td>
                </tr>

                    <tr class="text-center" v-for="(item,index) in showAccountItem ">
                        <td>{{item.REPAIR_TIME}}</td>
                        <td colspan="2">{{index+1}}</td>
                        <td colspan="2" tclass="a">{{item.NAME}}</td>
                        <td colspan="2" tclass="a">{{item.REPAIR_TIME}}</td>
                        <td colspan="2" tclass="a">100</td>
                        <td colspan="2" tclass="a">{{item.ITEM_MONEY}}</td>
                    </tr>

                <tr class="text-center">
                    <td colspan="8" style="border-bottom:2px #000 solid;text-align:right;">小计(元)：</td>
                    <td colspan="2" tdata="Sum" tindex="9" tclass="a" format="0.00" style="border-bottom:2px #000 solid;">{{showAccountData.REPAIR_ITEM_MONEY}}</td>
                </tr>
                <tr class="text-center">
                    <td rowspan="">材料<br/>费用</td>
                    <td class="w30">序号</td>
                    <td>材料名称</td>
                    <td>配件<br/>编码</td>
                    <td>品牌</td>
                    <td>数量</td>
                    <td>单价(元)</td>
                    <td>金额(元)</td>
                    <td>配件类型</td>
                    <td>是否为托修<br/>方自备配件</td>
                </tr>

                    <tr class="text-center" v-for="(item,index) in showAccountParts">
                        <td>{{item.SALES_PRICE}}</td>
                        <td>{{index+1}}</td>
                        <td>{{item.NAME}}</td>
                        <td>{{item.PART_NO}}</td>
                        <td tclass="b">{{item.BRAND}}</td>
                        <td tclass="b">{{item.PART_NUM}}</td>
                        <td tclass="b">{{item.SALES_PRICE}}</td>
                        <td>{{item.PART_MONEY}}</td>
                        <td>{{item.TYPE_NAME}}</td>
                    </tr>

                <tr class="text-center">
                    <td colspan="7" style="border-bottom:2px #000 solid;text-align:right;">小计(元)：</td>
                    <td tdata="Sum" tindex="8" tclass="b" format="0.00" style="border-bottom:2px #000 solid;">{{showAccountData.REPAIR_PART_MONEY}}</td>
                    <td colspan="2" style="border-bottom:2px #000 solid;"></td>
                </tr>
                <tr class="text-center">
                    <td rowspan="">其它<br/>费用</td>
                    <td class="w30">序号</td>
                    <td colspan="6">项目</td>
                    <td colspan="2">金额(元)</td>
                </tr>

                    <tr class="text-center" v-for="(item,index) in showAccountOther">
                        <td></td>
                        <td colspan="6">{{item.REPAIR_ITEM1}}</td>
                        <td colspan="2">{{item.REPAIR_MONEY1}}</td>
                    </tr>

                <tr class="text-center">
                    <td colspan="8" style="border-bottom:2px #000 solid;text-align:right;">小计(元)：</td>
                    <td colspan="2" style="border-bottom:2px #000 solid;">{{showAccountOther.REPAIR_MONEY1}}</td>
                </tr>
                <tr class="text-center">
                    <td colspan="3">总费用：</td>
                    <td colspan="7" style="text-align:left;">{{showAccountData.SUM_MONEY}}</td>
                </tr>
                <tr class="text-center">
                    <td colspan="3" style="border-bottom:2px #000 solid;">旧件处理结果：</td>
                    <td colspan="7" style="border-bottom:2px #000 solid;"><div style="display:inline-block;width:12px;height:12px;border:#000000 1px solid;{showAccountData.OLD_PART_RESULT:this.formatResult1}"></div> 旧配件已确认，由托修方收回；&nbsp;<div style="display:inline-block;width:12px;height:12px;border:1px #000000 solid;align-left:30px;{showAccountData.OLD_PART_RESULT:this.formatResult2}"></div> 旧件已确认，由承修方收回；&nbsp;<div style="display:inline-block;width:12px;height:12px;border:1px #000000 solid;align-left:30px;{showAccountData.OLD_PART_RESULT:this.formatResult3}"></div> 无旧配件</td>
                </tr>
                <tr class="noBorder">
                    <td colspan="10" class="text-left" style="padding:10px 10px 0px 10px;">1. 本结算清单一式两联，分别由托修方、承修方留存。</td>
                </tr>
                <tr class="noBorder">
                    <td colspan="10" class="text-left" style="padding:0px 10px">2. 结算清单项目及应付金额经双方核实，托修方签字后生效。</td>
                </tr>
                <tr class="noBorder">
                    <td colspan="10" class="text-left" style="padding:0px 10px">3. 承修方不承担托修方自备配件质量保证责任。</td>
                </tr>
                <tr class="noBorder">
                    <td colspan="10" class="text-left" style="padding:0px 10px">4. 企业承诺本次维修质量保证期为车辆行驶<span style="border-bottom:#000 1px solid;display:inline-block;padding:0 10px;">2000</span>公里或者<span style="border-bottom:#000 1px solid;display:inline-block;padding:0 10px;">10</span>日，里程和时间以先到者为准。</td>
                </tr>
                <tr class="noBorder">
                    <td colspan="10" class="text-left" style="padding:0px 10px">5. 企业承诺本次维修的新能源汽车专用部件<span style="border-bottom:#000 1px solid;display:inline-block;padding:0 10px;min-width:30px;">{{showAccountData.ZY_PART}}</span>维修质量保证期为<span style="border-bottom:#000 1px solid;display:inline-block;padding:0 10px;min-width:30px;">{{showAccountData.ZY_PART_BZQ}}</span>。</td>
                </tr>
                <tr class="noBorder">
                    <td colspan="10" class="text-left" style="padding:0px 10px">6. 请扫描二维码或登录上海汽修平台，对本次维修服务进行评价。</td>
                </tr>
                <tr class="noBorder">
                    <td colspan="5" style="text-align:right;"><img src="resources/images/main/pj_qrcode.png" style="width:152px;height:152px;"/></td>
                    <td colspan="5" style="padding:30px 0px;vertical-align: top;text-align:left;">上海市机动车维修公共服务平台</td>
                </tr>
                <tr class="noBorder">
                    <td colspan="5" style="text-align:left;">承修方 (盖章)：</td>
                    <td colspan="5" style="text-align:left;">托修方签名 (盖章)：</td>
                </tr>
                <tr class="noBorder">
                    <td colspan="5" style="text-align:left;">日期：<span style="display:inline-block;width:40px;"></span>年<span style="display:inline-block;width:40px;"></span>月<span style="display:inline-block;width:40px;"></span>日</td>
                    <td colspan="5" style="text-align:left;">日期：<span style="display:inline-block;width:40px;"></span>年<span style="display:inline-block;width:40px;"></span>月<span style="display:inline-block;width:40px;"></span>日</td>
                </tr>
                <tr class="noBorder">
                    <td colspan="10" style="height:10px;"></td>
                </tr>
            </tbody>
            </table>
        </div>
     

  </Modal>
</template>

<script>
import { getName, getDictGroup } from '@/libs/util.js'
	export default {
		name: "select-accountOrder",
        props:['showSelectAccount','showAccountData','showAccountItem','showAccountParts','showAccountOther'],
        components: {},
        data(){
            return{
                collapse:1,
                splitNum:0.5,
                collapse: ['1','2'],
                showOnoff:false,

            }
        },
        watch:{
            showSelectAccount(){
                this.showOnoff=true;
                
                console.log(this.showAccountData);
            }
        },
        mounted() {

        },
        methods:{
            
        }
	}
</script>

<style lang="less" scoped>
    .search-block{
        display: inline-block;
        width: 200px;
        margin-right: 10px;
    }
    .common-table{
        padding: 10px;
        background-color: white;
        height: 100%;
        overflow: hidden;
        position: relative;
        .table-search{
        }
        .operate{
            margin-top: 10px;
            padding: 15px;
            border: 1px solid #dcdee2;
            border-radius: 3px;
        }
        .main-table{
            margin-top: 10px;
        }
        .table-bottom{
            position: absolute;
            height: 52px;
            padding: 10px;
            width: 100%;
            left: 0;
            bottom: 0;
            background-color: white;
            z-index: 4;
        }
    }
.print_style table{border:2px #000 solid;border-collapse: collapse; display: block;} 
.print_style th,.print_style td{border: 1px solid #000;} 
.print_style .noBorder th,.print_style .noBorder td{border:none;} 
.print_style .noRTLBorder th,.print_style .noRTLBorder td{border-right:none;border-top:none;border-left:none;} 
.print_style .noRLBorder th,.print_style .noRLBorder td{border-right:none;border-left:none;}
.print_style th,.print_style td {padding: 2px; line-height: 16px; text-align: center; vertical-align: middle;font-size:12px; } 
.print_style td{text-align: left;} 
.print_style .text-center,.print_style .text-center th,.print_style .text-center td{text-align:center;} 
.print_style .text-right,.print_style .text-right th,.print_style .text-right td{text-align:right;}
.print_style .w100{width:100px;} 
.print_style .w110{width:110px;} 
.print_style .w130{width:130px;} 
.print_style .w200{ width:200px;} 
.print_style .h30{ height:30px;line-height:25px;} 
.print_style .w30{width:30px;} 
.print_style .w70{width:70px;} 
.print_style .w80{width:80px;} 
.print_style .w400{width:700px;}
.print_style .text-left{text-align:left;}
</style>


