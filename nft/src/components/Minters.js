import React from "react";
import { useEffect, useState } from "react";
import './Minter.css'
import {
	connectWallet,
	getCurrentWalletConnected,
	mint,
	loadWeb3,
}
	from "../util/interact.js";

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
					<a href={`https://metamask.io/download.html`}>
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

	return (
		<div className="dice">
			<div className="navbar">
				<div className="nav">
					<a
						className="navbar-brand"
						href="#SlayerBadge Tokens"
						rel="noopener noreferrer"
					>
						SlayerBadge Tokens
					</a>
				</div>
			</div>
			<div className="container">
				<div className="row ">
					<div className="col-6 mt-5 mx-auto shadow p-3">
						<div className="mt-3 text-right">
							<div className="">
								<button
									className="btn-top"
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
						<div className="row-o">
							<div className="mx-auto">
								<br />
								<h1 id="title">SlayerBadge Token</h1>

								<form
									className="form-group"
									onSubmit={(event) => {
										event.preventDefault();

									}}
								>
									<div className="form-groups">
										<label
											htmlFor="depositInput"
											className="de"
										>
											Deposit:
										</label>
										<input
											name="deposit"
											id="depositInput"
											className="form-control"
											type="number"
											placeholder="e.g. "
											onChange={(event) => setDeposit(event.target.value)}
										/>
										<input
											type="submit"
											className="btn"
											value="Deposit"
										/>
									</div>
									{/* 🤔 */}
								</form>
								<div className="mi">
									<button
										id="mintButton"
										className="btn-primary"
										onClick={onMintPressed}
									>
										Mint NFT
									</button>
								</div>
								<p id="status">
									{status}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Minter;
