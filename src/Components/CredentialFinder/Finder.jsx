import React, { useContext, useState } from 'react';
import { EdubukContexts } from '../../Context/EdubukContext';
import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast';
import './finder.css'
import SmallLoader from '../SmallLoader/SmallLoader';
const finderData = {
  name: "",
  sender_email: "",
  receiver_email:"",
  address: "",
  message:"",
};

const Finder = () => {
    const {account, connectingWithContract} = useContext(EdubukContexts);
    const [studentAdd, setStudentAdd] = useState("");
    const [values, setValues] = useState(finderData);
    const [uri, setUri] = useState([]);
    const [loading, setLoading] =  useState(false);


    const sendEmail = async(e)=>{
      e.preventDefault();
      try {
        setLoading(true)
        const res= await emailjs.sendForm(process.env.REACT_APP_ServiceId,process.env.REACT_APP_TemplateId1, e.target, process.env.REACT_APP_PublicKey)
        if(res)
        {
          toast.success("Request Sent");
          setLoading(false);
        }
        else
        {
          toast.error("something went wrong ")
          setLoading(false)
        }
      } catch (error) {
        console.log("error while sending email",error)
        setLoading(false)
      }
    }

    const changeHandler = (e) => {
      e.preventDefault();
  
      const { name, value } = e.target;
      setValues({ ...values, [name]: value });
    };



  return (
    <div className='finder-conatiner'>
    <div className="form-container">
    <form onSubmit={sendEmail}>
      <h2>Request To Access Certified Credential</h2>
      <div className="input-box">
      <input
        type="text"
        placeholder="Your Name"
        required
        name="name"
        onChange={changeHandler}
      ></input>
      <label htmlFor="name">Your Name</label>
      </div>
      <div className="input-box">
      <input
        type="text"
        placeholder="Your Email"
        required
        name="sender_email"
        onChange={changeHandler}
      ></input>
      <label htmlFor="yourEmail">Your Email</label>
      </div>
      <div className="input-box">
      <input
        type="text"
        placeholder="Receiver Email"
        required
        name="receiver_email"
        onChange={changeHandler}
      ></input>
      <label htmlFor="receiverEmail">Receiver Email</label>
      </div>
      <div className="input-box">
      <input
        type="hidden"
        required
        name="wallet_address"
        value={account}
      ></input>
      </div>
      {loading === true ? <SmallLoader /> : <button>Request Now</button>}
    </form>
  </div> 
  </div>
  );
};

export default Finder;
