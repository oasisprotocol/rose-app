import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import { bytesToHex, hexToBytes } from "viem";
import { useAccount, useSignMessage } from "wagmi";
import { type OasisClient, getAccountBalance, getAccountFromSecret, getOasisNic } from "./oasisstuff";

function toBase64(u8: Uint8Array) {
  return btoa(String.fromCharCode(...u8));
}

const LOCALSTORAGE_ACCOUNTS_KEY = "accounts";

// https://docs.metamask.io/wallet/how-to/sign-data/siwe/
// https://eips.ethereum.org/EIPS/eip-4361
function siweMessageConsensusToSapphire(address: `0x${string}`) {
  const statement =
    "Signing this message will generate an Oasis Consensus account, " +
    "please don't sign this message on any other site";
  const issuedAt = "2000-01-01T00:00:01Z";
  return (
    `${window.location.host} wants you to sign in with your Ethereum account:\n` +
    `${address}\n` +
    `\n` +
    `${statement}\n` +
    `\n` +
    `URI: ${window.location.href}\n` +
    `Version: 1\n` + // Must be 1
    `Chain ID: 23294\n` + // Sapphire Mainnet
    `Nonce: noReplayProtection\n` + // All fields must be constant to always derive the same account
    `Issued At: ${issuedAt}`
  );
}

// Load derived Consensus account keys from localStorage
function loadAccountKeys() {
  const result = localStorage.getItem(LOCALSTORAGE_ACCOUNTS_KEY);
  if (result) {
    const out = new Map<`0x${string}`, Uint8Array>();
    const data = JSON.parse(result);
    for (const [k, v] of Object.entries(data)) {
      const vBytes = hexToBytes(v as `0x${string}`);
      out.set(k as `0x${string}`, vBytes);
    }
    return out;
  }
}

// Save a derived consensus account key for an Ethereum address into localStorage
function saveAccountKey(account: `0x${string}`, key: Uint8Array) {
  let result = localStorage.getItem(LOCALSTORAGE_ACCOUNTS_KEY);
  if (result) {
    const data = JSON.parse(result);
    data[account] = bytesToHex(key);
    result = JSON.stringify(data);
  } else {
    const data = new Map();
    data.set(account, bytesToHex(key));
    result = JSON.stringify(Object.fromEntries(data.entries()));
  }
  localStorage.setItem(LOCALSTORAGE_ACCOUNTS_KEY, result);
}

function App() {
  const account = useAccount();
  const { signMessageAsync } = useSignMessage();
  const chainId = account.chainId;
  const [stakingSecret, setConsensusSecret] = useState<Uint8Array>();
  const [stakingAddress, setStakingAddress] = useState<string>();
  const [stakingBalance, setStakingBalance] = useState<bigint>();
  const [nic] = useState<OasisClient>(getOasisNic("testnet"));

  // When Web3 address changes, load any derived consensus keys
  useEffect(() => {
    (async () => {
      console.log("Account Changed", account.address);
      const accounts = loadAccountKeys();
      if (accounts && account.address && accounts.has(account.address)) {
        const key = accounts.get(account.address);
        setConsensusSecret(key);
        if (key) {
          const a = await getAccountFromSecret(key);
          setStakingAddress(a.addressBech32);
          const info = await getAccountBalance(nic, a.address);
          console.log("Acct Balance", a.addressBech32, info);
          setStakingBalance(info.balance);
        }
      } else {
        setConsensusSecret(undefined);
      }
    })();
  }, [account.address]);

  async function submitWithdrawTx() {
    if (!stakingSecret) {
      return;
    }
    const a = await getAccountFromSecret(stakingSecret);
  }

  // When 'Generate' button is pressed, do SIWE then derive Consensus key
  async function generateKeypair() {
    console.log("generateKeypair for", account.address);
    if (chainId && account.address) {
      const signature = await signMessageAsync({
        message: siweMessageConsensusToSapphire(account.address),
      });
      console.log("Signature is", signature);
      const digest = await window.crypto.subtle.digest("SHA-512", hexToBytes(signature));
      console.log("Digest", digest);
      const secret = new Uint8Array(digest);
      saveAccountKey(account.address, secret);
      if (!stakingSecret || bytesToHex(secret) != bytesToHex(stakingSecret)) {
        setConsensusSecret(secret);
        // TODO: load account details
      }
    }
  }

  function CopyStakingSecret() {
    if (stakingSecret) {
      navigator.clipboard.writeText(toBase64(stakingSecret));
    }
  }

  function GenerateButton() {
    if (stakingSecret) {
      return (
        <div>
          Address: <code>{stakingAddress}</code>
          <br />
          Secret: <input type="text" readOnly value={toBase64(stakingSecret)}></input>
          <button onClick={CopyStakingSecret}>&#x2398;</button>
          <br />
          Balance: {stakingBalance?.toString()} wei
        </div>
      );
    } else {
      return <button onClick={generateKeypair}>Generate</button>;
    }
  }

  return (
    <>
      <div>
        <h1>Step 1</h1>

        <ConnectButton />
      </div>

      <div>
        <h2>Step 2</h2>
        <div>
          <button>Switch Chain to Sapphire</button>
        </div>
      </div>

      <div>
        <h2>Step 3</h2>
        <GenerateButton />
      </div>

      {stakingBalance && (
        <div>
          <h2>Step 4</h2>
          <button onClick={submitWithdrawTx}>Withdraw all to {account.address}</button>
        </div>
      )}
    </>
  );
}

export default App;
