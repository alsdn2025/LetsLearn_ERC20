const Token = artifacts.require("MyToken");

var chai = require("chai");
const BN = web3.utils.BN; // Big Number
const chaiBN = require("chai-bn")(BN);
chai.use(chaiBN);

var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

const expect = chai.expect;

require("dotenv").config({path: "../.env"});

contract("Token Test", async (accounts) => {
    const [ initialHolder, recipient, anotherAccount ] = accounts;

    beforeEach(async()=>{
        this.myToken = await Token.new(process.env.INITIAL_TOKENS);
    })

    it("All tokens should be in initialHolder's account", async () => {
        let instance = this.myToken;
        let totalSupply = await instance.totalSupply();

        // let balance = await instance.balanceOf(accounts[0]);
        // asset.equal(balance.valueOf(), initialSupply.valueOf(), "The balance was not the same");

        expect(instance.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(totalSupply); 
    });

    it("Is possible to send tokens between accounts", async()=>{
        const sendTokens = 1;
        let instance = this.myToken;
        let totalSupply = await instance.totalSupply();
        
        await expect(instance.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(totalSupply);
        await expect(instance.transfer(recipient, sendTokens)).to.eventually.be.fulfilled; 
        await expect(instance.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(totalSupply.sub(new BN(sendTokens)));
        await expect(instance.balanceOf(recipient)).to.eventually.be.a.bignumber.equal(new BN(sendTokens));
    });

    it("Is not poosible to send more tokens than available in total", async() => {
        let instance = await Token.deployed();
        let balanceOfDeployer = await instance.balanceOf(initialHolder);

        await expect(instance.transfer(recipient, new BN(balanceOfDeployer + 1))).to.eventually.be.rejected;

        // check if the balance is still the same
        await expect(instance.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(balanceOfDeployer);
    });
});