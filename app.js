$(function() {
	window.api = '';
	window.loopid = 0;
	window.howmanyslides = 0;
	_ = document.webL10n.get;
	
	// get latest server settings
	if(localStorage.ipaddr) $("#ip").val(localStorage.ipaddr);
	if(localStorage.pwd) $("#pwd").val(localStorage.pwd);
	if(localStorage.port) $("#port").val(localStorage.port);
	
	// detect if ppt was closed on the server
	$(document).ajaxSuccess(function(event, xhr, settings) {
		if(xhr.responseJSON=='nopptavail') {
			if(!window.hadnoppterror) { // avoid repeating the same error 3 or 4 times
				window.hadnoppterror = true;
				clearInterval(window.loopid);
				$("#startppt").removeAttr('disabled');
				revealPage('page4');
			}
		}
	});
	
	// detect if the server was closed
	$(document).ajaxError(function(event, jqxhr, settings) {
		console.log(jqxhr.status+" - "+jqxhr.statusText);
		// this is not needed for the "isfireshow" call
		if(!window.hadlostconerror && !(~settings.url.indexOf(window.api+'isfireshow?callback='))) {
			clearInterval(window.loopid);
			revealPage('page0');
			alert(_("lostconnection"));
			window.hadlostconerror = true;
		}
	});
	
	// connect button
	$("#connect").click(function() {
		// get server config
		var ipaddr = $("#ip").val();
		var pwd = $("#pwd").val();
		var port = $("#port").val();
				
		// set global error flags
		window.hadnoppterror = false;
		window.hadlostconerror = false;
		
		// build API URL
		window.api = 'http://'+ipaddr+':'+port+'/'+pwd+'/';
		
		// test if server is active/is fireshow
		$.getJSON(window.api+'isfireshow?callback=?', function(res) {
			if(res=='yes') {
				$.getJSON(window.api+'checkpwd?callback=?', function(res) {
					if(res=='invalidpwd') {
						alert(_("wrongpwd"));
					} else {
						// save settings to localstorage
						localStorage.setItem("ipaddr", ipaddr);
						localStorage.setItem("pwd", pwd);
						localStorage.setItem("port", port);
						
						// start update loop
						window.loopid = setInterval(mainloop, 1000);
						revealPage('page1');
					}
				});
			} else {
				alert(_("nofireshow"));
			}
		}).fail(function() {
			alert(_("cantconnect"));
		});
	});
	
	$("#startppt").click(function() {
		$("#startppt").attr("disabled", "true");
		$.getJSON(window.api+'start?callback=?', function(res) {
			setTimeout(function() {
				window.hadnoppterror = false;
				window.loopid = setInterval(mainloop, 1000);
				revealPage('page1');
			}, 3000);
		});
	});
	
	$("#closeconnection").click(function() {
		revealPage('page0');
		clearInterval(window.loopid);
	});
	
	$("#gotoslide").on("click", "a", function() {
		var $thisbtn = $(this);
		var slide = $thisbtn.attr('rel');
		$("#gotoslide a").removeClass('button-active');
		$.getJSON(window.api+'goto-'+slide+'?callback=?', function(res) {
			$thisbtn.addClass('button-active');
		});
	});
	
	$(".cmd").click(function() {
		$(".cmd").attr('disabled', 'true');
		var cmd = $(this).attr('rel');
		$.getJSON(window.api+cmd+'?callback=?', function(res) {
			$(".cmd").removeAttr('disabled');
		}).fail(function() {
			$(".cmd").removeAttr('disabled');
		});
	});
	
	function mainloop() {
		// console.log('looping', window.hadnoppterror);
		// update slide notes
		$.getJSON(window.api+"notes?callback=?", function(res) {
			$("#slidenotes").text(res);
		});
		
		// update current view
		$.getJSON(window.api+"picture?callback=?", function(res) {
			if(res!='nopptavail') $("#slidepicture").attr('src', res);
		});
		
		// update Y "Slide X of Y"
		$.getJSON(window.api+"howmany?callback=?", function(res) {
			$("#slideY").text(res);
			
			if(window.howmanyslides != res) {
				window.howmanyslides = res;
				$("#gotoslide a").remove();
				// create "go to" buttons
				for(i = 1; i<=res; i++) {
					$("#gotoslide").append('\
						<a href="javascript:void(0);" class="button" rel="'+i+'">\
							'+i+'\
						</a>\
					');
				}
			}
			
			// update X of slide X of Y
			$.getJSON(window.api+"current?callback=?", function(cur) {
				$("#slideX").text(cur);
				$("#gotoslides a[rel="+cur+"]").addClass('button-active');
			});
		});
	}
});