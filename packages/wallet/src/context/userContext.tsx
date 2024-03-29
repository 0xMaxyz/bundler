'use client'
import { SimpleAccountAPI } from '@account-abstraction/sdk';
import { TurnkeySigner } from '@turnkey/ethers';
import React, { ReactNode } from 'react'
import { useEffect, createContext, useState, useContext } from "react";
import { provider } from '@/utils/provider';
import { EntryPointAddress, SimpleAccountFactoryAddress } from '@/constants/Contracts';
import { WebauthnStamper } from '@turnkey/webauthn-stamper';
import { TurnkeyClient } from '@turnkey/http';
import { ethers } from 'ethers';
export interface Account{
    name: string,
    address: string,
    subOrgId: string,
    ownerAddress: string
}
const setLocalStorageContext = async(AccountContext: Account)=>{
    localStorage.setItem("ACCOUNT_CONTEXT", JSON.stringify(AccountContext))
}
export interface UserContextProps {
    setSimpleAccountApi:React.Dispatch<React.SetStateAction<SimpleAccountAPI|null>>;
    simpleAccountApi:SimpleAccountAPI|null;
    account:Account|null;
    setAccount:React.Dispatch<React.SetStateAction<Account|null>>;
  }
export const UserContext = createContext<UserContextProps>(
    {} as UserContextProps,
  );
export const useUserContext = () => {
    return useContext(UserContext);
}
export function UserContextProvider({
    children
  }: {
    children: ReactNode;
  }): JSX.Element {
    const [account,setAccount] = useState<Account|null>(null);
    const [simpleAccountApi, setSimpleAccountApi] = useState<SimpleAccountAPI|null>(null);
    const setUserContext = async(accountContext:Account)=>{
      try {
        console.log("Account: ",accountContext);
        setAccount(accountContext);
        const stamper = new WebauthnStamper({
            rpId: "localhost",
        });
        const passkeyHttpClient = new TurnkeyClient(
        {
            baseUrl: process.env.NEXT_PUBLIC_TURNKEY_API_BASE_URL!,
        },
        stamper
        );
        const ethersSigner = new TurnkeySigner({
            client: passkeyHttpClient,
            organizationId: accountContext.subOrgId,
            signWith: accountContext.ownerAddress,
        });
        const namekech = ethers.utils.keccak256(
          ethers.utils.toUtf8Bytes(accountContext.name));
        const api = new SimpleAccountAPI({
            provider,
            entryPointAddress: EntryPointAddress,
            owner: ethersSigner,
            factoryAddress: SimpleAccountFactoryAddress,
            index: namekech
        })
        setSimpleAccountApi(api);
        console.log("")
      } catch (error) {
        console.log("Error Setting UserContext:",error)
      }
  
    }
    useEffect(() => {
        if(localStorage.getItem("ACCOUNT_CONTEXT")){
          setUserContext(JSON.parse(localStorage.getItem("ACCOUNT_CONTEXT")!)as Account);
        }
    }, []);
    useEffect(() => {
        if(account){
            setLocalStorageContext(account);
        }
    }, [account]);
    return (
      <UserContext.Provider
        value={{
          setSimpleAccountApi,
          simpleAccountApi,
          setAccount,
          account
        }}
      >
        {children}
      </UserContext.Provider>
    );
  }
  
export default UserContext




// export interface UserContextProps {
//   setEmail:React.Dispatch<React.SetStateAction<string>>;
//   email:string;
//   jwt:string;
//   setJwt:React.Dispatch<React.SetStateAction<string>>;
// }

// export const UserContext = createContext<UserContextProps>(
//   {} as UserContextProps,
// );
// export const useUserContext = () => {
//   return useContext(UserContext);
// }

