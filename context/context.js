'use client'
import React from 'react';
import { useState,useEffect, useContext} from 'react';
import { ethers } from 'ethers';
import Web3Modal from "web3modal";
import WalletConnectProvider from '@walletconnect/web3-provider'

import { contractAddress, coinVestABI } from './config'



// contract detail.
const contractDetail = (signer) => new ethers.Contract(contractAddress, coinVestABI, signer);

// export const AppContext = React.createContext();
const AppContext = React.createContext({});
export const AppContextProvider = ({children}) =>{
    const test = "this is me testing the waters"

    // hooks for required variables
    const [provider, setProvider] = useState();
    // connected wallet
    const [walletAddr, setWalletAddr] = useState("");
    // organization name
    const [name, setName] = useState("");
    // token symbol
    const [symbol, setSymbol] = useState("");
    // token supply
    const [supply, setSupply] = useState(null);
    // stakeholder address
    const [stakeholderAddr, setStakeholderAddr] = useState("");
    // stakeholder tag
    const [tag, setTag] = useState("");
    //vesting amount
    const [amount, setAmount] = useState(0);
    // vesting period
    const [vestingPeriod, setVestingPeriod] = useState(120);

    // set whitelist
    const [stakeholder, setStakeholder] = useState("");
    // client: an address to send the vested token to by the admin  
    const [client, setClient] = useState("");

    // get orgs addresses
    const [orgs, setOrgs] = useState("");

    // fetch the registered organizations every 1 minute
    const [fetchTime, setFetchTime] = useState(Date.now());

    
    
    


    useEffect(() => {
        initWallet();
        
      }, [])

    
      useEffect(() => {
      const interval = setInterval(() => {
        setFetchTime(Date.now());
      }, 60000); // 1 minute
  
      return () => {
        clearInterval(interval);
      };
    }, []);
  
    useEffect(() => {
      getOrgs();
    }, [fetchTime]);
    
    

      // connect wallet
    const connectWallet = async () => {
      if(typeof window != "undefined" && typeof window.ethereum != "undefined") {
        try {
          const accounts = await window.ethereum.request({method: "eth_requestAccounts", });
          console.log("WalletAddr",accounts[0])
          setWalletAddr(accounts[0])
          console.log(walletAddr)
        } catch (error) {
          console.log(error)
        }
      } else {
        // metamask is not installed.
        console.log("Please install metamask.")
      }
    };

    // async function to connect to the wallet...
    async function initWallet(){
        try {
          // check if any wallet provider is installed. i.e metamask xdcpay etc
          if (typeof window.ethereum === 'undefined') {
            console.log("Please install wallet.")
            alert("Please install wallet.")
            return
          }
          else{
              // raise a request for the provider to connect the account to our website
              const web3ModalVar = new Web3Modal({
                cacheProvider: true,
                providerOptions: {
                walletconnect: {
                  package: WalletConnectProvider,
                },
              },
            });
            
            const instanceVar = await web3ModalVar.connect();
            const providerVar = new ethers.BrowserProvider(instanceVar)
            setProvider(providerVar)
            // getOrgs(providerVar)
            return
          }
    
        } catch (error) {
          console.log(error)
          return
        }
    }


    if (provider === "undefined") {
      // Provider is not yet initialized
      return "Loading..."
    } 


    // register as an org
    const registerAsOrg = async() => {
      if (walletAddr) {
        try {
          if (provider) {
              const signer = await provider.getSigner();
              const contract = contractDetail(signer);
              const tx = await contract.registerAsOrg();
              const reponse = await tx.wait();
              console.log(await reponse);}
        } catch (error) {
          console.log(error.message);
        }
      } else {alert("Please, connect wallet to continue...");}
    }
    

    async function getOrgs(){
        try {
          if (provider) {
            const signer = await provider.getSigner();
            // initalize smartcontract with the essentials detials.
            const contract = contractDetail(signer);
            // interact with the methods in smart contract
            const response = await contract.getOrgs();
            setOrgs(response);
            
            console.log(await response  )
          } else {console.log('provider not found.');}
          
         return
        } catch (error) {
          alert(error)
          
          return
        }
    }


    const orgToken = async() => {
      try {
        const signer = await provider.getSigner();
        const contract = contractDetail(signer);
        const tx = await contract.orgToken(name, symbol, supply);
        const reponse = await tx.wait();
        console.log(await reponse);
        return
      } catch (error) {
        console.log(error)
      }
    }


    const setVestingDetails = async() => {
      try {
        const signer = await provider.getSigner();
        const contract = contractDetail(signer);
        const tx = await contract.setVestingDetails(stakeholderAddr, tag, amount, vestingPeriod);
        const reponse = await tx.wait();
        console.log(await reponse);
        return
      } catch (error) {
        console.log(error);
      }
    }


    const setWhitelist = async () => {
      try {
        const signer = await provider.getSigner();
        const contract = contractDetail(signer);
        const tx = await contract.setWhitelist(stakeholder);
        const reponse = await tx.wait();
        console.log(await reponse);
        return
      } catch (error) {
        console.log(error);
      }
    }


    const claimTokensFor = async () => {
      try {
        const signer = await provider.getSigner();
        const contract = contractDetail(signer);
        const tx = await contract.claimTokensFor(client);
        const reponse = await tx.wait();
        console.log(await reponse);
        return
      } catch (error) {
        console.log(error);
      }
    }

    const claimTokens = async () => { 
      try {
        const signer = await provider.getSigner();
        const contract = contractDetail(signer);
        const tx = await contract.claimTokens();
        const reponse = await tx.wait();
        console.log(await reponse);
        return
      } catch (error) {
        console.log(error);
      }
    }



return(
    <AppContext.Provider value={{
      provider, walletAddr, connectWallet, registerAsOrg, getOrgs, orgs,  orgToken, setVestingDetails, setWhitelist, setClient, claimTokensFor, claimTokens
    }}>
    {children}
    </AppContext.Provider>
)
}


export const useAppContext = () => useContext(AppContext);