"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationManager = void 0;
const ethers_1 = require("ethers");
const debug_1 = __importDefault(require("debug"));
const utils_1 = require("@account-abstraction/utils");
const sdk_1 = require("@account-abstraction/sdk");
const TracerResultParser_1 = require("./TracerResultParser");
const BundlerCollectorTracer_1 = require("./BundlerCollectorTracer");
const GethTracer_1 = require("./GethTracer");
const EntryPointSimulations_json_1 = __importDefault(require("@account-abstraction/contracts/artifacts/EntryPointSimulations.json"));
const debug = (0, debug_1.default)('aa.mgr.validate');
// how much time into the future a UserOperation must be valid in order to be accepted
const VALID_UNTIL_FUTURE_SECONDS = 30;
const HEX_REGEX = /^0x[a-fA-F\d]*$/i;
const entryPointSimulations = utils_1.IEntryPointSimulations__factory.createInterface();
class ValidationManager {
    constructor(entryPoint, unsafe) {
        this.entryPoint = entryPoint;
        this.unsafe = unsafe;
    }
    parseValidationResult(userOp, res) {
        const mergedValidation = (0, utils_1.mergeValidationDataValues)(res.returnInfo.accountValidationData, res.returnInfo.paymasterValidationData);
        function fillEntity(addr, info) {
            if (addr == null || addr === utils_1.AddressZero)
                return undefined;
            return {
                addr,
                stake: info.stake,
                unstakeDelaySec: info.unstakeDelaySec
            };
        }
        const returnInfo = {
            sigFailed: mergedValidation.aggregator !== utils_1.AddressZero,
            validUntil: mergedValidation.validUntil,
            validAfter: mergedValidation.validAfter,
            preOpGas: res.returnInfo.preOpGas,
            prefund: res.returnInfo.prefund
        };
        return {
            returnInfo,
            senderInfo: fillEntity(userOp.sender, res.senderInfo),
            paymasterInfo: fillEntity(userOp.paymaster, res.paymasterInfo),
            factoryInfo: fillEntity(userOp.factory, res.factoryInfo),
            aggregatorInfo: fillEntity(res.aggregatorInfo.aggregator, res.aggregatorInfo.stakeInfo)
        };
    }
    // standard eth_call to simulateValidation
    async _callSimulateValidation(userOp) {
        // Promise<IEntryPointSimulations.ValidationResultStructOutput> {
        const data = entryPointSimulations.encodeFunctionData('simulateValidation', [(0, utils_1.packUserOp)(userOp)]);
        const tx = {
            to: this.entryPoint.address,
            data
        };
        const stateOverride = {
            [this.entryPoint.address]: {
                code: EntryPointSimulations_json_1.default.deployedBytecode
            }
        };
        try {
            const provider = this.entryPoint.provider;
            const simulationResult = await provider.send('eth_call', [tx, 'latest', stateOverride]);
            const [res] = entryPointSimulations.decodeFunctionResult('simulateValidation', simulationResult);
            return this.parseValidationResult(userOp, res);
        }
        catch (error) {
            const decodedError = (0, utils_1.decodeRevertReason)(error);
            if (decodedError != null) {
                throw new utils_1.RpcError(decodedError, utils_1.ValidationErrors.SimulateValidation);
            }
            throw error;
        }
    }
    // decode and throw error
    _throwError(errorResult) {
        throw new Error(errorResult.errorName);
    }
    async _geth_traceCall_SimulateValidation(userOp) {
        var _a, _b;
        const provider = this.entryPoint.provider;
        const packedUserUp = (0, utils_1.packUserOp)(userOp);
        console.log(packedUserUp);
        const simulateCall = entryPointSimulations.encodeFunctionData('simulateValidation', [packedUserUp]);
        const simulationGas = ethers_1.BigNumber.from(userOp.preVerificationGas).add(userOp.verificationGasLimit);
        const tracerResult = await (0, GethTracer_1.debug_traceCall)(provider, {
            from: utils_1.AddressZero,
            to: this.entryPoint.address,
            data: simulateCall,
            gasLimit: simulationGas
        }, {
            tracer: BundlerCollectorTracer_1.bundlerCollectorTracer,
            stateOverrides: {
                [this.entryPoint.address]: {
                    code: EntryPointSimulations_json_1.default.deployedBytecode
                }
            }
        });
        const lastResult = tracerResult.calls.slice(-1)[0];
        const data = lastResult.data;
        if (lastResult.type === 'REVERT') {
            throw new utils_1.RpcError((0, utils_1.decodeRevertReason)(data, false), utils_1.ValidationErrors.SimulateValidation);
        }
        // // Hack to handle SELFDESTRUCT until we fix entrypoint
        // if (data === '0x') {
        //   return [data as any, tracerResult]
        // }
        try {
            const [decodedSimulations] = entryPointSimulations.decodeFunctionResult('simulateValidation', data);
            const validationResult = this.parseValidationResult(userOp, decodedSimulations);
            debug('==dump tree=', JSON.stringify(tracerResult, null, 2)
                .replace(new RegExp(userOp.sender.toLowerCase()), '{sender}')
                .replace(new RegExp((_a = (0, utils_1.getAddr)(userOp.paymaster)) !== null && _a !== void 0 ? _a : '--no-paymaster--'), '{paymaster}')
                .replace(new RegExp((_b = (0, utils_1.getAddr)(userOp.factory)) !== null && _b !== void 0 ? _b : '--no-initcode--'), '{factory}'));
            // console.log('==debug=', ...tracerResult.numberLevels.forEach(x=>x.access), 'sender=', userOp.sender, 'paymaster=', hexlify(userOp.paymasterAndData)?.slice(0, 42))
            // errorResult is "ValidationResult"
            return [validationResult, tracerResult];
        }
        catch (e) {
            // if already parsed, throw as is
            if (e.code != null) {
                throw e;
            }
            // not a known error of EntryPoint (probably, only Error(string), since FailedOp is handled above)
            const err = (0, utils_1.decodeErrorReason)(e);
            throw new utils_1.RpcError(err != null ? err.message : data, -32000);
        }
    }
    /**
     * validate UserOperation.
     * should also handle unmodified memory (e.g. by referencing cached storage in the mempool
     * one item to check that was un-modified is the aggregator..
     * @param userOp
     */
    async validateUserOp(userOp, previousCodeHashes, checkStakes = true) {
        if (previousCodeHashes != null && previousCodeHashes.addresses.length > 0) {
            const { hash: codeHashes } = await this.getCodeHashes(previousCodeHashes.addresses);
            // [COD-010]
            (0, utils_1.requireCond)(codeHashes === previousCodeHashes.hash, 'modified code after first validation', utils_1.ValidationErrors.OpcodeValidation);
        }
        let res;
        let codeHashes = {
            addresses: [],
            hash: ''
        };
        let storageMap = {};
        if (!this.unsafe) {
            let tracerResult;
            [res, tracerResult] = await this._geth_traceCall_SimulateValidation(userOp).catch(e => {
                throw e;
            });
            let contractAddresses;
            [contractAddresses, storageMap] = (0, TracerResultParser_1.tracerResultParser)(userOp, tracerResult, res, this.entryPoint);
            // if no previous contract hashes, then calculate hashes of contracts
            if (previousCodeHashes == null) {
                codeHashes = await this.getCodeHashes(contractAddresses);
            }
            if (res === '0x') {
                throw new Error('simulateValidation reverted with no revert string!');
            }
        }
        else {
            // NOTE: this mode doesn't do any opcode checking and no stake checking!
            res = await this._callSimulateValidation(userOp);
        }
        (0, utils_1.requireCond)(!res.returnInfo.sigFailed, 'Invalid UserOp signature or paymaster signature', utils_1.ValidationErrors.InvalidSignature);
        const now = Math.floor(Date.now() / 1000);
        (0, utils_1.requireCond)(res.returnInfo.validAfter <= now, `time-range in the future time ${res.returnInfo.validAfter}, now=${now}`, utils_1.ValidationErrors.NotInTimeRange);
        (0, utils_1.requireCond)(res.returnInfo.validUntil == null || res.returnInfo.validUntil >= now, 'already expired', utils_1.ValidationErrors.NotInTimeRange);
        (0, utils_1.requireCond)(res.returnInfo.validUntil == null || res.returnInfo.validUntil > now + VALID_UNTIL_FUTURE_SECONDS, 'expires too soon', utils_1.ValidationErrors.NotInTimeRange);
        (0, utils_1.requireCond)(res.aggregatorInfo == null, 'Currently not supporting aggregator', utils_1.ValidationErrors.UnsupportedSignatureAggregator);
        const verificationCost = ethers_1.BigNumber.from(res.returnInfo.preOpGas).sub(userOp.preVerificationGas);
        const extraGas = ethers_1.BigNumber.from(userOp.verificationGasLimit).sub(verificationCost).toNumber();
        (0, utils_1.requireCond)(extraGas >= 2000, `verificationGas should have extra 2000 gas. has only ${extraGas}`, utils_1.ValidationErrors.SimulateValidation);
        return Object.assign(Object.assign({}, res), { referencedContracts: codeHashes, storageMap });
    }
    async getCodeHashes(addresses) {
        const { hash } = await (0, utils_1.runContractScript)(this.entryPoint.provider, new utils_1.CodeHashGetter__factory(), [addresses]);
        return {
            hash,
            addresses
        };
    }
    /**
     * perform static checking on input parameters.
     * @param userOp
     * @param entryPointInput
     * @param requireSignature
     * @param requireGasParams
     */
    validateInputParameters(userOp, entryPointInput, requireSignature = true, requireGasParams = true) {
        (0, utils_1.requireCond)(entryPointInput != null, 'No entryPoint param', utils_1.ValidationErrors.InvalidFields);
        (0, utils_1.requireCond)(entryPointInput.toLowerCase() === this.entryPoint.address.toLowerCase(), `The EntryPoint at "${entryPointInput}" is not supported. This bundler uses ${this.entryPoint.address}`, utils_1.ValidationErrors.InvalidFields);
        // minimal sanity check: userOp exists, and all members are hex
        (0, utils_1.requireCond)(userOp != null, 'No UserOperation param', utils_1.ValidationErrors.InvalidFields);
        const fields = ['sender', 'nonce', 'callData'];
        if (requireSignature) {
            fields.push('signature');
        }
        if (requireGasParams) {
            fields.push('preVerificationGas', 'verificationGasLimit', 'callGasLimit', 'maxFeePerGas', 'maxPriorityFeePerGas');
        }
        fields.forEach(key => {
            var _a;
            const value = (_a = userOp[key]) === null || _a === void 0 ? void 0 : _a.toString();
            (0, utils_1.requireCond)(value != null, 'Missing userOp field: ' + key + ' ' + JSON.stringify(userOp), utils_1.ValidationErrors.InvalidFields);
            (0, utils_1.requireCond)(value.match(HEX_REGEX) != null, `Invalid hex value for property ${key}:${value} in UserOp`, utils_1.ValidationErrors.InvalidFields);
        });
        (0, utils_1.requireAddressAndFields)(userOp, 'paymaster', ['paymasterPostOpGasLimit', 'paymasterVerificationGasLimit'], ['paymasterData']);
        (0, utils_1.requireAddressAndFields)(userOp, 'factory', ['factoryData']);
        const calcPreVerificationGas1 = (0, sdk_1.calcPreVerificationGas)(userOp);
        (0, utils_1.requireCond)(ethers_1.BigNumber.from(userOp.preVerificationGas).gte(calcPreVerificationGas1), `preVerificationGas too low: expected at least ${calcPreVerificationGas1}`, utils_1.ValidationErrors.InvalidFields);
    }
}
exports.ValidationManager = ValidationManager;
//# sourceMappingURL=ValidationManager.js.map