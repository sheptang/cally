$(document).ready(function(){
	$("#miniCalendar").load("/source/minical.php",function(){
		$.getScript("/source/js/minical.js",function(){
			// Catch key presses for minical
			$(document).keydown(function(e){
				if(document.activeElement.tagName=="BODY"){
					if(e.shiftKey){
						if(e.shiftKey && (e.which===37)){
							$("#calendarScopePrev").trigger("click");
						}else if(e.shiftKey && (e.which===39)){
							$("#calendarScopeNext").trigger("click");
						}
					}else{
						var minicalCurrentScopeMY=$("#minicalScope").val();
						var minicalCurrentScopeMonth=minicalCurrentScopeMY.split("-")[0];
						var minicalCurrentScopeYear=minicalCurrentScopeMY.split("-")[1];
						if(e.which===37 && !(minicalCurrentScopeYear=="0" && minicalCurrentScopeMonth=="1")){
							$("#minicalScopePrev").trigger("click");
						}else if(e.which===39 && !(minicalCurrentScopeYear=="9999" && minicalCurrentScopeMonth=="12")){
							$("#minicalScopeNext").trigger("click");
						}
					}
				}
			});
		});
		$.getScript("/source/js/calendar.js");
		$.getScript("/source/js/minipick.js");
	});
	// Sanitize inputs
	function encodeHTML(s){
		return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/"/g,"&quot;");
	}
	// Pop-up window functionality
	$("#sign-in-pop, #sign-up-pop, #settings-pop, #create-pop, #manage-pop, #edit-pop").draggable({
		handle:".pop-top",
		containment:"body",
		scroll:false,
	});
	$("#sign-in-button, #sign-up-button, #settings-button, #create-button, #manage-button").on("click",function(){
		var openPop, fullMask;
		if($(this).attr("id")=="sign-in-button"){
			openPop="#sign-in-pop";
			fullMask="#full-mask";
		}else if($(this).attr("id")=="sign-up-button"){
			openPop="#sign-up-pop";
			fullMask="#full-mask";
		}else if($(this).attr("id")=="settings-button"){
			openPop="#settings-pop";
			fullMask="#full-mask-t-b";
		}else if($(this).attr("id")=="create-button"){
			openPop="#create-pop";
			fullMask="#full-mask-t-b";
			$("#editOrCreate").val("create");
		}else if($(this).attr("id")=="manage-button"){
			openPop="#manage-pop";
			fullMask="#full-mask-t-b";
		}
		$(openPop).show("fade",{duration:300,easing:"easeInOutQuint"});
		$(fullMask).show("fade",{duration:300,easing:"easeInOutQuint"});
		$(openPop).find("input").eq(0).focus();
		$("#createBlock input[type='text']").on("change paste keyup",function(){
			var createInput=$("#createBlock input[type='text']").val();
			if(createInput.length>0){
				$("#createBlock input[type='submit']").prop("disabled",false);
			}else{
				$("#createBlock input[type='submit']").prop("disabled",true);
			}
		});
		$(".close-icon, "+fullMask).click(function(){
			$(openPop).hide("fade",{duration:300,easing:"easeInOutQuint"},function(){
				$(this).find("form").trigger("reset");
				$(openPop).removeAttr("style");
				$(this).find("input#sign-up-submit").prop("disabled",true);
				$("#signInForm input[name='password']").removeClass("error").attr("placeholder","Password");
				$("#signUpForm input[name='password']").removeClass("error").attr("placeholder","Password (8-72 characters)");
				$("#signUpForm input[name='confirmPassword']").removeClass("error").attr("placeholder","Confirm Password");
				$("#signUpForm input[name='email']").removeClass("error").attr("placeholder","E-mail Address");
			});
			$(fullMask).hide("fade",{duration:300,easing:"easeInOutQuint"});
		});
	});
	// Checks if checkbox is checked or not
	$("#termsCheck").on("change",function(){
			$(this).closest(".d-b").find("input[type='submit']").prop("disabled",(i,v)=>!v);
		});
	$("#signUpForm input[name='password']").on("change paste keyup",function(){
		$(this).removeClass("error");
		$("#signUpForm input[name='confirmPassword']").removeClass("error");
	});
	$("#signInForm input[name='password'], #signUpForm input[name='confirmPassword'], #signUpForm input[name='email']").on("change paste keyup",function(){
		$(this).removeClass("error");
	});
	// Sign up AJAX
	var sUrequest;
	$("#signUpForm").submit(function(e){
		e.preventDefault();
		if(sUrequest){
			sUrequest.abort();
		}
		var inputs=$(this).find("input, select, button, textarea");
		for(i=0;i<inputs.lenth;i++){
			inputs[i]=encodeHTML(inputs[i].val());
		}
		var serializedData=$(this).serialize();
		inputs.prop("disabled",true);
		sUrequest=$.ajax({
			url:"/source/signup.php",
			type:"post",
			data:serializedData,
		});
		sUrequest.done(function(response,statusText,jqXHR){
			var getResponse=JSON.parse(response);
			if(getResponse["code"]=="100000"){
				$(".close-icon").trigger("click");
				setTimeout(function(){
					$("#sign-in-button").trigger("click");
					$("#signInForm input[name='email']").val(getResponse["email"]);
					$("#signInForm input[name='password']").focus();
				},500);
			}else if(getResponse["code"]=="-10003"){
				$("#signUpForm input[name='password']").val("").addClass("error").attr("placeholder","Password should be in between 8 and 72 characters.");
				$("#signUpForm input[name='confirmPassword']").val("").addClass("error");
			}else if(getResponse["code"]=="-10002"){
				$("#signUpForm input[name='confirmPassword']").val("").addClass("error").attr("placeholder","This field didn't match with the desired password.");
			}else if(getResponse["code"]=="-10001"){
				$("#signUpForm input[name='email']").val("").addClass("error").attr("placeholder","E-mail address is either invalid or already used.");
			}
		});
		sUrequest.fail(function(jqXHR,statusText,thrownError){
			console.log("jq:"+jqXHR+" st:"+statusText+" te:"+thrownError);
		});
		sUrequest.always(function(){
			inputs.prop("disabled",false);
		});
	});
	// Sign in AJAX
	var sIrequest;
	$("#signInForm").submit(function(e){
		e.preventDefault();
		if(sIrequest){
			sIrequest.abort();
		}
		var inputs=$(this).find("input, select, button, textarea");
		for(i=0;i<inputs.lenth;i++){
			inputs[i]=encodeHTML(inputs[i].val());
		}
		var serializedData=$(this).serialize();
		inputs.prop("disabled",true);
		sIrequest=$.ajax({
			url:"/source/signin.php",
			type:"post",
			data:serializedData,
		});
		sIrequest.done(function(response,statusText,jqXHR){
			var getResponse=JSON.parse(response);
			if(getResponse["code"]=="100000"){
				window.location.reload(true);
			}else if(getResponse["code"]=="-100000"){
				$("#signInForm input[name='password']").val("").addClass("error").attr("placeholder","E-mail address and password didn't match");
			}else if(getResponse["code"]=="-10001"){
				$(".close-icon").trigger("click");
				setTimeout(function(){
					$("#sign-up-button").trigger("click");
					$("#signUpForm input[name='email']").val(getResponse["email"]);
					$("#signUpForm input[name='firstName']").focus();
				},500);
			}
		});
		sIrequest.fail(function(jqXHR,statusText,thrownError){
			console.log("jq:"+jqXHR+" st:"+statusText+" te:"+thrownError);
		});
		sIrequest.always(function(){
			inputs.prop("disabled",false);
		});
	});
	// Sign out AJAX
	var sOrequest;
	$("#signMeOut").click(function(){
		sOrequest=$.ajax({
			url:"/source/signout.php",
			type:"post",
			data:"signout=true",
		});
		sOrequest.done(function(response,statusText,jqXHR){
			var getResponse=JSON.parse(response);
			if(getResponse["code"]=="100"){
				window.location.reload(true);
			}
		});
	});
	// Change calendar view mode
	$("#canvasSelectButton").click(function(){
		$("#canvasSelectMenu, #full-mask-t").show("fade",{duration:300,easing:"easeInOutQuint"});
		$(this).find("i.fas").css("transform","rotate(180deg)");
		$("#full-mask-t, .canvasSelectItem").click(function(){
			if($(this).not(".chosen").hasClass("canvasSelectItem")){
				var elemObj=$(this);
				$(".canvasSelectItem").removeClass("chosen",function(){
					elemObj.addClass("chosen");
				});
				if(elemObj.attr("cmode")=="w"){
					var cmode="Week&nbsp;&nbsp;&nbsp;";
				}else if(elemObj.attr("cmode")=="m"){
					var cmode="Month&nbsp;&nbsp;&nbsp;";
				}
				$("#calendarCanvas").val(elemObj.attr("cmode")).trigger("change");
				$("#canvasSelectButton span").html(cmode);
				if(elemObj.attr("cmode")=="w"){
					$("#calendarScopePrev").attr("title","Previous week");
					$("#calendarScopeNext").attr("title","Next week");
				}else if(elemObj.attr("cmode")=="m"){
					$("#calendarScopePrev").attr("title","Previous month");
					$("#calendarScopeNext").attr("title","Next month");
				}
			}
			$("#canvasSelectButton i.fas").css("transform","rotate(0deg)");
			$("#canvasSelectMenu, #full-mask-t").hide("fade",{duration:300,easing:"easeInOutQuint"});
		});
	});
	$("#full-mask-pick").on("click",function(){
		$("#datePick").hide("fade",{duration:300,easing:"easeInOutQuint"});
		$("#timePick").hide("fade",{duration:300,easing:"easeInOutQuint"});
		$("#full-mask-pick").hide();
	});
	$("#cally").click(function(){
		$("#todayScope").trigger("click");
	});
	$("#taskSearchInput").on("focusin",function(){
		$(this).attr("placeholder","Type and press Enter");
	});
	$("#taskSearchInput").on("focusout",function(){
		$(this).attr("placeholder","Search");
	});
});