import React, { useContext, useState } from "react";
import JSZip from "jszip";
import toast from "react-hot-toast";
import Papa from "papaparse";
import CryptoJS from "crypto-js";
import { EdubukContexts } from "../../Context/EdubukContext";
import SmallLoader from "../SmallLoader/SmallLoader";

const BulkUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadLoader, setUploadLoader] = useState(false);
  const [fileHash, setFileHash] = useState([]);
  const [uri, setUri] = useState([]);
  const [issuerName, setIssuerName] = useState("");
  const [certData, setCertData] = useState([null]);
  const { account, connectingWithContract, loading, setLoading } =
    useContext(EdubukContexts);
  const [isTransaction, setTransaction] = useState(false);
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [csvfile, setCSVFile] = useState();

  // function to handle input file
  const handleFileChange = (e) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  // function to generate of a file
  const getHash = async (file) => {
    const fileData = await file.async("arraybuffer");
    const wordArray = CryptoJS.lib.WordArray.create(fileData);
    const hash = CryptoJS.SHA256(wordArray).toString();
    setFileHash((prevHash)=>[...prevHash,hash]);
    console.log("hash : ", hash);
  };

  //upload docs to IPFS
  const uploadToIpfs = async (e, pdfFile) => {
    e.preventDefault();
    try {
      //const input = document.getElementById("fileInput");
      if (!pdfFile) {
        return toast.error("No file selected !");
      }
      const formData = new FormData();
      formData.append("file", pdfFile.blob, pdfFile.name);
      const response = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_PINATAJWT}`,
          },
          body: formData,
        }
      );

      const upload = await response.json();
      if (upload?.IpfsHash) {
        setUri((prevUri) => [...prevUri, upload?.IpfsHash]);
        setCount((prevCount) => prevCount + 1);
      }
      console.log(upload);
    } catch (error) {
      setUploadLoader(false);
      toast.error("Error in uploading file");
      console.error("Error uploading file:", error);
    }
  };

  const chunkArray = (array, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  };

  // function to extract pdf from zip file in chunks of 10
  const unZipFiles = async (e) => {
    if (selectedFile) {
      try {
        setUploadLoader(true);
        const zip = new JSZip();
        const allFiles = [];

        // Read the .zip file
        const zipContent = await zip.loadAsync(selectedFile);

        // Collect PDF files
        zipContent.forEach((relativePath, file) => {
          if (relativePath.endsWith(".pdf")) {
            allFiles.push({ relativePath, file });
            getHash(file);
          }
        });

        // Split allFiles array into chunks of 10
        const chunks = chunkArray(allFiles, 10);

        // Upload each chunk of 10 files sequentially
        for (const chunk of chunks) {
          const pdfPromises = chunk.map(({ relativePath, file }) =>
            file.async("blob").then((blobData) => ({
              name: relativePath,
              blob: blobData,
            }))
          );

          const pdfFiles = await Promise.all(pdfPromises);

          // Upload each file in the current chunk
          for (const pdfFile of pdfFiles) {
            await uploadToIpfs(e, pdfFile); // upload to ipfs
          }
        }
        toast.success("All Files uploaded successfully");
        setUploadLoader(false);
      } catch (err) {
        setLoading(false);
        toast.error("Error while unzipping the file");
        console.error("Error while unzipping the file:", err);
      }
    }
  };

  // function to take data from csv file
  const readCSVFile = async (e) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    setCSVFile(file);
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          setCertData(result.data);
        },
      });
    }
  };

  const issueMultipleCert = async (e) => {
    e.preventDefault();
    if (certData?.length !== uri.length)
      return toast.error("Data count in zip file and csv file mismatch");
    for (let i = 0; i < uri.length; i++) {
      console.log("file hash :",fileHash[i])
      data.push({
        studentname: certData[i].studentName,
        studentAdd: certData[i].studentAdd,
        hash: fileHash[i],
        _type: certData[i].certType,
        URI: uri[i],
        _witness: account,
      });
    }
    console.log("pushing data",data);
    try {
      setLoading(true);
      const contract = await connectingWithContract();
      // console.log("contract", contract);
      const registerBulkCert = await contract.bulkUpload(data, issuerName);
      await registerBulkCert.wait();
      setLoading(false);
      toast.success("Certificated Posted successfully");
      setTransaction(true);
      setIssuerName("");
      setCount(0);
    } catch (error) {
      setLoading(false);
      toast.error("Error in certificate Registration", error);
      console.error("Error in certificate Registration: ", error);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={issueMultipleCert}>
        <h2>Issue Multiple Certificate</h2>
        <div className="input-box">
          <input
            type="text"
            required
            placeholder="Issuer Name"
            value={issuerName}
            onChange={(e) => setIssuerName(e.target.value)}
          ></input>
          <label for="name">Issuer Name</label>
        </div>
        <div className="upload-section">
          {count === 0 ? (
            <>
              <input
                type="file"
                id="fileInputZip"
                accept=".zip"
                onChange={handleFileChange}
              ></input>
              <label htmlFor="fileInputZip">
                {selectedFile ? (
                  selectedFile.name
                ) : (
                  <span>choose ZIP file</span>
                )}
              </label>

              <input
                type="file"
                id="fileInputCSV"
                accept=".csv"
                onChange={readCSVFile}
              ></input>
              <label htmlFor="fileInputCSV">
                {csvfile ? csvfile.name : <span>choose CSV file </span>}
              </label>
            </>
          ) : (
            <h4>
              Uploaded File... <span>{count}</span>
            </h4>
          )}
          {uploadLoader ? (
            <SmallLoader />
          ) : (
            <button onClick={unZipFiles}>Upload</button>
          )}
        </div>
        {loading === true ? (
          <SmallLoader />
        ) : (
          <div className="multi-btn">
            {" "}
            <button id="register-btn">Register Certificate</button>{" "}
            {isTransaction && (
              <a
                href={`https://giant-half-dual-testnet.explorer.testnet.skalenodes.com/address/${account}`}
                id="solana-explorer"
                target="_blank"
                rel=""
              >
                View Transaction
              </a>
            )}
          </div>
        )}
      </form>
      <div></div>
    </div>
  );
};

export default BulkUpload;
