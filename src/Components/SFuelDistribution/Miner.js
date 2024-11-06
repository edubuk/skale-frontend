// Miner.js
import { ethers } from 'ethers';
import { keccak256, randomBytes, getNumber, isHexString, hexZeroPad, hexlify } from 'ethers/lib/utils';
/* global BigInt */

export default class Miner {
  static MAX_NUMBER = ethers.constants.MaxUint256;

  async mineGasForTransaction(nonce, gas, from) {
    nonce = isHexString(nonce) ? getNumber(nonce) : nonce;
    gas = isHexString(gas) ? getNumber(gas) : gas;
    console.log("nonce and gas ", nonce, gas, from);
    return await this.mineFreeGas(gas, from, nonce);
  }

  async mineFreeGas(gasAmount, address, nonce) {
    const nonceHash = BigInt(keccak256(hexZeroPad(hexlify(nonce), 32)));
    const addressHash = BigInt(keccak256(address));
    const nonceAddressXOR = nonceHash ^ addressHash;
    const divConstant = Miner.MAX_NUMBER;
    let candidate, iterations = 0;
    const start = performance.now();

    while (true) {
      candidate = randomBytes(32);
      const candidateHash = BigInt(ethers.utils.keccak256(candidate));
      const nonceAdd = BigInt(nonceAddressXOR)
      const resultHash = nonceAdd ^ candidateHash;
      const divConst = BigInt(divConstant)
      const externalGas = divConst / resultHash;
      //console.log("ExternalGas", externalGas)

      if (externalGas >= BigInt(gasAmount)) {
        break;
      }

      if (iterations++ % 1000 === 0) {
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
    }

    const end = performance.now();

    return {
      duration: end - start,
      gasPrice: BigInt(ethers.utils.hexlify(candidate))
    };

  }
}
