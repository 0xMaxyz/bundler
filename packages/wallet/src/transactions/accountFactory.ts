import { SmartAccountFactoryAddress } from '@/constants/Contracts'
import { provider } from '@/utils/provider'
import { AddressZero } from '@account-abstraction/utils'
import { SmartAccountFactory__factory } from '@account-abstraction/utils/dist/src/types'
import { ethers } from 'ethers'

export const getAddress = async (name: string): Promise<string> => {
  const simpleAccountFactory = SmartAccountFactory__factory.connect(
    SmartAccountFactoryAddress,
    provider
  )
  const namekech = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(name))
  const address = await simpleAccountFactory.getAddress(
    ethers.BigNumber.from(namekech)
  )
  return address
}
export const nameOccupied = async (name: string): Promise<boolean> => {
  const smartAccountFactory = SmartAccountFactory__factory.connect(
    SmartAccountFactoryAddress,
    provider
  )
  const namekech = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(name))
  const address = await smartAccountFactory.ownerOf(
    ethers.BigNumber.from(namekech)
  )
  return address != AddressZero
}
