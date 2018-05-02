$(function() {
	$("input:visible:first")[0].focus();
	var windowWidth = $(window).width();
	var offsetbg = 0;
	var cloud1 = 450;
	var cloud2 = 0;
	setInterval(function() {
		if (offsetbg >= windowWidth)
			offsetbg = -600;
		offsetbg += 1;
		$("body").css("background-position", -offsetbg + "px 0");
	}, 90);
	setInterval(function() {
		if (cloud1 >= windowWidth)
			cloud1 = -400;
		if (cloud2 >= windowWidth)
			cloud2 = -400;
		cloud1 += 1.5;
		cloud2 += 1;
		$(".cloud1").css("background-position", cloud1 + "px 100px");
		$(".cloud2").css("background-position", cloud2 + "px 460px");
	}, 70);
	$(window).resize(function() {
		windowWidth = $(window).width();
	});
});