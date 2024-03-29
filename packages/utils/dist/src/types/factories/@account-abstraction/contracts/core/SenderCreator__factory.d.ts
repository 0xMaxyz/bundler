import { Signer, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../common";
import type { SenderCreator, SenderCreatorInterface } from "../../../../@account-abstraction/contracts/core/SenderCreator";
type SenderCreatorConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class SenderCreator__factory extends ContractFactory {
    constructor(...args: SenderCreatorConstructorParams);
    deploy(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<SenderCreator>;
    getDeployTransaction(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): TransactionRequest;
    attach(address: string): SenderCreator;
    connect(signer: Signer): SenderCreator__factory;
    static readonly bytecode = "0x608060405234801561001057600080fd5b506101f3806100206000396000f3fe608060405234801561001057600080fd5b506004361061002b5760003560e01c8063570e1a3614610030575b600080fd5b61004361003e3660046100ec565b61005f565b6040516001600160a01b03909116815260200160405180910390f35b60008061006f601482858761015e565b61007891610188565b60601c9050600061008c846014818861015e565b8080601f016020809104026020016040519081016040528093929190818152602001838380828437600092018290525084519495509360209350849250905082850182875af190506000519350806100e357600093505b50505092915050565b600080602083850312156100ff57600080fd5b823567ffffffffffffffff8082111561011757600080fd5b818501915085601f83011261012b57600080fd5b81358181111561013a57600080fd5b86602082850101111561014c57600080fd5b60209290920196919550909350505050565b6000808585111561016e57600080fd5b8386111561017b57600080fd5b5050820193919092039150565b6bffffffffffffffffffffffff1981358181169160148510156101b55780818660140360031b1b83161692505b50509291505056fea2646970667358221220286cc5e21c5986530d75d7dbc0124dd3c8d0f3fd577429cbe27cd6500952861964736f6c63430008170033";
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "bytes";
            readonly name: "initCode";
            readonly type: "bytes";
        }];
        readonly name: "createSender";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "sender";
            readonly type: "address";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }];
    static createInterface(): SenderCreatorInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): SenderCreator;
}
export {};
