<?php

    define("SERVER", "localhost");
    define("USER", "root");
    define("PASSWORD", "");
    define("DB", "estiamchat");
    
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Content-type: text/html; charset=UTF-8'); 
    header('Access-Control-Allow-Headers: X-Requested-With');

    $responce = array();
    $mysqli = new mysqli(SERVER,USER,PASSWORD,DB);

    if($mysqli->connect_error){
        $responce["MESSAGE"] = "INTERNAL SERVER ERROR";
        $responce["STATUS"] = 500;
        echo json_encode($responce);
    }

    else{

        $jsonData = file_get_contents('php://input'); //input from client
        $jsonDecode = json_decode($jsonData,true);

        if(is_array($jsonDecode)){

            foreach ($jsonDecode as $key => $value){
                $_POST[$key] = $value; //set to global variable
            }
        }

        if( $_POST['username'] && $_POST['mdp']){

            $data = array();
            $data2 = array();
            $username = $_POST['username'];
            $mdp = $_POST['mdp'];
            $timeconnect = time();

            $sql = "SELECT timeconnect FROM users WHERE username='{$username}' AND mdp='{$mdp}'";
            $table_data2 = $mysqli->query($sql);
            while($row = $table_data2->fetch_array(MYSQLI_ASSOC)){
                $data2[] = $row;
            }

            if(count($data) > 0){
                $sql = "UPDATE users SET timeconnect= '{$timeconnect}' WHERE username='{$username}' AND mdp='{$mdp}'";               
            }
            else{
                $sql = "INSERT INTO users(timeconnect) VALUES '{$timeconnect}'";
            }
            
            $mysqli->query($sql);

            $sql = "SELECT * FROM users WHERE username='{$username}' AND mdp='{$mdp}'";

            $table_data = $mysqli->query($sql);
            while($row = $table_data->fetch_array(MYSQLI_ASSOC)){
                $data[] = $row;
            }
            if(count($data) > 0){
                $responce["DATA"] = $data;
                $responce["MESSAGE"] = "DATA FOUND";
                $responce["STATUS"] = 200;
            }
            else{
                $responce["MESSAGE"] = "DATA NOT FOUND";
                $responce["STATUS"] = 404;
                echo json_encode($responce);
            }
        }

        
    }
    //gère l'encodage utf8 pour afficher les données
    function utf8ize($d) {
        if (is_array($d)) 
            foreach ($d as $k => $v) 
                $d[$k] = utf8ize($v);
         else if(is_object($d))
            foreach ($d as $k => $v) 
                $d->$k = utf8ize($v);
         else 
            return utf8_encode($d);
        return $d;
    }
    echo json_encode(utf8ize($data));

?>