$(document).ready(function(){
	// Current moment information
	var today=new Date(),
	currentDay=today.getDate(),
	currentMonth=today.getMonth()+1,
	currentYear=today.getFullYear(),
	currentWeekDay=(today.getDay() || 7)-1,
	calendarScope=currentDay+"-"+currentMonth+"-"+currentYear,
	recordedDate=currentDay+"-"+currentMonth+"-"+currentYear;
	$("#calendarScope").val(calendarScope).trigger("change");
	setInterval(function(){
		today=new Date(),
		currentDay=today.getDate(),
		currentMonth=today.getMonth()+1,
		currentYear=today.getFullYear(),
		currentWeekDay=(today.getDay() || 7)-1,
		calendarScope=currentDay+"-"+currentMonth+"-"+currentYear;
	},5000);
	var calendarCanvas=$("#calendarCanvas").val();
	var monthNames=["January","February","March","April","May","June","July","August","September","October","November","December"];
	calendarFiller(calendarCanvas,calendarScope);
	$("#calendarScope").on("change",function(){
		var calendarScope=$("#calendarScope").val();
		var calendarCanvas=$("#calendarCanvas").val();
		updateMinical(calendarScope);
		calendarFiller(calendarCanvas,calendarScope);
	});
	// Today button functionality
	$("#todayScope").on("click",function(){
		changeDMYScope(currentDay+"-"+currentMonth+"-"+currentYear);
	});
	$(".minicalCanvas").on("click",".minicalDay",function(evt){
		if(!($(evt.currentTarget).hasClass("minicalScopeDay")) || $("#calendarScope").val()!=$(evt.currentTarget).attr("data-scope")){
			changeDMYScope($(evt.currentTarget).attr("data-scope"));
			$("#minicalDayScope").val($(evt.currentTarget).attr("data-scope")).trigger("change");
		}
	});
	$("#calendarCanvas").on("change",function(){
		var calendarCanvas=$("#calendarCanvas").val();
		var calendarScope=$("#calendarScope").val();
		calendarFiller(calendarCanvas,calendarScope);
	});
	$("#calendarScopePrev, #calendarScopeNext").on("click",function(){
		if($(this).attr("id")=="calendarScopePrev"){
			changeMYScope("d");
		}else if($(this).attr("id")=="calendarScopeNext"){
			changeMYScope("u");
		}
	});
	$("#calendarInBetween").on("change",function(){
		if($("#calendarInBetween").val()!=""){
			$("#calendarScopeDisplay").html($("#calendarInBetween").val());
		}
	});
	// Changes Day-Month-Year scope
	function changeDMYScope(dmy){
		$("#calendarScope").val(dmy).trigger("change");
	}
	// Changes Month-Year scope
	function changeMYScope(direction){
		var calendarScope=$("#calendarScope").val(),
		calendarScopeSplit=calendarScope.split("-"),
		calendarScopeDay=parseInt(calendarScopeSplit[0],10),
		calendarScopeMonth=parseInt(calendarScopeSplit[1],10),
		calendarScopeYear=parseInt(calendarScopeSplit[2],10),
		calendarCanvas=$("#calendarCanvas").val();
		var firstDayOfScopeMonth=parseInt(wDOW(calendarScopeYear,calendarScopeMonth-1,1)[0],10),
		weekDayOfNextScope=parseInt(wDOW(calendarScopeYear,calendarScopeMonth,1)[0],10),
		weekDayOfScope=parseInt(wDOW(calendarScopeYear,calendarScopeMonth-1,calendarScopeDay)[0],10),
		totalDaysOfScope=parseInt(wDOW(calendarScopeYear,calendarScopeMonth,0)[1],10),
		totalDaysOfPrevScope=parseInt(wDOW(calendarScopeYear,calendarScopeMonth-1,0)[1],10),
		firstDayOfNextScope=parseInt(wDOW(calendarScopeYear,calendarScopeMonth+1,1)[1],10);
		if(direction=="d"){
			if(calendarScopeMonth==1){
				var calendarScopePrevMonth=12,
				calendarScopePrevMonthYear=calendarScopeYear-1;
			}else{
				var calendarScopePrevMonth=calendarScopeMonth-1,
				calendarScopePrevMonthYear=calendarScopeYear;
			}
			if(calendarCanvas=="w"){
				if(calendarScopeDay<=7){
					$("#calendarScope").val((totalDaysOfPrevScope+calendarScopeDay-7)+"-"+calendarScopePrevMonth+"-"+calendarScopePrevMonthYear).trigger("change");
				}else{
					$("#calendarScope").val((calendarScopeDay-7)+"-"+calendarScopeMonth+"-"+calendarScopeYear).trigger("change");
				}
			}else if(calendarCanvas=="m"){
				$("#calendarScope").val(totalDaysOfPrevScope+"-"+calendarScopePrevMonth+"-"+calendarScopePrevMonthYear).trigger("change");
			}
		}else if(direction=="u"){
			if(calendarScopeMonth==12){
				var calendarScopeNextMonthYear=calendarScopeYear+1;
			}else{
				calendarScopeNextMonthYear=calendarScopeYear;
			}
			if(calendarCanvas=="w"){
				if(calendarScopeDay>(totalDaysOfScope-7)){
					$("#calendarScope").val(((calendarScopeDay+7)-totalDaysOfScope)+"-"+((calendarScopeMonth%12)+1)+"-"+calendarScopeNextMonthYear).trigger("change");
				}else{
					$("#calendarScope").val((calendarScopeDay+7)+"-"+calendarScopeMonth+"-"+calendarScopeYear).trigger("change");
				}
			}else if(calendarCanvas=="m"){
				$("#calendarScope").val("1-"+((calendarScopeMonth%12)+1)+"-"+calendarScopeNextMonthYear).trigger("change");
			}
		}
	}
	function updateMinical(calendarScope){
		$("#minicalDayScope").val(calendarScope).trigger("change");
	}
	// Fills calendar for both week and month views
	function calendarFiller(canvas,calendarScope){
		var calendarScopeSplit=calendarScope.split("-"),
		calendarScopeDay=parseInt(calendarScopeSplit[0],10),
		calendarScopeMonth=parseInt(calendarScopeSplit[1],10),
		calendarScopeYear=parseInt(calendarScopeSplit[2],10);
		if(calendarScopeMonth==1){
			var calendarScopePrevMonth=12,
			calendarScopeNextMonth=calendarScopeMonth+1,
			calendarScopePrevMonthYear=calendarScopeYear-1,
			calendarScopeNextMonthYear=calendarScopeYear;
		}else if(calendarScopeMonth==12){
			var calendarScopePrevMonth=calendarScopeMonth-1,
			calendarScopeNextMonth=1,
			calendarScopePrevMonthYear=calendarScopeYear,
			calendarScopeNextMonthYear=calendarScopeYear+1;
		}else{
			var calendarScopePrevMonth=calendarScopeMonth-1,
			calendarScopeNextMonth=calendarScopeMonth+1,
			calendarScopePrevMonthYear=calendarScopeYear,
			calendarScopeNextMonthYear=calendarScopeYear;
		}
		var firstDayOfScopeMonth=parseInt(wDOW(calendarScopeYear,calendarScopeMonth-1,1)[0],10),
		weekDayOfNextScope=parseInt(wDOW(calendarScopeYear,calendarScopeMonth,1)[0],10),
		weekDayOfScope=parseInt(wDOW(calendarScopeYear,calendarScopeMonth-1,calendarScopeDay)[0],10),
		totalDaysOfScope=parseInt(wDOW(calendarScopeYear,calendarScopeMonth,0)[1],10),
		totalDaysOfPrevScope=parseInt(wDOW(calendarScopeYear,calendarScopeMonth-1,0)[1],10),
		firstDayOfNextScope=parseInt(wDOW(calendarScopeYear,calendarScopeMonth+1,1)[1],10),
		nextMonthStartEq=firstDayOfScopeMonth+totalDaysOfScope,
		nextMonthEndEq=42-nextMonthStartEq;
		$("#mainContainer").hide(0,function(){
			$(".calDay").remove();
			if(canvas=="w"){
				$("#calendarScopeDisplay").html(monthNames[calendarScopeMonth-1]+" "+calendarScopeYear);
				$("#mainContainer").load("/source/calweek.php",function(){
					$(this).addClass("weekv");
					var currentHour=today.getHours(),
					currentMinutes=today.getMinutes();
					setInterval(function(){
						currentHour=today.getHours(),
						currentMinutes=today.getMinutes();
					},5000);
					var timezoneData=today.getTimezoneOffset(),
					timezoneInfo="GMT";
					if(timezoneData<0){
						timezoneInfo+="+"+(timezoneData/-60);
					}else if(timezoneData>0){
						timezoneInfo+=(timezoneData/60);
					}
					$("#calTimezone").html(timezoneInfo);
					for(j=0;j<7;j++){
						$("#calWeekTimeCanvas").append("<div class='calWeekTimeCanvasItem'></div>");
					}
					for(i=1;i<24;i++){
						$("#calWeekTimeDivision").append("<div id='calWeekTimeRow'>"+i+":00</div>");
						for(j=0;j<7;j++){
							if(i==23){
								$("#calWeekTimeCanvas").append("<div class='calWeekTimeCanvasItem' style='border-bottom:none;'></div>");
							}else{
								$("#calWeekTimeCanvas").append("<div class='calWeekTimeCanvasItem'></div>");
							}
						}
					}
					$("#calTimeDial").hide();
					if(calendarScopeDay-weekDayOfScope<=0){
						var prevMonthWeekDay=weekDayOfScope-calendarScopeDay,
						startingDayI=totalDaysOfPrevScope-prevMonthWeekDay,
						iDays=0;
						for(i=startingDayI;i<=totalDaysOfPrevScope;i++){
							for(h=0;h<24;h++){
								$(".calWeekTimeCanvasItem").eq((h*7)+(iDays)).attr({"data-datescope":i+"-"+calendarScopePrevMonth+"-"+calendarScopePrevMonthYear,"data-hourscope":h});
							}
							if(i==currentDay && currentMonth==calendarScopePrevMonth && currentYear==calendarScopePrevMonthYear){
								$("#calWeekTopBar .no-p-m:nth-child(2)").append('<div data-scope="'+i+'-'+calendarScopePrevMonth+'-'+calendarScopePrevMonthYear+'" class="calWeekSection calDay hoverDarker activeDarker transition pointer calOffMonthDay calToday fs-l fl-l bold centerMiddle d-ib">'+i+'</div>');
							}else{
								$("#calWeekTopBar .no-p-m:nth-child(2)").append('<div data-scope="'+i+'-'+calendarScopePrevMonth+'-'+calendarScopePrevMonthYear+'" class="calWeekSection calDay hoverDarker activeDarker transition pointer calOffMonthDay fs-l fl-l bold centerMiddle d-ib">'+i+'</div>');
							}
							iDays++;
						}
						for(j=0;j<(7-iDays);j++){
							for(h=0;h<24;h++){
								$(".calWeekTimeCanvasItem").eq((h*7)+(iDays+j)).attr({"data-datescope":(j+1)+"-"+calendarScopeMonth+"-"+calendarScopeYear,"data-hourscope":h});
							}
							if(j+1==currentDay && currentMonth==calendarScopeMonth && currentYear==calendarScopeYear){
								$("#calWeekTopBar .no-p-m:nth-child(2)").append('<div data-scope="'+(j+1)+'-'+calendarScopeMonth+'-'+calendarScopeYear+'" class="calWeekSection calDay hoverDarker activeDarker transition pointer calToday fs-l fl-l bold centerMiddle d-ib">'+(j+1)+'</div>');
							}else{
								$("#calWeekTopBar .no-p-m:nth-child(2)").append('<div data-scope="'+(j+1)+'-'+calendarScopeMonth+'-'+calendarScopeYear+'" class="calWeekSection calDay hoverDarker activeDarker transition pointer fs-l fl-l bold centerMiddle d-ib">'+(j+1)+'</div>');
							}
						}
						if(calendarScopeYear!=calendarScopePrevMonthYear){
							$("#calendarInBetween").val((monthNames[parseInt(calendarScopePrevMonth,10)-1].substring(0,3))+" "+calendarScopePrevMonthYear+" – "+(monthNames[parseInt(calendarScopeMonth,10)-1].substring(0,3))+" "+calendarScopeYear).trigger("change");
						}else{
							$("#calendarInBetween").val((monthNames[parseInt(calendarScopePrevMonth,10)-1].substring(0,3))+" – "+(monthNames[parseInt(calendarScopeMonth,10)-1].substring(0,3))+" "+calendarScopeYear).trigger("change");
						}
					}else if((((totalDaysOfScope-(calendarScopeDay-weekDayOfScope))<6) && ((firstDayOfNextScope+weekDayOfNextScope)>1 || (firstDayOfNextScope+weekDayOfNextScope)<=7))){
						var startingDayK=calendarScopeDay-weekDayOfScope,
						kDays=0;
						for(k=startingDayK;k<=totalDaysOfScope;k++){
							for(h=0;h<24;h++){
								$(".calWeekTimeCanvasItem").eq((h*7)+(kDays)).attr({"data-datescope":k+"-"+calendarScopeMonth+"-"+calendarScopeYear,"data-hourscope":h});
							}
							if(k==currentDay && currentMonth==calendarScopeMonth && currentYear==calendarScopeYear){
								$("#calWeekTopBar .no-p-m:nth-child(2)").append('<div data-scope="'+k+'-'+calendarScopeMonth+'-'+calendarScopeYear+'" class="calWeekSection calDay hoverDarker activeDarker transition pointer calToday fs-l fl-l bold centerMiddle d-ib">'+k+'</div>');
							}else{
								$("#calWeekTopBar .no-p-m:nth-child(2)").append('<div data-scope="'+k+'-'+calendarScopeMonth+'-'+calendarScopeYear+'" class="calWeekSection calDay hoverDarker activeDarker transition pointer fs-l fl-l bold centerMiddle d-ib">'+k+'</div>');
							}
							kDays++;
						}
						for(l=0;l<(7-kDays);l++){
							for(h=0;h<24;h++){
								$(".calWeekTimeCanvasItem").eq((h*7)+(kDays+l)).attr({"data-datescope":(l+1)+"-"+((calendarScopeMonth%12)+1)+"-"+calendarScopeNextMonthYear,"data-hourscope":h});
							}
							if(l+1==currentDay && currentMonth==((calendarScopeMonth%12)+1) && currentYear==calendarScopeNextMonthYear){
								$("#calWeekTopBar .no-p-m:nth-child(2)").append('<div data-scope="'+(l+1)+'-'+((calendarScopeMonth%12)+1)+'-'+calendarScopeNextMonthYear+'" class="calWeekSection calDay hoverDarker activeDarker transition pointer calOffMonthDay calToday fs-l fl-l bold centerMiddle d-ib">'+(l+1)+'</div>');
							}else{
								$("#calWeekTopBar .no-p-m:nth-child(2)").append('<div data-scope="'+(l+1)+'-'+((calendarScopeMonth%12)+1)+'-'+calendarScopeNextMonthYear+'" class="calWeekSection calDay hoverDarker activeDarker transition pointer calOffMonthDay fs-l fl-l bold centerMiddle d-ib">'+(l+1)+'</div>');
							}
						}
						if(calendarScopeYear!=calendarScopeNextMonthYear){
							$("#calendarInBetween").val((monthNames[parseInt(calendarScopeMonth,10)-1].substring(0,3))+" "+calendarScopeYear+" – "+(monthNames[parseInt(calendarScopeNextMonth,10)-1].substring(0,3))+" "+calendarScopeNextMonthYear).trigger("change");
						}else{
							$("#calendarInBetween").val((monthNames[parseInt(calendarScopeMonth,10)-1].substring(0,3))+" – "+(monthNames[parseInt(calendarScopeNextMonth,10)-1].substring(0,3))+" "+calendarScopeYear).trigger("change");
						}
					}else{
						var mDays=0,
						startingDayM=calendarScopeDay-weekDayOfScope;
						for(m=startingDayM;m<(startingDayM+7);m++){
							for(h=0;h<24;h++){
								$(".calWeekTimeCanvasItem").eq((h*7)+(mDays)).attr({"data-datescope":m+"-"+calendarScopeMonth+"-"+calendarScopeYear,"data-hourscope":h});
							}
							if(m==currentDay && currentMonth==calendarScopeMonth && currentYear==calendarScopeYear){
								$("#calWeekTopBar .no-p-m:nth-child(2)").append('<div data-scope="'+m+'-'+calendarScopeMonth+'-'+calendarScopeYear+'" class="calWeekSection calDay hoverDarker activeDarker transition pointer calToday fs-l fl-l bold centerMiddle d-ib">'+m+'</div>');
							}else{
								$("#calWeekTopBar .no-p-m:nth-child(2)").append('<div data-scope="'+m+'-'+calendarScopeMonth+'-'+calendarScopeYear+'" class="calWeekSection calDay hoverDarker activeDarker transition pointer fs-l fl-l bold centerMiddle d-ib">'+m+'</div>');
							}
							mDays++;
						}
						$("#calendarInBetween").val("").trigger("change");
					}
					$("#calWeekTopBar .no-p-m:nth-child(2) div[data-scope='"+$("#calendarScope").val()+"']").addClass("calScopeDay");
					if($(".calToday").length>0){
						var weekDayOfToday=parseInt(wDOW(currentYear,currentMonth-1,currentDay)[0],10);
						$("#calTimeDial").show().css("margin-left","calc(40px + ("+weekDayOfToday+" * ((100% / 7) - 6px)) + 1px + ("+(weekDayOfToday/6)+"px))");
						if(currentDay==calendarScopeDay && currentMonth==calendarScopeMonth && currentYear==calendarScopeYear){
							$("#calWeekCanvas").animate({scrollTop:currentHour*60},500);
						}
					}
					$("#calTimeDial").css("top",((currentHour*60)+currentMinutes)+"px");
					$(this).show({duration:0});
					setInterval(function(){
						$("#calTimeDial").css("top",((currentHour*60)+currentMinutes)+"px");
						if((currentDay+"-"+currentMonth+"-"+currentYear)!=recordedDate){
							weekDayOfToday=parseInt(wDOW(currentYear,currentMonth-1,currentDay)[0],10);
							$(".calWeekSection.calToday").removeClass("calToday");
							$(".calWeekSection[data-scope='"+(currentDay+"-"+currentMonth+"-"+currentYear)+"']").addClass("calToday");
							if($(".calToday").length>0){
								$("#calTimeDial").css("margin-left","calc(40px + ("+weekDayOfToday+" * ((100% / 7) - 6px)) + 1px + ("+(weekDayOfToday/6)+"px))");
							}else{
								$("#calTimeDial").hide();
							}
							if($("#scrolledAlready").val()!="scrolled"){
								$("#calWeekCanvas").animate({scrollTop:currentHour*60},500);
								$("#scrolledAlready").val("scrolled");
							}
						}
					},5000);
				});
			}else if(canvas=="m"){
				$("#calendarScopeDisplay").html(monthNames[calendarScopeMonth-1]+" "+calendarScopeYear);
				$("#mainContainer").load("/source/calmonth.php",function(){
					$(this).removeClass("weekv");
					for(j=0;j<firstDayOfScopeMonth;j++){
						$(".calMoItem").eq(j).attr("data-datescope",(totalDaysOfPrevScope-(firstDayOfScopeMonth-j)+1)+"-"+calendarScopePrevMonth+"-"+calendarScopePrevMonthYear);
						if((totalDaysOfPrevScope-(firstDayOfScopeMonth-j)+1)==currentDay && currentMonth==calendarScopePrevMonth && currentYear==calendarScopePrevMonthYear){
							$("#calMoTopBar .no-p-m:nth-child(2)").append('<div data-scope="'+(totalDaysOfPrevScope-(firstDayOfScopeMonth-j)+1)+'-'+calendarScopePrevMonth+'-'+calendarScopePrevMonthYear+'" class="calDay calOffMonthDay calToday hoverDarker activeDarker transition bold pointer fs-l centerMiddle calMoItem fl-l">'+(totalDaysOfPrevScope-(firstDayOfScopeMonth-j)+1)+'</div>');
						}else{
							$("#calMoTopBar .no-p-m:nth-child(2)").append('<div data-scope="'+(totalDaysOfPrevScope-(firstDayOfScopeMonth-j)+1)+'-'+calendarScopePrevMonth+'-'+calendarScopePrevMonthYear+'" class="calDay calOffMonthDay hoverDarker activeDarker transition bold pointer fs-l centerMiddle calMoItem fl-l">'+(totalDaysOfPrevScope-(firstDayOfScopeMonth-j)+1)+'</div>');
						}
					}
					var iDays=firstDayOfScopeMonth;
					for(i=0;i<totalDaysOfScope;i++){
						$(".calMoItem").eq(iDays).attr("data-datescope",(i+1)+"-"+calendarScopeMonth+"-"+calendarScopeYear);
						if((i+1)==1){
							var parsedMonthDay=monthNames[calendarScopeMonth-1]+" 1<sup>st</sup>";
						}else{
							var parsedMonthDay=(i+1);
						}
						if((i+1)==currentDay && currentMonth==calendarScopeMonth && currentYear==calendarScopeYear){
							$("#calMoTopBar .no-p-m:nth-child(2)").append('<div data-scope="'+(i+1)+'-'+calendarScopeMonth+'-'+calendarScopeYear+'" class="calDay calToday hoverDarker activeDarker transition bold pointer fs-l centerMiddle calMoItem fl-l">'+parsedMonthDay+'</div>');
						}else{
							$("#calMoTopBar .no-p-m:nth-child(2)").append('<div data-scope="'+(i+1)+'-'+calendarScopeMonth+'-'+calendarScopeYear+'" class="calDay hoverDarker activeDarker transition bold pointer fs-l centerMiddle calMoItem fl-l">'+parsedMonthDay+'</div>');
						}
						iDays++;
					}
					for(k=0;k<nextMonthEndEq;k++){
						$(".calMoItem").eq(iDays+k).attr("data-datescope",(k+1)+"-"+calendarScopeNextMonth+"-"+calendarScopeNextMonthYear);
						if((k+1)==1){
							var parsedMonthDay=monthNames[calendarScopeNextMonth-1]+" 1<sup>st</sup>";
						}else{
							var parsedMonthDay=(k+1);
						}
						if((k+1)==currentDay && currentMonth==calendarScopeNextMonth && currentYear==calendarScopeNextMonthYear){
							$("#calMoTopBar .no-p-m:nth-child(2)").append('<div data-scope="'+(k+1)+'-'+calendarScopeNextMonth+'-'+calendarScopeNextMonthYear+'" class="calDay calToday calOffMonthDay hoverDarker activeDarker transition bold pointer fs-l centerMiddle calMoItem fl-l">'+parsedMonthDay+'</div>');
						}else{
							$("#calMoTopBar .no-p-m:nth-child(2)").append('<div data-scope="'+(k+1)+'-'+calendarScopeNextMonth+'-'+calendarScopeNextMonthYear+'" class="calDay calOffMonthDay hoverDarker activeDarker transition bold pointer fs-l centerMiddle calMoItem fl-l">'+parsedMonthDay+'</div>');
						}
					}
					$("#calMoTopBar .no-p-m:nth-child(2) div[data-scope='"+$("#calendarScope").val()+"']").addClass("calScopeDay");
					$(this).show({duration:0});
					setInterval(function(){
						if((currentDay+"-"+currentMonth+"-"+currentYear)!=recordedDate){
							weekDayOfToday=parseInt(wDOW(currentYear,currentMonth-1,currentDay)[0],10);
							$(".calMoItem.calToday").removeClass("calToday");
							$(".calMoItem[data-scope='"+(currentDay+"-"+currentMonth+"-"+currentYear)+"']").addClass("calToday");
						}
					},5000);
				});
			}
		});
		fillWorker();
	}
	// Week day of week
	function wDOW(year,month,day){
		var	wDOW=new Date(year,month,day),
		getWeekDayOfWeek=(wDOW.getDay() || 7)-1,
		getTotalDays=wDOW.getDate();
		return [getWeekDayOfWeek,getTotalDays];
	}
	// Calculates datetime difference
	function calcDatetimeDiff(start,end){
		var startDatetimeSplit=start.split("-"),
		endDatetimeSplit=end.split("-"),
		startDatetime=new Date(startDatetimeSplit[2],(parseInt(startDatetimeSplit[1],10)-1),startDatetimeSplit[0],startDatetimeSplit[3],startDatetimeSplit[4]),
		endDatetime=new Date(endDatetimeSplit[2],(parseInt(endDatetimeSplit[1],10)-1),endDatetimeSplit[0],endDatetimeSplit[3],endDatetimeSplit[4]),
		diffInMins=((endDatetime-startDatetime)/(1000*60)),
		diffInDays=Math.ceil(((endDatetime-startDatetime)/(1000*60*60*24)));
		return [diffInMins,diffInDays];
	}
	// Calculates minutes until next day
	function calcMinsUntilNext(year,month,day,hour,min){
		var presentedDate=new Date(year,month-1,day,hour,min),
		nextDate=new Date(year,month-1,day,0,0);
		nextDate.setDate(presentedDate.getDate()+1);
		diffInMins=((nextDate-presentedDate)/(1000*60));
		return diffInMins;
	}
	// Calculates next day's datetime
	function calcNextDatetime(year,month,day,diff){
		var presentedDate=new Date(year,month,day),
		nextDate=new Date(presentedDate.setDate(presentedDate.getDate()+diff));
		return (nextDate.getDate()+"-"+nextDate.getMonth()+"-"+nextDate.getFullYear());
	}
	// Fetch tasks AJAX
	var fTrequest;
	function fillWorker(){
		if(fTrequest){
			fTrequest.abort();
		}
		var uID=localStorage.getItem("userID");
		fTrequest=$.ajax({
			url:"/source/fetchtasks.php",
			type:"post",
			data:"uID="+uID,
			cache:false,
		});
		fTrequest.done(function(response){
			var calCanvas=$("#calendarCanvas").val();
			var getResponse=JSON.parse(response);
			canvasFiller(calCanvas,getResponse);
			manageFiller(getResponse);
		});
		fTrequest.fail(function(jqXHR,statusText,thrownError){
			console.log("jq:"+jqXHR+" st:"+statusText+" te:"+thrownError);
		});
	};
	// Fetch task with tID AJAX
	var tIDrequest;
	function tidWorker(tid){
		if(tIDrequest){
			tIDrequest.abort();
		}
		tIDrequest=$.ajax({
			url:"/source/fetchtasks.php",
			type:"post",
			data:"tid="+tid,
			cache:false,
		});
		tIDrequest.done(function(response){
			var getResponse=JSON.parse(response);
			editFiller(getResponse);
		});
		tIDrequest.fail(function(jqXHR,statusText,thrownError){
			console.log("jq:"+jqXHR+" st:"+statusText+" te:"+thrownError);
		});
	};
	// Fills canvas
	function canvasFiller(canvas,getResponse){
		if(getResponse["code"]=="100"){
			if(canvas=="w"){
				$(".calWeekTaskItem").remove();
				var singleDateTasks=Object.values({0:getResponse["taskData"]}).reduce((c,a)=>(a.forEach(({["startOn"]:item})=>c[item]=(c[item] || 0)+1),c),Object.create(null));
				var orderIteratorI=0,orderIteratorJ=0,orderIteratorK=0;
				for(i=0;i<getResponse["taskData"].length;i++){
					var taskTitle=getResponse["taskData"][i]["title"],
					taskTID=getResponse["taskData"][i]["tid"],
					taskStartSplit=getResponse["taskData"][i]["startOn"].split("-"),
					taskEndSplit=getResponse["taskData"][i]["endOn"].split("-"),
					weekDayOfTaskStart=parseInt(wDOW(taskStartSplit[2],taskStartSplit[1]-1,taskStartSplit[0])[0],10),
					weekDayOfTaskEnd=parseInt(wDOW(taskEndSplit[2],taskEndSplit[1]-1,taskEndSplit[0])[0],10),
					appendTask=$("<div data-tid='"+taskTID+"' class='pos-a d-b fs-s calWeekTaskItem pointer' title='"+taskTitle+"'>"+taskTitle+"</div>"),
					taskTopMargin=parseInt((taskStartSplit[3]*60),10)+parseInt(taskStartSplit[4],10),
					timeDiff=calcDatetimeDiff(getResponse["taskData"][i]["startOn"],getResponse["taskData"][i]["endOn"])[0];
					if($(".calWeekSection[data-scope='"+taskStartSplit[0]+"-"+taskStartSplit[1]+"-"+taskStartSplit[2]+"']").length){
						$("#calWeekCanvas").append(appendTask);
						if(taskStartSplit[0]!=taskEndSplit[0]){
							if(calcDatetimeDiff(getResponse["taskData"][i]["startOn"],taskEndSplit[0]+"-"+taskEndSplit[1]+"-"+taskEndSplit[2]+"-0-0")[1]>1){
								var heightFactor=calcMinsUntilNext(taskStartSplit[2],taskStartSplit[1],taskStartSplit[0],taskStartSplit[3],taskStartSplit[4]);
							}else{
								var heightFactor=calcDatetimeDiff(getResponse["taskData"][i]["startOn"],taskEndSplit[0]+"-"+taskEndSplit[1]+"-"+taskEndSplit[2]+"-0-0")[0];
							}
							if(!(taskEndSplit[3]==0 && taskEndSplit[4]==0)){
								$(appendTask).css({"border-bottom-left-radius":"0","border-bottom-right-radius":"0"});
							}
						}else{
							var heightFactor=timeDiff;
						}
						if(singleDateTasks[getResponse["taskData"][i]["startOn"]]>1){
							$(appendTask).css({"width":"calc((((100% / 7) - (20px + "+singleDateTasks[getResponse["taskData"][i]["startOn"]]*8+"px) + (4px / "+singleDateTasks[getResponse["taskData"][i]["startOn"]]+")) / "+singleDateTasks[getResponse["taskData"][i]["startOn"]]+") + 4px / "+singleDateTasks[getResponse["taskData"][i]["startOn"]]+")","margin-top":taskTopMargin+"px","height":(heightFactor-8)+"px"});
							$(appendTask).css("margin-left","calc(("+(orderIteratorI)+" * ((100% / 7) - 20px) / "+singleDateTasks[getResponse["taskData"][i]["startOn"]]+") + 50px + ("+weekDayOfTaskStart+" * ((100% / 7) - 6px)) + 1px + ("+orderIteratorI*1+"px) + ("+(weekDayOfTaskStart/6)+"px))");
						}else{
							$(appendTask).css({"width":"calc(((100% / 7) - (20px + "+singleDateTasks[getResponse["taskData"][i]["startOn"]]*8+"px) + (4px / "+singleDateTasks[getResponse["taskData"][i]["startOn"]]+")) / "+singleDateTasks[getResponse["taskData"][i]["startOn"]]+")","margin-top":taskTopMargin+"px","height":(heightFactor-8)+"px"});
							$(appendTask).css("margin-left","calc(("+(orderIteratorI)+" * ((100% / 7) - 20px) / "+singleDateTasks[getResponse["taskData"][i]["startOn"]]+") + 50px + ("+weekDayOfTaskStart+" * ((100% / 7) - 6px)) + 1px + ("+(weekDayOfTaskStart/6)+"px))");
						}
					}
					for(k=1;k<calcDatetimeDiff(getResponse["taskData"][i]["startOn"],taskEndSplit[0]+"-"+taskEndSplit[1]+"-"+taskEndSplit[2]+"-0-0")[1];k++){
						var appendContinuedTask=$("<div data-tid='"+taskTID+"' class='pos-a d-b fs-s calWeekTaskItem pointer' title='"+taskTitle+"'>"+taskTitle+"</div>");
						if(($(".calWeekSection[data-scope='"+calcNextDatetime(taskStartSplit[2],taskStartSplit[1],taskStartSplit[0],k)+"']").length) && (taskStartSplit[0]!=taskEndSplit[0])){
							$("#calWeekCanvas").append(appendContinuedTask);
							$(appendContinuedTask).css("border-radius","0");
							if(singleDateTasks[getResponse["taskData"][i]["startOn"]]>1){
								$(appendContinuedTask).css({"width":"calc((((100% / 7) - (20px + "+singleDateTasks[getResponse["taskData"][i]["startOn"]]*8+"px) + (4px / "+singleDateTasks[getResponse["taskData"][i]["startOn"]]+")) / "+singleDateTasks[getResponse["taskData"][i]["startOn"]]+") + 4px / "+singleDateTasks[getResponse["taskData"][i]["startOn"]]+")","margin-top":"0px","height":"1432px"});
								$(appendContinuedTask).css("margin-left","calc(("+(orderIteratorJ)+" * ((100% / 7) - 20px) / "+singleDateTasks[getResponse["taskData"][i]["startOn"]]+") + 50px + ("+(weekDayOfTaskStart+k)+" * ((100% / 7) - 6px)) + 1px + ("+orderIteratorJ*1+"px) + ("+((weekDayOfTaskStart+k)/6)+"px))");
							}else{
								$(appendContinuedTask).css({"width":"calc(((100% / 7) - (20px + "+singleDateTasks[getResponse["taskData"][i]["startOn"]]*8+"px) + (4px / "+singleDateTasks[getResponse["taskData"][i]["startOn"]]+")) / "+singleDateTasks[getResponse["taskData"][i]["startOn"]]+")","margin-top":"0px","height":"1432px"});
								$(appendContinuedTask).css("margin-left","calc(("+(orderIteratorJ)+" * ((100% / 7) - 20px) / "+singleDateTasks[getResponse["taskData"][i]["startOn"]]+") + 50px + ("+(weekDayOfTaskStart+k)+" * ((100% / 7) - 6px)) + 1px + ("+((weekDayOfTaskStart+k)/6)+"px))");
							}
						}
					}
					var appendEndingTask=$("<div data-tid='"+taskTID+"' class='pos-a d-b fs-s calWeekTaskItem pointer' title='"+taskTitle+"'>"+taskTitle+"</div>");
					if(($(".calWeekSection[data-scope='"+taskEndSplit[0]+"-"+taskEndSplit[1]+"-"+taskEndSplit[2]+"']").length) && (taskStartSplit[0]!=taskEndSplit[0])){
						if((taskEndSplit[3]>0) || (taskEndSplit[3]==0 && taskEndSplit[4]>0)){
							$("#calWeekCanvas").append(appendEndingTask);
							var heightFactor=calcDatetimeDiff(taskEndSplit[0]+"-"+taskEndSplit[1]+"-"+taskEndSplit[2]+"-0-0",getResponse["taskData"][i]["endOn"])[0];
							$(appendEndingTask).css({"border-top-left-radius":"0","border-top-right-radius":"0"});
							if(singleDateTasks[getResponse["taskData"][i]["startOn"]]>1){
								$(appendEndingTask).css({"width":"calc((((100% / 7) - (20px + "+singleDateTasks[getResponse["taskData"][i]["startOn"]]*8+"px) + (4px / "+singleDateTasks[getResponse["taskData"][i]["startOn"]]+")) / "+singleDateTasks[getResponse["taskData"][i]["startOn"]]+") + 4px / "+singleDateTasks[getResponse["taskData"][i]["startOn"]]+")","margin-top":"0px","height":(heightFactor-8)+"px"});
								$(appendEndingTask).css("margin-left","calc(("+(orderIteratorJ)+" * ((100% / 7) - 20px) / "+singleDateTasks[getResponse["taskData"][i]["startOn"]]+") + 50px + ("+weekDayOfTaskEnd+" * ((100% / 7) - 6px)) + 1px + ("+orderIteratorJ*1+"px) + ("+(weekDayOfTaskEnd/6)+"px))");
							}else{
								$(appendEndingTask).css({"width":"calc(((100% / 7) - (20px + "+singleDateTasks[getResponse["taskData"][i]["startOn"]]*8+"px) + (4px / "+singleDateTasks[getResponse["taskData"][i]["startOn"]]+")) / "+singleDateTasks[getResponse["taskData"][i]["startOn"]]+")","margin-top":"0px","height":(heightFactor-8)+"px"});
								$(appendEndingTask).css("margin-left","calc(("+(orderIteratorJ)+" * ((100% / 7) - 20px) / "+singleDateTasks[getResponse["taskData"][i]["startOn"]]+") + 50px + ("+weekDayOfTaskEnd+" * ((100% / 7) - 6px)) + 1px + ("+(weekDayOfTaskEnd/6)+"px))");
							}
						}
					}
					if(orderIteratorI<(singleDateTasks[getResponse["taskData"][i]["startOn"]]-1)){
						orderIteratorI++;
					}else{
						orderIteratorI=0;
					}
					if(orderIteratorK<(singleDateTasks[getResponse["taskData"][i]["startOn"]]-1)){
						orderIteratorK++;
					}else{
						orderIteratorK=0;
					}
					if(orderIteratorJ<(singleDateTasks[getResponse["taskData"][i]["startOn"]]-1)){
						orderIteratorJ++;
					}else{
						orderIteratorJ=0;
					}
				}
			}else if(canvas=="m"){
				//Month task filler
			}
		}else if(getResponse["code"]=="-0"){
			window.location.reload(true);
		}
	}
	// Fills manage pop-up
	function manageFiller(getResponse){
		if(getResponse["code"]=="100"){
			$(".manageTasksItem").not(".header").remove();
			$("#noTasks").addClass("d-n");
			for(i=0;i<getResponse["taskData"].length;i++){
				var taskStartSplit=getResponse["taskData"][i]["startOn"].split("-"),
				taskEndSplit=getResponse["taskData"][i]["endOn"].split("-"),
				taskTitle=getResponse["taskData"][i]["title"],
				taskTID=getResponse["taskData"][i]["tid"];
				$("#manageBlock").append("<div data-tid='"+taskTID+"' class='pointer d-b fs-s manageTasksItem'><span class='d-ib no-p-m centerMiddle fl-l manageTasksStart'>"+taskStartSplit[0]+" "+monthNames[parseInt(taskStartSplit[1],10)].substring(0,3)+" "+taskStartSplit[2]+"&nbsp;&nbsp;–&nbsp;&nbsp;"+taskStartSplit[3]+":"+taskStartSplit[4].padStart(2,'0')+"</span><span class='d-ib no-p-m fl-l manageTasksTitle'>"+taskTitle+"</span><span class='d-ib no-p-m centerMiddle fl-l manageTasksEnd'>"+taskEndSplit[0]+" "+monthNames[parseInt(taskEndSplit[1],10)].substring(0,3)+" "+taskEndSplit[2]+"&nbsp;&nbsp;–&nbsp;&nbsp;"+taskEndSplit[3]+":"+taskEndSplit[4].padStart(2,'0')+"</span></div>");
			}
		}else{
			$(".manageTasksItem").remove();
			$("#noTasks").removeClass("d-n");
		}
		$(".manageTasksItem, .calWeekTaskItem").not(".header").on("click",function(){
			tidWorker($(this).attr("data-tid"));
			$("#manage-pop").hide("fade",{duration:300,easing:"easeInOutQuint"});
			openPop="#edit-pop";
			fullMask="#full-mask-t-b";
			$("#editOrCreate").val("edit");
			$(openPop).show("fade",{duration:300,easing:"easeInOutQuint"});
			$(fullMask).show("fade",{duration:300,easing:"easeInOutQuint"});
			$(openPop).find("input").eq(0).focus();
			$(".close-icon, "+fullMask).click(function(){
				$(openPop).hide("fade",{duration:300,easing:"easeInOutQuint"},function(){
					$(this).find("form").trigger("reset");
					$(openPop).removeAttr("style");
				});
				$(fullMask).hide("fade",{duration:300,easing:"easeInOutQuint"});
			});
		});
	}
	// Fills edit pop-up
	function editFiller(getResponse){
		var startDatetimeSplit=getResponse["tidTask"][0]["startOn"].split("-"),
		endDatetimeSplit=getResponse["tidTask"][0]["endOn"].split("-"),
		taskTID=getResponse["tidTask"][0]["tid"],
		taskTitle=getResponse["tidTask"][0]["title"];
		$("#editTID").val(taskTID);
		$("#editTaskForm input[type='text']").val(taskTitle).trigger("change");
		$("#editStartDateInput").val(startDatetimeSplit[0]+"-"+startDatetimeSplit[1]+"-"+startDatetimeSplit[2]+"-"+startDatetimeSplit[3]+"-"+startDatetimeSplit[4]).trigger("change");
		$("#editEndDateInput").val(endDatetimeSplit[0]+"-"+endDatetimeSplit[1]+"-"+endDatetimeSplit[2]+"-"+endDatetimeSplit[3]+"-"+endDatetimeSplit[4]).trigger("change");
		$("#editTaskForm input").on("click change paste keyup",function(){
			var currentTaskTitle=$("#editTaskForm input[name='title']").val(),
			currentTaskStart=$("#editTaskForm input[name='startDate']").val(),
			currentTaskEnd=$("#editTaskForm input[name='endDate']").val();
			if((currentTaskTitle!=taskTitle) || (currentTaskStart!=getResponse["tidTask"][0]["startOn"]) || (currentTaskEnd!=getResponse["tidTask"][0]["endOn"])){
				$("#update-task-submit").prop("disabled",false);
			}else{
				$("#update-task-submit").prop("disabled",true);
			}
		});
	}
	// Create task AJAX
	var cTrequest;
	$("#createTaskForm").submit(function(e){
		e.preventDefault();
		if(cTrequest){
			cTrequest.abort();
		}
		var inputs=$(this).find("input, select, button, textarea");
		for(i=0;i<inputs.lenth;i++){
			inputs[i]=encodeHTML(inputs[i].val());
		}
		var serializedData=$(this).serialize();
		inputs.prop("disabled",true);
		cTrequest=$.ajax({
			url:"/source/createtask.php",
			type:"post",
			data:serializedData,
		});
		cTrequest.done(function(response,statusText,jqXHR){
			var getResponse=JSON.parse(response);
			if(getResponse["code"]=="10000"){
				$(".close-icon").trigger("click");
				fillWorker();
				inputs.prop("disabled",false);
			}else if(getResponse["code"]=="-0"){
				window.location.reload(true);
			}
		});
	});
	// Edit task AJAX
	var eTrequest;
	$("#editTaskForm").submit(function(e){
		e.preventDefault();
		if(eTrequest){
			eTrequest.abort();
		}
		var inputs=$(this).find("input, select, button, textarea");
		for(i=0;i<inputs.lenth;i++){
			inputs[i]=encodeHTML(inputs[i].val());
		}
		var serializedData=$(this).serialize();
		var taskTid=$("#editTID").val();
		inputs.prop("disabled",true);
		eTrequest=$.ajax({
			url:"/source/edittask.php",
			type:"post",
			data:serializedData+"&tid="+taskTid,
		});
		eTrequest.done(function(response,statusText,jqXHR){
			var getResponse=JSON.parse(response);
			if(getResponse["code"]=="10000"){
				$(".close-icon").trigger("click");
				fillWorker();
				inputs.prop("disabled",false);
			}else if(getResponse["code"]=="-0"){
				window.location.reload(true);
			}
		});
	});
});