<?php
	require_once("source/data.php");
	session_start();
?>
<!DOCTYPE html>
<html>
<head>
<?php
	include_once("source/meta.php");
?>
	<title>cally: Personal Calendar</title>
</head>
<?php
	if(isset($_COOKIE["user_login"]) OR isset($_SESSION["user_login"])){

		if(!isset($_SESSION["user_login"])){
			$uID=$_COOKIE["user_login"];
		}elseif(!isset($_COOKIE["user_login"])){
			$uID=$_SESSION["user_login"];
		}

		$questUserInfo=mysqli_query($conn,"SELECT * FROM users WHERE uid='$uID'");
		$fetchUserInfo=mysqli_fetch_array($questUserInfo);
		if(mysqli_num_rows($questUserInfo)<1){
			setcookie("user_login","",time()-3600);
			unset($_SESSION["user_login"]);
			header("Refresh:0");
		}
		$firstName=$fetchUserInfo["firstName"];
		$lastName=$fetchUserInfo["lastName"];
		$email=$fetchUserInfo["email"];

?>
<body>
	<div class="d-n no-p-m" id="sizeWarning">
		<div class="pos-a no-p-m centerMiddle">
			<div class="centerMiddle">This window size is not supported and may cause problems while using the application.</div>
			<div id="warningClose" class="topMargin-10 pointer transition">Accept and continue using</div>
			<input type="hidden" id="warningAccept" value=""/>
		</div>
	</div>
	<div class="d-n pos-a no-p-m" id="full-mask-t"></div>
	<div class="d-n pos-a no-p-m" id="full-mask-t-b"></div>
	<div class="d-n pos-a no-p-m" id="full-mask-pick"></div>
	<div id="topBar">
		<span class="fl-l no-p-m">
			<div class="d-ib navItem leftMargin-20 fs-m bold ls-min pointer" id="cally">cally</div>
			<div title="Jump to today" id="todayScope" class="d-ib button bold fs-s hoverDarker activeDarker pointer transition leftMargin-20">Today</div>
			<div id="calendarScopePrev" title="Previous week" class="d-ib navItem bold leftMargin-20 font-st fs-m round hoverDarker activeDarker pointer transition centerMiddle">&lt;</div>
			<div id="calendarScopeDisplay" class="d-ib navItem leftMargin-10 fs-m centerMiddle"></div>
			<div id="calendarScopeNext" title="Next week" class="d-ib navItem bold leftMargin-10 font-st fs-m round hoverDarker activeDarker pointer transition centerMiddle">&gt;</div>
		</span>
		<span class="fl-r no-p-m">
			<input title="Search through tasks" class="font-ps fs-s searchInput rightMargin-40 transition focusDarker hoverDarker" id="taskSearchInput" type="text" placeholder="Search"/>
			<div id="canvasSelectButton" title="Switch canvas mode" class="d-ib button bold fs-s hoverDarker activeDarker pointer transition rightMargin-30"><span>Week&nbsp;&nbsp;&nbsp;</span><i class="fas fa-caret-down transition"></i></div>
			<div id="canvasSelectMenu" class="d-n pos-a">
				<div class="canvasSelectItem centerMiddle fs-s bold hoverDarker activeDarker transition pointer chosen" cmode="w">Week</div>
				<div class="canvasSelectItem centerMiddle fs-s bold hoverDarker activeDarker transition pointer" cmode="m">Month</div>
			</div>
			<div id="settings-button" class="d-ib navItem rightMargin-40 transition pointer centerMiddle round icon" title="Settings"></div>
			<div class="d-n pos-a pop" id="settings-pop">
				<div class="fs-m pop-top draggable centerMiddle">
					<span class="fl-l">Settings</span><span class="pointer close-icon fl-r" title="Close"></span>
				</div>
				<div class="no-p-m h-a" id="signedUser">
					<div class="fs-sm bold d-ib fl-l h-a topMargin-20 leftMargin-20">Signed in as <?=$firstName." ".$lastName?></div>
					<div id="signMeOut" title="Sign out" class="fs-sm bold button pointer hoverDarker activeDarker transition centerMiddle topMargin-15 rightMargin-20 d-ib h-a fl-r">
						<i class="fas fa-sign-out-alt"></i>&nbsp;&nbsp;Sign out
					</div>
				</div>
			</div>
			<input type="hidden" id="editOrCreate" value="">
			<div class="d-n pos-a pop" id="create-pop">
				<div class="fs-m pop-top draggable centerMiddle">
					<span class="fl-l">Create task</span><span class="pointer close-icon fl-r" title="Close"></span>
				</div>
				<div class="no-p-m h-a" id="createBlock">
					<form id="createTaskForm" class="no-p-m h-a">
						<input required="required" maxlength="255" class="pop-in-t hoverDarker focusDarker font-ps fs-s transition" name="title" placeholder="Task title (max. 255 chars)" type="text"/>
						<div id="dateString" class="h-a fs-s fl-l topMargin-20 d-ib">
							<span id="startDatePrint" title="Starting date" pickMode="startDate" class="dateStringDate pointer d-ib transition"></span>
							<span id="startTimePrint" title="Starting time" pickMode="startTime" class="dateStringTime pointer d-ib transition"></span>
							<span class="d-ib">–</span>
							<span id="endDatePrint" title="Ending date" pickMode="endDate" class="dateStringDate pointer d-ib transition"></span>
							<span id="endTimePrint" title="Ending time" pickMode="endTime" class="dateStringTime pointer d-ib transition"></span>
						</div>
						<input type="hidden" id="startDateInput" name="startDate" value="" />
						<input type="hidden" id="endDateInput" name="endDate" value="" />
						<div class="h-a d-ib topMargin-20 fl-r centerMiddle"><input disabled="disabled" class="pop-in-t hoverDarker focusDarker font-ps fs-s pointer bold transition" id="create-task-submit" type="submit" value="Create task"/></div>
					</form>
				</div>
			</div>
			<div class="d-n pos-a pop" id="manage-pop">
				<div class="fs-m pop-top draggable centerMiddle">
					<span class="fl-l">Manage tasks</span><span class="pointer close-icon fl-r" title="Close"></span>
				</div>
				<div class="d-b topMargin-20 bottomMargin-20 leftMargin-20 rightMargin-20" id="manageBlock">
					<div class="d-b fs-s manageTasksItem bold header">
						<span class="d-ib no-p-m centerMiddle fl-l manageTasksStart">Begins</span>
						<span class="d-ib no-p-m fl-l manageTasksTitle">Task title</span>
						<span class="d-ib no-p-m centerMiddle fl-l manageTasksEnd"> Ends</span>
					</div>
					<div class="d-n pos-a bold centerMiddle" id="noTasks">You do not have any active tasks.</div>
				</div>
			</div>
			<div class="d-n pos-a pop" id="edit-pop">
				<div class="fs-m pop-top draggable centerMiddle">
					<span class="fl-l">Edit task</span><span class="pointer close-icon fl-r" title="Close"></span>
				</div>
				<div class="no-p-m h-a" id="editBlock">
					<form id="editTaskForm" class="no-p-m h-a">
						<input required="required" maxlength="255" class="pop-in-t hoverDarker focusDarker font-ps fs-s transition" name="title" placeholder="Task title (max. 255 chars)" type="text"/>
						<div id="editDateString" class="h-a fs-s fl-l topMargin-20 d-ib">
							<span id="editStartDatePrint" title="Starting date" pickMode="editStartDate" class="dateStringDate pointer d-ib transition"></span>
							<span id="editStartTimePrint" title="Starting time" pickMode="editStartTime" class="dateStringTime pointer d-ib transition"></span>
							<span class="d-ib">–</span>
							<span id="editEndDatePrint" title="Ending date" pickMode="editEndDate" class="dateStringDate pointer d-ib transition"></span>
							<span id="editEndTimePrint" title="Ending time" pickMode="editEndTime" class="dateStringTime pointer d-ib transition"></span>
						</div>
						<input type="hidden" id="editStartDateInput" name="startDate" value="" />
						<input type="hidden" id="editEndDateInput" name="endDate" value="" />
						<input type="hidden" id="editTID" name="editTID" value="" />
						<div class="h-a d-ib topMargin-20 fl-r centerMiddle"><input class="pop-in-t hoverDarker focusDarker font-ps fs-s pointer bold transition" id="update-task-submit" disabled="disabled" type="submit" value="Update task"/></div>
					</form>
				</div>
			</div>
		</span>
		<div class="pos-a d-n" id="datePick">
			<div id="minipickContainer" class="no-p-m fs-s">
				<div class="minipickCanvas" id="minipickGridContainer">
					<div class="upper centerMiddle bold minipickCanvasItem">m</div>
					<div class="upper centerMiddle bold minipickCanvasItem">t</div>
					<div class="upper centerMiddle bold minipickCanvasItem">w</div>
					<div class="upper centerMiddle bold minipickCanvasItem">t</div>
					<div class="upper centerMiddle bold minipickCanvasItem">f</div>
					<div class="upper centerMiddle bold minipickCanvasItem">s</div>
					<div class="upper centerMiddle bold minipickCanvasItem">s</div>
				</div>
			</div>
			<div id="minipickControls">
				<div id="minipickScopePrev" title="Previous month" class="d-ib bold font-st fs-s round hoverDarker activeDarker pointer transition">&lt;</div>
				<div id="minipickScopeMonth" class="fs-s d-ib bold leftMargin-10">
					<span class="fs-s"></span>
					<input class="bold font-ps fs-s" id="minipickYearInput" type="number" min="0" maxlength="4" value=""/>
				</div>
				<div id="minipickScopeNext" title="Next month" class="d-ib bold font-st round hoverDarker activeDarker pointer transition leftMargin-10">&gt;</div>
			</div>
		</div>
		<div class="pos-a d-n" id="timePick">
			<div class="no-p-m" id="timePickContainer">
				<div class="timePickCanvas" id="timePickGridContainer"></div>
			</div>
		</div>
		<input type="hidden" id="minipickScope" value=""/>
		<input type="hidden" id="minipickDayScope" value=""/>
		<input type="hidden" id="minipickMode" value=""/>
		<input type="hidden" id="timepickSelected" value=""/>
		<input type="hidden" id="timepickMode" value=""/>
	</div>
	<input type="hidden" id="calendarScope" value=""/>
	<input type="hidden" id="calendarCanvas" value="w"/>
	<input type="hidden" id="calendarInBetween" value=""/>
	<input type="hidden" id="scrolledAlready" value=""/>
	<div class="fl-l d-ib" id="sideContainer">
		<div class="o-a">
			<div id="create-button" class="fs-sm bold button pointer hoverDarker activeDarker transition centerMiddle d-ib padding-6-10-em h-a fl-l">
				<i class="fas fa-asterisk"></i>&nbsp;&nbsp;Create task
			</div>
			<div id="manage-button" class="fs-sm bold button pointer hoverDarker activeDarker transition centerMiddle d-ib padding-6-10-em h-a fl-r rightMargin-3">
				<i class="fas fa-calendar-check"></i>&nbsp;&nbsp;Manage tasks
			</div>
		</div>
		<div id="miniCalendar" class="topMargin-20"></div>
	</div>
	<div class="fl-r d-ib" id="mainContainer"></div>
	<script type="text/javascript">localStorage.setItem("userID","<?=$uID?>");</script>
<?php
	}else{
?>
<body class="custom-bg">
	<div class="d-n pos-a no-p-m" id="full-mask"></div>
	<div class="d-b pos-a no-p-m" id="blurContainer">
		<div class="pos-a" id="blurContent">
			<div class="centerMiddle fs-xxxl-v ls-min"><span class="bold">cally:</span> Personal Calendar</div>
			<div class="centerMiddle fs-l-v ls-min topMargin-10">cally is a clean and easy to use personal calendar application with various functionalities.</div>
			<div class="centerMiddle fs-l-v ls-min d-b topMargin-40"><span id="sign-in-button" class="button hoverDarker activeDarker bold pointer transition padding-4-8-em rightMargin-20">Sign in</span><span id="sign-up-button" class="button hoverDarker bold activeDarker pointer transition padding-4-8-em leftMargin-20">Sign up</span></div>
		</div>
	</div>
	<div class="d-n pos-a pop" id="sign-in-pop">
		<div class="fs-m pop-top draggable centerMiddle">
			<span class="fl-l">Sign in</span><span class="pointer close-icon fl-r" title="Close"></span>
		</div>
		<form id="signInForm" name="signIn" class="no-p-m">
			<div class="d-b centerMiddle topMargin-30"><input required="required" class="pop-in-t hoverDarker focusDarker font-ps fs-s transition" placeholder="E-mail Address" type="email" name="email"/></div>
			<div class="d-b centerMiddle o-a">
				<div class="d-ib fl-l centerMiddle leftMargin-40"><input required="required" class="pop-in-t hoverDarker focusDarker font-ps fs-s transition" placeholder="Password" type="password" name="password"/></div>
				<div class="d-ib fl-r centerMiddle rightMargin-40 topMargin-10"><input class="pop-in-t hoverDarker focusDarker font-ps fs-s pointer bold transition" type="submit" value="Sign in" name=""/></div>
			</div>
		</form>
	</div>
	<div class="d-n pos-a pop" id="sign-up-pop">
		<div class="fs-m pop-top draggable centerMiddle">
			<span class="fl-l">Sign up</span><span class="pointer close-icon fl-r" title="Close"></span>
		</div>
		<form id="signUpForm" name="signUp" class="no-p-m">
			<div class="d-b centerMiddle topMargin-30 o-a">
				<div class="d-ib fl-l centerMiddle leftMargin-40"><input name="firstName" required="required" class="pop-in-t hoverDarker focusDarker font-ps fs-s transition" maxlength="255" placeholder="First Name(s)" type="text"/></div>
				<div class="d-ib fl-r centerMiddle rightMargin-40"><input name="lastName" required="required" class="pop-in-t hoverDarker focusDarker font-ps fs-s transition" maxlength="255" placeholder="Last Name" type="text"/></div>
			</div>
			<div class="d-b centerMiddle"><input name="email" required="required" class="pop-in-t hoverDarker focusDarker font-ps fs-s transition" placeholder="E-mail Address" type="email"/></div>
			<div class="d-b centerMiddle"><input name="password" required="required" class="pop-in-t hoverDarker focusDarker font-ps fs-s transition" placeholder="Password (8-72 characters)" minlength="8" maxlength="72" type="password"/></div>
			<div class="d-b centerMiddle"><input name="confirmPassword" required="required" class="pop-in-t hoverDarker focusDarker font-ps fs-s transition" placeholder="Confirm Password" type="password"/></div>
			<div class="d-b centerMiddle o-a topMargin-10">
				<div class="d-ib fl-l centerMiddle topMargin-5 leftMargin-40"><input class="pop-in-t hoverDarker focusDarker font-ps fs-s transition no-p-m rightMargin-10" type="checkbox" id="termsCheck"/><label class="d-ib centerMiddle fs-s pointer" for="termsCheck">I liked the design</label></div>
				<div class="d-ib fl-r centerMiddle rightMargin-40"><input disabled="disabled" class="pop-in-t hoverDarker focusDarker font-ps fs-s pointer bold transition" id="sign-up-submit" type="submit" value="Create an account"/></div>
			</div>
		</form>
	</div>
<?php 
	}
?>
</body>
<?php

	include_once("source/java.php");

	if(isset($uID)){

?>
<script type="text/javascript">
	var winWid=$(window).width();
	var winHei=$(window).height();
	if($("#warningAccept").val()!="acc"){
		sizeWarn(winWid,winHei);
	}
	$("#warningClose").on("click",function(){
		$("#warningAccept").val("acc");
		$("#sizeWarning").addClass("d-n");
	});
	function sizeWarn(winWid,winHei){
		if(winWid<860 || winHei<495){
			$("#sizeWarning").removeClass("d-n");
		}else{
			$("#sizeWarning").addClass("d-n");
		}
	}
	$(window).on("resize",function(){
		winWid=$(this).width();
		winHei=$(this).height();
		if($("#warningAccept").val()!="acc"){
			sizeWarn(winWid,winHei);
		}
	});
</script>
<?php
	}
?>
</html>