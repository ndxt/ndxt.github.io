
(function ($) {



jQuery.fn.fixClearType = function(){
    return this.each(function(){
        if( !!(typeof this.style.filter  && this.style.removeAttribute))
            this.style.removeAttribute("filter");
    })

} 

function nextWork() {
	$current = $('.showcase-item.active');
	$next = $('.showcase-item.active').next().length == 0 ? $('.show-case').children(':first') : $('.showcase-item.active').next();
	
	$current.removeClass('active');
	$next.addClass('active');
	
	$current.stop(true,true).fadeOut(300);
	$next.stop(true,true).fadeIn(300);
	

}
function prevWork() {
	$current = $('.showcase-item.active');
	$prev = $('.showcase-item.active').prev().length == 0 ? $('.show-case').children(':last') : $('.showcase-item.active').prev();
	
	$current.removeClass('active');
	$prev.addClass('active');
	
	$current.stop(true,true).fadeOut(300);
	$prev.stop(true,true).fadeIn(300);
}


$(document).ready(function() {
						   
			$("#logo").hover(
  function () {
    $(this).addClass("logo-over");
  }, 
  function () {
    $(this).removeClass("logo-over");
  }
);
			
	$('.menu-display .next').click(function(e) {e.preventDefault();
									
 nextWork();
});	$('.menu-display .prev').click(function(e) {e.preventDefault();
  prevWork();
});
	$('.showcase-item').css({'display':'none'});
	$('.showcase-item.active').css({'display':'block'});
	
loupe =  $('<a class="loupe" href=""><div class="glass"></div></a>').appendTo('body');

			
	
$('.magnify').click(function(e){
	
	
	e.preventDefault();
	
});


});
























$(document).ready(function() {
						   
$('.showcase-link').retina({preload: true})
						   
						   
$('#websites').click(function() {
		$(this).fixClearType();					 
	$(this).addClass('active');
	$('#print').removeClass('active');
	$('#all').removeClass('active');
	
	
	
	$('.print').stop(true,true).animate({
										'height' : '0px','opacity' : 0,
										'margin-bottom':0,'padding-bottom':0
										},
										'fast',
										function() {
											$('.print').hide();
											});
	
	$('.website').stop(true,true).css({'display':'block'}).animate({
										'height' : '100%','opacity' : 1.0,
										'margin-bottom':'30px',
										'padding-bottom':'30px'
										},
										'fast',
										function() {
											$(this).fixClearType();
											}
	
	);  
	
	
	
});
    	
		
		
		
		
$('#print').click(function() {
	$(this).addClass('active');
	$('#all').removeClass('active');
	$('#websites').removeClass('active');
	
	
	$('.website').stop(true,true).animate({'height' : '0px','opacity' : 0,'margin-bottom':0,'padding-bottom':0}, 'fast', function() {$('.website').hide();});  
	$('.print').stop(true,true).css({'display':'block'}).animate({'height' : '100%','opacity' : 1.0,'margin-bottom':'30px','padding-bottom':'30px'
								},
										'fast',
										function() {
											$(this).fixClearType();
											});  
	
$('.print p').removeAttr("filter");




});




$('#all').click(function() {
	$(this).addClass('active');
	$('#print').removeClass('active');
	$('#websites').removeClass('active');
	
	
	$('.work-item').stop(true,true).css({'display':'block'}).animate({'height' : '100%','opacity' : 1.0,'margin-bottom':'30px','padding-bottom':'30px' },
										'fast',
										function() {
											$(this).fixClearType();
											});  

});

	
});
})(jQuery);