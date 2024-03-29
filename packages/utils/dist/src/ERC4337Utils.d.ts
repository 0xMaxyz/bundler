import { BigNumber, BigNumberish, BytesLike } from 'ethers';
import { PackedUserOperation } from './Utils';
export declare const AddressZero = "0x0000000000000000000000000000000000000000";
export type NotPromise<T> = {
    [P in keyof T]: Exclude<T[P], Promise<any>>;
};
export interface UserOperation {
    sender: string;
    nonce: BigNumberish;
    factory?: string;
    factoryData?: BytesLike;
    callData: BytesLike;
    callGasLimit: BigNumberish;
    verificationGasLimit: BigNumberish;
    preVerificationGas: BigNumberish;
    maxFeePerGas: BigNumberish;
    maxPriorityFeePerGas: BigNumberish;
    paymaster?: string;
    paymasterVerificationGasLimit?: BigNumberish;
    paymasterPostOpGasLimit?: BigNumberish;
    paymasterData?: BytesLike;
    signature: BytesLike;
}
export declare function packAccountGasLimits(validationGasLimit: BigNumberish, callGasLimit: BigNumberish): string;
export declare function unpackAccountGasLimits(accountGasLimits: BytesLike): {
    verificationGasLimit: BigNumber;
    callGasLimit: BigNumber;
};
export declare function packUint(high128: BigNumberish, low128: BigNumberish): string;
export declare function unpackUint(packed: BytesLike): [high128: BigNumber, low128: BigNumber];
export declare function packPaymasterData(paymaster: string, paymasterVerificationGasLimit: BigNumberish, postOpGasLimit: BigNumberish, paymasterData?: BytesLike): BytesLike;
export interface ValidationData {
    aggregator: string;
    validAfter: number;
    validUntil: number;
}
export declare const maxUint48: number;
export declare const SIG_VALIDATION_FAILED: string;
/**
 * parse validationData as returned from validateUserOp or validatePaymasterUserOp into ValidationData struct
 * @param validationData
 */
export declare function parseValidationData(validationData: BigNumberish): ValidationData;
export declare function mergeValidationDataValues(accountValidationData: BigNumberish, paymasterValidationData: BigNumberish): ValidationData;
/**
 * merge validationData structure returned by paymaster and account
 * @param accountValidationData returned from validateUserOp
 * @param paymasterValidationData returned from validatePaymasterUserOp
 */
export declare function mergeValidationData(accountValidationData: ValidationData, paymasterValidationData: ValidationData): ValidationData;
export declare function packValidationData(validationData: ValidationData): BigNumber;
export declare function unpackPaymasterAndData(paymasterAndData: BytesLike): {
    paymaster: string;
    paymasterVerificationGas: BigNumber;
    postOpGasLimit: BigNumber;
    paymasterData: BytesLike;
} | null;
export declare function packUserOp(op: UserOperation): PackedUserOperation;
export declare function unpackUserOp(packed: PackedUserOperation): UserOperation;
/**
 * abi-encode the userOperation
 * @param op a PackedUserOp
 * @param forSignature "true" if the hash is needed to calculate the getUserOpHash()
 *  "false" to pack entire UserOp, for calculating the calldata cost of putting it on-chain.
 */
export declare function encodeUserOp(op1: PackedUserOperation | UserOperation, forSignature?: boolean): string;
/**
 * calculate the userOpHash of a given userOperation.
 * The userOpHash is a hash of all UserOperation fields, except the "signature" field.
 * The entryPoint uses this value in the emitted UserOperationEvent.
 * A wallet may use this value as the hash to sign (the SampleWallet uses this method)
 * @param op
 * @param entryPoint
 * @param chainId
 */
export declare function getUserOpHash(op: UserOperation, entryPoint: string, chainId: number): string;
interface DecodedError {
    message: string;
    opIndex?: number;
}
/**
 * decode bytes thrown by revert as Error(message) or FailedOp(opIndex,paymaster,message)
 */
export declare function decodeErrorReason(error: string | Error): DecodedError | undefined;
/**
 * update thrown Error object with our custom FailedOp message, and re-throw it.
 * updated both "message" and inner encoded "data"
 * tested on geth, hardhat-node
 * usage: entryPoint.handleOps().catch(decodeError)
 */
export declare function rethrowError(e: any): any;
/**
 * hexlify all members of object, recursively
 * @param obj
 */
export declare function deepHexlify(obj: any): any;
export declare function resolveHexlify(a: any): Promise<any>;
export {};
