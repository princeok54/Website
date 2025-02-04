// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
// import "../../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "../../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "../../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../../node_modules/@openzeppelin/contracts/utils/Counters.sol";

contract SlayerBadge is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    uint256 private immutable _cap;

    Counters.Counter private _tokenIdCounter;

    constructor(uint256 cap_) ERC721("ROSlayers", "ROS") {
        require(cap_ > 0, "ERC721 cap is 0");
        _cap = cap_;
    }
    
    function cap() public view virtual returns (uint256) {
        return _cap;
    }
    
    function contractURI() public pure returns (string memory) {
        return "https://gateway.pinata.cloud/ipfs/QmRLrF5nMMsqkpgWWSgePKNVU2piWHSzjGVHBsRK95dio7";
    }

    function mint(address to, string memory tokenURI) public payable onlyOwner {
        require(totalSupply() <= cap(), "ERC721 Cap: cap reached");
        require(msg.value >= 0.005 ether, "Not enough ETH sent: check price.");
        _tokenIdCounter.increment();
        _safeMint(to, _tokenIdCounter.current());
        _setTokenURI(_tokenIdCounter.current(), tokenURI);
        
        
    }

    function deposit() public payable {
        balanceOf(msg.sender); // += msg.value;
    }
    
    //get the current supply of tokens
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter.current();
    }

    
}