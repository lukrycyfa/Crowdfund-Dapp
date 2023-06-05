import React from 'react';
import { useCelo } from "@celo/react-celo";
import { Container, Navbar, Text, useTheme, Spacer } from '@nextui-org/react';
import  {IconGofundme} from "./components/icons/Icons"; 
import { useAccBalance, useContract } from './hooks';
import Wallet from './components/ui/wallet';
import Cover from './components/ui/cover';
import FundWrapper from './components/fundraiser';



const App = function AppWrapper() {
  const { connect, address, disconnect} = useCelo();
  const { balance, getBalance} = useAccBalance();
  const fundRaiser = useContract();
  const { isDark } = useTheme();


  return (<>
      {address ? (            
        <Container fluid>
          <Navbar shouldHideOnScroll isBordered={isDark} variant="sticky">
            <Navbar.Brand css={{ mr: "$4" }}>
              <IconGofundme />
              <Spacer y={1}/>
              <Text b color="inherit" css={{ mr: "$11" }} hideIn="xs">
                Fund Raiser
              </Text>
            </Navbar.Brand>
            <Navbar.Content>
              <Navbar.Item>
                <Wallet
                address={address}
                balance={balance.CELO}
                symbol="CELO"
                disconnect={disconnect}          
                />
              </Navbar.Item>  
            </Navbar.Content>    
          </Navbar>
    
            <FundWrapper
              fundRaiser={fundRaiser}
              getBalance={getBalance}/>
        </Container>  
        ):(<><Cover
              connect={connect}
            />
      </>)}
  </>);
}

export default App;
