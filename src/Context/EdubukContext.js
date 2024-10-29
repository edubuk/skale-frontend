import React,{createContext, useState,useEffect} from 'react'
import { connectWallet,connectingWithContract } from '../Utils/apiFeature'
import toast from 'react-hot-toast';
export const EdubukContexts = createContext();
export const EdubukProvider = ({children}) => {
    const [account, setAccount] = useState(null);
    const [studentName, setStudentName] = useState("");
    const [openSidebar, setOpenSidebar] = useState(false);
    const [loading,setLoading] = useState(false);
    const [chainId, setChainId] = useState(null);

    const fetchData = async()=>{
        try {
            const connectedAcc = await connectWallet();
            setAccount(connectedAcc);
            console.log("Connected Account : ",connectedAcc);
        } catch (error) {
            console.log("Error in fetchdata : ",error);
        }
    }

    const getConnectedChainId = async () => {
        if (typeof window.ethereum !== 'undefined') {
          try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const currChainId = await window.ethereum.request({ method: 'eth_chainId' });
            setChainId(parseInt(currChainId, 16));
        } catch(error) {
          toast.error('something went wrong !')
        }
    }else
    {
        toast.error("Metamask is not installed");
    }
      };
    
    useEffect(()=>{
        fetchData();
        getConnectedChainId();
    },[])
  return (
    <EdubukContexts.Provider
    value = {{connectWallet,
    connectingWithContract,
    loading,
    setLoading,
    setAccount,
    account,
    studentName,
    setStudentName,
    openSidebar,
    chainId,
    setOpenSidebar}}
    >
        {children}
    </EdubukContexts.Provider>
  )
}

