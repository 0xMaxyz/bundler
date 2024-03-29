import { bundlerUrl, EntryPointAddress } from '@/constants/Contracts'
import {
  ClientConfig,
  ERC4337EthersProvider,
  wrapProvider
} from '@account-abstraction/sdk'
import { ethers } from 'ethers'
import { provider } from './provider'
const clientConfig: ClientConfig = {
  entryPointAddress: EntryPointAddress,
  bundlerUrl
}
export const bundler = async (
  originalSigner?: ethers.Signer | undefined
): Promise<ERC4337EthersProvider> => {
  return await wrapProvider(provider, clientConfig, originalSigner)
}
