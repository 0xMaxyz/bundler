'use client'
import styles from '../index.module.css'
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
import AddressViewer from '../Components/AddressViewer'

export default function WalletPage() {
  const router = useRouter()
  const { account } = useUserContext()
  const [balance, setBalance] = useState<string | null>(null)
  const SendPage = () => {
    router.push('/Dashboard/Send')
  }
  const AddRecoveryPage = () => {
    router.push('/Dashboard/AddRecoveryPage')
  }

  useEffect(() => {
    if (account == null) {
      router.push('/')
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
      <div className="flex flex-col w-full border rounded-2xl p-8 justify-center items-center gap-8 shadow">
        {account !== null && (
          <div className="flex flex-row">
            <span className={styles.code}>{account.name}</span>
          </div>
        )}
        {account != null && (
          <div>
            <AddressViewer address={account.address}></AddressViewer>
          </div>
        )}
        {account != null && (
          <div className="flex flex-row items-center gap-2">
            Baalance:
            <span className="text-2xl font-extrabold">{balance}</span>
            <img className="w-8 h-8" src="/Bitcoin.svg"></img>
            <h2>BTC</h2>
          </div>
        )}
        {account !== null && (
          <div className="flex flex-row gap-8">
            <input
              className="btn btn-primary w-32"
              type="submit"
              value="Transfer"
              onClick={SendPage}
            />
            <input
              className="btn btn-primary btn-outline "
              value=" Add Backup Email"
              onClick={AddRecoveryPage}
            />
          </div>
        )}
      </div>
    </main>
  )
}
