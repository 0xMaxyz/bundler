'use client'
import React, { useState } from 'react'
import styles from "../../pages/index.module.css";
import { provider } from '@/utils/provider';
import { useForm } from 'react-hook-form';
import { SimpleAccountFactoryAddress } from '@/constants/Contracts';
import { ethers } from 'ethers';
import { SimpleAccountFactory__factory } from '@account-abstraction/utils';
import { log } from 'console';
import { WebauthnStamper } from '@turnkey/webauthn-stamper';
import { TurnkeyClient } from '@turnkey/http';
import axios from 'axios';

type CreateWalletFormData = {
    walletName: string;
};
const generateRandomBuffer = (): ArrayBuffer => {
    const arr = new Uint8Array(32);
    crypto.getRandomValues(arr);
    return arr.buffer;
};
const CreateWalletPage = () => {    
    
    const[name, setName] = useState<string|null>(null);
    const { register: CreateWalletFormRegister, handleSubmit: creaetWalletFormSubmit } =
    useForm<CreateWalletFormData>();
    const stamper = new WebauthnStamper({
        rpId: "localhost",
      });
    
      const passkeyHttpClient = new TurnkeyClient(
        {
          baseUrl: process.env.NEXT_PUBLIC_TURNKEY_API_BASE_URL!,
        },
        stamper
      );
    //   const createSubOrgAndWallet = async () => {
    //     const challenge = generateRandomBuffer();
    //     // const subOrgName = `Turnkey Ethers+Passkey Demo - ${humanReadableDateTime()}`;
    //     const subOrgName = 
    //     const authenticatorUserId = generateRandomBuffer();
    
    //     const attestation = await getWebAuthnAttestation({
    //       publicKey: {
    //         rp: {
    //           id: "localhost",
    //           name: "Turnkey Ethers Passkey Demo",
    //         },
    //         challenge,
    //         pubKeyCredParams: [
    //           {
    //             type: "public-key",
    //             alg: -7,
    //           },
    //           {
    //             type: "public-key",
    //             alg: -257,
    //           },
    //         ],
    //         user: {
    //           id: authenticatorUserId,
    //           name: subOrgName,
    //           displayName: subOrgName,
    //         },
    //       },
    //     });
    
    //     const res = await axios.post("/api/createSubOrg", {
    //       subOrgName: subOrgName,
    //       attestation,
    //       challenge: base64UrlEncode(challenge),
    //     });
    
    //     const response = res.data as TWalletDetails;
    //     console.log(response)
    //     setWallet(response);
    //   };
    const checkName = async(data: CreateWalletFormData)=>{
        setName
        const name = data.walletName.toLowerCase().trim();
        console.log("Your selected name :", name);
        const simpleAccountFactory = SimpleAccountFactory__factory.connect(
            SimpleAccountFactoryAddress,
            provider
          );
        const namekech = ethers.utils.keccak256(
            ethers.utils.toUtf8Bytes(name));
        console.log("Kecheck name ", namekech);
        console.log("bignumber", ethers.BigNumber.from(namekech));
        
        const address = await simpleAccountFactory.AddressOf(ethers.BigNumber.from(namekech));
        setName(address)
    }
  return (
    <div>CreateWalletPage
        {name && (
          <div className={styles.info}>
            ETH address: <br />
            <span className={styles.code}>{name}</span>
          </div>
        )}
        <form
            className={styles.form}
            onSubmit={creaetWalletFormSubmit(checkName)}
          >
            <input
                className={styles.input}
                {...CreateWalletFormRegister("walletName")}
                placeholder="wallet name to check"
            />
            <input
                className={styles.button}
                type="submit"
                value="Create Wallet"
            />
        </form>
    </div>


  )
}

export default CreateWalletPage