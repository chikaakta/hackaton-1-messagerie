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
        echo json_encode(utf8ize($responce));
    }

    else{

        $jsonData = file_get_contents('php://input'); //input from client
        $jsonDecode = json_decode($jsonData,true);

        if(is_array($jsonDecode)){

            foreach ($jsonDecode as $key => $value){
                $_POST[$key] = $value; //set to global variable
            }
        }

        if( $_POST['username'] && $_POST['mdp']){ //attend un username un mdp et un friend

            $data = array();
            $username = $_POST['username'];
            $mdp = $_POST['mdp'];
            $sql = "SELECT yourFriends FROM users WHERE username='{$username}' AND mdp='{$mdp}'";
            $table_data = $mysqli->query($sql);
            while($row = $table_data->fetch_array(MYSQLI_ASSOC)){
                $data[] = $row;
            }
            if(!empty($data)){

                $friendId = explode(",",(string)$data[0]["yourFriends"]);
                $data = array();
                foreach ($friendId as &$ID) { //parcour la liste d'ami

                    $sql = "SELECT username, id FROM users WHERE id='{$ID}'";
                    $table_data = $mysqli->query($sql);
                    while($row = $table_data->fetch_array(MYSQLI_ASSOC)){
                        $data[] = $row;
                    }
                }                
                echo json_encode(utf8ize($data));
                
            }
            else{
                $responce["MESSAGE"] = "PAS D'AMIS";
                $responce["STATUS"] = 404;
                echo json_encode(utf8ize($responce));
            }
            
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