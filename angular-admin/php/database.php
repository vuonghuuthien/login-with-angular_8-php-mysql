<?php
    header("Access-Control-Allow-Origin: *");
    header('Access-Control-Allow-Credentials: true');
    header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
    header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
    header("Content-Type: application/json; charset=UTF-8");

    // $DB_HOST = '.\\'; // Host name //localhost
    // $DB_USER = 'sa'; // Host Username
    // $DB_PASS = '123123'; // Host Password
    // $DB_NAME = 'TMTDentalTenantDb'; // Database name
    $DB_HOST = 'localhost'; // Host name //localhost
    $DB_USER = 'root'; // Host Username
    $DB_PASS = ''; // Host Password
    $DB_NAME = 'myDB'; // Database name

    $DB_TABLES = array("users");
    
    try {
        // PDO Connection
        // $conn = new PDO("mysql:host=$DB_HOST; dbname=$DB_NAME;", $DB_USER, $DB_PASS); 
        // $conn = new PDO("sqlsrv:Server=$DB_HOST; Database=$DB_NAME", $DB_USER, $DB_PASS); 

        $conn = new PDO("mysql:host=$DB_HOST", $DB_USER, $DB_PASS);
        // set the PDO error mode to exception
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); 
        // create Database if not exists
        $dbs = $conn->query("CREATE DATABASE IF NOT EXISTS  $DB_NAME DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci"); 
        // reconnect PDO with Database
        $conn = new PDO("mysql:host=$DB_HOST; dbname=$DB_NAME;", $DB_USER, $DB_PASS); 
        // check and create if Tables do not exists
        for ($i = 0; $i < count($DB_TABLES); $i++) {
            $dbs = $conn->query("CREATE TABLE IF NOT EXISTS $DB_TABLES[$i] (
                id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                password VARCHAR(50) NOT NULL,
                email VARCHAR(100) NOT NULL
            )"); 
        }
        echo "Connected successfully</br>";
    } catch(PDOException $e) {
        echo "Connection failed: " . $e->getMessage() . "</br>";
    }
?>