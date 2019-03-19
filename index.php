<!DOCTYPE html>
<html>
<head>
		<title>Question2</title>
	<?php 
	ini_set('display_errors', 1);
	ini_set('display_startup_errors', 1);
	error_reporting(E_ALL);
	// include("process.php");
	?>






</head>
<body>
<form id = "login_form" name = "login_form" action="process.php" method = "post" enctype="multipart/form-data" onsubmit="true">
	<input type="text" name="usrnam" id = "usrnam" value="">
	<input type="text" name="pswd" id = "pswd" value="">
	<input type="submit" name="login" id="login" value="LOGIN">
	<input type="submit" name="create_user" id="create_user" value="SIGN UP">
</form><br><br>




<div id = "disp"></div>

</body>
</html>
