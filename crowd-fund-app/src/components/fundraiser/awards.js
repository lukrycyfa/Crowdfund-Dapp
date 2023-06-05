import React, { useState, useEffect } from "react";
import PropTypes  from "prop-types";
import { Card, Grid, Text, Row, Col } from "@nextui-org/react";
import { IconArrowBigRightLines, IconArrowBigLeftLines} from "../icons/Icons";
import { truncateAddress } from "../../utils";
import Carousel from 'react-material-ui-carousel';
import Load from "../ui/loading";
import '../css/carousel.css';


const DisplayAwards = ({myAwards}) =>{

    const [loading, setLoading ] = useState(false);
    const [myawards, setMyawards] = useState([]);

    useEffect(()=>{
        try{
            setLoading(true);
            if(myAwards){
                setMyawards(myAwards)
            }
        } catch (error){
            console.log(error)
        } finally{
            setLoading(false);
        }
    },[myAwards])

    return(<>
            {!loading ?(<>                    
                    <Grid.Container gap={2} justify="center" alignItems='center' alignContent='center'> 
                        <Carousel className="car" PrevIcon={<IconArrowBigLeftLines/>} NextIcon={<IconArrowBigRightLines/>}>
                            {myawards.map((awd, idx) => (     
                                <Grid xs={12} md={12} key={idx}> 
                                <Card css={{ w: "100%", h: "500px" }} isPressable>
                                    <Card.Header css={{ position: "absolute", zIndex: 1, top: 5 }}>
                                        <Col>
                                            {awd.attributes.map((atr, indx)=>(                                
                                                <Text size={12} key={indx} weight="bold" transform="uppercase" css={{textGradient: "45deg, $blue600 -20%, $pink600 50%"}}>
                                                    <span>{atr.trait_type}{"  "}</span>
                                                    <span>{atr.value}</span>
                                                </Text>              
                                            ))}
                                            <Text size={12} key={awd.attributes.length} weight="bold" transform="uppercase" css={{textGradient: "45deg, $blue600 -20%, $pink600 50%"}}>
                                                    <span>{"TokenID:  "}{awd.tokenID}{"  "}</span>
                                                    <span>{"  "}{"Owner:  "}{truncateAddress(awd.owner)}</span>
                                            </Text> 
                                        </Col>
                                    </Card.Header>
                                    <Card.Body css={{ p: 0 }}>
                                        <Card.Image src={awd.image} width="100%" height="100%" objectFit='fill' alt={awd.imgName}/>
                                    </Card.Body>
                                    <Card.Footer isBlurred css={{position: "absolute", bgBlur: "#ffffff66", borderTop: "$borderWeights$light solid rgba(255, 255, 255, 0.2)", 
                                            bottom: 0, zIndex: 1, width:"100%", height:"10%"}}>
                                        <Row>
                                            <Col>
                                                <Text color="#000" size={12}>
                                                    <span>{awd.imgName}</span> 
                                                </Text>
                                                <Text color="#000" size={12}>
                                                    <span>{awd.description}</span>
                                                </Text>
                                            </Col>
                                        </Row>
                                    </Card.Footer>
                                </Card>
                                </Grid>    
                            ))} 
                        </Carousel>                                            
                    </Grid.Container> 
            </>):(<Load/>)}
    </>);
}

DisplayAwards.propTypes = {
        myAwards: PropTypes.instanceOf(Array)
}
export default DisplayAwards;