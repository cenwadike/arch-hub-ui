import { SigningArchwayClient, ArchwayClient } from '@archwayhq/arch3.js';
import ChainInfo from 'constantine.config';
import {CONTRACT_TESTNET_ADDRESS, INFURA_API_KEY, INFURA_API_SECRET} from "@/constants";
import { create } from "ipfs-http-client";
import makeIpfsFetch from "js-ipfs-fetch";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {concat} from 'uint8arrays'

export default function ProfileBaord() {
  let accounts, CosmWasmClient, queryHandler;
  const [domainName, setDomainName] = useState();
  const [availability, setAvailabilty] = useState();
  const [hourRate, setHourRate] = useState();
  const [ipfsHash, setIpfsHash] = useState()
  const [updateProfileModalIsOpen, setUpdateProfileModalIsOpen] = useState(false);
  const [portfolio, setPortforlio] = useState();
  const [skills, setSkills] = useState();
  const [remote, setRemote] = useState(false);
  const [contract, setContract] = useState(false);
  const [fullTime, setFullTime] = useState(false);
  const [startup, setStartup] = useState(false);
  const [enterprise, setEnterprise] = useState(false);
  const [offChainSkills, setOffChainSkills] = useState();
  const [offChainRemote, setOffChainRemote] = useState()
  const [offChainContract, setOffChainContract] = useState();
  const [profilesModalIsOpen, setProfilesModalIsOpen] = useState(false);
  const [findProfileModalIsOpen, setFindProfileModalIsOpen] = useState(false);
  const [findProfileId, setFindProfileId] = useState();
  const [findProfileDomainName, setFindProfileDomainName] = useState();
  const [findProfileAvailability, setFindProfileAvailability] = useState();
  const [findProfileRate, setFindProfileRate] = useState();
  const [profiless, setProfiles] = useState([]);

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
          queryHandler = CosmWasmClient.queryContractSmart;	// A less verbose reference to handle our queries	
          
          console.log('Wallet connected', {
            offlineSigner: offlineSigner,
            CosmWasmClient: CosmWasmClient,
            accounts: accounts,
            chain: ChainInfo,
            queryHandler: queryHandler,
          });
          const ContractAddress = CONTRACT_TESTNET_ADDRESS;
          const client = await ArchwayClient.connect(ChainInfo.rpc);
          const address = accounts[0].address;

          const entrypoint = {
            profile: {
              id:  address
            },
          };
        
          try {
            let {available, hour_rate, arch_id, meta_data } = await client.queryContractSmart(ContractAddress, entrypoint);
            setDomainName(arch_id);
            setAvailabilty(available);
            setHourRate(hour_rate);
            console.log("metadata ",meta_data)
          } catch (error) {
            console.log(error)
          }
          

          // get metadata from IPFS
          try {
            let res = await client.queryContractSmart(ContractAddress, entrypoint);
            let ipfsHash = res.meta_data.description;
            setIpfsHash(ipfsHash);
            console.log("IPFS Hash: ", ipfsHash);
          } catch (error) {
            console.log(error)
          }

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
            for await (const chunk of ipfsClient.cat(ipfsHash)) {
              chunks.push(chunk);
            }
            
            const data = concat(chunks)
            const decodedData = JSON.parse(new TextDecoder().decode(data).toString());
            setOffChainSkills(decodedData.skills)
            setOffChainRemote(decodedData.preferences.remote)
            setOffChainContract(decodedData.preferences.contract)
            console.log("Offchain metadata: ", decodedData.skills ); 
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
    getProfile();
  }, [])

  
