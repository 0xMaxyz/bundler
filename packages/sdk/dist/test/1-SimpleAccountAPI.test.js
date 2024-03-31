"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const chai_1 = require("chai");
const withArgs_1 = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const hardhat_1 = require("hardhat");
const src_1 = require("../src");
const utils_1 = require("@account-abstraction/utils");
const provider = hardhat_1.ethers.provider;
const signer = provider.getSigner(0);
describe('SimpleAccountAPI', () => {
    let owner;
    let api;
    let entryPoint;
    let beneficiary;
    let recipient;
    let accountAddress;
    let accountDeployed = false;
    before('init', async () => {
        console.log('Signer is: ', await signer.getAddress());
        entryPoint = await (0, utils_1.deployEntryPoint)(provider);
        beneficiary = await signer.getAddress();
        utils_1.DeterministicDeployer.init(hardhat_1.ethers.provider);
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
        const recepiantFactoryAddress = '0x489639b6fb613F9d2d73AD243956fC32Db1a2d91';
        recipient = utils_1.SampleRecipient__factory.connect(recepiantFactoryAddress, signer);
        // const recFactoryAddress = await DeterministicDeployer.deploy(new SampleRecipient__factory(signer), 0, [])
        // recipient = await new SampleRecipient__factory(signer).deploy()
        owner = ethers_1.Wallet.createRandom();
        // const factoryAddress = await DeterministicDeployer.deploy(new SimpleAccountFactory__factory(), 0, [entryPoint.address])
        const factoryAddress = '0x12a4F339F74c08F23D8033dF4457eC253DC9AdC0';
        api = new src_1.SimpleAccountAPI({
            provider,
            entryPointAddress: entryPoint.address,
            owner: signer,
            factoryAddress
        });
    });
    it('#getUserOpHash should match entryPoint.getUserOpHash', async function () {
        const userOp = {
            sender: '0x'.padEnd(42, '1'),
            nonce: 2,
            callData: '0x4444',
            callGasLimit: 5,
            verificationGasLimit: 6,
            preVerificationGas: 7,
            maxFeePerGas: 8,
            maxPriorityFeePerGas: 9,
            signature: '0xbbbb'
        };
        const hash = await api.getUserOpHash(userOp);
        const epHash = await entryPoint.getUserOpHash((0, utils_1.packUserOp)(userOp));
        (0, chai_1.expect)(hash).to.equal(epHash);
    });
    it('should deploy to counterfactual address', async () => {
        accountAddress = await api.getAccountAddress();
        console.log('accountAddress is: ', accountAddress);
        // expect(await provider.getCode(accountAddress).then(code => code.length)).to.equal(2)
        if ((await provider.getBalance(accountAddress)) ===
            hardhat_1.ethers.utils.parseEther('0')) {
            await signer.sendTransaction({
                to: accountAddress,
                value: 100000,
                gasLimit: 21000,
                gasPrice: 10,
                nonce: await provider.getTransactionCount(await signer.getAddress())
            });
        }
        const data = recipient.interface.encodeFunctionData('something', ['hello']);
        const op = await api.createSignedUserOp({
            target: recipient.address,
            data
        });
        await (0, chai_1.expect)(entryPoint.handleOps([(0, utils_1.packUserOp)(op)], beneficiary))
            .to.emit(recipient, 'Sender')
            .withArgs(withArgs_1.anyValue, accountAddress, 'hello');
        (0, chai_1.expect)(await provider.getCode(accountAddress).then((code) => code.length)).to.greaterThan(100);
        accountDeployed = true;
    });
    context('#rethrowError', () => {
        let userOp;
        before(async () => {
            userOp = await api.createUnsignedUserOp({
                target: hardhat_1.ethers.constants.AddressZero,
                data: '0x'
            });
            // expect FailedOp "invalid signature length"
            userOp.signature = '0x11';
        });
        it('should parse FailedOp error', async () => {
            (0, chai_1.expect)(await entryPoint
                .handleOps([(0, utils_1.packUserOp)(userOp)], beneficiary)
                .catch(utils_1.decodeRevertReason)).to.eql('FailedOpWithRevert(0,"AA23 reverted",ECDSAInvalidSignatureLength(1))');
        });
        it('should parse Error(message) error', async () => {
            await (0, chai_1.expect)(entryPoint.addStake(0)).to.revertedWith('must specify unstake delay');
        });
        it('should parse revert with no description', async () => {
            // use wrong signature for contract..
            const wrongContract = entryPoint.attach(recipient.address);
            await (0, chai_1.expect)(wrongContract.addStake(0)).to.revertedWithoutReason();
        });
    });
    it('should use account API after creation without a factory', async function () {
        if (!accountDeployed) {
            this.skip();
        }
        const api1 = new src_1.SimpleAccountAPI({
            provider,
            entryPointAddress: entryPoint.address,
            accountAddress,
            owner
        });
        const data = recipient.interface.encodeFunctionData('something', ['world']);
        const op1 = await api1.createSignedUserOp({
            target: recipient.address,
            data
        });
        await (0, chai_1.expect)(entryPoint.handleOps([(0, utils_1.packUserOp)(op1)], beneficiary))
            .to.emit(recipient, 'Sender')
            .withArgs(withArgs_1.anyValue, accountAddress, 'world');
    });
});
//# sourceMappingURL=1-SimpleAccountAPI.test.js.map