// SPDX-Licence-Identifier: MIT 

pragma solidity ^0.8.0;

interface IWhitelist {
    function isWhitelisted(address) external view returns (bool);
}