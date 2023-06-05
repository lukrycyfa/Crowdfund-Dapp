import React,  {useEffect, useCallback} from "react";
import PropTypes  from "prop-types";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Notification = ({Text, Bool}) => {
    const Error = useCallback( async () =>{
    toast.error(`${Text}`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        });
    },[Text])    
    
    const Success = useCallback( async () =>{
        toast.success(`${Text}`, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            })  
    },[Text])  

    useEffect(()=>{
        try{
            if(Bool){
                Success();
                console.log("Notify", Bool, Text);
            } else{
                Error();
                console.log("Notify", Bool, Text);
            }
        } catch (error){
            console.log(error)
        }
    
    },[Bool, Success, Error, Text])        

 return(
    <>
    <div>
    <ToastContainer
        position="top-center"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme= "dark"
    />
    </div>
    </>
 )   

} 

Notification.prototype = {
    Text: PropTypes.string.isRequired,
    Bool: PropTypes.instanceOf(Boolean)
}
Notification.defaultProps = {
    Text: "",
    Bool: null   
}
export default Notification;