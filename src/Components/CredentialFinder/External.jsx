import React, { useContext, useState } from 'react';
import { EdubukContexts } from '../../Context/EdubukContext';
import toast from 'react-hot-toast';
import './finder.css'
import SmallLoader from '../SmallLoader/SmallLoader';
const Finder = () => {
    const {connectingWithContract} = useContext(EdubukContexts);
    const [studentAdd, setStudentAdd] = useState("");
    const [uri, setUri] = useState([]);
    const [loading, setLoading] =  useState(false);
    const getRecByExt = async(e)=>{
      e.preventDefault();
      try {
        setLoading(true);
        const contract = await connectingWithContract();
        const URI  = await contract.getRecByExternal(studentAdd);
        console.log("receipt",URI);
        console.log("uri",URI)
        if(URI)
        {
            setUri(URI);
            setLoading(false)
        }
        else{
          toast.error("No records found !");
        }
      } catch (error) {
        toast.error("Error in External section");
        console.log("Error in external section ",error);
        setLoading(false)
      }
    }



  return (
    <div className='external-container'>
    <h1>Request To Access Certified Credential </h1>
    <form className='btn-sec'>
    <div className='input-box'>
    <input type='text' required placeholder='Student Address ' value={studentAdd} onChange={(e)=>setStudentAdd(e.target.value)}></input>
    <label for = "name">Student Address</label>
    </div>
    {
      loading?<SmallLoader />:
    <button onClick={getRecByExt}>Get Record</button>
    }
    </form>
    <div className="card-grid">
      {uri?.map((uri,i) => (
        <div className="card" key={i+1}>
        <div className='card-header'>
          <h3>Doc {i+1}</h3>
          <div className='card-header-btn'>
          </div>
        </div>
          <a
              href={`https://${process.env.REACT_APP_PINATAGATWAY}/ipfs/${uri}`}
              target="_blank"
              rel="noreferrer"
            >
              View Certificate
            </a>
        </div>
      ))}
    </div>
    </div>
  );
};

export default Finder;
