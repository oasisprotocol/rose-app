import { useAccount, useSignMessage } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useEffect, useState } from 'react';
import { bytesToHex, hexToBytes } from 'viem';
import { OasisClient, OasisSigner, getOasisNic } from './oasisstuff';

function toBase64(u8: Uint8Array) {
  return btoa(String.fromCharCode(...u8));
}

const LOCALSTORAGE_ACCOUNTS_KEY = 'accounts';

const LOGIN_STATEMENT = "Signing this message will generate an Oasis Consensus address, " +
                        "please don't sign the message on any other site";

function createSiweMessage (address:`0x${string}`, chainId: number, statement:string) {
  const scheme = window.location.protocol.slice(0, -1);
  const domain = window.location.host;
  const uri = window.location;

  const version = '1';
  const nonce = 'ROSEMIGRATOR';
  const issuedAt = '2000-01-01T00:00:01Z';

  return `${scheme}://${domain} wants you to sign in with your Ethereum account:\n`+
         `${address}\n` +
         `\n` +
         `${statement}\n` +
         `\n` +
         `URI: ${uri}\n` +
         `Version: ${version}\n` +
         `Chain ID: ${chainId}\n` +
         `Nonce: ${nonce}\n` +
         `Issued At: ${issuedAt}`;
}

// Load derived Consensus account keys from localStorage
function loadAccountKeys() {
  const result = localStorage.getItem(LOCALSTORAGE_ACCOUNTS_KEY);
  if( result ) {
    const out = new Map<`0x${string}`,Uint8Array>();
    const data = JSON.parse(result);
    for( const [k,v] of Object.entries(data) ) {
      const vBytes = hexToBytes(v as `0x${string}`);
      out.set(k as `0x${string}`, vBytes);
    }
    return out;
  }
}

// Save a derived consensus account key for an Ethereum address into localStorage
function saveAccountKey(account:`0x${string}`, key:Uint8Array) {
  let result = localStorage.getItem(LOCALSTORAGE_ACCOUNTS_KEY);
  if( result ) {
    const data = JSON.parse(result);
    data[account] = bytesToHex(key);
    result = JSON.stringify(data);
  }
  else {
    const data = new Map();
    data.set(account, bytesToHex(key));
    result = JSON.stringify(Object.fromEntries(data.entries()));
  }
  localStorage.setItem(LOCALSTORAGE_ACCOUNTS_KEY, result);
}

function App() {
  const account = useAccount()
  const { signMessageAsync } = useSignMessage();
  const chainId = account.chainId;
  const [ signer, setSigner ] = useState<OasisSigner>();
  const [ stakingBalance, setStakingBalance ] = useState<bigint>();
  const [ nic ] = useState<OasisClient>(getOasisNic('testnet'));

  // When Web3 address changes, load any derived consensus keys
  useEffect(() => {
    (async () => {
      console.log('Account Changed', account.address);
      const accounts = loadAccountKeys();
      if( accounts && account.address && accounts.has(account.address) ) {
        const key = accounts.get(account.address);
        if( key ) {
          const s = new OasisSigner(nic, key);
          setSigner(s)
          setStakingBalance((await s.niceBalance()).balance);
        }
      }
      setSigner(undefined)
    })();
  }, [account.address]);

  async function submitWithdrawTx ()
  {

  }

  // When 'Generate' button is pressed, do SIWE then derive Consensus key
  async function generateKeypair() {
    console.log('generateKeypair for', account.address);
    if( chainId && account.address ) {
      const signature = await signMessageAsync({
        message: createSiweMessage(account.address, chainId, LOGIN_STATEMENT)
      });
      console.log('Signature is', signature);
      const digest = await window.crypto.subtle.digest('SHA-512', hexToBytes(signature));
      console.log('Digest', digest);
      const secret = new Uint8Array(digest);
      saveAccountKey(account.address, secret);
      if( ! signer || bytesToHex(secret) != bytesToHex(signer.secret) ) {
        const s = new OasisSigner(nic, secret);
        setSigner(s)
        // TODO: load account details
      }
    }
  }

  function CopyStakingSecret() {
    if( signer ) {
      navigator.clipboard.writeText(toBase64(signer.secret));
    }
  }

  function GenerateButton() {
    if( signer ) {
      return <div>
        Address: <code>{signer.addressBech32}</code><br />
        Secret: <input type="text" readOnly value={toBase64(signer.secret)}></input>
        <button onClick={CopyStakingSecret}>&#x2398;</button><br />
        Balance: {stakingBalance?.toString()} wei
      </div>
    }
    else {
      return <button onClick={generateKeypair}>
              Generate
             </button>
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
          <button>
            Switch Chain to Sapphire
          </button>
        </div>
      </div>

      <div>
        <h2>Step 3</h2>
        <GenerateButton/>
      </div>

      {stakingBalance &&
        <div>
          <h2>Step 4</h2>
          <button onClick={submitWithdrawTx}>Withdraw all to {account.address}</button>
        </div>
      }
    </>
  )
}

export default App
