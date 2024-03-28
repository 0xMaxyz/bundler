import Image from "next/image";
import styles from "./index.module.css";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { getWebAuthnAttestation, TurnkeyClient } from "@turnkey/http";
import { WebauthnStamper } from "@turnkey/webauthn-stamper";
import { TurnkeySigner } from "@turnkey/ethers";
import { TWalletDetails } from "../types";
import { ClientConfig, ERC4337EthersProvider, SimpleAccountAPI, wrapProvider } from "@account-abstraction/sdk";
// import { ethers } from 'hardhat';
import {ethers} from 'ethers'
import { TransactionDetailsForUserOp } from "@account-abstraction/sdk/src/TransactionDetailsForUserOp";
import { SimpleAccountFactory__factory } from "../../../../submodules/account-abstraction/typechain";
import { PaymasterAPI } from "@account-abstraction/sdk";

type subOrgFormData = {
  subOrgName: string;
};

type privateKeyFormData = {
  privateKeyName: string;
};

type signingFormData = {
  messageToSign: string;
};

const generateRandomBuffer = (): ArrayBuffer => {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return arr.buffer;
};

const base64UrlEncode = (challenge: ArrayBuffer): string => {
  return Buffer.from(challenge)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
};

type TPrivateKeyState = {
  id: string;
  address: string;
} | null;

type TSignedMessage = {
  message: string;
  signature: string;
} | null;

type TWalletState = TWalletDetails | null;

const humanReadableDateTime = (): string => {
  return new Date().toLocaleString().replaceAll("/", "-").replaceAll(":", ".");
};

