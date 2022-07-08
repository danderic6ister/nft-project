const HDWalletProvider = require('@truffle/hdwallet-provider');
const seed_phrase = ""
const infura_rinkeby_link ="wss://rinkeby.infura.io/ws/v3/71f97d8c43854a33877ce56748eddd58"
module.exports = {
  

  networks: {
    
    development: {
     host: "127.0.0.1",     // Localhost (default: none)
     port: 7545,            // Standard Ethereum port (default: none)
     network_id: "4",       // Any network (default: none)
    },
    rinkeby :{
      provider:() => new HDWalletProvider(seed_phrase,infura_rinkeby_link),
      network_id:4,
      gas:5500000,
      confirmations:2,
      timeoutBlocks:200,
      skipDryRun :true
    },
    
  },

  // Set default mocha options here, use special reporters etc.
  contracts_directory:"./contracts",
  contracts_build_directory:"./client/src/abis",

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.3",    // Fetch exact version from solc-bin (default: truffle's version)
             // Use "0.5.1" you've installed locally with docker (default: false)
      settings: {          // See the solidity docs for advice about optimization and evmVersion
       optimizer: {
         enabled: true,
         runs: 200
       },
      //  evmVersion: "byzantium"
       }
    }
  },

  
};
