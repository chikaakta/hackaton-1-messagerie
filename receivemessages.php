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

        if( $_POST['username'] && $_POST['mdp']){ //vérifie le compte

            $data = array();
            $username = $_POST['username'];
            $mdp = $_POST['mdp'];
            $sql = "SELECT * FROM users WHERE username='{$username}' AND mdp='{$mdp}'";
            $table_data = $mysqli->query($sql);
            while($row = $table_data->fetch_array(MYSQLI_ASSOC)){
                $data[] = $row;
            }
            if(count($data) > 0){

                if( $_POST['friend']){ //va chercher l' id du destinataire.

                    $friendId = $_POST['friend'];
                    //$friendId = $data2[0]["id"];
                    $data3 = array();
                    $senderId = $_POST['id'];
                    $sql = "SELECT sender, receiver, content, timesent FROM messages WHERE sender='{$senderId}' AND receiver='{$friendId}'";
                    $table_data3 = $mysqli->query($sql);
                    while($row = $table_data3->fetch_array(MYSQLI_ASSOC)){
                        $data3[] = $row;
                    }//tout les messages que le demandeur à envoyé a l'ami

                    $sql = "SELECT sender, receiver, content, timesent FROM messages WHERE sender='{$friendId}' AND receiver='{$senderId}'";
                    $table_data4 = $mysqli->query($sql);
                    while($row = $table_data4->fetch_array(MYSQLI_ASSOC)){
                        $data3[] = $row;
                    }//tout les messages que l'ami à envoyé au demandeur                    
                    echo json_encode(utf8ize($data3));
                }
                    else{
                        $responce["MESSAGE"] = "UTILISATEUR INCONNU";
                        echo json_encode(utf8ize($responce));
                    }
                }


            }
            else{
                $responce["MESSAGE"] = "ACCESS DENIED";
                $responce["STATUS"] = 404;
                echo json_encode(utf8ize($responce));
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
?>