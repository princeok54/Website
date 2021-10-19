import React from "react";
import { useEffect, useState } from "react";
import {
  connectWallet,
  getCurrentWalletConnected,
  mint,
	loadWeb3,
} from "../util/interact.js";


const Deposit = (props) => {
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");

  
}