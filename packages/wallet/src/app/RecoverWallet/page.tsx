'use client'
import React, { useRef, useEffect, useState } from 'react'
import { useUserContext } from '@/context/userContext'
import styles from '../index.module.css'
import { preDecode } from '@/utils/JWT'
import { ethers } from 'ethers'
import { TransactionDetailsForUserOp } from '@account-abstraction/sdk/src/TransactionDetailsForUserOp'
import {
  PaymasterAddress,
  SmartAccountFactoryAddress
} from '@/constants/Contracts'
import { parseUnits } from 'ethers/lib/utils'
import { bundler } from '@/utils/bundler'
import { TurnkeySigner } from '@turnkey/ethers'
import { TurnkeyClient } from '@turnkey/http'
import { stamper } from '@/utils/stamper'

const RecoverWallet = () => {
  const divRef = useRef(null)
  const { account, simpleAccountApi } = useUserContext()
  const [jwtClaim, setJwtClaim] = useState<string | undefined>(undefined)
  const setBackupEmail = async () => {
    if (jwtClaim && simpleAccountApi) {
      const jwtDecoded = preDecode(jwtClaim)
      const jwtArray = jwtClaim.split('.')
      const name = ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes(account!.name)
      )
      const digestBeforeKccak = jwtArray[0] + '.' + jwtArray[1]
      console.log('digest before keccheck:', digestBeforeKccak)
      const digest = ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes(digestBeforeKccak)
      )
      console.log('JW Decoded: ', jwtDecoded)
      console.log('JWT digest: ', digest)
      const clientIdKeccak = ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes(
          '226077901873-96cek128l90clri0i55c0ii88bjbcsge.apps.googleusercontent.com'
        )
      )
      console.log('client Id Keccak: ', clientIdKeccak)
      const ChangeOwnerInterface =
        'function changeOwner(uint256 _name, bytes memory _header,bytes memory _payload,bytes memory _signature,bytes32 _digest) public'
      const header = ethers.utils.toUtf8Bytes(jwtDecoded[0])
      const payload = ethers.utils.toUtf8Bytes(jwtDecoded[1])
      const signature = ethers.utils.toUtf8Bytes(jwtDecoded[2])
      const data = new ethers.utils.Interface([
        ChangeOwnerInterface
      ]).encodeFunctionData('changeOwner', [
        name,
        header,
        payload,
        signature,
        digest
      ])
      const txDetail: TransactionDetailsForUserOp = {
        target: SmartAccountFactoryAddress,
        gasLimit: 1000000,
        maxFeePerGas: parseUnits('0.15', 'gwei'),
        maxPriorityFeePerGas: 0,
        value: 0,
        data
      }
      const unsignedUserOp = await simpleAccountApi!.createUnsignedUserOp(
        txDetail
      )
      console.log('unsigned user op', unsignedUserOp)
      unsignedUserOp.paymaster = PaymasterAddress
      unsignedUserOp.paymasterPostOpGasLimit = 3e5
      unsignedUserOp.paymasterVerificationGasLimit = 3e5
      unsignedUserOp.preVerificationGas = 100000
      console.log('unsigned user op with paymaster data ', unsignedUserOp)
      const signedTx = await simpleAccountApi.signUserOp(unsignedUserOp)
      console.log('signed transaction:', signedTx)
      const passkeyHttpClient = new TurnkeyClient(
        {
          baseUrl: process.env.NEXT_PUBLIC_TURNKEY_API_BASE_URL!
        },
        stamper
      )
      const ethersSigner = new TurnkeySigner({
        client: passkeyHttpClient,
        organizationId: account!.subOrgId,
        signWith: account!.ownerAddress
      })
      const erc4337Provider = await bundler(ethersSigner)
      try {
        const userOpHash =
          await erc4337Provider.httpRpcClient.sendUserOpToBundler(signedTx)
        const txid = await simpleAccountApi.getUserOpReceipt(userOpHash)
        console.log('userOpHash', userOpHash, 'txid=', txid)
      } catch (error: any) {
        console.error('sendUserOpToBundler failed', error)
        // throw new Error(`sendUserOpToBundler failed', ${error}`)
      }
    }
  }
  useEffect(() => {
    if (divRef.current) {
      window.google.accounts.id.initialize({
        nonce: account?.ownerAddress,
        client_id:
          '226077901873-96cek128l90clri0i55c0ii88bjbcsge.apps.googleusercontent.com',
        callback: (res, error) => {
          console.log('res', res)
          console.log('error', error)
          if (!error) {
            setJwtClaim(res.credential)
          }
          // This is the function that will be executed once the authentication with google is finished
        }
      })
      window.google.accounts.id.renderButton(divRef.current, {
        theme: 'filled_blue',
        size: 'medium',
        type: 'standard',
        text: 'continue_with'
      })
    }
  }, [divRef.current])

  return (
    <main className={styles.main}>
      RecoverWallet
      {/* <button onClick={signInGoogle}>Sign in with Google</button> */}
      {!jwtClaim && <div ref={divRef} />}
      {jwtClaim && <div></div>}
      <input
        className="btn btn-primary btn-md"
        disabled={!jwtClaim}
        value="Set Recovery Email"
        onClick={setBackupEmail}
      ></input>
    </main>
  )
}

export default RecoverWallet
