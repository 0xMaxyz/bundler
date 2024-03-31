'use client'
import React, { useRef, useEffect, useState } from 'react'
import { useUserContext } from '@/context/userContext'
import styles from '../index.module.css'
import { preDecode } from '@/utils/JWT'
import { ethers } from 'ethers'

const RecoverWallet = () => {
  const divRef = useRef(null)
  const { account, simpleAccountApi } = useUserContext()
  const [jwtClaim, setJwtClaim] = useState<string | undefined>(undefined)
  const setBackupEmail = async () => {
    if (jwtClaim) {
      const jwtDecoded = preDecode(jwtClaim)
      const jwtArray = jwtClaim.split('.')
      const digest = ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes(jwtArray[0] + '.' + jwtArray[1])
      )
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
