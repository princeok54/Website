import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import SlayerBadge from '../abis/SlayerBadge.json';

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      contract: null,
      totalSupply: 0,
      tokens: [],
      tokenURI: "https://gateway.pinata.cloud/ipfs/QmX5nk2HcaczjUTBBBREopcKkK2JCQ6b2PtZACLgX2LVhu"

    };
  }

  async componentWillMount() {
    await this.loadWeb3();
    
    await this.loadBlockchainData();
    await this.connectAccount();
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.eth_requestAccounts;
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  }

  // Check if Account is connected
  async connectAccount() {
    if( !this.state.account ) {
      const ethBtn = document.querySelector('.enableEthBtn');
      ethBtn.addEventListener('click', () => {
      
        const accounts = window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        this.setState({ account });
      });
    }
  }


  async loadBlockchainData() {
    const web3 = window.web3;
    // Load account
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });

    const networkId = await web3.eth.net.getId();
    const networkData = SlayerBadge.networks[networkId];
    if(networkData) {
      const abi = SlayerBadge.abi;
      const address = networkData.address;
      const contract = new web3.eth.Contract(abi, address);
      this.setState({ contract });

      const totalSupply = await contract.methods.totalSupply().call();
      console.log(`totalSupply is ${totalSupply}`);
      this.setState({ totalSupply });
      // Load SlayerBadge tokens
      /*for (var i = 1; i <= totalSupply; i++) {
        const token = await contract.methods.tokens(i - 1).call()
        this.setState({
          tokens: [...this.state.tokens, token]
        })
      } */
    } else {
      window.alert('Smart contract not deployed to detected network.')
    }
  }

  mint = () => {
    this.state.contract.methods.mint(this.state.account, this.state.tokenURI).send({
        from: this.state.account, 
        gasPrice: "20000000000", 
        value:  window.web3.utils.toWei("0.00005", "ether")
      })
    .on('receipt', (receipt) => {
      this.setState({
        totalSupply: this.state.totalSupply
      })
      console.log("Minted");
    })
    .on('error', (error) => {
      alert(error);
    }) 
  }


  render() {
    // if( !this.state.account ){
      const enableEthBtn = <button className="btn btn-primary enableEthBtn">Enable Ethereum</button>;
      console.log(enableEthBtn);
    // }
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="/"
            target="_blank"
            rel="noopener noreferrer"
          >
            SlayerBadge Tokens
          </a>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <h4>Account: <small className="text-white">
                <span id="account">{ this.state.account  ||  enableEthBtn }</span></small>
              </h4>
            </li>
          </ul>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <h1>Issue Token</h1>
                <form onSubmit={(event) => {
                    event.preventDefault();
                    // const token = this.token.value;
                    this.mint();
                  }}>
                  
                  <input
                    type='submit'
                    className='btn btn-block btn-primary'
                    value='MINT'
                  />
                </form>
              </div>
            </main>
          </div>
          <hr/>
          <div className="row text-center">
            <div className="col-md-3 mb-3">
              <h3>{`Total tokens minted is ${ this.state.totalSupply }`}</h3>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
