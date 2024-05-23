import { SigningArchwayClient, ArchwayClient } from '@archwayhq/arch3.js';
import ChainInfo from 'constantine.config';
import {CONTRACT_TESTNET_ADDRESS, INFURA_API_KEY, INFURA_API_SECRET} from "@/constants";
import { useEffect, useState} from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { create } from "ipfs-http-client";
import {concat} from 'uint8arrays'

let accounts, CosmWasmClient;
export default function ReviewBoard() {
  const [reviewIpfsHash, setReviewIpfsHash] = useState();
  const [jobId, setJobId] = useState();
  const [reviewContent, setReviewContent] = useState();
  const [createJobReviewModalIsOpen, setCreateJobReviewModalIsOpen] = useState();
  const [viewJobReviewModalIsOpen, setViewJobReviewModalIsOpen] = useState();
  const [offchainReviewContent, setOffchainReviewContent] = useState();
  const [reviewModalIsOpen, setReviewModalIsOpen] = useState(false);
  const [contractorDomainName, setContractorDomainName] = useState();
  const [clientDomainName, setClientDomainName] = useState();
  const [jobRate, setJobRate] = useState();
  const [jobDuration, setJobDuration] = useState()
  const [jobStatus, setJobStatus] = useState()

  const handleViewJobReview = async() => {
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

        // add review txn
        const ContractAddress = CONTRACT_TESTNET_ADDRESS;
        let cost = '1000000000000000000'
        let funds = [{
          denom: 'aconst',
          amount: cost,
        }]
  
        const job_id = parseInt(jobId)
        const view_review_entry_point = {
          review: {
            job_id:  job_id,
          },
        }
        try {
          const client = await ArchwayClient.connect(ChainInfo.rpc);
          const {review, contrator_domain, customer_domain, rate, lenth, status} = await client.queryContractSmart(ContractAddress, view_review_entry_point);
          setClientDomainName(customer_domain);
          setContractorDomainName(contrator_domain);
          setJobRate(rate);
          setJobDuration(lenth);
          setJobStatus(status);
          console.log("Review viewed successfully", review);

          const AuthHeader = 'Basic ' + Buffer.from(INFURA_API_KEY + ":" + INFURA_API_SECRET).toString('base64');

          const ipfsClient = await create({
            host: 'ipfs.infura.io',
            port: 5001,
            protocol: 'https',
            headers: {
              'Authorization': AuthHeader
            }
          });

          try {
            let chunks = [];
            for await (const chunk of ipfsClient.cat(review)) {
              chunks.push(chunk);
            }
            
            const data = concat(chunks)
            const decodedData = JSON.parse(new TextDecoder().decode(data).toString());
            console.log("Offchain review: ", decodedData.content ); 
            setOffchainReviewContent(decodedData.content)
          } catch (error) {
            console.error(error)
          }
        } catch (error) {
          toast.error('Oops! No review found', {
            position: toast.TOP_LEFT,
            autoClose: 6000, // Close the toast after 3 seconds
          });
          console.log(error)
        }

      setViewJobReviewModalIsOpen(false);
      setReviewModalIsOpen(true)
      } else {
        console.warn('Error accessing experimental features, please update Keplr');
  
      }
    } else {
      console.warn('Error accessing Keplr, please install Keplr');
    }
  }


  const handleAddJobReview = async() => {
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

        // add review to IPFS
        const AuthHeader = 'Basic ' + Buffer.from(INFURA_API_KEY + ":" + INFURA_API_SECRET).toString('base64');

          const ipfsClient = await create({
            host: 'ipfs.infura.io',
            port: 5001,
            protocol: 'https',
            headers: {
              'Authorization': AuthHeader
            }
          });

          
          const jobReview = {
            "job id": jobId,
            "content": reviewContent,            
          }

        const profileMetadataJson = JSON.stringify(jobReview);
        let {cid, path} = await ipfsClient.add(profileMetadataJson);
        setReviewIpfsHash(path)
        console.log("REVIEW ADDED TO IPFS with: ", path)
  
        // add review txn
        const ContractAddress = CONTRACT_TESTNET_ADDRESS;
        let cost = '1000000000000000000'
        let funds = [{
          denom: 'aconst',
          amount: cost,
        }]
  
        const job_id = parseInt(jobId)
        const add_review_entry_point = {
          review: {
            job_id: job_id,
            review: path
          }
        }
        try {
          let add_review_tx = await CosmWasmClient.execute(accounts[0].address, ContractAddress, add_review_entry_point, 'auto', "Adding job review on Arch-Hub", funds);
          console.log("Review added successfully", add_review_tx);
        
          toast.success("Hurray! review added successfully!!", {
            position: toast.TOP_LEFT,
            autoClose: 6000, // Close the toast after 3 seconds
          })
        } catch (error) {
          toast.error('Oops! Could not add review. Try again with more gas', {
            position: toast.TOP_LEFT,
            autoClose: 6000, // Close the toast after 3 seconds
          });
          console.log(error)
        }
  
        setCreateJobReviewModalIsOpen(false)
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
            <div className='flex flex-row justify-center items-center content-center pt-12 mx-8 bg-opacity-100'>
            <p className="bg-orange-600 rounded-md text-white font-semibold mx-48 py-3 px-24 hover:bg-white hover:border hover:border-orange-600 hover:text-orange-600 transition-all duration-300 ease-linear"
              onClick={e => setViewJobReviewModalIsOpen(true)}>
                view job review
            </p>
            </div>

            {
              viewJobReviewModalIsOpen &&
              <dialog
              className="fixed left-0 top-0 w-full h-full bg-black bg-opacity-50 z-50 overflow-auto backdrop-blur flex justify-center items-center">
                <div className="bg-white m-auto py-6 px-16 flex justify-center items-center border rounded-lg">
                    <div className="flex flex-col items-center">
                        <label className="text-orange-600 font-semibold text-md">
                          job id
                          <input 
                            value={jobId}
                            onChange={e => setJobId(e.currentTarget.value)}
                            placeholder="job id"
                            className="border-md border-orange-600 ml-3 mb-6 p-2 border rounded-md" type="text" name="name" 
                          />
                        </label>
                      <br/>
                      <button type="button" className="bg-orange-600 text-white font-semibold p-2 mt-6 rounded-md border-xl hover:bg-orange-900 transition-all duration-300 ease-linear" onClick={handleViewJobReview}>confirm</button> 
                    </div>                
                </div>
              </dialog>
            }

            <div className='flex flex-row justify-center items-center content-center pt-12 mx-8 bg-opacity-100'>
            <p className="bg-orange-600 rounded-md text-white font-semibold mx-48 py-3 px-24 hover:bg-white hover:border hover:border-orange-600 hover:text-orange-600 transition-all duration-300 ease-linear"
              onClick={e => setCreateJobReviewModalIsOpen(true)}>
                create job review
            </p>
            </div>

        {
          createJobReviewModalIsOpen &&
          <dialog
          className="fixed left-0 top-0 w-full h-full bg-black bg-opacity-50 z-50 overflow-auto backdrop-blur flex justify-center items-center">
            <div className="bg-white m-auto py-6 px-16 flex justify-center items-center border rounded-lg">
                <div className="flex flex-col items-center">
                    <label className="text-orange-600 font-semibold text-md">
                      <input 
                        value={jobId}
                        onChange={e => setJobId(e.currentTarget.value)}
                        placeholder="job id"
                        className="border-md border-orange-600 ml-3 mb-6 p-2 border rounded-md" type="text" name="name" 
                      />
                    </label> 
                    <label className="text-orange-600 font-semibold text-md">
                      
                      <textarea 
                        value={reviewContent}
                        onChange={e => setReviewContent(e.currentTarget.value)}
                        placeholder="review content"
                        className="border-md border-orange-600 ml-3 p-2 border rounded-md" type="text" name="name" 
                      />
                    </label> 
                  <br/>
                  <button type="button" className="bg-orange-600 text-white font-semibold p-2 mt-6 rounded-md border-xl hover:bg-orange-900 transition-all duration-300 ease-linear" onClick={handleAddJobReview}>confirm</button> 
                </div>                
            </div>
          </dialog>
        }
        {
          reviewModalIsOpen &&
          <dialog
          className="fixed left-0 top-0 w-full h-full bg-black bg-opacity-50 z-50 overflow-auto backdrop-blur flex justify-center items-center">
            <div className="bg-white m-auto py-6 px-16 flex justify-center items-center border rounded-lg">
                <div className="flex flex-col items-center">
                    <label className="text-orange-600 font-semibold pt-6 pl-12 text-md">
                      review:
                      <textarea 
                        placeholder={offchainReviewContent}
                        className="border border-md border-orange-600 ml-16 p-2 rounded-md" type="text" 
                        readOnly
                      />
                    </label>
                    <label className="text-orange-600 font-semibold pt-6 pl-9 text-md">
                      contractor:
                      <input 
                        placeholder={contractorDomainName}
                        className="border border-md border-orange-600 p-2 ml-12 rounded-md" type="text"
                        readOnly 
                      />
                    </label>
                    <label className="text-orange-600 font-semibold pt-6 pl-20 text-md">
                      client:
                      <input 
                        placeholder={clientDomainName}
                        className="border border-md border-orange-600 p-2 ml-12 rounded-md" type="text"
                        readOnly 
                      />
                    </label>
                    <label className="text-orange-600 font-semibold pt-6 pl-2 text-md">
                      rate ($CONST):
                      <input 
                        placeholder={jobRate}
                        className="border border-md border-orange-600 p-2 ml-12 rounded-md" type="text"
                        readOnly 
                      />
                    </label> 
                    <label className="text-orange-600 font-semibold pt-6 pl-4 text-md">
                      duration (hrs):
                      <input 
                        placeholder={jobDuration}
                        className="border border-md border-orange-600 p-2 ml-12 rounded-md" type="text"
                        readOnly 
                      />
                    </label> 
                    <label className="text-orange-600 font-semibold pt-6 pl-16 text-md">
                      status:
                      <input 
                        placeholder={jobStatus}
                        className="border border-md border-orange-600 p-2 ml-12 rounded-md" type="text"
                        readOnly 
                      />
                    </label> 
                  <br/>
                  <button type="button" className="bg-orange-600 text-white font-semibold p-2 mt-6 rounded-md border-xl hover:bg-orange-900 transition-all duration-300 ease-linear" onClick={e => setReviewModalIsOpen(false)}>close</button> 
                </div>                
            </div>
          </dialog>
        }
          </div>
        </>
    );
}