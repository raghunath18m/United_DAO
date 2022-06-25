// SPDX-Licence-Identifier: MIT 

pragma solidity ^0.8.0;

interface INFT {
    function tokenOfOwnerByIndex (address owner, uint256 index) external view returns (uint256 tokenId);

    // returns no of tokens in owners account
    function balanceOf (address owner) external view returns (uint256 balance);
}