import React from "react";
import PropTypes  from "prop-types";
import logo from '../../logo.svg';
import { Text, Button, Link, Spacer } from "@nextui-org/react";
import '../../App.css';


const Cover = ({connect}) =>{

return(
  <>
    <div className="App">  
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Text size={12} b transform="uppercase">
          Connect To A Metamask Wallet 
        </Text>
        <Spacer x={1}/>
        <Button auto flat color="primary" size="md" rounded onPress={()=>{ connect()}} >
            Connect Wallet
        </Button>
        <Link
          className="App-link"
          href="https://docs.celo.org"
          target="_blank"
          rel="noopener noreferrer">
            <Text size={15} transform="uppercase" css={{textGradient: "45deg, $blue600 -20%, $pink600 50%",}}>
              Visit Celo
            </Text>      
          </Link>
      </header>
    </div> 
  </>
);

}
Cover.prototype ={
    connect: PropTypes.func.isRequired
}

export default Cover;