const handleUpdateProfile = async() => {
  setUpdateProfileModalIsOpen(false)
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

      // get on-chain profile
      const contractAddress = CONTRACT_TESTNET_ADDRESS;
      const client = await ArchwayClient.connect(ChainInfo.rpc);

      const entrypoint = {
        profile: {
          id:  accounts[0].address
        },
      };
      let res = await client.queryContractSmart(contractAddress, entrypoint);
      
      // add metadat to ipfs
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
        "portfolio": portfolio,
        "skills": skills,
        "availability": res.available,
        "hourly_rate": res.hour_rate,
        "preferences": {
          "contract": contract,
          "fulltime": fullTime,
          "remote": remote,
          "enterprise": enterprise,
          "startup": startup
        }
      }

      const profileMetadataJson = JSON.stringify(profileMetadata);
      let {cid, path} = await ipfsClient.add(profileMetadataJson);
      setIpfsHash(path);

      console.log("Ipfs upload successful: ", path);


      // update profile txn
      const ContractAddress = CONTRACT_TESTNET_ADDRESS;
      let cost = '1000000000000000000'
      let funds = [{
        denom: 'aconst',
        amount: cost,
      }]

      const update_metadata_entry_point = {
        update_metadata: {
          name: domainName,
          update: {
            description: path,
            image: "'_'",
            accounts: [{username: "archid-protocol",profile: "https://github.com/archid-protocol",account_type: "github",verfication_hash: null}],
            websites: [{url: "https://archid.app",domain: "dapp.archid.arch",verfication_hash: null}]
          },  
        }
      }
      try {
        let update_metadata_tx = await CosmWasmClient.execute(accounts[0].address, ContractAddress, update_metadata_entry_point, 'auto', "Updating Arch-Hub profile metadata", funds);
        console.log("Update Profile metadata with txn hash", update_metadata_tx);
      
        toast.success("Hurray! Profile updated successfully!!", {
          position: toast.TOP_LEFT,
          autoClose: 6000, // Close the toast after 3 seconds
        })
      } catch (error) {
        toast.error('Oops! Could not update profile.', {
          position: toast.TOP_LEFT,
          autoClose: 6000, // Close the toast after 3 seconds
        });
        console.log(error)
      }
      
    } else {
      console.warn('Error accessing experimental features, please update Keplr');

    }
  } else {
    console.warn('Error accessing Keplr, please install Keplr');
  }

  setUpdateProfileModalIsOpen(false);
}


