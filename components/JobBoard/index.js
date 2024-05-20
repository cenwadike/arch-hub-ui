import { SigningArchwayClient, ArchwayClient } from '@archwayhq/arch3.js';
import ChainInfo from 'constantine.config';
import {CONTRACT_TESTNET_ADDRESS} from "@/constants";
import { useEffect, useState} from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

let accounts, CosmWasmClient;
export default function JobBoard() {
  const [createJobModalIsOpen, setCreateJobModalIsOpen] = useState(false);
  const [viewJobModalIsOpen, setViewJobModalIsOpen] = useState(false)
  const [assignedContractor, setassignedContractor] = useState();
  const [assignedDuration, setassignedDuration] = useState();
  const [viewJobId, setViewJobId] = useState();
  const [jobId, setJobId] = useState();
  const [contractorId, setContractorId] = useState();
  const [customerId, setCustomerId] = useState();
  const [jobRate, setJobRate] = useState();
  const [jobDuration, setJobDuration] = useState();
  const [jobStatus, setJobStatus] = useState();
  const [jobStartTime, setJobStartTime] = useState();
  const [jobModalIsOpen, setJobModalIsOpen] = useState();

    useEffect( () => {
      async function handleLoadCreatedJobs() {
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
      handleLoadCreatedJobs()
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
                  account_id: address,
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

    const handleCreateJob = async() => {
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
          accounts = await offlineSigner.getAccounts();	
    
          // update profile txn
          const ContractAddress = CONTRACT_TESTNET_ADDRESS;
          let cost = '1000000000000000000'
          let funds = [{
            denom: 'aconst',
            amount: cost,
          }]
    
          let duration = parseInt(assignedDuration)
          const request_contractor_entry_point = {
            job_request: {
              contractor_domain: assignedContractor,
              duration: duration,
          }
          }
          try {
            let request_contractor_tx = await CosmWasmClient.execute(accounts[0].address, ContractAddress, request_contractor_entry_point, 'auto', "Requesting contractor on Arch-Hub", funds);
            console.log("Update Profile metadata with txn hash", request_contractor_tx);
          
            toast.success("Hurray! contractor requested successfully!!", {
              position: toast.TOP_LEFT,
              autoClose: 6000, // Close the toast after 3 seconds
            })
          } catch (error) {
            toast.error('Oops! Could not create job. Contractor is not available', {
              position: toast.TOP_LEFT,
              autoClose: 6000, // Close the toast after 3 seconds
            });
            console.log(error)
          }
    
          setCreateJobModalIsOpen(false)
        } else {
          console.warn('Error accessing experimental features, please update Keplr');
    
        }
      } else {
        console.warn('Error accessing Keplr, please install Keplr');
      }
    
      setCreateJobModalIsOpen(false);
    }

    const handleViewJob = async() => {
      setViewJobModalIsOpen(false)
      setJobModalIsOpen(true)

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
          accounts = await offlineSigner.getAccounts();	
    
          // update profile txn
          const contractAddress = CONTRACT_TESTNET_ADDRESS;
            const client = await ArchwayClient.connect(ChainInfo.rpc);
    
            

            try {
              let id = parseInt(viewJobId)
              const msg = {
                single_job: {
                    job_id:  id
                },
              };
            
              const {job_id, customer_domain, contrator_domain, rate, length, status, start_time} = await client.queryContractSmart(
                contractAddress,
                msg
              );
            
              setJobId(job_id)
              setCustomerId(customer_domain);
              setContractorId(contrator_domain);
              setJobRate(rate);
              setJobDuration(length);
              setJobStatus(status);
              setJobStartTime(start_time);

              console.log("single job: ", jobId, contractorId, customerId, jobDuration, jobRate, jobStartTime, jobStartTime);

            } catch (error) {
              console.error(error)
            }

        } else {
          console.warn('Error accessing experimental features, please update Keplr');
    
        }
      } else {
        console.warn('Error accessing Keplr, please install Keplr');
      }
    
      setCreateJobModalIsOpen(false);
    }

    return (
        <>
          <ToastContainer />
          <div className="md:w-12/12">
            <div className='flex flex-row justify-center items-center md:ml-44 mt-12 ml-6'>
              <div className='block p-2 mx-8 rounded-lg border border-orange-600 bg-inherit bg-opacity-100'>
                <div className='block pt-0 px-2 w-72 md:w-[36rem]'>
                  <div className='inline-flex flex-col justify-start items-start'>
                    <div className='flex justify-start'>
                      <h className='text-orange-600 text-md font-semibold leading-tight mb-2 mr-24 md:mr-96'>
                        {" "}
                        Created Jobs
                      </h>
                    </div>
                    <div className='inline-flex flex-row'>
                      <p className='text-gray-900 text-base mb-2'>job id...</p>
                    </div>
                  </div>
      
                  <div className='inline-flex flex-col'>
                    <p className='text-gray-900 text-base mb-2'></p>
                    <p className='text-blue-600 text-base mb-2'>$price</p>
                  </div>
                </div>
              </div>
            </div>{" "}

            {/* assigned jobs */}
            <div className='flex flex-row justify-center items-center md:ml-44 mt-12 ml-6'>
              <div className='block p-2 mx-8 rounded-lg border border-orange-600 bg-inherit bg-opacity-100'>
                <div className='block pt-0 px-2 w-72 md:w-[36rem]'>
                  <div className='inline-flex flex-col justify-start items-start'>
                    <div className='flex justify-start'>
                      <h className='text-orange-600 text-md font-semibold leading-tight mb-2 mr-24 md:mr-96'>
                        {" "}
                        Assigned Jobs
                      </h>
                    </div>
                    <div className='inline-flex flex-row'>
                      <p className='text-gray-900 text-base mb-2'>job id</p>
                    </div>
                  </div>
      
                  <div className='inline-flex flex-col'>
                    <p className='text-gray-900 text-base mb-2'></p>
                    <p className='text-blue-600 text-base mb-2'>$price</p>
                  </div>
                </div>
              </div>
            </div>{" "}
          <div className='flex flex-row justify-center items-center content-center pt-12 mx-8 bg-opacity-100'>
            <p className="bg-orange-600 rounded-md text-white font-semibold mx-48 py-3 px-24 hover:bg-white hover:border hover:border-orange-600 hover:text-orange-600 transition-all duration-300 ease-linear"
              onClick={e => setCreateJobModalIsOpen(true)}>
                create job
            </p>
            <p className="bg-orange-600 rounded-md text-white font-semibold mx-12 py-3 px-24 hover:bg-white hover:border hover:border-orange-600 hover:text-orange-600 transition-all duration-300 ease-linear"
              onClick={e => setViewJobModalIsOpen(true)}>
                view job
            </p>
          </div>
          {
          createJobModalIsOpen &&
            <dialog
            className="fixed left-0 top-0 w-full h-full bg-black bg-opacity-50 z-50 overflow-auto backdrop-blur flex justify-center items-center">
              <div className="bg-white m-auto py-6 px-16 flex justify-center items-center border rounded-lg">
                  <div className="flex flex-col items-center">
                      <label className="text-orange-600 font-semibold text-md">
                        contractor id: {" "}
                        <input 
                          value={assignedContractor}
                          onChange={e => setassignedContractor(e.currentTarget.value)}
                          placeholder="name.arch"
                          className="border border-md border-orange-600  p-2 ml-10 rounded-md" type="text" name="name" 
                        />
                      </label> 
                      <label className="text-orange-600 font-semibold pt-6 pl-0 text-md">
                        duration (hrs):
                        <input 
                          value={assignedDuration}
                          onChange={e => setassignedDuration(e.currentTarget.value)}
                          placeholder="100"
                          className="border border-md border-orange-600 ml-9 p-2 rounded-md" type="text" name="name" 
                        />
                      </label>
                    <br/>
                    <button type="button" className="bg-orange-600 text-white font-semibold p-2 mt-6 rounded-md border-xl hover:bg-orange-900 transition-all duration-300 ease-linear" onClick={handleCreateJob}>confirm</button> 
                  </div>                
              </div>
            </dialog>
          }

          {
            viewJobModalIsOpen &&
            <dialog
            className="fixed left-0 top-0 w-full h-full bg-black bg-opacity-50 z-50 overflow-auto backdrop-blur flex justify-center items-center">
              <div className="bg-white m-auto py-6 px-16 flex justify-center items-center border rounded-lg">
                  <div className="flex flex-col items-center">
                  <label className="text-orange-600 font-semibold text-md">
                        job id: {" "}
                        <input 
                          value={viewJobId}
                          onChange={e => setViewJobId(e.currentTarget.value)}
                          placeholder="1"
                          className="border border-md border-orange-600 ml-3 p-2 border rounded-md" 
                          type="text"
                          name="name" 
                        />
                      </label> 
                    <br/>
                    <button type="button" className="bg-orange-600 text-white font-semibold p-2 mt-6 rounded-md border-xl hover:bg-orange-900 transition-all duration-300 ease-linear" onClick={handleViewJob}>confirm</button> 
                  </div>                
              </div>
            </dialog>
          }

          { 
            jobModalIsOpen &&
            <dialog
            className="fixed left-0 top-0 w-full h-full bg-black bg-opacity-50 z-50 overflow-auto backdrop-blur flex justify-center items-center">
              <div className="bg-white m-auto py-6 px-16 flex justify-center items-center border rounded-lg">
                  <div className="flex flex-col items-center">
                      <label className="text-orange-600 font-semibold text-md">
                        job id: {" "}
                        <input 
                          placeholder={jobId}
                          className="border border-md border-orange-600 p-2 ml-20 rounded-md" type="text" 
                        />
                      </label> 
                      <label className="text-orange-600 font-semibold pt-6 pl-0 text-md">
                        contractor id:
                        <input 
                          placeholder={contractorId}
                          className="border border-md border-orange-600 ml-7 p-2 rounded-md" type="text" 
                        />
                      </label>
                      <label className="text-orange-600 font-semibold pt-6 text-md">
                        consumer id: {" "}
                        <input 
                          placeholder={customerId}
                          className="border border-md border-orange-600 p-2 ml-8 rounded-md" type="text" 
                        />
                      </label> 
                      <label className="text-orange-600 font-semibold pt-6 text-md">
                        rate: {" "}
                        <input 
                          placeholder={jobRate}
                          className="border border-md border-orange-600 p-2 ml-24 rounded-md" type="text" 
                        />
                      </label> 
                      <label className="text-orange-600 font-semibold pt-6 text-md">
                        duration: {" "}
                        <input 
                          placeholder={jobDuration}
                          className="border border-md border-orange-600 p-2 ml-16 rounded-md" type="text" 
                        />
                      </label> 
                      <label className="text-orange-600 font-semibold pt-6 text-md">
                        start at: {" "}
                        <input 
                          placeholder={jobStartTime}
                          className="border border-md border-orange-600 p-2 ml-16 rounded-md" type="text" 
                        />
                      </label> 
                      <label className="text-orange-600 font-semibold pt-6 text-md">
                        status: {" "}
                        <input 
                          placeholder={jobStatus}
                          className="border border-md border-orange-600 p-2 ml-16 rounded-md" type="text" 
                        />
                      </label> 
                    <br/>
                    <button type="button" className="bg-orange-600 text-white font-semibold p-2 mt-6 rounded-md border-xl hover:bg-orange-900 transition-all duration-300 ease-linear" onClick={e => setJobModalIsOpen(false)}>close</button> 
                  </div>                
              </div>
            </dialog>
          }
          </div>

        </>
    );
}