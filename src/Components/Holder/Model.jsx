import React, { useContext, useEffect, useState } from "react";
import "./model.css";
import SmallLoader from "../SmallLoader/SmallLoader";
import { CiCircleRemove } from "react-icons/ci";
import emailjs from "@emailjs/browser";
import toast from "react-hot-toast";
import { EdubukContexts } from "../../Context/EdubukContext";
const baseUrl= "https://edubuk-skale-server.vercel.app";

const Model = ({ setOpenModal, currUri, isShareBtn }) => {
  const [isDataFetched, setDataFetching] = useState(false);
  const [receiverName, setReceiverName] = useState("");
  const [receiverEmail, setReceiverEmail] = useState("");
  const [accessList, setAccessList] = useState([]);
  const {studentName,loading,setLoading} =useContext(EdubukContexts);

  function generateUnique8DigitNumber() {
    const min = 10000000;
    const max = 99999999;
    let randomNumber;
      randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNumber;
  }

  const sendEmail = async (
    e,
    receiverName,
    receiverEmail,
    studentName,
    userId
  ) => {
    e.preventDefault();
    const templateParams = {
      receiver_name: receiverName,
      student_name: studentName,
      doc_link: `${baseUrl}/api/v1/getResponse/${userId}`,
      receiver_email: receiverEmail,
      
    };
    try {
      const res = await emailjs.send(
        process.env.REACT_APP_ServiceId,
        process.env.REACT_APP_TemplateId2,
        templateParams,
        process.env.REACT_APP_PublicKey
      );
      if (res) {
        toast.success("Access Granted & Notification Sent");
        setLoading(false);
      } else {
        toast.error("something went wrong ");
      }
    } catch (error) {
      console.log("error while sending email", error);
      setLoading(false);
    }
  };

  const shareCredAccess = async (e) => {
    e.preventDefault();
    const userid = generateUnique8DigitNumber();
    try {
    
      setLoading(true)
      const url = `${baseUrl}/api/v1/shareAccess`;
      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify({ "email":receiverEmail, "name":receiverName, "userId":userid, "pinataHash":currUri }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data?.success) {
        await sendEmail(e, receiverName, receiverEmail, studentName,userid);
        setLoading(false)
      }
    } catch (error) {
      toast.error("something went wrong");
      console.log("error while saving share access recod", error);
      setLoading(false)
    }
  };

  const removeRecieverFromList = async (e,email,pinataHash) => {
    e.preventDefault();
    try {
      setLoading(true)
      const updatedUserId = generateUnique8DigitNumber();
      const url = `${baseUrl}/api/v1/removeAccess`;
      const res = await fetch(url, {
        method: "PUT",
        body: JSON.stringify({ email,pinataHash, updatedUserId}),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data?.success) {
        toast.success("Access Removed");
        setLoading(false);
        getAccessList();
      }
    } catch (error) {
      toast.error("something went wrong");
      console.log("error while saving share access recod", error);
      setLoading(false);
    }
  };


  const getAccessList = async () => {
    try {
      setDataFetching(true);
      const url = `${baseUrl}/api/v1/recordByUri/${currUri}`;
      const res = await fetch(url, {
        method: "GET",
        headers: {
        "Content-Type": "application/json",
      },
      });
      
      const data = await res.json();
      if(data.success)
      {
        console.log("data",data.record)
        setAccessList(data?.record)
      }
      setDataFetching(false);
    } catch (error) {
      setDataFetching(false);
      console.log("Error fetching access list", error);
    }
  };

  useEffect(() => {
    getAccessList();
    // eslint-disable-next-line
  }, [isShareBtn]);

  return (
    <div className="modal">
      <div className="overlay"></div>
      <div className="modal-content">
        <button className="close-modal" onClick={() => setOpenModal(false)}>
          CLOSE
        </button>

        <div className="addBox">
          {isShareBtn ? (
            <>
              <form className="addinpput" onSubmit={shareCredAccess}>
                <input
                  type="text"
                  placeholder="Receiver Name"
                  name="receiver_name"
                  value={receiverName}
                  onChange={(e) => setReceiverName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Receiver Email"
                  name="receiver_email"
                  value={receiverEmail}
                  onChange={(e) => setReceiverEmail(e.target.value)}
                />
                <div>
                  {loading === true ? (
                    <SmallLoader />
                  ) : (
                    <button className="shareBtn">Share</button>
                  )}
                </div>
              </form>
            </>
          ) : (
            accessList.length>0?
            <div className="dropdown">
              {accessList?.map((item, index) => (
                <div key={index} className="shared-list">
                  <p>
                    <strong>{item.name}</strong> --{" "}
                    <strong>{item.email?.slice(0, 9)}</strong>...
                  </p>
                  {loading ? (
                    <SmallLoader />
                  ) : (
                    <CiCircleRemove
                      id="remove-icon"
                      onClick={(e) => removeRecieverFromList(e, item.email, currUri)}
                    />
                  )}
                </div>
              ))}
          </div>:<>{isDataFetched?<SmallLoader />:<div>No Record Found...</div>}</>
          )}
        </div>
      </div>
    </div>
  );
};

export default Model;
