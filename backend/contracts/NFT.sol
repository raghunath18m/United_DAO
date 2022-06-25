// SPDX-Licence-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interface/IWhitelist.sol";

contract NFT is ERC721Enumerable, Ownable {
    string _baseTokenURI;

    //  price of one NFT
    uint256 public _price = 0.001 ether;

    //  price of one NFT for whitelisted users
    uint256 public _presalePrice = 0.0005 ether;

    // pause the contract in case of an emergency
    bool public _paused;
    
    uint256 public maxTokenIds = 10;

    // total number of tokenIds minted
    uint256 public tokenIds;

    IWhitelist whitelist;


    bool public presaleStarted;

    // timestamp
    uint256 public presaleEnded;

    modifier onlyWhenNotPaused {
        require(!_paused, "Contract currently paused");
        _;
    }
    
    constructor (string memory baseURI, address whitelistContract) ERC721("Manchester United","MUN"){
        _baseTokenURI = baseURI;
        whitelist = IWhitelist(whitelistContract);
    }

    // presale for whitelisted users
    function startPresale() public onlyOwner {
        presaleStarted = true;
        presaleEnded = block.timestamp + 5 minutes;
    }

    function presaleMint() public payable onlyWhenNotPaused {
        require(presaleStarted && block.timestamp < presaleEnded, "Presale is not running");
        require(whitelist.isWhitelisted(msg.sender), "You are not whitelisted");
        require(tokenIds < maxTokenIds, "Exceeded maximum NFT supply");
        require(msg.value >= _presalePrice, "Ether sent is not correct");
        tokenIds += 1;

        _safeMint(msg.sender, tokenIds);
    }

    function mint() public payable onlyWhenNotPaused {
        require(presaleStarted && block.timestamp >= presaleEnded, "Presale is not running");
        require(tokenIds < maxTokenIds, "Exceeded maximum NFT supply");
        require(msg.value >= _price, "Ether sent is not correct");
        tokenIds += 1;

        _safeMint(msg.sender, tokenIds);
    }


    /**
      * _baseURI overides the Openzeppelin's ERC721 implementation which by default
      * returned an empty string for the baseURI
      */
    function _baseURI() internal view virtual override returns(string memory) {
        return _baseTokenURI;
    }

    function setPaused(bool val) public onlyOwner {
        _paused = val;
    }

    function withdraw() public onlyOwner {
        address _owner = owner();
        uint256 amount = address(this).balance;
        (bool sent , ) = _owner.call{value: amount}('');
        require(sent,"Failed to send ether");
    }

    receive() external payable {}
    fallback() external payable {}

}