'use client'
import styles from './index.module.css'
import Logo from '../../public/Logo.png'
import axios from 'axios'
import { useEffect, useState } from 'react'
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
import { CircularProgress } from '@mui/material'
import { provider } from '@/utils/provider'
import {
  EntryPointAddress,
  SimpleAccountFactoryAddress
} from '@/constants/Contracts'
import { useRouter } from 'next/navigation'
import { stamper } from '@/utils/stamper'
import Link from 'next/link'

interface subOrgFormData {
  subOrgName: string
}

interface signingFormData {
  messageToSign: string
}
export default function Home() {
  const router = useRouter()
  const { account, setAccount, setSimpleAccountApi } = useUserContext()
  const [loading, setLoading] = useState(false)
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
  const createSubOrgAndWallet = async () => {
    router.push('CreateWallet')
  }

  useEffect(() => {
    if (account != null) {
      router.push('/Dashboard')
    }
  }, [account])
  const login = async () => {
    setLoading(true)
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
    setLoading(false)
  }

  return (
    <main className={styles.main}>
      <img className="w-48  h-48" src="/Logo.png"></img>
      <h2 className="">Let's setup your wallet</h2>
      {loading ? (
        <CircularProgress />
      ) : (
        <div className="flex flex-row space-x-4">
          <form className={styles.form} onSubmit={loginFormSubmit(login)}>
            <div className="flex flex-col justify-start">
              <input
                className="btn btn-primary w-48"
                type="submit"
                value="Login"
              />
              <Link
                className=" underline underline-offset-2"
                href={'/RecoverWallet'}
              >
                lost device?
              </Link>
            </div>
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
      )}
    </main>
  )
}
