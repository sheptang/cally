<?php

if(require_once("data.php")){

	session_start();

	$jqResponse=array();
	$jqResponse["code"]="0"; //Connected to database

	if(!isset($_SESSION["user_login"])){
		$uID=$_COOKIE["user_login"];
	}elseif(!isset($_COOKIE["user_login"])){
		$uID=$_SESSION["user_login"];
	}

	if(isset($_POST) && isset($uID)){
		$jqResponse["code"]="10"; //Form received
		if(isset($_POST["title"]) && isset($_POST["startDate"]) && isset($_POST["endDate"])){
			$jqResponse["code"]="100"; //Form includes required array
			if(!empty($_POST["title"]) && !empty($_POST["startDate"]) && !empty($_POST["endDate"])){
				$jqResponse["code"]="1000"; //Required array has values
				$tid=mysqli_real_escape_string($conn,htmlspecialchars($_POST["tid"],ENT_QUOTES));
				$sqlUpdate="UPDATE tasks SET deleted='1' WHERE tid='$tid'";
				if(mysqli_query($conn,$sqlUpdate)){
					$jqResponse["code"]="10000"; //New task entry created successfully
				}else{
					$jqResponse["code"]="-10000"; //Entry could not be created
				}
			}else{
				$jqResponse["code"]="-1000"; //Required array does not have values
			}
		}else{
			$jqResponse["code"]="-100"; //Form does not include required array
		}
		echo json_encode($jqResponse);
	}else{
		$jqResponse["code"]="-10"; //Form has not been submitted in a post array
		die(json_encode($jqResponse));
	}
}else{
	$jqResponse["code"]="-0"; //Could not connect to the database
	die(json_encode($jqResponse));
}

?>