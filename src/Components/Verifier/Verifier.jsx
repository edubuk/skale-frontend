import React, { useContext, useState } from "react";
import toast from "react-hot-toast";
import Img from '../../assets/img1.gif'
import './verifier.css'
import CryptoJS from "crypto-js";
import { EdubukContexts } from "../../Context/EdubukContext";
import HexToDateTime from "./HexToTime";
import SmallLoader from "../SmallLoader/SmallLoader";


const Verifier = () => {
  const [fileHash, setFileHash] = useState(null);
  const [loader, setLoading] = useState(false);
  const {connectingWithContract } = useContext(EdubukContexts);
  const [inputFile, setInputFile] = useState();
  
const [values, setValues] = useState({
  studentName:"",
  certType:"",
  issuerName:"",
  witness:"",
  uri:"",
  timestamp:"",
})
  //generate hash of a file

  const getHash = (file)=>{
    const reader = new FileReader();

    reader.onload = (e)=>{
      const fileData = e.target.result;
      const wordArray = CryptoJS.lib.WordArray.create(fileData);
      const hash = CryptoJS.SHA256(wordArray).toString();
      setFileHash(hash);
      console.log("hash : ",hash);
    };

    reader.readAsArrayBuffer(file);

  }

  // upload data on blockchain

  const verifyCert = async (e) => {
    e.preventDefault();
    //const currAccount = account.toLowerCase();
    try {
      setLoading(true)
      const contract = await connectingWithContract();
      console.log("contract", contract);
      const data = await contract.Viewcertificatedata(fileHash,{gasLimit: 8000000});
      setLoading(true);
      console.log("verify data",data);
      setLoading(false);
      if(data)
      {
      toast.success("Certificate verified");
      setFileHash("");
      setLoading(false);
      setValues({
        studentName:data[0],
        certType:data[2],
        timestamp:data[6]?._hex,
        issuerName:data[1],
        witness:data[5],
        uri:data[4]
      })
      }
    } catch (error) {
      setLoading(false);
      toast.error("This certificate not registered !");
      console.error("Error in certificate verification: ", error);
    }
  };

   // function to handle input file
   const handleFileChange = (e)=>{
    e.preventDefault();
    const file  = e.target.files?.[0];
    if(file)
    {
      getHash(file);
      setInputFile(file);
    }
  }

  return (
    <div>
    <div className="verify-container">
      <form>
        <h2>Verify Certificates</h2>
        <div className="upload-section">
          <input
            type="file"
            id="fileInput"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
          ></input>
          <label htmlFor="fileInput">
            {
              inputFile?inputFile.name:<span>choose file</span>
            }
          </label>
          {
            loader?<SmallLoader />:
          <button onClick={verifyCert}>Verify Certificate</button>
          }
        </div>
      </form>
    </div>
    {
    values.studentName&&<div class="id-card-wrapper">
        <div class="id-card">
          <div class="profile-row">
            <div class="dp">
              <div class="dp-arc-outer"></div>
              <div class="dp-arc-inner"></div>
              <img src={Img} alt="profile" />
            </div>
            <div class="desc">
            <div className="profile-header">
              <h1>{values.studentName}</h1> 
              <a
              href={`https://${process.env.REACT_APP_PINATAGATWAY}/ipfs/${values?.uri}`}
              target="_blank"
              rel="noreferrer"
            >View Certificate</a>
            </div>
              <p>Certificate Type : <span>{values.certType}</span></p>
              <p>Issued By : <span>{values.issuerName}</span></p>
              <p>Issuer Address : <span>{values.witness?.slice(0,15)}...</span> </p>
              <p>Issued On : <HexToDateTime hexValue={values.timestamp} /></p>
            </div>
          </div>
        </div>
      </div>
    }
    </div>
  );
};

export default Verifier;
