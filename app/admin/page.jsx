'use client'
import React from 'react';
import { useAppContext } from '@/context/context';
import Button from '../components/Button';


const Dashboard = () => {

  // app variable context 
  const {orgToken, setVestingDetails, setWhitelist, claimTokensFor, setName, setSymbol, setSupply, setStakeholderAddr, setTag, setAmount, setVestingPeriod, setStakeholder, setClient} = useAppContext();

  // corresponding time to seconds conversion
  const timeToSeconds = (e) => {
    const timeMapping = {
      '2 Minutes': 2 * 60,
      '5 Days': 5 * 24 * 60 * 60,
      '10 Days': 10 * 24 * 60 * 60,
      '15 Days': 15 * 24 * 60 * 60,
      '1 Month': 30 * 24 * 60 * 60,
      '3 Months': 3 * 30 * 24 * 60 * 60,
      '6 Months': 6 * 30 * 24 * 60 * 60,
      '1 Year': 365 * 24 * 60 * 60,
    };
    const selectedOption = e.target.value;
    setVestingPeriod(timeMapping[selectedOption])
  }
  return (
    <div className='flex flex-row justify-evenly w-90 mt-10'>
      
      <div className='w-2/5 border border-black flex flex-col p-4'>
      <h4 className='text-center mb-4'>Register Token</h4>
      <div className='flex flex-col mb-4'>
        <div className='flex items-center mb-2'>
          <label htmlFor="orgName" className="mr-2">Organisation Name</label>
          <input type="text" id="orgName" name="orgName" placeholder="Org name" className="border border-gray-300 rounded-lg p-2" onChange={(e)=>{setName(e.target.value)}}/>
        </div>

        <div className='flex items-center mb-2'>
          <label htmlFor="tokenSymbol" className="mr-2">Token Symbol</label>
          <input type="text" id="tokenSymbol" name="tokenSymbol" placeholder="Symbol" className="border border-gray-300 rounded-lg p-2" onChange={(e)=>{setSymbol(e.target.value)}}/>
        </div>

        <div className='flex items-center mb-2'>
          <label htmlFor="totalSupply" className="mr-2">Total Supply</label>
          <input type="text" id="totalSupply" name="totalSupply" placeholder="Supply" className="border border-gray-300 rounded-lg p-2" onChange={(e)=>{setSupply(e.target.value)}}/>
        </div>
      </div>
      <Button btnName='Register' handleClick={orgToken}/>
    </div>


    <div className='w-2/5 border border-black flex flex-col p-4'>
      <h4 className='text-center mb-4'>Vesting Details</h4>
      <div className='flex flex-col mb-4'>
        <div className='flex items-center mb-2'>
          <label htmlFor="orgName" className="mr-2">Stakeholder</label>
          <input type="text" id="stakeholderAddr" name="stakeholderAddr" placeholder="Address" className="border border-gray-300 rounded-lg p-2" onChange={(e)=>{setStakeholderAddr(e.target.value)}}/>
        </div>

        <div className='flex items-center mb-2'>
          <label htmlFor="tokenSymbol" className="mr-2">Tag</label>
          <input type="text" id="tag" name="tag" placeholder="Tag" className="border border-gray-300 rounded-lg p-2" onChange={(e)=>{setTag(e.target.value)}}/>
        </div>

        <div className='flex items-center mb-2'>
          <label htmlFor="totalSupply" className="mr-2">Amount</label>
          <input type="text" id="amount" name="amount" placeholder="Amount" className="border border-gray-300 rounded-lg p-2" onChange={(e)=>{setAmount(e.target.value)}}/>
        </div>

        <div className='flex items-center mb-2'>
          <label htmlFor="totalSupply" className="mr-2">Period</label>
          {/* <input type="text" id="totalSupply" name="totalSupply" placeholder="Supply" className="border border-gray-300 rounded-lg p-2" /> */}
          <select id="period" name="period" className="border border-gray-300 rounded-lg p-2"
          onChange={(e)=>{timeToSeconds(e)}}>
            <option value="2 Minutes">2 Minutes</option>
            <option value="5 Days">5 Days</option>
            <option value="10 Days">10 Days</option>
            <option value="15 Days">15 Days</option>
            <option value="1 Month">1 Month</option>
            <option value="3 Months">3 Months</option>
            <option value="6 Months">6 Months</option>
            <option value="1 Year">1 Year</option>
          </select>
        </div>
      </div>
      <Button btnName="Set Vesting Detail" handleClick={setVestingDetails}/>
    </div>



    <div className='w-2/5 border border-black flex flex-col p-4'>
      <h4 className='text-center mb-4'>Whitelist</h4>
      <div className='flex flex-col mb-4'>
        <div className='flex items-center mb-2'>
          <label htmlFor="orgName" className="mr-2">Stakeholder</label>
          <input type="text" id="whitelist" name="whitelist" placeholder="Address" className="border border-gray-300 rounded-lg p-2" onChange={(e)=>{setStakeholder(e.target.value)}}/>
          <Button btnName="Whitelist" handleClick={setWhitelist}/>
        </div>

        <h4 className='text-center mb-4 w-100 mt-10'>Withdraw Token For</h4>
        <div className='flex items-center mb-2'>
          
          <label htmlFor="orgName" className="mr-2">withdraw to</label>
          <input type="text" id="withdraw to" name="withdraw to" placeholder="withdraw to" className="border border-gray-300 rounded-lg p-2" onChange={(e)=>{setClient(e.target.value)}}/>
          <Button btnName = "Withdraw" handleClick = {claimTokensFor}/>
        </div>
      </div>
    </div>
    
    </div>
  );
};

export default Dashboard;
