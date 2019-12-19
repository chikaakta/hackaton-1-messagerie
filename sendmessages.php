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

        if( $_POST['sender'] && $_POST['receiver'] && $_POST['content']){

            $data = array();

            //////////////////////////////////
            //strtotime('2010-05-17 19:13:37');
            //////////////////////////////////
            
            $sender = $_POST['sender'];
            $receiver = $_POST['receiver'];
            $content = $_POST['content'];

            $sql = "INSERT INTO messages(sender,receiver,content) VALUES('{$_POST['sender']}','{$_POST['receiver']}','{$_POST['content']}')";

            if($mysql -> query($sql)){
                $responce["MESSAGE"] = "SAVE DATA SUCCED";
                $responce["STATUS"] = 200;
            }
            else{

            $responce["MESSAGE"] = "SAVE DATA FAILED";
            $responce["STATUS"] = 500;
            }            
        }
        else{

            $responce["MESSAGE"] = "INVALID REQUEST";
            $responce["STATUS"] = 400;
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

    echo json_encode($responce);
    
?>