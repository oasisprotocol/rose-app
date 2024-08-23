import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState } from "react";
import { bytesToHex, hexToBytes } from "viem";
import { useAccount, useSignMessage } from "wagmi";

function toBase64(u8: Uint8Array) {
  return btoa(String.fromCharCode(...u8));
}

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

function App() {
  const account = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [stakingSecret, setConsensusSecret] = useState<Uint8Array>();

  // When 'Generate' button is pressed, do SIWE then derive Consensus key
  async function generateKeypair() {
    console.log("generateKeypair for", account.address);
    if (account.address) {
      const signature = await signMessageAsync({
        message: siweMessageConsensusToSapphire(account.address),
      });
      console.log("Signature is", signature);
      const digest = await window.crypto.subtle.digest("SHA-512", hexToBytes(signature));
      console.log("Digest", digest);
      const secret = new Uint8Array(digest);
      if (!stakingSecret || bytesToHex(secret) != bytesToHex(stakingSecret)) {
        setConsensusSecret(secret);
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
          Secret: <input type="text" readOnly value={toBase64(stakingSecret)}></input>
          <button onClick={CopyStakingSecret}>&#x2398;</button>
          <br />
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
    </>
  );
}

export default App;
