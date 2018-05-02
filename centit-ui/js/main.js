$(function() {
	// 菜单切换
	$(document).on({
		click : function() {
			var i = $(this).parent().index();
			if (i > 0) {
				if (i == 1) { // 开始使用
					$("#content > div").load("page/start.html", function() {
						$(this).parent().attr("class", "start-content");
						$(this).prepend("<link rel='stylesheet' href='css/start/b5e054c3.layout.min.css'>");
						$(this).prepend("<link rel='stylesheet' href='css/start/prettify-cmd.css'>");
						$(this).prepend("<link rel='stylesheet' href='css/start/font-awesome.css'>");
						$(this).prepend("<link rel='stylesheet' href='css/start/style.css'>");
						$(this).prepend("<link rel='stylesheet' href='css/start/e5248927.base.lib.min.css'>");
					});
				} else if (i == 2) { // 文档
					$("#content > div").load("page/develop.html", function() {
						$(this).parent().attr("class", "doc-content");
						$(this).prepend("<link rel='stylesheet' href='css/start/b5e054c3.layout.min.css'>");
						$(this).prepend("<link rel='stylesheet' href='css/start/prettify-cmd.css'>");
						$(this).prepend("<link rel='stylesheet' href='css/start/font-awesome.css'>");
						$(this).prepend("<link rel='stylesheet' href='css/start/style.css'>");
						$(this).prepend("<link rel='stylesheet' href='css/start/e5248927.base.lib.min.css'>");
					});
				} else if (i == 3) { // 组件
					window.open('/centit-ui/src/index.html');
				} else if (i == 4) { // 主题
          window.open('/centit-ui/demo/index.html');
				}
			}

			if ([0, 1, 2].indexOf(i) > -1) {
        $(".header ul li").removeClass("active");
        $(this).parent().addClass("active");
      }
		}
	}, ".header ul a");

	// 示例-类型
//	$(document).on({
//		mouseenter : function() {
//			$(this).parent().addClass("on");
//		}
//	}, ".example-content .cont .left .item-2 div:first");
//	$(document).on({
//		mouseleave : function() {
//			$(this).removeClass("on");
//		}
//	}, ".example-content .cont .left .item-2");

	// 示例-风格
	$(document).on({
		click : function() {
			$(this).siblings("a").removeClass("on");
			$(this).addClass("on");
		}
	}, ".example-content .cont .left .item-3 a");

	// 示例-布局
	$(document).on({
		click : function() {
			$(this).siblings("a").removeClass("on");
			$(this).addClass("on");
		}
	}, ".example-content .cont .left .item-4 a");

	// 示例-条件
	$(document).on({
		mouseenter : function() {
			$(this).find("ul:hidden").show();
		},
		mouseleave : function() {
			$(this).find("ul:visible").hide();
		}
	}, ".example-content .cont .right .condition div");

	// 示例-主题预览
	$(document).on({
		mouseenter : function() {
			$(this).find("div:first:hidden").show();
		},
		mouseleave : function() {
			$(this).find("div:first:visible").hide();
		}
	}, ".example-content .cont .right .data > div .theme");

	// 示例-主题
	$(document).on({
		click : function() {
			$(this).siblings("a").removeClass("on");
			$(this).addClass("on");
		}
	}, ".example-content .cont .right .data > div .theme div a");

	// 示例-评分
	$(document).on({
		mouseenter : function() {
			for (var i = 0; i < $(this).index(); i++)
				$(this).parent().find("a:eq(" + i + ")").addClass("on");
		},
		mouseleave : function() {
			$(this).parent().find("a").removeClass("on");
		}
	}, ".example-content .cont .right .data .item > div a");

	// 鼠标滚动时事件
	window.onscroll = function() {
    	var scroll = document.documentElement.scrollTop || document.body.scrollTop;
    	// 显示返回顶部
    	scroll >= 200 ? $("#backTop:hidden").fadeIn("fast") : $("#backTop:visible").fadeOut("fast");
	};

	// 返回顶部
	$(document).on({
		click : function() {
			 $("html,body").animate({
				 scrollTop : 0
			 }, "normal");
		}
	}, "#backTop");
});
