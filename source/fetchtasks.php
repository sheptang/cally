<?php

if(require_once("data.php")){

	session_start();

	$jqResponse=array();
	$jqResponse["code"]="0"; //Connected to database

	if(!isset($_SESSION["user_login"])){
		$uID=$_COOKIE["user_login"];
	}elseif(!isset($_COOKIE["user_login"])){
		$uID=$_SESSION["user_login"];
	}else{
		$uID=$_POST["uID"];
	}

	if(isset($_POST) && isset($uID)){
		$jqResponse["code"]="10"; //Post received
		$sqlFetch="SELECT tid, title, startOn, endOn FROM tasks WHERE user='$uID' AND deleted='0' ORDER BY createdOn ASC";
		$fetchResult=mysqli_query($conn,$sqlFetch);
		if(mysqli_num_rows($fetchResult)>0){
			$jqResponse["taskData"]=array();
			while($r=mysqli_fetch_assoc($fetchResult)){
				$jqResponse["taskData"][]=$r;
			}
			$jqResponse["code"]="100";
		}else{
			$jqResponse["code"]="-100";
		}
		if(isset($_POST["tid"])){
			$tID=$_POST["tid"];
			$sqlFetch="SELECT tid, title, startOn, endOn FROM tasks WHERE tid='$tID'";
			$fetchResult=mysqli_query($conn,$sqlFetch);
			$jqResponse["tidTask"]=array();
			while($r=mysqli_fetch_assoc($fetchResult)){
				$jqResponse["tidTask"][]=$r;
			}
		}
		echo json_encode($jqResponse);
	}else{
		$jqResponse["code"]="-10"; //Post is not received
		die(json_encode($jqResponse));
	}
}else{
	$jqResponse["code"]="-0"; //Could not connect to the database
	die(json_encode($jqResponse));
}

?>