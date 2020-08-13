<?php
    include_once("database.php");
    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);
    if(isset($postdata) && !empty($postdata)) {
        $pwd = mysql_real_escape_string($conn, trim($request->password));
        $email = mysql_real_escape_string($conn, trim($request->username));
        $sql = "SELECT * FROM users where email='$email' and password='$pwd'";
        if($result = mysql_query($conn,$sql)) {
            $rows = array();
            while($row = mysql_fetch_assoc($result)) {
                $rows[] = $row;
            }
            echo json_encode($rows);
        } else {
            http_response_code(404);
        }
    }
?>