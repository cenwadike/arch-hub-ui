// TODO:add integration to UI 
import { SigningArchwayClient, ArchwayClient } from '@archwayhq/arch3.js';
import ChainInfo from 'constantine.config';
import {CONTRACT_TESTNET_ADDRESS, INFURA_API_KEY, INFURA_API_SECRET} from "@/constants";
import { useEffect, useState} from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

let accounts, CosmWasmClient;
export default function ReviewBoard() {
  const [reviewIpfsHash, setReviewIpfsHash] = useState();
  const [jobId, setJobId] = useState();
  const [reviewContent, setReviewContent] = useState();

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
  
        const view_review_entry_point = {
          single_job: {
            job_id:  jobId
          }
        }
        try {
          let view_review_tx = await CosmWasmClient.execute(accounts[0].address, ContractAddress, view_review_entry_point, 'auto', "Viewing job review on Arch-Hub", funds);
          console.log("Review viewed successfully", view_review_tx);
        
          toast.success("Hurray! review viewed successfully!!", {
            position: toast.TOP_LEFT,
            autoClose: 6000, // Close the toast after 3 seconds
          })
        } catch (error) {
          toast.error('Oops! Could not create job.', {
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
  
        const add_review_entry_point = {
          review: {
            job_id: jobId,
            review: reviewIpfsHash
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
          toast.error('Oops! Could not create job.', {
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
  }
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
                        Client review
                      </h>
                    </div>
                    <div className='inline-flex flex-row'>
                      <p className='text-gray-900 text-base mb-2'>Contract went smoo...</p>
                    </div>
                  </div>
      
                  <div className='inline-flex flex-col'>
                    <p className='text-gray-900 text-base mb-2'></p>
                    <p className='text-blue-600 text-base mb-2'>read &rarr;</p>
                  </div>
                </div>
              </div>
            </div>{" "}
          </div>
        </>
    );
}