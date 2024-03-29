"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeSimulateHandleOpResult = exports.simulationRpcParams = exports.entryPointSimulationsInterface = void 0;
const ERC4337Utils_1 = require("./ERC4337Utils");
const EntryPointSimulations_json_1 = __importDefault(require("@account-abstraction/contracts/artifacts/EntryPointSimulations.json"));
const types_1 = require("./types");
exports.entryPointSimulationsInterface = types_1.EntryPointSimulations__factory.createInterface();
/**
 * create the rpc params for eth_call (or debug_traceCall) for simulation method
 * @param methodName the EntryPointSimulations method (simulateValidation or simulateHandleOp)
 * @param entryPointAddress
 * @param userOp
 * @param extraOptions optional added tracer settings
 */
function simulationRpcParams(methodName, entryPointAddress, userOp, extraParams = [], extraOptions = {}) {
    const data = exports.entryPointSimulationsInterface.encodeFunctionData(methodName, [(0, ERC4337Utils_1.packUserOp)(userOp), ...extraParams]);
    const tx = {
        to: entryPointAddress,
        data
    };
    const stateOverride = {
        [entryPointAddress]: {
            code: EntryPointSimulations_json_1.default.deployedBytecode
        }
    };
    return [
        tx,
        'latest',
        Object.assign(Object.assign({}, extraOptions), stateOverride)
    ];
}
exports.simulationRpcParams = simulationRpcParams;
function decodeSimulateHandleOpResult(data) {
    return exports.entryPointSimulationsInterface.decodeFunctionResult('simulateHandleOp', data)[0];
}
exports.decodeSimulateHandleOpResult = decodeSimulateHandleOpResult;
//# sourceMappingURL=rpcSimulateValidations.js.map