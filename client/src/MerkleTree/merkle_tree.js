import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';

// All Whitelisted Address
let whiteistedaddress = [
  '0x9c0c6C9E710c3CE8F53E35a060D69aD1cAf7F01c',
  '0x35A3004D0cD53F264Ee7fBB4340c38D5F05BC9Ee',
  '0xef01cda44a3547Dfa95f8E664E3F50Ddca1d65cb',
  '0xcE4AEcc63654FB841B53F1091378DfD0eD9ba9BD',
  '0x24FC465Dc0063999930BB2232BB3F9636979Dd8B',
  '0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2',
];

// Address you want to find merkle HexProof .......
let addr = '0x35A3004D0cD53F264Ee7fBB4340c38D5F05BC9Ee';

let leafNode = whiteistedaddress.map((x) => keccak256(x));
const merkleTree = new MerkleTree(leafNode, keccak256, { sortPairs: true });
const rootHash = merkleTree.getHexRoot();
console.log(rootHash, 'roothash');

const leaf = keccak256(addr);
const proof = merkleTree.getHexProof(leaf);
console.log(proof, 'hexproof');

// const newProof node

// const findHexProofOfAddress= (address) =>{

//     const leav = keccak256(address);
//     const proofs = merkleTree.getHexProof(leav);
//     console.log(proofs,'proofhash')

// }

// const findMerkleRoot = () => {
//     let leafNode = whiteistedaddress.map(addr => keccak256(addr));
//     const merkleTree = new MerkleTree(leafNode, keccak256, {sortPairs: true});
//     const rootHash = merkleTree.getHexRoot();
//     console.log(rootHash,'roothash');
// }
// console.log(merkleTree.verify(findHexProofOfAddress('0x24FC465Dc0063999930BB2232BB3F9636979Dd8B'),'0x24FC465Dc0063999930BB2232BB3F9636979Dd8B',rootHash))

// Find Hex Proof
// const findHexProof = async() => {
//     let indexOfArray = await whiteistedaddress.indexOf(addr);
//     let leafNode = whiteistedaddress.map(addr => keccak256(addr));
//     const merkleTree = await new MerkleTree(leafNode, keccak256, {sortPairs: true});
//     const clamingAddress = leafNode[indexOfArray];
//     const hexProof = merkleTree.getHexProof(clamingAddress);
//     console.log(hexProof , 'hexProof');
// }

// findMerkleRoot();
// findHexProof();

// findHexProofOfAddress('0x24FC465Dc0063999930BB2232BB3F9636979Dd8B');
// export default findHexProofOfAddress(address)
