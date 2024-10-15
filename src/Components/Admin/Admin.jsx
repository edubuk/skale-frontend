import React, { useContext, useState } from 'react'

import InsReg from './InsRegistration/InsReg';
import { EdubukContexts } from '../../Context/EdubukContext';
import RevokInst from './InsRegistration/RevokInst';
import NotAuthorized from '../Error/NotAuthorized';
import InstituteList from './InsRegistration/InstituteList';
import toast from 'react-hot-toast';
import SmallLoader from '../SmallLoader/SmallLoader';

const Admin = () => {
    const [openPage, setOpenPage] = useState(true);
    const [openRevokePage, setOpenRevokePage] = useState(true);
    const [instituteList, setInstituteList] = useState([]);
    const {account,connectingWithContract, loading, setLoading} = useContext(EdubukContexts)
    
    const adminAcc = process.env.REACT_APP_ADMIN?.toLowerCase();
    const currAccount = account?.toLowerCase();

    const getInstitute = async()=>{
      try {
        setLoading(true);
        const contract = await connectingWithContract();
        const list = await contract.getInstituteList();
   
        setInstituteList(list);
        setLoading(false);
        console.log("institutee List : ",instituteList);

      } catch (error) {
        setLoading(false);
        toast.error("Something went wrong")
        console.log("error while fetching institute list ",error);
      }
    }

    const instituteListHandler = ()=>{
      setOpenPage(false);
      setOpenRevokePage(true);
      getInstitute();
    }


  return (
    <div className='container'>
    {
      adminAcc!==currAccount?<NotAuthorized />:
      <>
      <div className='btn'>
        <button className ={openPage && openRevokePage?"btn-1":''} onClick={()=>{setOpenPage(true);setOpenRevokePage(true);}}>Register Institute</button>
        <button className ={!openPage && openRevokePage?"btn-2":''} onClick={instituteListHandler}>Institute List</button>
        <button className ={!openRevokePage?"btn-3":''} onClick={()=>{setOpenRevokePage(false)}}>Remove Institute</button>
      </div>
      <div>
      {openRevokePage?
        <>
      <div className={`page ${openPage ? 'slide-in-left' : 'slide-out-left'}`}>
          {openPage && <InsReg />}
        </div>
        {
          !loading?
        <div className={`page ${!openPage ? 'slide-in-left' : 'slide-out-left'}`}>
          {!openPage && <InstituteList instituteList= {instituteList}/>}
        </div>:<SmallLoader />
        }
        </>:<div className={`page ${!openRevokePage ? 'slide-in-left' : 'slide-out-left'}`}>
          {!openRevokePage && <RevokInst />}
        </div>
      }
      </div>
      </>
    }
    </div>
  )
}

export default Admin
