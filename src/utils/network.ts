import {
  TypedDataDomain,
  TypedDataField,
} from '@ethersproject/abstract-signer';
import { ethers, utils } from 'ethers';

export const getSigner = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
  // Prompt user for account connections
  await provider.send('eth_requestAccounts', []);
  const signer = provider.getSigner();
  return signer;
};

export const signedTypeData = async (
  domain: TypedDataDomain,
  types: Record<string, TypedDataField[]>,
  value: Record<string, any>
) => {
  const signer = await getSigner();
  // remove the __typedname from the signature!
  return signer._signTypedData(
    omit(domain, '__typename'),
    omit(types, '__typename'),
    omit(value, '__typename')
  );
};

export const splitSignature = (signature: string) => {
  return utils.splitSignature(signature);
};

export const sendTx = async (
  transaction: ethers.utils.Deferrable<ethers.providers.TransactionRequest>
) => {
  const signer = await getSigner();
  return signer.sendTransaction(transaction);
};

export const signText = async (text: string) => {
  const signer = await getSigner();
  return signer.signMessage(text);
};

export const ipfsToUri = (ipfs: string) => {
  const ipfsPrefix = 'ipfs://';
  if (!ipfs.startsWith(ipfsPrefix)) {
    return ipfs;
  }
  const ipfsID = `${ipfs}`.replace(ipfsPrefix, '');
  return `https://cloudflare-ipfs.com/ipfs/${ipfsID}`;
};
