import React,{useState,useContext} from 'react'
import { EdubukContexts } from '../../../Context/EdubukContext';
import toast from 'react-hot-toast';
import SmallLoader from '../../SmallLoader/SmallLoader';

const RevokInst = () => {

  const [instWitnessAdd, setInstWitnessAdd] = useState("");
  const [loading,setLoading]=useState()
  const {connectingWithContract,account} = useContext(EdubukContexts);
  const [isTransaction, setTransaction] = useState(false);

  const revokeInst = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const contract = await connectingWithContract();
      await contract.revokeInstitute(
        instWitnessAdd
      );
      setLoading(false);
      toast.success("Institute Revoked Successfully");
      setTransaction(true);
      setInstWitnessAdd("");
    } catch (error) {
      toast.error("Error in Institute Revoke", error);
      console.error("Error in Institute Revoke: ", error);
      setLoading(false);
    }
  };
  return (
    <div className="form-container">
    <form onSubmit={revokeInst}>
    <h2>Remove Institute Witness</h2>
    <div className='input-box'>
      <input type='text' required placeholder='Institute Witness Address' value={instWitnessAdd} onChange={(e)=>setInstWitnessAdd(e.target.value)}></input>
      <label htmlFor="name">Institute Witness Address</label>
      </div>
      {loading === true ? <SmallLoader /> :<div className="multi-btn"> <button id="register-btn">Remove Institute</button> {isTransaction&&<a href={`https://giant-half-dual-testnet.explorer.testnet.skalenodes.com/address/${account}`} id="solana-explorer" target="_blank" rel="">View Transaction</a>}</div>}
      </form>
</div>
  )
}

export default RevokInst
