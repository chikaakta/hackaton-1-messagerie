import React, {useState} from 'react';
import HomePage from "./Component/HomePage"
import MessagePage from './Component/MessagePage'
// import imgHome from './imgHome.png'

const App = () => {
  const [connected, setConnectionState] = useState(false);
  const [userData, setUserData] = useState({
    username: "",
    userId: "",
    password: "",
    friends: [],
  });

  const userInformation = (name, id, password, friends) => {
    setUserData({
      username: name,
      userId: id,
      password: password,
      friends: friends.split(','), 
    });
    setConnectionState(true);
  }

  return(
    <div>
      <div style={{display: connected ? "none" : "block"}}>
        
        <HomePage fillUserData={userInformation}/>
      </div>
      <div style={{display: connected ? "block" : "none"}}>
        <MessagePage user={userData}/>
      </div>
    </div>
  );
}

export default App;