<?php
    // $DB_HOST = '.\\'; // Host name //localhost
    // $DB_USER = 'sa'; // Host Username
    // $DB_PASS = '123123'; // Host Password
    // $DB_NAME = 'TMTDentalTenantDb'; // Database name
    $DB_HOST = 'localhost'; // Host name //localhost
    $DB_USER = 'root'; // Host Username
    $DB_PASS = ''; // Host Password
    $DB_NAME = 'myDB'; // Database name
    
    try {
        // PDO Connection
        // $conn = new PDO("mysql:host=$DB_HOST; dbname=$DB_NAME;", $DB_USER, $DB_PASS); 
        // $conn = new PDO("sqlsrv:Server=$DB_HOST; Database=$DB_NAME", $DB_USER, $DB_PASS); 

        $conn = new PDO("mysql:host=$DB_HOST", $DB_USER, $DB_PASS);
        // set the PDO error mode to exception
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); 
        // create Database if not exists
        $dbs = $conn->query("CREATE DATABASE IF NOT EXISTS  $DB_NAME DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci"); 

        $conn = new PDO("mysql:host=$DB_HOST; dbname=$DB_NAME;", $DB_USER, $DB_PASS); 
        
        echo "Connected successfully</br>";
    } catch(PDOException $e) {
        echo "Connection failed: " . $e->getMessage() . "</br>";
    }

    // 
    $dbs = $conn->query("SHOW TABLES LIKE 'users'"); 
    echo count($dbs->fetchAll());
?>