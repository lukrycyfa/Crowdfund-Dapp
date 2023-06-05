import React, { useEffect, useCallback, useState } from "react";
import PropTypes from 'prop-types';
import { Card, Text, Table, Modal, Textarea, Input, Button, Spacer, Row } from "@nextui-org/react";
import { useCelo } from "@celo/react-celo";
import { GetDonors, GetDonations } from "../../utils/callFundRaiser";
import { IconFund, IconHandPointingRight, IconCloseCircleFill, IconFundsFill, IconBitcoincash} from "../icons/Icons";
import { formatBigNumber, truncateAddress, formatCeloValue } from "../../utils";
import { useAccBalance } from '../../hooks';
import Load from "../ui/loading";
import Notification from "../ui/notification";
import Address from '../../artifacts/Address.json';
import FundRaiser from '../../artifacts/FundRaiser.json';


const OnlyOwner = ({fundRaiser }) =>{
    const { address, performActions } = useCelo();
    const [alldonors, setAlldonors] = useState([]);
    const [donations, setDonations] = useState(Object);
    const [loading, setLoading] = useState(false);
    const [witval, setWitval] = useState(0);
    const [validwitval, setValidwitval] = useState(false);
    const [trnadr, setTrnadr] = useState("");
    const [visible, setVisible] = useState(false);
    const [notify, setNotify] = useState(null);
    const { getBalance }= useAccBalance() 


    const isFormFilled = ()=>  witval && validwitval && trnadr;

    const handler = () => setVisible(true);
    const closeHandler = () => setVisible(false);

    // Call made to contract for creating transfer donations
    const tranferDonations = async (adr, value) =>{
        try{
            setLoading(true);
            await performActions( async (k) =>{
                const fundRaiser = new k.connection.web3.eth.Contract(FundRaiser.abi, Address.address);
                const _withdraw = await fundRaiser.methods.TransferDonations(adr).send({from:k.connection.defaultAccount, value:value });                
                console.log(_withdraw.transactionHash);})
            getDonations();
            getBalance();
            setNotify(<Notification Text="Your Funds Were WithDrawn Successfully" Bool={true}/>) 
        }catch(error){
            setNotify(<Notification Text="Error Encountered While Withdrawing Funds" Bool={false}/>) 
            console.log(error)
        }finally{
            setLoading(false);
        }
    }

     // Call made to contract for getting array of donors
    const getDonors = useCallback( async () =>{
        try{
            setLoading(true);
            const _donners = await GetDonors(fundRaiser, address);
            setAlldonors(_donners);
        }catch(error){
            console.log(error)
        }finally{
            setLoading(false);
        }
    },[fundRaiser, address]); 

    // Call made to contract for getting array of donors donations
    const getDonations = useCallback( async () =>{
        try{
            setLoading(true);
            const _donations = await GetDonations(fundRaiser, address)
            setDonations(_donations);
        }catch(error){ 
            console.log(error)
        } finally{
            setLoading(false);
        }
    },[fundRaiser, address]); 


    useEffect(()=>{
        try{
            if(fundRaiser){
              getDonors();
              getDonations();
            }

        } catch(error){
            console.log(error)
        }
    },[fundRaiser, getDonors, getDonations])

    return(<>
        {!loading ?(<>
            {notify}
            <Card css={{ p: "$14"}}>
                <Card.Header>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
                        <div>
                            <Row>
                                <Text h2 size={18} css={{textGradient: "45deg, $blue600 -20%, $pink600 50%",}} weight="bold">
                                Total Donations{"  "}
                                    <Text b size={18}>
                                        {"  "}{formatBigNumber(donations.total)}CELO
                                    </Text>
                                </Text>
                                <Spacer y={1} />
                                <Text h2 size={18} css={{textGradient: "45deg, $blue600 -20%, $pink600 50%",}} weight="bold">
                                Donation Balance{"  "}
                                    <Text b size={18}>
                                        {"  "}{formatBigNumber(donations.balance)}CELO
                                    </Text>
                                </Text>     
                                <Spacer y={1} />
                                <Button auto ghost shadow color="secondary" onPress={handler} icon={<IconFundsFill/>}>
                                    WithDraw Donations
                                </Button>
                            </Row>
                        </div>
                    </div>     
                </Card.Header>
                <Card.Body>
                    <Table bordered lined headerLined shadow={false} color="secondary" aria-label="Example pagination  table" css={{ height: "auto", minWidth: "100%"}}>
                        <Table.Header>
                            <Table.Column>--</Table.Column>
                            <Table.Column>Address</Table.Column>
                            <Table.Column>Times Donated</Table.Column>
                            <Table.Column>Donation</Table.Column>
                        </Table.Header>
                        <Table.Body>
                            {alldonors.map((don, idx)=>(
                                <Table.Row key={idx}>
                                <Table.Cell><IconHandPointingRight/></Table.Cell>  
                                <Table.Cell>{truncateAddress(don.adr)}</Table.Cell>
                                <Table.Cell>{don.donCount}x</Table.Cell>
                                <Table.Cell>{formatBigNumber(don.amount)} CELO</Table.Cell>
                                </Table.Row>
                            ))}  
                        </Table.Body>
                        <Table.Pagination shadow noMargin align="center" rowsPerPage={4} onPageChange={(page) => console.log({ page })}/>
                    </Table>              
                </Card.Body> 
            </Card>
            <div>
                <Modal preventClose closeButton animated={true} aria-labelledby="modal-title" open={visible} onClose={closeHandler}>
                    <Modal.Header>
                        <Text id="modal-title" size={18}>
                            <Text b size={18}>
                            Transfers of funds Above 75% of donations is not allowed
                            </Text>
                        </Text>
                    </Modal.Header>
                    <Modal.Body>
                        <Input clearable bordered fullWidth color="primary" size="lg"
                            placeholder="Withdrawal Value"
                            onChange={(e)=>{setValidwitval(Number(e.target.value > 0)); setWitval(formatCeloValue(e.target.value));}} 
                            contentLeft={<IconBitcoincash />}/>
                        <Spacer x={1} />
                        <Textarea
                            onChange={(e)=>{ setTrnadr(e.target.value);
                            }}
                            underlined
                            color="primary"
                            labelPlaceholder="Enter Address"
                            />
                        <Text>
                        </Text>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button auto flat color="error" onPress={closeHandler} icon={<IconCloseCircleFill/>}> 
                            Close
                        </Button>
                        <Button disabled={!isFormFilled} auto onPress={ () =>{tranferDonations(trnadr.toString(), witval.toString()); closeHandler();} }icon={<IconFund/>}>
                            WithDraw
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div> 
        </>):(<><Load/></>)}
    </>);
}

OnlyOwner.prototype = {
    fundRaiser: PropTypes.instanceOf(Object),
}

export default OnlyOwner;