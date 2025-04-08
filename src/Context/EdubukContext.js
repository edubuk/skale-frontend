import React, { createContext, useState, useEffect } from 'react'
import { connectWallet, connectingWithContract } from '../Utils/apiFeature'
import { Wallet, ethers } from 'ethers';
import toast from 'react-hot-toast';
import Miner from '../Components/SFuelDistribution/Miner'
import { chain } from '../Components/SFuelDistribution/chain'

export const EdubukContexts = createContext();

export const EdubukProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [studentName, setStudentName] = useState("");
  const [openSidebar, setOpenSidebar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [chainId, setChainId] = useState(null);
  const [balance, setBalance] = useState(null);
  const fetchData = async () => {
    try {
      const connectedAcc = await connectWallet();
      setAccount(connectedAcc);
      console.log("Connected Account : ", connectedAcc);
    } catch (error) {
      console.log("Error in fetchdata : ", error);
    }
  }

  const switchToSkale = async () => {
    try {
      const desiredChainId = "1564830818";
      const hexChainId = `0x${Number(desiredChainId).toString(16)}`;
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: hexChainId }],
      })

      console.log(`Switched to chain ID: ${desiredChainId}`);

    } catch (error) {
      if (error.code === 4902 && chainId !== undefined) {
        toast.error(`chain ID: ${chainId} i.e. SKALE Network is not configured in metamask`)
      }
    }
  }

  const getConnectedChainId = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const currChainId = await window.ethereum.request({ method: 'eth_chainId' });
        setChainId(parseInt(currChainId, 16));
        if (parseInt(currChainId, 16) !== undefined && parseInt(currChainId, 16) !== 1564830818) {
          switchToSkale();
        }
      } catch (error) {
        toast.error('something went wrong !')
      }
    } else {
      // toast.error("Metamask is not installed");
    }
  };


  const requestSFuel = async () => {
    const id = toast.loading("Balance is low, distributing sFUEL...");
    try {
      const provider = new ethers.providers.JsonRpcProvider(
        process.env.REACT_APP_CalypsoMainnetRPC
      );
      const randomWallet = Wallet.createRandom().connect(provider);
      const nonce = await provider.getTransactionCount(randomWallet.address);
      const functionSignature = "0x0c11dedd";
      const miner = new Miner();
      const { gasPrice } = await miner.mineGasForTransaction(nonce, 100_000, randomWallet.address);

      const request = {
        to: chain?.chainInfo?.testnet.proofOfWork,
        data: `${functionSignature}000000000000000000000000${account.substring(2)}`,
        gasLimit: 100_000,
        gasPrice,
      };
      console.log("request data ", request)
      const response = await randomWallet.sendTransaction(request);
      console.log("response", response);
      await provider.waitForTransaction(response?.hash, 1);
      if (response?.hash) {
        toast.dismiss(id);
        toast.success("0.005 sFUEL credited successfully")
      }
    } catch (error) {
      console.error("Error in distributing sFUEL:", error);
      toast.dismiss(id)
    }
  };


  const getAccountBalance = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const bal = await provider.getBalance(account);
      const etherBalance = ethers.utils.formatEther(bal);
      const roundedBalance = parseFloat(etherBalance).toFixed(6)
      setBalance(roundedBalance);
      if (roundedBalance < 0.00000001 && chainId === 1564830818) {
        await requestSFuel();
        const bal = await provider.getBalance(account);
        const etherBalance = ethers.utils.formatEther(bal);
        const roundedBalance = parseFloat(etherBalance).toFixed(6)
        setBalance(roundedBalance);
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };


  useEffect(() => {
    fetchData();
    getConnectedChainId();
  }, [chainId])

  useEffect(() => {
    if (account && chainId)
      getAccountBalance();
  }, [account, chainId])
  return (
    <EdubukContexts.Provider
      value={{
        connectWallet,
        connectingWithContract,
        loading,
        setLoading,
        setAccount,
        account,
        studentName,
        setStudentName,
        openSidebar,
        balance,
        setBalance,
        chainId,
        setOpenSidebar
      }}
    >
      {children}
    </EdubukContexts.Provider>
  )
}

