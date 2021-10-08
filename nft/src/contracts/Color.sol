// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract Color is ERC721, ERC721Enumerable {
  // using Counters for Counters.Counter;

  // Counters.Counter private _tokenIdCounter;

  string[] public colors;
  mapping(string => bool) _colorExists;

  // using totalSupply for 

  constructor() ERC721("Color", "COLOR") {}

  // E.G. color = "#FFFFFF"
  function mint(string memory _color) public {    
    require(!_colorExists[_color]); 
    colors.push(_color);
    uint _id = colors.length -1;
    _mint(msg.sender, _id);
    _colorExists[_color] = true;
  }

  // The following functions are overrides required by Solidity.

  function _beforeTokenTransfer(address from, address to, uint256 tokenId)
      internal
      override(ERC721, ERC721Enumerable)
  {
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
