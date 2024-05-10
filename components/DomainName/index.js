import { SigningArchwayClient, ArchwayClient } from '@archwayhq/arch3.js';
import ChainInfo from 'constantine.config';
import {CONTRACT_TESTNET_ADDRESS} from "@/constants";
import { useEffect, useState } from "react";

let accounts, CosmWasmClient;

export default function DomainName() {
    const [domainName, setDomainName] = useState()

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

    return(
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
        </div>
    )
}