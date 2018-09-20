//2018-09-12
// import store from '../store/index.js'
//打印委托单-----------
export const printWtsFun=function(wtdData,listSearch,commitItem,commitParts,commitOtherItem){
    var itemString='';
    var partsString='';
    var otherString='';
    for(let i in commitItem){
            itemString+='<tr class="noRLBorder text-center">';
            itemString+='<td>'+(parseInt(i)+1)+'</td>';
            itemString+='<td colspan="2">'+commitItem[i].NAME+'</td>';
            itemString+='<td tclass="a">'+commitItem[i].REPAIR_TIME+'</td>';
            itemString+='<td tclass="a">'+commitItem[i].ITEM_MONEY+'</td>';
            itemString+='<td tclass="a">'+commitItem[i].ITEM_MONEY+'</td>';
            itemString+='<td tclass="a">'+commitItem[i].ITEM_DERATE_MONEY+'</td>';
            itemString+='<td>'+(commitItem[i].REMARK||'')+'</td>';
            itemString+='</tr>';
    }

    for(let i in commitParts){
            partsString+='<tr class="noRLBorder text-center">';
            partsString+='<td>'+(parseInt(i)+1)+'</td>';
            partsString+='<td>'+commitParts[i].PART_NO+'</td>';
            partsString+='<td>'+commitParts[i].NAME+'</td>';
            partsString+='<td>'+commitParts[i].UNIT+'</td>';
            partsString+='<td tclass="b">'+commitParts[i].PART_NUM+'</td>';
            partsString+='<td tclass="b">'+commitParts[i].SALES_PRICE+'</td>';
            partsString+='<td tclass="b">'+commitParts[i].PART_MONEY+'</td>';
            partsString+='<td tclass="b">'+commitParts[i].PART_DERATE_MONEY+'</td>';
            partsString+='</tr>';

            
    }

    for(let i=0;i<4;i++){
      otherString+='<tr class="noRLBorder text-center">';
      otherString+='<td colspan="2">'+(parseInt(i)+1)+'</td>';

      otherString+='<td colspan="2">'+commitOtherItem[0]['REPAIR_ITEM'+(parseInt(i)+1)]+'</td>';
      otherString+='<td colspan="4" tclass="c">'+commitOtherItem[0]['REPAIR_MONEY'+(parseInt(i)+1)]+'</td>';
      otherString+='</tr>';

      // otherMoney+=parseFloat(commitOtherItem[0]['REPAIR_MONEY'+(parseInt(i)+1)]);

    }



    var temp ='<meta http-equiv="X-UA-Compatible" content="IE=Edge"><style>table{border:none;border-collapse: collapse;} th,td{border: 1px solid #000;} .noBorder th,.noBorder td{border:none;} .noRTLBorder th,.noRTLBorder td{border-right:none;border-top:none;border-left:none;} .noRLBorder th,.noRLBorder td{border-right:none;border-left:none;}' +
     "th,td {padding: 4px 3px; line-height: 16px; text-align: center; vertical-align: middle;font-size:13px; } td{text-align: left;} .text-center,.text-center th,.text-center td{text-align:center;} .text-right,.text-right th,.text-right td{text-align:right;}" +
     ".w100{width:100px;} .w110{width:110px;} .w130{width:130px;} .w200{ width:200px;} .h30{ height:30px;line-height:25px;} .w30{width:30px;} .w70{width:70px;} .w80{width:80px;}  .w400{width:700px;} " +
     ".text-left{text-align:left;} </style>"+
            '<div style="padding:0 20px;">'+
            '<table border=0 width="100%" cellspacing="0" cellpadding="0" bordercolor="#000000">'+
            '<tbody>'+
            '<tr class="noBorder">'+
            '<td colspan="8">承修方(盖章）: '+wtdData.tenantName+'</td>'+
            '</tr>'+
            '<tr class="noBorder">'+
            '<td colspan="4">地   址：'+wtdData.tenantAdd+'</td>'+
            '<td colspan="2">电   话：'+wtdData.linkTel+'</td>'+
            '<td colspan="2">传   真：</td>'+
            '</tr>'+
            '<tr class="noBorder">'+
            '<td colspan="4" >开户银行：</td>'+
            '<td colspan="4">E-mail：'+wtdData.email+'</td>'+
            '</tr>'+
            '<tr class="noRTLBorder">'+
            '<td colspan="4">帐   号：</td>'+
            '<td colspan="4">网   址：</td>'+ 
            '</tr>'+
            '<tr class="noBorder">'+
            '<td colspan="4">托修方：'+listSearch.CUSTOMER_NAME+'</td>'+
            '<td colspan="2">送修人：'+listSearch.GIVE_REPAIR_PERSON+'</td>'+
            '<td colspan="2">联系电话：'+listSearch.TELPHONE+'</td>'+
            '</tr>'+
            '<tr class="noBorder">'+
            '<td colspan="3">车牌号：'+listSearch.PLATE_NUM+'</td>'+
            '<td colspan="3">车型：'+listSearch.VEHICLE_MODEL+'</td>'+
            '<td colspan="2">进厂日期：'+listSearch.COME_DATE+'</td>'+
            '</tr>'+
            '<tr class="noBorder">'+
            '<td colspan="3">车辆颜色：'+listSearch.VEHICLE_COLOR+'</td>'+
            '<td colspan="3">VIN：'+listSearch.VIN_NO+'</td>'+
            '<td colspan="2">行驶里程：'+listSearch.MILEAGE+'</td>'+
            '</tr>'+
            '<tr class="noRTLBorder">'+
            '<td colspan="8">发动机号：'+listSearch.ENGINE_NO+'</td>'+
            '</tr>'+
            '<tr class="noBorder">'+
            '<td colspan="3" rowspan="10"><img src="/static/img/wtdimage.png"/></td>'+
            '<td colspan="3" class="text-left">车辆情况登记</td>'+
            '<td colspan="2" class="text-left">打\' √ \'表示该项目异常</td>'+
            '</tr>'+
            '<tr class="noBorder">'+
            '<td><div style="display:inline-block;width:12px;height:12px;border:#000000 1px solid;"></div> 行驶证</td>'+
            '<td><div style="display:inline-block;width:12px;height:12px;border:#000000 1px solid;"></div> 车匙</td>'+
            '<td><div style="display:inline-block;width:12px;height:12px;border:#000000 1px solid;"></div> 标志</td>'+
            '<td><div style="display:inline-block;width:12px;height:12px;border:#000000 1px solid;"></div> 车型字</td>'+
            '<td><div style="display:inline-block;width:12px;height:12px;border:#000000 1px solid;"></div> 车牌</td>'+
            '</tr>'+
            '<tr class="noBorder">'+
            '<td><div style="display:inline-block;width:12px;height:12px;border:#000000 1px solid;"></div> 轮胎盖</td>'+
            '<td><div style="display:inline-block;width:12px;height:12px;border:#000000 1px solid;"></div> 地毯</td>'+
            '<td><div style="display:inline-block;width:12px;height:12px;border:#000000 1px solid;"></div> 雨刮</td>'+
            '<td><div style="display:inline-block;width:12px;height:12px;border:#000000 1px solid;"></div> 倒后镜</td>'+
            '<td><div style="display:inline-block;width:12px;height:12px;border:#000000 1px solid;"></div> 大灯</td>'+
            '</tr>'+
            '<tr class="noBorder">'+
            '<td><div style="display:inline-block;width:12px;height:12px;border:#000000 1px solid;"></div> 泵把灯</td>'+
            '<td><div style="display:inline-block;width:12px;height:12px;border:#000000 1px solid;"></div> 前小灯</td>'+
            '<td><div style="display:inline-block;width:12px;height:12px;border:#000000 1px solid;"></div> 后小灯</td>'+
            '<td ><div style="display:inline-block;width:12px;height:12px;border:#000000 1px solid;"></div> 雾灯</td>'+
            '<td><div style="display:inline-block;width:12px;height:12px;border:#000000 1px solid;"></div> 前转向灯</td>'+
            '</tr>'+
            '<tr class="noBorder">'+
            '<td><div style="display:inline-block;width:12px;height:12px;border:#000000 1px solid;"></div> 后转向灯</td>'+
            '<td><div style="display:inline-block;width:12px;height:12px;border:#000000 1px solid;"></div> 刹车灯</td>'+
            '<td><div style="display:inline-block;width:12px;height:12px;border:#000000 1px solid;"></div> 倒车灯</td>'+
            '<td><div style="display:inline-block;width:12px;height:12px;border:#000000 1px solid;"></div> 牌照灯</td>'+
            '<td><div style="display:inline-block;width:12px;height:12px;border:#000000 1px solid;"></div> 室内灯</td>'+
            '</tr>'+
            '<tr class="noBorder">'+
            '<td ><div style="display:inline-block;width:12px;height:12px;border:#000000 1px solid;"></div> 门把手</td>'+
            '<td><div style="display:inline-block;width:12px;height:12px;border:#000000 1px solid;"></div> 车窗玻璃</td>'+
            '<td><div style="display:inline-block;width:12px;height:12px;border:#000000 1px solid;"></div> 车门锁</td>'+
            '<td><div style="display:inline-block;width:12px;height:12px;border:#000000 1px solid;"></div> 点烟器</td>'+
            '<td><div style="display:inline-block;width:12px;height:12px;border:#000000 1px solid;"></div> 香水瓶</td>'+
            '</tr>'+
            '<tr class="noBorder">'+
            '<td><div style="display:inline-block;width:12px;height:12px;border:#000000 1px solid;"></div> 遮阳板</td>'+
            '<td><div style="display:inline-block;width:12px;height:12px;border:#000000 1px solid;"></div> 收放机</td>'+
            '<td ><div style="display:inline-block;width:12px;height:12px;border:#000000 1px solid;"></div> 喇叭</td>'+
            '<td><div style="display:inline-block;width:12px;height:12px;border:#000000 1px solid;"></div> CD机</td>'+
            '<td><div style="display:inline-block;width:12px;height:12px;border:#000000 1px solid;"></div> 电子钟</td>'+
            '</tr>'+
            '<tr class="noBorder">'+
            '<td><div style="display:inline-block;width:12px;height:12px;border:#000000 1px solid;"></div> 车速表</td>'+
            '<td><div style="display:inline-block;width:12px;height:12px;border:#000000 1px solid;"></div> 转速表</td>'+
            '<td><div style="display:inline-block;width:12px;height:12px;border:#000000 1px solid;"></div> 水温表</td>'+
            '<td><div style="display:inline-block;width:12px;height:12px;border:#000000 1px solid;"></div> 电动天线</td>'+
            '<td ><div style="display:inline-block;width:12px;height:12px;border:#000000 1px solid;"></div> ABS警告灯</td>'+
            '</tr>'+
            '<tr class="noBorder">'+
            '<td><div style="display:inline-block;width:12px;height:12px;border:#000000 1px solid;"></div> 充电灯</td>'+
            '<td><div style="display:inline-block;width:12px;height:12px;border:#000000 1px solid;"></div> 保养灯</td>'+
            '<td><div style="display:inline-block;width:12px;height:12px;border:#000000 1px solid;"></div> 机油灯</td>'+
            '<td><div style="display:inline-block;width:12px;height:12px;border:#000000 1px solid;"></div> 气囊灯</td>'+
            '<td><div style="display:inline-block;width:12px;height:12px;border:#000000 1px solid;"></div> 引擎灯</td>'+
            '</tr>'+
            '<tr class="noBorder">'+
            '<td><div style="display:inline-block;width:12px;height:12px;border:#000000 1px solid;"></div> 备胎</td>'+
            '<td><div style="display:inline-block;width:12px;height:12px;border:#000000 1px solid;"></div> 空调系统</td>'+
            '<td colspan="3"><div style="display:inline-block;width:12px;height:12px;border:#000000 1px solid;"></div> 防盗系统</td>'+
            '</tr>'+
            '<tr class="noRLBorder">'+
            '<td colspan="8" class="text-left">维修项目</td>'+
            '</tr>'+
            '<tr class="noRLBorder text-center">'+
            '<td>序号</td>'+
            '<td colspan="2">作业项目</td>'+
            '<td class="w100">结算工时</td>'+
            '<td class="w100">单价(元/工时)</td>'+
            '<td class="w100">金额(元)</td>'+
            '<td class="w100">优惠金额</td>'+
            '<td>备  注</td>'+
            '</tr>'+

            // '<tr class="noRLBorder text-center" v-for="(item,index) in commitItem ">'+
            // '<td>{[xindex]}</td>'+
            // '<td colspan="2">{{item.NAME}}</td>'+
            // '<td tclass="a">{times:number("0.00")}</td>'+
            // '<td tclass="a">{timePrice:number("0.00")}</td>'+
            // '<td tclass="a">{itemMoney:number("0.00")}</td>'+
            // '<td tclass="a">{itemYhMoney:number("0.00")}</td>'+
            // '<td>{remark}</td>'+
            // '</tr>'+
            itemString+
            
            '<tr class="noRLBorder text-center">'+
            '<td colspan="3">合计：</td>'+
            '<td  tdata="Sum" tindex="4" tclass="a" format="0.00" >######</td>'+
            '<td  tdata="Average" tindex="5" tclass="a" format="0.00" >######</td>'+
            '<td  tdata="Sum" tindex="6" tclass="a" format="0.00" >######</td>'+
            '<td  tdata="Sum" tindex="7" tclass="a" format="0.00" >######</td>'+
            '<td></td>'+
            '</tr>'+
            '<tr class="noRLBorder">'+
            '<td colspan="8" class="text-left">维修材料</td>'+
            '</tr>'+
            '<tr class="noRLBorder text-center">'+
            '<td>序号</td>'+
            '<td>配件编码</td>'+
            '<td>配件名称</td>'+
            '<td>计量单位</td>'+
            '<td>数 量</td>'+
            '<td>单 价</td>'+
            '<td>金  额</td>'+
            '<td>优惠金额</td>'+
            '</tr>'+

            // '<tpl for="parts">'+
            // '<tr class="noRLBorder text-center">'+
            // '<td>{[xindex]}</td>'+
            // '<td>{partCode}</td>'+
            // '<td>{partName}</td>'+
            // '<td>{unit:formatDict}</td>'+
            // '<td tclass="b">{partNum}</td>'+
            // '<td tclass="b">{salesPrice:number("0.00")}</td>'+
            // '<td tclass="b">{partMoney:number("0.00")}</td>'+
            // '<td tclass="b">{partYhMoney:number("0.00")}</td>'+
            // '</tr>'+
            // '</tpl>'+
            partsString+
            '<tr class="noRLBorder text-center">'+
            '<td colspan="4">合计：</td>'+
            '<td tdata="SubCount" tindex="5" tclass="b" format="#">###</td>'+
            '<td tdata="Average" tindex="6" tclass="b" format="0.00">######</td>'+
            '<td tdata="Sum" tindex="7" tclass="b" format="0.00">######</td>'+
            '<td tdata="Sum" tindex="8" tclass="b" format="0.00">######</td>'+
            '</tr>'+
            '<tr class="noRLBorder">'+
            '<td colspan="8" class="text-left">其他费用</td>'+
            '</tr>'+
            '<tr class="noRLBorder text-center">'+
            '<td colspan="2" >序号</td>'+
            '<td colspan="2" >项目</td>'+
            '<td colspan="4" >金额(元)</td>'+
            '</tr>'+
            otherString+
            // '<tpl for="others">'+
            // '<tr class="text-center">'+
            // '<td>{[xindex]}</td>'+
            // '<td colspan="6">{repairItem1}</td>'+
            // '<td colspan="2">{repairMoney1:number("0.00")}</td>'+
            // '</tr>'+
            // '</tpl>'+

            '<tr class="noRLBorder text-center">'+
            '<td colspan="4" style="border-bottom:2px #000 solid;text-align:right;">小计(元)：</td>'+
            '<td colspan="4" tdata="Sum" tindex="9" tclass="c" format="0.00" style="border-bottom:2px #000 solid;">###</td>'+
            '</tr>'+

            '<tr class="noBorder">'+
            '<td colspan="8" style="min-height:80px;vertical-align: top;"><b>故障描述：</b><p style="text-indent:2em;">'+listSearch.FAULT_DESC+'</p></td>'+
            '</tr>'+

            '<tr class="noRTLBorder">'+
                '<td colspan="8" style="text-align:left;"><b>预计费用 = 预计材料费 + 预计工时费 +其他费用 - 材料优惠金额 - 工时优惠金额</b><span style="display:inline-block;width:20px;">&nbsp;</span></td>'+
            '</tr>'+
            '<tr class="noRTLBorder">'+
                '<td colspan="8" style="text-align:left;"><b>预计费用：<font >￥'+listSearch.SUM_MONEY+'</font><span style="display:inline-block;width:20px;">&nbsp;</span>金额大写：<div style="display:inline-block;line-height:18px;">'+convertCurrency(listSearch.SUM_MONEY)+'</div></b></td>'+
            '</tr>'+
            '<tr class="noRLBorder">'+
            '<td colspan="8" class="text-left">'+
            '注：在车辆维修过程中，因车辆内在原因，需增加维修项目或扩大维修范围时，应当征得托修方同意后方可修理。<br/>'+
            '旧件是否保留：<div style="display:inline-block;width:12px;height:12px;border:#000000 1px solid;"></div> 是 ， <div style="display:inline-block;width:12px;height:12px;border:#000000 1px solid;"></div> 否'+
            '</td>'+
            '</tr>'+

            '<tr class="noBorder">'+
            '<td colspan="4">预计交车时间：'+listSearch.PLAN_END_DATE+'</td>'+
            '<td colspan="2">业务员签名：</td>'+
            '<td colspan="2">客户签名：</td>'+
            '</tr>'+

            '</tbody>'+
            '</table>'+
            '</div>'

            
            return temp;
};

