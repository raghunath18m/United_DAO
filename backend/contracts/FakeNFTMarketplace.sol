// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FakeNFTMarketplace {
    // a mapping of Fake TokenID to Owner addresses
    mapping(uint256 => address) public tokens;

    uint256 nftPrice = 0.0001 ether;

    // purchase() accepts ETH and marks the owner of the given tokenId as the caller address
    // the fake NFT _tokenId to purchase
    function purchase(uint256 _tokenId) external payable {
        require(msg.value == nftPrice, "This NFT costs 0.0001 ether");
        tokens[_tokenId] = msg.sender;
    }

    function getPrice() external view returns (uint256) {
        return nftPrice;
    }

    // available() checks whether the given tokenId has already been sold or not
    // _tokenId - the tokenId to check for
    function available(uint256 _tokenId) external view returns (bool) {
        if (tokens[_tokenId] == address(0)) {
            return true;
        }
        return false;
    }
}