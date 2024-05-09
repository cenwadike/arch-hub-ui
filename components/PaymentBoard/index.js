import { useEffect, useState } from "react";
import { SigningArchwayClient, ArchwayClient } from '@archwayhq/arch3.js';
import ChainInfo from 'constantine.config';
import {CONTRACT_TESTNET_ADDRESS} from "@/constants";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

let accounts, CosmWasmClient;
export default function PaymentBoard() {
  const [domainName, setDomainName] = useState();
  const [requestPaymentJobId, setRequestPaymentJobId] = useState();
  const [approvePaymentJobId, setApprovePaymentJobId] = useState()
  const [requestPaymentModalIsOpen, setRequestPaymentModalIsOpen] = useState(false);
  const [approvePaymentModalIsOpen, setApprovePaymentModalIsOpen] = useState(false)

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
              let {arch_id } = await client.queryContractSmart(ContractAddress, entrypoint);
              setDomainName(arch_id);
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

    const handleRequestPayment = async() => {
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
  
          // request payment 
          const request_payment_entry_point = {
            withdrawal_request: {
                job_id: requestPaymentJobId,
            }
        };
          try {
            let request_payment_tx = await CosmWasmClient.execute(accounts[0].address, ContractAddress, request_payment_entry_point, 'auto', "Requesting Arch-Hub Payment");
            console.log("Payment requested with txn hash", request_payment_tx);
            toast.success("Payment requested successfully!!", {
                position: toast.TOP_LEFT,
                autoClose: 6000, // Close the toast after 3 seconds
              })
          } catch (error) {
            console.error(error)
          } 

          setRequestPaymentModalIsOpen(false)
        } else {
          console.warn('Error accessing experimental features, please update Keplr');
  
        }
      } else {
        console.warn('Error accessing Keplr, please install Keplr');
      }
    }

    const handleApprovePayment = async() => {
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
    
            // approve payment 
            const approve_withdrawal_entry_point = {
                approve_withdrawal: {
                    job_id: approvePaymentJobId,
                }
            };
            try {
              let approve_withdrawal_tx = await CosmWasmClient.execute(accounts[0].address, ContractAddress, approve_withdrawal_entry_point, 'auto', "Requesting Arch-Hub Payment");
              console.log("Payment requested with txn hash", approve_withdrawal_tx);
              toast.success("Payment requested successfully!!", {
                position: toast.TOP_LEFT,
                autoClose: 6000, // Close the toast after 3 seconds
              })
            } catch (error) {
              console.error(error)
            } 
            setApprovePaymentModalIsOpen(false)
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
            {
              domainName ? 
              <>
                <div className="flex flex-row justify-end items-end md:pr-28 mt-10">
                    <p className="bg-orange-600 rounded-md text-white font-bold p-2 hover:bg-white hover:border hover:border-orange-600 hover:text-orange-600 transition-all duration-300 ease-linear">{domainName}</p>
                </div>
              </>
            
            :

              <>
                <div className="flex flex-row justify-end items-end md:pr-28 mt-10">
                    <p className="bg-orange-600 rounded-md text-white font-semibold p-2 hover:bg-white hover:border hover:border-orange-600 hover:text-orange-600 transition-all duration-300 ease-linear"
                    onClick={e => setCreateProfileModalIsOpen(true)}>
                      {"create profile"}
                      </p>
                </div>
              </>
            }

            <div className='flex flex-row justify-center items-center md:ml-44 mt-12 ml-24'>
                <button type="button" className="bg-orange-600 text-white font-semibold p-2 mt-6 px-16 rounded-md border-xl hover:bg-white hover:text-orange-600 hover:border hover:border-orange-600 transition-all duration-300 ease-linear"
                onClick={e => setRequestPaymentModalIsOpen(true)}>request payment</button>  
            </div>{" "}
            {
                requestPaymentModalIsOpen &&
                <dialog
                    className="fixed left-0 top-0 w-full h-full bg-black bg-opacity-50 z-50 overflow-auto backdrop-blur flex justify-center items-center">
                    <div className="bg-white m-auto py-6 px-16 flex justify-center items-center border rounded-lg">
                        <div className="flex flex-col items-center">
                          <label className="text-orange-600 font-semibold text-md">
                            job id: {" "}
                            <input 
                              value={requestPaymentJobId}
                              onChange={e => setRequestPaymentJobId(e.currentTarget.value)}
                              placeholder="123"
                              className="border border-md border-orange-600 ml-3 p-2 border rounded-md" type="text" name="name" 
                            />
                          </label> 
                          
                          <br/>
                          <button type="button" className="bg-orange-600 text-white font-semibold p-2 mt-6 rounded-md border-xl" onClick={handleRequestPayment}>request payment</button>
                        </div>
                    </div>
                </dialog>
            }

            <div className='flex flex-row justify-center items-center md:ml-44 mt-12 ml-24'>
                <button type="button" className="bg-orange-600 text-white font-semibold p-2 mt-6 px-16 rounded-md border-xl hover:bg-white hover:text-orange-600 hover:border hover:border-orange-600 transition-all duration-300 ease-linear"
                onClick={e => setApprovePaymentModalIsOpen(true)}>approve payment</button>  
            </div>{" "}            
            {
                approvePaymentModalIsOpen &&
                <dialog
                    className="fixed left-0 top-0 w-full h-full bg-black bg-opacity-50 z-50 overflow-auto backdrop-blur flex justify-center items-center">
                    <div className="bg-white m-auto py-6 px-16 flex justify-center items-center border rounded-lg">
                        <div className="flex flex-col items-center">
                          <label className="text-orange-600 font-semibold text-md">
                            job id: {" "}
                            <input 
                              value={approvePaymentJobId}
                              onChange={e => setApprovePaymentJobId(e.currentTarget.value)}
                              placeholder="123"
                              className="border border-md border-orange-600 ml-3 p-2 border rounded-md" type="text" name="name" 
                            />
                          </label> 
                          
                          <br/>
                          <button type="button" className="bg-orange-600 text-white font-semibold p-2 mt-6 rounded-md border-xl" onClick={handleApprovePayment}>approve payment</button>
                        </div>
                    </div>
                </dialog>
            }
        </div>
        </>
    );
}