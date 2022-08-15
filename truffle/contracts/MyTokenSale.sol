// SPDX-License-Identifer: MIT
pragma solidity  ^0.6.0;

import "./Crowdsale.sol";


contract MyTokenSale is Crowdsale {

    // KycContract kyc;
    constructor(
        uint256 rate, // how many ways to purchase the token via our crowdsale
        address payable wallet, // wallet to recieve ETH from buyers
        IERC20 token // token to be sold
    )

    Crowdsale(rate, wallet, token) public {
    }
}