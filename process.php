<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
$dbhost = 'localhost';
$dbuser = 'root';
$dbpassword = 'kentenben11';
$dbname = 'Pro1';
$tablename = 'test1';
$conn = mysqli_connect($dbhost, $dbuser, $dbpassword, $dbname);
define('DEBUGOUTPUT', 1);
if (! $conn){
	die("could not connect");
}
if (isset($_POST['add_event_btn'])){
	//echo "insert block starts\n";
	// "aeid" "aedate" "astart_time"  "aend_time" "adescription" "add_event_btn"
	$date = mysqli_real_escape_string($conn, $_POST['aedate']) ;
	$astart_time = mysqli_real_escape_string($conn, $_POST['astart_time']);
	$aend_time = mysqli_real_escape_string($conn, $_POST['aend_time']);
	$adescription = mysqli_real_escape_string($conn, $_POST['adescription']);
	$ins_query = "INSERT into " . $tablename . "(event_date, start_time, end_time, description) VALUES('" . $date . "','" . $astart_time . "','" . $aend_time . "','" . $adescription . "')";
	$success = $conn->query($ins_query);
	if (!$success){
		echo "The Event failed!!!";
	}else{
		echo "<p>Event Creation Successful!!</p>";
		echo "<p>The ID for this query is:", mysqli_insert_id($conn), "</p>";
		// echo "success hua!";
	}
	echo "You will be redirected back to previous page in about 5 seconds. <a href = \"index.php\">Go back now</a>";
	header( "refresh:5;url=index.php" )	;
		// echo "$ins_query";
}
if (isset($_POST['login'])){
	$old_user = mysqli_real_escape_string($conn, $_POST['usrnam']);
	$old_user_password = mysqli_real_escape_string($conn, $_POST['pswd']) ;
	$login_get_query = "SELECT username, salt, hashed_p FROM $tablename WHERE username='$old_user' LIMIT 1";
	echo "\n<br>login get query is: <br>\n";
	echo $login_get_query . "<br>\n";
	$res1 = $conn->query($login_get_query);
	if (defined('DEBUGOUTPUT') && DEBUGOUTPUT ) {
		echo 'mysqli_error: ', mysqli_error($conn), "\n";
	}
	if ($res1->num_rows > 0){
		while($row = $res1->fetch_assoc()) {
			// echo "<tr><td>" . $row["event_id"]. "</td><td>" . $row["event_date"] . "</td><td>" . $row["start_time"]. "</td><td>" . $row["end_time"] . "</td><td>" . $row["description"] . "</td></tr>\n";
			$temp_salt = $row["salt"];
			$temp_hash = hash("sha256", $temp_salt . $old_user_password);
			if ($temp_hash == $row["hashed_p"]){
				echo "Login of user $old_user successful";
			}
			else{
				echo "Login failed!<br>\n";
				echo "The password we got from you was: " . $old_user_password . "<br>\n";
				echo "Its hash with salt $temp_salt is $temp_hash<br>\n";
				echo "The hash stored is: " . $row["hashed_p"];
			}
		}
	}
	else{
		echo "Error! this username(" . $old_user . ") DNE!";
	}
}
if (isset($_POST['create_user'])){
	$new_user_name = mysqli_real_escape_string($conn, $_POST['usrnam']);
	$new_user_salt = mysqli_real_escape_string($conn, $_POST['usrnam']);
	$new_user_pswd = mysqli_real_escape_string($conn, $_POST['pswd']);
	$hashed_masala = hash("sha256", $new_user_salt . $new_user_pswd);
	$signup_dup_query = "SELECT TOP 1 username FROM $tablename WHERE username = $new_user_name";
	$res1 = $conn->query($signup_dup_query);
	if ($res1->num_rows > 0){
		echo "User already exists. Please try again<br>\n";
	}
	else{
		$ins_query = "INSERT into $tablename (username, salt, hashed_p) VALUES ('$new_user_name','$new_user_salt','$hashed_masala')";
		$success = $conn->query($ins_query);
		if ($success){
			echo "Insertion successful!<br>\n";
		}
		else{
			echo "Insertion failed<br>\n";
			echo "\n<br>login insert query is: <br>\n";
			echo $ins_query . "<br>\n";
			if ( defined('DEBUGOUTPUT') && DEBUGOUTPUT ) {
				echo 'mysqli_error: ', mysqli_error($conn), "\n";
			}
		}
	}
}

echo  "<a href = \"index.php\">Go back now</a>";

?>