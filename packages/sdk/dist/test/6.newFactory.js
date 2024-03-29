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
const ethers_1 = require("ethers");
const provider = hardhat_1.ethers.provider;
let signers;
let signer;
let signerAddress;
const aaTokenAddress = '0x834d762f8e6268b5ceba69ded6894d864ce48556'; // has public unrestricted mint
const helloContractAddress = '0x629f7104f2d1afce975d22011d454b90e030d562';
const aaToken = new hardhat_1.ethers.Contract(aaTokenAddress, erc20_json_1.default, provider);
const amount = (0, utils_2.parseEther)('0.001');
// const bundlerUrl = 'http://localhost:3000/rpc'
const bundlerUrl = 'http://89.208.105.188:12300/rpc';
const ensSimpleAccountFactory = '0x26d68286Facf20820CbD3DE0DEd2dD0b8E787891';
let api;
let entryPoint;
let accountAddress;
let bundlerProvider;
let simpleAccountFactory;
describe('New Factory Test', () => {
    before('Initialize', async function () {
        signers = await hardhat_1.ethers.getSigners();
        signer = signers[1];
        signerAddress = await signer.getAddress();
        utils_1.DeterministicDeployer.init(hardhat_1.ethers.provider);
        // entryPoint = await deployEntryPoint(provider)
        entryPoint = utils_1.IEntryPoint__factory.connect('0x0000000071727De22E5E9d8BAf0edAc6f37da032', signer);
        // const factoryAddress = await DeterministicDeployer.deploy(new SimpleAccountFactory__factory(), 0, [entryPoint.address])
        simpleAccountFactory = utils_1.SimpleAccountFactory__factory.connect(ensSimpleAccountFactory, signer);
        api = new src_1.SimpleAccountAPI({
            provider,
            entryPointAddress: entryPoint.address,
            owner: signer,
            factoryAddress: simpleAccountFactory.address,
            index: hardhat_1.ethers.utils.keccak256(hardhat_1.ethers.utils.toUtf8Bytes('0xmaxyz_@gmail.com'))
        });
        accountAddress = await api.getAccountAddress();
        if ((await provider.getBalance(accountAddress)) < amount) {
            await signer.sendTransaction({
                to: accountAddress,
                value: amount,
                gasLimit: 21000,
                gasPrice: (0, utils_2.parseUnits)('0.15', 'gwei'),
                nonce: await provider.getTransactionCount(signerAddress)
            });
        }
        const clientConfig = {
            entryPointAddress: entryPoint.address,
            bundlerUrl
        };
        bundlerProvider = await (0, src_1.wrapProvider)(provider, clientConfig, signer);
    });
    it('Creates account or uses previously created account to send a simple tx for right owner', async function () {
        const data = new hardhat_1.ethers.utils.Interface([
            'function hello() external'
        ]).encodeFunctionData('hello', []);
        const txDetail = {
            target: helloContractAddress,
            gasLimit: 210000,
            maxFeePerGas: (0, utils_2.parseUnits)('0.15', 'gwei'),
            maxPriorityFeePerGas: 0,
            value: 0,
            data
        };
        const unsignedTx = await api.createUnsignedUserOp(txDetail);
        unsignedTx.paymaster = '0xc523FF9698230096d4aDa45D52FA0063E109618D';
        unsignedTx.paymasterPostOpGasLimit = 3e5;
        unsignedTx.paymasterVerificationGasLimit = 3e5;
        unsignedTx.preVerificationGas = ethers_1.BigNumber.from(1000).add(unsignedTx.preVerificationGas);
        const signedTx = await api.signUserOp(unsignedTx);
        try {
            const userOpHash = await bundlerProvider.httpRpcClient.sendUserOpToBundler(signedTx);
            const txid = await api.getUserOpReceipt(userOpHash);
            console.log('userOpHash', userOpHash, 'txid=', txid);
        }
        catch (error) {
            console.error('sendUserOpToBundler failed', error);
            (0, chai_1.assert)((await provider.getCode(accountAddress)).length > 2, 'It should create simple account');
        }
    });
    it('Reverts for wrong owner', async function () {
        api = new src_1.SimpleAccountAPI({
            provider,
            entryPointAddress: entryPoint.address,
            owner: signers[2],
            factoryAddress: simpleAccountFactory.address,
            index: hardhat_1.ethers.utils.keccak256(hardhat_1.ethers.utils.toUtf8Bytes('0xmaxyz_@gmail.com'))
        });
        try {
            await api.getAccountAddress();
            (0, chai_1.assert)(false, 'Another owner can use a duplicte name');
        }
        catch (error) {
            (0, chai_1.assert)(true);
        }
    });
    it('Returns address for the owner', async function () {
        api = new src_1.SimpleAccountAPI({
            provider,
            entryPointAddress: entryPoint.address,
            owner: signers[1],
            factoryAddress: simpleAccountFactory.address,
            index: hardhat_1.ethers.utils.keccak256(hardhat_1.ethers.utils.toUtf8Bytes('0xmaxyz_@gmail.com'))
        });
        try {
            await api.getAccountAddress();
            (0, chai_1.assert)(true);
        }
        catch (error) {
            (0, chai_1.assert)(false, 'It should return the address for the owner');
        }
    });
});
//# sourceMappingURL=6.newFactory.js.map