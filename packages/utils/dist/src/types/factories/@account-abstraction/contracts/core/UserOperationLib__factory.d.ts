import { Signer, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../common";
import type { UserOperationLib, UserOperationLibInterface } from "../../../../@account-abstraction/contracts/core/UserOperationLib";
type UserOperationLibConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class UserOperationLib__factory extends ContractFactory {
    constructor(...args: UserOperationLibConstructorParams);
    deploy(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<UserOperationLib>;
    getDeployTransaction(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): TransactionRequest;
    attach(address: string): UserOperationLib;
    connect(signer: Signer): UserOperationLib__factory;
    static readonly bytecode = "0x60a9610039600b82828239805160001a60731461002c57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe730000000000000000000000000000000000000000301460806040526004361060475760003560e01c806325093e1b14604c578063b29a8ff4146065578063ede3150214606c575b600080fd5b6053602481565b60405190815260200160405180910390f35b6053601481565b605360348156fea2646970667358221220da10ce14444097f012d04a4f82de7b5c991303ba177bf40cd1c4fa5d1ab3f13764736f6c63430008170033";
    static readonly abi: readonly [{
        readonly inputs: readonly [];
        readonly name: "PAYMASTER_DATA_OFFSET";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "PAYMASTER_POSTOP_GAS_OFFSET";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "PAYMASTER_VALIDATION_GAS_OFFSET";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }];
    static createInterface(): UserOperationLibInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): UserOperationLib;
}
export {};
