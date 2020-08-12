<?php
    // $DB_HOST = '.\\'; // Host name //localhost
    // $DB_USER = 'sa'; // Host Username
    // $DB_PASS = '123123'; // Host Password
    // $DB_NAME = 'TMTDentalTenantDb'; // Database name
    $DB_HOST = 'localhost'; // Host name //localhost
    $DB_USER = 'root'; // Host Username
    $DB_PASS = ''; // Host Password
    $DB_NAME = 'test'; // Database name
    
    try {
        // PDO Connection
        $conn = new PDO("mysql:host=$DB_HOST; dbname=$DB_NAME;", $DB_USER, $DB_PASS); 
        // $conn = new PDO("sqlsrv:Server=$DB_HOST; Database=$DB_NAME", $DB_USER, $DB_PASS);
        // set the PDO error mode to exception
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        echo "Connected successfully";
    } catch(PDOException $e) {
        echo "Connection failed: " . $e->getMessage();
    }
?>