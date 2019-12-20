import React, { useState } from 'react';
import '../App.css';
import LogoHome from "./LogoHome";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import TextCommon from "./TextCommon";
import BlockDiv from './BlockDiv';

const HomePage = ({fillUserData}) => {
  const [showInscription, setShowInscription] = useState(false);
  const [logingSigninButton, setLogingSigninButton] = useState("");
  const [formUsername, setFormUsername] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formButton, setFormButton] = useState(false);
  const [failConnection,setFailConnection] = useState(false);
  const [failSignIn,setFailSignIn] = useState(false);

  let styleLoginScreen={
    backgroundColor:"rgb(0,0,0)",
    opacity:"0.5",
    position:"absolute",
    height:"40em",
    maxHeight:"100vh",
    width:"100%",
    display: showInscription ? 'block' : 'none',
  }

  let styleLogin={
    backgroundColor:"#BBC6CB",
    borderRadius:"0.25em",
    borderColor:"#696A6A",
    position:"absolute",
    height:"50%",
    width:"40%",
    top:"25%",
    left:"30%",
    display: showInscription ? 'block' : 'none',
    padding:"1%",
  }

  let styleDiveClose={
    position:"absolute",
    height:"40px",
    width:"40px",
    top:"0%",
    right:"2%",
  }


  let styleFailConnection={
    color:'red',
    display: failConnection ? 'block' : 'none',
  }

  let styleFailSignIn={
    color:'red',
    display: failSignIn ? 'block' : 'none',
  }


  let styleForm={
    padding:"5%",
    paddingTop:"10%",
  }

  function openLoginSignin (e) {
    setShowInscription(true);
    
    if (e.target.id === 'login_button') {
      setLogingSigninButton("Connexion");
    }
    else {
      setLogingSigninButton("S'inscrire");
    }
  }

  const closeLoginSignin = () => {
    setShowInscription(false);
    setLogingSigninButton("");
  }

  const requestLogin = () => {
    if (formUsername !== '' || formPassword !== '') {
      setFormButton(true);
      fetch("http://92.151.100.58:80/api/login.php", {
        method: 'POST', 
        body: `{"username": "${formUsername}", "mdp": "${formPassword}"}`
      }).then(response => response.json())
      .then(data => {
        setFormButton(false);
        if (data.length === 1) {
          fillUserData(data[0].username, data[0].id, data[0].mdp, data[0].yourFriends === 'undefined' ? "" : data[0].yourFriends);
          setFailConnection(false);
        } else {
          setFailConnection(true);
        }
      });
    }
  }

  const requestSignin = () => {
    if (formUsername !== '' || formPassword !== '') {
      setFormButton(true);
      fetch("http://92.151.100.58:80/api/signup.php", {
        method: 'POST', 
        body: `{"username": "${formUsername}", "mdp": "${formPassword}"}`
      }).then(response => response.json())
      .then(data => {
        setFormButton(false);
        if (data.length === 1) {
          fillUserData(data[0].username, data[0].id, data[0].mdp, data[0].yourFriends === 'undefined' ? "" : data[0].yourFriends);
        } else {
          setFailSignIn(true);
        }
      });
    }
  }

  return (
    <div className="App">

      <header className="App-header" id="header">
        
        <BlockDiv
          top={"0vh"} 
          left={"0vh"} 
          opacity={"0.6"}
          height={"100vh"} 
          width={"100vw"} 
          backgroundColor={"#000"} 
          position={"absolute"} 
          margin={"0%"} 
          padding={"0%"} 
          alignItems={"unset"}
          border={"#c2b280"}
          initiats={""}
        />

        <div>
              

<BlockDiv 
top={"10vh"} 
left={"10vh"} 
height={"80vh"} 
width={"30vw"} 
backgroundColor={"#EBEFD9"} 
position={"absolute"} 
margin={"0%"} 
padding={"1.5%"} 
borderRadius={".125em"}
alignItems={"unset"}
border={"#c2b280"}
initiats={

  <div style={{height:"100%"}}>
    <TextCommon textC="Découvrez un tout nouveau site de messagerie en ligne, super sécurisé grâce à son système de cryptage tellement complexe, que même nous, avons du mal à le comprendre" fontsize="1em" color={"fff"}/>
    <Button onClick={(e) => openLoginSignin(e)} type="submit" variant="primary" size="lg" id="login_button" style={{
      fontSize:"120%",
      margin:"15%",
      paddingLeft:"15%",
      paddingRight:"15%"
    }}>Connexion</Button>
    <div style={{margin:"2%"}}> </div>
    <Button onClick={(e) => openLoginSignin(e)} type="submit" variant="primary" size="lg" id="signin_button" style={{
      fontSize:"120%",
      margin:"6%",
      paddingLeft:"15%",
      paddingRight:"15%"
    }}>Inscription</Button>
  </div>

}
/>

</div> 
    <LogoHome logo={"Darlan"} color={"#f2dcaf"} class={"LogoHomeClass"} position={"absolute"} left={"40vw"} />
      <div style={styleLoginScreen}></div>
        <div style={styleLogin}>
          <div style={styleDiveClose}>
            <Button variant="danger" onClick={closeLoginSignin}>✖</Button>
          </div>
          <div style={styleForm}>
          <Form>
            <Form.Group>
              <Form.Label style={styleFailConnection}>Echec de connexion</Form.Label>
              <Form.Label style={styleFailSignIn}>Echec de l'inscription</Form.Label>
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" placeholder="Enter username" required id="form_username" onKeyUp={(e) => { setFormUsername(e.target.value) } }/>
            </Form.Group>

            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" required id="form_password" onKeyUp={(e) => { setFormPassword(e.target.value) } }/>
            </Form.Group>

            <Button disabled={formButton} variant="success" type="submit" size="lg" style={{fontSize:"100%",marginBottom:"2%",marginTop:"5%",color:""}} onClick={(e) => {e.preventDefault(); logingSigninButton === "Connexion" ? requestLogin() : requestSignin()}}>
              {logingSigninButton}
            </Button>
          </Form>
          </div>
        </div>


      </header>

      </div>
  );
}


export default HomePage;