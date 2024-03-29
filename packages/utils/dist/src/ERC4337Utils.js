"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveHexlify = exports.deepHexlify = exports.rethrowError = exports.decodeErrorReason = exports.getUserOpHash = exports.encodeUserOp = exports.unpackUserOp = exports.packUserOp = exports.unpackPaymasterAndData = exports.packValidationData = exports.mergeValidationData = exports.mergeValidationDataValues = exports.parseValidationData = exports.SIG_VALIDATION_FAILED = exports.maxUint48 = exports.packPaymasterData = exports.unpackUint = exports.packUint = exports.unpackAccountGasLimits = exports.packAccountGasLimits = exports.AddressZero = void 0;
const utils_1 = require("ethers/lib/utils");
const IEntryPoint_json_1 = require("@account-abstraction/contracts/artifacts/IEntryPoint.json");
const ethers_1 = require("ethers");
const debug_1 = __importDefault(require("debug"));
const debug = (0, debug_1.default)('aa.utils');
// UserOperation is the first parameter of getUserOpHash
const getUserOpHashMethod = 'getUserOpHash';
const PackedUserOpType = (_a = IEntryPoint_json_1.abi.find(entry => entry.name === getUserOpHashMethod)) === null || _a === void 0 ? void 0 : _a.inputs[0];
if (PackedUserOpType == null) {
    throw new Error(`unable to find method ${getUserOpHashMethod} in EP ${IEntryPoint_json_1.abi.filter(x => x.type === 'function').map(x => x.name).join(',')}`);
}
exports.AddressZero = ethers_1.ethers.constants.AddressZero;
// todo: remove this wrapper method?
function packAccountGasLimits(validationGasLimit, callGasLimit) {
    return packUint(validationGasLimit, callGasLimit);
}
exports.packAccountGasLimits = packAccountGasLimits;
function unpackAccountGasLimits(accountGasLimits) {
    const [verificationGasLimit, callGasLimit] = unpackUint(accountGasLimits);
    return { verificationGasLimit, callGasLimit };
}
exports.unpackAccountGasLimits = unpackAccountGasLimits;
function packUint(high128, low128) {
    return (0, utils_1.hexZeroPad)(ethers_1.BigNumber.from(high128).shl(128).add(low128).toHexString(), 32);
}
exports.packUint = packUint;
function unpackUint(packed) {
    const packedNumber = ethers_1.BigNumber.from(packed);
    return [packedNumber.shr(128), packedNumber.and(ethers_1.BigNumber.from(1).shl(128).sub(1))];
}
exports.unpackUint = unpackUint;
function packPaymasterData(paymaster, paymasterVerificationGasLimit, postOpGasLimit, paymasterData) {
    return ethers_1.ethers.utils.hexConcat([
        paymaster,
        packUint(paymasterVerificationGasLimit, postOpGasLimit),
        paymasterData !== null && paymasterData !== void 0 ? paymasterData : '0x'
    ]);
}
exports.packPaymasterData = packPaymasterData;
exports.maxUint48 = (2 ** 48) - 1;
exports.SIG_VALIDATION_FAILED = (0, utils_1.hexZeroPad)('0x01', 20);
/**
 * parse validationData as returned from validateUserOp or validatePaymasterUserOp into ValidationData struct
 * @param validationData
 */
function parseValidationData(validationData) {
    const data = (0, utils_1.hexZeroPad)(ethers_1.BigNumber.from(validationData).toHexString(), 32);
    // string offsets start from left (msb)
    const aggregator = (0, utils_1.hexDataSlice)(data, 32 - 20);
    let validUntil = parseInt((0, utils_1.hexDataSlice)(data, 32 - 26, 32 - 20));
    if (validUntil === 0)
        validUntil = exports.maxUint48;
    const validAfter = parseInt((0, utils_1.hexDataSlice)(data, 0, 6));
    return {
        aggregator,
        validAfter,
        validUntil
    };
}
exports.parseValidationData = parseValidationData;
function mergeValidationDataValues(accountValidationData, paymasterValidationData) {
    return mergeValidationData(parseValidationData(accountValidationData), parseValidationData(paymasterValidationData));
}
exports.mergeValidationDataValues = mergeValidationDataValues;
/**
 * merge validationData structure returned by paymaster and account
 * @param accountValidationData returned from validateUserOp
 * @param paymasterValidationData returned from validatePaymasterUserOp
 */
