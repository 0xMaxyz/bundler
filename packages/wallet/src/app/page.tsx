'use client'
import styles from './index.module.css'
import Logo from '../../public/Logo.png'
import axios from 'axios'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { TurnkeyClient } from '@turnkey/http'
import { WebauthnStamper } from '@turnkey/webauthn-stamper'
import { TurnkeySigner } from '@turnkey/ethers'
import { TWalletDetails } from '../types'
import { SimpleAccountAPI } from '@account-abstraction/sdk'
import { ethers } from 'ethers'
import { TransactionDetailsForUserOp } from '@account-abstraction/sdk/src/TransactionDetailsForUserOp'
import { useUserContext } from '@/context/userContext'
import { bundler } from '@/utils/bundler'
import { getAddress } from '@/transactions/accountFactory'
import { AddressZero } from '@account-abstraction/utils'
import { provider } from '@/utils/provider'
import {
  EntryPointAddress,
  SimpleAccountFactoryAddress
} from '@/constants/Contracts'
import { useRouter } from 'next/navigation'
import { stamper } from '@/utils/stamper'

interface subOrgFormData {
  subOrgName: string
}

interface signingFormData {
  messageToSign: string
}
export default function Home() {
  const router = useRouter()
  const { account, simpleAccountApi, setAccount, setSimpleAccountApi } =
    useUserContext()
  const { handleSubmit: subOrgFormSubmit } = useForm<subOrgFormData>()
  const { register: signingFormRegister, handleSubmit: signingFormSubmit } =
    useForm<signingFormData>()
  const { register: _loginFormRegister, handleSubmit: loginFormSubmit } =
    useForm()
  const passkeyHttpClient = new TurnkeyClient(
    {
      baseUrl: process.env.NEXT_PUBLIC_TURNKEY_API_BASE_URL!
    },
    stamper
  )
  const signMessage = async (data: signingFormData) => {
    if (account == null) {
      throw new Error('sub-org id or private key not found')
    }
    console.log('Here we are in the sign message:')
    const paymasterAddress = '0xc523FF9698230096d4aDa45D52FA0063E109618D'
    const api = simpleAccountApi!
    console.log('AA address: ', await api.getAccountAddress())
    const data2 = new ethers.utils.Interface([
      'function hello() external'
    ]).encodeFunctionData('hello', [])
    const txDetail: TransactionDetailsForUserOp = {
      target: '0x629f7104f2d1afce975d22011d454b90e030d562',
      gasLimit: 210000,
      maxFeePerGas: 10000000,
      maxPriorityFeePerGas: 0,
      value: 0,
      data: data2
    }
    const unsignedUserOp = await api.createUnsignedUserOp(txDetail)
    console.log('unsigned user op', unsignedUserOp)
    unsignedUserOp.paymaster = paymasterAddress
    unsignedUserOp.paymasterPostOpGasLimit = 3e5
    unsignedUserOp.paymasterVerificationGasLimit = 3e5
    unsignedUserOp.preVerificationGas = 100000
    console.log('unsigned user op with paymaster data ', unsignedUserOp)
    const signedTx = await api.signUserOp(unsignedUserOp)
    console.log('signed transaction:', signedTx)
    const ethersSigner = new TurnkeySigner({
      client: passkeyHttpClient,
      organizationId: account.subOrgId,
      signWith: account.ownerAddress
    })
    const erc4337Provider = await bundler(ethersSigner)
    try {
      const userOpHash =
        await erc4337Provider.httpRpcClient.sendUserOpToBundler(signedTx)
      const txid = await api.getUserOpReceipt(userOpHash)
      console.log('userOpHash', userOpHash, 'txid=', txid)
    } catch (error: any) {
      console.error('sendUserOpToBundler failed', error)
      // throw new Error(`sendUserOpToBundler failed', ${error}`)
    }
  }

  const createSubOrgAndWallet = async () => {
    router.push('CreateWallet')
  }

  useEffect(() => {
    if (account != null) {
      router.push('/Dashboard')
    }
  }, [account])
  const login = async () => {
    try {
      // We use the parent org ID, which we know at all times...
      const signedRequest = await passkeyHttpClient.stampGetWhoami({
        organizationId: process.env.NEXT_PUBLIC_ORGANIZATION_ID!
      })
      console.log('Signed Request ', signedRequest)
      // ...to get the sub-org ID, which we don't know at this point because we don't
      // have a DB. Note that we are able to perform this lookup by using the
      // credential ID from the users WebAuthn stamp.
      // In our login endpoint we also fetch wallet details after we get the sub-org ID
      // (our backend API key can do this: parent orgs have read-only access to their sub-orgs)
      const res = await axios.post('/api/login', signedRequest)
      if (res.status !== 200) {
        throw new Error(`error while logging in (${res.status}): ${res.data}`)
      }

      const response = res.data as TWalletDetails
      const address = await getAddress(response.name)
      if (address != AddressZero) {
        setAccount({
          name: response.name,
          ownerAddress: response.address,
          subOrgId: response.subOrgId,
          address
        })
        const ethersSigner = new TurnkeySigner({
          client: passkeyHttpClient,
          organizationId: response.subOrgId,
          signWith: response.address
        })
        const namekech = ethers.utils.keccak256(
          ethers.utils.toUtf8Bytes(response.name)
        )
        const api = new SimpleAccountAPI({
          provider,
          entryPointAddress: EntryPointAddress,
          owner: ethersSigner,
          factoryAddress: SimpleAccountFactoryAddress,
          index: namekech
        })
        setSimpleAccountApi(api)
        router.push('/Dashboard')
      }
      //   setWallet(response);
    } catch (e: any) {
      const message = `caught error: ${e.toString()}`
      console.error(message)
      alert(message)
    }
  }

  return (
    <main className={styles.main}>
      <img className="w-48  h-48" src="/Logo.png"></img>
      <h2 className="">Let's setup your wallet</h2>
      <div className="flex flex-row space-x-4">
        <form className={styles.form} onSubmit={loginFormSubmit(login)}>
          <input className="btn btn-primary w-48" type="submit" value="Login" />
        </form>
        <form
          className={styles.form}
          onSubmit={subOrgFormSubmit(createSubOrgAndWallet)}
        >
          <input
            className="btn btn-primary btn-outline w-48"
            type="submit"
            value="Create Wallet"
          />
        </form>
      </div>
    </main>
  )
}
