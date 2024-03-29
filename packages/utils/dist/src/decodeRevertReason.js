"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rethrowWithRevertReason = exports.decodeRevertReason = void 0;
const abi_1 = require("@ethersproject/abi");
const ethers_1 = require("ethers");
const types_1 = require("./types");
const soltypes_1 = require("./soltypes");
const decodeRevertReasonContracts = new abi_1.Interface([
    ...types_1.EntryPointSimulations__factory.createInterface().fragments,
    ...types_1.IPaymaster__factory.createInterface().fragments,
    ...soltypes_1.SimpleAccount__factory.createInterface().fragments
].filter((f) => f.type === 'error'));
/**
 * helper to decode revert data into its string representation
 * @param data revert data or an exception thrown by eth_call
 * @param nullIfNoMatch true to return null if not found. otherwise, return input data as-is
 */
function decodeRevertReason(data, nullIfNoMatch = true) {
    var _a, _b, _c, _d;
    if (typeof data !== 'string') {
        const err = data;
        data = ((_c = (_b = (_a = err.data) === null || _a === void 0 ? void 0 : _a.data) !== null && _b !== void 0 ? _b : err.data) !== null && _c !== void 0 ? _c : err.error.data);
    }
    const methodSig = data.slice(0, 10);
    const dataParams = '0x' + data.slice(10);
    try {
        // would be nice to add these to above "decodeRevertReasonContracts", but we can't add Error(string) to xface...
        if (methodSig === '0x08c379a0') {
            const [err] = ethers_1.ethers.utils.defaultAbiCoder.decode(['string'], dataParams);
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            return `Error(${err})`;
        }
        else if (methodSig === '0x4e487b71') {
            const [code] = ethers_1.ethers.utils.defaultAbiCoder.decode(['uint256'], dataParams);
            return `Panic(${(_d = panicCodes[code]) !== null && _d !== void 0 ? _d : code} + ')`;
        }
        const err = decodeRevertReasonContracts.parseError(data);
        // treat any error "bytes" argument as possible error to decode (e.g. FailedOpWithRevert, PostOpReverted)
        const args = err.args.map((arg, index) => {
            switch (err.errorFragment.inputs[index].type) {
                case 'bytes': return decodeRevertReason(arg, false);
                case 'string': return `"${arg}"`;
                default: return arg;
            }
        });
        return `${err.name}(${args.join(',')})`;
    }
    catch (e) {
        // throw new Error('unsupported errorSig ' + data)
        if (!nullIfNoMatch) {
            return data;
        }
        return null;
    }
}
exports.decodeRevertReason = decodeRevertReason;
// not sure why ethers fail to decode revert reasons, not even "Error()" (and obviously, not custom errors)
function rethrowWithRevertReason(e) {
    throw new Error(decodeRevertReason(e, false));
}
exports.rethrowWithRevertReason = rethrowWithRevertReason;
const panicCodes = {
    // from https://docs.soliditylang.org/en/v0.8.0/control-structures.html
    0x01: 'assert(false)',
    0x11: 'arithmetic overflow/underflow',
    0x12: 'divide by zero',
    0x21: 'invalid enum value',
    0x22: 'storage byte array that is incorrectly encoded',
    0x31: '.pop() on an empty array.',
    0x32: 'array sout-of-bounds or negative index',
    0x41: 'memory overflow',
    0x51: 'zero-initialized variable of internal function type'
};
//# sourceMappingURL=decodeRevertReason.js.map