'use client'
import React, { useState, useEffect, useMemo } from 'react'
import styles from '../index.module.css'
import { provider } from '@/utils/provider'
import { useForm } from 'react-hook-form'
import {
  bundlerUrl,
  EntryPointAddress,
  PaymasterAddress,
  SimpleAccountFactoryAddress
} from '@/constants/Contracts'
import { ethers } from 'ethers'
import { AddressZero } from '@account-abstraction/utils'
import { WebauthnStamper } from '@turnkey/webauthn-stamper'
// import { getWebAuthnAttestation, TurnkeyClient } from '@turnkey/http';
import axios from 'axios'
import { base64UrlEncode } from '@/utils/converter'
import { TWalletDetails } from '@/types'
import { TransactionDetailsForUserOp } from '@account-abstraction/sdk/src/TransactionDetailsForUserOp'
import { parseUnits } from 'ethers/lib/utils'
import { TurnkeySigner } from '@turnkey/ethers'
import {
  ClientConfig,
  SimpleAccountAPI,
  wrapProvider
} from '@account-abstraction/sdk'
import { Account, useUserContext } from '@/context/userContext'
import { getAddress } from '@/transactions/accountFactory'
import { useRouter } from 'next/navigation'
// import { TurnkeyClient } from '@turnkey/http/dist/__generated__/services/coordinator/public/v1/public_api.client';
import { getWebAuthnAttestation, TurnkeyClient } from '@turnkey/http'
import { stamper } from '@/utils/stamper'
import WalletNameInput, {
  WalletNameProps,
  WalletNameStatus
} from '../Components/WalletNameInput'
import { bundler } from '@/utils/bundler'
import { create } from 'domain'

interface CreateWalletFormData {
  walletName: string
}
const generateRandomBuffer = (): ArrayBuffer => {
  const arr = new Uint8Array(32)
  crypto.getRandomValues(arr)
  return arr.buffer
}
const CreateWalletPage = (): JSX.Element => {
  const [name, setName] = useState<string | undefined>(undefined)
  const [nameCheckloading, setNameCheckloading] = useState(false)
  const [nameExist, setNameExist] = useState<boolean | undefined>(undefined)
  const router = useRouter()
  const { setAccount, setSimpleAccountApi } = useUserContext()
  const {
    register: CreateWalletFormRegister,
    handleSubmit: createWalletFormSubmit,
    watch: creteWalletFormWatch
  } = useForm<CreateWalletFormData>()
  const passkeyHttpClient = new TurnkeyClient(
    {
      baseUrl: process.env.NEXT_PUBLIC_TURNKEY_API_BASE_URL!
    },
    stamper
  )
  const walletNameChange = creteWalletFormWatch('walletName')
  const createSubOrgAndWallet = async (name: string) => {
    if (!name) {
      return
    }
    const challenge = generateRandomBuffer()
    const authenticatorUserId = generateRandomBuffer()

    const attestation = await getWebAuthnAttestation({
      publicKey: {
        rp: {
          id: process.env.NEXT_PUBLIC_RPID,
          name: 'Anansi Wallet'
        },
        challenge,
        pubKeyCredParams: [
          {
            type: 'public-key',
            alg: -7
          },
          {
            type: 'public-key',
            alg: -257
          }
        ],
        user: {
          id: authenticatorUserId,
          name,
          displayName: name
        }
      }
    })

    const res = await axios.post('/api/createSubOrg', {
      subOrgName: name,
      attestation,
      challenge: base64UrlEncode(challenge)
    })

    const wallet = res.data as TWalletDetails
    console.log(wallet)

    const ethersSigner = new TurnkeySigner({
      client: passkeyHttpClient,
      organizationId: wallet.subOrgId,
      signWith: wallet.address
    })
    const namekech = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(name))
    const api = new SimpleAccountAPI({
      provider,
      entryPointAddress: EntryPointAddress,
      owner: ethersSigner,
      factoryAddress: SimpleAccountFactoryAddress,
      index: namekech
    })

    console.log('AA address: ', await api.getAccountAddress())
    const txDetail: TransactionDetailsForUserOp = {
      target: ethers.constants.AddressZero,
      gasLimit: 210000,
      maxFeePerGas: parseUnits('0.15', 'gwei'),
      maxPriorityFeePerGas: 0,
      value: 0,
      data: '0x'
    }
    const unsignedUserOp = await api.createUnsignedUserOp(txDetail)
    console.log('unsigned user op', unsignedUserOp)
    unsignedUserOp.paymaster = PaymasterAddress
    unsignedUserOp.paymasterPostOpGasLimit = 3e5
    unsignedUserOp.paymasterVerificationGasLimit = 3e5
    unsignedUserOp.preVerificationGas = 100000
    console.log('unsigned user op with paymaster data ', unsignedUserOp)
    const signedTx = await api.signUserOp(unsignedUserOp)
    console.log('signed transaction:', signedTx)
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
    const acc: Account = {
      name,
      address: await api.getAccountAddress(),
      ownerAddress: wallet.address,
      subOrgId: wallet.subOrgId
    }
    setAccount(acc)
    setSimpleAccountApi(api)
    router.push('/Dashboard')
  }
  const Create = (data: CreateWalletFormData) => {
    const create = async () => {
      createSubOrgAndWallet(name!)
    }
    create()
  }
  const checkName = (name: string) => {
    setNameCheckloading(true)
    console.log('WalletName: ', name)
    const check = async () => {
      const stName = name.toLowerCase().trim()
      const address = await getAddress(stName)
      if (address == AddressZero) {
        setNameExist(false)
      } else {
        setNameExist(true)
      }
      setNameCheckloading(false)
    }
    check()
  }
  const status: WalletNameStatus | undefined = useMemo(() => {
    if (nameCheckloading) return WalletNameStatus.loading
    if (nameExist) return WalletNameStatus.error
    else if (nameExist === false) return WalletNameStatus.ok
    else return undefined
  }, [name, nameCheckloading, nameExist])
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setName(walletNameChange)
    }, 500)
    return () => clearTimeout(timeoutId)
  }, [walletNameChange, 500])
  useEffect(() => {
    if (name) checkName(name)
  }, [name])
  return (
    <div className={styles.main}>
      <img className="w-32 h-32" src="/Logo.png"></img>
      <div className="flex flex-col w-full border rounded-2xl shadow">
        CreateWalletPage
        <form className={styles.form} onSubmit={createWalletFormSubmit(create)}>
          <WalletNameInput
            status={status}
            domain="ans"
            formRegistrationAttr={CreateWalletFormRegister('walletName')}
          ></WalletNameInput>
          <input
            className="btn btn-primary btn-md"
            disabled={status != WalletNameStatus.ok}
            type="submit"
            value="Create Wallet"
          />
        </form>
      </div>
    </div>
  )
}

export default CreateWalletPage
