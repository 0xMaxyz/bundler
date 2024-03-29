'use client'
import styles from "../../pages/index.module.css";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { TurnkeyClient } from "@turnkey/http";
import { WebauthnStamper } from "@turnkey/webauthn-stamper";
import { TurnkeySigner } from "@turnkey/ethers";
import { ERC4337EthersProvider } from "@account-abstraction/sdk";
import { ethers } from 'ethers'
import { TransactionDetailsForUserOp } from "@account-abstraction/sdk/src/TransactionDetailsForUserOp";
import { SimpleAccountFactory__factory } from "../../../../../submodules/account-abstraction/typechain";
import { useUserContext } from "@/context/userContext";
import { bundler } from "@/utils/bundler";
import { useRouter } from "next/navigation";
import { provider } from "@/utils/provider";
import { getAddress } from "@/transactions/accountFactory";
import { parseUnits } from "ethers/lib/utils";
import { PaymasterAddress } from "@/constants/Contracts";

type subOrgFormData = {
  subOrgName: string;
};

type transferFormData = {
  amount: number;
  reciever: string;
};

const generateRandomBuffer = (): ArrayBuffer => {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return arr.buffer;
};

type TSignedMessage = {
  message: string;
  signature: string;
} | null;

export default function WalletPage() {
  const router = useRouter()
  const {account,simpleAccountApi,setAccount,setSimpleAccountApi} = useUserContext();
  const [signedMessage, setSignedMessage] = useState<TSignedMessage>(null);
  const [balance, setBalance] = useState<string|null>(null);
  const { register: transferFormRegister, handleSubmit: transferFormSubmit } =
    useForm<transferFormData>();
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
  const transfer = async (data: transferFormData) => {
    if (!account) {
      throw new Error("sub-org id or private key not found");
    }
    console.log("Here we are in the sign message:");
    let erc4337Provider: ERC4337EthersProvider;
    const api = simpleAccountApi!;
    const recieverAddress = await getAddress(data.reciever);
    console.log("reciever:",recieverAddress);
    console.log("amount:",data.amount);
    console.log("WEI AMount: ",parseUnits(data.amount.toString(), 'gwei').toString());
    // const txDetail: TransactionDetailsForUserOp = {
    //   target: recieverAddress,
    //   gasLimit: 210000,
    //   maxFeePerGas: parseUnits('0.15', 'gwei'),
    //   maxPriorityFeePerGas: 0,
    //   value:parseUnits(data.amount.toString(), 'gwei'),
    //   data: '0x'
    // }
    console.log("api",api);
    const txDetail: TransactionDetailsForUserOp = {
      target: ethers.constants.AddressZero,
      gasLimit: 210000,
      maxFeePerGas: parseUnits('0.15', 'gwei'),
      maxPriorityFeePerGas: 0,
      value: 0,
      data: '0x'
    }
    console.log("Hello");
    const unsignedUserOp = await api.createUnsignedUserOp(txDetail);
    console.log("unsigned user op", unsignedUserOp);
    unsignedUserOp.paymaster= PaymasterAddress;
    unsignedUserOp.paymasterPostOpGasLimit = 3e5;
    unsignedUserOp.paymasterVerificationGasLimit = 3e5;
    unsignedUserOp.preVerificationGas = 50000;
    console.log("unsigned user op with paymaster data ", unsignedUserOp);
    const signedTx = await api.signUserOp(unsignedUserOp);
    console.log("signed transaction:", signedTx);
    const ethersSigner = new TurnkeySigner({
        client: passkeyHttpClient,
        organizationId: account!.subOrgId,
        signWith: account!.ownerAddress,
      });
    erc4337Provider = await bundler(ethersSigner);
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

  useEffect(() => {
    if(!account){
        router.push("");
    }
  }, [account])
  useEffect(() => {
    if(account){
      const getBalanc = async()=>{
        const balance = await provider.getBalance(account!.address);
        setBalance(ethers.utils.formatEther(balance));
      };
      getBalanc();
    }

  }, [])
  return (
    <main className={styles.main}>
      {/* <a href="https://turnkey.com" target="_blank" rel="noopener noreferrer">
        <Image
          src="/logo.svg"
          alt="Turnkey Logo"
          className={styles.turnkeyLogo}
          width={100}
          height={24}
          priority
        />
      </a> */}
      <div>
        {account !== null && (
          <div className={styles.info}>
            Your wallet name: <br />
            <span className={styles.code}>{account.name}</span>
          </div>
        )}
        {account && (
          <div className={styles.info}>
            ETH address: <br />
            <span className={styles.code}>{account.address}</span>
          </div>
        )}
        {account && (
          <div className={styles.info}>
            Balance : <br />
            <span className={styles.code}>{balance} BTC</span>
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
      {account !== null &&  (
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
            onSubmit={transferFormSubmit(transfer)}
          >
            Amount:
            <input
              className={styles.input}
              {...transferFormRegister("amount")}
              placeholder="eg. 0.001"
            />
            Reciever:
            <input
              className={styles.input}
              {...transferFormRegister("reciever")}
              placeholder="eg. vitalik"
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
