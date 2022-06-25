import React from 'react';
import Web3Modal from "web3modal";
import { providers } from "ethers";
import { createContext, useEffect, useRef, useState } from "react";

export const WalletConnectContext = createContext();

export const WalletConnectProvider = ({children}) => {
    const [walletConnected, setWalletConnected] = useState(false);
    const web3modalRef = useRef();

      const getProviderOrSigner = async (needSigner = false) => {
        const provider = await web3modalRef.current.connect();
        const web3Provider = new providers.Web3Provider(provider);
    
        const { chainId } = await web3Provider.getNetwork();
        if (chainId !== 80001) {
          window.alert("Change the network to mumbai");
          throw new Error("Change network to mumbai");
        }
    
        if (needSigner) {
          const signer = web3Provider.getSigner();
          return signer;
        }
        
        return web3Provider;
      };


      const connectWallet = async () => {
        try {
            await getProviderOrSigner();
            setWalletConnected(true);
        }
        catch (err) {
            console.error(err);
        }
    }

    useEffect(()=>{
      if(!walletConnected){
          web3modalRef.current = new Web3Modal({
              network: 'mumbai',
              providerOptions: {},
              disableInjectedProvider: false,
          });
          connectWallet();
      }
  }, [walletConnected]);


      return(
        <WalletConnectContext.Provider
            value={{
                walletConnected,
                connectWallet,
                getProviderOrSigner
            }}
        >
            { children }
        </WalletConnectContext.Provider>
      )
}