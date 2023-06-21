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

    // set claimed token amount for those users using the claimToken button
    // const [myBal, setMyBal] = useState(0);

    // get orgs addresses
    const [orgs, setOrgs] = useState([]);

    
    useEffect(() => {
        initWallet();
        connectedWallet();
        WalletTracker();
        
      }, [])

    
    useEffect(() => {
      // get orgs
      getOrgs();
      
    }, [walletAddr])
    
    

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

    // connected wallet
    const connectedWallet = async () => {
      if(typeof window != "undefined" && typeof window.ethereum != "undefined") {
        try {
          const accounts = await window.ethereum.request({method: "eth_accounts",});
          if (accounts.length > 0) {
            console.log("Connected Wallet",accounts[0])
            setWalletAddr(accounts[0])
          } else( console.log("Use Connect button to connect your Metamask."))
        } catch (error) {
          console.log(error)
        }
      } else {
        // metamask is not installed.
        console.log("Please install metamask.")
      }
    };
  
    // track which wallet is currently connected
    const WalletTracker = async () => {
      if(typeof window != "undefined" && typeof window.ethereum != "undefined") {
        
        try{
          window.ethereum.on("accountsChanged", (accounts) => {
            setWalletAddr(accounts[0])
            console.log(accounts[0])
          })
    
        } catch (error) {
          console.log(error.message)
        }
      } else {
        // metamask is not installed.
        setWalletAddr("")
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


    // Check if the provider is set 
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
              const response = await tx.wait();
              if (response.status === 1) {
                alert('You have successfully registered as an organization.')
              }
              console.log(await response);}
        } catch (error) {
          alert(error.message.match(/"([^"]+)"/)[1]);
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
          alert(error.message.match(/"([^"]+)"/)[1]);
          
          return
        }
    }


    const orgToken = async() => {
      try {
        const signer = await provider.getSigner();
        const contract = contractDetail(signer);
        const tx = await contract.orgToken(name, symbol, supply);
        const response = await tx.wait();
        if (response.status === 1) {
          alert('token registered successfully.');
        }
        console.log(await response);
        return
      } catch (error) {
        alert(error.message.match(/"([^"]+)"/)[1]);
      }
    }


    const setVestingDetails = async() => {
      try {
        const signer = await provider.getSigner();
        const contract = contractDetail(signer);
        const tx = await contract.setVestingDetails(stakeholderAddr, tag, amount, vestingPeriod);
        const response = await tx.wait();
        if (response.status === 1) {
          alert('Vesting details set successfully.');
        }
        console.log(await response);
        return
      } catch (error) {
        alert(error.message.match(/"([^"]+)"/)[1]);
      }
    }


    const setWhitelist = async () => {
      try {
        const signer = await provider.getSigner();
        const contract = contractDetail(signer);
        const tx = await contract.setWhitelist(stakeholder);
        const response = await tx.wait();
        if (response.status === 1) {
          alert(`${stakeholder} whitelisted successfully.`);
        }
        console.log(await response);
        return
      } catch (error) {
        alert(error.message.match(/"([^"]+)"/)[1]);
      }
    }


    const claimTokensFor = async () => {
      try {
        const signer = await provider.getSigner();
        const contract = contractDetail(signer);
        const tx = await contract.claimTokensFor(client);
        const response = await tx.wait();
        if (response.status === 1) {
          alert(`Tokens successfully sent to ${client} .`);
        }
        console.log(await response);
        return
      } catch (error) {
        alert(error.message.match(/"([^"]+)"/)[1]);
      }
    }

    const claimTokens = async () => { 
      if (walletAddr) {
        try {
          const signer = await provider.getSigner();
          const contract = contractDetail(signer);
          const tx = await contract.claimTokens();
          const response = await tx.wait();
          
          if (response.status === 1) {
            alert(`Tokens successfully claimed.`);
          }
          console.log(await response);
          return
        } catch (error) {
          alert(error.message.match(/"([^"]+)"/)[1]);
        }
      } else { alert("Please, connect wallet to continue...");}

    }


  //   async function myBalance() {
  //     try {
  //       if (provider) {
  //         const signer = await provider.getSigner();
  //         // initalize smartcontract with the essentials detials.
  //         const contract = contractDetail(signer);
  //         // interact with the methods in smart contract
  //         const response = await contract.myBalance();
  //         setMyBal(response);
          
  //         console.log(await response  )
  //       } else {console.log('provider not found.');}
        
  //      return
  //     } catch (error) {
  //       alert(error.message.match(/"([^"]+)"/)[1]);
        
  //       return
  //     }
  // }


return(
    <AppContext.Provider value={{
      provider, walletAddr, connectWallet, registerAsOrg, getOrgs, orgs,  orgToken, setName, setSymbol, setSupply, setTag, setAmount, setVestingPeriod, setStakeholder, setStakeholderAddr, setVestingDetails, setWhitelist, setClient, claimTokensFor, claimTokens
    }}>
    {children}
    </AppContext.Provider>
)
}


export const useAppContext = () => useContext(AppContext);