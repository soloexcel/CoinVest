import React from 'react';
import Button from './Button';
import { useAppContext } from '../../context/context';
import Link from 'next/link';

const Nav = () => {
  const { connectWallet, walletAddr, orgs , } = useAppContext();

  console.log("Orgs", orgs);

  return (
    <nav className="flex items-center justify-between bg-gray-800 py-4 px-6">
      <div className="flex items-center flex-shrink-0 text-white mr-6">
        <a href="/" className="text-xl font-bold">
          CoinVest
        </a>
      </div>

      <div className="flex items-center">
        <Link href="/admin" className="text-white px-4 py-2">
          Dashboard
        </Link>
        <Button
          btnName={walletAddr && walletAddr.length > 0 ? 'Connected' : 'Connect'}
          handleClick={connectWallet}
        />
      </div>
    </nav>
  );
};

export default Nav;
