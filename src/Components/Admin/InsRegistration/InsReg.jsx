import React, { useContext, useState } from "react";
import "../admin.css";
import { EdubukContexts } from "../../../Context/EdubukContext";
import toast from "react-hot-toast";
import SmallLoader from "../../SmallLoader/SmallLoader";


const InstRegValue = {
  instName: "",
  instAcronym: "",
  witness: "",
};

const InsReg = () => {
  const [values, setValues] = useState(InstRegValue);
  const [txHash, setTxHash] = useState(null);
  const { account, connectingWithContract} = useContext(EdubukContexts);
  const [loading, setLoading] = useState(false);

  const changeHandler = (e) => {
    e.preventDefault();

    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const instRegistration = async (e) => {
    e.preventDefault();

    const adminAcc = process.env.REACT_APP_ADMIN.toLowerCase();
    const currAccount = account.toLowerCase();
    try {
      if (adminAcc !== currAccount) return toast.error("You are not Admin");
      setLoading(true);
      const contract = await connectingWithContract();
      console.log('contract',contract);
      const registerInst = await contract.registerInstitute(
        values.instName,
        values.instAcronym,
        values.witness
      );
      await registerInst.wait();
      if(registerInst?.hash)
      {
      setLoading(false);
      toast.success("Institute Register Successfully");
      setTxHash(registerInst.hash);
      setValues(InstRegValue);
      }
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong", error);
      console.error("Error in Institute registration: ", error);
    }
  };
  return (
    <div className="form-container">
      <form onSubmit={instRegistration}>
        <h2>Institute Registration</h2>
        <div className="input-box">
        <input
          type="text"
          placeholder="Institute Name"
          required
          name="instName"
          value={values.instName}
          onChange={changeHandler}
        ></input>
        <label htmlFor="name">Institute Name</label>
        </div>
        <div className="input-box">
        <input
          type="text"
          placeholder="Institute's Acronym"
          required
          name="instAcronym"
          value={values.instAcronym}
          onChange={changeHandler}
        ></input>
        <label htmlFor="name">Institute's Acronym</label>
        </div>
        <div className="input-box">
        <input
          type="text"
          placeholder="Institute Witness Address"
          required
          name="witness"
          value={values.witness}
          onChange={changeHandler}
        ></input>
         <label htmlFor="name">Institute Witness Address</label>
        </div>
        {loading === true ? <SmallLoader /> :<div className="multi-btn"> <button id="register-btn">Register Institute</button> {txHash&&<a href={`https://honorable-steel-rasalhague.explorer.mainnet.skalenodes.com/tx/${txHash}`} id="solana-explorer" target="_blank" rel="">View Transaction</a>}</div>}
      </form>
    </div> 
  );
};

export default InsReg;