//打印派工单-----------
export const printPgdFun=function(wtdData,listSearch,commitItem,commitParts,itemGroupDetail) {
        var tenantInfo = '<tr class="noBorder">' +
            '<td colspan="8">承修方(盖章）: '+wtdData.tenantName+'</td>'+
            '</tr>'+
            '<tr class="noBorder">'+
            '<td colspan="4">地   址：'+wtdData.tenantAdd+'</td>'+
            '<td colspan="2">电   话：'+wtdData.linkTel+'</td>'+
            '<td colspan="2">传   真：</td>'+
            '</tr>'+
            '<tr class="noBorder">'+
            '<td colspan="4" >开户银行：</td>'+
            '<td colspan="4">E-mail：'+wtdData.email+'</td>'+
            '</tr>'+
            '<tr class="noRTLBorder">'+
            '<td colspan="4">帐   号：</td>'+
            '<td colspan="4">网   址：</td>'+ 
            '</tr>';
        
        var itemString='';
        var partsString='';
        for(let i in commitItem){
                itemString+='<tr class="noRLBorder text-center">';
                itemString+='<td>'+(parseInt(i)+1)+'</td>';
                itemString+='<td colspan="3">'+commitItem[i].NAME+'</td>';
                itemString+='<td>'+commitItem[i].REPAIR_TIME+'</td>';
                itemString+='<td colspan="1" tclass="b"></td>';
                itemString+='<td colspan="1" tclass="b">'+(commitItem[i].REMARK||'')+'</td>';
                itemString+='<td colspan="1" tclass="b">'+(commitItem[i].WORK_CLASS_NAME||'')+'</td>';
                itemString+='</tr>';

               
        }
        for(let i in itemGroupDetail){
                itemString+='<tr class="noRLBorder text-center">';
                itemString+='<td>'+(parseInt(i)+1)+'</td>';
                itemString+='<td colspan="3">'+itemGroupDetail[i].NAME+'</td>';
                itemString+='<td>'+itemGroupDetail[i].REPAIR_TIME+'</td>';
                itemString+='<td colspan="1" tclass="b"></td>';
                itemString+='<td colspan="1" tclass="b">'+(itemGroupDetail[i].REMARK||'')+'</td>';
                itemString+='<td colspan="1" tclass="b">'+(itemGroupDetail[i].WORK_CLASS_NAME||'')+'</td>';
                itemString+='</tr>';
        }

        for(let i in commitParts){
                partsString+='<tr class="noRLBorder text-center">';
                partsString+='<td>'+(parseInt(i)+1)+'</td>';
                partsString+='<td colspan="3">'+commitParts[i].PART_NO+'</td>';
                partsString+='<td colspan="3">'+commitParts[i].NAME+'</td>';
                partsString+='<td colspan="1">'+commitParts[i].PART_NUM+'</td>';
                partsString+='</tr>';



        }



        var temp = '<meta http-equiv="X-UA-Compatible" content="IE=Edge"><style>table{border:none;border-collapse: collapse;} th,td{border: 1px solid #000;} .noBorder th,.noBorder td{border:none;} .noRTLBorder th,.noRTLBorder td{border-right:none;border-top:none;border-left:none;} .noRLBorder th,.noRLBorder td{border-right:none;border-left:none;}' +
            "th,td {padding: 5px 3px 5px 3px; line-height: 16px; text-align: center; vertical-align: middle;font-size:13px; } td{text-align: left;} .text-center,.text-center th,.text-center td{text-align:center;} .text-right,.text-right th,.text-right td{text-align:right;}" +
            ".w100{width:100px;} .w110{width:110px;} .w130{width:130px;} .w200{ width:200px;} .h30{ height:30px;line-height:25px;} .w30{width:30px;} .w70{width:70px;} .w80{width:80px;}  .w400{width:700px;} " +
            ".text-left{text-align:left;} </style>"+
            '<div style="padding:0 20px;">'+
            '<table border=0 width="100%" cellspacing="0" cellpadding="0" bordercolor="#000000">'+
            '<tbody>'+
            tenantInfo+

            '<tr class="noBorder">'+
            '<td colspan="2">托修方</td>'+
            '<td colspan="2" >'+listSearch.CUSTOMER_NAME+'</td>'+
            '<td>送修人</td>'+
            '<td>'+listSearch.GIVE_REPAIR_PERSON+'</td>'+
            '<td>主修人</td>'+
            '<td>'+listSearch.REPAIR_PERSON+'</td>'+
            '</tr>'+
            '<tr class="noBorder">'+
            '<td colspan="2">车牌号</td>'+
            '<td colspan="2">'+listSearch.PLATE_NUM+'</td>'+
            '<td>车型</td>'+
            '<td colspan="3">'+listSearch.VEHICLE_MODEL+'</td>'+
            '</tr>'+
            '<tr class="noBorder">'+
            '<td colspan="2">服务顾问</td>'+
            '<td>'+listSearch.FOLLOW_PERSON+'</td>'+
            '<td>进厂日期</td>'+
            '<td colspan="2">'+listSearch.COME_DATE+'</td>'+
            '<td>预计交车时间</td>'+
            '<td colspan="2">'+listSearch.PLAN_END_DATE+'</td>'+
            '</tr>'+
            '<tr  class="noRLBorder text-center">'+
            '<td class="w30">序号</td>'+
            '<td colspan="3">项目名称</td>'+
            '<td>工时</td>'+
            '<td colspan="1">收费区分</td>'+
            '<td colspan="1">备注</td>'+
            '<td colspan="1">维修工</td>'+
            '</tr>'+
            itemString+
            // '<tpl for="items">'+
            // '<tr class="noRLBorder text-center">'+
            // '<td>{[xindex]}</td>'+
            // '<td colspan="3">{itemName}</td>'+
            // '<td>{times:number("0.00")}</td>'+
            // '<td colspan="1" tclass="b"></td>'+
            // '<td colspan="1" tclass="b">{remark}</td>'+
            // '<td colspan="1" tclass="b">{className}</td>'+
            // '</tr>'+
            // '</tpl>'+

            '<tr class="noBorder">'+
            '<td colspan="3" class="text-left" style="height:50px;width:25%;">技师签名：</td>'+
            '<td colspan="2" class="text-left" style="height:50px;width:25%;">完工签认：</td>'+
            '<td colspan="2" class="text-left" style="height:50px;width:25%;">质检员：</td>'+
            '<td colspan="1" class="text-left" style="height:50px;width:25%;">洗车工签名：</td>'+
            '</tr>'+
            '<tr class="noRLBorder text-center">'+
            '<td>序号</td>'+
            '<td colspan="3">配件编码</td>'+
            '<td colspan="3">配件名称</td>'+
            '<td colspan="1">数 量</td>'+
            '</tr>'+
            partsString+
            // '<tpl for="parts">'+
            // '<tr class="noRLBorder text-center">'+
            // '<td>{[xindex]}</td>'+
            // '<td colspan="3">{partCode}</td>'+
            // '<td colspan="3">{partName}</td>'+
            // '<td colspan="1">{partNum:number("0")}</td>'+
            // '</tr>'+
            // '</tpl>'+

            '<tr class="noRLBorder">'+
            '<td colspan="8" style="min-height:100px;vertical-align: top;"><b>客诉内容：</b><p style="text-indent:2em;">'+listSearch.CUSTOMER_INFO+'</p></td>'+
            '</tr>'+
            '<tr class="noRLBorder">>'+
            '<td colspan="8" style="min-height:80px;vertical-align: top;"><b>维修建议：</b><p style="text-indent:2em;">'+listSearch.REPAIR_INFO+'</p></td>'+
            '</tr>'+
            '</tbody>'+
            '</table>'+
            '</div>';
            return temp;
};

