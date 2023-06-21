import React from 'react';
import Button from './Button';
import { useAppContext } from '../../context/context';
import Link from 'next/link';

const Nav = () => {

  const { connectWallet, walletAddr, orgs } = useAppContext();
  let orgsArr = orgs.map(org => org.toLowerCase());
  let refinedOrgsArray = [... new Set(orgsArr)]

  // for testing purposes
  console.log("Orgs", refinedOrgsArray);
  
  return (
    <nav className="flex items-center justify-between bg-gray-800 py-4 px-6">
      <div className="flex items-center flex-shrink-0 text-white mr-6">
        <a href="/" className="text-xl font-bold">
          CoinVest
        </a>
      </div>

      <div className="flex items-center">
        {refinedOrgsArray && walletAddr.toLowerCase() && refinedOrgsArray.includes(walletAddr.toLowerCase()) ? (
          <Link href="/admin" className="text-white px-4 py-2">
            {/* <a className="text-white px-4 py-2">Dashboard</a> */}
            Dashboard
          </Link>
        ) : null}
        <Button
          btnName={walletAddr && walletAddr.length > 0 ? 'Connected' : 'Connect'}
          handleClick={connectWallet}
        />
      </div>
    </nav>
  );
};

export default Nav;

