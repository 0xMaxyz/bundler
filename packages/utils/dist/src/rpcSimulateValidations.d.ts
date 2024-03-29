import { UserOperation } from './ERC4337Utils';
import { IEntryPointSimulations } from './types';
export declare const entryPointSimulationsInterface: import("./types/@account-abstraction/contracts/core/EntryPointSimulations").EntryPointSimulationsInterface;
/**
 * create the rpc params for eth_call (or debug_traceCall) for simulation method
 * @param methodName the EntryPointSimulations method (simulateValidation or simulateHandleOp)
 * @param entryPointAddress
 * @param userOp
 * @param extraOptions optional added tracer settings
 */
export declare function simulationRpcParams(methodName: string, entryPointAddress: string, userOp: UserOperation, extraParams?: any[], extraOptions?: any): any[];
export type SimulateHandleUpResult = IEntryPointSimulations.ExecutionResultStructOutput;
export declare function decodeSimulateHandleOpResult(data: string): SimulateHandleUpResult;
