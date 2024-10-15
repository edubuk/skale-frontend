import React,{createContext, useState,useEffect} from 'react'
import { connectWallet,connectingWithContract } from '../Utils/apiFeature'

export const EdubukContexts = createContext();
export const EdubukProvider = ({children}) => {
    const [account, setAccount] = useState("");
    const [studentName, setStudentName] = useState("");
    const [openSidebar, setOpenSidebar] = useState(false);
    const [loading,setLoading] = useState(false);

    const fetchData = async()=>{
        try {
            const connectedAcc = await connectWallet();
            setAccount(connectedAcc);
            console.log("Connected Account : ",connectedAcc);
        } catch (error) {
            console.log("Error in fetchdata : ",error);
        }
    }
    
    useEffect(()=>{
        fetchData();
        
    },[])
  return (
    <EdubukContexts.Provider
    value = {{connectWallet,
    connectingWithContract,
    loading,
    setLoading,
    account,
    studentName,
    setStudentName,
    openSidebar,
    setOpenSidebar}}
    >
        {children}
    </EdubukContexts.Provider>
  )
}

