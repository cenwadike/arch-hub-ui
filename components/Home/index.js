import Link from "next/link";
import { SigningArchwayClient, ArchwayClient } from '@archwayhq/arch3.js';
import ChainInfo from 'constantine.config';
import {CONTRACT_TESTNET_ADDRESS, INFURA_API_KEY, INFURA_API_SECRET, IPFS_ENDPOINT} from "@/constants";
import { create } from "ipfs-http-client";

let accounts, CosmWasmClient, queryHandler;


export default function HomePage() {

	const handleConnectWallet = async() => {
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
						name: "komba",
						hour_rate: "10",
						cost: cost
					}
				}
				let create_profile_tx = await CosmWasmClient.execute(accounts[0].address, ContractAddress, create_profile_entry_point, 'auto', "Registering domain",
				funds);
				console.log("Create Profile with txn hash", create_profile_tx);


				// update metadata
				const AuthHeader = 'Basic ' + Buffer.from(INFURA_API_KEY + ":" + INFURA_API_SECRET).toString('base64');

				const ipfsClient = await create({
					host: 'ipfs.infura.io',
					port: 5001,
					protocol: 'https',
					headers: {
					  'Authorization': AuthHeader
					}
				});
				console.log("Created Ipfs client: ", ipfsClient);

				const profileMetadata = {
					"address": accounts[0].address,
					"portfolio": "github.com/cenwadike",
					"skills": "{}",
					"availability": true,
					"hourly_rate": "$35/hr",
					"preferences": "",
					"reviews_given": [{
						"reciver_address": "",
						"text": "",
						"created_at": ""
					}],
				}

				const profileMetadataJson = JSON.stringify(profileMetadata);
				let {cid, path} = await ipfsClient.add(profileMetadataJson);
				console.log("Ipfs upload successful: ", cid, path);


				const update_metadata_entry_point = {
					update_metadata_two: {
						name: "komba",
						update: {
							description: path,
							image: "'_'",
							accounts: [{username: "archid-protocol",profile: "https://github.com/archid-protocol",account_type: "github",verfication_hash: null}],
							websites: [{url: "https://archid.app",domain: "dapp.archid.arch",verfication_hash: null}]
						},  
					}
				}
				let update_metadata_tx = await CosmWasmClient.execute(accounts[0].address, ContractAddress, update_metadata_entry_point, 'auto', "Updating Arch-Hub profile metadata", funds);
				console.log("Update Profile metadata with txn hash", update_metadata_tx);


				// set availability 
				const set_availability_entry_point = {
					set_availability: {
						name: "komba.arch",
						available: true,  
					}
				}
				let set_availability_tx = await CosmWasmClient.execute(accounts[0].address, ContractAddress, set_availability_entry_point, 'auto', "Updating Arch-Hub availability", funds);
				console.log("Update Profile availability with txn hash", set_availability_tx);
				

				// update hourly rate
				const update_hourly_rate_entry_point = {
					update_hourly_rate: {
						name: "komba.arch",
						hour_rate: "30",    
					}
				}
				let update_hourly_rate_tx = await CosmWasmClient.execute(accounts[0].address, ContractAddress, update_hourly_rate_entry_point, 'auto', "Updating Arch-Hub hourly rate");
				console.log("Update hourly rate with txn hash", update_hourly_rate_tx);


				// query profile
				const client = await ArchwayClient.connect(ChainInfo.rpc);
				const entrypoint = {
					profile: {
						id:  accounts[0].address
					},
				};
			
				let queryResult = await client.queryContractSmart(ContractAddress, entrypoint);
				console.log('Profile Query', queryResult);
				

			} else {
				console.warn('Error accessing experimental features, please update Keplr');

			}
		} else {
			console.warn('Error accessing Keplr, please install Keplr');
		}
	}
	

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center from-zinc-200 pb-6 pt-8 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:p-4 text-4xl font-bold text-orange-600">
            Arch-Hub          
        </p>
      </div>

      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-full sm:before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full sm:after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-orange-200 after:via-orange-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-orange-700 before:dark:opacity-10 after:dark:from-orange-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
        <p className="text-4xl font-semibold text-orange-600">
          Decentralized Hub for Boundless Innovation!
        </p>
      </div>

      <div className="mb-32 flex justify-center text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left text-white animate-bounce">
        <Link
          href="/profile"
		  onClick={handleConnectWallet}
          className="group px-5 py-3 bg-orange-600 rounded-2xl text-white"
        >
          <h2 className={`mb-3 md:text-2xl font-semibold`}>
            Launch App{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none  ">
              -&gt;
            </span>
          </h2>
        </Link>
      </div>
    </div>
  );
}