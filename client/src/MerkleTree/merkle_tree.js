import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';

// All Whitelisted Address
let whiteistedaddress = [
 'enter your wallet address',
 'enter another wallet address'
];

// Address you want to find merkle HexProof .......
let addr = 'random address';

let leafNode = whiteistedaddress.map((x) => keccak256(x));
const merkleTree = new MerkleTree(leafNode, keccak256, { sortPairs: true });
const rootHash = merkleTree.getHexRoot();
console.log(rootHash, 'roothash');

const leaf = keccak256(addr);
const proof = merkleTree.getHexProof(leaf);
console.log(proof, 'hexproof');




