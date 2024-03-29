"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = require("hardhat");
const src_1 = require("../src");
const utils_1 = require("@account-abstraction/utils");
const utils_2 = require("ethers/lib/utils");
const provider = hardhat_1.ethers.provider;
let signer = new hardhat_1.ethers.Wallet('Secret private key', provider);
const amount = (0, utils_2.parseEther)('0.001');
const bundlerUrl = 'http://localhost:8545/rpc';
describe('Send tx', function () {
    it('Sends EIP-1559 tx', async function () {
        const maxFeePerGas = hardhat_1.ethers.utils.parseUnits('10', 'gwei');
        const maxPriorityFeePerGas = hardhat_1.ethers.utils.parseUnits('1', 'wei');
        const tx = {
            to: await signer.getAddress(),
            value: amount,
            maxFeePerGas,
            maxPriorityFeePerGas,
            type: 2,
            gasLimit: hardhat_1.ethers.utils.parseUnits('21000', 'wei'),
            chainId: (await provider.getNetwork()).chainId,
            nonce: await signer.getTransactionCount()
        };
        const wallet = new hardhat_1.ethers.Wallet('secret private key', provider);
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
    let api;
    let entryPoint;
    let beneficiary;
    let accountAddress;
    let erc4337Provider;
    before('Initialize', async function () {
        utils_1.DeterministicDeployer.init(hardhat_1.ethers.provider);
        // entryPoint = await deployEntryPoint(provider)
        entryPoint = utils_1.IEntryPoint__factory.connect('0x0000000071727De22E5E9d8BAf0edAc6f37da032', signer);
        beneficiary = await signer.getAddress();
        const factoryAddress = await utils_1.DeterministicDeployer.deploy(new utils_1.SimpleAccountFactory__factory(), 0, [entryPoint.address]);
        api = new src_1.SimpleAccountAPI({
            provider,
            entryPointAddress: entryPoint.address,
            owner: signer,
            factoryAddress
        });
        accountAddress = await api.getAccountAddress();
        if ((await provider.getBalance(accountAddress)) < amount) {
            await signer.sendTransaction({
                to: accountAddress,
                value: amount,
                gasLimit: 21000,
                gasPrice: 10,
                nonce: await provider.getTransactionCount(await signer.getAddress())
            });
        }
        const clientConfig = {
            entryPointAddress: entryPoint.address,
            bundlerUrl
        };
        erc4337Provider = await (0, src_1.wrapProvider)(provider, clientConfig, signer);
    });
    describe('Mint amount for an account', function () {
        let initBalance;
        let op;
        before('Prepare user operation', async function () {
            op = await api.createSignedUserOp({
                target: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
                data: '0x',
                gasLimit: 21000,
                value: hardhat_1.ethers.utils.parseEther('1'),
                maxFeePerGas: hardhat_1.ethers.utils.parseUnits('1', 'gwei'),
                maxPriorityFeePerGas: 0
            });
        });
        it('Direct', async function () {
            const feeData = await provider.getFeeData();
            console.log(feeData);
            const blockData = await provider.getBlock(225257);
            console.log(blockData);
            const resp = await entryPoint.handleOps([(0, utils_1.packUserOp)(op)], beneficiary);
            await resp.wait(1);
        });
        it('Through Bundler', async function () {
            const resp = await erc4337Provider.constructUserOpTransactionResponse(op);
            try {
                const r = await erc4337Provider.httpRpcClient.sendUserOpToBundler(op);
                console.log(r);
            }
            catch (error) {
                console.error('sendUserOpToBundler failed', error.code);
                // throw new Error(`sendUserOpToBundler failed', ${error}`);
            }
            const recipt = await erc4337Provider.waitForTransaction(resp.hash, 3, 150000);
        });
    });
});
//# sourceMappingURL=5.AaTx.test.local.js.map