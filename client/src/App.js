import React, { Component } from "react";
import Token from "./contracts/MyToken.json";
import TokenSale from "./contracts/MyTokenSale.json";
import KycContract from "./contracts/KycContract.json";
import getWeb3 from "./getWeb3";
import "./App.css";

class App extends Component {
  state = {loaded: false, kycAddress: "0x123..", tokenSaleAddress: null, userTokenBalance: 0};

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId();      
    //   this.chainId = await this.web3.eth.getChainId();

      this.myToken = await new this.web3.eth.Contract(
        Token.abi,
        Token.networks[this.networkId] && Token.networks[this.networkId].address
      );
      this.tokenSymbol = await this.myToken.methods.symbol().call();

      this.tokenSale = new this.web3.eth.Contract(
        TokenSale.abi,
        TokenSale.networks[this.networkId] && TokenSale.networks[this.networkId].address
      );

      this.kycContract = await new this.web3.eth.Contract(
        KycContract.abi,
        KycContract.networks[this.networkId] && KycContract.networks[this.networkId].address
      );
      
      this.listenToTokenTransfer();
      this.setState({loaded:true, tokenSaleAddress: TokenSale.networks[this.networkId].address}, this.updateUserTokens);

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };
  
  updateUserTokens = async () => {
    let Balance = await this.myToken.methods.balanceOf(this.accounts[0]).call();
    this.setState({userTokenBalance: Balance});
  }

  listenToTokenTransfer = async() => {
    console.log("listen to token transfer");
    this.myToken.events.Transfer({to: this.accounts[0]}).on("data", this.updateUserTokens);
  }

  handleBuyTokens = async() => {
    await this.tokenSale.methods.buyTokens(this.accounts[0]).send({from: this.accounts[0], value:this.web3.utils.toWei("1", "wei")});
  }

  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div id="App">
        <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
        <h1>{this.tokenSymbol} Token Sale!</h1>
        <p>-MinWoo Metal Warrior-</p>
        <p>Token Address : {Token.networks[this.networkId].address}</p>
        <h2>KYC Whitelisting</h2>
        Address to allow : <input type="text" name="kycAddress" value={this.state.kycAddress} onChange={this.handleInputChange}/>
        <button type="button" onClick={this.handleKycWhitelisting}>Add to Whitelist</button>
        <br/><br/>
        <h2>How To buy</h2>
        <p>If you want to buy tokens, send Wei to this address: {this.state.tokenSaleAddress}</p>
        <p>Your Balance : {this.state.userTokenBalance} {this.tokenSymbol}</p>
        <button type="button" onClick={this.handleBuyTokens}>Buy more Token</button>
      </div>
    );
  }

  handleKycWhitelisting = async () => {
    await this.kycContract.methods.setKycCompleted(this.state.kycAddress).send({from:this.accounts[0]});
    alert("KYC for " + this.state.kycAddress + " is completed");
  };

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  };
}
export default App;