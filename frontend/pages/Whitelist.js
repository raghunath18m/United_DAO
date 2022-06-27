import React, { useEffect } from 'react';
import { Contract } from "ethers";
import { useContext, useState } from "react";
import { WHITELIST_CONTRACT_ADDRESS, WHITELIST_CONTRACT_ABI } from "../lib/whitelistConstants";
import {WalletConnectContext} from '../Context/walletConnectContext';
import Image from 'next/image';
import styles from '../styles/Whitelist.module.css'


export default function Whitelist() {
  const [loading, setLoading] = useState(false);
  const [joinedWhitelist, setJoinedWhitelist] = useState(false);
  const [numberOfWhitelisted, setNumberOfWhitelisted] = useState(0);
  const { walletConnected, connectWallet, getProviderOrSigner } = useContext(WalletConnectContext);

  // interacting with functions of smartcontracts

  const checkIfAddressInWhitelist = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        WHITELIST_CONTRACT_ABI,
        signer
      );
      const address = await signer.getAddress();

      const _joinedWhitelist = await whitelistContract.isWhitelisted(
        address
      );
      setJoinedWhitelist(_joinedWhitelist);
    } catch (err) {
      console.error(err);
    }
  };


  const getNumberOfWhitelisted = async () => {
    try {
      const provider = await getProviderOrSigner();
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        WHITELIST_CONTRACT_ABI,
        provider
      );
      
      const _numberOfWhitelisted = await whitelistContract.numAddrWhitelisted();
      setNumberOfWhitelisted(_numberOfWhitelisted);
    } catch (err) {
      console.error(err);
    }
  };


  const addAddressToWhitelist = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        WHITELIST_CONTRACT_ABI,
        signer
      );

      const tx = await whitelistContract.addAddrToWhitelist();
      setLoading(true);
      // wait for the transaction to get mined
      await tx.wait();
      setLoading(false);
      
      await getNumberOfWhitelisted();
      setJoinedWhitelist(true);
    } catch (err) {
      console.error(err);
    }
  };


  // initialize

  useEffect(()=>{
    if (walletConnected){
    checkIfAddressInWhitelist();
    getNumberOfWhitelisted();
  }
    },[walletConnected])



  const renderButton = () => {
    if (walletConnected) {
      if (joinedWhitelist) {
        return (
          <div className=''>
            Thanks for joining the Whitelist!
          </div>
        );
      } else if (loading) {
        return <button className=''>Loading...</button>;
      } else {
        return (
          <button onClick={addAddressToWhitelist} className=''>
            Join the Whitelist
          </button>
        );
      }
    } else {
      return (
        <button onClick={connectWallet} className=''>
          Connect your wallet
        </button>
      );
    }
  };

  return (
    <div className={styles.main}>
      <h1>United DAO Whitelist Membership</h1>
        <div className='benefits'>
          Join the whitelist NOW to avail the following benefits !
          <ul>
              <li>Get early access to our rare NFTs at a discounted rate</li>
              <li>Get potential airdrops</li>
              <li>Get free coins with many other surprises</li>
          </ul>
        </div>
      <div className={styles.numberOfWhitelisted}>
        {numberOfWhitelisted} have already joined the Whitelist
      </div>
      {renderButton()}
  </div>
  )
}