//打印结算单--------
export const printAccountFun=function(wtdData,listSearch,commitItem,commitItemGroup,commitParts,commitOtherItem,store,styleFlag){


  console.log(wtdData,listSearch,commitItem,commitItemGroup,commitParts,commitOtherItem,store);
  var itemString='';
  var partsString='';
  var otherString='';
  var itemMoney=0;
  var partsMoney=0;
  var otherMoney=0;
  for(let i in commitItem){
      itemString+='<tr class="text-center">';
      itemString+='<td>'+(parseInt(i)+1)+'</td>';
      itemString+='<td colspan="2">'+commitItem[i].NAME+'</td>';
      itemString+='<td colspan="2" tclass="a">'+commitItem[i].REPAIR_TIME+'</td>';
      itemString+='<td colspan="2" tclass="a">'+store.state.user.userInfo.params[0].PARAM_VALUE+'</td>';
      itemString+='<td colspan="2" tclass="a">'+commitItem[i].ITEM_MONEY+'</td>';
      itemString+='</tr>';

      itemMoney+=parseFloat(commitItem[i].ITEM_MONEY);


  }
  for(let i in commitItemGroup){
      itemString+='<tr class="text-center">';
      itemString+='<td>'+(parseInt(i)+1+commitItem.length)+'</td>';
      itemString+='<td colspan="2">'+commitItemGroup[i].GROUP_NAME+'</td>';
      itemString+='<td colspan="2" tclass="a">-</td>';
      itemString+='<td colspan="2" tclass="a">-</td>';
      itemString+='<td colspan="2" tclass="a">'+commitItemGroup[i].SALES_PRICE+'</td>';
      itemString+='</tr>';

      itemMoney+=parseFloat(commitItemGroup[i].SALES_PRICE);
  }

  for(let i in commitParts){

    partsString+='<tr class="text-center">';
    partsString+='<td>'+(parseInt(i)+1)+'</td>';
    partsString+='<td>'+commitParts[i].NAME+'</td>';
    partsString+='<td>'+commitParts[i].PART_NO+'</td>';
    partsString+='<td>'+commitParts[i].BRAND+'</td>';
    partsString+='<td tclass="b">'+commitParts[i].PART_NUM+'</td>';
    partsString+='<td tclass="b">'+commitParts[i].SALES_PRICE+'</td>';
    partsString+='<td tclass="b">'+commitParts[i].PART_MONEY+'</td>';
    partsString+='<td tclass="b">'+commitParts[i].PART_SOURCE+'</td>';
    partsString+='<td>'+commitParts[i].IS_SELF+'</td>';
    partsString+='</tr>';

    partsMoney+=parseFloat(commitParts[i].PART_MONEY);

  }

  for(let i=0;i<4;i++){
    otherString+='<tr class="text-center">';
    otherString+='<td>'+(parseInt(i)+1)+'</td>';

    otherString+='<td colspan="6">'+commitOtherItem[0]['REPAIR_ITEM'+(parseInt(i)+1)]+'</td>';
    otherString+='<td colspan="2" tclass="c">'+commitOtherItem[0]['REPAIR_MONEY'+(parseInt(i)+1)]+'</td>';
    otherString+='</tr>';

    otherMoney+=parseFloat(commitOtherItem[0]['REPAIR_MONEY'+(parseInt(i)+1)]);

  }
  var style3='';
  if(styleFlag){
      style3='<meta http-equiv="X-UA-Compatible" content="IE=Edge"><style>table{border:2px #000 solid;border-collapse: collapse;} th,td{border: 1px solid #000;} .noBorder th,.noBorder td{border:none;} .noRTLBorder th,.noRTLBorder td{border-right:none;border-top:none;border-left:none;} .noRLBorder th,.noRLBorder td{border-right:none;border-left:none;}' +
     "th,td {padding: 2px; line-height: 16px; text-align: center; vertical-align: middle;font-size:13px; } td{text-align: left;} .text-center,.text-center th,.text-center td{text-align:center;} .text-right,.text-right th,.text-right td{text-align:right;}" +
     ".w100{width:100px;} .w110{width:110px;} .w130{width:130px;} .w200{ width:200px;} .h30{ height:30px;line-height:25px;} .w30{width:30px;} .w70{width:70px;} .w80{width:80px;}  .w400{width:700px;} " +
     ".text-left{text-align:left;} </style>";
  }

  

  var temp='<div style="padding:0 30px;" id="print_style">'+style3+
            '<table border=0 width="100%" cellspacing="0" cellpadding="0" bordercolor="#000000">'+
            '<tdead>'+
            '<tr class="noBorder">'+
            '<td colspan="10" style="text-align:center;"><b style="line-height:30px;font-size:18px;">机动车维修费用结算清单</b></td>'+
            '</tr>'+
            '<tr class="noBorder">'+
            '<td colspan="3"></td>'+
            '<td colspan="7" style="text-align:right;">结算清单编号：'+listSearch.COLLECT_NO+'</td>'+
            '</tr>'+
            '</thead>'+
            '<tbody>'+
            '<tr class="text-center">'+
            '<td colspan="2" class="w80">机动车所有人</td>'+
            '<td colspan="2" >'+listSearch.CUSTOMER_NAME+'</td>'+
            '<td>送修人</td>'+
            '<td colspan="2" >'+listSearch.GIVE_REPAIR_PERSON+'</td>'+
            '<td colspan="2">联系电话</td>'+
            '<td>'+listSearch.TELPHONE+'</td>'+
            '</tr>'+
            '<tr class="text-center">'+
            '<td colspan="2" >品牌型号</td>'+
            '<td colspan="2" >'+listSearch.VEHICLE_MODEL+'</td>'+
            '<td>车牌号码</td>'+
            '<td colspan="2" >'+listSearch.PLATE_NUM+'</td>'+
            '<td colspan="2">发动机号</td>'+
            '<td>'+listSearch.ENGINE_NO+'</td>'+
            '</tr>'+
            '<tr class="text-center">'+
            '<td colspan="3" >车辆识别代码(VIN)</td>'+
            '<td colspan="4" >'+listSearch.VIN_NO+'</td>'+
            '<td colspan="2">车辆类型</td>'+
            '<td>'+listSearch.VEHICLE_TYPE+'</td>'+
            '</tr>'+
            '<tr class="text-center">'+
            '<td colspan="3" >工时定额执行标准</td>'+
            '<td colspan="4" >'+
            '<div style="display:inline-block;width:12px;height:12px;border:#000000 1px solid;"></div> 行业'+
            '&nbsp;&nbsp;&nbsp;&nbsp;<div style="display:inline-block;width:12px;height:12px;border:#000000 1px solid;"></div> 制造企业'+
            '</td>'+
            '<td colspan="2">车辆分类代号</td>'+
            '<td>'+listSearch.VEHICLE_TYPE_CODE+'</td>'+
            '</tr>'+
            '<tr class="text-center">'+
            '<td colspan="2" >维修企业名称</td>'+
            '<td colspan="5" >'+wtdData.tenantName+'</td>'+
            '<td colspan="2">维修企业联系人</td>'+
            '<td>'+wtdData.linkMan+'</td>'+
            '</tr>'+
            '<tr class="text-center">'+
            '<td colspan="2" >维修企业地址</td>'+
            '<td colspan="5" >'+wtdData.tenantAdd+'</td>'+
            '<td colspan="2">维修企业联系电话</td>'+
            '<td>'+wtdData.linkTel+'</td>'+
            '</tr>'+
            '<tr class="text-center">'+
            '<td colspan="5" >维修企业统一社会信用代码或组织机构代码</td>'+
            '<td colspan="5" >'+wtdData.orgNumber+'</td>'+
            '</tr>'+
            '<tr class="text-center">'+
            '<td colspan="2" >送修日期</td>'+
            '<td colspan="2" >'+listSearch.COME_DATE+'</td>'+
            '<td>出厂日期</td>'+
            '<td colspan="2" >'+listSearch.OUT_DATE+'</td>'+
            '<td colspan="2">维修类别</td>'+
            '<td>'+listSearch.REPAIR_TYPE+'</td>'+
            '</tr>'+
            '<tr class="text-center">'+
            '<td colspan="2" >送修里程</td>'+
            '<td colspan="3" >'+listSearch.MILEAGE+'</td>'+
            '<td colspan="2">出厂里程</td>'+
            '<td colspan="3">'+listSearch.OUT_MILEAGE+'</td>'+
            '</tr>'+
            '<tr class="text-center">'+
            '<td colspan="2" style="border-bottom:2px #000 solid;">故障描述</td>'+
            '<td colspan="8" style="border-bottom:2px #000 solid;">'+listSearch.FAULT_DESC+'</td>'+
            '</tr>'+
            '<tr class="text-center">'+
            '<td rowspan="' + (commitItem.length+1+commitItemGroup.length) + '">工时<br/>费用</td>'+
            '<td class="w30">序号</td>'+
            '<td colspan="2">维修项目</td>'+
            '<td colspan="2">结算工时</td>'+
            '<td colspan="2">工时单价<br/>(元/工时)</td>'+
            '<td colspan="2">工时费用(元)</td>'+
            '</tr>'+
            // '<tpl for="items">'+
            // '<tr class="text-center">'+
            // '<td>{[xindex]}</td>'+
            // '<td colspan="2">{itemName}</td>'+
            // '<td colspan="2" tclass="a">{times:number("0.00")}</td>'+
            // '<td colspan="2" tclass="a">{timePrice:number("0.00")}</td>'+
            // '<td colspan="2" tclass="a">{itemMoney:number("0.00")}</td>'+
            // '</tr>'+
            // '</tpl>'+
            itemString+
            '<tr class="text-center">'+
            '<td colspan="8" style="border-bottom:2px #000 solid;text-align:right;">小计(元)：</td>'+
            '<td colspan="2" tdata="Sum" tindex="9" tclass="a" format="0.00" style="border-bottom:2px #000 solid;">'+itemMoney.toFixed(2)+'</td>'+
            '</tr>'+

            '<tr class="text-center">'+
            '<td rowspan="' + (commitParts.length+1) + '">材料<br/>费用</td>'+
            '<td class="w30">序号</td>'+
            '<td>材料名称</td>'+
            '<td>配件<br/>编码</td>'+
            '<td>品牌</td>'+
            '<td>数量</td>'+
            '<td>单价(元)</td>'+
            '<td>金额(元)</td>'+
            '<td>配件类型</td>'+
            '<td>是否为托修<br/>方自备配件</td>'+
            '</tr>'+
            partsString+
            // '<tpl for="parts">'+
            // '<tr class="text-center">'+
            // '<td>{[xindex]}</td>'+
            // '<td>{partName}</td>'+
            // '<td>{partCode}</td>'+
            // '<td>{BRAND:this.formatDict}</td>'+
            // '<td tclass="b">{partNum}</td>'+
            // '<td tclass="b">{salesPrice:number("0.00")}</td>'+
            // '<td tclass="b">{partMoney:number("0.00")}</td>'+
            // '<td>{partSource:this.formatDict}</td>'+
            // '<td>{isSelf}</td>'+
            // '</tr>'+
            // '</tpl>'+

            '<tr class="text-center">'+
            '<td colspan="7" style="border-bottom:2px #000 solid;text-align:right;">小计(元)：</td>'+
            '<td tdata="Sum" tindex="8" tclass="b" format="0.00" style="border-bottom:2px #000 solid;">'+partsMoney.toFixed(2)+'</td>'+
            '<td colspan="2" style="border-bottom:2px #000 solid;"></td>'+
            '</tr>'+
            '<tr class="text-center">'+
            '<td rowspan="' + '5' + '">其它<br/>费用</td>'+
            

            '<td class="w30">序号</td>'+
            '<td colspan="6">项目</td>'+
            '<td colspan="2">金额(元)</td>'+
            '</tr>'+
            otherString+
            // '<tpl for="others">'+
            // '<tr class="text-center">'+
            // '<td>{[xindex]}</td>'+
            // '<td colspan="6">{repairItem1}</td>'+
            // '<td colspan="2">{repairMoney1:number("0.00")}</td>'+
            // '</tr>'+
            // '</tpl>'+

            '<tr class="text-center">'+
            '<td colspan="8" style="border-bottom:2px #000 solid;text-align:right;">小计(元)：</td>'+
            '<td colspan="2" tdata="Sum" tindex="9" tclass="c" format="0.00" style="border-bottom:2px #000 solid;">'+otherMoney.toFixed(2)+'</td>'+
            '</tr>'+
            '<tr class="text-center">'+
            '<td colspan="3">总费用：</td>'+
            '<td colspan="7" style="text-align:left;">'+(listSearch.SUM_MONEY).toFixed(2)+'元(工时优惠:'+(listSearch.REPAIR_ITEM_DERATE_MONEY).toFixed(2)+'元,材料优惠:'+(listSearch.REPAIR_PART_DERATE_MONEY).toFixed(2)+'元)</td>'+
            '</tr>'+
            '<tr class="text-center">'+
            '<td colspan="3" style="border-bottom:2px #000 solid;">旧件处理结果：</td>'+
            '<td colspan="7" style="border-bottom:2px #000 solid;"><div style="display:inline-block;width:12px;height:12px;border:#000000 1px solid;'+partResult(listSearch.OLD_PART_RESULT,1)+'"></div> 旧配件已确认，由托修方收回；&nbsp;<div style="display:inline-block;width:12px;height:12px;border:1px #000000 solid;align-left:30px;'+partResult(listSearch.OLD_PART_RESULT,2)+'"></div> 旧件已确认，由承修方收回；&nbsp;<div style="display:inline-block;width:12px;height:12px;border:1px #000000 solid;align-left:30px;'+partResult(listSearch.OLD_PART_RESULT,3)+'"></div> 无旧配件</td>'+
            '</tr>'+
            '<tr class="noBorder">'+
            '<td colspan="10" class="text-left" style="padding:10px 10px 0px 10px;">1. 本结算清单一式两联，分别由托修方、承修方留存。</td>'+
            '</tr>'+
            '<tr class="noBorder">'+
            '<td colspan="10" class="text-left" style="padding:0px 10px">2. 结算清单项目及应付金额经双方核实，托修方签字后生效。</td>'+
            '</tr>'+
            '<tr class="noBorder">'+
            '<td colspan="10" class="text-left" style="padding:0px 10px">3. 承修方不承担托修方自备配件质量保证责任。</td>'+
            '</tr>'+
            '<tr class="noBorder">'+
            '<td colspan="10" class="text-left" style="padding:0px 10px">4. 企业承诺本次维修质量保证期为车辆行驶<span style="border-bottom:#000 1px solid;display:inline-block;padding:0 10px;">'+store.state.user.userInfo.params[4].PARAM_VALUE+'</span>公里或者<span style="border-bottom:#000 1px solid;display:inline-block;padding:0 10px;">'+store.state.user.userInfo.params[5].PARAM_VALUE+'</span>日，里程和时间以先到者为准。</td>'+
            '</tr>'+
            '<tr class="noBorder">'+
            '<td colspan="10" class="text-left" style="padding:0px 10px">5. 企业承诺本次维修的新能源汽车专用部件<span style="border-bottom:#000 1px solid;display:inline-block;padding:0 10px;min-width:30px;">'+listSearch.ZY_PART+'</span>维修质量保证期为<span style="border-bottom:#000 1px solid;display:inline-block;padding:0 10px;min-width:30px;">'+listSearch.ZY_PART_BZQ+'</span>公里。</td>'+
            '</tr>'+
            '<tr class="noBorder">'+
            '<td colspan="10" class="text-left" style="padding:0px 10px">6. 请扫描二维码或登录上海汽修平台，对本次维修服务进行评价。</td>'+
            '</tr>'+
            '<tr class="noBorder">'+
            '<td colspan="5" style="text-align:right;"><img src="/static/img/pj_qrcode.png" style="width:152px;height:152px;"/></td>'+
            '<td colspan="5" style="padding:30px 0px;vertical-align: top;text-align:left;">上海市机动车维修公共服务平台</td>'+
            '</tr>'+
            '<tr class="noBorder">'+
            '<td colspan="5" style="text-align:left;">承修方 (盖章)：</td>'+
            '<td colspan="5" style="text-align:left;">托修方签名 (盖章)：</td>'+
            '</tr>'+
            '<tr class="noBorder">'+
            '<td colspan="5" style="text-align:left;">日期：<span style="display:inline-block;width:40px;"></span>年<span style="display:inline-block;width:40px;"></span>月<span style="display:inline-block;width:40px;"></span>日</td>'+
            '<td colspan="5" style="text-align:left;">日期：<span style="display:inline-block;width:40px;"></span>年<span style="display:inline-block;width:40px;"></span>月<span style="display:inline-block;width:40px;"></span>日</td>'+
            '</tr>'+
            '<tr class="noBorder">'+
            '<td colspan="10" style="height:10px;"></td>'+
            '</tr>'+
            '</tbody>'+
            '</table>'+
            '</div>';

            return temp;

};

