import { BigNumber, BigNumberish, BytesLike } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { TransactionDetailsForUserOp } from './TransactionDetailsForUserOp';
import { PaymasterAPI } from './PaymasterAPI';
import { UserOperation } from '@account-abstraction/utils';
import { GasOverheads } from './calcPreVerificationGas';
export interface FactoryParams {
    factory: string;
    factoryData?: BytesLike;
}
export interface BaseApiParams {
    provider: Provider;
    entryPointAddress: string;
    accountAddress?: string;
    overheads?: Partial<GasOverheads>;
    paymasterAPI?: PaymasterAPI;
}
export interface UserOpResult {
    transactionHash: string;
    success: boolean;
}
/**
 * Base class for all Smart Wallet ERC-4337 Clients to implement.
 * Subclass should inherit 5 methods to support a specific wallet contract:
 *
 * - getAccountInitCode - return the value to put into the "initCode" field, if the account is not yet deployed. should create the account instance using a factory contract.
 * - getNonce - return current account's nonce value
 * - encodeExecute - encode the call from entryPoint through our account to the target contract.
 * - signUserOpHash - sign the hash of a UserOp.
 *
 * The user can use the following APIs:
 * - createUnsignedUserOp - given "target" and "calldata", fill userOp to perform that operation from the account.
 * - createSignedUserOp - helper to call the above createUnsignedUserOp, and then extract the userOpHash and sign it
 */
export declare abstract class BaseAccountAPI {
    private senderAddress;
    private isPhantom;
    private readonly entryPointView;
    provider: Provider;
    overheads?: Partial<GasOverheads>;
    entryPointAddress: string;
    accountAddress?: string;
    paymasterAPI?: PaymasterAPI;
    /**
     * base constructor.
     * subclass SHOULD add parameters that define the owner (signer) of this wallet
     */
    protected constructor(params: BaseApiParams);
    init(): Promise<this>;
    /**
     * return the value to put into the "factory" and "factoryData", when the contract is not yet deployed.
     */
    abstract getFactoryData(): Promise<FactoryParams | null>;
    /**
     * return current account's nonce.
     */
    abstract getNonce(): Promise<BigNumber>;
    /**
     * encode the call from entryPoint through our account to the target contract.
     * @param target
     * @param value
     * @param data
     */
    abstract encodeExecute(target: string, value: BigNumberish, data: string): Promise<string>;
    /**
     * sign a userOp's hash (userOpHash).
     * @param userOpHash
     */
    abstract signUserOpHash(userOpHash: string): Promise<string>;
    /**
     * check if the contract is already deployed.
     */
    checkAccountPhantom(): Promise<boolean>;
    /**
     * calculate the account address even before it is deployed
     */
    getCounterFactualAddress(): Promise<string>;
    /**
     * return initCode value to into the UserOp.
     * (either factory and factoryData, or null hex if contract already deployed)
     */
    getRequiredFactoryData(): Promise<FactoryParams | null>;
    /**
     * return maximum gas used for verification.
     * NOTE: createUnsignedUserOp will add to this value the cost of creation, if the contract is not yet created.
     */
    getVerificationGasLimit(): Promise<BigNumberish>;
    /**
     * should cover cost of putting calldata on-chain, and some overhead.
     * actual overhead depends on the expected bundle size
     */
    getPreVerificationGas(userOp: Partial<UserOperation>): Promise<number>;
    /**
     * ABI-encode a user operation. used for calldata cost estimation
     */
    encodeUserOP(userOp: UserOperation): string;
    encodeUserOpCallDataAndGasLimit(detailsForUserOp: TransactionDetailsForUserOp): Promise<{
        callData: string;
        callGasLimit: BigNumber;
    }>;
    /**
     * return userOpHash for signing.
     * This value matches entryPoint.getUserOpHash (calculated off-chain, to avoid a view call)
     * @param op userOperation, (signature field ignored)
     */
    getUserOpHash(op: UserOperation): Promise<string>;
    /**
     * return the account's address.
     * this value is valid even before deploying the contract.
     */
    getAccountAddress(): Promise<string>;
    estimateCreationGas(factoryParams: FactoryParams | null): Promise<BigNumberish>;
    /**
     * create a UserOperation, filling all details (except signature)
     * - if account is not yet created, add initCode to deploy it.
     * - if gas or nonce are missing, read them from the chain (note that we can't fill gaslimit before the account is created)
     * @param info
     */
    createUnsignedUserOp(info: TransactionDetailsForUserOp): Promise<UserOperation>;
    /**
     * Sign the filled userOp.
     * @param userOp the UserOperation to sign (with signature field ignored)
     */
    signUserOp(userOp: UserOperation): Promise<UserOperation>;
    /**
     * helper method: create and sign a user operation.
     * @param info transaction details for the userOp
     */
    createSignedUserOp(info: TransactionDetailsForUserOp): Promise<UserOperation>;
    /**
     * get the transaction that has this userOpHash mined, or null if not found
     * @param userOpHash returned by sendUserOpToBundler (or by getUserOpHash..)
     * @param timeout stop waiting after this timeout
     * @param interval time to wait between polls.
     * @return the transactionHash this userOp was mined, or null if not found.
     */
    getUserOpReceipt(userOpHash: string, timeout?: number, interval?: number): Promise<string | null>;
}
