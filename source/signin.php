<?php

if(require_once("data.php")){

	session_start();

	$jqResponse=array();
	$jqResponse["code"]="0"; //Connected to database

	if(isset($_POST)){
		$jqResponse["code"]="10"; //Form received
		if(isset($_POST["email"]) && isset($_POST["password"])){
			$jqResponse["code"]="100"; //Form includes required array
			if(!empty($_POST["email"]) && !empty($_POST["password"])){
				$jqResponse["code"]="1000"; //Required array has values
				$email=mysqli_real_escape_string($conn,htmlspecialchars($_POST["email"],ENT_QUOTES));
				$password=mysqli_real_escape_string($conn,htmlspecialchars($_POST["password"],ENT_QUOTES));
				function emailExists($str,$conn){
					$sqlCheck="SELECT email FROM users WHERE email='$str'";
					$checkResult=mysqli_query($conn,$sqlCheck);
					$numRows=mysqli_num_rows($checkResult);
					return ($numRows>0) ? true : false;
				}
				if(emailExists($email,$conn)){
					$jqResponse["code"]="10001"; //Submitted e-mail address is used
					$sqlVerify="SELECT uid,hash FROM users WHERE email='$email'";
					$verifyResult=mysqli_fetch_array(mysqli_query($conn,$sqlVerify));
					$pwdHashSec=$verifyResult["hash"];
					$uId=$verifyResult["uid"];
					if(password_verify($password,$pwdHashSec)){
						$jqResponse["code"]="100000"; //Signed in
						$_SESSION["user_login"]=$uId;
					}else{
						$jqResponse["code"]="-100000"; //Password is not correct
					}
				}else{
					$jqResponse["code"]="-10001"; //Submitted e-mail is not used
					$jqResponse["email"]=$email;
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