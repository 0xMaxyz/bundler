import React from 'react'
import { CircularProgress } from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { UseFormRegisterReturn } from 'react-hook-form/dist/types/form'
export enum WalletNameStatus {
  'loading',
  'error',
  'ok'
}

export interface WalletNameProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  domain?: string
  status?: WalletNameStatus
  formRegistrationAttr: UseFormRegisterReturn<'walletName'>
}
const WalletNameInput = ({
  status,
  domain,
  formRegistrationAttr,
  ...props
}: WalletNameProps) => {
  return (
    <label className="input input-bordered flex items-center gap-2">
      <input
        type="text"
        className="grow"
        placeholder="Search"
        {...formRegistrationAttr}
      />
      {status === WalletNameStatus.loading && <CircularProgress size={16} />}
      {status === WalletNameStatus.ok && (
        <CheckCircleOutlineIcon color="success" />
      )}
      {status === WalletNameStatus.error && <ErrorOutlineIcon color="error" />}
      <span className="badge badge-info">.{domain}</span>
    </label>
  )
}

export default WalletNameInput
