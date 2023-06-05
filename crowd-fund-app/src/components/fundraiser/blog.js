import React, { useState, useCallback, useEffect } from "react";
import { useCelo } from "@celo/react-celo";
import PropTypes from "prop-types";
import { Card, Button, Textarea, Modal, Text, Spacer, Row, Avatar } from "@nextui-org/react";
import { GetBlogs, GetLike } from "../../utils/callFundRaiser";
import { IconStarFourPoints, IconBlog, IconCloseCircleFill, IconThumbsUpDown} from "../icons/Icons";
import { truncateAddress } from "../../utils";
import Notification from "../ui/notification";
import Jazzicon from 'react-jazzicon';
import Load from "../ui/loading";
import Address from '../../artifacts/Address.json';
import FundRaiser from '../../artifacts/FundRaiser.json';


const AllBlogs = ({fundRaiser}) => {
  const { address, performActions } = useCelo();
  const [loading, setLoading ] = useState(false);
  const [post, setPost] = useState(""); 
  const [blogs, setBlogs] = useState([]);
  const [validpost, setValidPost] = useState(false);
  const [postlikes, setPostlikes] = useState([])
  const [notify, setNotify] = useState(null);
  const [visible, setVisible] = useState(false);

  const handler = () => setVisible(true);
  const closeHandler = () => setVisible(false);

  const isFormFilled =() => post && validpost;
    
  // Call made to contract for creating a newpost 
  const newPost = async (post) =>{
    try{
      console.log(address)
      setLoading(true)
        await performActions( async (k) =>{
          const slug = `${post.slice(0, 16)}...`;
          const fundRaiser = new k.connection.web3.eth.Contract(FundRaiser.abi, Address.address);
          const _post = await fundRaiser.methods.NewPost(post, slug).send({from:k.connection.defaultAccount});                
          console.log(_post.transactionHash);
      })
        const _blg = await GetBlogs(fundRaiser);
        const _newpst = _blg[_blg.length - 1]
        await getLiked(_newpst[0], (_blg.length - 1));
        setBlogs((oldArray) => [...oldArray, _newpst]);
        setNotify(<Notification Text="Your New Post Was Added Successfully" Bool={true}/>)
    } catch (error){
        console.log(error);
        setNotify(<Notification Text={`Error Encountered While Adding New Post${error.message}`} Bool={false}/>)
    } finally{
      setLoading(false)
    }
  }

  // Call made to contract for  getting like status on a post
  const getLiked = useCallback( async (postId, idx) =>{
    try{
        setLoading(true);
        const _bool = await GetLike(fundRaiser, postId, address);
        var _arr = postlikes
        if(_arr[idx] !== _bool){
          _arr[idx] = _bool;
          setPostlikes(_arr);
        return;
        }            
        return; 
    } catch (error){
        console.log(error);
    } finally{
      setLoading(false);
    }
  },[fundRaiser, postlikes, address])

  // Call made to contract to like a newpost
  const like$unlike = async (postId) =>{
    try{
        setLoading(true)
        await performActions( async (k) =>{
          const fundRaiser = new k.connection.web3.eth.Contract(FundRaiser.abi, Address.address);
          const _verify = await fundRaiser.methods.LikeandUnlikePost(postId).send({from:k.connection.defaultAccount});
          console.log(_verify.transactionHash);
      })
        await getBlogs();
        setNotify(<Notification Text={"like Status Updated"} Bool={true}/>);
    } catch (error){
        console.log(error);
        setNotify(<Notification Text="Error Encountered While Updating Like Status" Bool={false}/>);
    }finally{
      setLoading(false);
    }
  }

  // Call made to contract for deleting a post
  const deletePost = async (postId) =>{
    try{
        setLoading(true)
        await performActions( async (k) =>{
          const fundRaiser = new k.connection.web3.eth.Contract(FundRaiser.abi, Address.address);
          const _dpost = await fundRaiser.methods.DeletePost(postId).send({from:k.connection.defaultAccount});                 
          console.log(_dpost.transactionHash)
      })
        await getBlogs();
        setNotify(<Notification Text={"Deleted Post"} Bool={true}/>)
    } catch (error){
        console.log(error);
        setNotify(<Notification Text="Error Encountered While Deleting Post" Bool={false}/>)
    }finally{
      setLoading(false);
    }
  }

  // Call made to contract to return array of blogs
  const getBlogs = useCallback( async () =>{
    try{
        setLoading(true)
        const _blog = await GetBlogs(fundRaiser);
        setBlogs(_blog);
        if( _blog.length === 0) return;
        for(let i=0; i < _blog.length; i++){
          await getLiked(_blog[i][0], i);
        }
        return;
    } catch (error){
        console.log(error);
    } finally{
      setLoading(false);
    }
  },[fundRaiser, getLiked]);
  
  useEffect( () => {
    if(fundRaiser){ 
      getBlogs();
    }
  },[getBlogs, fundRaiser,])

  return(
    <>
      {!loading ?(<>
        {notify}
        <Card css={{ p: "$14"}}>
          <Card.Header>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
                <Button auto ghost shadow color="secondary" onPress={handler} icon={<IconBlog/>}> 
                New Post
                </Button>
              </div>
          </Card.Header>
          <Card.Body>
            {blogs.map((blg, idx)=>(              
              <div key={idx}>
                <Row >
                  <Card css={{ $$cardColor: '$colors$primary' }}>
                    <Card.Header>
                      <Avatar squared icon={<Jazzicon diameter={35} seed={parseInt(address.slice(2, 10), 16)} />}/>
                      <Spacer y={0.2}/>   
                      <Text h2 size={20} css={{textGradient: "45deg, $blue600 -20%, $pink600 50%"}} weight="bold">
                        Author
                      </Text>
                      <Spacer y={0.5}/>
                      <Text h2 size={22} css={{textGradient: "45deg, $blue600 -20%, $pink600 50%"}} weight="bold">
                        {truncateAddress(blg[1])}
                      </Text>
                      <Spacer y={0.5}/>
                      <Text h2 size={22} css={{textGradient: "45deg, $blue600 -20%, $pink600 50%"}} weight="bold">
                        {blg[3]}
                      </Text>                
                    </Card.Header>
                    <Card.Body>
                      <Text h6 size={15} css={{ m: 3, p: "$10" }}>
                        {blg[2]}
                      </Text>
                    </Card.Body>
                    <Card.Footer>
                        <Row> 
                          {postlikes[idx] ?(<>
                            <Button icon={<IconThumbsUpDown/>} onPress={()=> like$unlike(blg[0])} size="xs" ghost shadow color="gradient">
                              <Spacer y={0.5}/>
                              <Text b size={15}>
                                {blg[4]} liked 
                              </Text> 
                            </Button>
                          </>):(<>
                            <Button icon={<IconThumbsUpDown/>} ghost onPress={()=> like$unlike(blg[0])} size="xs" color="gradient">
                              <Spacer y={0.5}/>
                              <Text b size={15}>
                              {blg[4]} like
                              </Text>
                            </Button>
                          </>)}
                          <Spacer x={1}/>
                          {address.toUpperCase() === blg[1].toUpperCase() && 
                            (<>
                            <Button  onPress={()=> deletePost(blg[0])} ghost shadow size="xs" color="error">
                              <Text b size={15}>
                              Delete
                              </Text>
                            </Button>
                            </>)}
                        </Row>
                    </Card.Footer>
                  </Card>
                </Row>
                <Spacer x={1}/>
              </div>
            ))}      
          </Card.Body> 
        </Card> 
        <div>           
          <Modal preventClose closeButton animated={false} width="600px" aria-labelledby="modal-title" open={visible} onClose={closeHandler}>
            <Modal.Header>
              <Text id="modal-title" size={18}>
                <Text b size={18}>
                  New Post
                </Text>
              </Text>
            </Modal.Header>
            <Modal.Body>
              <Textarea
                onChange={(e)=>{ setPost(e.target.value);
                  setValidPost(e.target.value.length > 0);
                }}
                underlined
                color="primary"
                labelPlaceholder="Underlined Textarea"
              />
            </Modal.Body>
            <Modal.Footer>
              <Button auto flat color="error" onPress={closeHandler} icon={<IconCloseCircleFill/>}>
                Close
              </Button>
              <Button disabled={!isFormFilled} auto onPress={ () => {newPost(post); closeHandler(); }} icon={<IconStarFourPoints/>}>
                Post
              </Button>
            </Modal.Footer>
          </Modal>
        </div> 
      </>):(<><Load/></>)}
    </>
  );   
}

AllBlogs.propTypes = {
    fundRaiser: PropTypes.instanceOf(Object)
}

export default AllBlogs;