export const printWtsFun=function(wtdData,listSearch,commitItem){
    var itemString='';
    for(let i in commitItem){
        for(let key in commitItem[i]){
            itemString+='<tr class="noRLBorder text-center">';
            itemString+='<td>{[xindex]}</td>';
            itemString+='<td colspan="2">{{item.NAME}}</td>';
            itemString+='<td tclass="a">{times:number("0.00")}</td>';
            itemString+='<td tclass="a">{timePrice:number("0.00")}</td>';
            itemString+='<td tclass="a">{itemMoney:number("0.00")}</td>';
            itemString+='<td tclass="a">{itemYhMoney:number("0.00")}</td>';
            itemString+='<td>{remark}</td>';
            
        }
        
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

            '<tr class="noRLBorder text-center" v-for="(item,index) in commitItem ">'+
            '<td>{[xindex]}</td>'+
            '<td colspan="2">{{item.NAME}}</td>'+
            '<td tclass="a">{times:number("0.00")}</td>'+
            '<td tclass="a">{timePrice:number("0.00")}</td>'+
            '<td tclass="a">{itemMoney:number("0.00")}</td>'+
            '<td tclass="a">{itemYhMoney:number("0.00")}</td>'+
            '<td>{remark}</td>'+

            '</tr>'+
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
            '<tpl for="parts">'+
            '<tr class="noRLBorder text-center">'+
            '<td>{[xindex]}</td>'+
            '<td>{partCode}</td>'+
            '<td>{partName}</td>'+
            '<td>{unit:formatDict}</td>'+
            '<td tclass="b">{partNum}</td>'+
            '<td tclass="b">{salesPrice:number("0.00")}</td>'+
            '<td tclass="b">{partMoney:number("0.00")}</td>'+
            '<td tclass="b">{partYhMoney:number("0.00")}</td>'+
            '</tr>'+
            '</tpl>'+
            '<tr class="noRLBorder text-center">'+
            '<td colspan="4">合计：</td>'+
            '<td tdata="SubCount" tindex="5" tclass="b" format="#">###</td>'+
            '<td tdata="Average" tindex="6" tclass="b" format="0.00">######</td>'+
            '<td tdata="Sum" tindex="7" tclass="b" format="0.00">######</td>'+
            '<td tdata="Sum" tindex="8" tclass="b" format="0.00">######</td>'+
            '</tr>'+
            '<tr class="noBorder">'+
            '<td colspan="8" style="min-height:80px;vertical-align: top;"><b>故障描述：</b><p style="text-indent:2em;">{record.FAULT_DESC}</p></td>'+
            '</tr>'+
            '<tr class="noRTLBorder">'+
           
            '</tr>'+
            '<tr class="noRLBorder">'+
            '<td colspan="8" class="text-left">'+
            '注：在车辆维修过程中，因车辆内在原因，需增加维修项目或扩大维修范围时，应当征得托修方同意后方可修理。<br/>'+
            '旧件是否保留：<div style="display:inline-block;width:12px;height:12px;border:#000000 1px solid;"></div> 是 ， <div style="display:inline-block;width:12px;height:12px;border:#000000 1px solid;"></div> 否+'
            '</td>'+
            '</tr>'+
            '<tr class="noBorder">'+
            '<td colspan="4">预计交车时间：{record.PLAN_END_DATE:date("Y年m月d日 H时i分")}</td>'+
            '<td colspan="2">业务员签名：</td>'+
            '<td colspan="2">客户签名：</td>'+
            '</tr>'+
            '</tbody>'+
            '</table>'+
            '</div>'


            return temp;
};
