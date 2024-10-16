import React, { useContext, useState } from 'react';
import './holder.css'; // Import the CSS file
import Model from './Model';
import { EdubukContexts } from '../../Context/EdubukContext';
import toast from 'react-hot-toast';

const Documents = ({studentData}) => {
    const [openModal, setOpenModal] = useState(false);
    const {connectingWithContract} = useContext(EdubukContexts);
    const [externalAdd, setExternalAdd] = useState("");
    const [currUri, setCurrUri] = useState("");
    const [isShareBtn, setShareBtn] = useState(true);
    const [openManageAccess, setOpenManageAccess] = useState(true);

    const handleValueChange = (value) => {
      setExternalAdd(value); 
    };

    const shareAccess = async()=>{
      try {
        const contract = await connectingWithContract();
        await contract.giveAccess(externalAdd,currUri);
        toast.success(`Access granted to ${externalAdd?.slice(0,10)}...`)
      } catch (error) {
        toast.error("Error while providing access");
        console.log("Error while providing access ",error);
      }
    }
    const revokeAccess = async()=>{
      try {
        const contract = await connectingWithContract();
        await contract.revokeAccess(externalAdd,currUri);
        toast.success(`Access revoked from ${externalAdd?.slice(0,10)}...`)
      } catch (error) {
        toast.error("Error while providing access");
        console.log("Error while providing access ",error);
      }
    }


  return (
    <div className="card-grid">
      {studentData?.map((uri,i) => (
        <div className="card" key={i+1}>
        <div className='card-header'>
          <h3>Doc {i+1}</h3>
          <div className='card-header-btn'>
          <button onClick={()=>{setOpenModal(true);setCurrUri(uri);setShareBtn(true)}}>share</button>
          <button onClick={()=>{setOpenModal(true);setCurrUri(uri);setShareBtn(false)}}>manage access</button>
          </div>
        </div>
        <a
              href={`https://edubuk-skale-server.vercel.app/api/v1/getDocByUri/${uri}`}
              target="_blank"
              rel="noreferrer"
            >
              View Certificate
            </a>
        </div>
        
      ))}
      {
            openModal && <Model 
            setOpenModal={setOpenModal} 
            onValueChange={handleValueChange}
            shareAccess = {shareAccess}
            revokeAccess= {revokeAccess}
            isShareBtn = {isShareBtn}
            currUri = {currUri}
            />
        }
    </div>
  );
};

export default Documents;
