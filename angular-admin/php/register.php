<?php
    include_once("database.php");
    include_once("config.php");
    // $SALT, $STATIC_SALT // In config.php
    $postdata = file_get_contents("php://input");
    if(isset($postdata) && !empty($postdata)) {
        $request = json_decode($postdata);
        // $name = mysql_real_escape_string($conn, $request->name); // for mysqli
        // $name = $conn->quote(trim($request->name)); // Have ' '
        $name = trim($request->name);
        $pwd = md5($STATIC_SALT.trim($request->pwd).$SALT);
        $email = trim($request->email);

        $sql = "INSERT INTO users(name,password,email) VALUES (:name, :pwd, :email)";
        $pre = $conn->prepare($sql); // prepare the query
        $pre->bindParam(':name', $name, PDO::PARAM_STR);
        $pre->bindParam(':pwd', $pwd, PDO::PARAM_STR);
        $pre->bindParam(':email', $email, PDO::PARAM_STR);

        if ($pre->execute() == TRUE) {
            $authdata = [
                'name' => $name,
                'pwd' => '',
                'email' => $email,
                'Id' => $conn->lastInsertId()
            ];
            echo json_encode($authdata);
        } else {
            http_response_code(404);
        }
    }

?>