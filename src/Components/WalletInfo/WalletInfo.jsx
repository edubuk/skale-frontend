import React, { useEffect, useState,useContext} from 'react';
import {Wallet, ethers } from 'ethers';
import { MdLogout, MdOutlineContentCopy } from 'react-icons/md';
import { FaRegCircle } from "react-icons/fa6";
import './wallet.css'; // Import the CSS file
import { EdubukContexts } from '../../Context/EdubukContext';
import toast from 'react-hot-toast';
import SmallLoader from '../SmallLoader/SmallLoader';
import Miner from '../SFuelDistribution/Miner';
import { chain } from '../SFuelDistribution/chain';
import { SiFueler } from "react-icons/si";
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

  const requestSFuel = async () => {
    const id=toast.loading("Balance is low, distributing sFUEL...");
    try {
      const provider = new ethers.providers.JsonRpcProvider(
        'https://testnet.skalenodes.com/v1/giant-half-dual-testnet'
      );      
      console.log("provider",provider)
      const randomWallet = Wallet.createRandom().connect(provider);
      console.log("walet random",randomWallet)
      const nonce = await provider.getTransactionCount(randomWallet.address);
      console.log("nonce ",nonce)
      const functionSignature = "0x0c11dedd";
      console.log("functionSignature ",functionSignature)
      const miner = new Miner();
      const { gasPrice } = await miner.mineGasForTransaction(nonce, 100_000, randomWallet.address);
      console.log("gasPrice ",gasPrice)
      
      const request = {
        to: chain?.chainInfo?.testnet.proofOfWork,
        data: `${functionSignature}000000000000000000000000${account.substring(2)}`,
        gasLimit: 100_000,
        gasPrice,
      };
      console.log("request data ",request)
      const response = await randomWallet.sendTransaction(request);
      console.log("response",response);
      await provider.waitForTransaction(response?.hash, 1);
      if(response?.hash)
      {
        toast.dismiss(id);
      }
    } catch (error) {
      console.error("Error distributing sFUEL:", error);
      toast.dismiss(id)
    } 
  };

  const getAccountBalance = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const balance = await provider.getBalance(account);
      const etherBalance = ethers.utils.formatEther(balance); 
      const roundedBalance = parseFloat(etherBalance).toFixed(6)
      setBalance(roundedBalance);
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
      toast.error("Already wallet disconnected")
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
            <div className='wallet-utils-icon' onClick={requestSFuel}>
            <SiFueler />
            <p>Get SFuel</p>
            </div>
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
