import React, { useEffect, useState,useContext} from 'react';
import { ethers } from 'ethers';
import { MdLogout, MdOutlineContentCopy } from 'react-icons/md';
import { FaRegCircle } from "react-icons/fa6";
import './wallet.css'; // Import the CSS file
import { EdubukContexts } from '../../Context/EdubukContext';
import toast from 'react-hot-toast';
import SmallLoader from '../SmallLoader/SmallLoader';
const WalletInfo = (showWalletInfo) => {
  const { account,setAccount,chainId} = useContext(EdubukContexts);

  const [balance,setBalance] = useState(null);

  const tokenName = {
    1:"ETH",
    51:"TXDC",
    50:"XDC",
    56:"BNB",
    974399131:"SFUEL",
  }

  const getAccountBalance = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log("account ",account)
      const balance = await provider.getBalance(account);
      const etherBalance = ethers.utils.formatEther(balance); 
      const roundedBalance = parseFloat(etherBalance).toFixed(4)
      setBalance(roundedBalance);
      console.log("account balance :",roundedBalance)
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const copyAddress = async()=>{
    try {
      await navigator.clipboard.writeText(account)
      toast.success("Address copied")
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy. Please try again.');
    }
  }

  const disconnectWallet = ()=>{
    if(account!=="null")
    {
      setAccount(null);
      setBalance(null);
      toast.success("Wallet Disconnected")
    }
    else
    {
      toast.error("Already waller disconnected")
    }
  }

  

  useEffect(() => {
    getAccountBalance();
  }, [showWalletInfo]);


  return (
    <>
      <div className={`wallet-container ${showWalletInfo ? 'active' : ''}`}>
        <div className="wallet-box">
          <div className='wallet-acc-info'>
            <h3><FaRegCircle id='circle' /> <span>{account?.substring(0, 6)}...{account?.substring(account.length - 5)}</span></h3>
            {balance?<p>
              <strong>Balance: <span>{balance} {tokenName[chainId]}</span></strong>
            </p>:<div id="balance-loader"><SmallLoader /></div>}
          </div>
          <div className="wallet-utils">
            <div className='wallet-utils-icon' onClick={copyAddress}>
            <MdOutlineContentCopy />
            <p>Copy Address</p>
            </div>
            <div className='wallet-utils-icon' onClick={disconnectWallet}>
            <MdLogout />
            <p>Disconnect Wallet</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WalletInfo;
