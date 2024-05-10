import { SigningArchwayClient, ArchwayClient } from '@archwayhq/arch3.js';
import ChainInfo from 'constantine.config';
import {CONTRACT_TESTNET_ADDRESS, INFURA_API_KEY, INFURA_API_SECRET} from "@/constants";
import { useEffect} from "react";;

let accounts, CosmWasmClient;
export default function JobBoard() {
    useEffect( () => {
      async function handleCreatedJobs() {
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
            
            const contractAddress = CONTRACT_TESTNET_ADDRESS;
            const client = await ArchwayClient.connect(ChainInfo.rpc);
            const address = accounts[0].address;
    
            try {
              const msg = {
                contractor_job: {
                  account_id:  address,
                },
              };
            
              const query = await client.queryContractSmart(
                contractAddress,
                msg
              );
            
              console.log("created jobs: ", query);
            
              } catch (error) {
                console.log('error', error)
              }
          } else {
            console.warn('Error accessing experimental features, please update Keplr');
    
          }
        } else {
          console.warn('Error accessing Keplr, please install Keplr');
        }
      }
      handleCreatedJobs()
    }, [])
  
    useEffect( () => {
      async function handleLoadAssignedJobs() {
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
            
            const contractAddress = CONTRACT_TESTNET_ADDRESS;
            const client = await ArchwayClient.connect(ChainInfo.rpc);
            const address = accounts[0].address;
    
            try {
              const msg = {
                customer_job: {
                  account_id:  address,
                },
              };
            
              const query = await client.queryContractSmart(
                contractAddress,
                msg
              );
            
              console.log("assigned jobs: ", query);
            
              } catch (error) {
                console.log('error', error)
              }
          } else {
            console.warn('Error accessing experimental features, please update Keplr');
    
          }
        } else {
          console.warn('Error accessing Keplr, please install Keplr');
        }
      }
      handleLoadAssignedJobs()
    }, [])
    return (
        <>
          <div className="md:w-12/12">
          <div className='flex flex-row justify-center items-center md:ml-44 mt-12 ml-6'>
            <div className='block p-2 mx-8 rounded-lg border border-orange-600 bg-inherit bg-opacity-100'>
              <div className='block pt-0 px-2 w-72 md:w-[36rem]'>
                <div className='inline-flex flex-col justify-start items-start'>
                  <div className='flex justify-start'>
                    <h className='text-orange-600 text-md font-semibold leading-tight mb-2 mr-24 md:mr-96'>
                      {" "}
                      Technical article
                    </h>
                  </div>
                  <div className='inline-flex flex-row'>
                    <p className='text-gray-900 text-base mb-2'>Contract</p>
                    <hr className=' border border-gray-200 h-6 mx-2 md:mx-4'></hr>
                    <p className='text-gray-900 text-base mb-2'>&#36;50/hr</p>
                  </div>
                </div>
    
                <div className='inline-flex flex-col'>
                  <p className='text-gray-900 text-base mb-2'></p>
                  <p className='text-gray-900 text-base mb-2'>&#36;500</p>
                </div>
              </div>
            </div>
          </div>{" "}
          </div>
        </>
    );
}