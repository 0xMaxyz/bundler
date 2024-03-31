'use client'
import styles from '../../index.module.css'
import { useEffect, useMemo, useState } from 'react'
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
import { getAddress, nameOccupied } from '@/transactions/accountFactory'
import { parseUnits } from 'ethers/lib/utils'
import { Domain, PaymasterAddress } from '@/constants/Contracts'
import AddressViewer from '../../Components/AddressViewer'
import WalletNameInput, {
  WalletNameStatus
} from '@/app/Components/WalletNameInput'
import { stamper } from '@/utils/stamper'
import { CircularProgress } from '@mui/material'

interface transferFormData {
  amount: number
  walletName: string
}

export default function WalletPage() {
  const [name, setName] = useState<string | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  const [nameCheckloading, setNameCheckloading] = useState(false)
  const [nameExist, setNameExist] = useState<boolean | undefined>(undefined)
  const router = useRouter()
  const { account, simpleAccountApi } = useUserContext()
  const [balance, setBalance] = useState<string | null>(null)
  const {
    register: transferFormRegister,
    handleSubmit: transferFormSubmit,
    watch: transferFormWatch
  } = useForm<transferFormData>()
  const walletNameChange = transferFormWatch('walletName')

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
    setLoading(true)
    try {
      console.log('Here we are in the sign message:')
      const api = simpleAccountApi!
      const recieverAddress = await getAddress(data.walletName)
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

      const userOpHash =
        await erc4337Provider.httpRpcClient.sendUserOpToBundler(signedTx)
      const txid = await api.getUserOpReceipt(userOpHash)
      console.log('userOpHash', userOpHash, 'txid=', txid)
    } catch (error: any) {
      console.error('sendUserOpToBundler failed', error)
      // throw new Error(`sendUserOpToBundler failed', ${error}`)
    }
    setLoading(false)
  }
  const checkName = (name: string) => {
    setNameCheckloading(true)
    console.log('WalletName: ', name)
    const check = async () => {
      const stName = name.toLowerCase().trim()
      setNameExist(await nameOccupied(stName))
      setNameCheckloading(false)
    }
    check()
  }
  const status: WalletNameStatus | undefined = useMemo(() => {
    if (nameCheckloading) return WalletNameStatus.loading
    if (nameExist) return WalletNameStatus.ok
    else if (nameExist === false) return WalletNameStatus.error
    else return undefined
  }, [name, nameCheckloading, nameExist])
  useEffect(() => {
    if (walletNameChange) {
      const timeoutId = setTimeout(() => {
        setName(walletNameChange.toLowerCase().trim() + '.' + Domain)
      }, 500)
      return () => clearTimeout(timeoutId)
    }
  }, [walletNameChange, 500])
  useEffect(() => {
    if (name) checkName(name)
  }, [name])
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
                  <WalletNameInput
                    status={status}
                    domain={Domain}
                    formRegistrationAttr={transferFormRegister('walletName')}
                  ></WalletNameInput>
                  {/* <input
                    className={styles.input}
                    {...transferFormRegister('walletName')}
                    placeholder="eg. vitalik"
                  /> */}
                </div>
                {loading ? (
                  <CircularProgress />
                ) : (
                  <input
                    className="btn btn-primary btn-md"
                    disabled={status != WalletNameStatus.ok}
                    type="submit"
                    value="Sign & Send"
                  />
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </main>
  )
}
