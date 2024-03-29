import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "../../common";
export type PackedUserOperationStruct = {
    sender: PromiseOrValue<string>;
    nonce: PromiseOrValue<BigNumberish>;
    initCode: PromiseOrValue<BytesLike>;
    callData: PromiseOrValue<BytesLike>;
    accountGasLimits: PromiseOrValue<BytesLike>;
    preVerificationGas: PromiseOrValue<BigNumberish>;
    gasFees: PromiseOrValue<BytesLike>;
    paymasterAndData: PromiseOrValue<BytesLike>;
    signature: PromiseOrValue<BytesLike>;
};
export type PackedUserOperationStructOutput = [
    string,
    BigNumber,
    string,
    string,
    string,
    BigNumber,
    string,
    string,
    string
] & {
    sender: string;
    nonce: BigNumber;
    initCode: string;
    callData: string;
    accountGasLimits: string;
    preVerificationGas: BigNumber;
    gasFees: string;
    paymasterAndData: string;
    signature: string;
};
export interface GetUserOpHashesInterface extends utils.Interface {
    functions: {
        "getUserOpHashes(address,(address,uint256,bytes,bytes,bytes32,uint256,bytes32,bytes,bytes)[])": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "getUserOpHashes"): FunctionFragment;
    encodeFunctionData(functionFragment: "getUserOpHashes", values: [PromiseOrValue<string>, PackedUserOperationStruct[]]): string;
    decodeFunctionResult(functionFragment: "getUserOpHashes", data: BytesLike): Result;
    events: {};
}
export interface GetUserOpHashes extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: GetUserOpHashesInterface;
    queryFilter<TEvent extends TypedEvent>(event: TypedEventFilter<TEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TEvent>>;
    listeners<TEvent extends TypedEvent>(eventFilter?: TypedEventFilter<TEvent>): Array<TypedListener<TEvent>>;
    listeners(eventName?: string): Array<Listener>;
    removeAllListeners<TEvent extends TypedEvent>(eventFilter: TypedEventFilter<TEvent>): this;
    removeAllListeners(eventName?: string): this;
    off: OnEvent<this>;
    on: OnEvent<this>;
    once: OnEvent<this>;
    removeListener: OnEvent<this>;
    functions: {
        getUserOpHashes(entryPoint: PromiseOrValue<string>, userOps: PackedUserOperationStruct[], overrides?: CallOverrides): Promise<[string[]] & {
            ret: string[];
        }>;
    };
    getUserOpHashes(entryPoint: PromiseOrValue<string>, userOps: PackedUserOperationStruct[], overrides?: CallOverrides): Promise<string[]>;
    callStatic: {
        getUserOpHashes(entryPoint: PromiseOrValue<string>, userOps: PackedUserOperationStruct[], overrides?: CallOverrides): Promise<string[]>;
    };
    filters: {};
    estimateGas: {
        getUserOpHashes(entryPoint: PromiseOrValue<string>, userOps: PackedUserOperationStruct[], overrides?: CallOverrides): Promise<BigNumber>;
    };
    populateTransaction: {
        getUserOpHashes(entryPoint: PromiseOrValue<string>, userOps: PackedUserOperationStruct[], overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}
