import { ethers } from 'hardhat'
import {
  ClientConfig,
  ERC4337EthersProvider,
  SimpleAccountAPI,
  wrapProvider
} from '../src'
import { expect } from 'chai'
import {
  DeterministicDeployer,
  UserOperation,
  packUserOp,
  IEntryPoint,
  SimpleAccountFactory__factory,
  IEntryPoint__factory
} from '@account-abstraction/utils'
import { parseEther } from 'ethers/lib/utils'
import abi from './abi/erc20.json'
import { BigNumber, Signer } from 'ethers'
import { TransactionRequest } from '@ethersproject/providers'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'

const provider = ethers.provider
let signer: Signer = new ethers.Wallet('Secret private key', provider)

const amount = parseEther('0.001')
const bundlerUrl = 'http://localhost:8545/rpc'

describe('Send tx', function () {
  it('Sends EIP-1559 tx', async function () {
    const maxFeePerGas = ethers.utils.parseUnits('10', 'gwei')
    const maxPriorityFeePerGas = ethers.utils.parseUnits('1', 'wei')
    const tx: TransactionRequest = {
      to: await signer.getAddress(),
      value: amount,
      maxFeePerGas,
      maxPriorityFeePerGas,
      type: 2,
      gasLimit: ethers.utils.parseUnits('21000', 'wei'),
      chainId: (await provider.getNetwork()).chainId,
      nonce: await signer.getTransactionCount()
    }
    const wallet = new ethers.Wallet('secret private key', provider)
    console.log((await provider.getNetwork()).chainId)
    // const gasData = await wallet.getFeeData()
    // console.log(gasData)
    const signedTx = await wallet.signTransaction(tx)
    const estimate = await provider.estimateGas(tx)
    const resp = await provider.sendTransaction(signedTx)
    await resp.wait(1)
    console.log('Transaction hash:', resp.hash)
  })
})

describe('AA Tx Tests', function () {
  let api: SimpleAccountAPI
  let entryPoint: IEntryPoint
  let beneficiary: string
  let accountAddress: string
  let erc4337Provider: ERC4337EthersProvider

  before('Initialize', async function () {
    DeterministicDeployer.init(ethers.provider)

    // entryPoint = await deployEntryPoint(provider)
    entryPoint = IEntryPoint__factory.connect(
      '0x0000000071727De22E5E9d8BAf0edAc6f37da032',
      signer
    )
    beneficiary = await signer.getAddress()

    const factoryAddress = await DeterministicDeployer.deploy(
      new SimpleAccountFactory__factory(),
      0,
      [entryPoint.address]
    )
    api = new SimpleAccountAPI({
      provider,
      entryPointAddress: entryPoint.address,
      owner: signer,
      factoryAddress
    })

    accountAddress = await api.getAccountAddress()

    if ((await provider.getBalance(accountAddress)) < amount) {
      await signer.sendTransaction({
        to: accountAddress,
        value: amount,
        gasLimit: 21000,
        gasPrice: 10,
        nonce: await provider.getTransactionCount(await signer.getAddress())
      })
    }
    const clientConfig: ClientConfig = {
      entryPointAddress: entryPoint.address,
      bundlerUrl
    }
    erc4337Provider = await wrapProvider(provider, clientConfig, signer)
  })

  describe('Mint amount for an account', function () {
    let initBalance: BigNumber
    let op: UserOperation

    before('Prepare user operation', async function () {
      op = await api.createSignedUserOp({
        target: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
        data: '0x',
        gasLimit: 21000,
        value: ethers.utils.parseEther('1'),
        maxFeePerGas: ethers.utils.parseUnits('1', 'gwei'),
        maxPriorityFeePerGas: 0
      })
    })

    it('Direct', async function () {
      const feeData = await provider.getFeeData()
      console.log(feeData)
      const blockData = await provider.getBlock(225257)
      console.log(blockData)
      const resp = await entryPoint.handleOps([packUserOp(op)], beneficiary)
      await resp.wait(1)
    })

    it('Through Bundler', async function () {
      const resp = await erc4337Provider.constructUserOpTransactionResponse(op)
      try {
        const r = await erc4337Provider.httpRpcClient.sendUserOpToBundler(op)
        console.log(r)
      } catch (error: any) {
        console.error('sendUserOpToBundler failed', error.code)
        // throw new Error(`sendUserOpToBundler failed', ${error}`);
      }
      const recipt = await erc4337Provider.waitForTransaction(
        resp.hash,
        3,
        150000
      )
    })
  })
})
