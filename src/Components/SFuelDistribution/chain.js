export const chain = {
  chainInfo: {
    testnet: {
      rpcUrl:process.env.REACT_APP_CalypsoMainnetRPC, // calypso mainnet RPC URL
      proofOfWork:process.env.REACT_APP_CalypsoMainnetContractAdd, // Contract address for mainnet calypso
    },
  },
  functionSignatures: {
    Calypso:process.env.REACT_APP_CalypsoSig, // Function signature for Calypso
  },
};
