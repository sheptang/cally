<?php

$conn=mysqli_connect("localhost","callymaster","c4l1y53cUr3p4s5w0Rd","cally");

//$conn=mysqli_connect("anysql.itcollege.ee","team18","p*.63,GBQm5","WT_18");

mysqli_set_charset($conn,"utf8");

if(mysqli_connect_errno()){
	die("Database connection error. Error code: ".mysqli_connect_error());
}

?>