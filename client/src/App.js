import React, { useState,useEffect } from "react";
import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';
// import SimpleStorageContract from "./contracts/SimpleStorage.json";
import Randoms from "./abis/Randoms.json";
import getWeb3 from "./getWeb3";
import 'bootstrap/dist/css/bootstrap.min.css';
// import "./MerkleTree/merkle_tree.js";


import "./App.css";

const App = ()=>{
  // Load Web3 from Metamask
  const [contract,setContract] = useState(null);
  const [account ,setAccount] = useState('');
  const [COUNT,setCount]       = useState(0);

  // Load the account

  const loadWeb3Account  = async(web3) =>{

    const accounts = await web3.eth.getAccounts();
    // console.log(accounts)
    if (accounts){
      setAccount(accounts[0]);
    }

  }
  // Load the Contract
 const LoadWeb3Contract = async(web3) =>{ 
    const network_id = await web3.eth.net.getId();
    const network_deets = Randoms.networks[network_id];
    if (network_deets){
      const abi = Randoms.abi;
      const contractAddress = network_deets.address;
      console.log(contractAddress)
      const contract =  new web3.eth.Contract(abi,contractAddress);
      setContract(contract);
      // console.log(contract);
      return contract;
    }

  }
  
// All Whitelisted Address
  let whiteistedaddress = [
      '0x9c0c6C9E710c3CE8F53E35a060D69aD1cAf7F01c',
      '0x35A3004D0cD53F264Ee7fBB4340c38D5F05BC9Ee',
      '0xef01cda44a3547Dfa95f8E664E3F50Ddca1d65cb',
      '0xcE4AEcc63654FB841B53F1091378DfD0eD9ba9BD',
   ]

// Address you want to find merkle HexProof .......





  let leafNode = whiteistedaddress.map(x => keccak256(x));
  const merkleTree = new MerkleTree(leafNode, keccak256, {sortPairs: true});
  const rootHash = merkleTree.getHexRoot();
  // console.log(rootHash,'roothash');

  const leaf = keccak256(account);
  const proof = merkleTree.getHexProof(leaf);
  // console.log(proof, 'hexproof');

  useEffect(async ()=>{
    const web3 = await getWeb3();
    await LoadWeb3Contract(web3);
    await loadWeb3Account(web3);
    
  },[]);
  const mint =() =>{
    console.log(COUNT);
    contract.methods.publicSaleMint(COUNT,proof).send({from : account},(error) =>{
      // console.log("It worked");
      if(!error){
        setCount(0);
      }
    })

  }
  
  
  return <div>
    <nav className="navbar navbar-light bg-light">
      <div className="container-fluid">
        <a className="navbar-brand" href="#" width="75">
        
           Randoms NFT
        </a>
        
        <span> Wallet Connected: {account}</span>

      </div>

    </nav>
    <div className="container-fluid mt-5">
      <div className="row">
        <div className="col d-flex flex-column align-items-center">
          <h1 className="display-6 fw-bold"> Welcome to Randoms NFT Minting Page </h1>
          {/* <img className="mb-4"src='C:\Users\Daniel Awodeji\Desktop\CreativeJuices\client\public\Untitled.png' width="200"/> */}
          <div className="col-5 text-center">
            <p className="lead text-center">
              More than just a picture, our genesis collection of 444 Random OGs welcomes you to the world of Web3.
              We are commited to building the future of web3  where everyone across the globe shares the feeling of brotherhood.
              This genesis collection unlocks a pass to future NFT drops and alpha communities across the web3 community.
              RANDS go brrrrrrrr!!!

            </p>
            <div>
            <input
            type ="number"
            min = "1"
            max="3"
            placeholder="You can mint a max of 3 for presale and 2 in public sale."
            value ={COUNT}
            onChange={(e) =>setCount(e.target.value)}
            className="form-control mb-2"
            />
            <button onClick={mint} className="btn btn-primary">MINT </button>
          </div>
          </div>
          

        </div>

        
        
      </div>
      
    </div>
  </div> 

  

};



export default App;
