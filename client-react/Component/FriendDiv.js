import React from 'react'
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';


const FriendDiv = ({text, id, updateConversation}) => {

    const style = {
        color:'white',
        margin:'2%',
        padding:'1%',
        textAlign:'left',
        fontSize:'1rem',
        height:"100%",
        width:"100%",
    }

    return (
        <Button style={style} id={id} onClick={() => {updateConversation(id)}}>{text}</Button>
    );
}

export default FriendDiv;