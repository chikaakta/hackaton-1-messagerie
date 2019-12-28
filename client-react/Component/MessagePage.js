import React, { useState } from 'react';
import '../App.css';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import BlockDiv from "./BlockDiv";
import MessageDiv from './MessageDiv';
import FriendDiv from './FriendDiv';
import Form from 'react-bootstrap/Form'

const MessagePage = ({user}) => {
  const [messages, setMessages] = useState([]);
  const [formMessage, setFormMessage] = useState('');
  const [formFriend, setFormFriend] = useState('');
  const [friends, setFriends] = useState([]);
  const [currentConversation, setCurrentConversation] = useState('');
  const [RequestFriend,setRequestFriend] = useState(false);
  let messageInput = React.createRef(), friendInput = React.createRef(), friendButton = React.createRef();

  const style={
    top:"85vh",
    left:"10vw",
    width:"49vw",
    position:"absolute",
  }
  const styleSearchBar={
    top:"1%",
    left:"1%",
    width:"90%",
    padding:"2%",
    position:"absolute",
    color:"green",
  }

  const styleUserName={
    color:"white",
    fontSize:"2rem",
    minWidth:"10vw",
  }

  var styleButtonFriend={
    backgroundColor:"white",
    color:'red',
    display: RequestFriend ? 'block' : 'none',
  }
  
  let a = 1;
  
  const fuckText = (str, inc) => {
    var memoryArr = [];
    var fucked = "++++++++++[";
    
    for (let i = 0; i < str.length; i++)
      memoryArr.push(str[i].charCodeAt() + parseInt(inc));
      
    for (let i = 0; i < memoryArr.length; i++) {
      fucked += ">";
      for (let j = 0; j < Math.round(memoryArr[i] / 10); j++)
        fucked += "+";
    }
    
    for (let i = 0; i < memoryArr.length; i++)
      fucked += "<";
    
    fucked += "-]";
    
    for (let i = 0; i < memoryArr.length; i++) {
      let n = memoryArr[i] - (Math.round(memoryArr[i] / 10) * 10);
      if (n > 0) {
        fucked += ">";
        for (let j = 0; j < n; j++)
          fucked += "+";
        fucked += ".";
      } else if (n < 0) {
        fucked += ">";
        for (let j = 0; j > n; j--)
          fucked += "-";
        fucked += ".";
      } else {
        fucked += ">.";
      }
    }
    
    return fucked;
  }

  const simplifyBrainfuck = (str) => {
    let simplified = "";
    let n = 0;

    for (let i = 1; i < str.length; i++){
      if (str[i - 1] === str[i])
        n++;
      else if (n >= 1) {
        simplified += (n + str[i - 1]);
        n = 0;
      } else {
        simplified += str[i - 1];
        n = 0;
      }
    }

    simplified += str[str.length - 1];
    
    return simplified;
  }

  const unsimplifyBrainfuck = (str) => {
    let unsimplified = "";
    let j = 0;

    for (let i = 0; i < str.length; i ++) {
      if (!isNaN(str[i])) {
        j = i;
        let builder = "";

        while (!isNaN(str[j])) {
          builder += str[j]
          j++;
        }
        let c = str[j];

        for (let n = 0; n <= parseInt(builder); n++)
          unsimplified += c;

          i = j;
      } else {
        unsimplified += str[i];
      }
    }

    return unsimplified;
  }
  
  const fixText = (str, inc) => {
    let code = str.replace(/[^-+<>.,[\]]/g, '').split('');
    let data = [];
    let loop = [];
    let cell = 0;
    let next = 0;
    let fixed = "";
    let operation = {
      '>': function () {
        if (~loop[0]) {
          ++cell;
        }
      },
      '<': function () {
        if (~loop[0]) {
          --cell;
        }
      },
      '+': function () {
        if (~loop[0]) {
          data[cell] = (data[cell] || 0) + 1;
        }
      },
      '-': function () {
        if (~loop[0]) {
          data[cell] = (data[cell] || 0) - 1;
        }
      },
      '.': function () {
        if (~loop[0]) {
          //brainfuck.write(data[cell]);
          //console.log(String.fromCharCode(data[cell]));
        }
      },
      '[': function () {
        loop.unshift(data[cell] ? next : -1);
      },
      ']': function () {
        if (~loop[0] && data[cell]) {
          next = loop[0];
        } else {
          loop.shift();
        }
      }
    };

    while (next < code.length) {
      operation[code[next++]]();
    }
    
    for (let i = 1; i < data.length; i++)
      fixed += String.fromCharCode(data[i] - parseInt(inc));
      
    return fixed;
  }

  const messageToSend = () => {
    if (messageInput.current.value != '') {
      fetch("http://yourIpAdress/api/sendmessages.php", {
        method: 'POST', 
        body: `{"sender": "${user.userId}", "receiver": "${currentConversation}", "content": "${simplifyBrainfuck(fuckText(formMessage, user.userId % 255))}"}`
      }).then(response => response.json())
      .then(data => {
        console.log(data);
        if (data.MESSAGE === 'SAVE DATA SUCCED') {
          updateConversation(currentConversation);
        }
      });
    }
    messageInput.current.value = '';
    setFormMessage('');
  }

  const newMessages = (newMessages) => {
    setMessages([...newMessages]);
  }

  const sortMessages = (jsonArray) => {
    let timestampArray = [];
    let sortedJsonArray = [];

    for (let i = 0; i < jsonArray.length; i++) 
      timestampArray.push(jsonArray[i].timesent);

    timestampArray.sort().reverse();

    for (let i = 0; i < timestampArray.length; i++) {
      let j = 0;
      while (timestampArray[i] !== jsonArray[j].timesent)
        j++;
      sortedJsonArray.push(jsonArray[j]);
    }

    return sortedJsonArray;
  }

  const updateConversation = (friendId) => {
    setCurrentConversation(friendId);
    fetch("http://yourIpAdress/api/receivemessages.php", {
        method: 'POST', 
        body: `{"username": "${user.username}", "mdp": "${user.password}", "id": "${user.userId}", "friend": "${friendId}"}`
      }).then(response => response.json())
      .then(data => {
        data = sortMessages(data);
        let nM = [];
        for (let i = 0; i < data.length; i++) {
          let usr = data[i].sender;
          let txt = fixText(unsimplifyBrainfuck(data[i].content), data[i].sender % 255);
          let tsp = data[i].timesent * 1000;

          nM.push({ sender: usr, content: txt, timestamp: tsp});
        }
        newMessages(nM);
        
      });
  }
  
  const searchFriend = () => {
    if (friendInput.current.value !== '') {
      fetch("http://yourIpAdress/api/addfriend.php", {
          method: 'POST', 
          body: `{"username": "${user.username}", "mdp": "${user.password}", "friend": "${formFriend}"}`
        }).then(response => response.json())
        .then(data => {
          if (data.MESSAGE === 'AMIS DEJA AJOUTE') {
            setRequestFriend(true);
            setTimeout(() => setRequestFriend(false), 3000);
          } else if (data.MESSAGE === 'AMIS AJOUTE') {
            setRequestFriend(false);
          } else if (data.MESSAGE === 'UTILISATEUR INCONNU') {
            setRequestFriend(true);
            setTimeout(() => setRequestFriend(false), 3000);
          }

          getFriends();
        });
    }
    friendInput.current.value = '';
    setFormFriend('');
  }

  const getFriends = () => {
    let friendArray = [];
    fetch("http://yourIpAdress/api/myfriends.php", {
        method: 'POST', 
        body: `{"username": "${user.username}", "mdp": "${user.password}"}`      
      }).then(response => response.json())
      .then(data => {
        console.log(data);
        for (let i = 0; i < data.length; i++) {
          friendArray.push({ id: data[i].id, name: data[i].username });
        }
        setFriends(friendArray);
      });
  }

  if (user.username !== '' && friends.length === 0) {
    getFriends();
  }

  return (
  
    <header>
      <div style={{backgroundImage: "url(https://cdn.discordapp.com/attachments/656417422315618305/657612061013966849/55b7a7ee.png)"}}>
        <BlockDiv //Fond de couleur
          top={"0vh"} 
          left={"0vh"} 
          height={"100vh"} 
          width={"100vw"} 
          //backgroundColor={"blue"}
          margin={"0%"} 
          padding={"5%"} 
          alignItems={"unset"}
          initiats={""}         
        />

        <BlockDiv //Block des messages
          top={"5vh"} 
          left={"5vh"} 
          height={"90vh"} 
          width={"70vw"} 
          backgroundColor={"#21659f"} 
          position={"absolute"} 
          margin={"0%"}           
          padding={"1%"} 
          alignItems={"unset"}
          border={'10px solid #21659f'}
          initiats=
            {<BlockDiv 
              top={"0vh"} 
              left={"0vh"} 
              height={"85%"} 
              width={"100%"} 
              backgroundColor={"#cdc8ac"} 
              position={"absolute"} 
              margin={"0%"}           
              overflowY={"scroll"}
              padding={"1%"} 
              alignItems={"unset"}
              initiats=
              {messages.map((item, i) => (
                <MessageDiv //Le message
                  key={'message_' + i}
                  // sender={item.sender} //Doit rester invisible
                  text={item.content}
                  sideDiv={(item.sender === user.userId) ? "50%" : ""}
                  backgroundColor={(item.sender === user.userId) ? "#0080ff" : "#004480"}
                  timestamp={item.timestamp} />))}
                  />}
                />

            <InputGroup size="lg" className="mb-3" style={style}> {/*La barre pour écrire son message*/}
              <FormControl ref={messageInput}
                placeholder="Tap here ..."
                aria-label="Text to send"
                aria-describedby="basic-addon2"
                id="message"
                onKeyPress={(e) => {e.key === 'Enter' ? messageToSend() : a = a }}
                onKeyUp={(e) => {setFormMessage(e.target.value)}}
                onKeyDown={(e) => {e.key === 'Escape' ? getFriends() : a = a}} />
              <InputGroup.Append>
                <Button variant="secondary" onClick={() => {messageToSend()}}>Send</Button>
              </InputGroup.Append>
            </InputGroup>



          <BlockDiv //Block Username
            top={"5vh"} 
            left={"75vw"} 
            height={""} 
            width={""} 
            minHeight={"10vh"}
            minWidth={"5vw"}
            backgroundColor={"#21659f"} 
            position={"absolute"} 
            margin={"0%"} 
            marginRight={"5vw"}
            padding={"1%"} 
            alignItems={"unset"}
            border={"20px"}
            initiats={<div style={styleUserName}>
              {user.username}
              </div>} />

            <BlockDiv //Block Friends
            top={"20vh"} 
            left={"75vw"} 
            height={"50vh"} 
            width={"10vw"} 
            minHeight={"50vh"}
            minWidth={"20vw"}
            backgroundColor={"#21659f"} 
            position={"absolute"} 
            margin={"0%"} 
            marginRight={"5vw"}
            padding={"1%"} 
            alignItems={"unset"}
            border={"20px"}
            overflowY={"scroll"}
            initiats={
              <div>
                <BlockDiv 
                  top={"0%"} 
                  height={"30%"}
                  minWidth={"20%"} 
                  class={"divSearchBarFriends"} /*Barre de recherche des amis*/
                  initiats={
                    <div>
                  <InputGroup size="lg" className="mb-3" style={styleSearchBar}>
                    <FormControl ref={friendInput}
                      placeholder="Ajouter un ami"
                      aria-label="Text to send"
                      aria-describedby="basic-addon2"
                      id="message"
                      onKeyPress={(e) => {e.key === 'Enter' ? searchFriend() : a = a }}
                      onKeyUp={(e) => {setFormFriend(e.target.value)}} />
                    <InputGroup.Append>
                      <Button ref={friendButton} variant="secondary" onClick={() => {searchFriend()}}>Send</Button>
                    </InputGroup.Append>
                    <Form.Label style={styleButtonFriend}>Vous êtes déjà ami ou l'utilisateur n'existe pas</Form.Label>
                  </InputGroup>
                  </div>
                  }/>

                <BlockDiv 
                  display={'inline-block'}
                  color={"white"}
                  fontSize={"2rem"}
                  minHeight={"50vh"}
                  minWidth={"10vw"}
                  scrollviewY={"scroll"}
                  top={"40%"}
                  width={"100%"}
                  marginTop={"30%"}
                  class={"divFriendsButtons"} /*Les amis*/
                  initiats={
                    <div>
                  {friends.map((item, i) => (
                    <FriendDiv 
                      key={'friend_' + i}
                      text={item.name} 
                      id={item.id}
                      updateConversation={updateConversation} />
                  ))}
                  </div>}
                /> 
               </div>}
              />      
      </div>
    </header>
  );
}

export default MessagePage;