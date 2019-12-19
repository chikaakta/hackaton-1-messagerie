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
            $friend = $_POST['friend'];
            $sql = "SELECT * FROM users WHERE username='{$username}' AND mdp='{$mdp}'";
            $table_data = $mysqli->query($sql);
            while($row = $table_data->fetch_array(MYSQLI_ASSOC)){
                $data[] = $row;
            }
            if(count($data) > 0){

                if( $_POST['friend']){ //va chercher l' id du destinataire.

                    $friend = $_POST['friend'];
                    $sql = "SELECT id FROM users WHERE username='{$friend}'";
                    $table_data2 = $mysqli->query($sql);
                    $data2 = array();

                    while($row = $table_data2->fetch_array(MYSQLI_ASSOC)){
                        $data2[] = $row;
                    }
                    if(count($data2) > 0){

                        $friendId = (string)$data2[0]["id"];

                        $sql = "SELECT yourFriends FROM users WHERE username='{$username}'";
                        $table_data2 = $mysqli->query($sql);
                        $data2 = array();
    
                        while($row = $table_data2->fetch_array(MYSQLI_ASSOC)){
                            $data2[] = $row;
                        }
                        $yourFriendDataBase = explode(",",(string)$data2[0]["yourFriends"]);
                        
                        if($yourFriendDataBase[0] == ""){

                            $sql = "UPDATE Users SET yourFriends='{$friendId}' WHERE username = '{$username}'";
                            $mysqli->query($sql);
                            $responce["MESSAGE"] = "AMIS AJOUTE";
                        }
                        else{

                            if(in_array ( $friendId, $yourFriendDataBase)){
    
                                $responce["MESSAGE"] = "AMIS DEJA AJOUTE";
                            }
                            else{
    
                                $sql = "UPDATE Users SET yourFriends=concat(yourFriends,',{$friendId}') WHERE username = '{$username}'";
                                $mysqli->query($sql);
                                $responce["MESSAGE"] = "AMIS AJOUTE";
                            }
                        }
                    }
                    else{
                        $responce["MESSAGE"] = "UTILISATEUR INCONNU";
                    }
                }
                else{
                    $responce["MESSAGE"] = "MANQUE DES PARAMETRES";
                }
            }
            else{
                $responce["MESSAGE"] = "ACCESS DENIED";
                $responce["STATUS"] = 404;
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
    echo json_encode($responce);  
?>