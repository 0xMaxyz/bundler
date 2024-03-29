import { SimpleAccountFactoryAddress } from '@/constants/Contracts'
import { provider } from '@/utils/provider'
import { SimpleAccountFactory__factory } from '@account-abstraction/utils'
import { ethers } from 'ethers'

export const getAddress = async (name: string): Promise<string> => {
  const simpleAccountFactory = SimpleAccountFactory__factory.connect(
    SimpleAccountFactoryAddress,
    provider
  )
  const namekech = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(name))
  const address = await simpleAccountFactory.AddressOf(
    ethers.BigNumber.from(namekech)
  )
  return address
}
