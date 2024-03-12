import { Wallet } from 'ethers'
import { parseEther } from 'ethers/lib/utils'
import { expect } from 'chai'
import { anyValue } from '@nomicfoundation/hardhat-chai-matchers/withArgs'
import { ethers } from 'hardhat'
import { SimpleAccountAPI } from '../src'
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
import { TransactionRequest } from '@ethersproject/providers'

const provider = ethers.provider
const signer = provider.getSigner(0)


describe('SimpleAccountAPI', () => {
  let owner: Wallet
  let api: SimpleAccountAPI
  let entryPoint: IEntryPoint
  let beneficiary: string
  let recipient: SampleRecipient
  let accountAddress: string
  let accountDeployed = false
  
  before('init', async () => {
    console.log('Signer is: ', (await signer.getAddress()))

    entryPoint = await deployEntryPoint(provider)
    beneficiary = await signer.getAddress()

    DeterministicDeployer.init(ethers.provider)

    // // test signer
    // const txRequest: TransactionRequest ={
    //   to: '0xdFF70A71618739f4b8C81B11254BcE855D02496B',
    // from: (await signer.getAddress()),
    // nonce: (await provider.getTransactionCount(await signer.getAddress())),
    // gasLimit: 21000,
    // gasPrice: 10,
    // value: 1
    // }
    // const receipt = await signer.sendTransaction(txRequest)

    //
    const recepiantFactoryAddress = '0x489639b6fb613F9d2d73AD243956fC32Db1a2d91'
    recipient = SampleRecipient__factory.connect(recepiantFactoryAddress, signer)

    //const recFactoryAddress = await DeterministicDeployer.deploy(new SampleRecipient__factory(signer), 0, [])
    //recipient = await new SampleRecipient__factory(signer).deploy()

    owner = Wallet.createRandom()
    
    // const factoryAddress = await DeterministicDeployer.deploy(new SimpleAccountFactory__factory(), 0, [entryPoint.address])
    const factoryAddress = '0x12a4F339F74c08F23D8033dF4457eC253DC9AdC0'

    api = new SimpleAccountAPI({
      provider,
      entryPointAddress: entryPoint.address,
      owner: signer,
      factoryAddress
    })
  })

  it('#getUserOpHash should match entryPoint.getUserOpHash', async function () {
    const userOp: UserOperation = {
      sender: '0x'.padEnd(42, '1'),
      nonce: 2,
      callData: '0x4444',
      callGasLimit: 5,
      verificationGasLimit: 6,
      preVerificationGas: 7,
      maxFeePerGas: 8,
      maxPriorityFeePerGas: 9,
      signature: '0xbbbb'
    }
    const hash = await api.getUserOpHash(userOp)
    const epHash = await entryPoint.getUserOpHash(packUserOp(userOp))
    expect(hash).to.equal(epHash)
  })

  it('should deploy to counterfactual address', async () => {
    const feedata = await provider.getFeeData()
    let test: Number|undefined = undefined
    let cond = test ?? 0
    accountAddress = await api.getAccountAddress()
    console.log("accountAddress is: ", accountAddress)
    // expect(await provider.getCode(accountAddress).then(code => code.length)).to.equal(2)

    if ((await provider.getBalance(accountAddress)) === ethers.utils.parseEther('0')) {
      await signer.sendTransaction({
        to: accountAddress,
        value: 100000,
        gasLimit: 21000,
        gasPrice: 10,
        nonce: (await provider.getTransactionCount(await signer.getAddress())),
      })
    }

    
    const op = await api.createSignedUserOp({
      target: recipient.address,
      data: recipient.interface.encodeFunctionData('something', ['hello'])
    })

    await expect(entryPoint.handleOps([packUserOp(op)], beneficiary)).to.emit(recipient, 'Sender')
      .withArgs(anyValue, accountAddress, 'hello')
    expect(await provider.getCode(accountAddress).then(code => code.length)).to.greaterThan(100)
    accountDeployed = true
  })

  context('#rethrowError', () => {
    let userOp: UserOperation
    before(async () => {
      userOp = await api.createUnsignedUserOp({
        target: ethers.constants.AddressZero,
        data: '0x'
      })
      // expect FailedOp "invalid signature length"
      userOp.signature = '0x11'
    })
    it('should parse FailedOp error', async () => {
      expect(await entryPoint.handleOps([packUserOp(userOp)], beneficiary).catch(decodeRevertReason))
        .to.eql('FailedOpWithRevert(0,"AA23 reverted",ECDSAInvalidSignatureLength(1))')
    })
    it('should parse Error(message) error', async () => {
      await expect(
        entryPoint.addStake(0)
      ).to.revertedWith('must specify unstake delay')
    })
    it('should parse revert with no description', async () => {
      // use wrong signature for contract..
      const wrongContract = entryPoint.attach(recipient.address)
      await expect(
        wrongContract.addStake(0)
      ).to.revertedWithoutReason()
    })
  })

  it('should use account API after creation without a factory', async function () {
    if (!accountDeployed) {
      this.skip()
    }
    const api1 = new SimpleAccountAPI({
      provider,
      entryPointAddress: entryPoint.address,
      accountAddress,
      owner
    })
    const op1 = await api1.createSignedUserOp({
      target: recipient.address,
      data: recipient.interface.encodeFunctionData('something', ['world'])
    })
    await expect(entryPoint.handleOps([packUserOp(op1)], beneficiary)).to.emit(recipient, 'Sender')
      .withArgs(anyValue, accountAddress, 'world')
  })
})
