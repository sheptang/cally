<?php

if(require_once("data.php")){

	$jqResponse=array();
	$jqResponse["code"]="0"; //Connected to database

	if(isset($_POST)){
		$jqResponse["code"]="10"; //Form received
		if(isset($_POST["firstName"]) && isset($_POST["lastName"]) && isset($_POST["email"]) && isset($_POST["password"]) && isset($_POST["confirmPassword"])){
			$jqResponse["code"]="100"; //Form includes required array
			if(!empty($_POST["firstName"]) && !empty($_POST["lastName"]) && !empty($_POST["email"]) && !empty($_POST["password"]) && !empty($_POST["confirmPassword"])){
				$jqResponse["code"]="1000"; //Required array has values
				$firstName=mysqli_real_escape_string($conn,htmlspecialchars($_POST["firstName"],ENT_QUOTES));
				$lastName=mysqli_real_escape_string($conn,htmlspecialchars($_POST["lastName"],ENT_QUOTES));
				$email=mysqli_real_escape_string($conn,htmlspecialchars($_POST["email"],ENT_QUOTES));
				$password=mysqli_real_escape_string($conn,htmlspecialchars($_POST["password"],ENT_QUOTES));
				$confirmPassword=mysqli_real_escape_string($conn,htmlspecialchars($_POST["confirmPassword"],ENT_QUOTES));
				function validateEmail($str){
					return (!preg_match("/^([a-z0-9\+_\-]+)(\.[a-z0-9\+_\-]+)*@([a-z0-9\-]+\.)+[a-z]{2,6}$/ix",$str)) ? false : true;
				}
				function usableEmail($str,$conn){
					$sqlCheck="SELECT email FROM users WHERE email='$str'";
					$checkResult=mysqli_query($conn,$sqlCheck);
					$numRows=mysqli_num_rows($checkResult);
					return ($numRows>0) ? false : true;
				}
				if(validateEmail($email) && usableEmail($email,$conn)){
					$jqResponse["code"]="10001"; //Submitted e-mail address is valid and usable
					if($password==$confirmPassword){
						$jqResponse["code"]="10002"; //Submitted password strings match
						if(strlen($password)>=8 && strlen($password)<=72){
							$jqResponse["code"]="10003"; //Submitted password is within allowed limits
							$pwdHashSec=password_hash($password,PASSWORD_BCRYPT);
							$sqlInsert="INSERT INTO users (firstName,lastName,email,hash) VALUES ('$firstName','$lastName','$email','$pwdHashSec')";
							if(mysqli_query($conn,$sqlInsert)){
								$insertId=mysqli_insert_id($conn);
								$insertUid=md5($insertId);
								mysqli_query($conn,"UPDATE users SET uid='$insertUid' WHERE id='$insertId'");
								$jqResponse["code"]="100000"; //New user entry created successfully
								$jqResponse["email"]=$email;
							}else{
								$jqResponse["code"]="-100000"; //Entry could not be created
							}
						}else{
							$jqResponse["code"]="-10003"; //Submitted password is not within allowed limits
						}
					}else{
						$jqResponse["code"]="-10002"; //Submitted password strings do not match
					}
				}else{
					$jqResponse["code"]="-10001"; //Submitted e-mail address is invalid
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