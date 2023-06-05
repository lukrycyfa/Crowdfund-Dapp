import React from "react";
import { Loading } from "@nextui-org/react";


const Load = () =>{
 
    return(<>
        <div style={{ display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"}}>
          <Loading
            type="points"
            size="xl"
            color="secondary"/>
        </div>
    
    </>)    
}

export default Load;

