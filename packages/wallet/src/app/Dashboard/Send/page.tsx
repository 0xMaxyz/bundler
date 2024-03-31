'use client'
import styles from '../../index.module.css'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { TurnkeyClient } from '@turnkey/http'
import { WebauthnStamper } from '@turnkey/webauthn-stamper'
import { TurnkeySigner } from '@turnkey/ethers'
import { ERC4337EthersProvider } from '@account-abstraction/sdk'
import { ethers } from 'ethers'
import { TransactionDetailsForUserOp } from '@account-abstraction/sdk/src/TransactionDetailsForUserOp'
import { useUserContext } from '@/context/userContext'
import { bundler } from '@/utils/bundler'
import { useRouter } from 'next/navigation'
import { provider } from '@/utils/provider'
import { getAddress } from '@/transactions/accountFactory'
import { parseUnits } from 'ethers/lib/utils'
import { PaymasterAddress } from '@/constants/Contracts'
import AddressViewer from '../../Components/AddressViewer'

interface transferFormData {
  amount: number
  reciever: string
}

export default function WalletPage() {
  const router = useRouter()
  const { account, simpleAccountApi } = useUserContext()
  const [balance, setBalance] = useState<string | null>(null)
  const { register: transferFormRegister, handleSubmit: transferFormSubmit } =
    useForm<transferFormData>()

  const stamper = new WebauthnStamper({
    rpId: process.env.NEXT_PUBLIC_RPID!
  })

  const passkeyHttpClient = new TurnkeyClient(
    {
      baseUrl: process.env.NEXT_PUBLIC_TURNKEY_API_BASE_URL!
    },
    stamper
  )
  const transfer = async (data: transferFormData) => {
    if (account == null) {
      throw new Error('sub-org id or private key not found')
    }
    console.log('Here we are in the sign message:')
    const api = simpleAccountApi!
    const recieverAddress = await getAddress(data.reciever)
    console.log('reciever:', recieverAddress)
    console.log('amount:', data.amount)
    console.log(
      'WEI AMount: ',
      parseUnits(data.amount.toString(), 'ether').toString()
    )
    const txDetail: TransactionDetailsForUserOp = {
      target: recieverAddress,
      gasLimit: 210000,
      maxFeePerGas: parseUnits('0.15', 'gwei'),
      maxPriorityFeePerGas: 0,
      value: parseUnits(data.amount.toString(), 'ether'),
      data: '0x'
    }
    console.log('api', api)
    console.log('Hello')
    const unsignedUserOp = await api.createUnsignedUserOp(txDetail)
    console.log('unsigned user op', unsignedUserOp)
    unsignedUserOp.paymaster = PaymasterAddress
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

  useEffect(() => {
    if (account == null) {
      // router.push('/')
    }
  }, [account])
  useEffect(() => {
    if (account != null) {
      const getBalanc = async () => {
        const balance = await provider.getBalance(account.address)
        setBalance(ethers.utils.formatEther(balance))
      }
      getBalanc()
    }
  }, [account])
  return (
    <main className={styles.main}>
      <img className="w-32  h-32" src="/Logo.png"></img>
      <div className="flex flex-col w-full border rounded-2xl p-8 rounded shadow">
        {account !== null && (
          <div className="flex flex-row  justify-center pb-4">
            <span className="text-xl">{account.name}</span>
          </div>
        )}
        {account !== null && (
          <div>
            <form
              className={styles.form}
              onSubmit={transferFormSubmit(transfer)}
            >
              <div className="flex flex-col gap-4">
                <div className="flex flex-col  items-start">
                  Amount:
                  <input
                    className={styles.input}
                    {...transferFormRegister('amount')}
                    placeholder="eg. 0.001"
                  />
                </div>

                <div className="flex flex-col items-start">
                  Reciever:
                  <input
                    className={styles.input}
                    {...transferFormRegister('reciever')}
                    placeholder="eg. vitalik"
                  />
                </div>
                <input
                  className="btn btn-primary btn-md"
                  type="submit"
                  value="Sign & Send"
                />
              </div>
            </form>
          </div>
        )}
      </div>
    </main>
  )
}
