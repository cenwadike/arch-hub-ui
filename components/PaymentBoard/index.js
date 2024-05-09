import { useEffect, useState } from "react";
import { SigningArchwayClient, ArchwayClient } from '@archwayhq/arch3.js';
import ChainInfo from 'constantine.config';
import {CONTRACT_TESTNET_ADDRESS} from "@/constants";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

let accounts, CosmWasmClient;
export default function PaymentBoard() {
  const [domainName, setDomainName] = useState();
  const [availability, setAvailabilty] = useState();

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
            
            const ContractAddress = CONTRACT_TESTNET_ADDRESS;
            const client = await ArchwayClient.connect(ChainInfo.rpc);
            const address = accounts[0].address;
            const entrypoint = {
              profile: {
                id:  address
              },
            };
          
            try {
              let {arch_id, available } = await client.queryContractSmart(ContractAddress, entrypoint);
              setDomainName(arch_id);
              setAvailabilty(available);
            } catch (error) {
              console.log(error)
            }
          } else {
            console.warn('Error accessing experimental features, please update Keplr');
          }
        } else {
          console.warn('Error accessing Keplr, please install Keplr');
        }
      }
      getProfile();
    }, [])

    const handleChangeAvailability = async() => {
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
          const ContractAddress = CONTRACT_TESTNET_ADDRESS;
        
  
          // set availability 
          const set_availability_entry_point = {
            set_availability: {
              name: domainName,
              available: !availability,  
            }
          }
          try {
            let set_availability_tx = await CosmWasmClient.execute(accounts[0].address, ContractAddress, set_availability_entry_point, 'auto', "Updating Arch-Hub availability");
            console.log("Update Profile availability with txn hash", set_availability_tx);
          } catch (error) {
            console.error(error)
          } 
        } else {
          console.warn('Error accessing experimental features, please update Keplr');
  
        }
      } else {
        console.warn('Error accessing Keplr, please install Keplr');
      }
    }
  

    return (
        <>
        <ToastContainer />
        <div className="md:w-12/12">
          <div className="flex flex-row justify-end items-center md:pr-28 mt-10 pr-6">
                <p className="bg-orange-600 rounded-xl text-white p-2">{domainName}</p>
          </div>

          <div className='flex flex-row justify-center items-center md:ml-44 mt-12 ml-24'>
              <div className='block p-2 mx-8 rounded-lg border border-orange-600 bg-inherit bg-opacity-100'>
                <div className='block pt-0 px-2 w-72 md:w-[36rem]'>
                  <div className='inline-flex flex-col justify-start items-start'>
                    <div className='flex justify-start'>
                      <h className='text-orange-600 text-md font-semibold leading-tight mb-2 mr-24 md:mr-96'>
                        {" "}
                        Employment Status
                      </h>
                      {
                        availability == false && 
                        <label class="inline-flex items-center cursor-pointer">
                          <input type="checkbox" value="" class="sr-only peer"
                          onClick={handleChangeAvailability}/>
                          <div class="relative w-11 h-6 bg-orange-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-600 dark:peer-focus:ring-orange-600 rounded-full peer dark:bg-orange-100 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-orange-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-orange-600 peer-checked:bg-orange-600"></div>
                        </label>
                      }
                      {
                        availability == true && 
                        <label class="inline-flex items-center cursor-pointer">
                          <input type="checkbox" value="" class="sr-only peer"
                          onClick={handleChangeAvailability}/>
                          <div class="relative w-11 h-6 bg-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-white dark:peer-focus:ring-white rounded-full peer dark:bg-orange-600 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-orange-600 after:border-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-white peer-checked:bg-white"></div>
                        </label>
                      }
                    </div>
                    <div className='inline-flex flex-row'>
                      <p className='text-gray-900 text-base mb-2'>{availability ? "Open to work" : "Occupied"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>{" "}
        </div>
        </>
    );
}