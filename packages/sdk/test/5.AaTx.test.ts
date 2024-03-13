import { ethers } from 'hardhat'
import { SimpleAccountAPI } from '../src'
import { expect } from 'chai'
import {
  deployEntryPoint,
  DeterministicDeployer,
  UserOperation,
  packUserOp,
  SampleRecipient,
  SampleRecipient__factory,
  IEntryPoint,
  SimpleAccountFactory__factory, decodeRevertReason
} from '@account-abstraction/utils'
import { parseEther } from 'ethers/lib/utils'
import { anyValue } from '@nomicfoundation/hardhat-chai-matchers/withArgs'
import abi from './abi/erc20.json'

const provider = ethers.provider
const signer = provider.getSigner(0)
const aaTokenAddress = '0x834d762f8e6268b5ceba69ded6894d864ce48556' // has public unrestricted mint
const aaToken = new ethers.Contract(aaTokenAddress, abi, provider)
const amount = '100'

describe('AA Tx Tests', function () {
  let api: SimpleAccountAPI
  let entryPoint: IEntryPoint
  let beneficiary: string
  let accountAddress: string

  before('Initialize', async function () {
    DeterministicDeployer.init(ethers.provider)

    entryPoint = await deployEntryPoint(provider)
    beneficiary = await signer.getAddress()

    const factoryAddress = await DeterministicDeployer.deploy(new SimpleAccountFactory__factory(), 0, [entryPoint.address])
    api = new SimpleAccountAPI({
      provider,
      entryPointAddress: entryPoint.address,
      owner: signer,
      factoryAddress
    })

    accountAddress = await api.getAccountAddress()

    if ((await provider.getBalance(accountAddress)) === ethers.utils.parseEther('0')) {
      await signer.sendTransaction({
        to: accountAddress,
        value: 100000,
        gasLimit: 21000,
        gasPrice: 10,
        nonce: (await provider.getTransactionCount(await signer.getAddress())),
      })
    }
  })

  it('Mint amount for an account', async function () {
    const initbalance = await aaToken.balanceOf(accountAddress)
    const data = new ethers.utils.Interface([ abi.find(x => x.name === 'mint') ]).encodeFunctionData('mint', [accountAddress, parseEther(amount)])
    const op = await api.createSignedUserOp({
      target: aaTokenAddress,
      data
    })

    const resp = await entryPoint.handleOps([packUserOp(op)], beneficiary)
    await resp.wait(1)
    const balance = await aaToken.balanceOf(accountAddress)
    expect(parseEther(amount).add(initbalance)).to.be.equal(balance)
  })

  it('Transfers amount', async function () {
    const beneficiaryTokenAmount = await aaToken.balanceOf(beneficiary)
    const data = new ethers.utils.Interface([abi.find(x => x.name === 'transfer')]).encodeFunctionData('transfer', [beneficiary, parseEther(amount)])
    const op = await api.createSignedUserOp({
      target: aaTokenAddress,
      data
    })
    const resp = await entryPoint.handleOps([packUserOp(op)], beneficiary)
    await resp.wait(1)
    expect(beneficiaryTokenAmount.add(parseEther(amount))).to.be.equal(await aaToken.balanceOf(beneficiary))
  })
})
