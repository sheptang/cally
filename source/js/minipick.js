$(document).ready(function(){
	var minipickToday=new Date(),
	minipickCurrentDay=minipickToday.getDate(),
	minipickCurrentMonth=minipickToday.getMonth()+1,
	minipickCurrentYear=minipickToday.getFullYear(),
	minipickScope=minipickCurrentMonth+"-"+minipickCurrentYear,
	minipickDayScope=minipickCurrentDay+"-"+minipickCurrentMonth+"-"+minipickCurrentYear,
	minicalScope=$("#minicalScope").val();
	var monthNames=["January","February","March","April","May","June","July","August","September","October","November","December"];
	setInterval(function(){
		minipickToday=new Date(),
		minipickCurrentDay=minipickToday.getDate(),
		minipickCurrentMonth=minipickToday.getMonth()+1,
		minipickCurrentYear=minipickToday.getFullYear(),
		minipickScope=minipickCurrentMonth+"-"+minipickCurrentYear,
		minipickDayScope=minipickCurrentDay+"-"+minipickCurrentMonth+"-"+minipickCurrentYear,
		minicalScope=$("#minicalScope").val();
		if($("div.minipickToday").attr("data-scope")!=(minipickCurrentDay+"-"+minipickCurrentMonth+"-"+minipickCurrentYear)){
			$("#minipickGridContainer div").removeClass("minipickToday");
			$("#minipickGridContainer div[data-scope='"+(minipickCurrentDay+"-"+minipickCurrentMonth+"-"+minipickCurrentYear)+"']").addClass("minipickToday");
		}
	},5000);
	minipickFiller(minicalScope);
	var currentHour=minipickToday.getHours(),
	currentMinutes=minipickToday.getMinutes();
	$("#minipickDayScope").val(minipickDayScope);
	$("#minipickScope").val(minipickScope);
	$("#minipickContainer div[data-scope='"+minipickDayScope+"']").addClass("minipickScopeDay");
	$("#minipickScopeMonth input").on("keydown",function(evt){
		if(evt.keyCode===13){
			$("#minipickScopeMonth input").trigger("focusout");
		}
	});
	$("#minipickYearInput").on("focus",function(){
		$(this).select();
	});
	$("#minipickYearInput").on("focusout",function(){
		var minipickScopeYear=$("#minipickScope").val().split("-")[1];
		if(minipickScopeYear!=$(this).val()){
			if($(this).val().length>4 || ($(this).val()%1!=0) || ($(this).val().indexOf("-")>-1) || $(this).val()==""){
				$("#minipickYearInput").val("2019");
				minipickChangeYScope("2019");
			}else{
				minipickChangeYScope($(this).val());
			}
		}
	});
	$("#minipickDayScope").on("change",function(){
		$("div").removeClass("minipickScopeDay");
		$("#minipickGridContainer div[data-scope='"+$("#minipickDayScope").val()+"']").addClass("minipickScopeDay");
		$("#minipickScope").val($("#minipickDayScope").val().split("-")[1]+"-"+$("#minipickDayScope").val().split("-")[2]).trigger("change");
	});
	$("#timepickSelected").on("change",function(){
		$("div").removeClass("selectedTime");
		$("#timePickContainer .timePickCanvasItem[timescope='"+$("#timepickSelected").val()+"']").addClass("selectedTime");
	});
	$("#minipickScope").on("change",function(){
		var minipickScope=$("#minipickScope").val();
		minipickFiller(minipickScope);
		minipickPrevNextCheck();
	});
	$("#minipickScopePrev, #minipickScopeNext").on("click",function(){
		if($(this).attr("id")=="minipickScopePrev"){
			minipickChangeMYScope("d");
		}else if($(this).attr("id")=="minipickScopeNext"){
			minipickChangeMYScope("u");
		}
	});
	$("#startDateInput").on("change",function(){
		var startDateInputSplit=$(this).val().split("-"),
		sDIday=startDateInputSplit[0],
		sDImonth=startDateInputSplit[1],
		sDIyear=startDateInputSplit[2],
		sDIhour=startDateInputSplit[3],
		sDImin=startDateInputSplit[4];
		$("#startDatePrint").html(sDIday+" "+monthNames[parseInt(sDImonth,10)-1].substring(0,3)+" "+sDIyear);
		$("#startTimePrint").html(sDIhour+":"+(sDImin.padStart(2,'0')));
		minipickChangeTimeScope(sDIhour+"-"+sDImin);
	});
	$("#endDateInput").on("change",function(){
		var endDateInputSplit=$(this).val().split("-"),
		eDIday=endDateInputSplit[0],
		eDImonth=endDateInputSplit[1],
		eDIyear=endDateInputSplit[2],
		eDIhour=endDateInputSplit[3],
		eDImin=endDateInputSplit[4];
		$("#endDatePrint").html(eDIday+" "+monthNames[parseInt(eDImonth,10)-1].substring(0,3)+" "+eDIyear);
		$("#endTimePrint").html(eDIhour+":"+(eDImin.padStart(2,'0')));
		minipickChangeTimeScope(eDIhour+"-"+eDImin);
	});
	$("#editStartDateInput").on("change",function(){
		var startDateInputSplit=$(this).val().split("-"),
		sDIday=startDateInputSplit[0],
		sDImonth=startDateInputSplit[1],
		sDIyear=startDateInputSplit[2],
		sDIhour=startDateInputSplit[3],
		sDImin=startDateInputSplit[4];
		$("#editStartDatePrint").html(sDIday+" "+monthNames[parseInt(sDImonth,10)-1].substring(0,3)+" "+sDIyear);
		$("#editStartTimePrint").html(sDIhour+":"+(sDImin.padStart(2,'0')));
		minipickChangeTimeScope(sDIhour+"-"+sDImin);
	});
	$("#editEndDateInput").on("change",function(){
		var endDateInputSplit=$(this).val().split("-"),
		eDIday=endDateInputSplit[0],
		eDImonth=endDateInputSplit[1],
		eDIyear=endDateInputSplit[2],
		eDIhour=endDateInputSplit[3],
		eDImin=endDateInputSplit[4];
		$("#editEndDatePrint").html(eDIday+" "+monthNames[parseInt(eDImonth,10)-1].substring(0,3)+" "+eDIyear);
		$("#editEndTimePrint").html(eDIhour+":"+(eDImin.padStart(2,'0')));
		minipickChangeTimeScope(eDIhour+"-"+eDImin);
	});
	function minipickPrevNextCheck(){
		var minipickCurrentScopeMY=$("#minipickScope").val();
		var minipickCurrentScopeMonth=minipickCurrentScopeMY.split("-")[0];
		var minipickCurrentScopeYear=minipickCurrentScopeMY.split("-")[1];
		if(minipickCurrentScopeYear=="0" && minipickCurrentScopeMonth=="1"){
			$("#minipickScopePrev").hide();
		}else if(minipickCurrentScopeYear=="9999" && minipickCurrentScopeMonth=="12"){
			$("#minipickScopeNext").hide();
		}else{
			$("#minipickScopePrev, #minipickScopeNext").show();
		}
	}
	function dIMfDOMm(year,month){
		var dIMm=new Date(year,month,0),
		fDOMm=new Date(year,month-1,1),
		getDaysInMonth=dIMm.getDate(),
		getFirstDayOfMonth=fDOMm.getDay() || 7;
		return [getDaysInMonth,getFirstDayOfMonth];
	}
	function calcNextDatetime(year,month,day,hour,min,diff){
		var calcNext=new Date(year,month-1,day,hour,min+diff),
		calcNextDatetimeDate=calcNext.getDate()+"-"+(calcNext.getMonth()+1)+"-"+calcNext.getFullYear(),
		calcNextDatetimeTime=calcNext.getHours()+"-"+calcNext.getMinutes();
		return [calcNextDatetimeDate,calcNextDatetimeTime];
	}
	function calcBeforeDatetime(year,month,day,hour,min,diff){
		var calcBefore=new Date(year,month-1,day,hour,min-diff),
		calcBeforeDatetimeDate=calcBefore.getDate()+"-"+(calcBefore.getMonth()+1)+"-"+calcBefore.getFullYear(),
		calcBeforeDatetimeTime=calcBefore.getHours()+"-"+calcBefore.getMinutes();
		return [calcBeforeDatetimeDate,calcBeforeDatetimeTime];
	}
	function minipickChangeDMYScope(dmy){
		var minipickScope=$("#minipickScope").val();
		if(dmy.split("-")[1]!=minipickScope.split("-")[0] || dmy.split("-")[2]!=minipickScope.split("-")[1]){
			$("#minipickScope").val(dmy.split("-")[1]+"-"+dmy.split("-")[2]).trigger("change");
		}
		$("#minipickDayScope").val(dmy).trigger("change");
	}
	function minipickChangeTimeScope(time){
		$("#timepickSelected").val(time).trigger("change");
	}
	function minipickChangeMYScope(direction){
		var minipickScope=$("#minipickScope").val(),
		minipickScopeSplit=minipickScope.split("-"),
		minipickScopeMonth=parseInt(minipickScopeSplit[0],10),
		minipickScopeYear=parseInt(minipickScopeSplit[1],10);
		if(direction=="d"){
			if(minipickScopeMonth==1){
				var minipickPrevMonth=12,
				minipickPrevMonthYear=minipickScopeYear-1;
			}else{
				minipickPrevMonth=minipickScopeMonth-1,
				minipickPrevMonthYear=minipickScopeYear;
			}
			minipickScope=minipickPrevMonth+"-"+minipickPrevMonthYear;
		}else if(direction=="u"){
			if(minipickScopeMonth==12){
				var minipickNextMonthYear=minipickScopeYear+1;
			}else{
				minipickNextMonthYear=minipickScopeYear;
			}
			minipickScope=((minipickScopeMonth%12)+1)+"-"+minipickNextMonthYear;
		}
		$("#minipickScope").val(minipickScope).trigger("change");
	}
	function minipickChangeYScope(toYear){
		var minipickScopeSplit=$("#minipickScope").val().split("-");
		if(minipickScopeSplit[1]!=toYear){
			$("#minipickScope").val(minipickScopeSplit[0]+"-"+toYear).trigger("change");
		}
	}
	function minipickFiller(minipickScope){
		$(".minipickDay").remove();
		var minipickScopeSplit=minipickScope.split("-"),
		minipickScopeMonth=parseInt(minipickScopeSplit[0],10),
		minipickScopeYear=parseInt(minipickScopeSplit[1],10),
		daysInMonth=dIMfDOMm(minipickScopeYear,minipickScopeMonth)[0],
		firstDayOfMonth=dIMfDOMm(minipickScopeYear,minipickScopeMonth)[1]-1,
		lastDayOfPrevMonth=dIMfDOMm(minipickScopeYear,minipickScopeMonth-1)[0],
		nextMonthStartEq=firstDayOfMonth+daysInMonth,
		nextMonthEndEq=42-nextMonthStartEq;
		for(j=0;j<firstDayOfMonth;j++){
			if(minipickScopeMonth==1){
				var minipickScopePrevMonth=12,
				minipickScopePrevMonthYear=minipickScopeYear-1;
			}else{
				minipickScopePrevMonth=minipickScopeMonth-1,
				minipickScopePrevMonthYear=minipickScopeYear;
			}
			$("#minipickGridContainer").append('<div data-scope="'+(lastDayOfPrevMonth-(firstDayOfMonth-j)+1)+'-'+minipickScopePrevMonth+'-'+minipickScopePrevMonthYear+'" class="minipickDay minipickOffMonthDay pointer transition hoverDarker activeDarker centerMiddle minipickCanvasItem">'+(lastDayOfPrevMonth-(firstDayOfMonth-j)+1)+'</div>');
		}
		for(i=0;i<daysInMonth;i++){
			if(i+1==minipickCurrentDay && minipickCurrentMonth==minipickScopeMonth && minipickCurrentYear==minipickScopeYear){
				$("#minipickGridContainer").append('<div data-scope="'+(i+1)+'-'+minipickScopeMonth+'-'+minipickScopeYear+'" class="minipickDay bold minipickToday pointer transition hoverDarker activeDarker centerMiddle minipickCanvasItem">'+(i+1)+'</div>');
			}else{
				$("#minipickGridContainer").append('<div data-scope="'+(i+1)+'-'+minipickScopeMonth+'-'+minipickScopeYear+'" class="minipickDay bold pointer transition hoverDarker activeDarker centerMiddle minipickCanvasItem">'+(i+1)+'</div>');
			}
		}
		for(k=0;k<nextMonthEndEq;k++){
			if(minipickScopeMonth==12){
				var minipickScopeNextMonthYear=minipickScopeYear+1;
			}else{
				minipickScopeNextMonthYear=minipickScopeYear;
			}
			$("#minipickGridContainer").append('<div data-scope="'+(k+1)+'-'+((minipickScopeMonth%12)+1)+'-'+minipickScopeNextMonthYear+'" class="minipickDay minipickOffMonthDay pointer transition hoverDarker activeDarker centerMiddle minipickCanvasItem">'+(k+1)+'</div>');
		}
		$("#minipickScopeMonth span").html(monthNames[minipickScopeMonth-1]);
		$("#minipickScopeMonth input").val(minipickScopeYear);
		$("#minipickGridContainer div[data-scope='"+$("#minipickDayScope").val()+"']").addClass("minipickScopeDay");
		$("#minipickGridContainer div[data-scope='"+minipickCurrentDay+"-"+minipickCurrentMonth+"-"+minipickCurrentYear+"']").addClass("minipickToday");
	}
	minipickPickedFill("init");
	for(i=0;i<24;i++){
		for(j=0;j<2;j++){
			var minuteTick;
			if(j==0){
				minuteTick="00";
			}else if(j==1){
				minuteTick="30";
			}
			$("#timePick .timePickCanvas").append("<div timeScope='"+i+"-"+parseInt(minuteTick,10)+"' class='timePickCanvasItem pointer transition hoverDarker activeDarker'>"+i+":"+minuteTick+"</div>");
		}
	}
	$("#create-pop .close-icon, #edit-pop .close-icon, #full-mask-t-b").on("click",function(){
		minipickPickedFill("init");
	});
	function printMinutes(mins){
		var printMinutes=0;
		if(mins>=0 && mins<30){
			printMinutes=0;
		}else if(mins>=30 && mins<60){
			printMinutes=30;
		}
		return printMinutes;
	}
	function minipickPickedFill(mode){
		var minipickToday=new Date(),
		minipickCurrentDay=minipickToday.getDate(),
		minipickCurrentMonth=minipickToday.getMonth()+1,
		minipickCurrentYear=minipickToday.getFullYear(),
		currentHour=minipickToday.getHours(),
		currentMinutes=minipickToday.getMinutes();
		var editOrCreate=$("#editOrCreate").val();
		if(mode=="init"){
			$("#startDateInput").val(minipickCurrentDay+"-"+minipickCurrentMonth+"-"+minipickCurrentYear+"-"+currentHour+"-"+printMinutes(currentMinutes)).trigger("change");
			var endDatetime=calcNextDatetime(minipickCurrentYear,minipickCurrentMonth,minipickCurrentDay,currentHour,currentMinutes,60),
			endDatetimeHour=endDatetime[1].split("-")[0],
			endDatetimeMinute=endDatetime[1].split("-")[1];
			$("#endDateInput").val(endDatetime[0]+"-"+(endDatetimeHour+"-"+printMinutes(endDatetimeMinute))).trigger("change");
		}else if(mode=="fix"){
			if(editOrCreate=="create"){
				var startDateInput=$("#startDateInput").val(),
				startDateInputDay=startDateInput.split("-")[0],
				startDateInputMonth=startDateInput.split("-")[1],
				startDateInputYear=startDateInput.split("-")[2],
				startDateInputHour=startDateInput.split("-")[3],
				startDateInputMinute=startDateInput.split("-")[4],
				endDatetime=calcNextDatetime(startDateInputYear,startDateInputMonth,startDateInputDay,startDateInputHour,startDateInputMinute,60),
				endDatetimeHour=endDatetime[1].split("-")[0],
				endDatetimeMinute=endDatetime[1].split("-")[1];
				$("#endDateInput").val(endDatetime[0]+"-"+(endDatetimeHour+"-"+printMinutes(endDatetimeMinute))).trigger("change");
				minipickChangeDMYScope(startDateInputDay+"-"+startDateInputMonth+"-"+startDateInputYear);
			}else if(editOrCreate=="edit"){
				var editStartDateInput=$("#editStartDateInput").val(),
				editStartDateInputDay=editStartDateInput.split("-")[0],
				editStartDateInputMonth=editStartDateInput.split("-")[1],
				editStartDateInputYear=editStartDateInput.split("-")[2],
				editStartDateInputHour=editStartDateInput.split("-")[3],
				editStartDateInputMinute=editStartDateInput.split("-")[4],
				editEndDatetime=calcNextDatetime(editStartDateInputYear,editStartDateInputMonth,editStartDateInputDay,editStartDateInputHour,editStartDateInputMinute,60),
				editEndDatetimeHour=editEndDatetime[1].split("-")[0],
				editEndDatetimeMinute=editEndDatetime[1].split("-")[1];
				$("#editEndDateInput").val(editEndDatetime[0]+"-"+(editEndDatetimeHour+"-"+printMinutes(editEndDatetimeMinute))).trigger("change");
				minipickChangeDMYScope(editStartDateInputDay+"-"+editStartDateInputMonth+"-"+editStartDateInputYear);
			}
		}else if(mode=="fixEnd"){
			if(editOrCreate=="create"){
				var endDateInput=$("#endDateInput").val(),
				endDateInputDay=endDateInput.split("-")[0],
				endDateInputMonth=endDateInput.split("-")[1],
				endDateInputYear=endDateInput.split("-")[2],
				endDateInputHour=endDateInput.split("-")[3],
				endDateInputMinute=endDateInput.split("-")[4],
				startDatetime=calcBeforeDatetime(endDateInputYear,endDateInputMonth,endDateInputDay,endDateInputHour,endDateInputMinute,60),
				startDatetimeHour=startDatetime[1].split("-")[0],
				startDatetimeMinute=startDatetime[1].split("-")[1];
				console.log(startDatetime);
				$("#startDateInput").val(startDatetime[0]+"-"+(startDatetimeHour+"-"+printMinutes(startDatetimeMinute))).trigger("change");
				minipickChangeDMYScope(endDateInputDay+"-"+endDateInputMonth+"-"+endDateInputYear);
			}else if(editOrCreate=="edit"){
				var editEndDateInput=$("#editEndDateInput").val(),
				editEndDateInputDay=editEndDateInput.split("-")[0],
				editEndDateInputMonth=editEndDateInput.split("-")[1],
				editEndDateInputYear=editEndDateInput.split("-")[2],
				editEndDateInputHour=editEndDateInput.split("-")[3],
				editEndDateInputMinute=editEndDateInput.split("-")[4],
				editStartDatetime=calcBeforeDatetime(editEndDateInputYear,editEndDateInputMonth,editEndDateInputDay,editEndDateInputHour,editEndDateInputMinute,60),
				editStartDatetimeHour=editStartDatetime[1].split("-")[0],
				editStartDatetimeMinute=editStartDatetime[1].split("-")[1];
				$("#editStartDateInput").val(editStartDatetime[0]+"-"+(editStartDatetimeHour+"-"+printMinutes(editStartDatetimeMinute))).trigger("change");
				minipickChangeDMYScope(editEndDateInputDay+"-"+editEndDateInputMonth+"-"+editEndDateInputYear);
			}
		}
	}
	$("#dateString").on("click",".dateStringDate",function(evt){
		$("#minipickMode").val($(evt.currentTarget).attr("pickMode"));
		var dateInputSplit=$("#"+$(evt.currentTarget).attr("pickMode")+"Input").val().split("-");
		$("#minipickDayScope").val(dateInputSplit[0]+"-"+dateInputSplit[1]+"-"+dateInputSplit[2]).trigger("change");
		minipickReady($(evt.currentTarget));
	});
	$("#dateString").on("click",".dateStringTime",function(evt){
		$("#timepickMode").val($(evt.currentTarget).attr("pickMode"));
		var timeInputSplit;
		if($(evt.currentTarget).attr("pickMode")=="startTime"){
			timeInputSplit=$("#startDateInput").val().split("-");
		}else if($(evt.currentTarget).attr("pickMode")=="endTime"){
			timeInputSplit=$("#endDateInput").val().split("-");
		}
		$("#timepickSelected").val(timeInputSplit[3]+"-"+timeInputSplit[4]).trigger("change");
		timepickReady($(evt.currentTarget));
	});
	$("#editDateString").on("click",".dateStringDate",function(evt){
		$("#minipickMode").val($(evt.currentTarget).attr("pickMode"));
		var dateInputSplit=$("#"+$(evt.currentTarget).attr("pickMode")+"Input").val().split("-");
		$("#minipickDayScope").val(dateInputSplit[0]+"-"+dateInputSplit[1]+"-"+dateInputSplit[2]).trigger("change");
		minipickReady($(evt.currentTarget));
	});
	$("#editDateString").on("click",".dateStringTime",function(evt){
		$("#timepickMode").val($(evt.currentTarget).attr("pickMode"));
		var timeInputSplit;
		if($(evt.currentTarget).attr("pickMode")=="editStartTime"){
			timeInputSplit=$("#editStartDateInput").val().split("-");
		}else if($(evt.currentTarget).attr("pickMode")=="editEndTime"){
			timeInputSplit=$("#editEndDateInput").val().split("-");
		}
		$("#timepickSelected").val(timeInputSplit[3]+"-"+timeInputSplit[4]).trigger("change");
		timepickReady($(evt.currentTarget));
	});
	function minipickReady(elm){
		$("#full-mask-pick").show();
		$("#datePick").css({"top":($(elm).offset().top+32)+"px","left":$(elm).offset().left+"px"}).show("fade",{duration:300,easing:"easeInOutQuint"});
	}
	function timepickReady(elm){
		$("#full-mask-pick").show();
		$("#timePick").css({"top":($(elm).offset().top+32)+"px","left":$(elm).offset().left+"px"}).show("fade",{duration:300,easing:"easeInOutQuint"});
	}
	// event baloncukları uzayda harmoni içinde orgy yapıyor //
	$("#minipickGridContainer").on("click",".minipickDay",function(evt){
		evt.cancelBubble=true;
		evt.stopPropagation();
		minipickChangeDMYScope($(evt.currentTarget).attr("data-scope"));
		var mode=$("#minipickMode").val();
		if(!($(evt.currentTarget).hasClass("minicalScopeDay"))){
			if(mode=="startDate"){
				var startDatetimeHour=$("#startDateInput").val().split("-")[3],
				startDatetimeMinute=$("#startDateInput").val().split("-")[4],
				startDatetimeScopeSplit=$(evt.currentTarget).attr("data-scope").split("-"),
				startFixCheck=parseInt(new Date(startDatetimeScopeSplit[2],startDatetimeScopeSplit[1],startDatetimeScopeSplit[0],startDatetimeHour,startDatetimeMinute).getTime(),10),
				endFixCheck=parseInt(new Date($("#endDateInput").val().split("-")[2],$("#endDateInput").val().split("-")[1],$("#endDateInput").val().split("-")[0],$("#endDateInput").val().split("-")[3],$("#endDateInput").val().split("-")[4]).getTime(),10);
				$("#startDateInput").val($(evt.currentTarget).attr("data-scope")+"-"+startDatetimeHour+"-"+startDatetimeMinute).trigger("change");
				if(!((endFixCheck-startFixCheck)>0)){
					minipickPickedFill("fix");
				}
			}else if(mode=="endDate"){
				var endDatetimeHour=$("#endDateInput").val().split("-")[3],
				endDatetimeMinute=$("#endDateInput").val().split("-")[4],
				endDatetimeScopeSplit=$(evt.currentTarget).attr("data-scope").split("-"),
				endFixCheck=parseInt(new Date(endDatetimeScopeSplit[2],endDatetimeScopeSplit[1],endDatetimeScopeSplit[0],endDatetimeHour,endDatetimeMinute).getTime(),10),
				startFixCheck=parseInt(new Date($("#startDateInput").val().split("-")[2],$("#startDateInput").val().split("-")[1],$("#startDateInput").val().split("-")[0],$("#startDateInput").val().split("-")[3],$("#startDateInput").val().split("-")[4]).getTime(),10);
				if((endFixCheck-startFixCheck)>0){
					$("#endDateInput").val($(evt.currentTarget).attr("data-scope")+"-"+endDatetimeHour+"-"+endDatetimeMinute).trigger("change");
				}else{
					$("#endDateInput").val($(evt.currentTarget).attr("data-scope")+"-"+endDatetimeHour+"-"+endDatetimeMinute).trigger("change");
					minipickPickedFill("fixEnd");
				}
			}else if(mode=="editStartDate"){
				var startDatetimeHour=$("#editStartDateInput").val().split("-")[3],
				startDatetimeMinute=$("#editStartDateInput").val().split("-")[4],
				startDatetimeScopeSplit=$(evt.currentTarget).attr("data-scope").split("-"),
				startFixCheck=parseInt(new Date(startDatetimeScopeSplit[2],startDatetimeScopeSplit[1],startDatetimeScopeSplit[0],startDatetimeHour,startDatetimeMinute).getTime(),10),
				endFixCheck=parseInt(new Date($("#editEndDateInput").val().split("-")[2],$("#editEndDateInput").val().split("-")[1],$("#editEndDateInput").val().split("-")[0],$("#editEndDateInput").val().split("-")[3],$("#editEndDateInput").val().split("-")[4]).getTime(),10);
				$("#editStartDateInput").val($(evt.currentTarget).attr("data-scope")+"-"+startDatetimeHour+"-"+startDatetimeMinute).trigger("change");
				if(!((endFixCheck-startFixCheck)>0)){
					minipickPickedFill("fix");
				}
			}else if(mode=="editEndDate"){
				var endDatetimeHour=$("#editEndDateInput").val().split("-")[3],
				endDatetimeMinute=$("#editEndDateInput").val().split("-")[4],
				endDatetimeScopeSplit=$(evt.currentTarget).attr("data-scope").split("-"),
				endFixCheck=parseInt(new Date(endDatetimeScopeSplit[2],endDatetimeScopeSplit[1],endDatetimeScopeSplit[0],endDatetimeHour,endDatetimeMinute).getTime(),10),
				startFixCheck=parseInt(new Date($("#editStartDateInput").val().split("-")[2],$("#editStartDateInput").val().split("-")[1],$("#editStartDateInput").val().split("-")[0],$("#editStartDateInput").val().split("-")[3],$("#editStartDateInput").val().split("-")[4]).getTime(),10);
				if((endFixCheck-startFixCheck)>0){
					$("#editEndDateInput").val($(evt.currentTarget).attr("data-scope")+"-"+endDatetimeHour+"-"+endDatetimeMinute).trigger("change");
				}else{
					$("#editEndDateInput").val($(evt.currentTarget).attr("data-scope")+"-"+endDatetimeHour+"-"+endDatetimeMinute).trigger("change");
					minipickPickedFill("fixEnd");
				}
			}
		}
	});
	$("#timePickContainer").on("click",".timePickCanvasItem",function(evt){
		evt.cancelBubble=true;
		evt.stopPropagation();
		minipickChangeTimeScope($(evt.currentTarget).attr("timescope"));
		var mode=$("#timepickMode").val();
		if(mode=="startTime"){
			var startDatetimeHour=$("#startDateInput").val().split("-")[3],
			startDatetimeMinute=$("#startDateInput").val().split("-")[4],
			startDatetimeScopeSplit=$("#startDateInput").val().split("-"),
			startFixCheck=parseInt(new Date(startDatetimeScopeSplit[2],startDatetimeScopeSplit[1],startDatetimeScopeSplit[0],$(evt.currentTarget).attr("timescope").split("-")[0],$(evt.currentTarget).attr("timescope").split("-")[1]).getTime(),10),
			endFixCheck=parseInt(new Date($("#endDateInput").val().split("-")[2],$("#endDateInput").val().split("-")[1],$("#endDateInput").val().split("-")[0],$("#endDateInput").val().split("-")[3],$("#endDateInput").val().split("-")[4]).getTime(),10);
			$("#startDateInput").val(startDatetimeScopeSplit[0]+"-"+startDatetimeScopeSplit[1]+"-"+startDatetimeScopeSplit[2]+"-"+$(evt.currentTarget).attr("timescope").split("-")[0]+"-"+$(evt.currentTarget).attr("timescope").split("-")[1]).trigger("change");
			if(!((endFixCheck-startFixCheck)>0)){
				minipickPickedFill("fix");
			}
		}else if(mode=="endTime"){
			var endDatetimeHour=$("#endDateInput").val().split("-")[3],
			endDatetimeMinute=$("#endDateInput").val().split("-")[4],
			endDatetimeScopeSplit=$("#endDateInput").val().split("-"),
			endFixCheck=parseInt(new Date(endDatetimeScopeSplit[2],endDatetimeScopeSplit[1],endDatetimeScopeSplit[0],$(evt.currentTarget).attr("timescope").split("-")[0],$(evt.currentTarget).attr("timescope").split("-")[1]).getTime(),10),
			startFixCheck=parseInt(new Date($("#startDateInput").val().split("-")[2],$("#startDateInput").val().split("-")[1],$("#startDateInput").val().split("-")[0],$("#startDateInput").val().split("-")[3],$("#startDateInput").val().split("-")[4]).getTime(),10);
			if((endFixCheck-startFixCheck)>0){
				$("#endDateInput").val(endDatetimeScopeSplit[0]+"-"+endDatetimeScopeSplit[1]+"-"+endDatetimeScopeSplit[2]+"-"+$(evt.currentTarget).attr("timescope").split("-")[0]+"-"+$(evt.currentTarget).attr("timescope").split("-")[1]).trigger("change");
			}else{
				minipickPickedFill("fixEnd");
			}
		}else if(mode=="editStartTime"){
			var editStartDatetimeHour=$("#editStartDateInput").val().split("-")[3],
			editStartDatetimeMinute=$("#editStartDateInput").val().split("-")[4],
			editStartDatetimeScopeSplit=$("#editStartDateInput").val().split("-"),
			editStartFixCheck=parseInt(new Date(editStartDatetimeScopeSplit[2],editStartDatetimeScopeSplit[1],editStartDatetimeScopeSplit[0],$(evt.currentTarget).attr("timescope").split("-")[0],$(evt.currentTarget).attr("timescope").split("-")[1]).getTime(),10),
			editEndFixCheck=parseInt(new Date($("#editEndDateInput").val().split("-")[2],$("#editEndDateInput").val().split("-")[1],$("#editEndDateInput").val().split("-")[0],$("#editEndDateInput").val().split("-")[3],$("#editEndDateInput").val().split("-")[4]).getTime(),10);
			$("#editStartDateInput").val(editStartDatetimeScopeSplit[0]+"-"+editStartDatetimeScopeSplit[1]+"-"+editStartDatetimeScopeSplit[2]+"-"+$(evt.currentTarget).attr("timescope").split("-")[0]+"-"+$(evt.currentTarget).attr("timescope").split("-")[1]).trigger("change");
			if(!((editEndFixCheck-editStartFixCheck)>0)){
				minipickPickedFill("fix");
			}
		}else if(mode=="editEndTime"){
			var editEndDatetimeHour=$("#editEndDateInput").val().split("-")[3],
			editEndDatetimeMinute=$("#editEndDateInput").val().split("-")[4],
			editEndDatetimeScopeSplit=$("#editEndDateInput").val().split("-"),
			editEndFixCheck=parseInt(new Date(editEndDatetimeScopeSplit[2],editEndDatetimeScopeSplit[1],editEndDatetimeScopeSplit[0],$(evt.currentTarget).attr("timescope").split("-")[0],$(evt.currentTarget).attr("timescope").split("-")[1]).getTime(),10),
			editStartFixCheck=parseInt(new Date($("#editStartDateInput").val().split("-")[2],$("#editStartDateInput").val().split("-")[1],$("#editStartDateInput").val().split("-")[0],$("#editStartDateInput").val().split("-")[3],$("#editStartDateInput").val().split("-")[4]).getTime(),10);
			if((editEndFixCheck-editStartFixCheck)>0){
				$("#editEndDateInput").val(editEndDatetimeScopeSplit[0]+"-"+editEndDatetimeScopeSplit[1]+"-"+editEndDatetimeScopeSplit[2]+"-"+$(evt.currentTarget).attr("timescope").split("-")[0]+"-"+$(evt.currentTarget).attr("timescope").split("-")[1]).trigger("change");
			}else{
				minipickPickedFill("fixEnd");
			}
		}
	});
});