<?php
    include_once("database.php");
    $postdata = file_get_contents("php://input");
    if(isset($postdata) && !empty($postdata)) {
        $request = json_decode($postdata);
        $pwd = trim($request->password);
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
            echo json_encode($rows);
        } else {
            http_response_code(404);
        }
    }
?>