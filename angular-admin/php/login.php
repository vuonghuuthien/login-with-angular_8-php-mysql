<?php
    include_once("database.php");
    include_once("config.php");
    // $SALT, $STATIC_SALT // In config.php
    include_once("base64url.php");
    $postdata = file_get_contents("php://input");
    if(isset($postdata) && !empty($postdata)) {
        $request = json_decode($postdata);
        $pwd = md5($STATIC_SALT.trim($request->password).$SALT);
        $email = trim($request->email);
        $sql = "SELECT * FROM users WHERE email=:email AND password=:pwd";
        $pre = $conn->prepare($sql); // prepare the query
        $pre->bindParam(':pwd', $pwd, PDO::PARAM_STR);
        $pre->bindParam(':email', $email, PDO::PARAM_STR);
        if ($pre->execute() == TRUE) {
            $rows = array();
            while ($row = $pre->fetch(PDO::FETCH_ASSOC)) {
                $rows[] = $row;
            }
            http_response_code(200);
            echo json_encode($rows);
        } else {
            http_response_code(401);
            echo json_encode(array("message" => "Login failed."));
        }
    }
?>