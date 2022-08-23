import React, { Component } from "react";
import Token from "./contracts/MyToken.json";
import TokenSale from "./contracts/MyTokenSale.json";
import KycContract from "./contracts/KycContract.json";
import getWeb3 from "./getWeb3";
import "./App.css";

class App extends Component {
  state = { loaded: false, kycAddress: "0x123.."};

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId();      
    //   this.chainId = await this.web3.eth.getChainId();

      this.myToken = new this.web3.eth.Contract(
        Token.abi,
        Token.networks[this.networkId] && Token.networks[this.networkId].address
      );

      this.tokenSale = new this.web3.eth.Contract(
        TokenSale.abi,
        TokenSale.networks[this.networkId] && TokenSale.networks[this.networkId].address
      );

      this.kycContract = await new this.web3.eth.Contract(
        KycContract.abi,
        KycContract.networks[this.networkId] && KycContract.networks[this.networkId].address
      );
      console.log(this.kycContract);
    //   alert("chainId : " + this.chainId);
    //   alert(KycContract.networks[this.chainId] && KycContract.networks[this.chainId].address);
    //   this.kycContract.options.address = "0x4C9Cab02E4e5ba8c95151322fd78a029E59B623b";
      
      this.setState({loaded:true});

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };
  
  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Token Sale Example!</h1>
        <p>Get myToken today!</p>
        <h2>KYC Whitelisting</h2>
        Address to allow : <input type="text" name="kycAddress" value={this.state.kycAddress} onChange={this.handleInputChange}/>
        <button type="button" onClick={this.handleKycWhitelisting}>Add to Whitelist</button>
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