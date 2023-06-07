import axios from "axios";
import Address from '../artifacts/Address.json';
import FundRaiser from '../artifacts/FundRaiser.json';

// Called to import images from the Nft directory
export const importAllImages = (path) =>{
    let images = {};
    let imgnames= []
     path.keys().forEach((item) => { images[item.replace('./', '')] = path(item);
     imgnames.push(item.replace('./', '')); 
    });
    return {images, imgnames}
}

// Called to import images from the metadata directory
export const importAllMeta = (path) =>{
    let metadata = {};
     path.keys().forEach((item) => { metadata[item.replace('./', '')] = path(item);
    });
    return metadata
}  

// Called to import images to ipfs
export const uploadImg = async (filePath, fileName ) =>{
    if (!filePath || !fileName) return;

    const getExt = (fileName) =>{
        return fileName.slice(fileName.indexOf(".")+1, fileName.lenght);
    } 
    const formData = new FormData();
    await fetch(filePath)
    .then(async response => { 
        const ext = getExt(fileName);
        const blob = await response.blob()
        const nfile = new File([blob], fileName, { type:`image/${ext}` })
        formData.append("file", nfile);        
    })

    try {
        // Configure Request To Post Data To Pinata
        const res = await axios.post(
            "https://api.pinata.cloud/pinning/pinFileToIPFS",
            formData,
            {
            maxBodyLength: "Infinity",
            headers: {
                "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
                pinata_api_key: process.env.REACT_APP_API_KEY,
                pinata_secret_api_key: process.env.REACT_APP_SECRET_API_KEY
            },
            }
        );
    
        // Return ArtifactFile  Url
        return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
    } catch (error) {
            console.log(error);
    } 

}

// Called to award tokens to donors
export const AwardToken = async (metaData, imgUrl, fundRaiser, address) =>{
    if (!metaData || !imgUrl) return;

    try{

            const tokenId = await fundRaiser.methods.totalSupply().call();
                                                           
            const awardMeta = {}
            awardMeta['owner'] = address
            awardMeta['tokenId'] = `${parseInt(tokenId)+1}`
            awardMeta['image'] = imgUrl
            awardMeta['imgName'] = metaData['name']
            awardMeta['description'] = metaData['description']
            awardMeta['attributes'] = metaData['attributes']
            var data = JSON.stringify({
                pinataContent: awardMeta
            });
                                                          
            // Configure Request To Post Data To Pinata IPFS
            var config = {
            method: "post",
            url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
                headers: {
                "Content-Type": "application/json",
                    pinata_api_key: process.env.REACT_APP_API_KEY,
                    pinata_secret_api_key: process.env.REACT_APP_SECRET_API_KEY
                },
                data: data,
            };                                                          
            // save Artifact Metadata  metadata to Pinata IPFS
            const res = await axios(config);
            const url = `https://ipfs.io/ipfs/${res.data.IpfsHash}`;

            return url
                                
    } catch (error){
        console.log(error);
    }
}

// Called to get awarded tokens associated with connected account
export const GetMyAwards = async (fundRaiser, address) => {
    try{
        const tokens = []
        const mytokens = await fundRaiser.methods.OwnWallet().call({from:address});

        if (mytokens.length <= 0 ) return Promise.all(tokens);
        for(let i = 0; i < mytokens.length; i++){
            const nft = new Promise(async (resolve) => {
                const res = await fundRaiser.methods.tokenURI(parseInt(mytokens[i])).call();
                const meta = await GetMetaFromIPFS(res);
                resolve({
                  index: parseInt(i),
                  tokenID: meta.data.tokenId,
                  owner: meta.data.owner,
                  image: meta.data.image,
                  imgName: meta.data.imgName,
                  description: meta.data.description,
                  attributes: meta.data.attributes,
                });
            });
            tokens.push(nft);
        }
        return Promise.all(tokens);
    } catch (error){  
       console.log(error);
    }

}

// Called to token metadata from ipfs
export const GetMetaFromIPFS = async (ipfsUrl) =>{
    try{
        if (!ipfsUrl) return null;
        var config = {
          method: "get",
          url: ipfsUrl,
          headers: {
            // Authorization: process.env.REACT_APP_JWT,
          }
        };
        const meta = await axios(config);
        return meta;
    } catch (error){
        console.log(error);
    }
}

// Called to return a array of donors
export const GetDonors =  async (fundRaiser, address) =>{
    try{
      const Donors = [] 
      const _Dlst = await fundRaiser.methods.DonorAdr().call({from:address});  
      for (let i = 0; i< _Dlst.length; i++){
            var _donor = await fundRaiser.methods.AllDonators(_Dlst[i]).call(); 
            Donors.push(_donor);
      }
      return Donors;        
    } catch (error){
        console.log(error);
    }

}

// Called to get connected accounts donations
export const GetMyDonations =  async (fundRaiser, address) => {
    try{
        var _donation = await fundRaiser.methods.AllDonators(address).call();
        return _donation;
    }  catch (error){
        console.log(error);
    }

}

// Called to assert if the connected account is allowed to mint a token
export const MintEligibility =  async (address, fundRaiser) =>{
    try{
      var _donor = await fundRaiser.methods.AllDonators(address).call();  
      const _tCount = await fundRaiser.methods.balanceOf(address).call();
      if (_donor[3] > _tCount) return true;
      return false;        
    } catch (error){
        console.log(error);
    }

}

// Called to make donations
export const Donate =  async (performActions, donation) =>{
    try{
        await performActions( async (k) =>{
            const fundRaiser = await new k.connection.web3.eth.Contract(FundRaiser.abi, Address.address);
            const _donate = await fundRaiser.methods.Donate().send({from:k.connection.defaultAccount, value:donation });
            console.log(_donate.transactionHash);                              
        })        
    } catch (error){
        console.log(error);
    }

} 

// Called to witdraw Donations
export const WithdrawDonation =  async (performActions, amount, adr) =>{
    try{
        await performActions( async (k) =>{
            const fundRaiser = await new k.connection.web3.eth.Contract(FundRaiser.abi, Address.address);
            const _withdraw = await fundRaiser.methods.TransferDonations(adr).send({from:k.connection.defaultAccount, value:amount });                
            console.log(_withdraw.transactionHash);
        })
    } catch (error){
        console.log(error);
    }
} 


// Called to get funds donations
export const GetDonations =  async (fundRaiser, address) =>{
    try{
        const _dbalance = await fundRaiser.methods._donationtBalance().call({from:address});
        const _dtotal = await fundRaiser.methods._TotalDonations().call({from:address});
        const _donations = {
            balance:_dbalance,
            total:_dtotal
        }
        return _donations;
    } catch (error){
        console.log(error);
    }

}

// Called to return an array of blogs
export const GetBlogs =  async (fundRaiser) =>{
    try{
        const _blogs = await fundRaiser.methods.ReturnPosts().call();
        return _blogs;
    } catch (error){
        console.log(error);
    }

}

// Called to get the address of the contract owner
export const GetOwner =  async (fundRaiser) =>{
    try{
        const _owner = await fundRaiser.methods.owner().call();
        return _owner;
    } catch (error){
        console.log(error);
    }

}

// Called to get like status of connected account on a post.
export const GetLike =  async (fundRaiser, PostID, address) =>{
    try{
        const _bool = await fundRaiser.methods.ReturnLiked(PostID).call({from:address});
        return _bool;
    } catch (error){
        console.log(error);
    }

}
