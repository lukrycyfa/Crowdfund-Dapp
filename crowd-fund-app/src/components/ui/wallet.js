import { Popover, Spacer, Avatar, Loading, Button, Link } from "@nextui-org/react";
import { truncateAddress, formatBigNumber } from "../../utils";
import Jazzicon from 'react-jazzicon';
import {IconExternalLink, IconHamburger, IconLogout } from "../icons/Icons";



const Wallet = ({address, balance, symbol, disconnect}) => {

  if (address) {
    return(<>
            <Popover>
            <Popover.Trigger>
              <Button auto flat>            
                {balance ? (<>
                  <Avatar icon={<Jazzicon diameter={35} seed={parseInt(address.slice(2, 10), 16)} />}/>   
                  <Spacer y={0.5} />
                  {formatBigNumber(balance)} <span className="ms-1"> {symbol}</span>
                </>):(<Loading />)}
                  <Spacer y={0.5} />
                <IconHamburger/>
              </Button>
            </Popover.Trigger>
            <Popover.Content>
              <Button as={Link} href={`https://alfajores-blockscout.celo-testnet.org/address/${address}/transactions`} target="_blank" rel="noopener noreferrer" shadow color="secondary">
                <IconExternalLink/>
                <Spacer y={2} />
                <span>{truncateAddress(address)}</span> 
              </Button>
                <Spacer x={0.5} />   
              <Button size="md" shadow color="secondary" onPress={() => {disconnect()}}>
                <IconLogout/> 
                <Spacer y={2} />  
                  Disconnect
              </Button>
            </Popover.Content>
          </Popover>    
    </>)
  }
  return null;
};

export default Wallet;  