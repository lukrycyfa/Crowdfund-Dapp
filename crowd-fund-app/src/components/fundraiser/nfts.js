import React, { useState, useEffect } from "react";
import PropTypes, { array } from "prop-types";
import {  Card, Grid, Text, Row, Col } from "@nextui-org/react";
import { IconArrowBigRightLines, IconArrowBigLeftLines} from "../icons/Icons";
import Carousel from 'react-material-ui-carousel';
import Load from "../ui/loading";
import '../css/carousel.css';


const DisplayNfts = ({images, imgnames, metadata, pushImg$Mint}) =>{
    const [loading, setLoading ] = useState(false);
    const [imgNames, setImgNames ] = useState([]);
    const [imgs, setImgs ] = useState([]);
    const [allmeta, setAllmeta] = useState(Object);

    useEffect(()=>{
        try{
            setLoading(true);
            if(images && imgnames && metadata){
                setImgNames(imgnames);
                setImgs(images);
                setAllmeta(metadata);
            }
        } catch (error){
            console.log(error)
        } finally{
            setLoading(false);
        }
    },[images, imgnames, metadata])

    return(<>
        {!loading ?(<>        
            <Grid.Container gap={2} justify="center" alignItems='center' alignContent='center'> 
                <Carousel className="car" PrevIcon={<IconArrowBigLeftLines/>} NextIcon={<IconArrowBigRightLines/>}>
                    {imgNames.map((img, idx) => (
                        <Grid xs={12} md={12} key={idx}> 
                        <Card css={{ w: "100%", h: "450px" }} isPressable onPress={()=>{pushImg$Mint(imgs[img].default, img, allmeta[`${img.slice(0,img.indexOf("."))}.json`])}}>
                            <Card.Header css={{ position: "absolute", zIndex: 1, top: 5 }} >
                            <Col>
                                {allmeta[`${img.slice(0,img.indexOf("."))}.json`].attributes.map((atr, indx)=>(
                                    <div key={indx}>
                                        <Row>
                                            <Text size={12} key={indx} b transform="uppercase" css={{textGradient: "45deg, $blue600 -20%, $pink600 50%"}}>
                                                <span>{atr.trait_type}{"  "}</span>
                                                <span>{atr.value}</span>
                                            </Text> 
                                        </Row> 
                                    </div>            
                                ))}
                            </Col>
                            </Card.Header>
                            <Card.Body css={{ p: 0 }}>
                                <Card.Image src={imgs[img].default} width="100%" height="100%" objectFit='fill' alt={allmeta[`${img.slice(0,img.indexOf("."))}.json`].name}/>
                            </Card.Body>
                            <Card.Footer isBlurred css={{position: "absolute", bgBlur: "#ffffff66", borderTop: "$borderWeights$light solid rgba(255, 255, 255, 0.2)", 
                                        bottom: 0, zIndex: 1, width:"100%", height:"9%"}}>
                                <Row>
                                    <Col>
                                        <Text color="#000" size={12}>
                                            <span>{allmeta[`${img.slice(0,img.indexOf("."))}.json`].name}</span> 
                                        </Text>
                                        <Text color="#000" size={12}>
                                            <span>{allmeta[`${img.slice(0,img.indexOf("."))}.json`].description}</span>
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

DisplayNfts.propTypes = {
    images: PropTypes.instanceOf(Object),
    metadata: PropTypes.instanceOf(Object),
    img: PropTypes.instanceOf(array),
    pushImg$Mint: PropTypes.func.isRequired
}

export default DisplayNfts;