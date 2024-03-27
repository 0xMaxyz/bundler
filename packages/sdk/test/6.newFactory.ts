import { ethers } from 'hardhat'
import {
  ClientConfig,
  ERC4337EthersProvider,
  SimpleAccountAPI,
  wrapProvider
} from '../src'
import { assert, expect } from 'chai'
import {
  DeterministicDeployer,
  UserOperation,
  packUserOp,
  IEntryPoint,
  SimpleAccountFactory__factory,
  IEntryPoint__factory,
  SimpleAccountFactory
} from '@account-abstraction/utils'
import { arrayify, parseEther, parseUnits } from 'ethers/lib/utils'
import abi from './abi/erc20.json'
import { BigNumber, Signer } from 'ethers'
import { TransactionRequest } from '@ethersproject/providers'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { TransactionDetailsForUserOp } from '../src/TransactionDetailsForUserOp'

const provider = ethers.provider
let signers: SignerWithAddress[]
let signer: Signer
let signerAddress: string

const aaTokenAddress = '0x834d762f8e6268b5ceba69ded6894d864ce48556' // has public unrestricted mint
const helloContractAddress = '0x629f7104f2d1afce975d22011d454b90e030d562'
const aaToken = new ethers.Contract(aaTokenAddress, abi, provider)
const amount = parseEther('0.001')
// const bundlerUrl = 'http://localhost:3000/rpc'
const bundlerUrl = 'http://89.208.105.188:12300/rpc'
const ensSimpleAccountFactory = '0x26d68286Facf20820CbD3DE0DEd2dD0b8E787891'

let api: SimpleAccountAPI
let entryPoint: IEntryPoint
let accountAddress: string
let bundlerProvider: ERC4337EthersProvider
let simpleAccountFactory: SimpleAccountFactory

describe('New Factory Test', () => {
  before('Initialize', async function () {
    signers = await ethers.getSigners()
    signer = signers[1]
    signerAddress = await signer.getAddress()

    DeterministicDeployer.init(ethers.provider)

    // entryPoint = await deployEntryPoint(provider)
    entryPoint = IEntryPoint__factory.connect(
      '0x0000000071727De22E5E9d8BAf0edAc6f37da032',
      signer
    )

    // const factoryAddress = await DeterministicDeployer.deploy(new SimpleAccountFactory__factory(), 0, [entryPoint.address])
    simpleAccountFactory = SimpleAccountFactory__factory.connect(
      ensSimpleAccountFactory,
      signer
    )
    api = new SimpleAccountAPI({
      provider,
      entryPointAddress: entryPoint.address,
      owner: signer,
      factoryAddress: simpleAccountFactory.address,
      index: ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes('0xmaxyz@gmail.com')
      )
    })

    accountAddress = await api.getAccountAddress()

    if ((await provider.getBalance(accountAddress)) < amount) {
      await signer.sendTransaction({
        to: accountAddress,
        value: amount,
        gasLimit: 21000,
        gasPrice: parseUnits('0.15', 'gwei'),
        nonce: await provider.getTransactionCount(signerAddress)
      })
    }
    const clientConfig: ClientConfig = {
      entryPointAddress: entryPoint.address,
      bundlerUrl
    }
    bundlerProvider = await wrapProvider(provider, clientConfig, signer)
  })
  it('Creates account or uses previously created account to send a simple tx for right owner', async function () {
    const data = new ethers.utils.Interface([
      'function hello() external'
    ]).encodeFunctionData('hello', [])
    const txDetail: TransactionDetailsForUserOp = {
      target: helloContractAddress,
      gasLimit: 210000,
      maxFeePerGas: parseUnits('0.15', 'gwei'),
      maxPriorityFeePerGas: 0,
      value: 0,
      data
    }
    const signedTx = await api.createSignedUserOp(txDetail)
    try {
      const userOpHash =
        await bundlerProvider.httpRpcClient.sendUserOpToBundler(signedTx)
      const txid = await api.getUserOpReceipt(userOpHash)
      console.log('userOpHash', userOpHash, 'txid=', txid)
    } catch (error: any) {
      console.error('sendUserOpToBundler failed', error)
      assert(
        (await provider.getCode(accountAddress)).length > 2,
        'It should create simple account'
      )
    }
  })

  it('Reverts for wrong owner', async function () {
    api = new SimpleAccountAPI({
      provider,
      entryPointAddress: entryPoint.address,
      owner: signers[2],
      factoryAddress: simpleAccountFactory.address,
      index: ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes('0xmaxyz@gmail.com')
      )
    })
    try {
      await api.getAccountAddress()
      assert(false, 'Another owner can use a duplicte name')
    } catch (error) {
      assert(true)
    }
  })

  it('Returns address for the owner', async function () {
    api = new SimpleAccountAPI({
      provider,
      entryPointAddress: entryPoint.address,
      owner: signers[1],
      factoryAddress: simpleAccountFactory.address,
      index: ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes('0xmaxyz@gmail.com')
      )
    })
    try {
      await api.getAccountAddress()
      assert(true)
    } catch (error) {
      assert(false, 'It should return the address for the owner')
    }
  })
})
