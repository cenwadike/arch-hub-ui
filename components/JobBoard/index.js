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
  const [createdJobs, setCreatedJobs] = useState([]);
  const [assignedJobs, setAssignedJobs] = useState([]);
  const [displayedJobStatus, setDisplayedJobStatus] = useState()
  const [acceptJobId, setAcceptJobId] = useState();
  const [acceptJobModalIsOpen, setAcceptJobModalIsOpen] = useState(false)

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
                customer_job: {
                  account_id: address,
                },
              };
            
              const {jobs} = await client.queryContractSmart(
                contractAddress,
                msg
              );
              setCreatedJobs(jobs)
              console.log("created jobs: ", createdJobs);
            
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
                contractor_job: {
                  account_id:  address,
                },
              };
            
              const {jobs} = await client.queryContractSmart(
                contractAddress,
                msg
              );
              setAssignedJobs(jobs)
              console.log("assigned jobs: ", assignedJobs);
            
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
            console.log("Requested contractor with txn hash", request_contractor_tx);
          
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

    const handleAcceptJob = async() => {
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
    
          let jobId = parseInt(acceptJobId)
          const accept_job_entry_point = {
            accept_request: {
              job_id: jobId,
          }
          }
          try {
            let accept_job_entry_point_tx = await CosmWasmClient.execute(accounts[0].address, ContractAddress, accept_job_entry_point, 'auto', "Accepting Gig on Arch-Hub", funds);
            console.log("Accepted job with txn hash", accept_job_entry_point_tx);
          
            toast.success("Hurray! job accepted successfully!!", {
              position: toast.TOP_LEFT,
              autoClose: 6000, // Close the toast after 3 seconds
            })
          } catch (error) {
            toast.error('Oops! Could not accept job. Try again', {
              position: toast.TOP_LEFT,
              autoClose: 6000, // Close the toast after 3 seconds
            });
            console.log(error)
          }
    
          setAcceptJobModalIsOpen(false)
        } else {
          console.warn('Error accessing experimental features, please update Keplr');
    
        }
      } else {
        console.warn('Error accessing Keplr, please install Keplr');
      }    
    }

    const handleViewJob = async() => {
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
;
              setViewJobModalIsOpen(false)
              setJobModalIsOpen(true)
          
            } catch (error) {
              toast.error('Oops! Could not find job with this id.', {
                position: toast.TOP_LEFT,
                autoClose: 6000, // Close the toast after 3 seconds
              });
              setViewJobModalIsOpen(false)
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
            {/* created jobs */}
            <div className='flex flex-row justify-center items-center md:ml-44 mt-12 ml-24'>
              <div className='block p-2 mx-8 rounded-lg border border-orange-600 bg-inherit bg-opacity-100'>
                <div className='block pt-0 px-2 w-72 md:w-[36rem]'>
                  <div className='inline-flex flex-col justify-start items-start'>
                    <div className='flex justify-start'>
                      <h className='text-orange-600 text-md font-bold leading-tight mb-2 mr-24 md:mr-96'>
                        {" "}
                        CREATED JOBS
                      </h>
                    </div>
                    <div className='' >
                      <table className='divide-gray-200 text-orange-600'> 
                        <thead>
                          <tr>
                            <th className='px-36 py-4'>job ids</th>
                          </tr>
                        </thead>
                        <tbody>
                          {createdJobs.map(job => 
                            <tr key={job}>
                              <td className='px-40 py-4'>{job}</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>{" "}

            {/* assigned jobs */}
            <div className='flex flex-row justify-center items-center md:ml-44 mt-12 ml-24'>
              <div className='block p-2 mx-8 bg-inherit bg-opacity-100'>
                <div className='block pt-0 px-2 w-72 md:w-[36rem]'>
                  <div className='inline-flex flex-col justify-start items-start'>
                    <div className='flex justify-start'>
                      <h className='text-orange-600 text-md font-bold leading-tight mb-2 mr-24 md:mr-96'>
                        {" "}
                        ASSIGNED JOBS
                      </h>
                    </div>
                    <div className='' >
                      <table className='divide-gray-200 text-orange-600'> 
                        <thead>
                          <tr>
                            <th className='px-36 py-4 pr-32'>job ids</th>
                            <th className='px-36 py-4'>status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {assignedJobs.map(job => 
                            <tr key={job}>
                              <td className='px-40 py-4'>{job}</td>
                              <td className='py-4 p-0'>
                                <p className="bg-orange-600 rounded-md text-white font-semibold mx-8 py-2 px-24 hover:bg-white hover:border hover:border-orange-600 hover:text-orange-600 transition-all duration-300 ease-linear"
                                  onClick={e => setAcceptJobModalIsOpen(true)}
                                  >
                                    accept job
                                </p>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
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
                          readOnly
                        />
                      </label> 
                      <label className="text-orange-600 font-semibold pt-6 pl-0 text-md">
                        contractor id:
                        <input 
                          placeholder={contractorId}
                          className="border border-md border-orange-600 ml-7 p-2 rounded-md" type="text" 
                          readOnly
                        />
                      </label>
                      <label className="text-orange-600 font-semibold pt-6 text-md">
                        consumer id: {" "}
                        <input 
                          placeholder={customerId}
                          className="border border-md border-orange-600 p-2 ml-8 rounded-md" type="text"
                          readOnly 
                        />
                      </label> 
                      <label className="text-orange-600 font-semibold pt-6 text-md">
                        rate: {" "}
                        <input 
                          placeholder={jobRate}
                          className="border border-md border-orange-600 p-2 ml-24 rounded-md" type="text" 
                          readOnly
                        />
                      </label>
                      <label className="text-orange-600 font-semibold pt-6 text-md">
                        status: {" "}
                        <input 
                          placeholder={jobStatus}
                          className="border border-md border-orange-600 p-2 ml-20 rounded-md" type="text" 
                          readOnly
                        />
                      </label> 
                    <br/>
                    <button type="button" className="bg-orange-600 text-white font-semibold p-2 mt-6 rounded-md border-xl hover:bg-orange-900 transition-all duration-300 ease-linear" onClick={e => setJobModalIsOpen(false)}>close</button> 
                  </div>                
              </div>
            </dialog>
          }

          {
            acceptJobModalIsOpen &&
            <dialog
            className="fixed left-0 top-0 w-full h-full bg-black bg-opacity-50 z-50 overflow-auto backdrop-blur flex justify-center items-center">
              <div className="bg-white m-auto py-6 px-16 flex justify-center items-center border rounded-lg">
                  <div className="flex flex-col items-center">
                  <label className="text-orange-600 font-semibold text-md">
                        job id: {" "}
                        <input 
                          value={acceptJobId}
                          onChange={e => setAcceptJobId(e.currentTarget.value)}
                          placeholder="1"
                          className="border border-md border-orange-600 ml-3 p-2 border rounded-md" 
                          type="text"
                          name="name" 
                        />
                      </label> 
                    <br/>
                    <button type="button" className="bg-orange-600 text-white font-semibold p-2 mt-6 rounded-md border-xl hover:bg-orange-900 transition-all duration-300 ease-linear" onClick={handleAcceptJob}>confirm</button> 
                  </div>                
              </div>
            </dialog>
          }
          </div>

        </>
    );
}