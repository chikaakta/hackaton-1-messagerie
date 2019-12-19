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
    $mysql = new mysqli(SERVER,USER,PASSWORD,DB);

    if($mysql->connect_error){
        $responce["MESSAGE"] = "INTERNAL SERVER ERROR";
        $responce["STATUS"] = 500;
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
            $username = $_POST['username'];
            $mdp = $_POST['mdp'];
            $timeconnect = time();
            $sql = "SELECT * FROM users WHERE username='{$username}'";
            $table_data = $mysql->query($sql);
            while($row = $table_data->fetch_array(MYSQLI_ASSOC)){
                $data[] = $row;
            }
            if(count($data) > 0){
                $responce["MESSAGE"] = "NOM DEJA UTILISE";
                $responce["STATUS"] = 200;
                echo json_encode($responce);
            }
            else{

                $sql = "INSERT INTO users(username,mdp,timeconnect) VALUES('{$_POST['username']}','{$_POST['mdp']}','{$timeconnect}')";
        
                if($mysql -> query($sql)){
                    $responce["MESSAGE"] = "SAVE DATA SUCCED";
                    $responce["STATUS"] = 200;


                    $sql = "SELECT * FROM users WHERE username='{$username}'";
                    $table_data = $mysql->query($sql);
                    while($row = $table_data->fetch_array(MYSQLI_ASSOC)){
                        $data[] = $row;
                    }
                    if(count($data) > 0){

                        echo json_encode(utf8ize($data));
                    }
                }
                else{

                $responce["MESSAGE"] = "SAVE DATA FAILED";
                $responce["STATUS"] = 500;
                echo json_encode($responce);
            }
            } 
        }
        else{

            $responce["MESSAGE"] = "INVALID REQUEST";
            $responce["STATUS"] = 400;
            echo json_encode($responce);
        }
    }

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
    
?>