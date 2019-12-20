import React from 'react'

const BlockDiv = ({top,left,height,width,minHeight,minWidth,backgroundColor,position,margin,marginTop,padding,borderRadius,opacity,alignItems,backgroundImage,initiats,border,marginRight,color,textAlign,overflowY}) => {

    const style={
        backgroundColor:backgroundColor,
        opacity:opacity,
        height:height,
        width:width,
        top:top,
        left:left,
        position:position,
        margin:margin,
        padding:padding,        
        overflowY:overflowY,
        borderRadius:borderRadius,
        alignItems:alignItems,
        border:border,
        marginRight:marginRight,
        marginTop:marginTop,
        color:color,
        textAlign:textAlign,
        minHeight:minHeight,
        minWidth:minWidth,
        backgroundImage:backgroundImage,
        
    }

    return(
        <div style={style}>
            {initiats}  
        </div>
    );
}

export default BlockDiv;