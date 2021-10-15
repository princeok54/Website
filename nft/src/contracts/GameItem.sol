// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
// import "../../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "../../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "../../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../../node_modules/@openzeppelin/contracts/utils/Counters.sol";

contract GameItem is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    uint256 private _cap;

    Counters.Counter private _tokenIdCounter;

    constructor(uint256 cap) ERC721("ROSlayers", "ROS") {
        require(cap > 0, "ERC721 cap is ");
        _cap = cap;
    }

    function contractURI() public pure returns (string memory) {
        return "https://gateway.pinata.cloud/ipfs/QmRLrF5nMMsqkpgWWSgePKNVU2piWHSzjGVHBsRK95dio7";
    }

    function mint(address to, string memory tokenURI) public onlyOwner {
        _safeMint(to, _tokenIdCounter.current());
        _setTokenURI(_tokenIdCounter.current(), tokenURI);
        _tokenIdCounter.increment();
        
    }
    
    //get the current supply of tokens
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter.current();
    }

    // The following functions are overrides required by Solidity.

    // function _beforeTokenTransfer(address from, address to, uint256 tokenId)
    //     internal
    //     override(ERC721, ERC721Enumerable)
    // {
    //     super._beforeTokenTransfer(from, to, tokenId);
    // }

    // function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
    //     super._burn(tokenId);
    // }

    // function tokenURI(uint256 tokenId)
    //     public
    //     view
    //     override(ERC721, ERC721URIStorage)
    //     returns (string memory)
    // {
    //     return super.tokenURI(tokenId);
    // }

    // function supportsInterface(bytes4 interfaceId)
    //     public
    //     view
    //     override(ERC721, ERC721Enumerable)
    //     returns (bool)
    // {
    //     return super.supportsInterface(interfaceId);
    // }
}