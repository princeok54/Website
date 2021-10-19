import React from "react";
import { useEffect, useState } from "react";
import {
  connectWallet,
  getCurrentWalletConnected,
  mint,
	loadWeb3,
} from "../util/interact.js";

const Minter = (props) => {
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
	// const [success, setSuccess] = useState("");

  const [deposit, setDeposit] = useState(0);
//   const [description, setDescription] = useState("");
//   const [url, setURL] = useState("");

  useEffect(async () => {
		await loadWeb3();
    const { address, status } = await getCurrentWalletConnected();

    setWallet(address);
    setStatus(status);

    addWalletListener();
  }, []);

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus("👆🏽 Write a message in the text-field above.");
        } else {
          setWallet("");
          setStatus("🦊 Connect to Metamask using the top right button.");
        }
      });
    } else {
      setStatus(
        <p>
          {" "}
          🦊{" "}
          <a target="_blank" href={`https://metamask.io/download.html`}>
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
          </a>
        </p>
      );
    }
  }

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };

  const onMintPressed = async () => {
    const { success, status } = await mint();
    setStatus(status);
    if (success) {
			console.log("sucess")
    //   setName("");
    //   setDescription("");
    //   setURL("");
    }
  };

	const switchSection = (elem) => {
		let depositSec = document.querySelector("#deposit-sec");
		let mintSec = document.querySelector("#mint-sec");
		
		if(elem.id === "mint") {
			mintSec.className = "section block"; 
			depositSec.className = "section d-none"; 
		} else {
			mintSec.className = "section d-none"; 
			depositSec.className = "section block"; 
		}

	}

  return (
		<div>
			<div className="navbar nabar-light" style={{backgroundColor: "#e3f2fd"}}>
				<a
					className="navbar-brand col-sm-3 col-md-2 mr-0"
					href="/"
					target="#"
					rel="noopener noreferrer"
				>
					SlayerBadge Tokens
				</a>
			</div>
				<div className="container-fluid Minter">
					<div className="row ">
						<div className="col-6 mt-5 mx-auto shadow p-3">
							<div className="mt-3 text-right">
								<div className="">
									<button 
										className="btn btn-primary" 
										id="walletButton" 
										onClick={connectWalletPressed}
									>
										{walletAddress.length > 0 ? (
										"Connected: " +
										String(walletAddress).substring(0, 6) +
										"..." +
										String(walletAddress).substring(38)
										) : (
											<span>Connect Wallet</span>
										)}
									</button>
								</div>
							</div>
							<div className="row goto-sec my-3">
								<div className="nav">
									<a href="#" id="mint"
										onClick={(event) => switchSection(event.target)}
									>Goto Mint Page</a>
								</div>
								<div className="nav position-absolute" style={{right:0}}>
									<a href="#" id="deposit"
										onClick={(event) => switchSection(event.target)}
									>Goto Deposit Page</a>
								</div>
							</div>
							<div className="row mb-3">
								<div className="mx-auto">
								<br />
								<h1 id="title">SlayerBadge Token</h1>
							
								<div className="section" id="mint-sec">
									<button 
										id="mintButton" 
										className="btn btn-primary"
										onClick={onMintPressed}
									>
										Mint NFT
									</button>
									
								</div>
								<div className="section d-none" id="deposit-sec">
									<form
										className="form-group"
										onSubmit={(event) => {
											event.preventDefault();
											
										}}
									>
										<div className="form-group">
											<label 
												htmlFor="depositInput"
											>
												Deposit
											</label>
											<div 
												className="input-group mb-3"
											>
												<input
													name="deposit"
													id="depositInput"
													className="form-control"
													type="number"
													placeholder="e.g. "
													onChange={(event) => setDeposit(event.target.value)}
												/>
												<div 
													className="input-group-append"
												>
													<input 
														type="submit"
														className="btn btn-primary"
														value="Deposit"
													/>
												</div>
											</div>
										</div>
								{/* 🤔 */}
									</form>
								</div>
								<p id="status" style={{ color: "red" }}>
									{status}
								</p>
							</div>
						</div>
					</div>
					<div className="row" id="deposit">
								
					</div>			
				</div>
			</div>
		</div>
	);
};

export default Minter;