function mergeValidationData(accountValidationData, paymasterValidationData) {
    return {
        aggregator: paymasterValidationData.aggregator !== exports.AddressZero ? exports.SIG_VALIDATION_FAILED : accountValidationData.aggregator,
        validAfter: Math.max(accountValidationData.validAfter, paymasterValidationData.validAfter),
        validUntil: Math.min(accountValidationData.validUntil, paymasterValidationData.validUntil)
    };
}
exports.mergeValidationData = mergeValidationData;
function packValidationData(validationData) {
    var _a, _b;
    return ethers_1.BigNumber.from((_a = validationData.validAfter) !== null && _a !== void 0 ? _a : 0).shl(48)
        .add((_b = validationData.validUntil) !== null && _b !== void 0 ? _b : 0).shl(160)
        .add(validationData.aggregator);
}
exports.packValidationData = packValidationData;
function unpackPaymasterAndData(paymasterAndData) {
    if (paymasterAndData.length <= 2)
        return null;
    if ((0, utils_1.hexDataLength)(paymasterAndData) < 52) {
        // if length is non-zero, then must at least host paymaster address and gas-limits
        throw new Error(`invalid PaymasterAndData: ${paymasterAndData}`);
    }
    const [paymasterVerificationGas, postOpGasLimit] = unpackUint((0, utils_1.hexDataSlice)(paymasterAndData, 20, 52));
    return {
        paymaster: (0, utils_1.hexDataSlice)(paymasterAndData, 0, 20),
        paymasterVerificationGas,
        postOpGasLimit,
        paymasterData: (0, utils_1.hexDataSlice)(paymasterAndData, 52)
    };
}
exports.unpackPaymasterAndData = unpackPaymasterAndData;
function packUserOp(op) {
    var _a, _b, _c, _d, _e;
    let paymasterAndData;
    if (op.paymaster == null) {
        paymasterAndData = '0x';
    }
    else {
        if (op.paymasterVerificationGasLimit == null || op.paymasterPostOpGasLimit == null) {
            throw new Error('paymaster with no gas limits');
        }
        paymasterAndData = packPaymasterData(op.paymaster, op.paymasterVerificationGasLimit, op.paymasterPostOpGasLimit, op.paymasterData);
    }
    const initCode = op.factory == null ? '0x' : (0, utils_1.hexConcat)([op.factory, (_a = op.factoryData) !== null && _a !== void 0 ? _a : '']);
    const gasFees = packUint((_b = op.maxPriorityFeePerGas) !== null && _b !== void 0 ? _b : 0, (_c = op.maxFeePerGas) !== null && _c !== void 0 ? _c : 0);
    const accountGasLimits = packUint((_d = op.verificationGasLimit) !== null && _d !== void 0 ? _d : 0, (_e = op.callGasLimit) !== null && _e !== void 0 ? _e : 0);
    return {
        sender: op.sender,
        nonce: ethers_1.BigNumber.from(op.nonce).toHexString(),
        initCode,
        callData: op.callData,
        accountGasLimits,
        preVerificationGas: ethers_1.BigNumber.from(op.preVerificationGas).toHexString(),
        gasFees,
        paymasterAndData,
        signature: op.signature
    };
}
exports.packUserOp = packUserOp;
function unpackUserOp(packed) {
    const [verificationGasLimit, callGasLimit] = unpackUint(packed.accountGasLimits);
    const [maxPriorityFeePerGas, maxFeePerGas] = unpackUint(packed.gasFees);
    let ret = {
        sender: packed.sender,
        nonce: packed.nonce,
        callData: packed.callData,
        preVerificationGas: packed.preVerificationGas,
        verificationGasLimit,
        callGasLimit,
        maxFeePerGas,
        maxPriorityFeePerGas,
        signature: packed.signature
    };
    if (packed.initCode != null && packed.initCode.length > 2) {
        const factory = (0, utils_1.hexDataSlice)(packed.initCode, 0, 20);
        const factoryData = (0, utils_1.hexDataSlice)(packed.initCode, 20);
        ret = Object.assign(Object.assign({}, ret), { factory,
            factoryData });
    }
    const pmData = unpackPaymasterAndData(packed.paymasterAndData);
    if (pmData != null) {
        ret = Object.assign(Object.assign({}, ret), { paymaster: pmData.paymaster, paymasterVerificationGasLimit: pmData.paymasterVerificationGas, paymasterPostOpGasLimit: pmData.postOpGasLimit, paymasterData: pmData.paymasterData });
    }
    return ret;
}
exports.unpackUserOp = unpackUserOp;
/**
 * abi-encode the userOperation
 * @param op a PackedUserOp
 * @param forSignature "true" if the hash is needed to calculate the getUserOpHash()
 *  "false" to pack entire UserOp, for calculating the calldata cost of putting it on-chain.
 */
