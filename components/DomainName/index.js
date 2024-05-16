import { SigningArchwayClient, ArchwayClient } from '@archwayhq/arch3.js';
import ChainInfo from 'constantine.config';
import {CONTRACT_TESTNET_ADDRESS} from "@/constants";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

let accounts, CosmWasmClient, queryHandler;

export default function DomainName() {
    const [domainName, setDomainName] = useState()
    const [createProfileModalIsOpen, setCreateProfileModalIsOpen] = useState();
    const [createNewProfileName, setCreateNewProfileName] = useState();
    const [createNewProfileRate, setCreateNewProfileRate] = useState();

    // load domain name
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
      try {
        let create_profile_tx = await CosmWasmClient.execute(accounts[0].address, ContractAddress, create_profile_entry_point, 'auto', "Registering domain", funds);
        console.log("Create Profile with txn hash", create_profile_tx);
        toast.success("Hurray! Profile created successfully!!", {
          position: toast.TOP_LEFT,
          autoClose: 6000, // Close the toast after 3 seconds
        })
      } catch (error) {
        toast.error('Oops! Could not create profile. Use a unique name', {
          position: toast.TOP_LEFT,
          autoClose: 6000, // Close the toast after 3 seconds
        });
        console.log(error)
      }

      setCreateProfileModalIsOpen(false)
    } else {
      console.warn('Error accessing experimental features, please update Keplr');

    }
  } else {
    console.warn('Error accessing Keplr, please install Keplr');
  }
 }  

    return(
        <div className="md:w-12/12">
          <ToastContainer />
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

{
              createProfileModalIsOpen && 
              <>
                 <dialog
                    className="fixed left-0 top-0 w-full h-full bg-black bg-opacity-50 z-50 overflow-auto backdrop-blur flex justify-center items-center">
                    <div className="bg-white m-auto py-6 px-16 flex justify-center items-center border rounded-lg">
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
        </div>
    )
}