export default function Home() {
  const [wallet, setWallet] = useState<TWalletState>(null);
  const [subOrgId, setSubOrgId] = useState<string | null>(null);
  const [privateKey, setPrivateKey] = useState<TPrivateKeyState>(null);
  const [signedMessage, setSignedMessage] = useState<TSignedMessage>(null);

  const { handleSubmit: subOrgFormSubmit } = useForm<subOrgFormData>();
  const { register: signingFormRegister, handleSubmit: signingFormSubmit } =
    useForm<signingFormData>();
  const { register: _loginFormRegister, handleSubmit: loginFormSubmit } =
    useForm();

  const stamper = new WebauthnStamper({
    rpId: "localhost",
  });

  const passkeyHttpClient = new TurnkeyClient(
    {
      baseUrl: process.env.NEXT_PUBLIC_TURNKEY_API_BASE_URL!,
    },
    stamper
  );
  const paymasterDeposit = async()=>{
    if(wallet!=null){
    }
  }
  const signMessage = async (data: signingFormData) => {
    if (!wallet) {
      throw new Error("sub-org id or private key not found");
    }
    console.log("Here we are in the sign message:");
    const entryPointAddress = "0x0000000071727De22E5E9d8BAf0edAc6f37da032";
    const simpleAccountFactoryAddress = "0x12a4F339F74c08F23D8033dF4457eC253DC9AdC0";
    const paymasterAddress = "0xc523FF9698230096d4aDa45D52FA0063E109618D";
    const paymaterApi = new PaymasterAPI()
    const provider = new ethers.providers.JsonRpcProvider("https://node.botanixlabs.dev");
    let erc4337Provider: ERC4337EthersProvider;
    const bundlerUrl = "http://89.208.105.188:12300/rpc";
    const clientConfig: ClientConfig = {
      entryPointAddress: entryPointAddress,
      bundlerUrl
    }

    const ethersSigner = new TurnkeySigner({
      client: passkeyHttpClient,
      organizationId: wallet.subOrgId,
      signWith: wallet.address,
    });
    const api = new SimpleAccountAPI({
      provider,
      entryPointAddress: entryPointAddress,
      owner: ethersSigner,
      factoryAddress: simpleAccountFactoryAddress,
    })
    console.log("AA address: ", await api.getAccountAddress());
    const data2 = new ethers.utils.Interface([
      'function hello() external'
    ]).encodeFunctionData('hello', [])
    const txDetail: TransactionDetailsForUserOp = {
      target: '0x629f7104f2d1afce975d22011d454b90e030d562',
      gasLimit: 210000,
      maxFeePerGas: 10000000,
      maxPriorityFeePerGas: 0,
      value: 0,
      data:data2
    }
    const unsignedUserOp = await api.createUnsignedUserOp(txDetail);
    console.log("unsigned user op", unsignedUserOp);
    unsignedUserOp.paymaster= paymasterAddress;
    unsignedUserOp.paymasterPostOpGasLimit = 3e5;
    unsignedUserOp.paymasterVerificationGasLimit = 3e5;
    unsignedUserOp.preVerificationGas = 50000;
    console.log("unsigned user op with paymaster data ", unsignedUserOp);
    const signedTx = await api.signUserOp(unsignedUserOp);
    console.log("signed transaction:", signedTx);
    erc4337Provider = await wrapProvider(provider, clientConfig, ethersSigner)
    try {
      const userOpHash =
        await erc4337Provider.httpRpcClient.sendUserOpToBundler(signedTx)
      const txid = await api.getUserOpReceipt(userOpHash)
      console.log('userOpHash', userOpHash, 'txid=', txid)
    } catch (error: any) {
      console.error('sendUserOpToBundler failed', error)
      // throw new Error(`sendUserOpToBundler failed', ${error}`)
    }
    // const signedMessage = await ethersSigner.signMessage(data.messageToSign);

    // setSignedMessage({
    //   message: data.messageToSign,
    //   signature: signedMessage,
    // });
  };


  const createSubOrgAndWallet = async () => {
    const challenge = generateRandomBuffer();
    const subOrgName = `Turnkey Ethers+Passkey Demo - ${humanReadableDateTime()}`;
    const authenticatorUserId = generateRandomBuffer();

    const attestation = await getWebAuthnAttestation({
      publicKey: {
        rp: {
          id: "localhost",
          name: "Turnkey Ethers Passkey Demo",
        },
        challenge,
        pubKeyCredParams: [
          {
            type: "public-key",
            alg: -7,
          },
          {
            type: "public-key",
            alg: -257,
          },
        ],
        user: {
          id: authenticatorUserId,
          name: subOrgName,
          displayName: subOrgName,
        },
      },
    });

    const res = await axios.post("/api/createSubOrg", {
      subOrgName: subOrgName,
      attestation,
      challenge: base64UrlEncode(challenge),
    });

    const response = res.data as TWalletDetails;
    console.log(response)
    setWallet(response);
  };


  const login = async () => {
    try {
      // We use the parent org ID, which we know at all times...
      const signedRequest = await passkeyHttpClient.stampGetWhoami({
        organizationId: process.env.NEXT_PUBLIC_ORGANIZATION_ID!,
      });
      // ...to get the sub-org ID, which we don't know at this point because we don't
      // have a DB. Note that we are able to perform this lookup by using the
      // credential ID from the users WebAuthn stamp.
      // In our login endpoint we also fetch wallet details after we get the sub-org ID
      // (our backend API key can do this: parent orgs have read-only access to their sub-orgs)
      const res = await axios.post("/api/login", signedRequest);
      if (res.status !== 200) {
        throw new Error(`error while logging in (${res.status}): ${res.data}`);
      }

      const response = res.data as TWalletDetails;
      setWallet(response);
    } catch (e: any) {
      const message = `caught error: ${e.toString()}`;
      console.error(message);
      alert(message);
    }
  };

  return (
    <main className={styles.main}>
      <a href="https://turnkey.com" target="_blank" rel="noopener noreferrer">
        <Image
          src="/logo.svg"
          alt="Turnkey Logo"
          className={styles.turnkeyLogo}
          width={100}
          height={24}
          priority
        />
      </a>
      <div>
        {wallet !== null && (
          <div className={styles.info}>
            Your sub-org ID: <br />
            <span className={styles.code}>{wallet.subOrgId}</span>
          </div>
        )}
        {wallet && (
          <div className={styles.info}>
            ETH address: <br />
            <span className={styles.code}>{wallet.address}</span>
          </div>
        )}
        {signedMessage && (
          <div className={styles.info}>
            Message: <br />
            <span className={styles.code}>{signedMessage.message}</span>
            <br />
            <br />
            Signature: <br />
            <span className={styles.code}>{signedMessage.signature}</span>
            <br />
            <br />
            <a
              href="https://etherscan.io/verifiedSignatures"
              target="_blank"
              rel="noopener noreferrer"
            >
              Verify with Etherscan
            </a>
          </div>
        )}
      </div>
      {!wallet && (
        <div>
          <h2>Create a new wallet</h2>
          <p className={styles.explainer}>
            We&apos;ll prompt your browser to create a new passkey. The details
            (credential ID, authenticator data, client data, attestation) will
            be used to create a new{" "}
            <a
              href="https://docs.turnkey.com/getting-started/sub-organizations"
              target="_blank"
              rel="noopener noreferrer"
            >
              Turnkey Sub-Organization
            </a>
            {" "}and a new{" "}
            <a
              href="https://docs.turnkey.com/getting-started/wallets"
              target="_blank"
              rel="noopener noreferrer"
            >
            Wallet
            </a> within it.
            <br />
            <br />
            This request to Turnkey will be created and signed by the backend
            API key pair.
          </p>
          <form
            className={styles.form}
            onSubmit={subOrgFormSubmit(createSubOrgAndWallet)}
          >
            <input
              className={styles.button}
              type="submit"
              value="Create new wallet"
            />
          </form>
          <br />
          <br />
          <h2>Already created your wallet? Log back in</h2>
          <p className={styles.explainer}>
            Based on the parent organization ID and a stamp from your passkey
            used to created the sub-organization and wallet, we can look up your
            sub-organization using the{" "}
            <a
              href="https://docs.turnkey.com/api#tag/Who-am-I"
              target="_blank"
              rel="noopener noreferrer"
            >
              Whoami endpoint.
            </a>
          </p>
          <form className={styles.form} onSubmit={loginFormSubmit(login)}>
            <input
              className={styles.button}
              type="submit"
              value="Login to sub-org with existing passkey"
            />
          </form>
        </div>
      )}
      {wallet !== null &&  (
        <div>
          <h2>Now let&apos;s sign something!</h2>
          <p className={styles.explainer}>
            We&apos;ll use an{" "}
            <a
              href="https://docs.ethers.org/v5/api/signer/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ethers signer
            </a>{" "}
            to do this, using{" "}
            <a
              href="https://www.npmjs.com/package/@turnkey/ethers"
              target="_blank"
              rel="noopener noreferrer"
            >
              @turnkey/ethers
            </a>
            . You can kill your NextJS server if you want, everything happens on
            the client-side!
          </p>
          <form
            className={styles.form}
            onSubmit={signingFormSubmit(signMessage)}
          >
            <input
              className={styles.input}
              {...signingFormRegister("messageToSign")}
              placeholder="Write something to sign..."
            />
            <input
              className={styles.button}
              type="submit"
              value="Sign Message"
            />
          </form>
        </div>
      )}
    </main>
  );
}
