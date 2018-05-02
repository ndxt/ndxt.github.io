$(function () {
	document.onselectstart = function () { return false; }
	$(document).bind("contextmenu", function () {
		return false;
	});
	Shieldkeydown();
})

//屏蔽F1到F12键
function Shieldkeydown() {
    $("*").keydown(function (e) {
        e = window.event || e || e.which;
        if (e.keyCode == 112 || e.keyCode == 113
            || e.keyCode == 114 || e.keyCode == 115
            || e.keyCode == 116 || e.keyCode == 117
            || e.keyCode == 118 || e.keyCode == 119
            || e.keyCode == 120 || e.keyCode == 121
            || e.keyCode == 122 || e.keyCode == 123) {
            e.keyCode = 0;
            return false;
        }
    })
}

//关闭遮罩窗体并返回结果集
//c:控件名称或指定信息 f:标示(0:控件数据；1:指定数据)
function closeAndReturn(c,f){
	var re_v = "{";
	if(f=="0"){
		var str = c.split(',');					
		for(var i=0;i<str.length;i++){					
			if(i==0){
				re_v += "\""+str[i]+"\":\""+$("#in_v").val()+"\"";
			}else{
				re_v += ",\""+str[i]+"\":\""+$("#in_v").val()+"\"";
			}					
		}
		re_v += "}";
	}else{
		re_v = "{\"name\":\""+c+"\"}";					
	}
	return parent.hidediv(re_v);
}


