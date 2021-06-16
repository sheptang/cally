$(document).ready(function(){
	// Current moment information
	var minicalToday=new Date(),
	minicalCurrentDay=minicalToday.getDate(),
	minicalCurrentMonth=minicalToday.getMonth()+1,
	minicalCurrentYear=minicalToday.getFullYear(),
	minicalScope=minicalCurrentMonth+"-"+minicalCurrentYear,
	minicalDayScope=minicalCurrentDay+"-"+minicalCurrentMonth+"-"+minicalCurrentYear;
	setInterval(function(){
		minicalToday=new Date(),
		minicalCurrentDay=minicalToday.getDate(),
		minicalCurrentMonth=minicalToday.getMonth()+1,
		minicalCurrentYear=minicalToday.getFullYear(),
		minicalScope=minicalCurrentMonth+"-"+minicalCurrentYear,
		minicalDayScope=minicalCurrentDay+"-"+minicalCurrentMonth+"-"+minicalCurrentYear;
		if($("div.minicalToday").attr("data-scope")!=(minicalCurrentDay+"-"+minicalCurrentMonth+"-"+minicalCurrentYear)){
			$("#minicalGridContainer div").removeClass("minicalToday");
			$("#minicalGridContainer div[data-scope='"+(minicalCurrentDay+"-"+minicalCurrentMonth+"-"+minicalCurrentYear)+"']").addClass("minicalToday");
		}
	},5000);
	minicalFiller(minicalScope);
	$("#minicalDayScope").val(minicalDayScope);
	$("#minicalScope").val(minicalScope);
	$("#minicalGridContainer div[data-scope='"+minicalDayScope+"']").addClass("minicalScopeDay");
	$("#minicalScopeMonth input").on("keydown",function(evt){
		if(evt.keyCode===13){
			$("#minicalScopeMonth input").trigger("focusout");
		}
	});
	$("#minicalYearInput").on("focus",function(){
		$(this).select();
	});
	$("#minicalYearInput").on("focusout",function(){
		var minicalScopeYear=$("#minicalScope").val().split("-")[1];
		if(minicalScopeYear!=$(this).val()){
			if($(this).val().length>4 || ($(this).val()%1!=0) || ($(this).val().indexOf("-")>-1) || $(this).val()==""){
				$("#minicalYearInput").val("2019");
				minicalChangeYScope("2019");
			}else{
				minicalChangeYScope($(this).val());
			}
		}
	});
	$("#todayScope").on("click",function(){
		minicalChangeDMYScope(minicalCurrentDay+"-"+minicalCurrentMonth+"-"+minicalCurrentYear);
	});
	$("#minicalDayScope").on("change",function(){
		$("div").removeClass("minicalScopeDay");
		$("#minicalGridContainer div[data-scope='"+$("#minicalDayScope").val()+"']").addClass("minicalScopeDay");
		$("#minicalScope").val($("#minicalDayScope").val().split("-")[1]+"-"+$("#minicalDayScope").val().split("-")[2]).trigger("change");
	});
	$("#minicalScope").on("change",function(){
		var minicalScope=$("#minicalScope").val();
		minicalFiller(minicalScope);
		minicalPrevNextCheck();
	});
	$("#minicalScopePrev, #minicalScopeNext").on("click",function(){
		if($(this).attr("id")=="minicalScopePrev"){
			minicalChangeMYScope("d");
		}else if($(this).attr("id")=="minicalScopeNext"){
			minicalChangeMYScope("u");
		}
	});
	// Checks validity of years
	function minicalPrevNextCheck(){
		var minicalCurrentScopeMY=$("#minicalScope").val();
		var minicalCurrentScopeMonth=minicalCurrentScopeMY.split("-")[0];
		var minicalCurrentScopeYear=minicalCurrentScopeMY.split("-")[1];
		if(minicalCurrentScopeYear=="0" && minicalCurrentScopeMonth=="1"){
			$("#minicalScopePrev").hide();
		}else if(minicalCurrentScopeYear=="9999" && minicalCurrentScopeMonth=="12"){
			$("#minicalScopeNext").hide();
		}else{
			$("#minicalScopePrev, #minicalScopeNext").show();
		}
	}
	// Days in month & First day of month
	function dIMfDOMm(year,month){
		var dIMm=new Date(year,month,0),
		fDOMm=new Date(year,month-1,1),
		getDaysInMonth=dIMm.getDate(),
		getFirstDayOfMonth=fDOMm.getDay() || 7;
		return [getDaysInMonth,getFirstDayOfMonth];
	}
	function minicalChangeDMYScope(dmy){
		var minicalScope=$("#minicalScope").val();
		if(dmy.split("-")[1]!=minicalScope.split("-")[0] || dmy.split("-")[2]!=minicalScope.split("-")[1]){
			$("#minicalScope").val(dmy.split("-")[1]+"-"+dmy.split("-")[2]).trigger("change");
		}
		$("#minicalDayScope").val(dmy).trigger("change");
	}
	function minicalChangeMYScope(direction){
		var minicalScope=$("#minicalScope").val(),
		minicalScopeSplit=minicalScope.split("-"),
		minicalScopeMonth=parseInt(minicalScopeSplit[0],10),
		minicalScopeYear=parseInt(minicalScopeSplit[1],10);
		if(direction=="d"){
			if(minicalScopeMonth==1){
				var minicalPrevMonth=12,
				minicalPrevMonthYear=minicalScopeYear-1;
			}else{
				minicalPrevMonth=minicalScopeMonth-1,
				minicalPrevMonthYear=minicalScopeYear;
			}
			minicalScope=minicalPrevMonth+"-"+minicalPrevMonthYear;
		}else if(direction=="u"){
			if(minicalScopeMonth==12){
				var minicalNextMonthYear=minicalScopeYear+1;
			}else{
				minicalNextMonthYear=minicalScopeYear;
			}
			minicalScope=((minicalScopeMonth%12)+1)+"-"+minicalNextMonthYear;
		}
		$("#minicalScope").val(minicalScope).trigger("change");
	}
	function minicalChangeYScope(toYear){
		var minicalScopeSplit=$("#minicalScope").val().split("-");
		if(minicalScopeSplit[1]!=toYear){
			$("#minicalScope").val(minicalScopeSplit[0]+"-"+toYear).trigger("change");
		}
	}
	function minicalFiller(minicalScope){
		$(".minicalDay").remove();
		var minicalScopeSplit=minicalScope.split("-"),
		minicalScopeMonth=parseInt(minicalScopeSplit[0],10),
		minicalScopeYear=parseInt(minicalScopeSplit[1],10),
		daysInMonth=dIMfDOMm(minicalScopeYear,minicalScopeMonth)[0],
		firstDayOfMonth=dIMfDOMm(minicalScopeYear,minicalScopeMonth)[1]-1,
		lastDayOfPrevMonth=dIMfDOMm(minicalScopeYear,minicalScopeMonth-1)[0],
		nextMonthStartEq=firstDayOfMonth+daysInMonth,
		nextMonthEndEq=42-nextMonthStartEq;
		for(j=0;j<firstDayOfMonth;j++){
			if(minicalScopeMonth==1){
				var minicalScopePrevMonth=12,
				minicalScopePrevMonthYear=minicalScopeYear-1;
			}else{
				minicalScopePrevMonth=minicalScopeMonth-1,
				minicalScopePrevMonthYear=minicalScopeYear;
			}
			$("#minicalGridContainer").append('<div data-scope="'+(lastDayOfPrevMonth-(firstDayOfMonth-j)+1)+'-'+minicalScopePrevMonth+'-'+minicalScopePrevMonthYear+'" class="minicalDay minicalOffMonthDay pointer transition hoverDarker activeDarker centerMiddle minicalCanvasItem">'+(lastDayOfPrevMonth-(firstDayOfMonth-j)+1)+'</div>');
		}
		for(i=0;i<daysInMonth;i++){
			if(i+1==minicalCurrentDay && minicalCurrentMonth==minicalScopeMonth && minicalCurrentYear==minicalScopeYear){
				$("#minicalGridContainer").append('<div data-scope="'+(i+1)+'-'+minicalScopeMonth+'-'+minicalScopeYear+'" class="minicalDay bold minicalToday pointer transition hoverDarker activeDarker centerMiddle minicalCanvasItem">'+(i+1)+'</div>');
			}else{
				$("#minicalGridContainer").append('<div data-scope="'+(i+1)+'-'+minicalScopeMonth+'-'+minicalScopeYear+'" class="minicalDay bold pointer transition hoverDarker activeDarker centerMiddle minicalCanvasItem">'+(i+1)+'</div>');
			}
		}
		for(k=0;k<nextMonthEndEq;k++){
			if(minicalScopeMonth==12){
				var minicalScopeNextMonthYear=minicalScopeYear+1;
			}else{
				minicalScopeNextMonthYear=minicalScopeYear;
			}
			$("#minicalGridContainer").append('<div data-scope="'+(k+1)+'-'+((minicalScopeMonth%12)+1)+'-'+minicalScopeNextMonthYear+'" class="minicalDay minicalOffMonthDay pointer transition hoverDarker activeDarker centerMiddle minicalCanvasItem">'+(k+1)+'</div>');
		}
		var monthNames=["January","February","March","April","May","June","July","August","September","October","November","December"];
		$("#minicalScopeMonth span").html(monthNames[minicalScopeMonth-1]);
		$("#minicalScopeMonth input").val(minicalScopeYear);
		$("#minicalGridContainer div[data-scope='"+$("#minicalDayScope").val()+"']").addClass("minicalScopeDay");
		$("#minicalGridContainer div[data-scope='"+minicalCurrentDay+"-"+minicalCurrentMonth+"-"+minicalCurrentYear+"']").addClass("minicalToday");
	}
});