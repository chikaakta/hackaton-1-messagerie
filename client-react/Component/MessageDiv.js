import React from 'react';
// import BlockDiv from './BlockDiv'

const MessageDiv = ({sender, text, timestamp,backgroundColor,sideDiv}) => {

    const style = {
        backgroundColor:backgroundColor,
        color:'white',
        minWidth:'20vw',
        borderRadius:'.25em',
        margin:'2%',
        padding:'1%',
        paddingBottom: '0.5%',
    }

    return (
        <div style={style}>
            <p>{text}</p>      
            <h6 style={{color: '#E0E0E0', fontSize: '.6em', marginBottom:"0"}}>{(new Date(timestamp)).toLocaleString().split('GMT')[0]}</h6>
        </div>
    );
}

export default MessageDiv;