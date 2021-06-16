<?php

if(require_once("data.php")){

	session_start();

	$jqResponse=array();
	$jqResponse["code"]="0"; //Connected to database

	if(isset($_POST["signout"])){
		$jqResponse["code"]="10";
		if(isset($_SESSION["user_login"])){
			$jqResponse["code"]="100";
			unset($_SESSION["user_login"]);
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