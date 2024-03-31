"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = require("hardhat");
const src_1 = require("../src");
const chai_1 = require("chai");
const utils_1 = require("@account-abstraction/utils");
const utils_2 = require("ethers/lib/utils");
const erc20_json_1 = __importDefault(require("./abi/erc20.json"));
const provider = hardhat_1.ethers.provider;
let signers;
let signer;
let signerAddress;
const aaTokenAddress = '0x834d762f8e6268b5ceba69ded6894d864ce48556'; // has public unrestricted mint
const aaToken = new hardhat_1.ethers.Contract(aaTokenAddress, erc20_json_1.default, provider);
const amount = (0, utils_2.parseEther)('0.001');
// const bundlerUrl = 'http://localhost:3000/rpc'
const bundlerUrl = 'http://89.208.105.188:12300/rpc';
const simpleAccountFactory = '0x12a4F339F74c08F23D8033dF4457eC253DC9AdC0';
let api;
let entryPoint;
let beneficiary;
let accountAddress;
let erc4337Provider;
describe('AA Tests', function () {
    before('Initialize', async function () {
        signers = await hardhat_1.ethers.getSigners();
        signer = signers[0];
        signerAddress = await signer.getAddress();
        utils_1.DeterministicDeployer.init(hardhat_1.ethers.provider);
        // entryPoint = await deployEntryPoint(provider)
        entryPoint = utils_1.IEntryPoint__factory.connect('0x0000000071727De22E5E9d8BAf0edAc6f37da032', signer);
        beneficiary = signerAddress;
        // const factoryAddress = await DeterministicDeployer.deploy(new SimpleAccountFactory__factory(), 0, [entryPoint.address])
        const SimpleAccountFactory = utils_1.SimpleAccountFactory__factory.connect(simpleAccountFactory, signer);
        api = new src_1.SimpleAccountAPI({
            provider,
            entryPointAddress: entryPoint.address,
            owner: signer,
            factoryAddress: SimpleAccountFactory.address
        });
        accountAddress = await api.getAccountAddress();
        if ((await provider.getBalance(accountAddress)) < amount) {
            await signer.sendTransaction({
                to: accountAddress,
                value: amount,
                gasLimit: 21000,
                gasPrice: 10,
                nonce: await provider.getTransactionCount(signerAddress)
            });
        }
        const clientConfig = {
            entryPointAddress: entryPoint.address,
            bundlerUrl
        };
        erc4337Provider = await (0, src_1.wrapProvider)(provider, clientConfig, signer);
    });
    describe('Send tx', function () {
        it('Sends legacy tx', async function () {
            const token = new hardhat_1.ethers.Contract(aaTokenAddress, erc20_json_1.default, signer);
            const tx = await token.transfer(signerAddress, amount);
            await tx.wait(1);
            console.log('Transaction hash:', tx.hash);
        });
        it('Sends EIP-1559 tx', async function () {
            const maxFeePerGas = hardhat_1.ethers.utils.parseUnits('10', 'wei');
            const maxPriorityFeePerGas = hardhat_1.ethers.utils.parseUnits('1', 'wei');
            const tx = {
                to: signerAddress,
                value: amount,
                maxFeePerGas,
                maxPriorityFeePerGas,
                type: 2,
                gasLimit: hardhat_1.ethers.utils.parseUnits('21000', 'wei'),
                chainId: 3636,
                nonce: await signer.getTransactionCount()
            };
            const wallet = new hardhat_1.ethers.Wallet('Private key', provider);
            console.log((await provider.getNetwork()).chainId);
            // const gasData = await wallet.getFeeData()
            // console.log(gasData)
            const signedTx = await wallet.signTransaction(tx);
            const estimate = await provider.estimateGas(tx);
            const resp = await provider.sendTransaction(signedTx);
            await resp.wait(1);
            console.log('Transaction hash:', resp.hash);
        });
    });
    describe('AA Tx Tests', function () {
        describe('Mint amount for an account', function () {
            let initBalance;
            let op;
            before('Prepare user operation', async function () {
                const mintInterface = erc20_json_1.default.find((x) => x.name === 'mint');
                if (mintInterface == null) {
                    throw new Error('ERC20 abi is undefined');
                }
                // const data = new ethers.utils.Interface([
                //   mintInterface
                // ]).encodeFunctionData('mint', [accountAddress, amount])
                const data = new hardhat_1.ethers.utils.Interface([
                    'function addDeposit() public payable'
                ]).encodeFunctionData('addDeposit', []);
                op = await api.createSignedUserOp({
                    target: aaTokenAddress,
                    data,
                    gasLimit: 1000000,
                    maxFeePerGas: hardhat_1.ethers.utils.parseUnits('10', 'wei'),
                    maxPriorityFeePerGas: hardhat_1.ethers.utils.parseUnits('0', 'wei'),
                    value: 1000
                    // nonce: await signer.getTransactionCount()
                });
            });
            it('Direct', async function () {
                const feeData = await provider.getFeeData();
                console.log(feeData);
                const blockData = await provider.getBlock(225257);
                console.log(blockData);
                initBalance = await aaToken.balanceOf(accountAddress);
                const resp = await entryPoint.handleOps([(0, utils_1.packUserOp)(op)], beneficiary);
                await resp.wait(1);
                const balance = await aaToken.balanceOf(accountAddress);
                (0, chai_1.expect)(amount.add(initBalance)).to.be.equal(balance);
            });
            it('Mint Through Bundler', async function () {
                // initBalance = await aaToken.balanceOf(accountAddress)
                const resp = await erc4337Provider.constructUserOpTransactionResponse(op);
                try {
                    const r = await erc4337Provider.httpRpcClient.sendUserOpToBundler(op);
                    console.log(r);
                }
                catch (error) {
                    console.error('sendUserOpToBundler failed', error.code);
                    // throw new Error(`sendUserOpToBundler failed', ${error}`);
                }
                const recipt = await erc4337Provider.waitForTransaction(resp.hash, 3, 1000);
                const balance = await aaToken.balanceOf(accountAddress);
                (0, chai_1.expect)(amount.add(initBalance)).to.be.equal(balance);
            });
        });
        describe('Transfers ERC20 Token', function () {
            let beneficiaryTokenAmount;
            let op;
            before('Prepare User operation', async function () {
                beneficiaryTokenAmount = await aaToken.balanceOf(beneficiary);
                const transferInterface = erc20_json_1.default.find((x) => x.name === 'transfer');
                if (transferInterface == null) {
                    throw new Error('ERC20 abi is undefined');
                }
                const data = new hardhat_1.ethers.utils.Interface([
                    transferInterface
                ]).encodeFunctionData('transfer', [beneficiary, amount]);
                op = await api.createSignedUserOp({
                    target: aaTokenAddress,
                    data,
                    maxFeePerGas: hardhat_1.ethers.utils.parseUnits('100', 'wei'),
                    maxPriorityFeePerGas: 0
                });
            });
            it('Direct', async function () {
                const resp = await entryPoint.handleOps([(0, utils_1.packUserOp)(op)], beneficiary);
                await resp.wait(1);
                (0, chai_1.expect)(beneficiaryTokenAmount.add(amount)).to.be.equal(await aaToken.balanceOf(beneficiary));
            });
            it('Transfer Through Bundler', async function () {
                const resp = await erc4337Provider.constructUserOpTransactionResponse(op);
                try {
                    const r = await erc4337Provider.httpRpcClient.sendUserOpToBundler(op);
                    console.log(r);
                }
                catch (error) {
                    console.error('sendUserOpToBundler failed', error.code);
                    // throw new Error(`sendUserOpToBundler failed', ${error}`)
                }
                const recipt = await erc4337Provider.waitForTransaction(resp.hash, 3, 150000);
                (0, chai_1.expect)(beneficiaryTokenAmount.add(amount)).to.be.equal(await aaToken.balanceOf(beneficiary));
            });
        });
        describe('Hello', function () {
            it('Emits hello', async function () {
                const data = new hardhat_1.ethers.utils.Interface([
                    'function hello() external'
                ]).encodeFunctionData('hello', []);
                const txDetail = {
                    target: '0x629f7104f2d1afce975d22011d454b90e030d562',
                    gasLimit: 210000,
                    maxFeePerGas: 1000,
                    maxPriorityFeePerGas: 0,
                    value: 0,
                    data
                };
                const signedTx = await api.createSignedUserOp(txDetail);
                // console.log(signedTx)
                try {
                    const userOpHash = await erc4337Provider.httpRpcClient.sendUserOpToBundler(signedTx);
                    const txid = await api.getUserOpReceipt(userOpHash);
                    console.log('userOpHash', userOpHash, 'txid=', txid);
                }
                catch (error) {
                    console.error('sendUserOpToBundler failed', error.code);
                    // throw new Error(`sendUserOpToBundler failed', ${error}`)
                }
            });
            it('transfers amount 2', async function () {
                const tx = {
                    target: '0x764728BC2166C5F9718E22C185f8F02976f2D087',
                    gasLimit: 210000,
                    maxFeePerGas: 1000,
                    maxPriorityFeePerGas: 0,
                    value: (0, utils_2.parseEther)('0.003'),
                    data: '0x'
                };
                const signedTx = await api.createSignedUserOp(tx);
                try {
                    const userOpHash = await erc4337Provider.httpRpcClient.sendUserOpToBundler(signedTx);
                    const txid = await api.getUserOpReceipt(userOpHash);
                    console.log('userOpHash', userOpHash, 'txid=', txid);
                }
                catch (error) {
                    console.error('sendUserOpToBundler failed', error.code);
                    // throw new Error(`sendUserOpToBundler failed', ${error}`)
                }
            });
        });
    });
});
//# sourceMappingURL=5.AaTx.test.js.map