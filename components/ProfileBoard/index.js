import Link from "next/link";
import { SigningArchwayClient, ArchwayClient } from '@archwayhq/arch3.js';
import ChainInfo from 'constantine.config';
import {CONTRACT_TESTNET_ADDRESS, INFURA_API_KEY, INFURA_API_SECRET} from "@/constants";
import { create } from "ipfs-http-client";
import { useEffect, useState } from "react";
import Modal from 'react-modal';
import CreateProfileModal from "../CreateProfileModal";

export default function ProfileBaord() {
  let accounts, CosmWasmClient, queryHandler;
  const [domainName, setDomainName] = useState();
  const [availability, setAvailabilty] = useState();
  const [hourRate, setHourRate] = useState();
  const [ipfsHash, setIpfsHash] = useState()
  const [createProfileModalIsOpen, setCreateProfileModalIsOpen] = useState(false);
  const [createNewProfileName, setCreateNewProfileName] = useState();
  const [createNewProfileRate, setCreateNewProfileRate] = useState();

  // get profile
  useEffect(() => {
    async function getProfile() {
      if (window['keplr']) {
        if (window.keplr['experimentalSuggestChain']) {
          await window.keplr.enable(ChainInfo.chainId);
          window.keplr.defaultOptions = {
            sign: {
              preferNoSetFee: true,    
            }   
          }
  
          const offlineSigner = await window.getOfflineSignerAuto(ChainInfo.chainId);
          CosmWasmClient = await SigningArchwayClient.connectWithSigner(ChainInfo.rpc, offlineSigner);
          accounts = await offlineSigner.getAccounts();	// user accounts
          queryHandler = CosmWasmClient.queryContractSmart;	// A less verbose reference to handle our queries	
          
          console.log('Wallet connected', {
            offlineSigner: offlineSigner,
            CosmWasmClient: CosmWasmClient,
            accounts: accounts,
            chain: ChainInfo,
            queryHandler: queryHandler,
          });
          const ContractAddress = CONTRACT_TESTNET_ADDRESS;
          const client = await ArchwayClient.connect(ChainInfo.rpc);
          const address = accounts[0].address;
          const entrypoint = {
            profile: {
              id:  address
            },
          };
        
          let {arch_id, available, hour_rate } = await client.queryContractSmart(ContractAddress, entrypoint);
          setDomainName(arch_id);
          setAvailabilty(available);
          setHourRate(hour_rate);
          

          // get metadata from IPFS
          let res = await client.queryContractSmart(ContractAddress, entrypoint);
          let ipfsHash = res.meta_data.description;
          setIpfsHash(ipfsHash);
          console.log("Profile", ipfsHash);

          const AuthHeader = 'Basic ' + Buffer.from(INFURA_API_KEY + ":" + INFURA_API_SECRET).toString('base64');

          const ipfsClient = await create({
            host: 'ipfs.infura.io',
            port: 5001,
            protocol: 'https',
            headers: {
              'Authorization': AuthHeader
            }
          });

          const offChainMetadata = ipfsClient.cat(ipfsHash);
          console.log("Offchain metadata: ",offChainMetadata );          
        } else {
          console.warn('Error accessing experimental features, please update Keplr');
  
        }
      } else {
        console.warn('Error accessing Keplr, please install Keplr');
      }
    }
    getProfile();
  }, [])

  // create profile
 const createProfile = async() => {
  if (window['keplr']) {
    if (window.keplr['experimentalSuggestChain']) {
      await window.keplr.enable(ChainInfo.chainId);
      window.keplr.defaultOptions = {
        sign: {
          preferNoSetFee: true,    
        }   
      }

      const offlineSigner = await window.getOfflineSignerAuto(ChainInfo.chainId);
      CosmWasmClient = await SigningArchwayClient.connectWithSigner(ChainInfo.rpc, offlineSigner);
      accounts = await offlineSigner.getAccounts();	// user accounts
      queryHandler = CosmWasmClient.queryContractSmart;	// A less verbose reference to handle our queries	
      
      console.log('Wallet connected', {
        offlineSigner: offlineSigner,
        CosmWasmClient: CosmWasmClient,
        accounts: accounts,
        chain: ChainInfo,
        queryHandler: queryHandler,
      });

      // create profile txn
      const ContractAddress = CONTRACT_TESTNET_ADDRESS;
      let cost = '1000000000000000000'
      let funds = [{
        denom: 'aconst',
        amount: cost,
      }]

      const create_profile_entry_point = {
        create_profile: {
          name: createNewProfileName,
          hour_rate: createNewProfileRate,
          cost: cost
        }
      }
      let create_profile_tx = await CosmWasmClient.execute(accounts[0].address, ContractAddress, create_profile_entry_point, 'auto', "Registering domain", funds);
      console.log("Create Profile with txn hash", create_profile_tx);

      setCreateProfileModalIsOpen(false)
    } else {
      console.warn('Error accessing experimental features, please update Keplr');

    }
  } else {
    console.warn('Error accessing Keplr, please install Keplr');
  }
 }  

    return (
        <>
          <div className="md:w-12/12">
            {
              domainName ? 
              <>
                <div className="flex flex-row justify-end items-end md:pr-28 mt-10">
                    <p className="bg-orange-600 rounded-md text-white p-2 hover:bg-white hover:border hover:border-orange-600 hover:text-orange-600 transition-all duration-300 ease-linear">{domainName}</p>
                </div>
              </>
            
            :

              <>
                <div className="flex flex-row justify-end items-end md:pr-28 mt-10">
                    <p className="bg-orange-600 rounded-md text-white p-2 hover:bg-white hover:border hover:border-orange-600 hover:text-orange-600 transition-all duration-300 ease-linear"
                    onClick={e => setCreateProfileModalIsOpen(true)}>
                      {"create profile"}
                      </p>
                </div>
              </>
            }

            {
              createProfileModalIsOpen && 
              <>
                 <dialog
                    className="fixed left-0 top-0 w-full h-full bg-black bg-opacity-50 z-50 overflow-auto backdrop-blur flex justify-center items-center">
                    <div className="bg-white m-auto py-6 px-16 flex justify-center items-center">
                        <div className="flex flex-col items-center">
                          <label className="text-orange-600 font-semibold">
                            Name: {" "}
                            <input 
                              value={createNewProfileName}
                              onChange={e => setCreateNewProfileName(e.currentTarget.value)}
                              className="border border-md border-orange-600" type="text" name="name" 
                            />
                          </label> 
                          <label className="text-orange-600 font-semibold pt-8">
                            Rate: {" "}
                            <input 
                              value={createNewProfileRate}
                              onChange={e => setCreateNewProfileRate(e.currentTarget.value)}
                              className="border border-md border-orange-600" type="text" name="name" 
                            />
                          </label> 
                          <br/>
                          <button type="button" className="bg-orange-600 text-white p-2 rounded-md border-xl" onClick={createProfile}>Create Profile</button>
                        </div>
                    </div>
                </dialog>
              </> 
            }
              

            <div className='flex flex-row justify-center items-center md:ml-44 mt-12 ml-24'>
              <div className='block p-2 mx-8 rounded-lg border border-orange-600 bg-inherit bg-opacity-100'>
                <div className='block pt-0 px-2 w-72 md:w-[36rem]'>
                  <div className='inline-flex flex-col justify-start items-start'>
                    <div className='flex justify-start'>
                      <h className='text-orange-600 text-md font-semibold leading-tight mb-2 mr-24 md:mr-96'>
                        {" "}
                        Skills
                      </h>
                    </div>
                    <div className='inline-flex flex-row'>
                      <p className='text-gray-900 text-base mb-2'>technical writing</p>
                      <hr className=' border border-gray-200 h-6 mx-2 md:mx-4'></hr>
                      <p className='text-gray-900 text-base mb-2'>Copy writing</p>
                      <hr className=' border border-gray-200 h-6 mx-2 md:mx-4'></hr>
                      <p className='text-gray-900 text-base mb-2'>Social media marketing</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>{" "}

            <div className='flex flex-row justify-center items-center md:ml-44 mt-12 ml-24'>
              <div className='block p-2 mx-8 rounded-lg border border-orange-600 bg-inherit bg-opacity-100'>
                <div className='block pt-0 px-2 w-72 md:w-[36rem]'>
                  <div className='inline-flex flex-col justify-start items-start'>
                    <div className='flex justify-start'>
                      <h className='text-orange-600 text-md font-semibold leading-tight mb-2 mr-24 md:mr-96'>
                        {" "}
                        Preference
                      </h>
                    </div>
                    <div className='inline-flex flex-row'>
                      <p className='text-gray-900 text-base mb-2'>Remote</p>
                      <hr className=' border border-gray-200 h-6 mx-2 md:mx-4'></hr>
                      <p className='text-gray-900 text-base mb-2'>Contract</p>
                      <hr className=' border border-gray-200 h-6 mx-2 md:mx-4'></hr>
                      <p className='text-gray-900 text-base mb-2'>${hourRate ? hourRate : "_"}/hr</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>{" "}

            <div className='flex flex-row justify-center items-center md:ml-44 mt-12 ml-24'>
              <div className='block p-2 mx-8 rounded-lg border border-orange-600 bg-inherit bg-opacity-100'>
                <div className='block pt-0 px-2 w-72 md:w-[36rem]'>
                  <div className='inline-flex flex-col justify-start items-start'>
                    <div className='flex justify-start'>
                      <h className='text-orange-600 text-md font-semibold leading-tight mb-2 mr-24 md:mr-96'>
                        {" "}
                        Employment Status
                      </h>
                    </div>
                    <div className='inline-flex flex-row'>
                      <p className='text-gray-900 text-base mb-2'>{availability ? "Open to work" : "Not open to work"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>{" "}
          </div>
        </>
    );
}