// load profiles
useEffect(() => {
  async function loadProfiles() {
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
      
      const ContractAddress = CONTRACT_TESTNET_ADDRESS;
      const client = await ArchwayClient.connect(ChainInfo.rpc);

      const entrypoint = {
        users: {
          start_after: 0,
          limit: 50
      },
      };
    
      try {
        let {profiles} = await client.queryContractSmart(ContractAddress, entrypoint);
        console.log("pro: ", profiles.map(profile => profile.arch_id))
        setProfiles(profiles);
        console.log("profiles ",profiless);
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
loadProfiles();
}, [])

const profilesComponent = profiless.map((profile) => {<li>{profile}</li>});

const findProfile = async() => {
  setFindProfileModalIsOpen(false);

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
      
      const ContractAddress = CONTRACT_TESTNET_ADDRESS;
      const client = await ArchwayClient.connect(ChainInfo.rpc);

      const entrypoint = {
        profile_by_name: {
          name: findProfileId
        },
      };
    
      try {
        let {arch_id, available, hour_rate} = await client.queryContractSmart(ContractAddress, entrypoint);
        setFindProfileDomainName(arch_id);
        setFindProfileAvailability(available);
        setFindProfileRate(hour_rate);
        console.log("single profile ", findProfileDomainName);
      } catch (error) {
        console.log(error)
      }
      setProfilesModalIsOpen(true);
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

            <div className='flex flex-row justify-center items-center md:ml-44 mt-12 ml-24'>
              <div className='block p-2 mx-8 rounded-lg border border-orange-600 bg-inherit bg-opacity-100'>
                <div className='block pt-0 px-2 w-72 md:w-[36rem]'>
                  <div className='inline-flex flex-col justify-start items-start'>
                    <div className='flex justify-start'>
                      <h className='text-orange-600 text-md font-semibold leading-tight mb-2 mr-24 md:mr-96'>
                        {" "}
                        Skills
                      </h>
                    </div>
                    <div className='inline-flex flex-row'>
                      <p className='text-gray-900 text-base mb-2'>{offChainSkills}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>{" "}

            <div className='flex flex-row justify-center items-center md:ml-44 mt-12 ml-24'>
              <div className='block p-2 mx-8 rounded-lg border border-orange-600 bg-inherit bg-opacity-100'>
                <div className='block pt-0 px-2 w-72 md:w-[36rem]'>
                  <div className='inline-flex flex-col justify-start items-start'>
                    <div className='flex justify-start'>
                      <h className='text-orange-600 text-md font-semibold leading-tight mb-2 mr-24 md:mr-96'>
                        {" "}
                        Preference
                      </h>
                    </div>
                    <div className='inline-flex flex-row'>
                      <p className='text-gray-900 text-base mb-2'>{offChainRemote ? "Remote" : "Office"}</p>
                      <hr className=' border border-gray-200 h-6 mx-2 md:mx-4'></hr>
                      <p className='text-gray-900 text-base mb-2'>{offChainContract ? "Contract" : "Fulltime"}</p>
                      <hr className=' border border-gray-200 h-6 mx-2 md:mx-4'></hr>
                      <p className='text-gray-900 text-base mb-2'>$CONST {hourRate ? hourRate : "_"}/hr</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>{" "}

            <div className='flex flex-row justify-center items-center md:ml-44 mt-12 ml-24'>
              <div className='block p-2 mx-8 rounded-lg border border-orange-600 bg-inherit bg-opacity-100'>
                <div className='block pt-0 px-2 w-72 md:w-[36rem]'>
                  <div className='inline-flex flex-col justify-start items-start'>
                    <div className='flex justify-start'>
                      <h className='text-orange-600 text-md font-semibold leading-tight mb-2 mr-24 md:mr-96'>
                        {" "}
                        Employment Status
                      </h>
                    </div>
                    <div className='inline-flex flex-row'>
                      <p className='text-gray-900 text-base mb-2'>{availability ? "Open to work" : "Not open to work"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>{" "}

            <div className='flex flex-row justify-center items-center content-center pt-12 mx-8 bg-opacity-100'>
              <div className='flex flex-row justify-center items-center content-center pt-12 mx-8 bg-opacity-100'>
                <p className="bg-orange-600 rounded-md text-white font-semibold mx-48 py-3 px-28 hover:bg-white hover:border hover:border-orange-600 hover:text-orange-600 transition-all duration-300 ease-linear"
                  onClick={e => setUpdateProfileModalIsOpen(true)}>
                    update profile
                </p>
                <p className="bg-orange-600 rounded-md text-center text-white font-semibold mx-12 py-3 px-24 hover:bg-white hover:border hover:border-orange-600 hover:text-orange-600 transition-all duration-300 ease-linear"
                  onClick={e => setFindProfileModalIsOpen(true)}>
                    find profiles
                </p>
              </div>

              {
                updateProfileModalIsOpen && 
                <dialog
                    className="fixed left-0 top-0 w-full h-full bg-black bg-opacity-50 z-50 overflow-auto backdrop-blur flex justify-center items-center">
                    <div className="bg-white m-auto py-6 px-16 flex justify-center items-center border rounded-lg">
                        <div className="flex flex-col items-center">
                          <label className="text-orange-600 font-semibold text-md">
                            portfolio: {" "}
                            <input 
                              value={portfolio}
                              onChange={e => setPortforlio(e.currentTarget.value)}
                              placeholder="portfolio-site.com"
                              className="border border-md border-orange-600 ml-3 p-2 border rounded-md" type="text" name="name" 
                            />
                          </label> 
                          <label className="text-orange-600 font-semibold pt-6 text-md">
                            skills: {" "}
                            <input 
                              value={skills}
                              onChange={e => setSkills(e.currentTarget.value)}
                              placeholder="skill_1, skill_2"
                              className="border border-md border-orange-600 ml-9 p-2 border rounded-md" type="text" name="name" 
                            />
                          </label>
                          <div className="inline-flex items-center justify-center pt-6">
                          <label for="radremote" className="text-orange-600 font-semibold text-md">Remote</label>
                          <input type="radio" name="remote"  id="radremote"
                          className="border border-md border-orange-600 ml-16 border rounded-md"
                          onClick={e => setRemote(!remote)}/>
                          </div>

                          <div className="inline-flex items-center justify-center">
                            <label for="radcontract" className="text-orange-600 font-semibold text-md">Contract</label>
                            <input type="radio" name="contract"  id="radcontract"
                            className="border border-md border-orange-600 ml-14 border rounded-md"
                            onClick={e => setContract(!contract)}/>
                          </div> 

                          <div className="inline-flex items-center justify-center">
                            <label for="radfulltime" className="text-orange-600 font-semibold text-md">Fulltime</label>
                            <input type="radio" name="fulltime"  id="radfulltime"
                            className="border border-md border-orange-600 ml-16 border rounded-md"
                            onClick={e => setFullTime(!fullTime)}/>
                          </div> 

                          <div className="inline-flex items-center justify-center">
                            <label for="radstartup" className="text-orange-600 font-semibold text-md">Startup</label>
                            <input type="radio" name="startup"  id="radstartup"
                            className="border border-md border-orange-600 ml-16 border rounded-md"
                            onClick={e => setStartup(!startup)}/>
                          </div>

                          <div className="inline-flex items-center justify-center">
                            <label for="radenterprise" className="text-orange-600 font-semibold text-md">Enterprise</label>
                            <input type="radio" name="enterprise"  id="radenterprise"
                            className="border border-md border-orange-600 ml-11 border rounded-md"
                            onClick={e => setEnterprise(!enterprise)}/>
                          </div> 
                          <br/>
                          <button type="button" className="bg-orange-600 text-white font-semibold p-2 mt-6 rounded-md border-xl" onClick={handleUpdateProfile}>update profile</button>
                        </div>
                    </div>
                </dialog>
              }
              {
                findProfileModalIsOpen &&
                <dialog
                className="fixed left-0 top-0 w-full h-full bg-black bg-opacity-50 z-50 overflow-auto backdrop-blur flex justify-center items-center">
                  <div className="bg-white m-auto py-6 px-16 flex justify-center items-center border rounded-lg">
                      <div className="flex flex-col items-center">
                      <label className="text-orange-600 font-semibold text-md">
                            name: {" "}
                            <input 
                              value={findProfileId}
                              onChange={e => setFindProfileId(e.currentTarget.value)}
                              placeholder="name.arch"
                              className="border border-md border-orange-600 ml-3 p-2 border rounded-md" 
                              type="text" 
                            />
                          </label> 
                        <br/>
                        <button type="button" className="bg-orange-600 text-white font-semibold p-2 mt-6 rounded-md border-xl hover:bg-orange-900 transition-all duration-300 ease-linear" onClick={findProfile}>confirm</button> 
                      </div>                
                  </div>
                </dialog>
              }
              {
                profilesModalIsOpen &&
                <dialog
                className="fixed left-0 top-0 w-full h-full bg-black bg-opacity-50 z-50 overflow-auto backdrop-blur flex justify-center items-center">
                  <div className="bg-white m-auto py-6 px-16 flex justify-center items-center border rounded-lg">
                      <div className="flex flex-col items-center">
                          <label className="text-orange-600 font-semibold text-md">
                            name: {" "}
                            <input 
                              placeholder={findProfileDomainName}
                              className="border border-md border-orange-600 p-2 ml-24 rounded-md" type="text" 
                              readOnly
                            />
                          </label> 
                          <label className="text-orange-600 font-semibold pt-6 pl-0 text-md">
                            availability:
                            <input 
                              placeholder={findProfileAvailability ? "available" : "occupied"}
                              className="border border-md border-orange-600 ml-16 p-2 rounded-md" type="text" 
                              readOnly
                            />
                          </label>
                          <label className="text-orange-600 font-semibold pt-6 text-md">
                            rate: {"$CONST"}
                            <input 
                              placeholder={findProfileRate}
                              className="border border-md border-orange-600 p-2 ml-12 rounded-md" type="text"
                              readOnly 
                            />
                          </label> 
                        <br/>
                        <button type="button" className="bg-orange-600 text-white font-semibold p-2 mt-6 rounded-md border-xl hover:bg-orange-900 transition-all duration-300 ease-linear" onClick={e => setProfilesModalIsOpen(false)}>close</button> 
                      </div>                
                  </div>
                </dialog>
              }
              <div className='flex flex-row items-center content-center justify-center'>
              <table className='table-column-group absolute top-24 left-40 divide-y divide-gray-200 border text-orange-600'> 
                <thead>
                  <tr>
                    <th className='px-12 py-4'>name</th>
                    <th className='px-12 py-4'>availability</th>
                    <th className='px-12 py-4'>rate</th>
                  </tr>
                </thead>
                <tbody>
                  
                    <ul className='text-orange-600 text-center text-3xl'>{profilesComponent}</ul>
                    {/* // <tr key={profile}>
                    //   <td>{profile.arch_id}</td>
                    //   <td>{profile.availability}</td>
                    //   <td>{profile.hour_rate}</td>
                    // </tr> */}
                  
                 
                </tbody>
              </table>
              </div>
            </div>{" "}
          </div>         
        </>
    );
}