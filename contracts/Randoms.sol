// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "../client/node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../client/node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "../client/node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../client/node_modules/@openzeppelin/contracts/utils/Strings.sol";
import "../client/node_modules/@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract Randoms is ERC721, ERC721Enumerable, Ownable {
    using Strings for uint256;

    uint256 public maxTxForPublic = 2;
    uint256 public maxTxForPrivate = 3;
    uint256 public totalMintedInPrivate = 0;

    uint256 public maxSupply = 400;
    uint256 public amountForAIRDROPS = 20;
    uint256 public availableToMintInPublic = maxSupply - amountForAIRDROPS;

    bool public isActive;
    bool public privateSaleisActive;
    bool public publicSaleisActive;

    uint256 public contractDeployedTime = block.timestamp;

    uint256 public _privateSaleTimeStart = contractDeployedTime + 50;
    uint256 public _privateSaleTimeEnds = _privateSaleTimeStart + 1000;

    uint256 public PublicSaleTimeStart = _privateSaleTimeEnds;
    uint256 public totalMintedInAirdrop = 0;
    uint256 public totalMintedInPublic = 0;

    mapping(address => uint256) public TxPerformedPublic;
    mapping(address => uint256) public TxPerformedPrivate;

    uint256 public maxMintForPublic = 2;
    uint256 public maxMintForPrivate = 3;

    mapping(address => uint256) public mintPerformedPublic;
    mapping(address => uint256) public mintPerformedPrivate;
    // uint256 public price = 0.01 ether;
    // Come back later to implement  a price for public sale
    // Withdraw Function also ...

    bool public revealed = false;
    bytes32 public whitelistRoot =
        0xe48e16d82c4a66e30ba3a731d1df05af5a006c954e90512805f233ff2b6bfc1d;

    constructor() ERC721("Randoms", "RANDS") {
        isActive = true;
    }

    modifier PRIVATE_SALE_ACTIVE() {
        require(privateSaleisActive == true, "Private sale is not active yet");
        _;
    }
    modifier PUBLIC_SALE_ACTIVE() {
        require(publicSaleisActive == true, "Public sale is not active yet");
        _;
    }
    // 
    string public baseURI_;

    function _baseURI() internal view override returns (string memory) {
        return baseURI_;
    }

    function setBaseURI(string calldata BaseURI) external onlyOwner {
        baseURI_ = BaseURI;
    }

    function setWhitelistRoot(bytes32 _whitelistRoot) public onlyOwner {
        whitelistRoot = _whitelistRoot;
    }

    function changeRevealed(bool revealedStatus) public onlyOwner {
        revealed = revealedStatus;
    }

    // PrivateSale
    function _checkPrivateActive() private {
        if (
            block.timestamp >= _privateSaleTimeStart &&
            block.timestamp < _privateSaleTimeEnds
        ) {
            privateSaleisActive = true;
        } else {
            privateSaleisActive = false;
        }
    }

    // PublicSale
    function _checkPublicActive() private {
        if (block.timestamp >= PublicSaleTimeStart) {
            publicSaleisActive = true;
        } else {
            publicSaleisActive = false;
        }
    }

    function privateSaleMint(uint256 _mintAmount, bytes32[] memory proof)
        public
    {
        _checkPrivateActive();
        _checkPublicActive();
        require(isCertifiedToMint(proof));

        require(
            publicSaleisActive == false,
            "Private sale is over ,public sale is now  active and you can't mint in private sale  anymore."
        );
        require(privateSaleisActive == true, "Private sale is not active yet ");
        require(_mintAmount > 0, "You cant mint Zero Tokens");
        require(
            _mintAmount <= maxMintForPrivate,
            "You can't mint more than 3."
        );

        require(
            TxPerformedPrivate[msg.sender] < maxTxForPrivate,
            "The max number of tx that can be sent in the private sale is 3."
        );
        require(
            mintPerformedPrivate[msg.sender] + _mintAmount <= maxMintForPrivate,
            "On addition of this amount you are about to mint, Your total minted would exceed the max of 3 in private sale ,consider reducing the amount."
        );
        require(
            totalSupply() + _mintAmount <= maxSupply - amountForAIRDROPS,
            "The max number of nfts  for this private phase has been minted."
        );

        uint256 id = totalSupply();
        for (uint256 i = 0; i < _mintAmount; i++) {
            _mint(msg.sender, ++id);
        }
        TxPerformedPrivate[msg.sender] += 1;
        totalMintedInPrivate += _mintAmount;
        availableToMintInPublic -= _mintAmount;
        mintPerformedPrivate[msg.sender] += _mintAmount;
    }

    function publicSaleMint(uint256 _mintAmount,bytes32[] memory proof) public {
        _checkPrivateActive();
        _checkPublicActive();
        require(isCertifiedToMint(proof));

        require(privateSaleisActive == false, "Private sale is still on ");
        require(
            publicSaleisActive == true,
            " public sale  is not active yet  yet"
        );
        require(_mintAmount > 0, "You cant mint Zero Tokens");
        require(_mintAmount <= maxMintForPublic, "You can't mint more than 2.");

        require(
            TxPerformedPublic[msg.sender] < maxTxForPublic,
            "The max number of tx that can be sent in the public sale is 2"
        );
        require(
            mintPerformedPublic[msg.sender] + _mintAmount <= maxMintForPublic,
            "On addition of this amount you are about to mint, Your total minted would exceed the max of 2 in public sale ,consider reducing the amount."
        );
        require(
            totalSupply() + _mintAmount <=  maxSupply - amountForAIRDROPS,
            "The max number of nfts  for this public phase has been minted"
        );
        uint256 id = totalSupply();
        for (uint256 i = 0; i < _mintAmount; i++) {
            _mint(msg.sender, ++id);
        }
        TxPerformedPublic[msg.sender] += 1;
        availableToMintInPublic -= _mintAmount;
        totalMintedInPublic += _mintAmount;
        mintPerformedPublic[msg.sender] += _mintAmount;
    }

    function airdrop(address to) public onlyOwner PUBLIC_SALE_ACTIVE {
        // Thought this line was useful, i really just used a modifier , figure out which saves more gas
        // require(block.timestamp > _privateSaleTimeEnds);
        require(
            amountForAIRDROPS >= 1,
            "The REMAINING AMOUNT FOR AIRDROPS IS 0"
        );
        // uint id = totalSupply();
        _mint(to, totalSupply());
        totalMintedInAirdrop += 1;
        amountForAIRDROPS -= 1;
    }

    function isCertifiedToMint(bytes32[] memory proof)
        private
        view
        returns (bool)
    {
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender));

        return MerkleProof.verify(proof, whitelistRoot, leaf);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );
        string memory baseURI = _baseURI();

        if (revealed == false) {
            return
                bytes(baseURI).length > 0
                    ? string(abi.encodePacked(baseURI, "hidden.json"))
                    : "";
        } else {
            return
                bytes(baseURI).length > 0
                    ? string(
                        abi.encodePacked(baseURI, tokenId.toString(), ".json")
                    )
                    : "";
        }
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