//打印采购台账-----------
export const printPBFun=function(tableData){
  var printString='';

  for(let i in tableData){
    printString+='<tr class="noRLBorder text-center">';
    printString+='<td class="w70">'+(parseInt(i)+1)+'</td>';
    printString+='<td class="w100">'+filterFun(tableData[i].CREATE_TIME)+'</td>';
    printString+='<td class="w100">'+filterFun(tableData[i].NAME)+'</td>';
    printString+='<td class="w100">'+filterFun(tableData[i].FORMAT)+'</td>';
    printString+='<td class="w100">'+filterFun(tableData[i].NAME1)+'</td>';
    printString+='<td class="w100">'+filterFun(tableData[i].ADDRESS)+'</td>';
    printString+='<td class="w100">'+filterFun(tableData[i].PURCHASE_PRICE)+'</td>';
    printString+='<td class="w100">'+filterFun(tableData[i].PART_NUM)+'</td>';
    printString+='<td class="w100">'+filterFun(tableData[i].total)+'</td>';
    printString+='<td class="w100">'+filterFun(tableData[i].TYPE_NAME)+'</td>';
    printString+='</tr>';
  }
  
  var style3='<meta http-equiv="X-UA-Compatible" content="IE=Edge"><style>table{border:none;border-collapse: collapse;} th,td{border: 1px solid #000;} .noBorder th,.noBorder td{border:none;} .noRTLBorder th,.noRTLBorder td{border-right:none;border-top:none;border-left:none;} .noRLBorder th,.noRLBorder td{border-right:none;border-left:none;}' +
     "th,td {padding: 4px 3px; line-height: 16px; text-align: center; vertical-align: middle;font-size:13px; } td{text-align: left;} .text-center,.text-center th,.text-center td{text-align:center;} .text-right,.text-right th,.text-right td{text-align:right;}" +
     ".w100{width:100px;} .w110{width:110px;} .w130{width:130px;} .w200{ width:200px;} .h30{ height:30px;line-height:25px;} .w30{width:30px;} .w70{width:70px;} .w80{width:80px;}  .w400{width:700px;} " +
     ".text-left{text-align:left;} </style>";
  var temp=style3+'<div style="padding:0 20px;">'+
            '<table border=0 width="100%" cellspacing="0" cellpadding="0" bordercolor="#000000">'+
            '<tbody>'+
            '<tr class="noRLBorder">'+
            '<td colspan="8" class="text-left">采购台账</td>'+
            '</tr>'+
            '<tr class="noRLBorder text-center">'+
            '<td class="w70">序号</td>'+
            '<td class="w100">购买日期</td>'+
            '<td class="w100">产品名称</td>'+
            '<td class="w100">规格型号</td>'+
            '<td class="w100">供应商名称</td>'+
            '<td class="w100">供应商地址</td>'+
            '<td class="w100">进货单价</td>'+
            '<td class="w100">数量</td>'+
            '<td class="w100">金额</td>'+
            '<td class="w100">配件类型</td>'+
            '</tr>'+

            // '<tpl for="items">'+
            // '<tr class="noRLBorder text-center">'+
            // '<td>{[xindex]}</td>'+
            // '<td tclass="a">{createTime:date("Y-m-d")}</td>'+
            // '<td tclass="a">{itemName}</td>'+
            // '<td tclass="a">{format}</td>'+
            // '<td tclass="a">{saleName}</td>'+
            // '<td tclass="a">{address}</td>'+
            // '<td tclass="a">{purchasePrice}</td>'+
            // '<td tclass="a">{partNum}</td>'+
            // '<td tclass="a">{total}</td>'+
            // '<td tclass="a">{typeName}</td>'+
            // '</tr>'+
            // '</tpl>'+
            printString+
            '</tbody>'+
            '</table>'+
            '</div>';
            return temp;
};
//打印仓库盘点--------
export const printPdd=function(wtdData,listSearch,commitParts) {
        var partsString="";
        for(let i in commitParts){
            
                partsString+='<tr>';
                partsString+='<td>'+(parseInt(i)+1)+'</td>';
                partsString+='<td colspan="2">'+commitParts[i].NAME+'</td>';
                partsString+='<td>'+commitParts[i].FACTORY_NO+'</td>';
                partsString+='<td>'+commitParts[i].UNIT+'</td>';
                partsString+='<td>'+commitParts[i].BRAND+'</td>';
                partsString+='<td style="text-align:right;" tclass="a">'+commitParts[i].CHECK_NUM+'</td>';
                partsString+='<td style="text-align:right;" tclass="a">'+commitParts[i].STOCK_NUM+'</td>';
                partsString+='<td style="text-align:right;" tclass="a">'+commitParts[i].DIFFERENCE_NUM+'</td>';
                partsString+='<td>'+commitParts[i].REMARK+'</td>';
                partsString+='</tr>';

                    
            
        }
        

        var style3='<meta http-equiv="X-UA-Compatible" content="IE=Edge"><style>table{border:2px #000 solid;border-collapse: collapse;} th,td{border: 1px solid #000;} .noBorder th,.noBorder td{border:none;} .noRTLBorder th,.noRTLBorder td{border-right:none;border-top:none;border-left:none;} .noRLBorder th,.noRLBorder td{border-right:none;border-left:none;}' +
     "th,td {padding: 2px; line-height: 16px; text-align: center; vertical-align: middle;font-size:13px; } td{text-align: left;} .text-center,.text-center th,.text-center td{text-align:center;} .text-right,.text-right th,.text-right td{text-align:right;}" +
     ".w100{width:100px;} .w110{width:110px;} .w130{width:130px;} .w200{ width:200px;} .h30{ height:30px;line-height:25px;} .w30{width:30px;} .w70{width:70px;} .w80{width:80px;}  .w400{width:700px;} " +
     ".text-left{text-align:left;} </style>";
        var table =style3+
            '<div style="padding:0 20px;">'+
            '<table border=0 width="100%" cellspacing="0" cellpadding="0" bordercolor="#000000">'+
            '<tr>'+
                '<td height="50" colspan="10"><div align="center" style="font-size:24px;"><strong>仓库盘点单</strong></div></td>'+
            '</tr>'+
            '<tr>'+
                '<td colspan="2">维修企业名称</td>'+
                '<td colspan="3">'+wtdData.tenantName+'</td>'+
                '<td colspan="2">维修企业联系人</td>'+
                '<td colspan="3">'+wtdData.linkMan+'</td>'+
            '</tr>'+
            '<tr>'+
                '<td colspan="2">维修企业地址</td>'+
                '<td colspan="3">'+wtdData.tenantAdd+'</td>'+
                '<td colspan="2">维修企业联系电话</td>'+
                '<td colspan="3">'+wtdData.linkTel+'</td>'+
            '</tr>'+
            '<tr>'+
                '<td colspan="2">盘点仓库</td>'+
                '<td colspan="3">'+listSearch.STORE_NAME+'</td>'+
                '<td colspan="2">盘点日期</td>'+
                '<td colspan="3">'+listSearch.CHECK_DATE+'</td>'+
            '</tr>'+
            '<tr>'+
                '<td colspan="2">盘点人</td>'+
                '<td colspan="3">'+listSearch.CHECK_PERSON+'</td>'+
                '<td colspan="2">盘点单号</td>'+
                '<td colspan="3">'+listSearch.CHECK_NO+'</td>'+
            '</tr>'+
            '<tr>'+
                '<td colspan="2">盘点类型</td>'+
                '<td colspan="3">'+listSearch.CHECK_TYPE+'</td>'+
                '<td colspan="2">打印日期</td>'+
                '<td colspan="3">'+listSearch.printDate+'</td>'+
            '</tr>'+
            '<tr>'+
                '<td colspan="2">备注</td>'+
                '<td colspan="8">'+listSearch.REMARK+'</td>'+
            '</tr>'+
            '<tr>'+
                '<td class="w50"><strong>序号</strong></td>'+
                '<td colspan="2"><strong>配件名称</strong></td>'+
                '<td><strong>原厂编号</strong></td>'+
                '<td><strong>单位</strong></td>'+
                '<td><strong>品牌</strong></td>'+
                '<td style="text-align:right;"><strong>实盘数量</strong></td>'+
                '<td style="text-align:right;"><strong>现库数量</strong></td>'+
                '<td style="text-align:right;"><strong>差异数量</strong></td>'+
                '<td><strong>备注</strong></td>'+
            '</tr>'+
            partsString+
            // '<tpl for="parts">'+
            //     '<tr>'+
            //         '<td>{[xindex]}</td>'+
            //         '<td colspan="2">{NAME}</td>'+
            //         '<td>{FACTORY_NO}</td>'+
            //         '<td>{UNIT:this.formatDict}</td>'+
            //         '<td>{BRAND:this.formatDict}</td>'+
            //         '<td style="text-align:right;" tclass="a">{CHECK_NUM}</td>'+
            //         '<td style="text-align:right;" tclass="a">{STOCK_NUM:number("0")}</td>'+
            //         '<td style="text-align:right;" tclass="a">{DIFFERENCE_NUM:number("0")}</td>'+
            //         '<td>{REMARK}</td>'+
            //     '</tr>'+
            // '</tpl>'+
            '<tr>'+
                '<td colspan="6" style="text-align:right;"><strong>数量汇总：</strong></td>'+
                '<td style="text-align:right;" tdata="Sum" tindex="7" tclass="a" format="0" >######</td>'+
                '<td style="text-align:right;" tdata="Sum" tindex="8" tclass="a" format="0" >######</td>'+
                '<td style="text-align:right;" tdata="Sum" tindex="9" tclass="a" format="0" >######</td>'+
                '<td style="text-align:right;"></td>'+
            '</tr>'+
            '</tbody>'+
            '</table>'+
            '</div>';
            return table;
        
    }

