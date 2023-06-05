import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useCelo } from "@celo/react-celo";
import { Card, Spacer, Modal,Text, Button, Input, Row, Grid, Avatar } from "@nextui-org/react";
import { importAllImages, importAllMeta, uploadImg, AwardToken, GetMyDonations, MintEligibility, GetMyAwards, GetOwner } from "../../utils/callFundRaiser";
import { IconFund, IconHandPointingRight, IconCloseCircleFill, IconFundsFill, IconBitcoincash } from "../icons/Icons";
import { formatCeloValue, truncateAddress, formatBigNumber } from "../../utils";
import { useContract } from '../../hooks';
import Jazzicon from 'react-jazzicon';
import Notification from "../ui/notification";
import DisplayNfts from "./nfts";
import Load from "../ui/loading";
import DisplayAwards from "./awards";
import AllBlogs from "./blog";
import OnlyOwner from "./owner";
import Address from '../../artifacts/Address.json';
import FundRaiser from '../../artifacts/FundRaiser.json';


const FundWrapper = ({fundRaiser, getBalance}) =>{
    const getImages = require.context('../../NFTS/images', false, /\.(png|jpe?g|svg)$/);
    const getMeta = require.context('../../NFTS/metadata', false, /\.(json)$/);
    const { address, performActions } = useCelo();
    const {images, imgnames} = importAllImages(getImages);
    const  metadata  = importAllMeta(getMeta)
    const [loading, setLoading] = useState(false);
    const [donation, setDonation] = useState(0);
    const [validdonation, setVAlidDonation] = useState(false);
    const [visible, setVisible] = useState(false);
    const [infovisible, setinfoVisible] = useState(false);
    const [owner, setOwner]= useState('');
    const [minteligibilty, setMinteligibility] = useState(false);
    const [mydonation, setMydonation] = useState(Object);
    const [myawards, setMyawards] = useState([]);
    const [notify, setNotify] = useState(null); 
 
    const handler = () => setVisible(true);
    const closeHandler = () => setVisible(false);

    const infoHandler = () => setinfoVisible(true);
    const closeInfoHandler = () => setinfoVisible(false);

    const _abi = useContract();

    const isFormFilled = ()=>  donation && validdonation;

    // Call made to contract to retrive owners address
    const getOwner = useCallback( async () => {
      try{
        setLoading(true);
        const _owner = await GetOwner(fundRaiser);
        setOwner(_owner);
      }catch(error){
        console.log(error)
      }finally{
        setLoading(false);
      }
    },[fundRaiser])

    // Call made to contract to retrive connected account's awards
    const getAwards = useCallback(async()=>{
      try{
        setLoading(true);
        const _awards = await GetMyAwards(fundRaiser, address);
        setMyawards(_awards);
      } catch (error){
          console.log(error)
      } finally{
          setLoading(false);
      }
    },[fundRaiser, address])
  
    /// Call made to contract to retrive connected account's mint eligibility
    const getEligibility = useCallback( async () => {
      try{
        setLoading(true);
        const _eligible = await MintEligibility(address, fundRaiser)
        console.log(_eligible)
        setMinteligibility(_eligible);
      }catch (error){
        console.log(error)
      } finally{
        setLoading(false);
      }
    },[fundRaiser, address])

  // Call made to contract to retrive connected account's donations
  const getMyDoantions = useCallback( async () => {
    try{
      setLoading(true);
      const _owndonations = await GetMyDonations(fundRaiser, address)
      setMydonation(_owndonations)        
    }catch (error){
      console.log(error)
    } finally{
      setLoading(false);
    }
  },[fundRaiser, address])

  // Call made to contract to make donations
  const donate = async (donation) =>{
    try{
        setLoading(true)
        await performActions( async (k) =>{
          const fundRaiser = new k.connection.web3.eth.Contract(FundRaiser.abi, Address.address);
          const _donate = await fundRaiser.methods.Donate().send({from:k.connection.defaultAccount, value:donation });
          console.log(_donate.transactionHash);                              
      })
        getBalance();
        getEligibility();
        getMyDoantions();
        setNotify(<Notification Text="Your Fund Donation Was Made Successfuly" Bool={true}/>)    
    } catch (error){
          console.log(error);
          setNotify(<Notification Text="Error Encountered While Donating Funds" Bool={false}/>)
    } finally{
      setLoading(false);
    }
  }

  // Call made to upload nft metadata and mint tokens. 
  const pushImg$Mint = async (filepath, filename, metadata) =>{
        try{
            setLoading(true)
            const imgUrl = await uploadImg(filepath, filename);
            if(!imgUrl) return;
            const url = await AwardToken(metadata, imgUrl, fundRaiser, address);
            if(!url) return;
            console.log("uploaded")
            await performActions( async (k) =>{
              const fundRaiser = new k.connection.web3.eth.Contract(FundRaiser.abi, Address.address);
              const txn = await fundRaiser.methods.safeMint(url).send({from:k.connection.defaultAccount});
             console.log(txn.transactionHash)
          })
            getEligibility();
            const _awards = await GetMyAwards(fundRaiser, address);
            const _newawd = _awards[_awards.length - 1]
            setMyawards((oldArray) => [...oldArray, _newawd]);
            setNotify(<Notification Text="Your Award Was Minted Successfully" Bool={true}/>)
        } catch (error){
            console.log(error);
            setNotify(<Notification Text="Error Encountered While Minting Award" Bool={false}/>)
       } finally{
        setLoading(false);
       }
  }

  useEffect( ()=>{
    try{
        setLoading(true);
        if (address && fundRaiser){
            getBalance();
            getOwner();
            getMyDoantions();
            getEligibility();
            getAwards();               
        }
    } catch (error){
        console.log(error);        
    } finally{
        setLoading(false);
    }
  },[address, fundRaiser, getBalance, getMyDoantions, getEligibility, getOwner, getAwards])

  if (address){
    return(<>
          {!loading ? (<>              
            {notify}
            <Grid.Container gap={2} justify="center" alignItems='center' alignContent='center'><Grid xs>
              <Text h5 size={20} css={{textGradient: "45deg, $blue600 -20%, $pink600 50%", }} weight="bold">
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
                Making Donations To This Project Will Aid Small I.T Startups, FreeLancing And Encourage The Use Of Celo Technology In The Crypto Ecosystem.
                <br />
                <b></b>
                <Avatar squared icon={<Jazzicon diameter={35} seed={parseInt(address.slice(2, 10), 16)} />}/>
                <Text b size={22}>{truncateAddress(owner)}</Text>
                </div>   
              </Text>
              
            </Grid></Grid.Container>              
            <div>             
              <Modal preventClose closeButton animated={true} aria-labelledby="modal-title" open={visible} onClose={closeHandler}>
                <Modal.Header>
                  <Text id="modal-title" size={18}>
                    <Text b size={18}>Your Support Will Be Much Appriciated</Text>
                  </Text>
                </Modal.Header>
                <Modal.Body>
                  <Input clearable bordered fullWidth color="primary" size="lg"
                    placeholder="Donation"
                    onChange={(e)=>{setVAlidDonation(Number(e.target.value > 0));
                        setDonation(formatCeloValue(e.target.value));}}
                    contentLeft={<IconBitcoincash />}/>
                  <Text>Our Mininmum Donation Is 2 cELO's</Text>
                </Modal.Body>
                <Modal.Footer>
                  <Button auto flat color="error" onPress={closeHandler} icon={<IconCloseCircleFill/>}> 
                    Close
                  </Button>
                  <Button disabled={!isFormFilled} auto onPress={ () =>{donate(donation.toString()); closeHandler();}} icon={<IconFund/>}>
                    Donate
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
            <div>
            <Spacer x={1} />              
              <Modal preventClose closeButton animated={false} aria-labelledby="modal-title" open={infovisible} onClose={closeInfoHandler}>
                <Modal.Header>
                  <Text id="modal-title" size={18}>
                    <Text b size={18}>My Donation</Text>
                  </Text>
                </Modal.Header>
                <Modal.Body>
                  <Row >
                  <IconHandPointingRight/>{"  "}<Text b size={16}> Address:{"  "}{truncateAddress(mydonation.adr)}</Text>
                  </Row>
                  <Row >
                  <IconHandPointingRight/>{"  "} <Text b size={16}>Times Donated:{"  "}{mydonation.donCount}x</Text>
                  </Row>
                  <Row>
                  <IconHandPointingRight/>{"  "}<Text b size={16}> Donation:{"  "}{formatBigNumber(mydonation.amount)} CELO</Text>
                  </Row>
                </Modal.Body>
                <Modal.Footer>
                  <Button auto flat color="error" onPress={closeInfoHandler} icon={<IconCloseCircleFill/>}>
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
          </>):(<Load/>)}
            <Spacer x={1}/>

          {!loading ? (<>           
              {address.toUpperCase() !== owner.toUpperCase() && (<>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
                <div>
                  <Row>
                    <Spacer x={1} />              
                    <Button auto ghost shadow color="secondary" onPress={handler} icon={<IconBitcoincash/>}>
                      Make Donations
                    </Button>
                    <Spacer y={1} />
                    <Button auto ghost shadow color="secondary" onPress={infoHandler} icon={<IconFundsFill/>}>
                      My Donations
                    </Button>
                  </Row>
                </div>
              </div> 
          </>)}</>):(<><Load/></>)}    

          {!loading ? (<>           
          {address.toUpperCase() === owner.toUpperCase() && (<>
              <OnlyOwner fundRaiser={_abi} />
          </>)}</>):(<><Load/></>)} 
            <Spacer x={1} />
          
          {!loading  ? (<>{minteligibilty && address.toUpperCase() !== owner.toUpperCase() && (<>
            <Card css={{ p: "$14"}}>
              <Card.Header>                
                <Text h2 size={20} css={{textGradient: "45deg, $blue600 -20%, $pink600 50%",}} weight="bold">
                  Mintable Awards
                </Text>
              </Card.Header>
              <Card.Body>
                <DisplayNfts images={images} imgnames={imgnames} metadata={metadata} pushImg$Mint={pushImg$Mint}/>   
              </Card.Body> 
            </Card>
          </>)}</>):(<><Load/></>)}
            <Spacer x={1} />

          {!loading ? (<>
            <AllBlogs fundRaiser={_abi}/>
          </>):(<Load/>)}
            <Spacer x={1} />

          {!loading ? (<>
            <Card css={{ p: "$14"}}>
                <Card.Header>                        
                  <Text h2 size={20} css={{textGradient: "45deg, $blue600 -20%, $pink600 50%",}} weight="bold">
                    My Awards
                  </Text>
                </Card.Header>
                <Card.Body>
                  <DisplayAwards myAwards={myawards}/>   
                </Card.Body> 
            </Card>
          </>):(<Load/>)}
            <Spacer x={1} />                
    </>);        
  }  
  return null;
}

FundWrapper.propTypes = {
    fundRaiser: PropTypes.instanceOf(Object),
    getBalance: PropTypes.func.isRequired
}
export default FundWrapper;