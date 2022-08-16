// SPDX-License-Identifer: MIT
pragma solidity ^0.6.0;

import "./Crowdsale.sol";
import "./KycContract.sol";

contract MyTokenSale is Crowdsale {

    KycContract kyc;
    constructor(
        uint256 rate, // how many ways to purchase the token via our crowdsale
        address payable wallet, // wallet to recieve ETH from buyers
        IERC20 token, // token to be sold
        KycContract _kyc
    )
        Crowdsale(rate, wallet, token) 
        public 
    {
        kyc = _kyc;
    }

    function _preValidatePurchase(address beneficiary, uint256 weiAmount) internal view override {
        super._preValidatePurchase(beneficiary, weiAmount);
        require(kyc.KycCompleted(beneficiary), "KYC not completed yet, aborting");
    }
    
}