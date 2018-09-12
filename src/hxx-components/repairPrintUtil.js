//2018-09-12

//打印委托单-----------
export const printWtsFun=function(wtdData,listSearch,commitItem,commitParts){
    var itemString='';
    var partsString='';
    for(let i in commitItem){
            itemString+='<tr class="noRLBorder text-center">';
            itemString+='<td>'+(i+1)+'</td>';
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
            partsString+='<td>'+(i+1)+'</td>';
            partsString+='<td>'+commitParts[i].PART_NO+'</td>';
            partsString+='<td>'+commitParts[i].NAME+'</td>';
            partsString+='<td>'+commitParts[i].UNIT+'</td>';
            partsString+='<td tclass="b">'+commitParts[i].PART_NUM+'</td>';
            partsString+='<td tclass="b">'+commitParts[i].SALES_PRICE+'</td>';
            partsString+='<td tclass="b">'+commitParts[i].PART_MONEY+'</td>';
            partsString+='<td tclass="b">'+commitParts[i].PART_DERATE_MONEY+'</td>';
            partsString+='</tr>';

            

            // '<td>{partCode}</td>'+
            // '<td>{partName}</td>'+
            // '<td>{unit:formatDict}</td>'+
            // '<td tclass="b">{partNum}</td>'+
            // '<td tclass="b">{salesPrice:number("0.00")}</td>'+
            // '<td tclass="b">{partMoney:number("0.00")}</td>'+
            // '<td tclass="b">{partYhMoney:number("0.00")}</td>'+
            // '</tr>'+
            // '</tpl>'+
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

            '<tr class="noBorder">'+
            '<td colspan="8" style="min-height:80px;vertical-align: top;"><b>故障描述：</b><p style="text-indent:2em;">'+listSearch.FAULT_DESC+'</p></td>'+
            '</tr>'+

            '<tr class="noRTLBorder">'+
                '<td colspan="8" style="text-align:left;"><b>预计费用 = 预计材料费 + 预计工时费 - 材料优惠金额 - 工时优惠金额</b><span style="display:inline-block;width:20px;">&nbsp;</span><b>预计费用：<font >￥'+listSearch.SUM_MONEY+'</font>'+
                '<span style="display:inline-block;width:20px;">&nbsp;</span>金额大写：<div style="display:inline-block;line-height:18px;float:right;">'+convertCurrency(listSearch.SUM_MONEY)+'</div></b></td>'+
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
export const printPgdFun=function(wtdData,listSearch,commitItem,commitParts) {
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
        // if (is3) {
        //     tenantInfo = '<tr class="noBorder">' +
        //         '<td colspan="8">承修方(盖章）: {record.tenantName}</td>' +
        //         '</tr>' +
        //         '<tr class="noRTLBorder">' +
        //         '<td colspan="4" >地   址： {record.tenantAdd}</td>' +
        //         '<td colspan="2">电   话： {record.linkTel}</td>' +
        //         '<td colspan="2">传   真： </td>' +
        //         '</tr>';
        // }

        var itemString='';
        var partsString='';
        for(let i in commitItem){
                itemString+='<tr class="noRLBorder text-center">';
                itemString+='<td>'+(i+1)+'</td>';
                itemString+='<td colspan="3">'+commitItem[i].NAME+'</td>';
                itemString+='<td>'+commitItem[i].REPAIR_TIME+'</td>';
                itemString+='<td colspan="1" tclass="b"></td>';
                itemString+='<td colspan="1" tclass="b">'+(commitItem[i].REMARK||'')+'</td>';
                itemString+='<td colspan="1" tclass="b">'+commitItem[i].WORK_CLASS_NAME+'</td>';
                itemString+='</tr>';

               
        }

        for(let i in commitParts){
                partsString+='<tr class="noRLBorder text-center">';
                partsString+='<td>'+(i+1)+'</td>';
                partsString+='<td colspan="3">'+commitParts[i].PART_NO+'</td>';
                partsString+='<td colspan="3">'+commitParts[i].NAME+'</td>';
                partsString+='<td colspan="1">'+commitParts[i].PART_NUM+'</td>';
                partsString+='</tr>';

                

                // '<tpl for="parts">'+
                // '<tr class="noRLBorder text-center">'+
                // '<td>{[xindex]}</td>'+
                // '<td colspan="3">{partCode}</td>'+
                // '<td colspan="3">{partName}</td>'+
                // '<td colspan="1">{partNum:number("0")}</td>'+
                // '</tr>'+
                // '</tpl>'+
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
            '<td>'+listSearch.PLAN_END_DATE+'</td>'+
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