function encodeUserOp(op1, forSignature = true) {
    // if "op" is unpacked UserOperation, then pack it first, before we ABI-encode it.
    let op;
    if ('callGasLimit' in op1) {
        op = packUserOp(op1);
    }
    else {
        op = op1;
    }
    if (forSignature) {
        return utils_1.defaultAbiCoder.encode(['address', 'uint256', 'bytes32', 'bytes32',
            'bytes32', 'uint256', 'bytes32',
            'bytes32'], [op.sender, op.nonce, (0, utils_1.keccak256)(op.initCode), (0, utils_1.keccak256)(op.callData),
            op.accountGasLimits, op.preVerificationGas, op.gasFees,
            (0, utils_1.keccak256)(op.paymasterAndData)]);
    }
    else {
        // for the purpose of calculating gas cost encode also signature (and no keccak of bytes)
        return utils_1.defaultAbiCoder.encode(['address', 'uint256', 'bytes', 'bytes',
            'bytes32', 'uint256', 'bytes32',
            'bytes', 'bytes'], [op.sender, op.nonce, op.initCode, op.callData,
            op.accountGasLimits, op.preVerificationGas, op.gasFees,
            op.paymasterAndData, op.signature]);
    }
}
exports.encodeUserOp = encodeUserOp;
/**
 * calculate the userOpHash of a given userOperation.
 * The userOpHash is a hash of all UserOperation fields, except the "signature" field.
 * The entryPoint uses this value in the emitted UserOperationEvent.
 * A wallet may use this value as the hash to sign (the SampleWallet uses this method)
 * @param op
 * @param entryPoint
 * @param chainId
 */
function getUserOpHash(op, entryPoint, chainId) {
    const userOpHash = (0, utils_1.keccak256)(encodeUserOp(op, true));
    const enc = utils_1.defaultAbiCoder.encode(['bytes32', 'address', 'uint256'], [userOpHash, entryPoint, chainId]);
    return (0, utils_1.keccak256)(enc);
}
exports.getUserOpHash = getUserOpHash;
const ErrorSig = (0, utils_1.keccak256)(Buffer.from('Error(string)')).slice(0, 10); // 0x08c379a0
const FailedOpSig = (0, utils_1.keccak256)(Buffer.from('FailedOp(uint256,string)')).slice(0, 10); // 0x220266b6
/**
 * decode bytes thrown by revert as Error(message) or FailedOp(opIndex,paymaster,message)
 */
function decodeErrorReason(error) {
    var _a;
    if (typeof error !== 'string') {
        const err = error;
        error = ((_a = err.data) !== null && _a !== void 0 ? _a : err.error.data);
    }
    debug('decoding', error);
    if (error.startsWith(ErrorSig)) {
        const [message] = utils_1.defaultAbiCoder.decode(['string'], '0x' + error.substring(10));
        return { message };
    }
    else if (error.startsWith(FailedOpSig)) {
        let [opIndex, message] = utils_1.defaultAbiCoder.decode(['uint256', 'string'], '0x' + error.substring(10));
        message = `FailedOp: ${message}`;
        return {
            message,
            opIndex
        };
    }
}
exports.decodeErrorReason = decodeErrorReason;
/**
 * update thrown Error object with our custom FailedOp message, and re-throw it.
 * updated both "message" and inner encoded "data"
 * tested on geth, hardhat-node
 * usage: entryPoint.handleOps().catch(decodeError)
 */
function rethrowError(e) {
    let error = e;
    let parent = e;
    if ((error === null || error === void 0 ? void 0 : error.error) != null) {
        error = error.error;
    }
    while ((error === null || error === void 0 ? void 0 : error.data) != null) {
        parent = error;
        error = error.data;
    }
    const decoded = typeof error === 'string' && error.length > 2 ? decodeErrorReason(error) : undefined;
    if (decoded != null) {
        e.message = decoded.message;
        if (decoded.opIndex != null) {
            // helper for chai: convert our FailedOp error into "Error(msg)"
            const errorWithMsg = (0, utils_1.hexConcat)([ErrorSig, utils_1.defaultAbiCoder.encode(['string'], [decoded.message])]);
            // modify in-place the error object:
            parent.data = errorWithMsg;
        }
    }
    throw e;
}
exports.rethrowError = rethrowError;
/**
 * hexlify all members of object, recursively
 * @param obj
 */
function deepHexlify(obj) {
    if (typeof obj === 'function') {
        return undefined;
    }
    if (obj == null || typeof obj === 'string' || typeof obj === 'boolean') {
        return obj;
    }
    else if (obj._isBigNumber != null || typeof obj !== 'object') {
        return (0, utils_1.hexlify)(obj).replace(/^0x0/, '0x');
    }
    if (Array.isArray(obj)) {
        return obj.map(member => deepHexlify(member));
    }
    return Object.keys(obj)
        .reduce((set, key) => (Object.assign(Object.assign({}, set), { [key]: deepHexlify(obj[key]) })), {});
}
exports.deepHexlify = deepHexlify;
// resolve all property and hexlify.
// (UserOpMethodHandler receives data from the network, so we need to pack our generated values)
async function resolveHexlify(a) {
    return deepHexlify(await (0, utils_1.resolveProperties)(a));
}
exports.resolveHexlify = resolveHexlify;
//# sourceMappingURL=ERC4337Utils.js.map