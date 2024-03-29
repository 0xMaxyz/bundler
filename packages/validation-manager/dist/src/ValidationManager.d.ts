import { BigNumberish } from 'ethers';
import { ReferencedCodeHashes, StakeInfo, StorageMap, UserOperation, IEntryPoint, ValidationResultStructOutput } from '@account-abstraction/utils';
import { BundlerTracerResult } from './BundlerCollectorTracer';
/**
 * result from successful simulateValidation, after some parsing.
 */
export interface ValidationResult {
    returnInfo: {
        preOpGas: BigNumberish;
        prefund: BigNumberish;
        sigFailed: boolean;
        validAfter: number;
        validUntil: number;
    };
    senderInfo: StakeInfo;
    factoryInfo?: StakeInfo;
    paymasterInfo?: StakeInfo;
    aggregatorInfo?: StakeInfo;
}
export interface ValidateUserOpResult extends ValidationResult {
    referencedContracts: ReferencedCodeHashes;
    storageMap: StorageMap;
}
export declare class ValidationManager {
    readonly entryPoint: IEntryPoint;
    readonly unsafe: boolean;
    constructor(entryPoint: IEntryPoint, unsafe: boolean);
    parseValidationResult(userOp: UserOperation, res: ValidationResultStructOutput): ValidationResult;
    _callSimulateValidation(userOp: UserOperation): Promise<ValidationResult>;
    _throwError(errorResult: {
        errorName: string;
        errorArgs: any;
    }): never;
    _geth_traceCall_SimulateValidation(userOp: UserOperation): Promise<[ValidationResult, BundlerTracerResult]>;
    /**
     * validate UserOperation.
     * should also handle unmodified memory (e.g. by referencing cached storage in the mempool
     * one item to check that was un-modified is the aggregator..
     * @param userOp
     */
    validateUserOp(userOp: UserOperation, previousCodeHashes?: ReferencedCodeHashes, checkStakes?: boolean): Promise<ValidateUserOpResult>;
    getCodeHashes(addresses: string[]): Promise<ReferencedCodeHashes>;
    /**
     * perform static checking on input parameters.
     * @param userOp
     * @param entryPointInput
     * @param requireSignature
     * @param requireGasParams
     */
    validateInputParameters(userOp: UserOperation, entryPointInput: string, requireSignature?: boolean, requireGasParams?: boolean): void;
}
