import React, { useContext, useState } from "react";
import "./institute.css";
import toast from "react-hot-toast";
import SmallLoader from "../SmallLoader/SmallLoader";
import { EdubukContexts } from "../../Context/EdubukContext";
import CryptoJS from "crypto-js";

const RegCertValue = {
  studentName: "",
  studentAdd: "",
  certType: "",
  issuerName: "",
};

const PostCert = () => {
  const [fileHash, setFileHash] = useState(null);
  const [uri, setUri] = useState(null);
  const [values, setValues] = useState(RegCertValue);
  const { connectingWithContract,account,loading,setLoading} = useContext(EdubukContexts);
  const [inputFile, setInputFile] = useState();
  const [isTransaction, setTransaction] = useState(false);
  const [uploadLoader,setUploadLoader]= useState(false);
  //upload docs to IPFS
  const jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJlZTJkZGEzOS01MmE3LTQ5MzctOTQ0Zi02NTM4ZGEwNjI2YTkiLCJlbWFpbCI6ImF2ZXJtYTQ5Njk2QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI2YWUyOGIwYjhhNzYzNmQ2NzBlOCIsInNjb3BlZEtleVNlY3JldCI6IjJjZDllYjQ3YjYxN2Q1YmRmMzhjMTcxYzAxMThlMjUyMzkwZDIxNDgyM2I3YTVjNmE0MDg0NzkxZWM1ZDhhNDEiLCJleHAiOjE3NTc0MTI3MzJ9.Ae0rqEyXL70qwev4FzKDQ_KoqVDb9jVgHOT8kowU-Go"
  const uploadToIpfs = async (e) => {
    e.preventDefault();
    try {
      if (!inputFile) {
        return toast.error("No file selected !");
      }
      const formData = new FormData();
      formData.append("file", inputFile);
      setUploadLoader(true);
      console.log("form data : ", formData);
      const response = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          body: formData,
        }
      );

      console.log("data processed")
      const upload = await response.json();
      if (upload?.IpfsHash) {
        toast.success("File uploaded successfully");
        setUri(upload.IpfsHash);
        setUploadLoader(false);
      }
      console.log(upload);
    } catch (error) {
      setUploadLoader(false);
      toast.error("Error in uploading file");
      console.error("Error uploading file:", error);
    }
  };

  //generate hash of a file
  const getHash = (file) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const fileData = e.target.result;
      const wordArray = CryptoJS.lib.WordArray.create(fileData);
      const hash = CryptoJS.SHA256(wordArray).toString();
      setFileHash(hash);
      console.log("hash : ", hash);
    };

    reader.readAsArrayBuffer(file);
  };

  // upload data on blockchain

  const regCert = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const contract = await connectingWithContract();
      const registerCert = await contract.postCertificate(
        values.studentName,
        values.studentAdd,
        uri,
        fileHash,
        values.certType,
        values.issuerName
      );
      setLoading(true);
      await registerCert.wait();
      setLoading(false);
      toast.success("Certificated Posted successfully");
      setTransaction(true)
      setValues("");
    } catch (error) {
      setLoading(false);
      toast.error("Error in certificate Registration", error);
      console.error("Error in certificate Registration: ", error);
    }
  };

  const onChangeHandler = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  // function to handle input file
  const handleFileChange = (e) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (file) {
      getHash(file);
      setInputFile(file);
    }
  };

  return (
    <div className="form-container">
      <form>
        <h2>Issue Single Certificate</h2>
        <div className="input-box">
          <input
            type="text"
            placeholder="Student Name"
            required
            name="studentName"
            value={values.studentName}
            onChange={onChangeHandler}
          ></input>
          <label htmlFor="name">Student Name</label>
        </div>
        <div className="input-box">
          <input
            type="text"
            placeholder="Student Wallet Address"
            name="studentAdd"
            required
            value={values.studentAdd}
            onChange={onChangeHandler}
          ></input>
          <label htmlFor="name">Student Wallet Address</label>
        </div>
        <div className="input-box">
          <input
            type="text"
            required
            placeholder="Certificate Type"
            name="certType"
            value={values.certType}
            onChange={onChangeHandler}
          ></input>
          <label htmlFor="name">Certificate Type</label>
        </div>
        <div className="input-box">
          <input
            type="text"
            required
            placeholder="Issuer Name"
            name="issuerName"
            value={values.issuerName}
            onChange={onChangeHandler}
          ></input>
          <label htmlFo="name">Issuer Name</label>
        </div>
        <div className="upload-section">
          <input
            type="file"
            id="fileInput"
            required
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
          ></input>
          <label htmlFor="fileInput">
            {inputFile ? inputFile.name : <span>choose file</span>}
          </label>
          Accepted:Pdf/jpg/jpeg/png
          {uploadLoader ? (
            <SmallLoader />
          ) : (
            <button onClick={uploadToIpfs}>Upload</button>
          )}
          {uri && (
            <a
              href={`https://${process.env.REACT_APP_PINATAGATWAY}/ipfs/${uri}`}
              target="_blank"
              rel="noreferrer"
            >
              View Certificate
            </a>
          )}
        </div>
        {fileHash&&
        <div className="fileHash">
          <p><strong>FileHash : </strong><span>{fileHash}</span></p>
        </div>
        }
        {loading === true ? <SmallLoader /> :<div className="multi-btn"> <button id="register-btn" onClick={regCert}>Register Certificate</button> {isTransaction&&<a href={`https://giant-half-dual-testnet.explorer.testnet.skalenodes.com/address/${account}`} id="solana-explorer" target="_blank" rel="">View Transaction</a>}</div>}
      </form>
    </div>
  );
};

export default PostCert;
