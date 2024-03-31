import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "../../../common";
export interface SmartAccountFactoryInterface extends utils.Interface {
    functions: {
        "accountImplementation()": FunctionFragment;
        "changeOwner(uint256,bytes,bytes,bytes,bytes32)": FunctionFragment;
        "changeOwner(uint256,bytes)": FunctionFragment;
        "createAccount(address,uint256)": FunctionFragment;
        "getAddress(uint256)": FunctionFragment;
        "ownerOf(uint256)": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "accountImplementation" | "changeOwner(uint256,bytes,bytes,bytes,bytes32)" | "changeOwner(uint256,bytes)" | "createAccount" | "getAddress" | "ownerOf"): FunctionFragment;
    encodeFunctionData(functionFragment: "accountImplementation", values?: undefined): string;
    encodeFunctionData(functionFragment: "changeOwner(uint256,bytes,bytes,bytes,bytes32)", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: "changeOwner(uint256,bytes)", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "createAccount", values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "getAddress", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "ownerOf", values: [PromiseOrValue<BigNumberish>]): string;
    decodeFunctionResult(functionFragment: "accountImplementation", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "changeOwner(uint256,bytes,bytes,bytes,bytes32)", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "changeOwner(uint256,bytes)", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "createAccount", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getAddress", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "ownerOf", data: BytesLike): Result;
    events: {};
}
export interface SmartAccountFactory extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: SmartAccountFactoryInterface;
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
        accountImplementation(overrides?: CallOverrides): Promise<[string]>;
        "changeOwner(uint256,bytes,bytes,bytes,bytes32)"(_name: PromiseOrValue<BigNumberish>, _header: PromiseOrValue<BytesLike>, _payload: PromiseOrValue<BytesLike>, _signature: PromiseOrValue<BytesLike>, _digest: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        "changeOwner(uint256,bytes)"(name: PromiseOrValue<BigNumberish>, _token: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        createAccount(owner: PromiseOrValue<string>, name: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        getAddress(name: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string]>;
        ownerOf(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string]>;
    };
    accountImplementation(overrides?: CallOverrides): Promise<string>;
    "changeOwner(uint256,bytes,bytes,bytes,bytes32)"(_name: PromiseOrValue<BigNumberish>, _header: PromiseOrValue<BytesLike>, _payload: PromiseOrValue<BytesLike>, _signature: PromiseOrValue<BytesLike>, _digest: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    "changeOwner(uint256,bytes)"(name: PromiseOrValue<BigNumberish>, _token: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    createAccount(owner: PromiseOrValue<string>, name: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    getAddress(name: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    ownerOf(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    callStatic: {
        accountImplementation(overrides?: CallOverrides): Promise<string>;
        "changeOwner(uint256,bytes,bytes,bytes,bytes32)"(_name: PromiseOrValue<BigNumberish>, _header: PromiseOrValue<BytesLike>, _payload: PromiseOrValue<BytesLike>, _signature: PromiseOrValue<BytesLike>, _digest: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        "changeOwner(uint256,bytes)"(name: PromiseOrValue<BigNumberish>, _token: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        createAccount(owner: PromiseOrValue<string>, name: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        getAddress(name: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        ownerOf(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    };
    filters: {};
    estimateGas: {
        accountImplementation(overrides?: CallOverrides): Promise<BigNumber>;
        "changeOwner(uint256,bytes,bytes,bytes,bytes32)"(_name: PromiseOrValue<BigNumberish>, _header: PromiseOrValue<BytesLike>, _payload: PromiseOrValue<BytesLike>, _signature: PromiseOrValue<BytesLike>, _digest: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        "changeOwner(uint256,bytes)"(name: PromiseOrValue<BigNumberish>, _token: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        createAccount(owner: PromiseOrValue<string>, name: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        getAddress(name: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        ownerOf(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
    };
    populateTransaction: {
        accountImplementation(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        "changeOwner(uint256,bytes,bytes,bytes,bytes32)"(_name: PromiseOrValue<BigNumberish>, _header: PromiseOrValue<BytesLike>, _payload: PromiseOrValue<BytesLike>, _signature: PromiseOrValue<BytesLike>, _digest: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        "changeOwner(uint256,bytes)"(name: PromiseOrValue<BigNumberish>, _token: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        createAccount(owner: PromiseOrValue<string>, name: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        getAddress(name: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        ownerOf(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}
