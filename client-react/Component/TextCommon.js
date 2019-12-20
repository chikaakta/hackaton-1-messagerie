import React from 'react';


const TextCommon = ({textC,fontsize,color}) => {

    const style= {
        fontSize:fontsize,
        color:color,
        textAlign:"center",
        padding:"5%",
        margin:"0"
    }

    return(
        <p style={style}>
            {textC}
        </p>
    );
}

export default TextCommon;