//数据转化为中文-----
function convertCurrency(money) {
  //汉字的数字
  var cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖');
  //基本单位
  var cnIntRadice = new Array('', '拾', '佰', '仟');
  //对应整数部分扩展单位
  var cnIntUnits = new Array('', '万', '亿', '兆');
  //对应小数部分单位
  var cnDecUnits = new Array('角', '分', '毫', '厘');
  //整数金额时后面跟的字符
  var cnInteger = '整';
  //整型完以后的单位
  var cnIntLast = '元';
  //最大处理的数字
  var maxNum = 999999999999999.9999;
  //金额整数部分
  var integerNum;
  //金额小数部分
  var decimalNum;
  //输出的中文金额字符串
  var chineseStr = '';
  //分离金额后用的数组，预定义
  var parts;
  if (money == '') { return ''; }
  money = parseFloat(money);
  if (money >= maxNum) {
    //超出最大处理数字
    return '';
  }
  if (money == 0) {
    chineseStr = cnNums[0] + cnIntLast + cnInteger;
    return chineseStr;
  }
  //转换为字符串
  money = money.toString();
  if (money.indexOf('.') == -1) {
    integerNum = money;
    decimalNum = '';
  } else {
    parts = money.split('.');
    integerNum = parts[0];
    decimalNum = parts[1].substr(0, 4);
  }
  //获取整型部分转换
  if (parseInt(integerNum, 10) > 0) {
    var zeroCount = 0;
    var IntLen = integerNum.length;
    for (var i = 0; i < IntLen; i++) {
      var n = integerNum.substr(i, 1);
      var p = IntLen - i - 1;
      var q = p / 4;
      var m = p % 4;
      if (n == '0') {
        zeroCount++;
      } else {
        if (zeroCount > 0) {
          chineseStr += cnNums[0];
        }
        //归零
        zeroCount = 0;
        chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
      }
      if (m == 0 && zeroCount < 4) {
        chineseStr += cnIntUnits[q];
      }
    }
    chineseStr += cnIntLast;
  }
  //小数部分
  if (decimalNum != '') {
    var decLen = decimalNum.length;
    for (var i = 0; i < decLen; i++) {
      var n = decimalNum.substr(i, 1);
      if (n != '0') {
        chineseStr += cnNums[Number(n)] + cnDecUnits[i];
      }
    }
  }
  if (chineseStr == '') {
    chineseStr += cnNums[0] + cnIntLast + cnInteger;
  } else if (decimalNum == '') {
    chineseStr += cnInteger;
  }
  return chineseStr;
}
//判断数据源---------
function filterFun(temp){
  if(temp){
    return temp;
  }else{
    return '';
  }
}
//判断旧配件处理结果
function partResult(val,result){
  if(val==result){
    return 'background:#000;'
  }else{
    return '';
  }
}

