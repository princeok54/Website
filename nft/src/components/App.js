import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import GameItem from '../abis/GameItem.json';

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      contract: null,
      totalSupply: 0,
      tokens: [],

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
    const networkData = GameItem.networks[networkId];
    if(networkData) {
      const abi = GameItem.abi;
      const address = networkData.address;
      const contract = new web3.eth.Contract(abi, address);
      this.setState({ contract });

      const totalSupply = await contract.methods.totalSupply().call();
      console.log(`totalSupply is ${totalSupply}`);
      this.setState({ totalSupply });
      // Load GameItems
      for (var i = 1; i <= totalSupply; i++) {
        const token = await contract.methods.tokens(i - 1).call()
        this.setState({
          tokens: [...this.state.tokens, token]
        })
      }
    } else {
      window.alert('Smart contract not deployed to detected network.')
    }
  }

  mint = (token) => {
    this.state.contract.methods.mint(token, ).send({ from: this.state.account, gasPrice: "20000000000" })
    .once('receipt', (receipt) => {
      this.setState({
        tokens: [...this.state.tokens, token]
      })
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
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
            GameItem Tokens
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
                  const token = this.token.value;
                  this.mint(token);
                }}>
                  {/* <input
                    type='text'
                    className='form-control mb-1'
                    placeholder='e.g. #FFFFFF'
                    ref={(input) => { this.token = input }}
                  /> */}
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
            { this.state.tokens.map((token, key) => {
              return(
                <div key={key} className="col-md-3 mb-3">
                  <div className="token" style={{ backgroundColor: token }}></div>
                  <div>{token}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
