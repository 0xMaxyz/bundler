import { Signer, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../common";
import type { TestTimeRangeAccount, TestTimeRangeAccountInterface } from "../../../../contracts/tests/TestTimeRangeAccount.sol/TestTimeRangeAccount";
type TestTimeRangeAccountConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class TestTimeRangeAccount__factory extends ContractFactory {
    constructor(...args: TestTimeRangeAccountConstructorParams);
    deploy(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<TestTimeRangeAccount>;
    getDeployTransaction(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): TransactionRequest;
    attach(address: string): TestTimeRangeAccount;
    connect(signer: Signer): TestTimeRangeAccount__factory;
    static readonly bytecode = "0x608060405234801561001057600080fd5b5061012d806100206000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c806319822f7c14602d575b600080fd5b603c603836600460a6565b604e565b60405190815260200160405180910390f35b600060a084013560c085013560801c60668382846070565b9695505050505050565b600060d08265ffffffffffff16901b60a08465ffffffffffff16901b8560965760006099565b60015b60ff161717949350505050565b60008060006060848603121560ba57600080fd5b833567ffffffffffffffff81111560d057600080fd5b8401610120818703121560e257600080fd5b9560208501359550604090940135939250505056fea2646970667358221220a5ad9c298e282412a43891da4a406401504c1a1c92cc9094cbac5dbb3474cb7b64736f6c63430008170033";
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly components: readonly [{
                readonly internalType: "address";
                readonly name: "sender";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "nonce";
                readonly type: "uint256";
            }, {
                readonly internalType: "bytes";
                readonly name: "initCode";
                readonly type: "bytes";
            }, {
                readonly internalType: "bytes";
                readonly name: "callData";
                readonly type: "bytes";
            }, {
                readonly internalType: "bytes32";
                readonly name: "accountGasLimits";
                readonly type: "bytes32";
            }, {
                readonly internalType: "uint256";
                readonly name: "preVerificationGas";
                readonly type: "uint256";
            }, {
                readonly internalType: "bytes32";
                readonly name: "gasFees";
                readonly type: "bytes32";
            }, {
                readonly internalType: "bytes";
                readonly name: "paymasterAndData";
                readonly type: "bytes";
            }, {
                readonly internalType: "bytes";
                readonly name: "signature";
                readonly type: "bytes";
            }];
            readonly internalType: "struct PackedUserOperation";
            readonly name: "userOp";
            readonly type: "tuple";
        }, {
            readonly internalType: "bytes32";
            readonly name: "";
            readonly type: "bytes32";
        }, {
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly name: "validateUserOp";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }];
    static createInterface(): TestTimeRangeAccountInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): TestTimeRangeAccount;
}
export {};
