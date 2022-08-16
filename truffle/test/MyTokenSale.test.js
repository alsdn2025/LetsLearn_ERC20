const TokenSale = artifacts.require("MyTokenSale");
const Token = artifacts.require("MyToken");

const chai = require("./setupchai.js");
const BN = web3.utils.BN;
const expect = chai.expect;

require("dotenv").config({path: "../.env"});

contract("TokenSale Test", async (accounts) => {

    const [ deployerAccount, recipient, anotherAccount ] = accounts;

    it("should not have any tokens in my deployer account", async() => {
        let instance = await Token.deployed();
        
        // clean room testing 
        return expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(new BN(0));
    });

    it("all tokens should be in the TokenSale Smart Contract by default", async()=>{
        let tokenInstance = await Token.deployed();
        let balanceOfTokenSale = tokenInstance.balanceOf(TokenSale.address);

        return expect(balanceOfTokenSale).to.eventually.be.a.bignumber.equal(new BN(process.env.INITIAL_TOKENS));
    });

    it("it should be possible to buy tokens", async()=>{
        let tokenInstance = await Token.deployed();
        let tokenSaleInstance = await TokenSale.deployed();
        let balanceBefore = await tokenInstance.balanceOf(recipient);

        await expect(tokenSaleInstance.sendTransaction({from: recipient, value: web3.utils.toWei("1", "wei")})).to.be.fulfilled;
        return expect(await tokenInstance.balanceOf(recipient)).to.be.a.bignumber.equal(balanceBefore.add(new BN(1)));
    });
});