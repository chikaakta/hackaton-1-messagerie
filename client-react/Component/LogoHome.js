import React from 'react';


const LogoHome = ({logo,color,fontFamily,position,left}) => {

    const style= {
        fontFamily:fontFamily,
        fontSize:"10em",
        color:color,
        padding:"7%",
        paddingBottom:"2%",
        margin:"0",
        position:position,
        left:left,
    }
    return(
        <p style={style}>
            {logo}
        </p>
    );
}

export default LogoHome;