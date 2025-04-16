import React, { useContext, useState } from "react";
import toast from "react-hot-toast";
import Img from '../../assets/img1.gif'
import './verifier.css'
import CryptoJS from "crypto-js";
import { EdubukContexts } from "../../Context/EdubukContext";
import HexToDateTime from "./HexToTime";
import SmallLoader from "../SmallLoader/SmallLoader";
import { EdubukConAdd,EdubukConABI} from '../../Context/constant';
import { ethers } from "ethers";

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
  fileHash:"",
  uri:"",
  timestamp:"",
})
  //generate hash of a file

  const EdubukConABI = [
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_hash",
          "type": "string"
        }
      ],
      "name": "viewCertificateData",
      "outputs": [
        { "internalType": "string", "name": "", "type": "string" },
        { "internalType": "string", "name": "", "type": "string" },
        { "internalType": "string", "name": "", "type": "string" },
        { "internalType": "string", "name": "", "type": "string" },
        { "internalType": "string", "name": "", "type": "string" },
        { "internalType": "address", "name": "", "type": "address" },
        { "internalType": "uint256", "name": "", "type": "uint256" }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];

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
      if(!fileHash)
      {
        return toast.error("No file choosen")
      }
      setLoading(true)
      const RPC_URL = "https://mainnet.skalenodes.com/v1/honorable-steel-rasalhague";
      //const EdubukConAdd = "0xfcF386Fb19631248177c90A0e09060E0A2d6157a";
      const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
      const contract = new ethers.Contract(EdubukConAdd, EdubukConABI, provider);
      //const contract = await connectingWithContract();
      console.log("contract", contract);
      const data = await contract.viewCertificateData(fileHash);
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
        fileHash:data[3],
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
        <div className="id-card">
          <div className="profile-row">
            <div className="dp">
              <div className="dp-arc-outer"></div>
              <div className="dp-arc-inner"></div>
              <img src={Img} alt="profile" />
            </div>
            <div className="desc">
            <div className="profile-header">
              <h1>{values.studentName}</h1> 
              <a
              href={`https://edubuk-skale-server.vercel.app/api/v1/getDocByUri/${values.uri}`}
              target="_blank"
              rel="noreferrer"
            >View Certificate</a>
            </div>
              <p>Certificate Type : <span>{values.certType}</span></p>
              <p>Issued By : <span>{values.issuerName}</span></p>
              <p>Issuer Address : <span>{values?.witness?.substring(0, 6)}...{values.witness?.substring(values.witness?.length - 5)}</span> </p>
              <p>File Hash : <span>{values?.fileHash?.substring(0, 8)}...{values.fileHash?.substring(values.fileHash?.length - 8)}</span> </p>
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
