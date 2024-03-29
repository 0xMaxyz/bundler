"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const utils_1 = require("@account-abstraction/utils");
const utils_2 = require("ethers/lib/utils");
const ethers_1 = require("ethers");
describe('utils', () => {
    describe('userop pack/unpack functions', () => {
        const paymaster = '0xaa'.padEnd(42, 'a');
        it('#packAccountGasLimits', function () {
            (0, chai_1.expect)((0, utils_1.packAccountGasLimits)(0xaa, 0xbbbb)).to.eql((0, utils_2.hexConcat)([(0, utils_2.hexZeroPad)('0xaa', 16), (0, utils_2.hexZeroPad)('0xbbbb', 16)]));
        });
        it('#unpackAccountGasLimits', function () {
            const packed = (0, utils_2.hexConcat)([(0, utils_2.hexZeroPad)('0xaa', 16), (0, utils_2.hexZeroPad)('0xbbbb', 16)]);
            (0, chai_1.expect)((0, utils_1.unpackAccountGasLimits)(packed))
                .to.eql({ verificationGasLimit: ethers_1.BigNumber.from(0xaa), callGasLimit: ethers_1.BigNumber.from(0xbbbb) });
        });
        it('#packPaymasterAndData', () => {
            const pmVerificationGas = 1;
            const postOpGas = 2;
            (0, chai_1.expect)((0, utils_1.packPaymasterData)(paymaster, pmVerificationGas, postOpGas))
                .to.eql((0, utils_2.hexConcat)([
                paymaster,
                (0, utils_2.hexZeroPad)((0, utils_2.hexlify)(pmVerificationGas), 16),
                (0, utils_2.hexZeroPad)((0, utils_2.hexlify)(postOpGas), 16)
            ]));
            const pmData = '0xdeadface';
            (0, chai_1.expect)((0, utils_1.packPaymasterData)(paymaster, pmVerificationGas, postOpGas, pmData))
                .to.eql((0, utils_2.hexConcat)([
                paymaster,
                (0, utils_2.hexZeroPad)((0, utils_2.hexlify)(pmVerificationGas), 16),
                (0, utils_2.hexZeroPad)((0, utils_2.hexlify)(postOpGas), 16),
                pmData
            ]));
        });
        it('#packPaymasterAndData', () => {
            const paymasterVerificationGas = ethers_1.BigNumber.from(1);
            const postOpGasLimit = ethers_1.BigNumber.from(2);
            (0, chai_1.expect)((0, utils_1.unpackPaymasterAndData)((0, utils_1.packPaymasterData)(paymaster, paymasterVerificationGas, postOpGasLimit)))
                .to.eql({ paymaster, paymasterVerificationGas, postOpGasLimit, paymasterData: '0x' });
            const paymasterData = '0xbeaf';
            (0, chai_1.expect)((0, utils_1.unpackPaymasterAndData)((0, utils_1.packPaymasterData)(paymaster, paymasterVerificationGas, postOpGasLimit, paymasterData)))
                .to.eql({ paymaster, paymasterVerificationGas, postOpGasLimit, paymasterData });
        });
        it('should pack userop without optional fields', function () {
            (0, chai_1.expect)((0, utils_1.packUserOp)({
                sender: 'a',
                nonce: 1,
                callGasLimit: 2,
                verificationGasLimit: 3,
                preVerificationGas: 4,
                callData: '333',
                maxFeePerGas: 5,
                maxPriorityFeePerGas: 6,
                signature: '777'
            })).to.eql({
                sender: 'a',
                nonce: '0x01',
                initCode: '0x',
                accountGasLimits: (0, utils_1.packAccountGasLimits)(3, 2),
                preVerificationGas: '0x04',
                callData: '333',
                gasFees: (0, utils_1.packUint)(6, 5),
                signature: '777',
                paymasterAndData: '0x'
            });
        });
        it('should pack userop with optional fields', function () {
            const factory = '0xfa'.padEnd(42, 'fa');
            (0, chai_1.expect)((0, utils_1.packUserOp)({
                sender: 'a',
                nonce: 1,
                factory,
                factoryData: '0xbeaf',
                callGasLimit: 2,
                verificationGasLimit: 3,
                preVerificationGas: 4,
                callData: '333',
                maxFeePerGas: 5,
                maxPriorityFeePerGas: 6,
                signature: '777',
                paymaster,
                paymasterVerificationGasLimit: 8,
                paymasterPostOpGasLimit: 9,
                paymasterData: '0xcafebabe'
            })).to.eql({
                sender: 'a',
                nonce: '0x01',
                initCode: (0, utils_2.hexConcat)([factory, '0xbeaf']),
                accountGasLimits: (0, utils_1.packAccountGasLimits)(3, 2),
                preVerificationGas: '0x04',
                gasFees: (0, utils_1.packUint)(6, 5),
                callData: '333',
                signature: '777',
                paymasterAndData: (0, utils_2.hexConcat)([
                    paymaster,
                    (0, utils_2.hexZeroPad)('0x8', 16),
                    (0, utils_2.hexZeroPad)('0x9', 16),
                    '0xcafebabe'
                ])
            });
        });
    });
});
//# sourceMappingURL=0-utils.test.js.map