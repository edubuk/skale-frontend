import { ethers } from 'ethers';
import { EdubukConAdd,EdubukConABI} from '../Context/constant';
const {ethereum} = window;


export const connectWallet = async()=>{
    try {
        if(!ethereum)
            return alert("Please add Metamask extenstion in your browser");
        else
        {
            const accounts = await ethereum.request({
                method:"eth_requestAccounts",
            })
            const firstAcc = accounts[0];
            console.log("account",firstAcc);
            return firstAcc;
        }
        
    } catch (error) {
        console.log(error);
    }
}


const fetchContract = (signer)=> new ethers.Contract(EdubukConAdd,EdubukConABI,signer);

export const connectingWithContract = async()=>{
    try {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = await provider.getSigner();
    const contract = fetchContract(signer);
    return contract;
} catch (error) {
        
}
}