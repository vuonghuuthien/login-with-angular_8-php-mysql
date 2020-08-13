<?php
    include_once("database.php");
    $postdata = file_get_contents("php://input");
    if(isset($postdata) && !empty($postdata)) {
        $request = json_decode($postdata);
        // $name = mysql_real_escape_string($conn, $request->name); // for mysqli
        // $name = $conn->quote(trim($request->name)); // Have ' '
        $name = trim($request->name);
        $pwd = trim($request->pwd);
        $email = trim($request->email);

        $sql = "INSERT INTO users(name,password,email) VALUES (:name, :pwd, :email)";
        $pre = $conn->prepare($sql); // prepare the query
        $pre->bindParam(':name', $name, PDO::PARAM_STR, 100);
        $pre->bindParam(':pwd', $pwd, PDO::PARAM_STR, 50);
        $pre->bindParam(':email', $email, PDO::PARAM_STR, 100);
        $pre->execute();

        // if ($conn->query($sql) === TRUE) {
        //     $authdata = [
        //         'name' => $name,
        //         'pwd' => '',
        //         'email' => $email,
        //         'Id' => mysqli_insert_id($conn)
        //     ];
        //     echo json_encode($authdata);
        //     echo "----Hello----";
        // }
    }

?>